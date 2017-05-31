var checkCartStatusCountdown;

/********************************************************************************************
' Name                 :   triggerCheckCartStatus
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to start calling of BP_CHECK_CART_STATUS api.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   pradeepy
'*******************************************************************************************/
function triggerCheckCartStatus() {
	var cartStatusPingFrequency = Number(localStorage.getItem("cartStatusPingFrequencyMs"));
	checkCartStatusCountdown = setInterval("checkCartStatus('" + bp_submit_payment_group_obj.paymentGroupId + "')", cartStatusPingFrequency);
}

/********************************************************************************************
' Name                 :   checkCartStatus
' Return type          :   none
' Input Parameter(s)   :   paymentGroupId
' Purpose              :   This method is used to call BP_CHECK_CART_STATUS api.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   pradeepy
'*******************************************************************************************/
function checkCartStatus(paymentGroupId) {
	showProgressBar(); /* To show the progress bar */
	/* Hold request object and pass it to API*/ 
	var request = new Object();
	request.userId = eval(getCookie('userId'));
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.paymentGroupId = paymentGroupId;
	var call_bp_check_payment_group_status = new bp_check_payment_group_status(request);
	call_bp_check_payment_group_status.call();
}

/********************************************************************************************
' Name                 :   handleBPCheckPaymentGroupStatusOnSucess
' Return type          :   none
' Input Parameter(s)   :   req
' Purpose              :   This method is used to handle success response of BP_CHECK_CART_STATUS API.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   pradeepy
'*******************************************************************************************/
function handleBPCheckPaymentGroupStatusOnSucess(req){
	/* As per the Bug #4734 We are forcely clearing both the object before proceeding  */
	bp_scheduled_payment_hist_obj = null;
	bp_cart_receipt_obj = null;
	if (bp_check_payment_group_status_obj.paymentGroupStatus === "IN_PROCESS") {
		/* DO NOTHING wait for other response*/ 
		return;
	} else if (bp_check_payment_group_status_obj.paymentGroupStatus === "COMPLETE") {
		gaFinishedPaymentGroup(req.userId, req.paymentGroupId, bp_check_payment_group_status_obj.paymentGroupStatus);
		clearCheckCartStatusTrigger();
		transferToBillsPage(true);
	} else if (bp_check_payment_group_status_obj.paymentGroupStatus === "COMPLETE_SCHEDULED_PAYMENTS_ONLY"){ /* Check for payment status in case of scheduled */ 
        gaFinishedPaymentGroup(req.userId, req.paymentGroupId, bp_check_payment_group_status_obj.paymentGroupStatus);
        clearCheckCartStatusTrigger();
        transferToBillsPage(false);
	} else if (bp_check_payment_group_status_obj.paymentGroupStatus === "INCOMPLETE_FAILED") {
        gaFinishedPaymentGroup(req.userId,req.paymentGroupId,bp_check_payment_group_status_obj.paymentGroupStatus);
        clearCheckCartStatusTrigger();
		/* Invoke BP_GET_CART, Refresh the Checkout page with the contents of the BP_GET_CART response message  */ 
		getPendingTransactions(getCartFundingSourceErrorHandler);
	} else if(bp_check_payment_group_status_obj.paymentGroupStatus === "FAILED_CVV_REQUIRED"){
        gaFinishedPaymentGroup(req.userId,req.paymentGroupId,bp_check_payment_group_status_obj.paymentGroupStatus);
        showCvvRequiredPopup();
        hideProgressBar();
        clearCheckCartStatusTrigger();
	} else if(bp_check_payment_group_status_obj.paymentGroupStatus === "FAILED_CVV_REQUIRED_SCHEDULED_PAYMENTS"){
        gaFinishedPaymentGroup(req.userId,req.paymentGroupId,bp_check_payment_group_status_obj.paymentGroupStatus);
        showDebitCardPopUpError();
	}
}

/********************************************************************************************
' Name                 :   clearCheckCartStatusTrigger
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to stop calling of BP_CHECK_CART_STATUS api.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   pradeepy
'*******************************************************************************************/
function clearCheckCartStatusTrigger() {
	clearIntervalApp(checkCartStatusCountdown);
	checkCartStatusCountdown = '';
}

/*******************************************************************************
 * ' Name 				: getCartFundingSourceErrorHandler
 * ' Return type 		: none 
 * ' Input Parameter(s) : None
 * ' Purpose 			: Show getCart Error pins of funding sources on the checkout page.
 * ' History Header 	: Version 		-	 Date 			-		Developer Name 
 * ' Added By			: 1.0 			- 	2 July 2013 	- 		pradeepy 
 ******************************************************************************/
