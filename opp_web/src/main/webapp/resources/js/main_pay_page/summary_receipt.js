var myNewArray = [];
var valDate;
var summaryViewObject = null;
var milliSecondDateArrayForMobile = null;
var summaryViewGlobalObj, cartInfoGlobal, creditsArrayGlobal, cartCreatedDateMap;

/********************************************************************************************
 Name                 :   showRegFormSummary
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :  This method is used to show the create account section and button
 pertaining create account for guest user in summary receipt view page.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Karuna mishra
 *******************************************************************************************/
function showRegFormSummary() {
    if (!$('#chkCreateAccSummary').is(":checked")) {
        $("#chkCreateAccSummary").prop('checked', true);
        $("#chkCreateAccIconSummary").removeClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#chkCreateAccIconSummary").addClass("add_bill_activ_chkbox_icon flt_lft");
        $("#frmGuestCreateAccSummary").show();
        $("#btnContinueSummary").show();
        var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
        var arg1 = '</a>';
        var message = formatMessage(messages['checkout.termConditionHistory'], arg0, arg1);
        $("#summaryViewTermCond").html(message);
        $("#createAccountBoxErrDivSummary").show();

        /* Show the check box for marketing Opt in */
        createOptInMsgAorBSection("chkOptInEnhSummary", "optInEhnChkSummary", messages['createAccount.optInEnh']);
        fillDataFromUserGetProfileObject("emailIdSummary", "confrmEmailIdSummary", "mobileNoSummary", "zipCodeSummary");
        
        validateCreateProfileSummary();
        enableRecieptCreateSubmitButton();

        /* To be called from fieldValidator.js*/
        addHeightClass('errorSepratorSummary1');
        addHeightClass('errorSepratorSummary2');
        addHeightClass('errorSepratorSummary3');
        addHeightClass('errorSepratorSummary4');
        addHeightClass('errorSepratorSummary5');
        enableDisableSubmit('frmGuestCreateAccSummary', 'btnContinueSummary');
    } else {
        $("#chkCreateAccSummary").prop('checked', false);
        $("#chkCreateAccIconSummary").removeClass("add_bill_activ_chkbox_icon flt_lft");
        $("#chkCreateAccIconSummary").addClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#btnContinueSummary").hide();
        $("#frmGuestCreateAccSummary").hide();
        $("#createAccountBoxErrDivSummary").hide();

        /* To be called from fieldValidator.js*/
        removeHeightClass('errorSepratorSummary1');
        removeHeightClass('errorSepratorSummary2');
        removeHeightClass('errorSepratorSummary3');
        removeHeightClass('errorSepratorSummary4');
        removeHeightClass('errorSepratorSummary5');
    }
}

/********************************************************************************************
 Name                 :   hideShowCreateAccountSummary
 Return type          :   None
 Input Parameter(s)   :   verifyUserId
 Purpose              :   This method is used for showing create account box on summary view
 page for guest user.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function hideShowCreateAccountSummary(verifyUserId) {
    var registerUser = parseBoolean(localStorage.getItem("registerUser"));
    if (registerUser === false) {
        $("#createAccountSummarySection").show();

        /* To clear the create profile form data. */
        clearFormData('frmGuestCreateAccSummary');
        setExtraMarginForAndroid('createAccountBoxSummary');
        
        if (verifyUserId) {
            $('#createAccountBoxSummary').show();
            /* To set the create profile area at initial state. */
            if ($('#chkCreateAccSummary').is(":checked")) {
                showRegFormSummary();
            }
        }
        /* To hide the error msg divs on page load. */
        hideErrorMsgDiv('frmGuestCreateAccSummary', 'errorMainAreaSummary1');
        return;
    }
    $("createAccountSummarySection").remove();
}

