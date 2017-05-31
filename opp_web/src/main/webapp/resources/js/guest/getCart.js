/* store cart id. */ 
var userCartId = "";
var isRegisterSelected = false;
/********************************************************************************************
' Name                 :   getPendingTransactions
' Return type          :   None
' Input Parameter(s)   :   successResponseHandler
' Purpose              :   This method is used to invoke BP_GET_PENDING_TRANSACTION API to 
							get the payment details such as biller name, amount, fee, credits etc. 
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   18 April 2014   -   Ravi Raj
'*******************************************************************************************/	
function getPendingTransactions(successResponseHandler) {
	showProgressBar(); /* To show the progress bar */
	var request = new Object();
	request.applicationId = applicationId;
	request.userId = eval(getCookie('userId'));
	request.locale = getCookie("locale");
	
	var call_bp_get_pending_transaction = new bp_get_pending_transaction(request, successResponseHandler);
    call_bp_get_pending_transaction.call();
}

/********************************************************************************************
' Name                 :   handleBpGetPendingTransactionsOnSuccess
' Return type          :   None
' Input Parameter(s)   :   successResponseHandler
' Purpose              :   This method is used to handle response of BP_GET_PENDING_TRANSACTION API.
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   18 April 2014   -   Ravi Raj
'*******************************************************************************************/
function handleBpGetPendingTransactionsOnSuccess(successResponseHandler) {
	/* Checking if balance is more than 0 than show it in right Activity pane. */
	if (bp_get_pending_transaction_obj.balance && bp_get_pending_transaction_obj.balance > 0) {
		$('#creditAvbl').show();
		$("#creditAvbl .avl_credit_price").text(getFormatedNumber(bp_get_pending_transaction_obj.balance, true));
	} else {
        $('#creditAvbl').hide();
		$("#creditAvbl .avl_credit_price").text(getFormatedNumber(0, true));
	}
	if (successResponseHandler) {
		successResponseHandler();
		if (!parseBoolean(localStorage.getItem("registerUser"))) {
			if (checkForAnySchedulePayment()) {
				showAnimatedPopup('schedulePayGuestPopUpId', 'guestSchedPayPopup');
			}				
		}
	}
	fillBillPaymentBoxes(bp_get_pending_transaction_obj);
}

/******************************************************************************************************
' Name                 :   checkForAnySchedulePayment
' Return type          :   {Boolean}
' Input Parameter(s)   :   None
' Purpose              :   This will be invoked when guest user trying scheduled a payment 
							because a guest user is not allowed to set a scheduled payment. 
							For this we checks the submitType from BP_GET_PENDING_TRANSACTION API
' History Header       :   Version   -   Date             	 -   Developer Name 
' Added By             :   1.0       -   20th May, 2014      -   Umamaheswara Rao
'*****************************************************************************************************/
function checkForAnySchedulePayment() {
	/* Showing the pop up for guest user, Need to be change the conditions as per dolly 1.6 page 76*/
	for (var index in bp_get_pending_transaction_obj.pendingTransactions) {
		if (bp_get_pending_transaction_obj.pendingTransactions[index].submitType === "SCHEDULED") {
			return true; /* returning for checking condition where the method is called*/
		}
	}
	return false;
}

/******************************************************************************************************
' Name                 :   guestSchedulePayPopupContinueBtn
' Return type          :   {Boolean}
' Input Parameter(s)   :   None
' Purpose              :   This will be invoked on click of Continue as Guest button in Schedule pay popup.
' History Header       :   Version   -   Date             	 -   Developer Name 
' Added By             :   1.0       -   20th May, 2014      -   Umamaheswara Rao
'*****************************************************************************************************/
function guestSchedulePayPopupContinueBtn() {
	closeAnimatedPopup('schedulePayGuestPopUpId', 'guestSchedPayPopup');
	updateSummarySectionFromCashClick();
	clearInterval(timerEnableNextButton);
	timerEnableNextButton = null;
}

