package com.precash.opp.server.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.html.WebColors;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.precash.common.Base64;
import com.precash.mobilewallet.api.ApiPaths;
import com.precash.mobilewallet.domain.billpay.CartReceiptRequest;
import com.precash.mobilewallet.domain.fundingsource.FundingSourceResponse;
import com.precash.mobilewallet.domain.fundingsource.ReturnedFundingSourceResponse;
import com.precash.mobilewallet.domain.fundingsource.VestaFundingSourceResponse;
import com.precash.mobilewallet.domain.paycard.CardBrand;
import com.precash.mobilewallet.domain.receipt.CartReceiptResponse;
import com.precash.mobilewallet.domain.receipt.ReturnReceiptItem;
import com.precash.mobilewallet.domain.receipt.SubmittedBill;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.net.ssl.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.cert.CertificateException;
import java.text.MessageFormat;
import java.text.ParseException;
import java.util.*;
import java.util.List;

/**
 * Servlet that generates the PDF detailed receipt.
 */
public class PdfServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static transient final Log LOGGER = LogFactory.getLog(PdfServlet.class);
    private static final String OPP_BUNDLE_NAME = "oppGwt";

    /* font color */
    private static final String WHITE_COLOR = "#ffffff";
    private static final String GRAY_COLOR = "#dddddd";
    private static final String RED_COLOR = "#FF0000";
    private static final String GREEN_COLOR = "#08b331";
    private static final String BLACK_COLOR = "#000000";

    /* font Size */
    private static final float FONT_SIZE_9 = 9;
    private static final float FONT_SIZE_10 = 10;
    private static final float FONT_SIZE_12 = 12;
    private static final float FONT_SIZE_14 = 14;
    private static final float FONT_SIZE_18 = 18;
    private static final ResourceBundle APP_CONFIG_BUNDLE = ResourceBundle.getBundle("oppConfig");


    private interface PdfConstants {
        String SAVE = "SAVE";
        String REJECTED = "REJECTED";
        String SCHEDULED_POSTING_CATEGORY_CHANGED = "SCHEDULED_POSTING_CATEGORY_CHANGED";
        String SCHEDULED_INVALID_PAYMENT_AMOUNT = "SCHEDULED_INVALID_PAYMENT_AMOUNT";
        String SCHEDULED_VELOCITY_LIMIT_EXCEEDED = "SCHEDULED_VELOCITY_LIMIT_EXCEEDED";
        String SCHEDULED_PAYMENT_CARD_FAILED = "SCHEDULED_PAYMENT_CARD_FAILED";
        String SCHEDULED_PROGRAM_ENDED = "SCHEDULED_PROGRAM_ENDED";
        String SCHEDULED_NOT_AUTHED = "SCHEDULED_NOT_AUTHED";
        String SCHEDULED_POSTING_WINDOW_EXPIRED = "SCHEDULED_POSTING_WINDOW_EXPIRED";
        String SCHEDULED_BAN_VELOCITY_LIMIT_EXCEEDED = "SCHEDULED_BAN_VELOCITY_LIMIT_EXCEEDED";
        String SCHEDULED_CANCELLED_CARD_NO_LONGER_AVAILABLE = "SCHEDULED_CANCELLED_CARD_NO_LONGER_AVAILABLE";
        String RETURN_PENDING = "RETURN_PENDING";
        String RETURNED = "RETURNED";
        String PENDING = "PENDING";
        String SCHEDULED_PENDING = "SCHEDULED_PENDING";
        String SCHEDULED_PROCESSING = "SCHEDULED_PROCESSING";
        String IN_PROCESS = "IN_PROCESS";
        String PAID = "PAID";
        String PROMO_CREDIT = "PromoCredit";
        String BLACKHAWK = "Blackhawk";
        String PRECASH = "PreCash";
        String INCOMM = "Incomm";
        String CREDIT = "CREDIT";
        String DEBIT = "DEBIT";
        String MC = "MC";
        String VS = "VS";
        String DS = "DS";
    }


    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        /* Call navigation to doGet method */
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String[] requestParameters = decodeRequest(request.getParameter("apiEncodedRequest"));
        if (requestParameters.length < 6) {/* request doesn't have required info then render an error on screen */
            Locale localeObj = request.getLocale();

             /* Send Error Response.  */
            response.reset();
            response.setContentType("text/plain");
            request.setAttribute("customErrorMessage", getMessage(localeObj, "pdf.receipt.servletErrorMessage"));
            response.sendError(HttpServletResponse.SC_NOT_FOUND,
                               getMessage(localeObj, "pdf.receipt.servletErrorMessage"));
            return;
        }
        
        /* request have valid data then retrieving request object info */
        String applicationId = requestParameters[1];
        String localeParam = requestParameters[2];
        LOGGER.debug("localeParam =" + localeParam + " \t applicationId =" + applicationId);
        String[] locale = localeParam.split("_");
        Locale localeObj = new Locale(locale[0], locale[1], applicationId);

        CartReceiptRequest receiptRequest;
        try {
            receiptRequest = buildRequestFromParameters(requestParameters);
        } catch (final ParseException e) {
            LOGGER.error("trouble while building request", e);
                         /* Send Error Response.  */
            response.reset();
            response.setContentType("text/plain");
            request.setAttribute("customErrorMessage", getMessage(localeObj, "pdf.receipt.servletErrorMessage"));
            response.sendError(HttpServletResponse.SC_NOT_FOUND,
                               getMessage(localeObj, "pdf.receipt.servletErrorMessage"));
            return;
        }

		/* passing constructed receipt request to RECEIPT - RE PRINT API */
        CartReceiptResponse receiptResponse = executeReceiptApi(receiptRequest);
        
        /* In case RECEIPT - RE PRINT API responds with wrong info then suspending method call */
        suspendOnNullResponse(receiptResponse, response, request, localeObj);

        if (null != receiptResponse) {
            boolean isSave = PdfConstants.SAVE.equals(request.getParameter("pdfAction"));
            setResponseHeaders(response, isSave);
            try {
                createPdf(receiptResponse, response, localeObj);/* Calling createPdf to design PDF receipt using response */
            } catch (final DocumentException e) {
                LOGGER.error("trouble while creating PDF", e);
            }
        } else {
            LOGGER.warn("the receipt response was null: requestParameters=" + Arrays.toString(requestParameters));
            response.sendRedirect(request.getContextPath());
        }
    }

    /**
     * This method is used to construct the request for the CART_RECEIPT_REPRINT.
     *
     * @param requestParameters String type array contains request attributes.
     * @return <code>CartReceiptRequest</code> Returns constructed request of CART_RECEIPT_REQUEST API.
     * @throws ParseException
     */
    private CartReceiptRequest buildRequestFromParameters(String[] requestParameters) throws ParseException {
        CartReceiptRequest receiptRequest = new CartReceiptRequest();
        LOGGER.debug("localeParam =" + requestParameters[2] + " \t applicationId =" + requestParameters[1]);
        /* Building request for the Reprint API */
        receiptRequest.setUserId(Long.valueOf(requestParameters[0]));
        receiptRequest.setApplicationId(Long.valueOf(requestParameters[1]));
        receiptRequest.setLocale(requestParameters[2]);
        receiptRequest.setCartId(Long.valueOf(requestParameters[3]));
        Long milliSeconds = Long.parseLong(requestParameters[4]);
        Date date = new Date(milliSeconds);
        receiptRequest.setCartDate(date);
        /* Returning constructed API request*/
        return receiptRequest;
    }

    /**
     * This method is used to call the CART_RECEIPT_REPRINT API using constructed request.
     *
     * @param receiptRequest Passing constructed request for API.
     * @return <code>CartReceiptResponse</code> Returns CART_RECEIPT_REPRINT API response after calling API.
     */
    private CartReceiptResponse executeReceiptApi(final CartReceiptRequest receiptRequest) {
        CartReceiptResponse receiptResponse = null;
        HttpURLConnection conn = null;
        InputStreamReader inputStreamReader = null;
        BufferedReader reader = null;
        InputStream inputStream = null;
        try {
            ObjectMapper mapper = new ObjectMapper();/* Set request object in to jackson object */
            String requestJson = mapper.writeValueAsString(receiptRequest);

            String mobileApiServiceBaseUrl = APP_CONFIG_BUNDLE.getString("pdf.mobileApiBaseUrl");
            /* Constructing URL for the RE - PRINT API call */
            String apiUrl = mobileApiServiceBaseUrl + "/api" + ApiPaths.BP_PUBLIC_BASE +
                    ApiPaths.BP_CART_RECEIPT_REPRINT_3_2_3;
            URL url = new URL(apiUrl);/* String type URL passed to URL class constructor */
            LOGGER.debug("Api url :: " + url);
            conn = (HttpURLConnection) url.openConnection();/* connection opened */
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            /* Created an object for the OutputStream and write byte information */
            OutputStream os = conn.getOutputStream();
            os.write(requestJson.getBytes());
            os.flush();

			/* error from server */
            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                LOGGER.warn("unable to call API to get data to render the PDF: responseCode=" + responseCode
                                    + ", url=" + apiUrl
                                    + ", request=" + requestJson);
                inputStream = conn.getErrorStream();
                if (null == inputStream) {
                    inputStream = conn.getInputStream();
                }
            } else {
                inputStream = conn.getInputStream();
            }

            inputStreamReader = new InputStreamReader(inputStream);
            reader = new BufferedReader(inputStreamReader);
            String output;
            StringBuilder apiResponse = new StringBuilder();
            while ((output = reader.readLine()) != null) {
                apiResponse.append(output);
            }
            if (responseCode != 200) {
                LOGGER.warn("apiResponse=" + apiResponse);
            } else {
                LOGGER.debug("apiResponse=" + apiResponse);
            }
            String responseJson = apiResponse.toString();
            System.out.println("response :" + apiResponse);
            /* De serializing jackSon object in to CartReceiptResponse*/
            receiptResponse = mapper.readValue(responseJson, CartReceiptResponse.class);

        } catch (final Throwable e) {
            LOGGER.error("trouble executing the receipt api: receiptRequest=" + receiptRequest, e);
            return null;
        } finally {
            try {
                if (null != conn) {
                    conn.disconnect();
                }
            } catch (final Throwable e) {
                LOGGER.error("trouble disconnecting", e);
            } finally {
                try {
                    if (null != reader) {
                        reader.close();
                    }
                } catch (final Throwable e) {
                    LOGGER.error("trouble closing reader", e);
                } finally {
                    try {
                        if (null != inputStream) {
                            inputStream.close();
                        }
                    } catch (final Throwable e) {
                        LOGGER.error("trouble closing inputStream", e);
                    } finally {
                        try {
                            if (null != inputStreamReader) {
                                inputStreamReader.close();
                            }
                        } catch (final Throwable e) {
                            LOGGER.error("trouble closing inputStreamReader", e);
                        }
                    }
                }
            }
        }
        return receiptResponse;
    }

    /**
     * This method is to suspend generating PDF due to response null.
     *
     * @param receiptResponse CRT_REECIPT_REPRINT API response to check for null.
     * @param response        HttPServletResponse object.
     * @param request         HttpServletRequest object.
     * @param localeObj       Locale object contains resource bundle information.
     */
    private void suspendOnNullResponse(CartReceiptResponse receiptResponse, HttpServletResponse response,
                                       HttpServletRequest request, Locale localeObj) throws IOException {

    	/* If response contains null info then render error message on screen */
        if (null == receiptResponse || null != receiptResponse.getErrorCode() ||
                null != receiptResponse.getErrorMessage()) {
            String errorMessage = "";
            if (null != receiptResponse) {
                errorMessage = receiptResponse.getErrorMessage();
                LOGGER.debug("errorMessage : " + receiptResponse.getErrorMessage());
            }
            response.reset();
            response.setContentType("text/plain");
            request.setAttribute("customErrorMessage", getMessage(localeObj, "pdf.receipt.servletErrorMessage"));
            String message = getMessage(localeObj, "pdf.receipt.servletErrorMessage", errorMessage);
            response.sendError(HttpServletResponse.SC_NOT_FOUND,
                               message);
        }
    }

    /**
     * This method is used to set headers to response while generating PDF.
     *
     * @param response HttpServletResponse object.
     * @param isSave   If the action is SAVE then TRUE otherwise false.
     */
    private void setResponseHeaders(final HttpServletResponse response, final boolean isSave) {
        /*  Browser will open the document only if this is set  */
        LOGGER.debug("Inside response headers");
        response.reset();
        response.setHeader("Expires", "0");
        response.setHeader("Cache-Control", "must-revalidate, post-check=0,pre-check=0");
        response.setHeader("Pragma", "public");
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0
        response.setDateHeader("Expires", 0); /* prevents caching at the proxy  */
        response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
        response.setHeader("Cache-Control", "max-age=0");

        if (isSave) {
            response.setHeader("Content-Disposition", "attachment; filename=paymentReceipt.pdf");
        } else {
            response.setHeader("Content-disposition", "inline; filename=paymentReceipt.pdf");
        }
            /* Set content type to application / pdf  */
        response.setContentType("application/pdf");
    }


    /**
     * This method is used to create PDF by using CART_RECEIPT_REPRINT API response.
     *
     * @param receiptResponse CART_RECEIPT_REPRINT response object for creating PDF.
     * @param response        HttpServletResponse object to generate document.
     * @param localeObj       Locale object contains resource bundle information.
     * @throws DocumentException
     * @throws IOException
     */
    private void createPdf(CartReceiptResponse receiptResponse, HttpServletResponse response, Locale localeObj)
            throws DocumentException, IOException {
        /* Get the output stream for writing PDF object */
        final OutputStream out = response.getOutputStream();
        Document document = new Document();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

		/*  Start Add Image */ 
        /* add Logo image based on application id Getting Image path from Resource bundle*/
        final String logoFileClasspath = getMessage(localeObj, "pdf.receipt.logoImageUrl");
        URL path = PdfServlet.class.getClassLoader().getResource(logoFileClasspath);
        if (null == path) {
            throw new FileNotFoundException("unable to find logoImage in classpath: " + logoFileClasspath);
        }
        Image logoImage = Image.getInstance(path);

		/* Start of Bill Submit Section */
        PdfPTable logoImageTable = new PdfPTable(1);/* Table for the Logo Image */
        /* Logo added to PDF cell constructor */
        PdfPCell logoImageCell = new PdfPCell(logoImage);
        PdfPCell logoBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(logoImageCell, Element.ALIGN_CENTER, "", 0);
        cellAddingToTable(logoImageTable, logoImageCell, Rectangle.LEFT | Rectangle.TOP | Rectangle.RIGHT, 0, 0);

        cellAlignment(logoImageCell, Element.ALIGN_LEFT, "", 0);
        cellAddingToTable(logoImageTable, logoBlankSpaceCell, Rectangle.LEFT | Rectangle.RIGHT, 0, 0);
        document.add(logoImageTable);
        /* End Add Logo Image */ 

		/* create PDF header section */
        pdfReceiptIdSection(receiptResponse, document, localeObj);
        /* Designing bill transaction information to show biller name and amount*/
        designBillTransactionInfo(receiptResponse, document, localeObj);
        /* create payment method section */
        pdfPaymentMethod(receiptResponse, document, localeObj);
        /* Appending line below the document */
        pdfInfoMessage(document, localeObj);
        /* New page creating for merging existing PdF page in to current PDF */
        document.newPage();
        try {
            getPdfFromAwsLink(writer, localeObj);/* Call to merge existing PDF to current PDf */
        } catch (final Exception e) {
            LOGGER.error("trouble while merging PDF disclosure", e);
        }
        document.close();
        LOGGER.debug("End PDF Created ");
    }

    /**
     * This method is used to merge existing PDF in to current generated PDF.
     *
     * @param writer the writer object used for writing byte information in to PdfContentByte object.
     * @param locale Locale object contains resource bundle information.
     * @throws Exception
     */
    private void getPdfFromAwsLink(PdfWriter writer, Locale locale) throws Exception {
        final String disclosureFileClasspath = getMessage(locale, "pdf.receipt.disclosure.classpath");
        InputStream file = PdfServlet.class.getClassLoader().getResourceAsStream(disclosureFileClasspath);

        PdfReader reader = new PdfReader(file);
        PdfContentByte cb = writer.getDirectContent();
        int pageOfCurrentReaderPDF = 0;
        while (pageOfCurrentReaderPDF < reader.getNumberOfPages()) {
            pageOfCurrentReaderPDF++;
            PdfImportedPage page = writer.getImportedPage(reader, pageOfCurrentReaderPDF);
            cb.addTemplate(page, 0, 0);
        }
    }

    /**
     * This method is used to define the Receipt id section on top of receipt.
     *
     * @param receiptResponse The API response received after CART_RECEIPT_REPRINT API call.
     * @param document        The document object used to draw the PDF.
     * @param locale          Locale object contains resource bundle information.
     */
    private void pdfReceiptIdSection(final CartReceiptResponse receiptResponse, final Document document, Locale locale)
            throws DocumentException, IOException {

        LOGGER.debug("pdfReceiptIdSection(HttpServletRequest,HttpServletResponse,ResourceBundle)" + receiptResponse);

		/* Payment Receipt Title code snippet Start */
        PdfPTable receiptHeaderTextTable = new PdfPTable(4);
        String message = getMessage(locale, "pdf.receipt.receipt_title");
        Font font = getFont(WHITE_COLOR, FONT_SIZE_18, Font.BOLD);
        PdfPCell receiptTextCell = new PdfPCell(new Phrase(message, font));
        cellAlignment(receiptTextCell, Element.ALIGN_CENTER, WHITE_COLOR, 0);
        cellAddingToTable(receiptHeaderTextTable, receiptTextCell, Rectangle.LEFT | Rectangle.RIGHT, 4, 0);
        document.add(receiptHeaderTextTable);
        PdfPCell headerBlankSpaceCell1 = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));

        PdfPTable receiptTable = new PdfPTable(2);

        cellAlignment(headerBlankSpaceCell1, 0, "", 0);
        cellAddingToTable(receiptTable, headerBlankSpaceCell1, Rectangle.LEFT | Rectangle.RIGHT, 2, 0);
        PdfPCell receiptNumberCell;
        String receiptNumberMessage = getMessage(locale, "pdf.receipt.receipt_number"
                , Long.toString(receiptResponse.getCartId()));
        Font boldFont = getFont(WHITE_COLOR, FONT_SIZE_12, Font.BOLD);
        receiptNumberCell = new PdfPCell(new Phrase(receiptNumberMessage, boldFont));

		/* PDF receipt Id section starts */
        cellAlignment(receiptNumberCell, Element.ALIGN_CENTER, WHITE_COLOR, 0);
        cellAddingToTable(receiptTable, receiptNumberCell, Rectangle.LEFT | Rectangle.RIGHT, 2, 0);
        /* PDF receipt Id section Ends */

		/* Blank Space Start */
        PdfPCell headerBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(headerBlankSpaceCell, 0, WHITE_COLOR, 0);
        cellAddingToTable(receiptTable, headerBlankSpaceCell, Rectangle.LEFT | Rectangle.RIGHT | Rectangle.BOTTOM, 2,
                          0);
        /* End Blank Space */

		/* Adding Complete structure to document */
        document.add(receiptTable);
        document.add(new Paragraph(" "));
        LOGGER.debug("End pdfReceiptIdSection(HttpServletRequest,HttpServletResponse,ResourceBundle)");
    }

    /**
     * This method is used to adding PDFCell object to table to design PDF.
     *
     * @param pdfPTable The PDFTable object used to draw the table structure in PDF.
     * @param cell      The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param border    Border is nothing but  LEFT, RIGHT, TOP, BOTTOM.
     * @param colSpan   Column span can be defined how much of span it have.
     * @param pad       Cell padding and how much padding can have left or right.
     */
    private void cellAddingToTable(final PdfPTable pdfPTable, final PdfPCell cell, final int border
            , final int colSpan, final int pad) {
        cell.setPaddingLeft(pad);
        cell.setBorder(border);
        cell.setColspan(colSpan);
        pdfPTable.addCell(cell);
    }

    /**
     * @param cell  The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param left  This left can have cell alignment of horizontal.
     * @param color This can have color which will display on PDF table.
     * @param top   Top can place cell TOP / BOTTOM / MIDDLE.
     */
    private void cellAlignment(PdfPCell cell, int left, String color, int top) {
        cell.setHorizontalAlignment(left);
        cell.setVerticalAlignment(top);
        setCellBackgroundColor(cell, color);
    }

    /**
     * This method is used to design the biller transaction information on PDF.
     *
     * @param receiptResponse CART_RECEIT_REPRINT API Response to draw.
     * @param document        The document object used to draw the PDF.
     * @param locale          Locale object contains resource bundle information.
     */
    private void designBillTransactionInfo(CartReceiptResponse receiptResponse, final Document document, Locale locale)
            throws DocumentException, IOException {
        LOGGER.debug("Entered in designBillTransactionInfo() method");
        SubmittedBill[] submittedBills = receiptResponse.getSubmittedBills();
        /* Start of Bill Submit Section */
        PdfPTable paymentSectionTable = new PdfPTable(3);
        paymentSectionTable.setWidths(new int[]{50, 150, 50});
        PdfPCell paymentSectionBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        BigDecimal totalBillAmount = new BigDecimal(0);
        BigDecimal totalFeeAmount = new BigDecimal(0);
        Boolean flag = true;

        if (submittedBills != null && receiptResponse.getReturnedItems().length != 0) {
            returnPaymentHeading(locale, paymentSectionTable);
            for (final SubmittedBill submittedBill : submittedBills) {
                final ReturnReceiptItem[] returnReceiptItems = receiptResponse.getReturnedItems();
                for (final ReturnReceiptItem returnReceiptItem : returnReceiptItems) {
                    long cartId = returnReceiptItem.getCartItemId();
                    if (cartId == submittedBill.getId() &&
                            submittedBill.getStatus().name().equalsIgnoreCase(PdfConstants.RETURNED)) {
                        designReturnHeaderBillSection(submittedBill,
                                                      returnReceiptItem,
                                                      locale,
                                                      paymentSectionTable,
                                                      paymentSectionBlankSpaceCell, receiptResponse);
                    }
                }
            }
        }

        if (submittedBills != null) {
            for (final SubmittedBill submittedBill : submittedBills) {
                BigDecimal transactionFee = new BigDecimal(0);
                if (submittedBill.getFee() != null) {
                    transactionFee = submittedBill.getFee();
                }
                if (flag.equals(true)) {
                    setTableForCells(paymentSectionTable, locale);
                    cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, WHITE_COLOR, 0);
                    cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
                    flag = false;
                }

				/* Paid Biller Details Start */
                if (getStatusForPaid(submittedBill.getStatus().name())) {
                    designSubmittedBillsSection(submittedBill, locale, paymentSectionTable);
                    totalBillAmount = totalBillAmount.add(submittedBill.getAmount());
                    totalFeeAmount = totalFeeAmount.add(transactionFee);
                }
                /* End Paid Biller Details */

				/* Failed Biller Details Start */
                if (getStatusForRejected(submittedBill.getStatus().name())) {
                    LOGGER.debug("Enterd in to REJECTED Related section after checking all status");
                    designFailedBillsSection(locale, paymentSectionTable,
                                             submittedBill);
                }
                /* End Failed Biller Details */

                if (submittedBill.getStatus().name().equalsIgnoreCase(PdfConstants.RETURNED)) {
                    LOGGER.debug("Enterd in to RETURNED Related section after checking all status");
                    designReturnedBillsSection(locale, paymentSectionTable, paymentSectionBlankSpaceCell,
                                               submittedBill);
                    totalBillAmount = totalBillAmount.add(submittedBill.getAmount());
                    totalFeeAmount = totalFeeAmount.add(transactionFee);
                }
            }
        }

		/* add blank Space Start */
        cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, WHITE_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        /* add blank space end */

		/* Calculating and displaying card service fee amount and service fee percent*/
        totalBillAmount = totalBillAmount.add(getCardServiceFeeAmount(receiptResponse, paymentSectionTable
                , paymentSectionBlankSpaceCell, locale));
		/* End of Card service fee */

		/* bill Total Paid start */
        drawTotalAmountCell(paymentSectionTable, paymentSectionBlankSpaceCell, locale, totalBillAmount, totalFeeAmount);
        /* bill Total Paid End */
        /* Add Line separator to the PDF document */
        addLineSeperator(paymentSectionTable, paymentSectionBlankSpaceCell);
        /* End of line separator */

        document.add(paymentSectionTable);
        LOGGER.debug("End pdfPaymentSection Table ");


    }

    /**
     * This method is used to show the heading when there is nay RETURN payment heading.
     *
     * @param paymentSectionTable This is Table and we will add cells in to this for PDF document.
     */
    private void returnPaymentHeading(final Locale locale, final PdfPTable paymentSectionTable) {
        String message = getMessage(locale, "pdf.receipt.return.afterSubmitted");
        Font font = getFont(null, FONT_SIZE_12, Font.BOLD);
        PdfPCell returnHeaderCell = new PdfPCell(new Phrase(message, font));
        cellAlignment(returnHeaderCell, Element.ALIGN_LEFT, WHITE_COLOR, 0);
        cellAddingToTable(paymentSectionTable, returnHeaderCell, Rectangle.NO_BORDER, 2, 0);

        PdfPCell paymentSectionBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);

    }

    /**
     * This method is used to add the separator between the top and bottom group in PDF.
     *
     * @param paymentSectionTable Table object is passed to add the line separator to document.
     */
    private void addLineSeperator(final PdfPTable paymentSectionTable, final PdfPCell paymentSectionBlankSpaceCell) {
        LineSeparator line = new LineSeparator(1, 100, null, Element.ALIGN_CENTER, -2);
        PdfPCell horizontalLineCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(horizontalLineCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        horizontalLineCell.addElement(line);
        cellAddingToTable(paymentSectionTable, horizontalLineCell, Rectangle.NO_BORDER, 3, 0);
        cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, WHITE_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to draw the total amount cell for the document table.
     *
     * @param paymentSectionTable          The PDFTable object used to draw the table structure in PDF.
     * @param paymentSectionBlankSpaceCell The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param locale                       Locale object contains resource bundle information.
     * @param totalBillAmount              Bill amount of all the transactions.
     * @param totalFeeAmount               Fee amount of the all the transactions.
     */
    private void drawTotalAmountCell(PdfPTable paymentSectionTable, PdfPCell paymentSectionBlankSpaceCell,
                                     Locale locale,
                                     BigDecimal totalBillAmount, BigDecimal totalFeeAmount) {
        PdfPCell totalPaidLabelCell =
                new PdfPCell(new Phrase(getMessage(locale, "pdf.receipt.totalPaid"), getFont(null, FONT_SIZE_14
                        , Font.BOLD)));
        totalPaidLabelCell.setPaddingBottom(6f);
        PdfPCell totalPaidAmountCell = new PdfPCell(new Phrase(getFormattedAmount(totalBillAmount.add(totalFeeAmount)),
                                                               getFont(null, FONT_SIZE_14, Font.BOLD)));
        totalPaidAmountCell.setPaddingBottom(6f);
        cellAlignment(totalPaidLabelCell, Element.ALIGN_LEFT, WHITE_COLOR, 0);
        cellAddingToTable(paymentSectionTable, totalPaidLabelCell, Rectangle.NO_BORDER, 2, 0);

        cellAlignment(totalPaidAmountCell, Element.ALIGN_RIGHT, WHITE_COLOR, 0);
        cellAddingToTable(paymentSectionTable, totalPaidAmountCell, Rectangle.NO_BORDER, 0, 0);

        cellAlignment(paymentSectionBlankSpaceCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used draw the RETURN PAYMENT header section to display biller and funding info.
     *
     * @param submittedBills               This object is used to get the biller information.
     * @param returnReceiptItems           This object is used to get the RETURN PAYMENT information.
     * @param locale                       Locale object contains resource bundle information.
     * @param paymentSectionTable          The PDFTable object used to draw the table structure in PDF.
     * @param paymentSectionBlankSpaceCell The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param receiptResponse              CART_RECEIPT_REPRINT response is used to design return payment biller info.
     */
    private void designReturnHeaderBillSection(final SubmittedBill submittedBills,
                                               final ReturnReceiptItem returnReceiptItems,
                                               Locale locale, PdfPTable paymentSectionTable,
                                               PdfPCell paymentSectionBlankSpaceCell,
                                               CartReceiptResponse receiptResponse)
            throws BadElementException, IOException {
        LOGGER.info("Inside designReturnBillSection section");
        drawReturnPayemntHeader(paymentSectionTable, locale, submittedBills);
        ReturnedFundingSourceResponse[] returnedFundingSourceResponses = returnReceiptItems.getFundingSources();
        FundingSourceResponse[] fundingSource = receiptResponse.getFundingSources();
        BigDecimal returnCredits = returnReceiptItems.getCreditsGenerated();
        Date date = returnReceiptItems.getReturnDate();
        for (final FundingSourceResponse aFundingSource : fundingSource) {
            if (aFundingSource instanceof VestaFundingSourceResponse) {
                VestaFundingSourceResponse vestaFundingSourceResponse =
                        (VestaFundingSourceResponse) aFundingSource;
                Long fundingId = vestaFundingSourceResponse.getId();
                for (final ReturnedFundingSourceResponse returnedFundingSourceResponse : returnedFundingSourceResponses) {
                    if (returnedFundingSourceResponse.getId().longValue() == fundingId) {
                        CardBrand cardBrand = vestaFundingSourceResponse.getCardBrand();
                        String tenderType = vestaFundingSourceResponse.getTenderType();
                        if (tenderType.equalsIgnoreCase("DEBIT") || tenderType.equalsIgnoreCase("CREDIT")) {
                            PdfPCell cardNumberCell =
                                    new PdfPCell(new Phrase(getMessage(locale, "pdf.receipt.cardPinMsg",
                                                                       getTenderTypeForCard(tenderType, locale),
                                                                       getCardBrandText(cardBrand, locale),
                                                                       vestaFundingSourceResponse.getCardLast4()),
                                                            getFont(null, FONT_SIZE_12, Font.NORMAL)));
                            returnCardFundingSourceInfo(paymentSectionTable, cardNumberCell, locale,
                                                        vestaFundingSourceResponse.getAmount(), date);
                        }
                    }
                }
            }
        }

        returnPaymentCredits(paymentSectionTable, returnCredits, locale);
        cellAlignment(paymentSectionBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to draw the RETURN transaction biller information on top of the REECIPT.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param locale              Locale object contains resource bundle information.
     * @param submittedBills      This object is used to get the biller information.
     */
    private void drawReturnPayemntHeader(PdfPTable paymentSectionTable, Locale locale, SubmittedBill submittedBills) {
        PdfPCell paymentSectionBillerCell = new PdfPCell(new Phrase(getBillerName(submittedBills), getFont(RED_COLOR,
                                                                                                           FONT_SIZE_12,
                                                                                                           Font.NORMAL)));
        PdfPCell paymentSectionBillerAamountCell =
                new PdfPCell(new Phrase(getFormattedAmount(submittedBills.getAmount()),
                                        getFont(RED_COLOR, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(paymentSectionBillerCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerCell, Rectangle.NO_BORDER, 2, 0);

        cellAlignment(paymentSectionBillerAamountCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_BOTTOM);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerAamountCell, Rectangle.NO_BORDER, 0, 0);
        PdfPCell paymentSectionBillReturnedCell =
                new PdfPCell(new Phrase(getMessage(locale, "pdf.receipt.fundsReturned"),
                                        getFont(null, FONT_SIZE_10, Font.NORMAL)));
        cellAlignment(paymentSectionBillReturnedCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillReturnedCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to get the DEBIT/CRDIT funding inforamtion for the RETURN Payment.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param cardNumberCell      Contains the Card number information which is used.
     * @param locale              Locale object contains resource bundle information.
     * @param amount              Contains amount which is used in transaction.
     * @param date                Contains RETURNED date when the Payment returned.
     */
    private void returnCardFundingSourceInfo(PdfPTable paymentSectionTable, PdfPCell cardNumberCell, Locale locale
            , BigDecimal amount, Date date) {
        PdfPCell amountSectionCell =
                new PdfPCell(new Phrase(getFormattedAmount(amount), getFont(null, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(cardNumberCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, cardNumberCell, Rectangle.NO_BORDER, 2, 15);

        cellAlignment(amountSectionCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, amountSectionCell, Rectangle.NO_BORDER, 0, 0);
        String message = getMessage(locale, "pdf.receipt.refunded", convertToDate(date.getTime()));
        PdfPCell amountChangedOnCell = new PdfPCell(new Phrase(message, getFont(null, FONT_SIZE_10, Font.ITALIC)));
        cellAlignment(amountChangedOnCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, amountChangedOnCell, Rectangle.NO_BORDER, 3, 15);
        PdfPCell localBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(localBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, localBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to create table under the RETURN payment transaction.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param locale              Locale object contains resource bundle information.
     */
    private void setTableForCells(PdfPTable paymentSectionTable,
                                  Locale locale) {
        final PdfPCell paymentSectionBillSubmittedCell;
        String message = getMessage(locale, "pdf.receipt.billSubmitted");
        Font font = getFont(BLACK_COLOR, FONT_SIZE_18, Font.BOLD);
        paymentSectionBillSubmittedCell = new PdfPCell(new Phrase(message, font));
        cellAlignment(paymentSectionBillSubmittedCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillSubmittedCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to draw the submitted  bills information on PDF.
     *
     * @param submittedBills      This object is used to get the submitted biller information.
     * @param locale              Locale object contains resource bundle information.
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     */
    private void designSubmittedBillsSection(final SubmittedBill submittedBills, Locale locale,
                                             PdfPTable paymentSectionTable)
            throws BadElementException, IOException {
        Date date = submittedBills.getProjectedPostingDate();
        BigDecimal feeAmount = new BigDecimal(0);
		/* Check for null, if fee come as null we are initializing as 0.*/

        if (submittedBills.getFee() != null) {
            feeAmount = submittedBills.getFee();
        }
        String billerName = getBillerName(submittedBills);
        PdfPCell paymentSectionBillerCell =
                new PdfPCell(new Phrase(billerName, getFont(null, FONT_SIZE_12, Font.NORMAL)));
        PdfPCell paymentSectionBillerAmountCell = new PdfPCell(
                new Phrase(getFormattedAmount(submittedBills.getAmount()), getFont(null, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(paymentSectionBillerCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerCell, Rectangle.NO_BORDER, 2, 15);

        cellAlignment(paymentSectionBillerAmountCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_BOTTOM);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerAmountCell, Rectangle.NO_BORDER, 0, 0);

		/* Fee Details Start */
        if (feeAmount.intValue() > 0 && submittedBills.getExpressFlag()) {
            getExpressFeeBlock(paymentSectionTable, locale, feeAmount, GRAY_COLOR);
        }
		/* End Fee Details */ 
		/* Estimated Delivery Start  */
        if (date != null) {
            String message = getMessage(locale, "pdf.receipt.estimatedDate", convertToDate(date.getTime()));
            Font font = getFont(null, FONT_SIZE_10, Font.ITALIC);
            PdfPCell paymentSectionEstimatedDeliveryCell = new PdfPCell(new Phrase(message, font));
            cellAlignment(paymentSectionEstimatedDeliveryCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
            cellAddingToTable(paymentSectionTable, paymentSectionEstimatedDeliveryCell, Rectangle.NO_BORDER, 3, 15);
            PdfPCell localBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
            cellAlignment(localBlankSpaceCell, 0, GRAY_COLOR, 0);
            cellAddingToTable(paymentSectionTable, localBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        }
		/* End Estimated Delivery  */
    }

    /**
     * This method is used to get the Express fee block row on the table.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param locale              Locale object contains resource bundle information.
     * @param feeAmount           Contains Fee amount of the transactions.
     * @param fontColor           Contains font color for the table row.
     */
    private void getExpressFeeBlock(PdfPTable paymentSectionTable, Locale locale, BigDecimal feeAmount,
                                    String fontColor)
            throws BadElementException, IOException {
        String message = getMessage(locale, "pdf.receipt.expressFee");
        Font font = getFont(fontColor, FONT_SIZE_10, Font.ITALIC);
        PdfPCell paymentSectionFeeCell = new PdfPCell(new Phrase(message, font));
        String imagePath = getMessage(locale, "pdf.receipt.expressImage");

        URL path = PdfServlet.class.getClassLoader().getResource(imagePath);
        if (null == path) {
            throw new FileNotFoundException("unable to find expressImage file in classpath: " + imagePath);
        }

        PdfPCell logoImageCell = new PdfPCell(Image.getInstance(path));
        PdfPCell paymentSectionFeeAmountCell =
                new PdfPCell(new Phrase(getFormattedAmount(feeAmount), font));
        paymentSectionFeeAmountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        setCellBackgroundColor(paymentSectionFeeAmountCell, GRAY_COLOR);
        paymentSectionFeeAmountCell.setBorder(Rectangle.NO_BORDER);
        cellAlignment(paymentSectionFeeCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionFeeCell, Rectangle.NO_BORDER, 0, 15);

        cellAlignment(logoImageCell, Element.ALIGN_LEFT, "", Element.ALIGN_MIDDLE);
        cellAddingToTable(paymentSectionTable, logoImageCell, Rectangle.NO_BORDER, 0, 0);

        cellAlignment(paymentSectionFeeAmountCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_MIDDLE);
        cellAddingToTable(paymentSectionTable, paymentSectionFeeAmountCell, Rectangle.NO_BORDER, 0, 0);
    }

    /**
     * This method is used to get the status for rejected payments.
     *
     * @param cartItemStatus The check the payment status.
     * @return <code>boolean</code> Returns true if status is REJECTED or starts with SCHEDULED.
     */
    public boolean getStatusForRejected(String cartItemStatus) {
        boolean flag = false;
			/* Checking for the transaction status and below are satisfied then return true */
        if (cartItemStatus.equals(PdfConstants.REJECTED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_POSTING_CATEGORY_CHANGED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_INVALID_PAYMENT_AMOUNT)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_VELOCITY_LIMIT_EXCEEDED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_PAYMENT_CARD_FAILED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_PROGRAM_ENDED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_NOT_AUTHED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_POSTING_WINDOW_EXPIRED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_BAN_VELOCITY_LIMIT_EXCEEDED)
                || cartItemStatus.equals(PdfConstants.SCHEDULED_CANCELLED_CARD_NO_LONGER_AVAILABLE)) {
            flag = true;
        }
        return flag;
    }

    /**
     * This method is used to check the PAID related status.
     *
     * @param status Passing status of transactions to check.
     * @return <code>Boolean</code> Returning true or false boolean value.
     */
    private Boolean getStatusForPaid(final String status) {
        boolean flag = false;
        if (status.equalsIgnoreCase(PdfConstants.PAID)
                || status.equalsIgnoreCase(PdfConstants.RETURN_PENDING)
                || status.equalsIgnoreCase(PdfConstants.SCHEDULED_PENDING)
                || status.equalsIgnoreCase(PdfConstants.SCHEDULED_PROCESSING)
                || status.equalsIgnoreCase(PdfConstants.IN_PROCESS)
                || status.equalsIgnoreCase(PdfConstants.PENDING)) {
            flag = true;
        }
        return flag;
    }

    /**
     * this method is used to draw the REJECTED transactions information on the PDF.
     *
     * @param locale              Locale object contains resource bundle information.
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param submittedBills      This object is used to get the biller information.
     * @throws BadElementException
     * @throws MalformedURLException
     * @throws IOException
     */
    private void designFailedBillsSection(Locale locale, PdfPTable paymentSectionTable,
                                          final SubmittedBill submittedBills)
            throws BadElementException, IOException {
        PdfPCell localBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        String message = getMessage(locale, "pdf.receipt.billFailed");
        getBillerSectionInfoForReturnRejected(paymentSectionTable, message,
                                              submittedBills, localBlankSpaceCell);

		/* Fee Details Start  */
        BigDecimal feeAmount = new BigDecimal(0);
        if (submittedBills.getFee() != null) {
            feeAmount = feeAmount.add(submittedBills.getFee());
        }
        if (feeAmount.intValue() > 0 && submittedBills.getExpressFlag()) {
            getExpressFeeBlock(paymentSectionTable, locale, feeAmount, RED_COLOR);
        }
		/*End Fee Details  */
        cellAlignment(localBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, localBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
    }

    /**
     * This method is used to draw the RETURN/REJECTED header on PDF.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param message             Contains whether it is RETURN/REJECTED text.
     * @param submittedBills      This object is used to get the biller information.
     * @param localBlankSpaceCell The PDFCell object used to draw the cell within table and set the message/text/space.
     */
    private void getBillerSectionInfoForReturnRejected(PdfPTable paymentSectionTable, String message,
                                                       SubmittedBill submittedBills
            , PdfPCell localBlankSpaceCell) {
        PdfPCell paymentSectionBillRejectedCell =
                new PdfPCell(new Phrase(message, getFont(RED_COLOR, FONT_SIZE_12, Font.BOLD)));
        cellAlignment(paymentSectionBillRejectedCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillRejectedCell, Rectangle.NO_BORDER, 2, 15);

        cellAlignment(localBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, localBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        PdfPCell paymentSectionBillerCell =
                new PdfPCell(new Phrase(getBillerName(submittedBills), getFont(RED_COLOR, FONT_SIZE_12
                        , Font.NORMAL)));
        PdfPCell paymentSectionBillerAamountCell =
                new PdfPCell(new Phrase(getFormattedAmount(submittedBills.getAmount()),
                                        getFont(RED_COLOR, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(paymentSectionBillerCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerCell, Rectangle.NO_BORDER, 2, 15);

        cellAlignment(paymentSectionBillerAamountCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_BOTTOM);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerAamountCell, Rectangle.NO_BORDER, 0, 0);
    }

    /**
     * This method is used to design the origional RETURN transaction information on PDF.
     *
     * @param locale                       Locale object contains resource bundle information.
     * @param paymentSectionTable          The PDFTable object used to draw the table structure in PDF.
     * @param paymentSectionBlankSpaceCell The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param submittedBills               This object is used to get the biller information.
     */
    private void designReturnedBillsSection(Locale locale, PdfPTable paymentSectionTable,
                                            PdfPCell paymentSectionBlankSpaceCell, final SubmittedBill submittedBills)
            throws BadElementException, IOException {

        Date date = submittedBills.getProjectedPostingDate();
        cellAlignment(paymentSectionBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        PdfPCell paymentSectionBillerCell = new PdfPCell(new Phrase(getBillerName(submittedBills)
                , getFont(RED_COLOR, FONT_SIZE_12, Font.NORMAL)));
        PdfPCell paymentSectionBillerAmountCell = new PdfPCell(new Phrase(getFormattedAmount(
                submittedBills.getAmount()), getFont(RED_COLOR, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(paymentSectionBillerCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerCell, Rectangle.NO_BORDER, 2, 15);

        cellAlignment(paymentSectionBillerAmountCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_BOTTOM);
        cellAddingToTable(paymentSectionTable, paymentSectionBillerAmountCell, Rectangle.NO_BORDER, 0, 0);

		/* Fee Details Start */ 
		/* Check for null, if fee come as null we are initializing as 0.*/
        BigDecimal feeAmount = new BigDecimal(0);
        if (submittedBills.getFee() != null) {
            feeAmount = submittedBills.getFee();
        }
        if (feeAmount.intValue() > 0 && submittedBills.getExpressFlag()) {
            getExpressFeeBlock(paymentSectionTable, locale, feeAmount, RED_COLOR);
        }
        /* End Fee Details */

        /* Estimated Delivery Start  */
        String toDate = convertToDate(date.getTime());
        String message = getMessage(locale, "pdf.receipt.estimatedDate", toDate);
        Font font = getFont(null, FONT_SIZE_10, Font.ITALIC);
        PdfPCell estimatedDeliveryCell =
                new PdfPCell(new Phrase(message, font));
        cellAlignment(estimatedDeliveryCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, estimatedDeliveryCell, Rectangle.NO_BORDER, 3, 15);

        PdfPCell localBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        cellAlignment(localBlankSpaceCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, localBlankSpaceCell, Rectangle.NO_BORDER, 0, 0);

        /* add blank space between 2 payments  */
        cellAlignment(paymentSectionBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentSectionTable, paymentSectionBlankSpaceCell, Rectangle.NO_BORDER, 3, 0);
        /* End Blank Space */
    }

    /**
     * This method is used to design the Payment funding information on the PDF payment table.
     *
     * @param receiptResponse CART_RECEIPT_REPRINT response is used to design return payment funding Info.
     * @param document        The document object used to draw the PDF.
     * @param locale          Locale object contains resource bundle information.
     */
    private void pdfPaymentMethod(CartReceiptResponse receiptResponse, Document document, Locale locale)
            throws DocumentException, IOException {

        LOGGER.debug("Entered in 'pdfPaymentMethod' method");
        Double totalPaymentApplied = 0.0;
        PdfPTable paymentMethodTable = new PdfPTable(2);
        paymentMethodTable.setWidths(new int[]{200, 50});
        PdfPCell paymentMethodBlankSpaceCell = new PdfPCell(new Phrase(" ", getFont(WHITE_COLOR, 8, Font.BOLD)));
        String message = getMessage(locale, "pdf.receipt.paymentMethod");
        Font font = getFont(BLACK_COLOR, FONT_SIZE_18, Font.BOLD);
        PdfPCell paymentMethodHeaderCell = new PdfPCell(new Phrase(message, font));
        cellAlignment(paymentMethodHeaderCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentMethodHeaderCell, Rectangle.NO_BORDER, 0, 0);

        cellAlignment(paymentMethodBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
        cellAlignment(paymentMethodBlankSpaceCell, 0, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);

        FundingSourceResponse[] fundingSources = receiptResponse.getFundingSources();

        if (fundingSources.length != 0) {
            for (final FundingSourceResponse aFundingSource1 : fundingSources) {
                if (aFundingSource1 != null) {
                    if (aFundingSource1.getType().equalsIgnoreCase(PdfConstants.CREDIT)) {
                        LOGGER.debug("Entered in to credits section : " + aFundingSource1.getType());
                        creditFundingSection(locale, paymentMethodTable,
                                             new BigDecimal(getUsedAmountFromFunding(aFundingSource1)));
                        cellAlignment(paymentMethodBlankSpaceCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
                        cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
                        totalPaymentApplied = totalPaymentApplied + getUsedAmountFromFunding(aFundingSource1);
                    }
                }
            }
            for (final FundingSourceResponse aFundingSource : fundingSources) {
                if (aFundingSource instanceof VestaFundingSourceResponse) {
                    VestaFundingSourceResponse vestaFundingSourceResponse =
                            (VestaFundingSourceResponse) aFundingSource;
                    String tenderType = vestaFundingSourceResponse.getTenderType();
                    CardBrand cardBrand = vestaFundingSourceResponse.getCardBrand();
                    if (tenderType.equalsIgnoreCase(PdfConstants.DEBIT) ||
                            tenderType.equalsIgnoreCase(PdfConstants.CREDIT)) {
                        PdfPCell cardNumberCell = new PdfPCell(new Phrase(getMessage(locale, "pdf.receipt.cardPinMsg",
                                                                                     getTenderTypeForCard(tenderType,
                                                                                                          locale),
                                                                                     getCardBrandText(cardBrand,
                                                                                                      locale),
                                                                                     vestaFundingSourceResponse
                                                                                             .getCardLast4()),
                                                                          getFont(null, FONT_SIZE_12, Font.NORMAL)));
                        PdfPCell amountSectionCell = new PdfPCell(new Phrase(getFormattedAmount(new BigDecimal(
                                getUsedAmountFromFunding(vestaFundingSourceResponse))),
                                                                             getFont(null, FONT_SIZE_12, Font.NORMAL)));
                        cellAlignment(cardNumberCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
                        cellAddingToTable(paymentMethodTable, cardNumberCell, Rectangle.NO_BORDER, 0, 15);

                        cellAlignment(amountSectionCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
                        cellAddingToTable(paymentMethodTable, amountSectionCell, Rectangle.NO_BORDER, 0, 0);
                        chargedOnSection(locale, paymentMethodTable, paymentMethodBlankSpaceCell, receiptResponse);
                        totalPaymentApplied =
                                totalPaymentApplied + getUsedAmountFromFunding(vestaFundingSourceResponse);
                        continue;
                    }
                }

                if (aFundingSource != null) {
                    if (getCashStatus(aFundingSource.getType())) {
                        cashFundingSection(paymentMethodTable, locale, aFundingSource);
                        cellAlignment(paymentMethodBlankSpaceCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
                        cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
                        totalPaymentApplied = totalPaymentApplied + getUsedAmountFromFunding(aFundingSource);
                    }
                }
            }
        } else {
            creditFundingSection(locale, paymentMethodTable, new BigDecimal(0));
            cellAlignment(paymentMethodBlankSpaceCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
            cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
            totalPaymentApplied = totalPaymentApplied + 0;
        }


        calculateTotalPayment(locale, paymentMethodTable, totalPaymentApplied);
        cellAlignment(paymentMethodBlankSpaceCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
        generatedNewCredits(locale, paymentMethodTable, receiptResponse.getCreditsGenerated());
        document.add(paymentMethodTable);
    }

    /**
     * This method is used to get amount from the funding sources.
     *
     * @param fundingSource Funding source object is passed to get amount of used in transaction.
     * @return <code>Double</code> returning double amount
     */
    private Double getUsedAmountFromFunding(final FundingSourceResponse fundingSource) {
        BigDecimal usedAmount = new BigDecimal(0);
        if (fundingSource.getAmountUsed() != null) {
            usedAmount = usedAmount.add(fundingSource.getAmountUsed());
        }
        return usedAmount.doubleValue();
    }

    /**
     * This method is used to display the Charge date or the Card Payment.
     *
     * @param paymentMethodTable          The PDFTable object used to draw the table structure in PDF.
     * @param paymentMethodBlankSpaceCell Adding blank space for table .
     * @param receiptResponse             CART_RECEIPT_REPRINT response is used to design return payment funding Info.
     */
    private void chargedOnSection(final Locale locale, PdfPTable paymentMethodTable,
                                  PdfPCell paymentMethodBlankSpaceCell
            , final CartReceiptResponse receiptResponse) {
        SubmittedBill[] submittedBills = receiptResponse.getSubmittedBills();
        for (final SubmittedBill submittedBill : submittedBills) {
            if (submittedBill.getSubmitDate() != null) {
                final Date date = submittedBill.getSubmitDate();
                String toDate = convertToDate(date.getTime());
                String message = getMessage(locale, "pdf.receipt.charged", toDate);
                Font font = getFont(null, FONT_SIZE_10, Font.ITALIC);
                PdfPCell amountChangedOnCell = new PdfPCell(new Phrase(message, font));
                cellAlignment(amountChangedOnCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
                cellAddingToTable(paymentMethodTable, amountChangedOnCell, Rectangle.NO_BORDER, 2, 15);
                cellAlignment(paymentMethodBlankSpaceCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
                cellAddingToTable(paymentMethodTable, paymentMethodBlankSpaceCell, Rectangle.NO_BORDER, 2, 0);
                break;
            }
        }
    }

    /**
     * This method is used to show the cash funding row on the payment table.
     *
     * @param paymentMethodTable The PDFTable object used to draw the table structure in PDF.
     * @param locale             Locale object contains resource bundle information.
     * @param fundingSource      Object contains funding source information.
     */
    private void cashFundingSection(PdfPTable paymentMethodTable, Locale locale, FundingSourceResponse fundingSource) {
        PdfPCell pinLabelCell = new PdfPCell(new Phrase(getMessage(locale, "pdf.receipt.cashPinMsg",
                                                                   getFundingTypeLabel(fundingSource.getType(), locale),
                                                                   getFundingLabel(fundingSource.getType(), locale),
                                                                   getLoadAccountNumber(
                                                                           fundingSource.getLoadAccountNumber())),
                                                        getFont(null, FONT_SIZE_12, Font.NORMAL)));
        PdfPCell amountLabelCell = new PdfPCell(new Phrase(getFormattedAmount(fundingSource.getAmountUsed())
                , getFont(null, FONT_SIZE_12, Font.NORMAL)));
        cellAlignment(pinLabelCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, pinLabelCell, Rectangle.NO_BORDER, 0, 15);
        cellAlignment(amountLabelCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, amountLabelCell, Rectangle.NO_BORDER, 0, 0);
    }

    /**
     * This method is used to show the CREDIT funding information.
     *
     * @param locale             Locale object contains resource bundle information.
     * @param paymentMethodTable The PDFTable object used to draw the table structure in PDF.
     * @param amount             Contains Credit amount to show it on PDF.
     */
    private void creditFundingSection(Locale locale, PdfPTable paymentMethodTable, BigDecimal amount) {
        String message = getMessage(locale, "pdf.receipt.creditsApplied");
        Font font = getFont(null, FONT_SIZE_12, Font.NORMAL);
        PdfPCell pinLabelCell = new PdfPCell(new Phrase(message, font));
        PdfPCell amountLabelCell = new PdfPCell(new Phrase(getFormattedAmount(amount), font));
        cellAlignment(pinLabelCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, pinLabelCell, Rectangle.NO_BORDER, 0, 15);
        cellAlignment(amountLabelCell, Element.ALIGN_RIGHT, GRAY_COLOR, Element.ALIGN_BOTTOM);
        cellAddingToTable(paymentMethodTable, amountLabelCell, Rectangle.NO_BORDER, 0, 0);
    }

    /**
     * This method is used to get the TENDER type CREDIT/DEBIT.
     *
     * @param tenderType Tender type contains CREDIT/DEBIT tender type.
     * @param locale     Locale object contains resource bundle information.
     * @return <code>String</code>
     */
    private String getTenderTypeForCard(String tenderType, Locale locale) {
        if (tenderType.equalsIgnoreCase(PdfConstants.DEBIT)) {
            return getMessage(locale, "pdf.receipt.debit");
        } else {
            return getMessage(locale, "pdf.receipt.credit");
        }
    }

    /**
     * @param locale              Locale object contains resource bundle information.
     * @param paymentMethodTable  The PDFTable object used to draw the table structure in PDF.
     * @param totalPaymentApplied Total amount which is applied to all the transactions.
     */
    private void calculateTotalPayment(Locale locale, PdfPTable paymentMethodTable, Double totalPaymentApplied) {
        String message = getMessage(locale, "pdf.receipt.paymentApplied");
        Font font = getFont(null, FONT_SIZE_18, Font.BOLD);
        PdfPCell paymentTotalCell = new PdfPCell(new Phrase(message, font));
        PdfPCell paymentTotalAmount = new PdfPCell(new Phrase(getFormattedAmount(new BigDecimal(totalPaymentApplied)),
                                                              font));
        cellAlignment(paymentTotalCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentTotalCell, Rectangle.NO_BORDER, 0, 0);

        cellAlignment(paymentTotalAmount, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
        cellAddingToTable(paymentMethodTable, paymentTotalAmount, Rectangle.NO_BORDER, 0, 0);
    }

    /**
     * This method is used to generate new credits which is remains in CASH payment.
     *
     * @param locale             Locale object contains resource bundle information.
     * @param paymentMethodTable The PDFTable object used to draw the table structure in PDF.
     * @param newCreditAmount    Remaining amount which will treat as a CREDIT.
     */
    private void generatedNewCredits(Locale locale, PdfPTable paymentMethodTable, BigDecimal newCreditAmount) {
        if (newCreditAmount != null && newCreditAmount.intValue() != new BigDecimal(0).intValue()) {
            String message = getMessage(locale, "pdf.receipt.newCreditsIssued");
            Font font = getFont(GREEN_COLOR, FONT_SIZE_12, Font.NORMAL);
            PdfPCell generatedCreditsCell = new PdfPCell(new Phrase(message, font));
            PdfPCell generatdCreditAmountCell = new PdfPCell(new Phrase(getFormattedAmount(newCreditAmount), font));
            cellAlignment(generatedCreditsCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
            cellAddingToTable(paymentMethodTable, generatedCreditsCell, Rectangle.NO_BORDER, 0, 0);

            cellAlignment(generatdCreditAmountCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
            cellAddingToTable(paymentMethodTable, generatdCreditAmountCell, Rectangle.NO_BORDER, 0, 0);
        }
    }

    /**
     * This method is used to get the card brand related text.
     *
     * @param cardBrand Card brand contains DS/VS/MC.
     * @param locale    Locale object contains resource bundle information.
     * @return <code>String</code> Returns card brand text.
     */
    private String getCardBrandText(CardBrand cardBrand, Locale locale) {
        String cardBrandText = "";
        if (cardBrand.toString().equalsIgnoreCase(PdfConstants.VS)) {
            cardBrandText = getMessage(locale, "pdf.receipt.visa");
        } else if (cardBrand.toString().equalsIgnoreCase(PdfConstants.DS)) {
            cardBrandText = getMessage(locale, "pdf.receipt.discover");
        } else if (cardBrand.toString().equalsIgnoreCase(PdfConstants.MC)) {
            cardBrandText = getMessage(locale, "pdf.receipt.master");
        }

        return cardBrandText;
    }

    /**
     * The method is used to get the card service fee amount from response.
     *
     * @param receiptResponse     The API response received after CART_RECEIPT_REPRINT API call.
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param blankSpaceCell      The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param locale              Locale object contains resource bundle information.
     * @return <code>BigDecimal</code> result of service fee amount calculated from funding sources of CART_RECEIPT_REPRINT API.
     */
    private BigDecimal getCardServiceFeeAmount(final CartReceiptResponse receiptResponse
            , final PdfPTable paymentSectionTable, final PdfPCell blankSpaceCell, final Locale locale) {

    	/* Get funding source from the CART_RECEIPT_REPRINT response */
        final FundingSourceResponse[] fundingSource = receiptResponse.getFundingSources();
        final SubmittedBill[] submittedBills = receiptResponse.getSubmittedBills();
        /* Initializing serviceFee */
        final BigDecimal serviceFee = addServiceFee(submittedBills);
        for (final FundingSourceResponse aFundingSource : fundingSource) {
            /* Check for the DEBIT/CREDIT card instance */
            if (aFundingSource instanceof VestaFundingSourceResponse) {
                /* ServiceFeePercentRate is null treating it as ZERO other wise get the value */
                BigDecimal cardServiceFeePercent = aFundingSource.getServiceFeePercentRate() == null
                        ? new BigDecimal(0) : aFundingSource.getServiceFeePercentRate();
                /* In case seviceFee amount is > ZERO then execute the below block of code to display the line above the total bills */
                if (serviceFee.compareTo(BigDecimal.ZERO) > 0 && cardServiceFeePercent.compareTo(BigDecimal.ZERO) > 0) {
                    /* Cell for the card service percent label  */
                    Font font = getFont(null, FONT_SIZE_12, Font.NORMAL);
                    String message = getMessage(locale, "pdf.receipt.serviceFee", cardServiceFeePercent);
                    PdfPCell serviceFeeLabel = new PdfPCell(new Phrase(message, font));
                    /* Cell for the card service fee amount */
                    PdfPCell serviceFeeTotal = new PdfPCell(
                            new Phrase(getFormattedAmount(serviceFee), font));
                    /* Adding above cells to table */
                    cellAlignment(serviceFeeLabel, Element.ALIGN_LEFT, WHITE_COLOR, 0);
                    cellAddingToTable(paymentSectionTable, serviceFeeLabel, Rectangle.NO_BORDER, 2, 15);

                    cellAlignment(serviceFeeTotal, Element.ALIGN_RIGHT, WHITE_COLOR, 0);
                    cellAddingToTable(paymentSectionTable, serviceFeeTotal, Rectangle.NO_BORDER, 0, 0);
					/* Adding blank space to table */
                    cellAlignment(blankSpaceCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
                    cellAddingToTable(paymentSectionTable, blankSpaceCell, Rectangle.NO_BORDER, 3, 0);
                }
            }
        }
        return serviceFee;
    }

    /**
     * This method is used to calculate the service fee from all the transactions.
     *
     * @param submittedBills This object have all the transactions information which is submitted.
     * @return <code>BigDecimal</code> returns service fee after calculating.
     */
    private BigDecimal addServiceFee(final SubmittedBill[] submittedBills) {
        BigDecimal serviceFee = new BigDecimal(0);
        for (final SubmittedBill submittedBill : submittedBills) {
            if (!getStatusForRejected(submittedBill.getStatus().name())) {
                serviceFee = serviceFee.add(submittedBill.getServiceFee());
            }

        }
        return serviceFee;
    }

    /**
     * This method is used to get the Funding type label for the CREDITS/PROMO/CASH.
     *
     * @param type   Type contains other than Card which meant that CREDITS/PROMO/CASH.
     * @param locale Locale object contains resource bundle information.
     * @return <code>String</code> Returns CREDITS/PROMO/CASH label.
     */
    private String getFundingTypeLabel(String type, Locale locale) {
        String paymentMethodLabel = "";
        if (type.equalsIgnoreCase(PdfConstants.CREDIT)) {
            paymentMethodLabel = "";
        } else if (type.equalsIgnoreCase(PdfConstants.BLACKHAWK) || type.equalsIgnoreCase(PdfConstants.PRECASH) ||
                type.equalsIgnoreCase(PdfConstants.INCOMM)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.cashFundingSource");
        } else if (type.equalsIgnoreCase(PdfConstants.PROMO_CREDIT)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.promoFundingSource");
        }
        return paymentMethodLabel;
    }

    /**
     * This method is get the label for related funding type.
     *
     * @param type   Type contains other than Card which meant that CREDITS/PROMO/CASH.
     * @param locale Locale object contains resource bundle information.
     * @return <code>String</code> Returns related cash funding type.
     */
    private String getFundingLabel(String type, Locale locale) {
        String paymentMethodLabel = "";
        if (type.equalsIgnoreCase(PdfConstants.PROMO_CREDIT)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.promoCredit");
        } else if (type.equalsIgnoreCase(PdfConstants.BLACKHAWK)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.reloaditPack");
        } else if (type.equalsIgnoreCase(PdfConstants.PRECASH)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.evolvePayBucks");
        } else if (type.equalsIgnoreCase(PdfConstants.INCOMM)) {
            paymentMethodLabel = getMessage(locale, "pdf.receipt.vanillaReload");
        }
        return paymentMethodLabel;
    }

    /**
     * This method is used to make progress if there is no CREDIT fundign type.
     *
     * @param type Type contains Funding type information CREDITS/PROMO/CASH.
     * @return <code>boolean</code> Returns FALSE if Funding type is CREDIT.
     */
    private boolean getCashStatus(String type) {
        boolean flag = false;
        if (type.equalsIgnoreCase(PdfConstants.PROMO_CREDIT) || type.equalsIgnoreCase(PdfConstants.BLACKHAWK)
                || type.equalsIgnoreCase(PdfConstants.PRECASH) || type.equalsIgnoreCase(PdfConstants.INCOMM)) {
            flag = true;
        }
        return flag;
    }

    /**
     * This method is used to get the account number of used funding type.
     *
     * @param loadAccNumber Number nothing but Funding number.
     * @return <code>String</code> Returns account number in the string type.
     */
    private String getLoadAccountNumber(String loadAccNumber) {
        String loadNumber = "";
        if (null != loadAccNumber) {
            loadNumber = loadAccNumber;
        }
        return loadNumber;
    }

    /**
     * This method is used to get the credits of RETURN payment.
     *
     * @param paymentSectionTable The PDFTable object used to draw the table structure in PDF.
     * @param returnCredits       RETURN Payment credit amount.
     * @param locale              Locale object contains resource bundle information.
     */
    private void returnPaymentCredits(PdfPTable paymentSectionTable, BigDecimal returnCredits, Locale locale) {
        if (returnCredits.intValue() != 0) {
            PdfPCell creditSectionCell = new PdfPCell(new Phrase(getMessage(locale,
                                                                            "pdf.receipt.newCreditsIssued"),
                                                                 getFont(GREEN_COLOR, FONT_SIZE_12, Font.NORMAL)));
            PdfPCell creditAmountSectionCell = new PdfPCell(new Phrase(getFormattedAmount(returnCredits),
                                                                       getFont(GREEN_COLOR, FONT_SIZE_12,
                                                                               Font.NORMAL)));
            cellAlignment(creditSectionCell, Element.ALIGN_LEFT, GRAY_COLOR, Element.ALIGN_BOTTOM);
            cellAddingToTable(paymentSectionTable, creditSectionCell, Rectangle.NO_BORDER, 2, 15);
            cellAlignment(creditAmountSectionCell, Element.ALIGN_RIGHT, GRAY_COLOR, 0);
            cellAddingToTable(paymentSectionTable, creditAmountSectionCell, Rectangle.NO_BORDER, 0, 0);
        }
    }

    /**
     * This method is used to get the biller name
     *
     * @param submittedBill Object contains biller information.
     * @return <code>String</code> Returns the string type biller name.
     */
    private String getBillerName(final SubmittedBill submittedBill) {
        String billerNameOne = submittedBill.getBillerName().equalsIgnoreCase(submittedBill.getAccountNickName())
                ? submittedBill.getBillerName().concat(" (" + submittedBill.getAccountNickName() + ")")
                : submittedBill.getBillerName();
        return billerNameOne;
    }

    /**
     * This method is used to convert the milliseconds in to PST time format.
     *
     * @param millis date in milliseconds.
     * @return <code>String</code> Returns simple date in PSt format.
     */
    private String convertToDate(final long millis) {
        final Date date = new Date(millis);
        java.text.SimpleDateFormat dateFormat = new java.text.SimpleDateFormat(
                "MMM dd, yyyy", Locale.US);
        dateFormat.setTimeZone(TimeZone.getTimeZone("PST")); //TODO should be TZ of the user???
        return dateFormat.format(date);
    }

    /**
     * This method is used format the amount.
     *
     * @param amount Amount in BigDecimal type.
     * @return <code>String</code> Returns the amount which is formatted.
     */
    private String getFormattedAmount(final BigDecimal amount) {
        final java.text.DecimalFormat decFormat = new java.text.DecimalFormat("0.00");
        return "$" + decFormat.format(amount);
    }

    /**
     * This method is generating information Message for the PDF.
     *
     * @param document The document object used to draw the PDF.
     * @param locale   Locale object contains resource bundle information.
     * @throws DocumentException
     */
    private void pdfInfoMessage(final Document document, final Locale locale) throws DocumentException {
        LOGGER.debug("entered in 'pdfInfoMessage' method");
        PdfPTable receiptInfoMessageTextTable = new PdfPTable(4);
        String message = getMessage(locale, "pdf.receipt.more_info_message");
        Font font = getFont(WHITE_COLOR, FONT_SIZE_9, Font.ITALIC);
        PdfPCell receiptTextCell = new PdfPCell(new Phrase(message, font));
        receiptTextCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        receiptTextCell.setBorder(Rectangle.NO_BORDER);
        receiptTextCell.setColspan(4);
        cellAlignment(receiptTextCell, Element.ALIGN_LEFT, GRAY_COLOR, 0);
        cellAddingToTable(receiptInfoMessageTextTable, receiptTextCell, Rectangle.NO_BORDER, 4, 0);
        document.add(receiptInfoMessageTextTable);
    }

    /**
     * This method is used to set the fond and color and style for the cell.
     *
     * @param fontColor Font color for the cell.
     * @param fontSize  font size for the cell.
     * @param fotStyle  Font style for the cell.
     * @return <code>Font</code> Returns the rntire font informaiton with required style.
     */
    private Font getFont(String fontColor, float fontSize, int fotStyle) {
        Font cellPaymentReciptFont = FontFactory.getFont("Arial", 10f);
        if (null != fontColor && fontColor.equalsIgnoreCase(RED_COLOR)) {
            cellPaymentReciptFont.setColor(BaseColor.RED);
        } else if (null != fontColor && fontColor.equalsIgnoreCase(GREEN_COLOR)) {
            cellPaymentReciptFont.setColor(BaseColor.GREEN);
        } else {
            cellPaymentReciptFont.setColor(BaseColor.BLACK);
        }
        cellPaymentReciptFont.setSize(fontSize);
        cellPaymentReciptFont.setStyle(fotStyle);
        return cellPaymentReciptFont;
    }

    /**
     * This method is used to set background color for the cell.
     *
     * @param cell           The PDFCell object used to draw the cell within table and set the message/text/space.
     * @param colorCodeInHex This contains hexa code for the color.
     */
    private void setCellBackgroundColor(final PdfPCell cell, final String colorCodeInHex) {
        LOGGER.debug("Entered in 'setCellBackgroundColor' method");
        BaseColor myColor;
        if (null != colorCodeInHex && colorCodeInHex.equalsIgnoreCase("#ccc")) {
            myColor = WebColors.getRGBColor(colorCodeInHex);
        } else {
            myColor = WebColors.getRGBColor(WHITE_COLOR);
        }
        cell.setBackgroundColor(myColor);
    }

    /**
     * This method is used decode the request which user have made.
     *
     * @param base64StringData Encoded request of user request.
     * @return <code>String[]</code> Returns string array type decoded request.
     */
    private String[] decodeRequest(final String base64StringData) {
        final List<String> requestData = new ArrayList<>();
        final String dataSeparator = "|";
        try {
            if (null != base64StringData) {
                byte[] decoded = Base64.decode(base64StringData.getBytes("UTF-8"));
                String receiptData = new String(decoded, "UTF-8");
                StringTokenizer receiptTokens = new StringTokenizer(receiptData, dataSeparator);
                while (receiptTokens.hasMoreTokens()) {
                    requestData.add(receiptTokens.nextToken());
                }
            }
        } catch (final Exception e) {
            LOGGER.error("trouble decoding pdf request: " + base64StringData, e);
        }
        return requestData.toArray(new String[requestData.size()]);
    }

    /**
     * This method is used to show the lables using resource bundle keys and also it will allow place holders.
     *
     * @param locale Locale object contains resource bundle information.
     * @param key    resource bundle keys which is passed.
     * @param params params if there is any to for the getMessage.
     * @return <code>String</code> returning formatted message.
     */
    public String getMessage(Locale locale, String key, Object... params) {
        String value;
        try {
            value = ResourceBundle.getBundle(OPP_BUNDLE_NAME, locale).getString(key);
        } catch (final Throwable e) {
            LOGGER.warn("missing bundle key: key=" + key + ", locale=" + locale, e);
            value = null;
        }

        if (null == value || "".equals(value)) {
            value = "???" + key + "???";
            return value;
        }
        String message = MessageFormat.format(value, params);
        return message;
    }


    /**
     * SSL requests to local boxes that don't have a valid certificate can be ignored.
     */
    static {
        disableSslVerification();
    }

    private static void disableSslVerification() {
        try {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                public void checkClientTrusted(java.security.cert.X509Certificate[] x509Certificates, String s)
                        throws CertificateException {

                }

                public void checkServerTrusted(java.security.cert.X509Certificate[] x509Certificates, String s)
                        throws CertificateException {

                }

                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

            }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Create all-trusting host name verifier
            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // Install the all-trusting host verifier
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

}