/********************************************************************************************
 Name                 :   validateCreateProfileSummary
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   This method is used for validating the create account field in
 summary view page.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function validateCreateProfileSummary() {
    $('#emailIdSummary').blur(function () {
    	this.value = this.value.toLowerCase();
        validateEmailInfo('emailIdSummary', 'errorMainAreaSummary1', 'invalidMsgSummary1', messages['createAccount.invalidEmailMsg'],
                          'frmGuestCreateAccSummary', 'btnContinueSummary','summaryViewAreaId');
    });

    $('#confrmEmailIdSummary').blur(function () {
    	this.value = this.value.toLowerCase();
        validateReenterEmail('emailIdSummary', 'confrmEmailIdSummary', 'errorMainAreaSummary2', 'invalidMsgSummary2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestCreateAccSummary', 'btnContinueSummary','summaryViewAreaId');
    });

    $('#passwordSummary').blur(function () {
        passwordMatchUserName('emailIdSummary', 'passwordSummary', 'errorMainAreaSummary3', 'invalidMsgSummary3',
                              messages['createAccount.invalidpasswordMsgSame'], 'frmGuestCreateAccSummary', 'btnContinueSummary','summaryViewAreaId');
    });

    $('#mobileNoSummary').blur(function () {
        validatePhoneInfo('mobileNoSummary', 'errorMainAreaSummary4', 'invalidMsgSummary4', messages['createAccount.invalidphoneMsg'],
                          'frmGuestCreateAccSummary', 'btnContinueSummary','summaryViewAreaId');
    });

    $('#zipCodeSummary').blur(function () {
        validateZipcodeInfo('zipCodeSummary', 'errorMainAreaSummary5', 'invalidMsgSummary5', messages['createAccount.invalidzipCodeMsg'],
                            'frmGuestCreateAccSummary', 'btnContinueSummary','summaryViewAreaId');
    });
    customKeypressValidator('mobileNoSummary');
}

/********************************************************************************************
 ' Name                 :   summaryReceiptViewForUser
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for call BP_CART_HIST API for showing summary
 receipt view to user.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   27th, May 2013     -   Ravi Raj
 '*******************************************************************************************/
function summaryReceiptViewForUser() {
    var verifyUserId = eval(getCookie('userId'));
    hideShowCreateAccountSummary(verifyUserId);

    /* To show the progress bar */
    showProgressBar();
    $('#summaryViewTableArea').empty();
    
    /* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
    showScreenAndSetHeight('showSummaryView', 'summaryViewAreaId');
    
    if (!verifyUserId) {
        $("#summaryViewTableArea").html("<h5>" + messages['summaryView.msg'] + "</h5>");
        /* To hide the progress bar */
        hideProgressBar();
        return;
    }
    var endDate = "";
    var startRow = "";
    var daysBack = localStorage.getItem("daysBack");
    var today = new Date();
    var past = new Date();
    past.setDate(today.getDate() - daysBack);
    startDate = past.valueOf();
    var request = {};
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.count = localStorage.getItem("count");
    request.userId = eval(getCookie('userId'));
    request.startDate = startDate;
    request.endDate = endDate;
    request.startRow = startRow;

    var call_bp_cart_hist = new bp_cart_hist(request);
	call_bp_cart_hist.call();
}

/*******************************************************************************
 * ' Name 				: 	 successReturn
 * ' Return type 		:  	 void 
 * ' Input Parameter(s) : 	 None
 * ' Purpose			: 	 This method is used to check the api response and show the Summary
 * ' receipt view on the basis of response. 
 * ' History Header 	: 	 Version 	- 	Date 			-	Developer Name
 * ' Added By 			: 	 1.0 		- 	17th July, 2013 - Ravi Raj 
 ******************************************************************************/
function handleBPCartHistOnSuccess() {
    cartCreatedDateMap = storeCartCreatedDate(bp_cart_hist_obj);
    /* Get the cart array from response object*/
    var cartArray = bp_cart_hist_obj.carts;
    /* Get the transaction array from response object*/
    var transactionArray = bp_cart_hist_obj.transactions;
    /* Saving the transactionArray object in global variable that will be used to redraw the layout on window resize */
    summaryViewGlobalObj = transactionArray;
    /* To designing the layout only when cart and transaction exists in the response */
    if (cartArray.length > 0 && transactionArray.length > 0) {
        /* Get the transaction array from response object*/
        var creditsArray = bp_cart_hist_obj.credits;
        creditsArrayGlobal = creditsArray;
        var cartUpdatedDate = getCartsUpdatedDate(cartArray);
        cartInfoGlobal = calculateSummaryView(creditsArray, transactionArray, cartUpdatedDate);

        var windowWidth = $(window).width();
        /* To check for standard and mobile width areas */
        if (windowWidth > minimumWindowWidthForMobile) {
            /* To create the History - Summary View Area for standard width. */
            createPaymentHistoryTableForSummary(cartInfoGlobal, transactionArray, creditsArray);
            return;
        }
        summaryReceiptViewForMobile(cartInfoGlobal, transactionArray, creditsArray);
    } else {
        $("#summaryViewTableArea").html("<h5 class='mrgn_left15'>" + messages['summaryView.msg'] + "</h5>");
        return;
    }
}

/********************************************************************************************
 ' Name                 :   getCartsUpdatedDate
 ' Return type          :   Object cartsUpdatedDate
 ' Input Parameter(s)   :   cartArray
 ' Purpose              :   This method is used for get the updated date from carts array of
 ' summaryView response object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   25th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function getCartsUpdatedDate(cartArray) {
    var cartsUpdatedDate = new Object();
    /* Iterating the transactionArray for get cart update date */
    for (var index in cartArray) {
        var cartObject = cartArray[index];
        var cartId = cartObject.id;
        /* Creating a key with cart id in cartsUpdatedDate object and storing the update date */
        cartsUpdatedDate[cartId] = cartObject.updateDate;
    }
    return cartsUpdatedDate;
}