/******************************************************************************************************
' Name                 :   fillBillPaymentBoxes
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to set the amount in biller box in main payment page 
                           using get cart response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   13th Sept, 2013      -   Ravi Raj
'*****************************************************************************************************/
function fillBillPaymentBoxes() {
	if (bp_get_pending_transaction_obj && bp_get_pending_transaction_obj.pendingTransactions
			&& bp_get_pending_transaction_obj.pendingTransactions.length > 0) {
		for (var index in bp_get_pending_transaction_obj.pendingTransactions) {
			var pendingTransaction = bp_get_pending_transaction_obj.pendingTransactions[index];
			var billerCorpAccountId = pendingTransaction.billerCorpAccountId;
			if (billerCorpAccountId) {
				setBillPaymentBoxes(pendingTransaction);
				/* Store data into billsDup array as it set for billers */
				billsDup[billerCorpAccountId] = new Object();
				billsDup[billerCorpAccountId].programId = pendingTransaction.programId;
				billsDup[billerCorpAccountId].requestedPostingDate = pendingTransaction.requestedPostDate;
				billsDup[billerCorpAccountId].fee = pendingTransaction.fee;
			}
		}
	}
}

/******************************************************************************************************
' Name                 :   setBillPaymentBoxes
' Return type          :   none
' Input Parameter(s)   :   pendingTransaction
' Purpose              :   This method is used to set the amount, fee, calc submit date, schedule date 
							in biller box for main payment page. 
                           using get cart response.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   06th June, 2014     	-   Raviraj
'*****************************************************************************************************/
function setBillPaymentBoxes(pendingTransaction) {
	/* Getting the billerCorpAccountId from pendingTransction object */
	var billerCorpAccountId = pendingTransaction.billerCorpAccountId;
	if (pendingTransaction.amount) {
		$('#' + billerCorpAccountId).val(pendingTransaction.amount.toFixed(2)); /* Setting the amount into biller boxes */
	}
	var highlightCalenderId = pendingTransaction.requestedPostDate; /* Getting the id to show the respective calendar date highlighted */
	if (highlightCalenderId && pendingTransaction.amount) {
		/* Amount and Date is in getPendingTransactions then enable Date box and fill the in put box with the amount When user refresh the page */
		var calenderBar = $('#calenderBarSec' + billerCorpAccountId).find('#' + getMatchingDateToEnableDate
							(billerCorpAccountId, highlightCalenderId) + '.currenday');
		if (calenderBar) { /* Making the calendar date highlighted */
			$(calenderBar).parent().addClass("bg_green");
		}
	}
	var scheduledSubmitDate = pendingTransaction.scheduledSubmitDate;
	if (scheduledSubmitDate && scheduledSubmitDate > 0) { /* Checking the scheduledSubmitDate to show the charge date message */
		var convertedDate = convertToDatemmddyy(scheduledSubmitDate);
		var showCalcSubmitDate = convertedDate.month + " " + convertedDate.day;
		var currentDate = new Date();
		if (isSameDay(currentDate, scheduledSubmitDate)) {
			$("#chargeDateBox" + billerCorpAccountId).text(messages['main_pay_chargeTodayMessage']);
		} else {
			$("#chargeDateBox" + billerCorpAccountId).text(formatMessage(messages['main_pay_chargeDateMessage'], showCalcSubmitDate));
		}
		if (bp_get_pending_transaction_obj.balance && bp_get_pending_transaction_obj.balance > 0) {
			$("#chargeMessageBox" + billerCorpAccountId).text(messages['main_pay_chargeMessage']);
			$('#chargeMessageBox' + billerCorpAccountId).show(); /* Showing the change message */
		}
	}
	var fee = pendingTransaction.fee;
	if (fee && fee > 0) { /* Checking for the fee if exists and > 0 */
		var expressSign = '<div title="Express">'
			+ formatMessage(messages['main_pay_chargeFeeMessage'],
					getFormatedNumber(parseFloat(fee).toFixed(2), true))
			+ '<i class="fa fa-bolt fa-lg colorffdd00"></i></div>';
		$("#chargeFeeBox" + billerCorpAccountId).html(expressSign);
		$('#chargeFeeBox' + billerCorpAccountId).show(); /* Showing the fee */ 
	}
}

