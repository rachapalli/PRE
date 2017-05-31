var storeHashForBack;
var returnAmount = 0.0;
var rejectedAmount = 0.0;
var paidAmount = 0.0;

/********************************************************************************************
 ' Name                 :   detailReceiptViewForUser
 ' Return type          :   void
 ' Input Parameter(s)   :   cartId, displayPaymentSummary, returnPaymentFlag
 ' Purpose              :   This method is used for call BP_CART_HIST API to show detail view.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   29th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function detailReceiptViewForUser(cartId, displayPaymentSummary, returnPaymentFlag) {
    /* To show the progress bar */
    showProgressBar();
    hideShowCreateAccountDetail();

    var mainContainerId = 'showDetailView';
    var subContainerId = 'detailViewAreaId';
    /* Checking if we are coming here after making a payment then show the payment detail view */
    if (displayPaymentSummary) {
    	$('#detailViewTableArea').empty();
        mainContainerId = 'submittReceipt';
    } else {
    	isMainPaymentPageNeedToRefresh = true;
    	$('#detailViewTableArea').empty();
        $('#showDetailView').css('display', 'block');
    }
    
    /* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
    if (displayPaymentSummary) {
    	showScreenAndSetHeight(mainContainerId, subContainerId);
    } else {
    	showScreenAndSetHeight(mainContainerId, subContainerId);
    }
    handleBpCartReceiptApi(cartId, displayPaymentSummary, returnPaymentFlag);
}

/********************************************************************************************
' Name                 :   handleBpCartReceiptApi
' Return type          :   void
' Input Parameter(s)   :   cartId, displayPaymentSummary, returnPaymentFlag
' Purpose              :   This method is used for call BP_CART_HIST API using constructed request
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   29th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function handleBpCartReceiptApi(cartId, displayPaymentSummary, returnPaymentFlag) {
	/* Hold request parameters and values for request parameters */
    var request = {};
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.cartId = cartId;
    request.userId = eval(getCookie('userId'));

    var call_bp_cart_receipt = new bp_cart_receipt(request, cartId, displayPaymentSummary, returnPaymentFlag);
	call_bp_cart_receipt.call();
}

/********************************************************************************************
' Name                 :   handleBPCartReceiptOnSuccess
' Return type          :   void
' Input Parameter(s)   :   displayPaymentSummary, returnPaymentFlag
' Purpose              :   This method is used handle response of BP_CART_HIST API.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   29th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function handleBPCartReceiptOnSuccess(displayPaymentSummary, returnPaymentFlag) {
	if (!displayPaymentSummary) { /* Condition satisfies then user will get the detail receipt view page using response  */
		successReturnOfApi(returnPaymentFlag, displayPaymentSummary);             		
	} else {
		bCartReceipt = true;
	}
}

/********************************************************************************************
'Name                 :   hideShowCreateAccountDetail
'Return type          :   None
'Input Parameter(s)   :   None
'Purpose              :   This method is used for showing create account box on Detail view
'page for guest user.
'History Header       :   Version   -   Date             -   Developer Name
'Added By             :   1.0       -   19th June, 2013   -   Ravi Raj
'*******************************************************************************************/
function hideShowCreateAccountDetail() {
   var registerUser = parseBoolean(localStorage.getItem("registerUser"));
   if (registerUser === false) {
       $("#createAccountDetailSection").show();
       clearFormData('frmGuestCreateAccDetail'); /* To clear the create profile form data. */
       setExtraMarginForAndroid('createAccountBoxDetail');
       if ($('#chkCreateAccDetail').is(":checked")) { /* To set the create profile area at initial state. */
           showRegFormDetail();
       }
       hideErrorMsgDiv('frmGuestCreateAccDetail', 'errorMainAreaDetail1'); /* To hide the error message DIV's on page load. */
       return;
   }
   $("createAccountDetailSection").remove();
}

/********************************************************************************************
' Name                 :   showRegFormDetail
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to show the create account section and button
' pertaining create account for guest user in detail receipt view page.
' History Header       :   Version   -   Date             -   Developer Name
' Added By             :   1.0       -   19th June, 2013   -   Karuna Mishra
' *******************************************************************************************/
function showRegFormDetail() {
    if (!$('#chkCreateAccDetail').is(":checked")) {
        $("#chkCreateAccDetail").prop('checked', true);
        $("#chkCreateAccIconDetail").removeClass(
                "add_bill_inactiv_chkbox_icon flt_lft");
        $("#chkCreateAccIconDetail").addClass(
                "add_bill_activ_chkbox_icon flt_lft");
        var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
        var arg1 = '</a>';
        var message = formatMessage(messages['checkout.termConditionHistory'], arg0, arg1);
        $("#detailViewTermCond").html(message);
        $("#frmGuestCreateAccDetail").show();
        $("#btnContinueDetail").show();
        $("#createAccountBoxErrDivDetail").show();
        
        /* Show the check box for marketing Opt in */
        createOptInMsgAorBSection("chkOptInEnhDetail", "optInEhnChkDetail", messages['createAccount.optInEnh']);
        fillDataFromUserGetProfileObject("emailIdDetail", "confrmEmailIdDetail", "mobileNoDetail", "zipCodeDetail");

        validateCreateProfileDetail();

        /* To be called from fieldValidator.js*/
        addHeightClass('errorSepratorDetail1');
        addHeightClass('errorSepratorDetail2');
        addHeightClass('errorSepratorDetail3');
        addHeightClass('errorSepratorDetail4');
        addHeightClass('errorSepratorDetail5');
        enableDetailCreateSubmitButton();
        /*enableDisableSubmit('frmGuestCreateAccDetail', 'btnContinueDetail');*/
    } else {
        $("#chkCreateAccDetail").prop('checked', false);
        $("#chkCreateAccIconDetail").removeClass(
                "add_bill_activ_chkbox_icon flt_lft");
        $("#chkCreateAccIconDetail").addClass(
                "add_bill_inactiv_chkbox_icon flt_lft");
        $("#frmGuestCreateAccDetail").hide();
        $("#btnContinueDetail").hide();
        $("#createAccountBoxErrDivDetail").hide();
        
        /* To be called from fieldValidator.js */
        removeHeightClass('errorSepratorDetail1');
        removeHeightClass('errorSepratorDetail2');
        removeHeightClass('errorSepratorDetail3');
        removeHeightClass('errorSepratorDetail4');
        removeHeightClass('errorSepratorDetail5');
    }
}