/********************************************************************************************
 ' Name                 :   calculateSummaryView
 ' Return type          :   void
 ' Input Parameter(s)   :   creditsArray, transactionArray, cartUpdatedDate
 ' Purpose              :   This method is used for calculating the payment total and number
 of transaction from summary view object and store it on object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function calculateSummaryView(creditsArray, transactionArray, cartUpdatedDate) {
    summaryViewObject = new Object();
    milliSecondDateArrayForMobile = new Array();
    for (var index in transactionArray) {
        var transaction = transactionArray[index];
        var transactionId = transaction.cartId;
        if(transactionId){
	        /* Checking if summaryViewObject contains the object with transaction Id or not. If not exists then create
	         * a new object and initialize its fields */
	        if (!summaryViewObject[transactionId]) {
	        	 summaryViewObject[transactionId] = new Object();
	             summaryViewObject[transactionId].paymentTotal = 0;
	             summaryViewObject[transactionId].numberOfTransactions = 0;
	             summaryViewObject[transactionId].returnedPayment = false;
	             summaryViewObject[transactionId].updatedDate = cartUpdatedDate[transactionId];
	             summaryViewObject[transactionId].creditIssued = getNewCreditIssed(creditsArray, transaction.cartId);
	             /* Store milliseconds to display sorting based on date on mobile */
	             milliSecondDateArrayForMobile.push(cartUpdatedDate[transactionId]);
	        }
	        /* Checking if transaction is not rejected means PAID, PENDING or RETURNED, calculate the payment amount */
	        if (transaction.status == "PAID" || transaction.status == "PENDING") {
	            summaryViewObject[transactionId].paymentTotal += parseFloat(transaction.amount + transaction.fee + transaction.serviceFee);
	        } else if (transaction.status == "RETURNED" || transaction.status == "RETURN_PENDING") {
	            summaryViewObject[transactionId].paymentTotal += parseFloat(transaction.amount + transaction.fee + transaction.serviceFee);
	            summaryViewObject[transactionId].returnedPayment = true;
	        }
	        summaryViewObject[transactionId].numberOfTransactions++;
        }
    }
    return summaryViewObject;
}

/********************************************************************************************
 ' Name                 :   createPaymentHistoryTableForSummary
 ' Return type          :   void
 ' Input Parameter(s)   :   summaryViewObject, transactionArray, creditsArray
 ' Purpose              :   Function create the table using success response of BP_CART_HIST API.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function createPaymentHistoryTableForSummary(summaryViewObject, transactionArray, creditsArray) {
	var tablePaymentHistorySummaryView ="";
    if (summaryViewObject.length === 0) {
        $("#summaryViewTableArea").html("<h5>" + messages['summaryView.msg'] + "</h5>");
        return;
    }
    tablePaymentHistorySummaryView = '<table id="paymentHistorySummaryView">'
					            + '<thead id="demo">'
					            + '<th width=20%>' + messages['summaryView.paymentDate'] + '</th>'
					            + '<th width=40%>' + messages['summaryView.detail'] + '</th>'
					            + '<th width=20%>' + messages['summaryView.receiptId'] + '</th>'
					            + '<th width=20%>' + messages['summaryView.action'] + '</th>'
					            + '</thead>'
					            + '<tbody id="paymentHistorySummaryViewTableRows">';
   
    /* Iterating through the summaryViewObject got from API response. */
    for (var cartId in summaryViewObject) {
        /* Converting cartId from string to integer */ 
        cartId = parseInt(cartId);
        
        /* Checking every object/payemnt as returned payement or not */
        if (summaryViewObject[cartId].returnedPayment) {
        	/* Calling method to return a row to create for returned payment row */
            tablePaymentHistorySummaryView += createRowForReturnedPayment(cartId, summaryViewObject, transactionArray, creditsArray);
        }
        /* Calling method to return a row to create for submitted payment row */
        tablePaymentHistorySummaryView += createHistroyRowForSummary(cartId, summaryViewObject, transactionArray, creditsArray);
        
    }
    tablePaymentHistorySummaryView += '</tbody> </table>';
    $("#summaryViewTableArea").empty();
    $('#summaryViewTableArea').html(tablePaymentHistorySummaryView);
    $("#summaryViewTableArea").show();
    $("#showSummaryView").show();

    /* To hide the progress bar */
    hideProgressBar();

    /**
     * Data table configuration for payment history summary view table.
     */
    tableRefrecnce = $("#paymentHistorySummaryView").dataTable({
                   "bFilter": false,//used to disable search
                   "bLengthChange": false,
                   "bPaginate": false,
                   "bScrollCollapse": true,
                   //used to display row count as 25 in table
                   "iDisplayLength": 10,
                   "aLengthMenu": [
                       [25, 50, 100, -1],
                       [25, 50, 100, "All"]
                   ],
                   // No initial sorting
                   "aaSorting": [
                       [0, 'desc']
                    ],
                   "aoColumnDefs": [
                       {
                           "bSortable": false,
                           "aTargets": [ 1, 3 ]
                       }
                   ],
                   "aoColumnDefs": [{
                                        "bSortable": true,
                                        "aTargets": [ 0, 2 ]
                                    }
                                ],
                   "fnDrawCallback": function () {
                       if (Math.ceil((this.fnSettings().fnRecordsDisplay()) /
                                             this.fnSettings()._iDisplayLength) >
                               1) {
                           $('.dataTables_length').hide();
                       } else {
                           $('.dataTables_length').css("display",
                                                       "none");
                       }
                   }
               });
}