/******************************************************************************************************
' Name                 :   getMatchingDateToEnableDate
' Return type          :   dateReturn
' Input Parameter(s)   :   billerCorpAccountId, highlightCalenderId
' Purpose              :   This method is used to get the matched date which is in date boxes and get pending transactions. 
                           using get cart response.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   25th September, 2014     	-   UmaMaheswara Rao
'*****************************************************************************************************/
function getMatchingDateToEnableDate(billerCorpAccountId, highlightCalenderId) {
	var dateReturn = '';
	/* Iterate the loop for matching GetpendingTransactions.requestedPostDate and date box date */
	$('#calenderBarSec' + billerCorpAccountId + ' ul > li ').each(function() {/* Iterating for li ID which is in calendar section */
		var dateBoxId = $(this).attr('id');
		if ($('#'+ dateBoxId).hasClass("bg_green")) {
			$('#'+ dateBoxId).removeClass("bg_green");
		}
		/* Getting span id from the li Id and matching with the getPendingTransactions.requestedPostDate */
		var spanDateId = $('#' + dateBoxId + ' > .currenday').attr('id');
		if (isSameDay(highlightCalenderId, spanDateId*1)) {
			dateReturn = spanDateId*1;
		}
	});
	return dateReturn;
}

/****************************************************************************************************
' Name                 :   loadCheckoutScreen
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to load the Add Payment Method (Checkout) screen.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   27th June, 2013     	-   Karuna Mishra
'*****************************************************************************************************/
function loadCheckoutScreen() {
	fundingSourceArray = null; /* clear fundingSource array */
	$("#historyFundingSources").empty();
	clearInterval(timerEnableNextButton);
	timerEnableNextButton = null;
	clearInterval(timeIntevalOfAddCard);
	timeIntevalOfAddCard = null;
	/* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
	showScreenAndSetHeight('checkoutContainer', 'chkoutPaymentSec');
	if (!parseBoolean(localStorage.getItem("registerUser"))) {
		offPromoCodeRegisterScreen();
	}
	/* Changes due to Bug 4817 
	setExtraMarginForAndroid('chkOutMoreAmtCreateProf');
	*/
	setExtraMarginForAndroid('btnBigContinueChkOut');
	isRegisterSelected = false;
	$("#cashDataMainContainer").hide();
	$("#cardPaymentOptionsContainer").hide();
	$('#cvvValue').val(''); /* Clearing the CVV field from CVV required popup */
	var creditsAppliedAmount = calculateCreditsApplied();
	/* Getting the amount due from Bills page */
	var amountDue = getFormatedNumber($("#mainPayAmountDueTotal").text(), false);
	if (amountDue <= 0) { /* Comparing credits with amount (creditsAppliedAmount >= amountDue)*/
		/* Checking if all the billers are immediate and credits are greater than or equal to amount due */
		if (checkForAllPaymetnAsImmediate()) {
			$("#mainPaymentOptionsContainer").hide();
			$("#promoCodeSection").hide();
			$("#checkoutHeaderTitle").text(messages['checkout.lbl_credits_applied_tittle']);
		} else {
			/*deActivateCheckoutPayButton();*/
			$("#mainPaymentOptionsContainer").show();
			$('#cashDataMainContainer').hide();
			$("#cardPaymentOptionsContainer").hide();
			$("#checkoutCreditsCoverAllAmountDue").show();
			invokeCardFunctionality();
		}
		activateCheckoutPayButton();
		createSummarySectionInCheckout(true); /* Create the summary section in Checkout screen */
		creditsAppliedAmount = amountDue;
		$("#checkoutCreditsApplied").text(getFormatedNumber(creditsAppliedAmount, true));
		$("#checkoutCreditsApplied").show();
		$("#checkoutCreditsAppliedTxt").show();
	} else { /* This will work if credits doesn't cover all the amount due */
		$("#mainPaymentOptionsContainer").show();
		$("#checkoutHeaderTitle").text(messages['checkout.header_title']);
		createSummarySectionInCheckout(true); /* Create the summary section in Checkout screen */
		deActivateCheckoutPayButton();
		/* Clearing the Create Profile and Additional Information section for Guest User */
		if (!parseBoolean(localStorage.getItem("registerUser"))) {
			clearFormField("createAccountBoxChkOut");
			clearFormField("additional_info_box");
			clearFormField("frmGuestPromoCodeRes");
		}
		/* Call the CM_GET_PAYMENT_CARD for show the default card on checkout page. */
		if (!invokeCardFunctionality()) {
			createPaymentOptions();
		}
		hideAndShowRegisterPromoForm();
	}
	/* To check the guest user and show the message to either login or create your account. */
	if (!bp_hist_obj && !bp_scheduled_payment_hist_obj) {
		if (parseBoolean(localStorage.getItem("registerUser"))) {
			$('#no_payment_hist').text(formatMessage(
					messages['billStatusHistory.noBillsMessage'], localStorage.getItem("maxTranHistoryDaysBack")));
			$('#no_payment_hist').show();
		}
	}
}