function getCartFundingSourceErrorHandler(){
	var fundingSourcesArray = bp_get_pending_transaction_obj.fundingSources;
	var showErrorMessageOnce = true;
	for (var index = 0; index < fundingSourcesArray.length; index++) {
		var errorChitPin = (fundingSourcesArray[index].loadAccountNumber).trim();
		var errorChitAmount = fundingSourcesArray[index].amount;
		var errorChitType = fundingSourcesArray[index].type;
		var errorChitStatus = fundingSourcesArray[index].fundingSourceStatus;
		var errorChitErrorMessage = fundingSourcesArray[index].fundingSourceErrorMsg;
		
		if(errorChitType.toUpperCase() == jsonTypeConstant.VESTADEBITVISA.toUpperCase() 
				|| errorChitType.toUpperCase() == jsonTypeConstant.VESTACREDITVISA.toUpperCase() 
				|| errorChitType.toUpperCase() == jsonTypeConstant.VESTADEBITMASTER.toUpperCase()
				|| errorChitType.toUpperCase() == jsonTypeConstant.VESTACREDITMASTER.toUpperCase()
				|| errorChitType.toUpperCase() == jsonTypeConstant.VESTADEBITDISCOVER.toUpperCase()
				|| errorChitType.toUpperCase() == jsonTypeConstant.VESTACREDITDISCOVER.toUpperCase()
				|| errorChitType.toUpperCase() == jsonTypeConstant.PROMOCREDIT.toUpperCase() ){
			if("FAILED" == errorChitStatus || "REVERSAL_ATTEMPT_FAILED" == errorChitStatus){
				if(showErrorMessageOnce){
					showGeneralErrorMsg(errorChitErrorMessage);
	            	showErrorMessageOnce = false;	
	            	hideProgressBar();
				}	
			}
		} else {
			if("FAILED" == errorChitStatus || "REVERSAL_ATTEMPT_FAILED" == errorChitStatus){
				// show all history funds 
				$("#historyFundingSources").show();
				// show edit iocn with total amount
				$("#editCashSummaryTotal").hide();
				// show info text message below the edit icon.
				$("#cashPaymnetInfoMessage").hide();
		        // display error message on new structure
		        $("#historyFundingSources").children().each(function (index) {
					var amount = $(this).find("#historyFundRowAmount").text();
					var pin = $(this).find("#historyFundRowPin").text().trim().replace(/[\<\>\;\-\&\/\s]+/g, "");
					if ("PreCash".toUpperCase() == errorChitType.toUpperCase() && pin.length > 11) {
		                var modifiedApiPin = errorChitPin.substring(errorChitPin.length - 12, errorChitPin.length);
		                var modifiedJspPin = pin.substring(pin.length - 12, pin.length);
		                if (modifiedApiPin == modifiedJspPin &&
		                        getFormatedNumber(errorChitAmount) == getFormatedNumber(amount)) {
		                    // highlight this  div
		                    $(this).find("#apiFundError_redBorder").addClass("error_red_border1");
		                    deActivateCheckoutPayButton();
		                    if( showErrorMessageOnce ){
		                    	showGeneralErrorMsg(errorChitErrorMessage);
		                    	showErrorMessageOnce = false;
		                    }
		                }
		            } else if (errorChitPin == pin && getFormatedNumber(errorChitAmount) == getFormatedNumber(amount)) {
		                // highlight this  div
		                $(this).find("#apiFundError_redBorder").addClass("error_red_border1");
		                deActivateCheckoutPayButton();
		                if( showErrorMessageOnce ){
		                	showGeneralErrorMsg(errorChitErrorMessage);
		                	showErrorMessageOnce = false;
		                }
		            }
		        });
			}
		}
	}
}

/********************************************************************************************
' Name                 :   transferToBillsPage
' Return type          :   none
' Input Parameter(s)   :   isStatusComplete
' Purpose              :   This method is used to transfer to bills page from Payment page 
							when payment completes successfully.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   17 Jun 2014   -   Umamaheshwara Rao
'*******************************************************************************************/
function transferToBillsPage(isStatusComplete) {
	navigateToHome();/* User will navigate to home after completing transaction */
	$('#MainHolder').empty();/* When user returns to home page clearing main holder */
	isInitMainPage = true;
	/* forward user to payment summary page*/
	bp_get_pending_transaction_obj = null;
	bp_account_lite_obj = null;
	bp_hist_obj = null;
	bp_scheduled_payment_hist_obj = null;
	bp_get_pending_transaction_obj = null; /* The above all API response object are clearing by making null */
	bAccount = false;
	bCartHist = false;
	bpSchedPay = false;
	bGetCart = false;
	bGetUserProfile = true;
	bCartReceipt = true; /* These above all flags will be true on Success or Failure */
	getBillerAccounts();
	handleGetLatestBPHistory();
	handleBPSchedulePaymentHist();
	getPendingTransactions(null);
	if(isStatusComplete){
		bCartReceipt = false;
		handleBpCartReceiptApi(bp_check_payment_group_status_obj.cartId, true, null);
	}
	if (!parseBoolean(localStorage.getItem("registerUser"))) {
		bGetUserProfile = false;
		getUserProfile(false, null, false);
	}
	setIntervalOnLoadOfReceipt();/* Calling timer to run checkReceiptApiStatus*/
}

var intervalForReceipt;
/********************************************************************************************
' Name                 :   setIntervalOnLoadOfReceipt
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   To start a timer on home page to check the init api.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   17 Jun 2014   -   Umamaheshwara Rao
'*******************************************************************************************/
function setIntervalOnLoadOfReceipt() {
	/* checkReceiptApiStatus will call every 500 frequency */
   intervalForReceipt = setInterval("checkReceiptApiStatus()", 500);
}

/********************************************************************************************
' Name                 :   checkReceiptApiStatus
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Clear the interval.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   2 July 2013   -   Umamaheshwara Rao
'*******************************************************************************************/
function checkReceiptApiStatus() {
	/* If all the API's are Success or Failure then below flags will be true then confirmation POP Up will render */
 if (bAccount && bGetUserProfile && bCartHist && bCartReceipt && bpSchedPay && bGetCart) {
	 if(intervalForReceipt){
       clearIntervalApp(intervalForReceipt);/* Clearing timer */
       intervalForReceipt = '';
       createSuccessOrFailedArea();/* This method will create structure for the confirmation pop up on main pay page */
       isInitMainPage = false;
       hideProgressBar();
       restartTimerForPopUp();/* Timer will start when there is any confirmation pop up for closing 15 or 30 seconds time interval */
	 }
   }
}