/********************************************************************************************
 ' Name                 :   createHistroyRowForSummary
 ' Return type          :   String rowItem
 ' Input Parameter(s)   :   Long cartId, Object summaryViewObject, Date sumDate
 ' Purpose              :   This method is used to create the table row from summaryView
 response object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function createHistroyRowForSummary(cartId, cartInfo, transactionArray, creditsArray) {
    var dyanmicTextForHistory = messages['summaryView.totalPaid'];
    var dynamicCss = "'history_summary_detail_txt'";
    var rowItem = "";
    rowItem += '<tr>'
            + '<td >'
            + 	convertToDatemmddyyForHistory(cartInfo[cartId].updatedDate)
            + '</td>'
            + '<td >'
            + 	'<div class="history_summary_detail_hdtxt">'
            +		'<a href="javascript:void(0)" onclick="navigateToReceiptView(' 
            + 			cartId + ', false);" >' + " " + messages['summaryView.totalBillMsg'] 
            + 		'</a>'
            +	'</div>'
            + 	'<ul id="hist_rec_vw">';
    for (var index in transactionArray) {
        var transactionObj = transactionArray[index];
        if(transactionObj.cartId === cartId) {
        	var accountNickname = "";
    		if(transactionObj.billerName != transactionObj.accountNickname){
    			accountNickname = ' (' + transactionObj.accountNickname + ')' ;
            }
        	if(getStatusForRejected(transactionObj.status)) {
            	rowItem += '<li class="hist_receipt_failed_payment">'
	            		+ 	messages['summaryView.failed']
	            		+ 	transactionObj.billerName
	            		+ 	accountNickname
	            		+ '</li>';
            } else if(transactionObj.status === "RETURNED" || transactionObj.status == "RETURN_PENDING"){
            	rowItem	+='<li class="hist_receipt_failed_payment">'
            			+ 	messages['summaryView.returned']
            			+ 	transactionObj.billerName
            			+ 	accountNickname
                    	+ '</li>';
             }  else {
                rowItem += '<li>'
                		+ 	transactionObj.billerName
                		+ 	accountNickname
                		+ '</li>';
            }
        }
    }
    rowItem += '</ul>'
            + '<div class="history_detail_sec">'
            + 	'<div class=' + dynamicCss + '>' + dyanmicTextForHistory + '</div>'
            + '</div>'
            + '<div class="history_detail_sec">'
            + 	'<div class=' + dynamicCss + '>' + getFormatedNumber(cartInfo[cartId].paymentTotal, true) + '</div>'
            + '</div>';
    
    /* Following code segment is used for new credit issued. */
    if(initAppFeatureName["CHECKOUT"] && creditsArray){
    	 for (var indexCount in creditsArray) {
    		 if(creditsArray[indexCount].createdByCartId === cartId && creditsArray[indexCount].creditType === "CHECKOUT"){
    			 rowItem += '<div class="clear"></div><div class="history_detail_sec">'
    	                	+ 	'<div class="history_summary_detail_txt dark-blue capital_first">' + messages['summaryView.newCreditMsg'] + '</div>'
    	                	+ '</div>'
    	                	+ '<div class="history_detail_sec">'
    	                	+ 	'<div class="history_summary_detail_txt dark-blue">' 
    	                	+		getFormatedNumber(creditsArray[indexCount].origAmount, true) 
    	                	+ 	'</div>'
    	                	+ '</div>'; 
    		 }
    	 }
    }
    /* End section */
    rowItem += '</td>'
            + '<td id="paymentDateId">'
            + 	cartId
            + '</td>'
            + '<td>'
            + 	'<div class="fa fa-print fa-2x pay_his_print_icon" title="Print" onclick="printSaveEmailPDF(' + cartId + ',' 
            +		cartCreatedDateMap[cartId] + ',\'PRINT\');" ></div>'
            + 	'<div class="fa fa-save fa-2x pay_his_save_icon" title="Save" onclick="printSaveEmailPDF(' + cartId + ',' 
            +		cartCreatedDateMap[cartId] + ',\'SAVE\');" ></div>'
            + 	'<div class="fa fa-envelope-o fa-2x pay_his_email_icon" title="Email" onclick="printSaveEmailPDF(' + cartId + ',' 
            +		cartCreatedDateMap[cartId] + ',\'EMAIL\');" ></div>'
            + '</td>'
            + '</tr>';
    
    return rowItem;
}