/****************************************************************************************************
' Name                 :   hideAndShowRegisterPromoForm
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to show and hide promo section on guest.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   27th June, 2013     	-   Karuna Mishra
'*****************************************************************************************************/
function hideAndShowRegisterPromoForm() {
	if (!parseBoolean(localStorage.getItem("registerUser"))) {
		$("#discountAndPromoCodeReg").show();
		$("#promoCodeBox").show();
	} else if (parseBoolean(localStorage.getItem("registerUser"))) {
		$("#discountAndPromoCodeReg").hide();
		$("#promoCodeBox").hide();
	}
}

/****************************************************************************************************
' Name                 :   checkForAllPaymetnAsImmediate
' Return type          :   Boolean
' Input Parameter(s)   :   None
' Purpose              :   This method is used to check whether all payment are immediate or not.
                           using get cart response.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   18 Jun, 2014        	-   Karuna Mishra
'*****************************************************************************************************/
function checkForAllPaymetnAsImmediate() {
	/* Getting the pending transactions from BP_GET_PENDING_TRANSACTION object */
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	for (var index in pendingTransactions) { /* Iterating through pendingTransaction array */
		/* Checking if any of the pending transaction is not Immediate means its Schedule */
		if (pendingTransactions[index].submitType !== 'IMMEDIATE') {
			return false;
			break;
		}
	}
	return true;
}

/****************************************************************************************************
' Name                 :   invokeCardFunctionality
' Return type          :   Boolean
' Input Parameter(s)   :   None
' Purpose              :   This method is used to check whether Card Apis will be called or not.
                           using get cart response.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   27th June, 2013     	-   Karuna Mishra
'*****************************************************************************************************/
function invokeCardFunctionality() {
	$("#cardPaymentOptionsContainer").empty();
	if (getAllFundingSource().indexOf(tenderTypeConstant.DEBIT) != -1
			|| getAllFundingSource().indexOf(tenderTypeConstant.CREDIT) != -1) {
	//	$("#cardPaymentOptionsContainer").show();
		handleGetPaymentCards(null, null);
		return true;
	}
	return false;
}