/********************************************************************************************
' Name                 :   validateCreateProfileDetail
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for validating the create account field in
' Detail view page.
' History Header       :   Version   -   Date             -   Developer Name
' Added By             :   1.0       -   19th June, 2013   -   Karuna Mishra
' *******************************************************************************************/
function validateCreateProfileDetail() {
    $('#emailIdDetail').blur(function () {
    	this.value = this.value.toLowerCase();
        validateEmailInfo('emailIdDetail', 'errorMainAreaDetail1', 'invalidMsgDetail1', messages['createAccount.invalidEmailMsg'],
                          'frmGuestCreateAccDetail', 'btnContinueDetail', 'detailViewAreaId');
    });

    $('#confrmEmailIdDetail').blur(function () {
    	this.value = this.value.toLowerCase();
        validateReenterEmail('emailIdDetail', 'confrmEmailIdDetail', 'errorMainAreaDetail2', 'invalidMsgDetail2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestCreateAccDetail', 'btnContinueDetail', 'detailViewAreaId');
    });

    $('#passwordDetail').blur(function () {
        passwordMatchUserName('emailIdDetail', 'passwordDetail', 'errorMainAreaDetail3', 'invalidMsgDetail3',
                              messages['createAccount.invalidpasswordMsgSame'], 'frmGuestCreateAccDetail', 'btnContinueDetail','detailViewAreaId');
    });

    $('#mobileNoDetail').blur(function () {
        validatePhoneInfo('mobileNoDetail', 'errorMainAreaDetail4', 'invalidMsgDetail4', messages['createAccount.invalidphoneMsg'],
                          'frmGuestCreateAccDetail', 'btnContinueDetail','detailViewAreaId');
    });

    $('#zipCodeDetail').blur(function () {
        validateZipcodeInfo('zipCodeDetail', 'errorMainAreaDetail5', 'invalidMsgDetail5', messages['createAccount.invalidzipCodeMsg'],
                            'frmGuestCreateAccDetail', 'btnContinueDetail', 'detailViewAreaId');
    });
    customKeypressValidator('mobileNoDetail');
}

/*************************************************************************************
' Name					:		successReturnOfApi 
' Return type			:		void
' Input Parameter(s)	:		returnPaymentFlag, displayPaymentSummary
' Purpose				:		This method is used to check the API response and show the
' detail receipt view on the basis of response.
' History Header 		: 		Version 	-  	Date 			-	Developer Name 
' Added By 				:		1.0 		- 	18 July, 2013	- 	Ravi Raj 
' ************************************************************************************/
function successReturnOfApi(returnPaymentFlag, displayPaymentSummary) {
    /* Get the transaction array from response object*/
    var submittedBills = bp_cart_receipt_obj.submittedBills;
    /* To designing the layout only when transaction exists in the response */
    if (submittedBills && submittedBills.length > 0) {
        designDetailReceipt(returnPaymentFlag, displayPaymentSummary);
        return;
    } else {
        $("#detailViewTableArea").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");
        return;
    }
}

/********************************************************************************************
 ' Name                 :   designDetailReceipt
 ' Return type          :   void
 ' Input Parameter(s)   :   returnPaymentFlag, displayPaymentSummary
 ' Purpose              :   This method is used to design the detail receipt area.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   30th May, 2013    -   Ravi Raj
 '*******************************************************************************************/
function designDetailReceipt(returnPaymentFlag, displayPaymentSummary) {
    var detailViewTransaction = new Object();
    var submittedBills = bp_cart_receipt_obj.submittedBills;
    for (var index in submittedBills) {
    	if ($.isNumeric(index)) {
	    	/* Checking if detailViewTransaction contains the object with transactionInfo or not. 
	    	 * If not exists then create a new object and initialize its fields */
	        if (!detailViewTransaction['transactionInfo']) {
	            detailViewTransaction['transactionInfo'] = new Object();
	            detailViewTransaction['transactionInfo'].billAmount = 0;
	            detailViewTransaction['transactionInfo'].fees = 0;
	            detailViewTransaction['transactionInfo'].totalPaid = 0;
	            detailViewTransaction['transactionInfo'].serviceFee = 0;
	        }
	        /* Checking if transaction is not rejected means PAID, PENDING or RETURNED, calculate the payment amount */
	        if (!getStatusForRejected(submittedBills[index].status)) {
	            detailViewTransaction['transactionInfo'].billAmount += submittedBills[index].amount;
	            detailViewTransaction['transactionInfo'].fees += submittedBills[index].fee;
	            detailViewTransaction['transactionInfo'].totalPaid += submittedBills[index].amount 
	            													+ submittedBills[index].fee
	            													+ submittedBills[index].serviceFee;
	            detailViewTransaction['transactionInfo'].serviceFee += submittedBills[index].serviceFee;
	        }
    	}
    }
    /* Calling this method for showing detail receipt view table dynamically. */
    detailReceiptViewForTable(detailViewTransaction, returnPaymentFlag, displayPaymentSummary);
}

/********************************************************************************************
 ' Name                 :   detailReceiptViewForTable
 ' Return type          :   void
 ' Input Parameter(s)   :   detailViewTransaction, returnPaymentFlag, displayPaymentSummary
 ' Purpose              :   This method is used for making payment receipt page dynamically on
 ' the basis of response object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   4th June, 2013    -   Ravi Raj
 '*******************************************************************************************/