/********************************************************************************************
' Name                 :   getStatusForRejected
' Return type          :   boolean
' Input Parameter(s)   :   transactionObj
' Purpose              :   This method is used to get the REJECTED related status.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   2nd July, 2013    -   Ravi Raj
'*******************************************************************************************/
function getStatusForRejected(transactionStatus){
	/* Checking for the transaction status and below are satisfied then return true */
	if(transactionStatus === rejected_typeConstants.REJECTED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_POSTING_CATEGORY_CHANGED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_INVALID_PAYMENT_AMOUNT ||
		transactionStatus === rejected_typeConstants.SCHEDULED_VELOCITY_LIMIT_EXCEEDED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_PAYMENT_CARD_FAILED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_PROGRAM_ENDED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_NOT_AUTHED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_POSTING_WINDOW_EXPIRED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_BAN_VELOCITY_LIMIT_EXCEEDED ||
		transactionStatus === rejected_typeConstants.SCHEDULED_CANCELLED_CARD_NO_LONGER_AVAILABLE){
		return true;
	}
}

/********************************************************************************************
 ' Name                 :   createRowForReturnedPayment
 ' Return type          :   String rowItem
 ' Input Parameter(s)   :   int cartId, Object summaryViewObject, Object transactionArray, Object creditsArray
 ' Purpose              :   This method is used for handling the error for BP_CART_HIST.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   18th July, 2013    -   Ravi Raj
 '*******************************************************************************************/
function createRowForReturnedPayment(cartId, summaryViewObject, transactionArray, creditsArray) {
	var rowItem = "";
	var origAmount=0;
	for (var index in transactionArray) {
		/*  Checking if cartId (from summaryViewObject) is matched with transaction array and status is returned then create a row item */
		var totalReturnCredits=0;
        if (transactionArray[index].cartId === cartId && (transactionArray[index].status === "RETURNED")) {
        	var transactionObj = transactionArray[index];
        	var billPayAccountId=transactionArray[index].billPayAccountId;
        	var accountNickname = "";
        	if(transactionObj.billerName != transactionObj.accountNickname) {
        		accountNickname =	' (' + transactionObj.accountNickname + ')' ;
            }
            rowItem = rowItem + '<tr>'
	                    + '<td>'
	                    + 	convertToDatemmddyyForHistory(summaryViewObject[cartId].updatedDate)
	                    + '</td>'
	                    + '<td>'
	                    + 	'<div class="history_summary_detail_hdtxt">'
	                    +		'<a href="javascript:void(0)" onclick="navigateToReceiptView(' 
	                    +			cartId + ', false, true);" >' 
	                    + 			" "
	                    + 			messages['detailView.billReturn'] 
	                    + 		'</a>'
	                    +	'</div>'
	                    + 	'<ul id="hist_rec_vw">'
	                    + 		'<li class="hist_receipt_failed_payment">' 
	                    + 			transactionArray[index].billerName
            			+ 			accountNickname
            			+ 		'</li>'
            			+ 	'</ul>'
            			+ 	'<div class="history_detail_sec fnt_wt">'
	                    + 		'<div class="hist_receipt_failed_payment">' 
	                    + 			messages['paymentHistory.returnAmountText'] 
	                    + 		'</div>'
	                    + 	'</div>'
	                    + 	'<div class="history_detail_sec fnt_wt">'
	                    + 		'<div class="hist_receipt_failed_payment">' 
	                    +			getFormatedNumber(summaryViewObject[cartId].paymentTotal, true) 
	                    + 		'</div>'
	                    + 	'</div>';
            for (var indexCount in creditsArray) {
            	if(creditsArray[indexCount].createdByCartId === cartId ){
            		if(creditsArray[indexCount].creditType === "RETURN" || creditsArray[indexCount].creditType === "PAYMENT_RETURN_CREDIT"){
                    		if((creditsArray[indexCount].returnCartItemId === transactionArray[index].id)
                    				&& transactionArray[index].billPayAccountId === billPayAccountId) {
                    				origAmount = creditsArray[indexCount].origAmount;
                                if (origAmount && origAmount > 0) {
                                	totalReturnCredits += origAmount;
                                }
                    		}
            			}	
            		}
            	}
       
            if(totalReturnCredits > 0) {
            	rowItem	+= 	'<div class="clear"></div><div class="history_detail_sec">'
		                + 		'<div class="history_summary_detail_txt dark-blue capital_first">' 
		                + 			messages['summaryView.newCreditMsg'] 
		                + 		'</div>'
		                + 	'</div>'
		                + 	'<div class="history_detail_sec">'
		                + 		'<div class="history_summary_detail_txt dark-blue">'
            	 		+ getFormatedNumber(totalReturnCredits, true); 
            }
            	rowItem += 		'</div>'
	                    + 	'</div>'
	                    + '</td>'
	                    + '<td id="paymentDateId">'
	                    + 	cartId
	                    + '</td>'
	                    + '<td>'
	                    + 	'<div  class="fa fa-print fa-2x pay_his_print_icon" title="Print" onclick="printSaveEmailPDF(' + cartId + ',' 
	                    +		cartCreatedDateMap[cartId] + ',\'PRINT\',' + transactionArray[index].billPayAccountId +	');" ></div>'
	                    + 	'<div  class="fa fa-save fa-2x pay_his_save_icon" title="Save" onclick="printSaveEmailPDF(' + cartId + ',' 
	                    +		cartCreatedDateMap[cartId] + ',\'SAVE\',' + transactionArray[index].billPayAccountId + ');"  ></div>'
	                    + 	'<div  class="fa fa-envelope-o fa-2x pay_his_email_icon" title="Email" onclick="printSaveEmailPDF(' + cartId + ',' 
	                    +		cartCreatedDateMap[cartId] + ',\'EMAIL\',' + transactionArray[index].billPayAccountId + ');" ></div>'
	                    + '</td>'
	                    + '</tr>';
        }
    }
    return rowItem;
}