/****************************************************************************************************
' Name                 :   createSummarySectionInCheckout
' Return type          :   None
' Input Parameter(s)   :   isCallFirstTime
' Purpose              :   This method is used to display all selected biller on checkout page.
                           using get cart response.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   27th June, 2013     	-   Karuna Mishra
'*****************************************************************************************************/
function createSummarySectionInCheckout(isCallFirstTime) {
	var containerClass = "";
	var htmlText = "";
	var billTotal = 0;
	var feeTotal = 0;
	var htmlVal = "";
	var expressFee = "";
	var currentDate = new Date();
	var amountChargeToday = 0;
	var isScheduledBiller = false;
	if ($('#sel_pay_container1').is(':visible') || isCallFirstTime) {
		containerClass = 'sel_payment_container_chk';
	} else {
		containerClass = 'sel_payment_container';
	}
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	for ( var index in pendingTransactions) {
		var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;
		var requestPostingDate = pendingTransactions[index].requestedPostDate;
		if (isSameDay(currentDate,scheduledSubmitdate1)) {
			amountChargeToday = amountChargeToday + pendingTransactions[index].amount + pendingTransactions[index].fee ;
		}
		if (!pendingTransactions[index].requestedPostDate) {
			expressFee = "";
		} else { 
			expressFee = "";
			if (pendingTransactions[index].fee > 0) {
				expressFee = "<div class='totalpay_txt_head fnt_wt'>"
							+ "<label class='mrgn_left50 txt_normal'>"
							+ messages['checkout.summaryExpressFee']
							+ "<span class='fa fa-bolt fa-lg express_icon_history'></span>" 
							+ "</label>"
							+ "</div>"
							+ "<div class='total_payment_price fnt_wt'>"
							+ "<label id='expressFee' class='dynamiclab txt_normal'>"
							+ getFormatedNumber(pendingTransactions[index].fee, true)
							+ "</label></div>";
			}
			var mmddyy = convertToDatemmddyy(pendingTransactions[index].requestedPostDate );
			var scheduledSubmitdate = convertToDatemmddyy(pendingTransactions[index].scheduledSubmitDate);
			expressFee = expressFee	
						+"<div class='totalpay_txt_head fnt_wt'>";
			if (pendingTransactions[index].submitType === 'IMMEDIATE') {
				isImmediateBiller = true;
			} else {
				isScheduledBiller = true;
			}
			if (isSameDay(requestPostingDate, currentDate) 
					|| !parseBoolean(localStorage.getItem("registerUser"))) {
				expressFee += "<label class='mrgn_left50 txt_normal'>"
						   + 	messages['main_pay.confirm_successDate_Label'];
			} else {
				expressFee +=  "<label class='mrgn_left50 txt_normal' id='deleiverOn" + index + "'>"
						   + 	formatMessage(messages['main_pay.confirm_successDate_Label2'], mmddyy.month, mmddyy.day, mmddyy.year);
			}
			expressFee += "</label></div>"
				       +	"<div class='totalpay_txt_head fnt_wt'>";
			if (isSameDay(scheduledSubmitdate1, currentDate) 
					|| !parseBoolean(localStorage.getItem("registerUser"))) {
				expressFee += "<label class='mrgn_left50 txt_normal'>"
						   +  messages['main_pay.confirm.charge_label'];
			}else{
				expressFee += "<label class='mrgn_left50 txt_normal' id='chargeOn" + index + "'>"
						   +  formatMessage(messages['main_pay.popup.charge'], scheduledSubmitdate.month, scheduledSubmitdate.day, scheduledSubmitdate.year);
			}
			expressFee += "</label></div>"
					   + "</span></span>";
		}
		htmlVal += "<span class='mrgn_bottom15 width_area100'>"
				+ "<div class='totalpay_txt_head fnt_wt'>"
				+ "<label class='txt_normal'>"
				+ pendingTransactions[index].billerName
				+ "</label>"
				+ "</div>"
				+ "<div class='total_payment_price fnt_wt'>" 
				+ "<label id='billerAmount' class='dynamiclab txt_normal'>"
				+ getFormatedNumber(pendingTransactions[index].amount, true)
				+ "</label></div>"
				+ expressFee;
		billTotal += parseFloat(pendingTransactions[index].amount);
		feeTotal += parseFloat(pendingTransactions[index].fee);
	}
	var billTotalNewvalue = billTotal + feeTotal;
	var creditsAmount = calculateCreditsApplied(billTotalNewvalue);
	var formatedBilltotal = getFormatedNumber((billTotalNewvalue - creditsAmount), true);
	htmlText =   "<div id='sel_pay_container1' class='"+containerClass+" bg_lightblue'>"
				+	"<span class='summaryText'>" 
				+ 	messages['checkout.lbl_review_bills'] 
				+ 	"</span>"
				+	"<span id='detailArrowupId1' class='detailArrowup fa fa-caret-up' onclick='amountDueExpandForSummarySection()'></span>"
				+   "<div class='clear'></div>"
				+   "<div class='totalbox_container pdng_none'>"
				+   "<span id='paymentAmountTotalSelPay'>"
				+	htmlVal
				+	"<div class='totalpay_txt_head fnt_wt'>"
				+   "<label class='txt_normal'>"
				+ 	messages['checkout.lbl_bill_total']
				+	"</label>"
				+	"</div>"
				+	"<div class='total_payment_price fnt_wt'>"
				+   "<label id='billTotalAmount' class='dynamiclab txt_normal'>"
				+	getFormatedNumber(billTotal, true)
				+	"</label>"
				+	"</div>";
	if (feeTotal > 0) {
		htmlText +=  "<div class='totalpay_txt_head'>"
				+	"<label class='txt_normal'>"
				+	messages['main_pay.confirm.fees_label']
				+	"</label>"
				+   "<span class='fa fa-bolt fa-lg express_icon_history'></span>"
				+   "</div>"
				+	"<div class='total_payment_price'>"
				+	"<label class='dynamiclab' id='totalFeeValue'>"
				+	getFormatedNumber(feeTotal, true)
				+	"</label></div>";
	}
	htmlText += 	"<div class='totalpay_txt_head fnt_wt'>"
	            +   "<label class='txt_normal'>"
	            +   "<span id='cardFeePercent'>"
	            +   "</span>"
	            + 	"<span id='infoCardFeeId' class='txt_inv' onclick='showBillPayFees()'>"
	            +	"<a href='javascript:void(0)' class='fa fa-info-circle fa-lg card_ques_icon cred_info_icon'></a>"
	            +	"</span>"
	            +   "</label>"
	            +   "</div>"
	            +   "<div class='total_payment_price fnt_wt'>"
	            +   "<label id='cardserviceAmount' class='dynamiclab txt_normal'>"
	            +	"</label>"
				+	"</div>"
				
				+	"<div class='totalpay_txt_head fnt_wt'>"
	            +   "<label class='txt_normal'>"
	            +   "<span id='summaryBillFeetotal' class='fnt_wt'>"
	            +   "</span>"
	            +   "</label>"
	            +   "</div>"
	            +   "<div class='total_payment_price fnt_wt'>"
	            +   "<label id='summaryBillFeetotalAmount' class='dynamiclab fnt_wt'>"
	            +	"</label>"
				+	"</div>";
	
	if (creditsAmount > 0) {
		htmlText +=	"<div class='totalpay_txt_head'>"
				+ 	"<label class='fnt_itc txt_normal'>"
				+	messages['main_pay.bill_pay_credits']
				+	"</label>"
				+ 	"</div>"
				+	"<div class='total_payment_price'>"
				+   "<label id='creditsAppliedAmount' class='dynamiclab txt_normal'>"
				+  	"- " + getFormatedNumber(creditsAmount, true)
				+	"</label></div>" ;
		if (isScheduledBiller && (billTotalNewvalue - creditsAmount) <= 0) {
			htmlText +=	"<div class='totalpay_txt_head'>"
					+	"<label class='fnt_itc txt_normal'>"
					+	messages['main_pay.confirm_successDate_Label_summary']
					+	"</label>"
					+	"</div>"
					+	"<div class='total_payment_price'>"
					+	"<label class='dynamiclab'>"
					+	"</label></div>" ;	
		}
	}
	htmlText +=	"<div  class='totalpay_txt_head'><label class='fnt_itc txt_normal'  id='summuryPromoCode1'>"
			+	"</label>"
			+	"</div>"
			+	"<div class='total_payment_price'>"
			+	"<label id='checkoutPromoCodeAmount1' class='dynamiclab'></label>"
			+	"</div>"
			+	"</span>"
			+	"</div>"
			+   "</div>"
			+	"<hr class='def_hr' />"
			+	"<div id='mainpaymentTotalLabels1' class='check_out wid_flt100 bg_lightblue mrgn_bottom5'>"
			+	"<div class='width_area100'>"
			+	"<div class='textBar'>"
			+	"<div class='totalpay_txt_head totalpay_mrgn fnt_wt dueText'>"
			+	"<label>"
			+	messages['main_pay.confirm_amountDue']
			+	"</label></div>"
			+	"</div>"
			+	"<div class='labelBar fnt_wt amountDue'>" 
			+	"<div id='amountDueArrow1' class='detailArrowdown fa fa-caret-down' onclick='amountDueExpandForSummarySection()'></div>"
			+	"<label id='amountDueTotal' class='dynamiclab'>" 
			+	formatedBilltotal
			+	"</label>"
			+	"</div>"
			+	"</div>"
			+	"<div class='clear'></div>";
		amountChargeToday = amountChargeToday * 1 - creditsAmount * 1;
	
		htmlText += "<div id='idOfAmountChargeToday' class='width_area100 mrgn_top_neg_25 '>"
				+	"<div class='textBar' >"
				+	"<div class='totalpay_txt_head totalpay_mrgn fnt_wt dueText'>"
				+	"<label>"
				+	messages['main_pay.confirm_chargedToday']
				+	"</label>"
				+	"</div>"
				+	"</div>"
				+	"<div class='labelBar fnt_wt amountDue'>"
				+	"<label id='amountChargeToday' class='dynamiclab'>" 
				+	getFormatedNumber(amountChargeToday <= 0 ? !parseBoolean(localStorage.getItem("registerUser")) ? formatedBilltotal:0 : amountChargeToday , true)
				+	"</label>"
				+	"</div>"
				+	"</div>";
	htmlText =	htmlText +"</div>"
				+ '<span class="payment_service_link" onclick="showReceiptDisclosureUrl()">'
				+ '<a href="javascript:void(0)">'
				+ messages['paymentReceipt.disclosureLabel']
				+ '</a>'
				+ '</span>';
	
	$('#summaryViewForCheckout').html(htmlText);
	var creditsval = $("#creditAvbl").html();
	if ( creditsval != '$0.00') {
		$('#mainpaymentCreditsLevel1').show();
	}
	/* Including bill total and fee total line */
	$('#summaryBillFeetotal').text(messages['checkout.billAndServiceFee']);
	$('#summaryBillFeetotalAmount').text(getFormatedNumber(billTotalNewvalue.toFixed(2), true));
	var creditsAppliedAmount = getFormatedNumber(bp_get_pending_transaction_obj.balance);
	$("#checkoutBillTotal").text(getFormatedNumber(billTotal, true));
	if (feeTotal > 0) {
		$("#checkoutFeeTotal").text(getFormatedNumber(feeTotal, true));
		$("#checkoutFeeTotal").show();
		$("#checkoutFeeTotalTxt").show();
	} else {
		$("#checkoutFeeTotal").text("0.00");
		$("#checkoutFeeTotal").hide();
		$("#checkoutFeeTotalTxt").hide();
	}
	if (creditsAppliedAmount > 0) {
		$("#checkoutCreditsApplied").text(getFormatedNumber(creditsAppliedAmount, true));
		$("#checkoutCreditsApplied").show();
		$("#checkoutCreditsAppliedTxt").show();
	}
	if ($('#checkoutCreditsCoverAllAmountDue').is(':visible')) {
		updateSummarySectionFromCashClick();
		$("#promoCodeSection").show();
	}
	if (! ($('#sel_pay_container1').is(':visible') || isCallFirstTime)) {
		$('#amountDueArrow1').show();
	}
}