function detailReceiptViewForTable(detailViewTransaction, returnPaymentFlag, displayPaymentSummary) {
    var submittedBills = bp_cart_receipt_obj.submittedBills;
    var returnedItemsObject = bp_cart_receipt_obj.returnedItems;
    var fundingSourceObject = bp_cart_receipt_obj.fundingSources;
    var detailReceiptTable = "";
    var dynamicHeader = "";
    var paymentAppliedInfo = new Object();
    paymentAppliedInfo.successBillAmount = 0;
    paymentAppliedInfo.totalPaymentApplied = 0;
    var serviceFeePercentRate = calculateServiceFeePercent(fundingSourceObject);
    /* Checking if user is coming after making a payment(true) or from history */
    if (displayPaymentSummary) {
    	/* Creating the header section and adding the label */
        dynamicHeader = '<div class="pmt_summary_desg_area">'
        				+	'<h2>'
        				+		'<div class="summary_submit_icon"></div>'
		                + 		messages["checkout.lbl_payment_submited"]
		                + 	'</h2>';
    } else {
        dynamicHeader = '<div class="receipt_view_desg_area">';      				
    }
    /* Checking if any transaction exists as API response */
    if (submittedBills !== null && submittedBills.length !== 0) {
        detailReceiptTable += showReceiptId(bp_cart_receipt_obj.cartId, dynamicHeader);
    
    	/* Following code fragment is used to show the bill information amount and fee depending on transaction status. */
		if (returnedItemsObject && returnedItemsObject.length > 0) {
			/* Create the section having biller list and amount in the payment */
			var billHeaderReturn = createReturnHeaderSegment(returnedItemsObject, submittedBills, fundingSourceObject, paymentAppliedInfo);
			detailReceiptTable  += billHeaderReturn
								+ '<div class="history_detail_rcpt_txtsec_b">' 
								+ '<div class="bill_submission_desg_area">';
		}
		
    	var origionalPaymentRows = "";
    	var secForFundingSource = "";
    	/* Iterating through the transaction object to get the transactions /payments information. */
        for (var index = 0; index < submittedBills.length; index++) {
            var postingCatgry = '<span class="fa fa-bolt fa-lg express_icon_history">'
								+ '</span>';
            var accountNickname = submittedBills[index].billerName;
            /* Checking if billerName and accountNickName are not same then show both */
    		if (submittedBills[index].billerName != submittedBills[index].accountNickName) {
    			accountNickname += ' (' + submittedBills[index].accountNickName + ')' ;
            }
    		
            /* Checking PAID status for submitted payments */
            if (checkForPaidStatus(submittedBills[index].status)) {
            	/* Calling method to return the submitted payment row structure */
            	origionalPaymentRows += createSubmittedSecForOriginalReceipt(submittedBills[index], paymentAppliedInfo
            			, accountNickname, postingCatgry);
            	 
            } else if (submittedBills[index].status == detailReceiptConstants.RETURNED) {
            	/* Checking RETURNED status for submitted payments */
            	/* Calling method to return the returned payment row structure */
            	origionalPaymentRows += createReturnedSecForOriginalReceipt(submittedBills[index], accountNickname, postingCatgry);
            } else if (getStatusForRejected(submittedBills[index].status)) { /* Checking REJECTED/failed status for submitted payments */
            	/* Calling method to return the rejected payment row structure */
            	origionalPaymentRows += createRejectedSecForOriginalReceipt(submittedBills[index], accountNickname, postingCatgry);
            }
        }
        
        var includedOriginalPaymentRowsTitle = "";
        if (origionalPaymentRows) {
        	/* Adding Bill Submitted header at top of each receipt */
        	includedOriginalPaymentRowsTitle = '<div class="hist_dt_rcpt_billtxt">'
											+ 		messages['detailView.billSubmitted'] 
											+ 	'</div>'
											+  	origionalPaymentRows;
        }

        /* Adding all the rows after iteration in order to Submitted, then Returned and then Rejected/Failed paymetns. */
        detailReceiptTable += includedOriginalPaymentRowsTitle;
        
        /* Following method calling is used to show payment information (amount and fee), if object have valid payment information. */
        detailReceiptTable += createSectionForAmountAndFee(detailViewTransaction, serviceFeePercentRate);
        detailReceiptTable += '<div class="clear"></div>'
        					+ '<hr class="def_hr_divider mrgn_none" />'
        					+ '<div id="billSubmitAreaDesign" class="bill_submission_desg_area mrgn_bottom5">';
        
       	/* Checking if any funding source exists */
        if (fundingSourceObject && fundingSourceObject.length !== 0) {
        	/* Calling method to design the funding source area section */
        	secForFundingSource = createSectionForFundingSource(fundingSourceObject, paymentAppliedInfo, submittedBills);
        } else {/* Calling method to design section when no funding source available */
        	secForFundingSource = createSecIfNoFudingSource(paymentAppliedInfo);
        }
        detailReceiptTable += secForFundingSource;
        
        /* Following code segment is used to show action button email, print and save. */
        detailReceiptTable += creditsIssuedForReceipt()
        				    + createActionButtonForOrigionalPayment();

        /* This code segment is used to show back button is user come from summary receipt view page. */
        if (!returnPaymentFlag) {
        	if (!displayPaymentSummary) {
        		detailReceiptTable += createSocialMediaSec()
				    				+ '</div>'
				    				+ '<div class="clear"></div>';
			}
        }
    } else { 
    	/* If there is no transaction object returned from API means no
    	 * payment made then show the no history message */
        if (displayPaymentSummary) {
            $("#checkoutPaymentDetailView").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");
        } else {
            $("#detailViewTableArea").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");
        }
        return;
    }
    
    /* Following code fragment is used to show the bill pay credit if user pay more then payment total 
     * and coming from checkout page after making a payment. */
    if (displayPaymentSummary) {
        var billCreditsAmt = 0;
        billCreditsAmt = paymentAppliedInfo.totalPaymentApplied - paymentAppliedInfo.successBillAmount;
        if (billCreditsAmt > 0) {
        	$('#bpCreditLabel').show();
            $("#accountBal").text(getFormatedNumber(billCreditsAmt, true));
        } else {
            $('#bpCreditLabel').hide();
            $("#accountBal").text(getFormatedNumber(0, true));
        }
        $('#paymentSocialMedia').html(createSocialMediaSec());
        
        $('#checkoutPaymentDetailView').html(detailReceiptTable);
    } else { /* Setting the above created structure into respective DIV area if coming from history page */
        $('#detailViewTableArea').html(detailReceiptTable);
        $('#historyDisclaimerId').show();
    }
}

/********************************************************************************************
' Name                 :   showReceiptId
' Return type          :   receiptidSec
' Input Parameter(s)   :   cartId, dynamicHeader
' Purpose              :   This method is used to show the receipt Id on top of receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th Dec, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function showReceiptId(cartId, dynamicHeader) {
	var receiptidSec = dynamicHeader
				     + '<div class="receipt_view_desg_hdngbg bg_lightblue txt_nwmiddle">'
				     + 	'<div class="receipt_view_desg_sec_hd">'
				     + 		messages['detailView.receiptId'] 
				     + 		" " 
				     + 		bp_cart_receipt_obj.cartId
				     + 	'</div>' 
				     + '</div>' 
				     + '<div class="bill_submission_desg_area">'
				     + 	'<div class="history_detail_rcpt_txtsec_b">';
	return receiptidSec;
}

/********************************************************************************************
' Name                 :   calculateServiceFeePercent
' Return type          :   serviceFeePercentRate
' Input Parameter(s)   :   fundingSourceObject
' Purpose              :   This method is used to calculate service fee percent.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th Dec, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function calculateServiceFeePercent(fundingSourceObject) {
	var serviceFeePercentRate = 0;
		for (var index in fundingSourceObject) {
			if (fundingSourceObject[index].cardBrand && fundingSourceObject[index].tenderType) {
				serviceFeePercentRate = fundingSourceObject[index].serviceFeePercentRate;
			}
		}
	return serviceFeePercentRate;
}

/********************************************************************************************
' Name                 :   createReturnHeaderSegment
' Return type          :   billHeaderReturn
' Input Parameter(s)   :   returnedItemsObject, submittedBills, fundingSourceObject
' Purpose              :   This method is used for making return header segment.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createReturnHeaderSegment(returnedItemsObject, submittedBills, fundingSourceObject) {
	var billHeaderReturn = '<div class="hist_dt_rcpt_billtxt">'
						 + 	messages['detailView.billReturn.aftersubmission']
						 + '</div>';
	var accountNickName = '';
	/* Code for iterating transaction array but create row for only return payment. */
	for (var index = 0; index < returnedItemsObject.length; index++) {
		for (var indexOne in submittedBills) {
			if (returnedItemsObject[index].cartItemId === submittedBills[indexOne].id) {
				accountNickname = submittedBills[indexOne].billerName;
				if (submittedBills[indexOne].billerName != submittedBills[indexOne].accountNickName) {
					accountNickName += ' (' + submittedBills[indexOne].accountNickName + ')' ;
			    }
			}
		}
		billHeaderReturn +=	'<div class="main_txt_wrap_area">'
							+ 		'<div id="accNickName" class="history_detail_rcpt_dtarea_a field red_txt">'
							+ 			accountNickname
							+ 		'</div>'
							+ 		'<div id="accAmountVal" class="history_detail_rcpt_dtarea_b field red_txt txt_nwrght content_txt_wrap">'
							+ 			getFormatedNumber(returnedItemsObject[index].originalAmount, true)
							+ 		'</div>'
							+	'</div>';
		
		billHeaderReturn    += createPayementMethodSection(fundingSourceObject, returnedItemsObject[index]);
							
	}
		billHeaderReturn += '</div>'; 
	return billHeaderReturn;
}