/********************************************************************************************
 ' Name                 :   hanldeErrorOfSummaryReceiptViewForUser
 ' Return type          :   void
 ' Input Parameter(s)   :   Object req, Date startTime
 ' Purpose              :   This method is used for handling the error for BP_CART_HIST.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function hanldeErrorOfSummaryReceiptViewForUser(req, startTime,apiName) {
    handleError(req, startTime,apiName);
    
}

/********************************************************************************************
 ' Name                 :   getNewCreditIssed
 ' Return type          :   Double newCreditIssued
 ' Input Parameter(s)   :   Object responseObj, Long cartId
 ' Purpose              :   This method is used to calculate the new credit issued from
 BP_CART_HIST API response object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   17th June, 2013    -   Ravi Raj
 '*******************************************************************************************/
function getNewCreditIssed(creditsArray, cartId) {
    /* Checking creditsArray should not be undefined, null or blank */
    if (creditsArray && creditsArray.length > 0) {
        for (var index in creditsArray) {
            var credits = creditsArray[index];
            /* Matching the cart Id for which we have to return the remaining amount */
            if (credits.createdByCartId === cartId) {
                return credits.origAmount;
            }
        }
    }
    return 0;
}
/********************************************************************************************
 ' Name                 :   summaryReceiptViewForMobile
 ' Return type          :   none
 ' Input Parameter(s)   :   Object summaryViewObject, Object transactionArray, Object creditsArray
 ' Purpose              :   This method is used to create the summary receipt for mobile.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   18 July 2013   -   Ravi Raj
 '*******************************************************************************************/