/****************************************************************************************************
' Name                 :   updateAmountDueArea
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to update the Amount Due area of Add Payment 
							Method (Checkout) screen.
' History Header       :   Version   -   Date              		-   Developer Name 
' Added By             :   1.0       -   27th June, 2013     	-   Karuna Mishra
'*****************************************************************************************************/
function updateAmountDueArea() {
	/* Remove the $ symbol and get the number value from fields */
	var chkBillTotal = getFormatedNumber($("#billTotalAmount").text());
	var chkFeeTotal = getFormatedNumber($("#totalFeeValue").text());
	var chkCreditsTotal = getFormatedNumber($("#creditsAppliedAmount").text());
	var chkPromoTotal = getFormatedNumber($("#checkoutPromoCodeAmount1").text());
	var amountDue = (chkBillTotal + chkFeeTotal) - (chkCreditsTotal + chkPromoTotal);
	if (amountDue > 0) {
		$("#amountDueTotal").text(getFormatedNumber(amountDue, true));
	} else { 
		$("#amountDueTotal").text(getFormatedNumber(0, true));
	}
	/* Checking if user has cleared the Promo entry from Promo box */
	if (!$('#promoCodeDiscount3').val() || !$("#checkoutApply").is(":disabled") ) {
		var promValue = getFormatedNumber($('#checkoutPromoCodeAmount1').text(), false);
		$('#amountDueTotal').text(getFormatedNumber((amountDue * 1 + promValue * 1), true));
		/*get Amount Charge Today*/
		var currentDate = new Date();
		var amountChargeToday = 0;
		var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
		for (var index in pendingTransactions) {
			var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;
			if ($('#completeItemsContainer').is(':visible')) {
				amountChargeToday = amountChargeToday + pendingTransactions[index].amount + pendingTransactions[index].fee ;
			} else if (isSameDay(currentDate,scheduledSubmitdate1)) {
				amountChargeToday = amountChargeToday + pendingTransactions[index].amount + pendingTransactions[index].fee ;
			}
		}
		//var creditsAmount = calculateCreditsApplied((amountDue * 1 + promValue * 1));
		amountChargeToday = amountChargeToday * 1 - chkCreditsTotal * 1;
		if (amountChargeToday < 0) {
			amountChargeToday = 0;
		}
		/*End of get Amount Charge Today*/
		$('#amountChargeToday').text(getFormatedNumber((amountChargeToday), true));
		$('#summuryPromoCode1').text(''); /* Clearing the message at left in Summary section when user deletes the Promo */
		$('#checkoutPromoCodeAmount1').text(''); /* Clearing the message at right in Summary section when user deletes the Promo */
	}
	/* Checking if the CARD section is open then enable the PAY button and return */
	for (var arrayIndex in cardOptionJsonTypes) {
		if ($("#panel" + cardOptionJsonTypes[arrayIndex]).is(":visible")) {
			/* Checking if cardInfoObject exists and contains the data */
			if (cardInfoObject && cardInfoObject.length > 0) {
				activateCheckoutPayButton();
				return;
			}
		}
	}
	/* Getting total added amount in CASH section */
	var totalAddedAmount = getFormatedNumber($('#cashSummaryTotalAmount').text(), false);
	/* Reading Amount Due again because in case of Promo removed it will add up by promo amount again */
	amountDue = getFormatedNumber($('#amountDueTotal').text(), false);
	/* Checking if amountDue becomes less than or equal to added amount then enable the PAY button */
	if ((amountDue <= totalAddedAmount && $('#cashDataMainContainer').is(":visible")) 
				|| ( amountDue && ( $('#listOfPaymentCardDEBIT').is(":visible") 
				|| $('#listOfPaymentCardCREDIT').is(":visible")))) {
		activateCheckoutPayButton();
	}else if ((amountDue && !$('#completeItemsContainer').is(":visible")) 
			|| ( !$('#listOfPaymentCardDEBIT').is(":visible") 
			|| !$('#listOfPaymentCardCREDIT').is(":visible"))) {
		deActivateCheckoutPayButton();
	} else if (totalAddedAmount) {
		if ($('#completeItemsContainer').is(":visible")) {
			$('#optionsListContainer').show();
			$('#newSelectOption').show();
			$('#opsList').hide();
		}
		deActivateCheckoutPayButton();
	}
}