/********************************************************************************************
' Name                 :   createPayementMethodSection
' Return type          :   paymentMethodSec
' Input Parameter(s)   :   fundingSourceObject, returnedItemsObject, 
' Purpose              :   This method is used for making payment method section for Cash and Card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createPayementMethodSection(fundingSourceObject, returnedItemsObject) {
	var paymentMethodSec = "";
	/* Checking for the available funding source object */
	if (fundingSourceObject && fundingSourceObject.length !== 0) {
		paymentMethodSec += '<div class="hist_dt_rcpt_billtxt fnt_wtn">'
						 + 		messages['detailView.fundsReturnedToYou'] 
						 + 	'</div>';
		/* This code is used to show credit applied if user have their bill pay credit. */
		if (returnedItemsObject.fundingSources.length != 0 && returnedItemsObject.fundingSources) {
			for ( var index = 0; index < fundingSourceObject.length; index++) {
				for (var indexOne in returnedItemsObject.fundingSources) {
					if (returnedItemsObject.fundingSources[indexOne].id === fundingSourceObject[index].id) {
						/* Getting the card brand from funding source */
						var cardBrand = fundingSourceObject[index].cardBrand;
						var tenderType = fundingSourceObject[index].tenderType;
						/* Condition to check whether cardType is CREDIT or DEBIT */
						if (tenderType === detail_view_typeConstants.CREDIT || tenderType === detail_view_typeConstants.DEBIT) {
							var cardTxt = getCardBrandTextDetail(cardBrand);
							var convertedDate = convertToDatemmddyy(convertTimeToPST(returnedItemsObject.returnDate));
							var showProjectedPostingDate = convertedDate.month + " " + convertedDate.day + ", " + convertedDate.year;
							paymentMethodSec	+= getReturnFundingSec(tenderType, cardTxt, fundingSourceObject[index].cardLast4
									, returnedItemsObject.fundingSources[indexOne].amount, showProjectedPostingDate); 	

							paymentMethodSec    +=	getReturnCredits(returnedItemsObject.creditsGenerated);
							
							paymentMethodSec 	+= '<div class="mrgn_bottom25 clear wid_flt100"></div>';
						}
					}
				}
			} 
		} else {
			paymentMethodSec    +=	getReturnCredits(returnedItemsObject.creditsGenerated);
			
			paymentMethodSec 	+= '<div class="mrgn_bottom15 clear wid_flt100"></div>';
		}
		
	}else { /* If there is no funding source object is available*/
		paymentMethodSec += '<div class="history_detail_rcpt_txtsec_b">'
						 +	'<div class="hist_dt_rcpt_billtxt wid_area100">';
	}
	return paymentMethodSec;
}

/********************************************************************************************
' Name                 :   getReturnFundingSec
' Return type          :   paymentMethodSec
' Input Parameter(s)   :   tenderType, cardTxt, cardLast4, amount, showProjectedPostingDate
' Purpose              :   This method is used to get returned payment fundign information.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function getReturnFundingSec(tenderType, cardTxt, cardLast4, amount, showProjectedPostingDate) {
	var paymentMethodSec 	= '<div class="receipt_vw_row_area">'
							+ 	'<div class="history_detail_rcpt_dtarea_a mrgn_topsect">'
							+ 		formatMessage(messages['detailView.endingTxt'], tenderType, cardTxt, cardLast4)
							+ 	'</div>'
							+	'<div class="history_detail_rcpt_dtarea_b mrgn_topsect txt_nwrght">'
							+ 		getFormatedNumber(amount, true)
							+ 	'</div>'
							+  '</div>'
							+	'<div class="receipt_vw_row_area fnt_itc">'
							+		'<div class="history_detail_rcpt_dtarea_a mrgn_topsect">'
							+ 			formatMessage(messages['detailView.paymentRefundedOn'], showProjectedPostingDate)
							+ 		'</div>'
							+ 	'</div>';
	return paymentMethodSec;
}

/********************************************************************************************
' Name                 :   getReturnCredits
' Return type          :   returnCreditSection
' Input Parameter(s)   :   creditsGenerated
' Purpose              :   This method is used to get the returned payment credits.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function getReturnCredits(creditsGenerated) {
	var returnCreditSection = '';
	if (creditsGenerated) {
		returnCreditSection	+= '<div class="receipt_vw_row_area">'
							+ 	'<div class="history_detail_rcpt_dtarea_a mrgn_topsect hist_grn_txt">'
							+ 		messages['detailView.creditsGenerated']
							+ 	'</div>'
							+ 	'<div class="history_detail_rcpt_dtarea_b mrgn_topsect txt_nwrght hist_grn_txt">'
							+ 		getFormatedNumber(creditsGenerated, true)
							+ 	'</div>'
							+ '</div>';
	}
	return returnCreditSection;
}

/********************************************************************************************
' Name                 :   createSubmittedSecForOriginalReceipt
' Return type          :   secForOrigRecpt
' Input Parameter(s)   :   submittedBills, paymentAppliedInfo, accountNickname, postingCatgry
' Purpose              :   This method is used for making billes submitted section for origional receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSubmittedSecForOriginalReceipt(submittedBills, paymentAppliedInfo, accountNickname, postingCatgry) {
	var secForOrigRecpt = '<div class="receipt_vw_row_area mrgn_top12">'
						+	'<div class="main_txt_wrap_area">'
        				+ 		'<div id="accNickName" class="history_detail_rcpt_dtarea_a">'
        				+ 			accountNickname
        				+ 		'</div>'
        				+ 		'<div id="accAccountVal" class="history_detail_rcpt_dtarea_b txt_nwrght">'
        				+ 			getFormatedNumber(submittedBills.amount, true)
        				+ 		'</div>'
						+	'</div>';
	paymentAppliedInfo.successBillAmount += submittedBills.amount;
	
	/* Display fee with biller processing speed if not 0 */
	if (submittedBills.fee > 0 && submittedBills.expressFlag) {
		secForOrigRecpt += '<div class="history_detail_rcpt_dtarea_a hist_dt_rcpt_proc_fee fnt_itc">'
            			+ 		messages['detailView.expressFee']
						+			postingCatgry
            			+ 	'</div>'
            			+ 	'<div class="history_detail_rcpt_dtarea_b hist_dt_rcpt_proc_fee fnt_itc txt_nwrght">'
            			+ 		getFormatedNumber(submittedBills.fee, true)
            			+ 	'</div>';
		paymentAppliedInfo.successBillAmount += submittedBills.fee;
	}
	
	/* Checking if the respective project posting date is available or not */
	if (submittedBills.projectedPostingDate) {
		var convertedDate = convertToDatemmddyy(convertTimeToPST(submittedBills.projectedPostingDate));
		var showProjectedPostingDate = convertedDate.month + " " + convertedDate.day + ", " + convertedDate.year;
		secForOrigRecpt += '<div class="history_detail_rcpt_dtarea_a hist_dt_rcpt_proc_fee">'
						+ 		'<div class="fnt_itc">' 
						+ 			messages['detailView.deliveryby'] 
						+ 			" "
						+ 			showProjectedPostingDate /* Converting it into date format */
						+ 		'</div>'
						+ 	'</div>';
	}
	
	secForOrigRecpt += '</div>';
	
	return secForOrigRecpt;
}