function summaryReceiptViewForMobile(summaryViewObject, transactionArray, creditsArray) {
    var tableForSummaryViewMobile = "";
    if (summaryViewObject.length === 0) {
        $("#summaryViewTableArea").html("<h5>" + messages['summaryView.msg'] + "</h5>");
        return;
    } else {
        tableForSummaryViewMobile = '<div class="submit_pmt_alertbox">Submitted Payments</div>' + '<div class="receipt_view_desg_hdngbg">'
        							+	'<div class="hist_summary_rcpt_vwhdng_area">' 
        							+		messages['summaryView.paymentDateMobile'] 
        							+ 	'</div>'
        							+ 	'<div class="hist_summary_rcpt_vwhdng_area1">' 
        							+ 		messages['summaryView.detail'] 
        							+ 	'</div>'
        							+ 	'<div class="hist_summary_rcpt_vwhdng_area flt_rght txt_alg">' 
        							+ 		messages['summaryView.receiptId'] 
        							+ 	'</div>'
        							+ '</div>';
        
        /* Sort the array based on milliseconds. */ 
        milliSecondDateArrayForMobile.sort(function(a,b){return b-a;});
        
        /* Iterate over sorted array and find the key by iterating on the matched milliseconds. */
        for(var arrayIndex = 0; arrayIndex < milliSecondDateArrayForMobile.length; arrayIndex++ ){
        	 for (var cartId in summaryViewObject) {
        		 /* Converting from string to integer */
                 cartId = parseInt(cartId);
        		 if( milliSecondDateArrayForMobile[arrayIndex] == summaryViewObject[cartId].updatedDate){
                     if (summaryViewObject[cartId].returnedPayment) {
                         tableForSummaryViewMobile += createRowForReturnedPaymentInMobile(cartId, summaryViewObject, transactionArray, creditsArray);
                     }
                     tableForSummaryViewMobile += summaryViewRowForMobile(cartId, summaryViewObject, transactionArray, creditsArray);
                 }
             }
        }
    }
    $('#summaryViewTableArea').html(tableForSummaryViewMobile);
    $("#summaryViewTableArea").show();
    $("#showSummaryView").show();
    
    /* To hide the progress bar */
    hideProgressBar();
}

/********************************************************************************************
 ' Name                 :   summaryViewRowForMobile
 ' Return type          :   none
 ' Input Parameter(s)   :   int cartId, Object cartInfo, Object transactionArray
 ' Purpose              :   This method is used to create the row for mobile.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   18 July 2013   -   Ravi Raj
 '*******************************************************************************************/
function summaryViewRowForMobile(cartId, cartInfo, transactionArray, creditsArray) {
    var dyanmicTextForHistory = messages['summaryView.totalPaid'];
    var rowItem = "";
    var convertedDate = convertToDatemmddyy(cartInfo[cartId].updatedDate);
	var showUpdatedDate = convertedDate.month + " " + convertedDate.day + ", " + convertedDate.year;
    rowItem = '<div class="hist_summary_rcpt_vw_area mob_pos_rel" onclick="navigateToReceiptView(' + cartId + ');">'
            + 	'<div class="hist_summary_rcpt_vwtxt_area">' 
            + 		showUpdatedDate 
            + 	'</div>'
            + '<div class="hist_summary_rcpt_vwtxt_area1">'
            + 	'<div class="fnt_wt">'
            +		'<a href="#detailReceipt" >' + " " + messages['summaryView.totalBillMsg'] + '</a>'
            +	'</div>'
            + 	'<div>'
            + 		'<ul>';
    for (var index in transactionArray) {
        var transactionObj = transactionArray[index];
        if (transactionObj.cartId == cartId) {
        	var accountNickname = "";
        	if(transactionObj.billerName != transactionObj.accountNickname) {
        		accountNickname = ' (' + transactionObj.accountNickname + ')' ;
            }
            if (getStatusForRejected(transactionObj.status)) {
                rowItem += '<li class="txt_normal hist_receipt_failed_payment">'
                		+ 	messages['summaryView.failed']
                		+ 	transactionObj.billerName
                		+ 	accountNickname
                		+ '</li>';
            } else if(transactionObj.status === "RETURNED" || transactionObj.status == "RETURN_PENDING"){
            	rowItem	+='<li class="hist_receipt_failed_payment">'
	        			+ 	messages['summaryView.returned']
	        			+ 	transactionObj.billerName
	        			+ 	accountNickname
	                	+ '</li>';
         }  else {
                rowItem += '<li class="txt_normal">'
	                	+ 	transactionObj.billerName
	            		+ 	accountNickname
                		+ '</li>';
            }
        }
    }
			    rowItem += '</ul>' 
			    		+ '</div>'
			    		+ '<div class="fnt_wt">' 
			    		+ 	dyanmicTextForHistory + " " + getFormatedNumber(cartInfo[cartId].paymentTotal, true) 
			    		+ '</div>';
    if(initAppFeatureName["CHECKOUT"] && creditsArray){
    	 for (var indexCount in creditsArray) {
    		 if(creditsArray[indexCount].createdByCartId === cartId && creditsArray[indexCount].creditType === "CHECKOUT"){
    			rowItem += '<div class="dark-blue fnt_wt capital_first">'
	                	/*+ 	'<div class="history_summary_detail_txt hist_grn_txt">' */
	                	+ messages['summaryView.newCreditMsg'] 
	                	+ " "
	                	+ getFormatedNumber(cartInfo[cartId].creditIssued, true) 
	                	+ '</div>'; 
    		 }
    	 }
    }
		    rowItem += '</div>'
			            + '<div class="hist_summary_rcpt_vwtxt_area">'
			            + 	'<div align="right">' + cartId + '</div>'            
			            + '</div>'
			            + 	'<i class="expand_icon fa fa-chevron-right"></i>'
			            + '</div><div class="clear"></div>';
    return rowItem;
}