/********************************************************************************************
' Name                 :   createReturnedSecForOriginalReceipt
' Return type          :   secForOrigRecpt
' Input Parameter(s)   :   submittedBills, accountNickName, postingCatgry
' Purpose              :   This method is used for making billes returned section for origional receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createReturnedSecForOriginalReceipt(submittedBills, accountNickName, postingCatgry) {
	var secForOrigRecpt = '<div class="receipt_vw_row_area red_txt fnt_wt mrgn_top12">'
						+ 	'<div class="history_detail_rcpt_dtarea_a">'
						+ 	'</div>'
						+ '</div>'
						+ '<div class="receipt_vw_row_area red_txt">'
						+	'<div class="main_txt_wrap_area">'
						+ 		'<div id="accNickName" class="history_detail_rcpt_dtarea_a">'
						+ 			accountNickName
						+ 		'</div>'
						+ 		'<div id="accAmountValReturn" class="history_detail_rcpt_dtarea_b txt_nwrght">'
						+ 			getFormatedNumber(submittedBills.amount, true)
						+ 		'</div>'
						+	'</div>';
	/* Delivery time for the returned bills */
	if (submittedBills.fee > 0) {
		secForOrigRecpt += '<div class="history_detail_rcpt_dtarea_a ">'
						+ 		messages['detailView.expressFee']
						+			 postingCatgry
						+ 	'</div>'
						+ 	'<div class="history_detail_rcpt_dtarea_b txt_nwrght ">'
						+ 		getFormatedNumber(submittedBills.fee, true)
						+ 	'</div>';
	}
	secForOrigRecpt += '</div>';
	return secForOrigRecpt;
}

/********************************************************************************************
' Name                 :   createRejectedSecForOriginalReceipt
' Return type          :   secForOrigRecpt
' Input Parameter(s)   :   submittedBills, accountNickName, postingCatgry
' Purpose              :   This method is used for making billes failed section for origional receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createRejectedSecForOriginalReceipt(submittedBills, accountNickName, postingCatgry)  {
	
	var secForOrigRecpt = '<div class="receipt_vw_row_area hist_receipt_failed_payment fnt_wt mrgn_top12 red_hist_receipt_failed_payment">'
				 		+ 	'<div class="history_detail_rcpt_dtarea_a">'
				 		+ 		messages['detailView.billFailed']
				 		+ 	'</div>'
				 		+ '</div>' 
						+ '<div class="receipt_vw_row_area hist_receipt_failed_payment red_hist_receipt_failed_payment">'
						+	'<div class="main_txt_wrap_area">'
		               	+ 		'<div id="accNickName" class="history_detail_rcpt_dtarea_a">'
		               	+ 			accountNickName
		               	+ 		'</div>'
		               	+		'<div id="accAmountValRejected" class="history_detail_rcpt_dtarea_b txt_nwrght">' 
		               	+ 			getFormatedNumber(submittedBills.amount, true)
		               	+ 		'</div>'
		               	+ 	'</div>';
	
	/* Check if fee is not 0 then show fee with biller processing speed */
   if (submittedBills.fee > 0) {
	   secForOrigRecpt += '<div class="history_detail_rcpt_dtarea_a hist_receipt_failed_payment">'
	               		+ 	messages['detailView.expressFee']
	   					+		postingCatgry
	               		+ '</div>'
	               		+ '<div class="history_detail_rcpt_dtarea_b txt_nwrght hist_receipt_failed_payment">' 
	               		+	getFormatedNumber(submittedBills.fee, true)
	               		+ '</div>';
   }
   secForOrigRecpt += '<div id="viewDetailsId" >'						
	   					+ '<span id="failedLinkId" class="underline" onclick="billSubmissionFailedPopup(\'' + submittedBills.billPayResponseMsg.replace(/'/g, "\\'") + '\')">'
	   					+ messages['detailView.viewText'] 
   						+'</span></div>'
	   					+ '</div>';
   return secForOrigRecpt;
}

/********************************************************************************************
' Name                 :   createSectionForAmountAndFee
' Return type          :   secForAmtAndFee
' Input Parameter(s)   :   detailViewTransaction, serviceFeePercentRate
' Purpose              :   This method is used for making amount and fee section for origional receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSectionForAmountAndFee(detailViewTransaction, serviceFeePercentRate) {
	var secForAmtAndFee = "";
	/* Checking if the bill amount is available in transaction */
    if (detailViewTransaction.transactionInfo.billAmount || detailViewTransaction.transactionInfo.billAmount === 0) {
    	secForAmtAndFee += '<div class="receipt_vw_row_area mrgn-top">';
        if (detailViewTransaction.transactionInfo.serviceFee && serviceFeePercentRate > 0) {
        	secForAmtAndFee += '<div class="history_detail_rcpt_dtarea_a">'
        						+ 	formatMessage(messages['receipt.serviceFee'], serviceFeePercentRate)
        						+ '</div>'
        						+ '<div class="history_detail_rcpt_dtarea_b txt_nwrght">'
        						+ 	getFormatedNumber(detailViewTransaction.transactionInfo.serviceFee, true)
        						+ '</div>';
        }
        if (bp_cart_receipt_obj.returnedItems.length > 0) {
        	secForAmtAndFee += '</div>';
        }
        
        secForAmtAndFee += '</div>'
	                       + '</div>'
	                       + '<div class="hist_dt_rcpt_total_paid">'
	                       + 	'<div class="receipt_view_total_paid total-bill">'
	                       + 		messages['detailView.totalPaid']
        				   +    '</div>'
        				   +	'<div class="receipt_view_total_paid txt_nwrght">'
	                       + 		getFormatedNumber(detailViewTransaction.transactionInfo.totalPaid, true)
	                       + 	'</div>'
	                       + '</div>' 
	                       + '</div>';
    } else {
    	secForAmtAndFee += '</div></div>';
    }
    return secForAmtAndFee;
}

/********************************************************************************************
' Name                 :   createSectionForFundingSource
' Return type          :   void
' Input Parameter(s)   :   fundingSourceObject, paymentAppliedInfo, submittedBills
' Purpose              :   This method is used for making amount and fee section for origional receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSectionForFundingSource(fundingSourceObject, paymentAppliedInfo, submittedBills) {
	var secForFundingSource = '<div class="history_detail_rcpt_txtsec_b">'
	                        + 	'<div class="hist_dt_rcpt_billtxt">'
	                        + 		messages['detailView.paymentMethod'] 
	                        + 	'</div>';
    /* This code is used to show credit applied if user have their bill pay credit. */
	secForFundingSource += showCreditsSec(paymentAppliedInfo, fundingSourceObject);
    /* This code segment is used to show payment method of bills. */
    for (var index = 0; index < fundingSourceObject.length; index++) {
    	/* Getting sourceType and cardType from fundingSourceObject of CART_RECEIPT response */
    	var type = fundingSourceObject[index].type;
		/* condition to check cardType is matched DEBIT or CREDIT */
		if ((type.indexOf(detail_view_typeConstants.CREDIT) 
				|| type.indexOf(detail_view_typeConstants.DEBIT)) 
				&& fundingSourceObject[index].cardBrand) {
			var cardTxt = getCardBrandTextDetail(fundingSourceObject[index].cardBrand);
			secForFundingSource += cardTypeFundingInfo(fundingSourceObject[index].tenderType, cardTxt, fundingSourceObject[index]
				, paymentAppliedInfo, submittedBills);
				
		} else if (checkForFundingSource(type)) {
			 /* Condition to check cash options are equal to BLACKHAWK or  PRECASH or VANILLA */
			secForFundingSource += cashTypeFundingInfo(type, fundingSourceObject[index], paymentAppliedInfo);
				
		} else if (type === detail_view_typeConstants.PROMOCODE) {
			/* condition to check cardType is matched PromoCode */
			secForFundingSource += promoTypeFundingInfo(type, fundingSourceObject[index], paymentAppliedInfo);
		} 
    }
    secForFundingSource += '</div>'
			            + '<div class="hist_dt_rcpt_total_paid">'
			            + 	'<div class="receipt_view_total_paid total-bill">'
			            + 		messages['receipt.paymentApplied']
    					+   '</div>'
    					+ 	'<div class="receipt_view_total_paid txt_nwrght">'
			            + 		getFormatedNumber(paymentAppliedInfo.totalPaymentApplied, true)
			            + 	'</div>'
			            + '</div>';
    
    return secForFundingSource;
}

/********************************************************************************************
' Name                 :   cardTypeFundingInfo
' Return type          :   secForFundingSource
' Input Parameter(s)   :   tenderType, cardTxt, fundingSourceObject, paymentAppliedInfo
' Purpose              :   This method is used to get the card type funding information.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   23rd Jan, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function cardTypeFundingInfo(tenderType, cardTxt, fundingSourceObject, paymentAppliedInfo, submittedBills) {
	var secForFundingSource = '<div class="receipt_vw_row_area mrgn_topsect">'
							+ 	'<div class="history_detail_rcpt_dtarea_a">'
							+ 		formatMessage(messages['detailView.endingTxt'], tenderType, cardTxt, fundingSourceObject.cardLast4)
							+ 	'</div>'
							+ 	'<div class="history_detail_rcpt_dtarea_b txt_nwrght">'
							+ 		getFormatedNumber(fundingSourceObject.amountUsed, true)
							+ 	'</div>'
							+	getChargedOn(submittedBills)
							+ '</div>';
		
	paymentAppliedInfo.totalPaymentApplied += fundingSourceObject.amountUsed;
	return secForFundingSource;
}

/********************************************************************************************
' Name                 :   getChargedOn
' Return type          :   chargedOnSec
' Input Parameter(s)   :   submittedBills
' Purpose              :   This method is used to get the charged on sec with the date.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function getChargedOn(submittedBills) {
	var chargedOnSec = '';
	for (var index = 0; index < submittedBills.length; index++) {
		if (submittedBills[index].submitDate) {
			var convertedDate = convertToDatemmddyy(convertTimeToPST(submittedBills[index].submitDate));
			var submitDate = convertedDate.month + " " + convertedDate.day + ", " + convertedDate.year;
			chargedOnSec += '<div class="history_detail_rcpt_dtarea_a">'
						+ 		'<div class="fnt_itc">' 
						+ 			messages['detailview.chargedOn'] 
						+ 			" "
						+ 			submitDate /* Converting it into date format */
						+ 		'</div>'
						+ 	'</div>';
			break;
		}
	}
	return chargedOnSec;
}

/********************************************************************************************
' Name                 :   cashTypeFundingInfo
' Return type          :   secForFundingSource
' Input Parameter(s)   :   tenderType, fundingSourceObject, paymentAppliedInfo
' Purpose              :   This method is used to get the cash type funding information.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   23rd Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function cashTypeFundingInfo(tenderType, fundingSourceObject, paymentAppliedInfo) {
	var secForFundingSource = '<div class="receipt_vw_row_area mrgn_topsect">'
							+ 	'<div class="history_detail_rcpt_dtarea_a">'
							+ 		formatMessage(messages['detailView.cashPinMsg'], messages['detailView.cashFundingSource'], tenderType, fundingSourceObject.loadAccountNumber)
							+ 	'</div>'
							+ 	'<div class="history_detail_rcpt_dtarea_b txt_nwrght">'
							+ 		getFormatedNumber(fundingSourceObject.amountUsed, true)
							+ 	'</div>' 
							+ '</div>';	
	paymentAppliedInfo.totalPaymentApplied += fundingSourceObject.amountUsed;
	return secForFundingSource;
}

/********************************************************************************************
' Name                 :   promoTypeFundingInfo
' Return type          :   secForFundingSource
' Input Parameter(s)   :   tenderType, fundingSourceObject, paymentAppliedInfo
' Purpose              :   This method is used for get the promo type funding information.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   23rd Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function promoTypeFundingInfo(tenderType, fundingSourceObject, paymentAppliedInfo) {
	var secForFundingSource = '<div class="receipt_vw_row_area mrgn_topsect">'
							+ 	'<div class="history_detail_rcpt_dtarea_a">'
							+ 		messages['detailView.promoFundingSource'] + ": "
							+ 		fundingSourceObject.loadAccountNumber  
							+ 	'</div>'
							+ 	'<div class="history_detail_rcpt_dtarea_b txt_nwrght">'
							+ 		getFormatedNumber(fundingSourceObject.amountUsed, true)
							+ 	'</div>' 
							+ '</div>';	
	paymentAppliedInfo.totalPaymentApplied += fundingSourceObject.amountUsed;
	return secForFundingSource;
}

/********************************************************************************************
' Name                 :   createSecIfNoFudingSource
' Return type          :   noFundingSource
' Input Parameter(s)   :   paymentAppliedInfo
' Purpose              :   This method is used for making section if no funding source available.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecIfNoFudingSource(paymentAppliedInfo) {
	var noFundingSource = '<div class="history_detail_rcpt_txtsec_b">'
	            		+		'<div class="hist_dt_rcpt_billtxt">'
	            		+			messages['detailView.paymentMethod'] 
	            		+		'</div>';
    /* This code is used to show credit applied if user have their bill pay credit. */
   	noFundingSource += '</div>'
			        + '<div class="hist_dt_rcpt_total_paid">'
			        + 	'<div class="receipt_view_total_paid total-bill">'
			        + 		messages['detailView.paymentApplied']
			        + 	'</div>'
			        + 	'<div class="receipt_view_total_paid txt_nwrght">'
			        + 		getFormatedNumber(paymentAppliedInfo.totalPaymentApplied, true)
			        + 	'</div>'
			        + '</div>';
   	return noFundingSource;
}