/********************************************************************************************
 ' Name                 :   createRowForReturnedPaymentInMobile
 ' Return type          :   String rowItem
 ' Input Parameter(s)   :   int cartId, Object summaryViewObject, Object transactionArray, Object creditsArray
 ' Purpose              :   This method is used to create the row in mobile layout for return payment.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   18 July 2013   -   Ravi Raj
 '*******************************************************************************************/
function createRowForReturnedPaymentInMobile(cartId, summaryViewObject, transactionArray, creditsArray) {
    var rowItem = "";
    var origAmount=0;
    for (var index in transactionArray) {
    	var totalReturnCredits=0;
        if (transactionArray[index].cartId === cartId && (transactionArray[index].status === "RETURNED")) {
        	var billPayAccountId=transactionArray[index].billPayAccountId;
        	var accountNickname = transactionArray[index].billerName;
        	if(transactionArray[index].billerName != transactionArray[index].accountNickname) {
        		accountNickname = ' (' + transactionArray[index].accountNickname + ')' ;
            }
        	var convertedDate = convertToDatemmddyy(summaryViewObject[cartId].updatedDate);
			var showUpdatedDate = convertedDate.month + " " + convertedDate.day + ", " + convertedDate.year;
            rowItem += '<div class="hist_summary_rcpt_vw_area mob_pos_rel" onclick="navigateToReceiptView(' + cartId + ', false, true);">'
                    + 	'<div class="hist_summary_rcpt_vwtxt_area">' 
                    +		showUpdatedDate 
                    + 	'</div>'
                    + 	'<div class="hist_summary_rcpt_vwtxt_area1">'
                    + 		'<div class="fnt_wt">'
                    +			'<a href="#detailReceipt" >' + " " + messages['detailView.billReturn'] + '</a>'
                    +		'</div>'
                    + 		'<div>'
                    + 			'<ul>'
                    +				'<li class="txt_normal hist_receipt_failed_payment">' 
                    +					accountNickname
                    +				'</li>'
                    + 			'</ul>' 
                    + 		'</div>'
                    + 		'<div class="hist_receipt_failed_payment fnt_wt">' 
                    + 			messages['paymentHistory.returnAmountText'] + " " 
                    + 			getFormatedNumber(summaryViewObject[cartId].paymentTotal, true) 
                    + 		'</div>';
            for (var indexCount in creditsArray) {/* Getting index from creadit array if it is not empty */
            	if(creditsArray[indexCount].createdByCartId === cartId ){/* Condition to match cartId and createByCartId */
            		/* Checking for RETURN and for PAYMENT_RETURN_CREDIT from the creditArray */
            		if(creditsArray[indexCount].creditType === "RETURN" || creditsArray[indexCount].creditType === "PAYMENT_RETURN_CREDIT"){
                    		if((creditsArray[indexCount].returnCartItemId === transactionArray[index].id)
                    			&& transactionArray[index].billPayAccountId === billPayAccountId) {/* Matching billpayAccountId and transactionArray billPayAccountId */
                    				origAmount = creditsArray[indexCount].origAmount;
                                if (origAmount && origAmount > 0) {
                                	totalReturnCredits += origAmount;
                                }
                    		}
            			}	
            		}
            	}
            if(totalReturnCredits > 0) {
            	rowItem += '<div class="dark-blue fnt_wt capital_first">' 
                		+ 	messages['summaryView.newCreditMsg'] 
                		+ 	" " 
	            	 	+ 	getFormatedNumber(totalReturnCredits, true) 
	            		+ '</div>';
            }
	            rowItem += '</div>'
		            	+ '<div class="hist_summary_rcpt_vwtxt_area">'
		                + 	'<div align="right">' 
		                + 		cartId 
		                + 	'</div>'
		                + '</div>'
		                + 	'<i class="expand_icon fa fa-chevron-right"></i>'
		                + '</div>'
		                + '</div>'
		                + '<div class="clear"></div>';
        }
    }
    return rowItem;
}

/********************************************************************************************
 ' Name                 :   storeCartCreatedDate
 ' Return type          :   none
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   This method is used to store cart created date based on cart id which used to genrate PDF.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   17 July 2013   -   pradeepy
 '*******************************************************************************************/
function storeCartCreatedDate(responseJsonObj) {
    var cartDate = new Object();
    var cartArray = responseJsonObj.carts;
    for (var index = 0; index < cartArray.length; index++) {
        cartDate[cartArray[index].id] = cartArray[index].createDate;
    }
    return cartDate;
}