/********************************************************************************************
' Name                 :   showCreditsSec
' Return type          :   void
' Input Parameter(s)   :   paymentAppliedInfo, fundingSourceObject
' Purpose              :   This method is used for making section to show the credit section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function showCreditsSec(paymentAppliedInfo, fundingSourceObject) {
	var secForCredits = "";
	for (var index in fundingSourceObject) {
		if (fundingSourceObject[index].type === manageCard_typeConstants.CREDIT) {
			var amountUsed = fundingSourceObject[index].amountUsed != null ? fundingSourceObject[index].amountUsed : 0;
			secForCredits += '<div class="receipt_vw_row_area mrgn_topsect">' 
						+ 		'<div class="history_detail_rcpt_dtarea_a">'
				    	+ 			messages['detailView.creditsApplied'] 
				    	+		'</div>'
				    	+		'<div class="history_detail_rcpt_dtarea_b txt_nwrght">'
				    	+			getFormatedNumber(amountUsed, true)
				    	+		'</div>'
				    	+ 	'</div>';
			paymentAppliedInfo.totalPaymentApplied += amountUsed;
		}
	}
	return secForCredits;
}

/********************************************************************************************
' Name                 :   creditsIssuedForReceipt
' Return type          :   creditsIssuedSec
' Input Parameter(s)   :   None
' Purpose              :   This method is used to show the issued credits for the receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function creditsIssuedForReceipt() {
	var creditsIssuedSec = '';
	if (bp_cart_receipt_obj.creditsGenerated) {
		creditsIssuedSec = '<div class="history_detail_rcpt_txtsec_b">'
						+   '<div class="receipt_vw_row_area fnt_wt">'
						+ 	'<div class="history_detail_rcpt_dtarea_a hist_grn_txt mrgn_left_credit_neg">'
						+ 		messages['detailView.creditsGenerated']
						+ 	'</div>'
						+	'<div class="history_detail_rcpt_dtarea_b txt_nwrght hist_grn_txt mrgn_left_credit_pos">'
						+ 		getFormatedNumber(bp_cart_receipt_obj.creditsGenerated, true)
						+ 	'</div>'
						+ '</div>'
						+ '</div>';
	}
	return creditsIssuedSec;
}

/********************************************************************************************
' Name                 :   createActionButtonForOrigionalPayment
' Return type          :   void
' Input Parameter(s)   :   na
' Purpose              :   This method is used for making action buttons for Original receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Feb, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createActionButtonForOrigionalPayment() {
	var buttonArea =  '<div class="clear"></div>'
					+ '<hr class="def_hr_divider" />'
					+ '<span class="receipt_service_link" onclick="showReceiptDisclosureUrl()">'
					+ '<a href="javascript:void(0)">'
					+ messages['paymentReceipt.disclosureLabel']
					+ '</a>'
					+ '</span>'
				    + '<div class="receipt_vw_action_btnarea">'
				    + 	'<div class="receipt_vw_action_printbtnarea" onclick="printSaveEmailPDF(' 
				    +		bp_cart_receipt_obj.cartId + ',' + bp_cart_receipt_obj.cartCreateDate + ',\'PRINT\');" >'
				    + 		'<div align="center">' 
				    + 			messages['deatilView.printTxt'] 
				    +		'</div><div class="fa fa-print fa-3x receipt_vw_print_btn" title="Print"></div>'
				    + 	'</div>'
				    + 	'<div class="receipt_vw_action_savebtnarea" onclick="printSaveEmailPDF(' 
				    +		bp_cart_receipt_obj.cartId + ',' + bp_cart_receipt_obj.cartCreateDate + ',\'SAVE\');" >' 
				    +		'<div align="center">' 
				    + 			messages['deatilView.saveTxt'] 
				    +		'</div><div class="fa fa-save fa-3x receipt_vw_save_btn" title="Save"></div>' 
				    +	'</div>'
				    + 	'<div class="receipt_vw_action_emailbtnarea" onclick="printSaveEmailPDF(' 
				    +		bp_cart_receipt_obj.cartId + ',' + bp_cart_receipt_obj.cartCreateDate + ',\'EMAIL\');" >'
				    +		'<div align="center">' 
				    + 			messages['deatilView.emailTxt'] 
				    +		'</div><div class="fa fa-envelope-o fa-3x receipt_vw_email_btn mrgn_rght0" title="Email"></div>'
				    + 	'</div>'
				    + '</div>' 
				    + '</div>';
	return buttonArea;
}

/********************************************************************************************
' Name                 :   createSuccessOrFailedArea
' Return type          :   void
' Input Parameter(s)   :   None
' Purpose              :   This method is used for showing success or failed section in main payment page after a payment.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function createSuccessOrFailedArea() {
	var messageSec = "";
	var errorMessageSec = "";
	var successPaymentSec = "";
	var failedPaymentSec = "";
	removeSuccessOrFailureStrip();
	if (bp_cart_receipt_obj) {
		messageSec = getCreditsForConfirmation();
	} else {
		$('#showSubmittConfirmation').text('');
		messageSec = messages['main_pay.confirm_success'];
	}
	if (bp_cart_receipt_obj) {
		for (var index =0; index < bp_cart_receipt_obj.submittedBills.length; index++) {
			var flag = true;
			if (checkForPaidStatus(bp_cart_receipt_obj.submittedBills[index].status)) { /* paymentResponseCode is "00" then show success msg on pop up */
				successPaymentSec += confirmationSuccessSec(bp_cart_receipt_obj.submittedBills[index]);
			} else { /* paymentResponseCode is not equal to "00" then show error msg on pop up */
				if (flag) {
					errorMessageSec = messages['main_pay.confirm_error'];
					flag = false;
				}
				failedPaymentSec += confirmationFailureSec(bp_cart_receipt_obj.submittedBills[index]);
			}
		}
	}
	
	if (bp_scheduled_payment_hist_obj && bp_submit_payment_group_obj && bp_submit_payment_group_obj.paymentGroupId) {
		if (bp_scheduled_payment_hist_obj.scheduledTransactions && bp_scheduled_payment_hist_obj.scheduledTransactions.length > 0) {
			for (var index in bp_scheduled_payment_hist_obj.scheduledTransactions) {
				if (bp_submit_payment_group_obj.paymentGroupId ===  bp_scheduled_payment_hist_obj.scheduledTransactions[index].paymentGroupId) {
					successPaymentSec += confirmationSuccessSec(bp_scheduled_payment_hist_obj.scheduledTransactions[index]);
				}
			}
		}
	}
	$('#showSubmittConfirmation').text(messageSec);
	$('#showErrorConfirmation').text(errorMessageSec);
	if (successPaymentSec) {
		$('#successNameAndAmount').empty();
		$('#submittReceipt').show();
		$(window).scrollTop(0);
	}
	if (failedPaymentSec) {
		$('#failedNameAndAmount').empty();
		$('#errorReceipt').show();
		$(window).scrollTop(0);
	}
	injectSuccessOrFailureSec(successPaymentSec, failedPaymentSec);
}

/********************************************************************************************
' Name                 :   injectSuccessOrFailureSec
' Return type          :   None
' Input Parameter(s)   :   successPaymentSec, failedPaymentSec
' Purpose              :   This method is used to inject SUCCESS or FAILURE payments in to DIV's.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function injectSuccessOrFailureSec(successPaymentSec, failedPaymentSec) {
	if ($("#submittReceipt").is(":visible") && $("#errorReceipt").is(":visible")) {
		$('#successNameAndAmount').empty();
		$('#failedNameAndAmount').empty();
		$('#successNameAndAmount').append(successPaymentSec);
		$('#failedNameAndAmount').append(failedPaymentSec);
	} else if ($("#errorReceipt").is(":visible")) { /* As per the Bug # 4762 For every Failed Payment we are showing on general alert*/
		$('#failedNameAndAmount').empty();
		$('#failedNameAndAmount').append(failedPaymentSec);
	}
}

/********************************************************************************************
' Name                 :   checkForPaidStatus
' Return type          :   Boolean
' Input Parameter(s)   :   status
' Purpose              :   This method is used to check the payment is PAID related on not.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function checkForPaidStatus(status) {
	if (status === paid_typeConstatants.PENDING
			|| status === paid_typeConstatants.PAID
			|| status === paid_typeConstatants.SCHEDULED_PENDING
			|| status === paid_typeConstatants.SCHEDULED_PROCESSING
			|| status === paid_typeConstatants.IN_PROCESS
			|| status === paid_typeConstatants.RETURN_PENDING) {
		return true;
	}
	return false;
}

/********************************************************************************************
' Name                 :   getCreditsForConfirmation
' Return type          :   messageSec
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get the credts section of confirmation view.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function getCreditsForConfirmation() {
	if (bp_cart_receipt_obj.creditsGenerated > 0) {
		$('#showSubmittConfirmation').text('');
		return formatMessage(messages['main_pay.confirm_success_credit']
				, getFormatedNumber(bp_cart_receipt_obj.creditsGenerated, true));
	} else {
		$('#showSubmittConfirmation').text('');
		return messages['main_pay.confirm_success'];
	}
}

/********************************************************************************************
' Name                 :   confirmationSuccessSec
' Return type          :   successPaymentSec
' Input Parameter(s)   :   submittedBills
' Purpose              :   This method is used to get the SUCCESS payment with billername and amount.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function confirmationSuccessSec(submittedBills) {
	var nickName = submittedBills.accountNickName ? submittedBills.accountNickName : submittedBills.billerName;
	var successPaymentSec  = '<div class="wid_flt100">' 
							+    '<div>'
							+ 		'<div class="biller_name" id="nickName_success_overlay">'
							+ 			nickName
							+ 		'</div>'
							+ 		'<div class="biller_amount" id="amount_success_overlay">'
							+ 			getFormatedNumber(submittedBills.amount, true)
							+ 		'</div>'
							+	'</div>'
							+	'</div>';
	return successPaymentSec;
	
}

/********************************************************************************************
' Name                 :   confirmationFailureSec
' Return type          :   failedPaymentSec
' Input Parameter(s)   :   submittedBills
' Purpose              :   This method is used to get the FAILURE payment details like name and amount.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Jan, 2015    -   Umamaheswara Rao
'*******************************************************************************************/
function confirmationFailureSec(submittedBills) {
	var failedPaymentSec = '<div class="wid_flt100">' 
						+    '<div>'
						+ 		'<div class="biller_name" id="nickName_failed_overlay">'
						+ 			submittedBills.accountNickName
						+ 		'</div>'
						+ 		'<div class="biller_amount" id="amountVal_failed_overlay">'
						+ 			getFormatedNumber(submittedBills.amount, true)
						+ 		'</div>'
						+	'</div>'
						+	'</div>';
	return failedPaymentSec;
}

/********************************************************************************************
' Name                 :   billSubmissionFailedPopup
' Return type          :   None
' Input Parameter(s)   :   billPayResponseMsg
' Purpose              :   This method is used to show animated popup for Failed bills.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sep, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function billSubmissionFailedPopup(billPayResponseMsg) {
	$('#forFailedReason').text(billPayResponseMsg);
	showAnimatedPopup('mainIdForBillFailed','forAnimated');		
}

/********************************************************************************************
' Name                 :   getCardBrandTextDetail
' Return type          :   None
' Input Parameter(s)   :   cardBrand
' Purpose              :   This method is used for getting card brand and placing text in receipt.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sep, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function getCardBrandTextDetail (cardBrand) {
	var cardTxt = '';
	return cardBrand === cardBrandConstant.MASTERCARD ? cardTxt = messages['detailView.masterTxt'] : /* Matching card brand for MasterCard */
		   cardBrand === cardBrandConstant.VISA ? cardTxt = messages['detailView.visaTxt'] : /* Matching card brand for VisaCard */
		   cardBrand === cardBrandConstant.DISCOVER_NEW	? cardTxt = messages['detailView.discover'] : cardTxt; /*Matching card brand for DiscoverCard */
}

/********************************************************************************************
' Name                 :   checkForFundingSource
' Return type          :   void
' Input Parameter(s)   :   sourceType
' Purpose              :   This method is used for checking for source type.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sep, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function checkForFundingSource(sourceType) {
	if (sourceType === detail_view_typeConstants.BLACKHAWK
			|| sourceType === detail_view_typeConstants.PRECASH
			|| sourceType === detail_view_typeConstants.VANILLA) {
		return true;	
	}
	return false;
}
