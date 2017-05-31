
/********************************************************************************************
' Name                 :   submitCart
' Return type          :   none
' Input Parameter(s)   :   jsonType
' Purpose              :   This method is used to call BP_SUBMIT_CART api.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   28 June 2013   -   pradeepy
'*******************************************************************************************/
function submitCart(jsonType) {
	showProgressBar(); /* To show the progress bar */
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	var promocodeEntryValue = $("#" + visiblePromoCodeInputId).val();
	isInitMainPage = false;
	var request = {};
	request.userId = eval(getCookie('userId'));
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.fundingSources = getFundingSources();
	request.processAsImmediate = checkForProcessAsImmediate(jsonType);
	gaSubmitPaymentGroup(request.userId, promocodeEntryValue);
	
	bp_submit_payment_group_obj = null;
	
	var call_bp_submit_payment_group = new bp_submit_payment_group(request);
	call_bp_submit_payment_group.call();
	setIntervalToValidatePromo();
}

/********************************************************************************************
' Name                 :   showDebitCardPopUpError
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to show the Debit card error pop up.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Apr 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function showDebitCardPopUpError(){
	showAnimatedPopup('idOfDebitCardPopUpErrorNew', 'mainContainIdNew');
}

/********************************************************************************************
' Name                 :   showCvvRequiredPopup
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to show the CVV required popup.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Apr 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function showCvvRequiredPopup(){
	showAnimatedPopup('cvvFill', 'mainContainIdNewPop');
}

/********************************************************************************************
' Name                 :   handleBpSubmitPaymentGroupOnSucess
' Return type          :   none
' Input Parameter(s)   :   response
' Purpose              :   This method is used to call submit payment on success .
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Apr 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function handleBpSubmitPaymentGroupOnSucess(response){
	triggerCheckCartStatus();
	$('#addPaymentCardForm').remove();
}

/********************************************************************************************
' Name                 :   checkForProcessAsImmediate
' Return type          :   Boolean
' Input Parameter(s)   :   jsonType
' Purpose              :   This method is used to check the request as process as immediate.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function checkForProcessAsImmediate(jsonType) {
	var cvvRequiredStatus = null;
	if(!parseBoolean(localStorage.getItem("registerUser"))) { /* Checking for Guest user */
		return true;
	} else if($('#mainPaymentOptionsContainer').is(":hidden")) { /* Checking if Credits cover all the amount due */
		return true;
	} else if($('#completeItemsContainer').is(":visible")) { /* Checking if Cash section is opened */
		return true;
	} else if($('#checkoutCreditsCoverAllAmountDue').is(":visible")) { /* Checking if note section is opened */
		return true;
	} else if($('#cardButtonImageArea' + jsonType).hasClass('fa fa-check fa-2x vesta_delivered_icon')) { /* Checking if the card section is opened */
		if($('#addCardFormSection' + jsonType).is(":visible")){
			cvvRequiredStatus = cm_add_payment_card_obj.paymentCard.cvvRequiredStatus;
		} else if($('#listOfPaymentCard' + jsonType).is(":visible")) {
			var	getSelectedCardId = getSelectedDebitOrCreditCard(jsonType);
			if(getSelectedCardId){
				var index = $('#' + getSelectedCardId).closest('div').attr('id');
				cvvRequiredStatus = cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus;
			}
		}
		
		if(cvvRequiredStatus === 'REQUIRED'){
			return true;
		} else if(cvvRequiredStatus === 'NOT_REQUIRED' || cvvRequiredStatus === 'UNKNOWN'){
			return false;
		}
	} else {
		var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
		for(var index in pendingTransactions) {
			if(pendingTransactions[index].submitType === 'SCHEDULED'){
				return false;
			}else{
				return true;
			}
		}
	}
}

/********************************************************************************************
' Name                 :   verifyPromocode
' Return type          :   Boolean
' Input Parameter(s)   :   none
' Purpose              :   This method is used to call check the state of Promo code.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function verifyPromocode() {
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	var promocodeEntryValue = $("#" + visiblePromoCodeInputId).val();
	if(promocodeEntryValue) {
		if(validationTracking === NOTVALIDATED){
			promoCodeErrorHandling(messages['promocode.state.error1'], visiblePromoCodeInputId);
			activateCheckoutPayButton();
			return false;
		} else if(validationTracking === UNVALIDATED){
			promoCodeErrorHandling(messages['promocode.state.error2'], visiblePromoCodeInputId);
			activateCheckoutPayButton();
			return false;
		}
	}
	return true;
}

/********************************************************************************************
' Name                 :   getSelectedDebitOrCreditCard
' Return type          :   checkBoxId
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   This method is used to find selected Debit or Credit card in checkout page.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function getSelectedDebitOrCreditCard(fundingSourceTypes_JsonType){
	var checkBoxId = "";
	if($('#panel' + fundingSourceTypes_JsonType).is(":visible")){
		$('#panel' + fundingSourceTypes_JsonType + ' input:checked').each(function() {
			checkBoxId = ($(this).attr('id')); // "this" is the current element in the loop
		});
    }
	return checkBoxId;
}

/********************************************************************************************
' Name                 :   callGuestOrAccCreationOrLogged
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to check Guest/Registered user and call 
							appropriate API method. It is being called from PAY button click.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function callGuestOrAccCreationOrLogged() {
	if(intervalForServiceFee){
		clearIntervalApp(intervalForServiceFee);
	}
	deActivateCheckoutPayButton();  
    var registerUser = parseBoolean(localStorage.getItem("registerUser"));
    if (!registerUser) {
        if (!isGrtr) {
            updateUserProfileCheckout();
        } 
    } else {
    	if(isPromocodeJsonTypeAvailable()){
    		if(!verifyPromocode()){
    	    	return;
    	    }
    	}
    	clearIntervalApp(timeIntevalOfAddCard);
    	callAddCardOrSubmitCard();
    }
}

/********************************************************************************************
' Name                 :   isPromocodeJsonTypeAvailable
' Return type          :   Boolean
' Input Parameter(s)   :   none
' Purpose              :   This method is used to check if INIT APP API returned fundingSourceType
							as PROMO CREDIT as well.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   -   UmamaheswaraRao
'*******************************************************************************************/
function isPromocodeJsonTypeAvailable(){
	var paymentOptionTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	for ( var paymentOptionIndex = 0; paymentOptionIndex < paymentOptionTypes.length; paymentOptionIndex++) {
		var paymentOptionSourcesJsonType = paymentOptionTypes[paymentOptionIndex].jsonType;
		if(paymentOptionSourcesJsonType === jsonTypeConstant.PROMOCREDIT){
			return true;
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   callSubmitCartAfterCVV
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to vaidate and save the CVV field.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 Feb 2014   	-   Karuna Mishra
'*******************************************************************************************/
function callSubmitCartAfterCVV(){
	var cvvNum = $('#cvvValue').val();
	if (cvvNum.length >= 3 && cvvNum.length <= 4) {
		submitBtnDisableUI('cvvSubmitButton');
		closeAnimatedPopup('cvvFill', 'mainContainIdNewPop');
		activateCheckoutPayButton();
		for (var arrayIndex in cardOptionTenderTypes) {
			if ($("#panel" + cardOptionTenderTypes[arrayIndex]).is(":visible")) {
				submitCart(cardOptionTenderTypes[arrayIndex]);
				 $('#cvvValue').val('');
				break;
			}
		}
	}
}

/********************************************************************************************
' Name                 :   getFundingSources
' Return type          :   None
' Input Parameter(s)   :   applyClicked
' Purpose              :   This method is to get the funding sources from either Card section, 
							Cash section or Promo Code section for BP_VERIFY_FUNDING_SOURCE_3_2 
							and BP_SUBMIT_CART API request.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getFundingSources(applyClicked) {
	/* Get all funding sources list. */
	var fundingSourceArray = new Array();
	var arrayIndexCounter = 0;
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	/* Checking if Promo code section visible then only as Promo in funding source */
	if($('#' + visiblePromoCodeInputId).is(':visible') && $('#' + visiblePromoCodeInputId).val().trim().length > 0) {
		var paymentOptionTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
		for (var index = 0; index < paymentOptionTypes.length; index++) {
			var fundingSourceType = paymentOptionTypes[index].jsonType.trim();
			/* Checking for fundingSource jsonType for Promo type */
			if(fundingSourceType === "PromoCredit"){
				/* Storing value as last (previous) promo code to compare it next time. */
				lastPromoCode = $('#' + visiblePromoCodeInputId).val().trim();
				if(lastPromoCode) {
					fundingSourceArray[arrayIndexCounter] = new Object();
					fundingSourceArray[arrayIndexCounter].type = fundingSourceType;
					fundingSourceArray[arrayIndexCounter].loadAccountNumber = lastPromoCode;
					
					arrayIndexCounter++;
					break;
				}
			}
		}
	}
	/* If Apply button is clicked to validate the Promo code, then it will return fundingSource array. 
	 * If Save button in Cash Section clicked, it will remove Promo type from funding source 
	 * and make it blank so that it will not validate Promo in case of Cash finding source validated.
	 * If applyClicked is undefined (in case of Submit Payments clicked)then it will include all
	 * funding sources either Promo or Cash or Card.
	 */
	if (!applyClicked  && validationTracking !== VALIDATED){
		fundingSourceArray = new Array();
		arrayIndexCounter = 0;
	}
	
	/* For Debit and Credit Card Section Code */
	var visibleCard = "";
	var cardOptionJsonType = "";
	for (var arrayIndex in cardOptionJsonTypes) {
		cardOptionJsonType = getVisibleJsonType(cardOptionJsonTypes[arrayIndex]);
		if ($("#panel" + cardOptionJsonType).is(":visible")) {
			if(cardInfoObject[0].type === cardOptionJsonTypes[arrayIndex]){
				visibleCard = cardOptionJsonTypes[arrayIndex];
				break;
			}
		}
	}
	if (visibleCard && $("#panel" + cardOptionJsonType).is(":visible")) {
		if(cardInfoObject && cardInfoObject.length > 0){
			fundingSourceArray[arrayIndexCounter] = cardInfoObject[0];
			if($('#cvvValue').val() && $('#cvvValue').val().length >= 3 && $('#cvvFill').is(":visible")) {
				fundingSourceArray[arrayIndexCounter].cvv = $('#cvvValue').val(); 
			}
		}
		return fundingSourceArray;
	}
	/* For Cash Section Code Loop through available number of funding sources */
	$("#historyFundingSources").children().each(
		function(index) {
			var amount = $(this).find("#historyFundRowAmount").text();
			var pin = $(this).find("#historyFundRowPin").text();
			var fundingSourceType = $(this).find("#historyFundRowFundingType").text();

			fundingSourceArray[arrayIndexCounter] = new Object();
			fundingSourceArray[arrayIndexCounter].type = fundingSourceType.trim();
			fundingSourceArray[arrayIndexCounter].loadAccountNumber = pin
					.replace(/[\<\>\;\-\&\/\s]+/g, "");
			fundingSourceArray[arrayIndexCounter].amount = Number(getFormatedNumber(amount));
			arrayIndexCounter++;
		});
	// end outer loop
	return fundingSourceArray;
}

/********************************************************************************************
' Name                 :   getVisibleJsonType
' Return type          :   DEBIT/CREDIT
' Input Parameter(s)   :   JsonType
' Purpose              :   This method is to get the DEBIT/CREDIT funding partner type using Json Type
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   12th Feb, 2015     -   UmaMaheswara Rao
'*******************************************************************************************/
function getVisibleJsonType(cardOptionJsonTypes) {
	var cardOptionJsonType = ''; 
	if (cardOptionJsonTypes === jsonTypeConstant.VESTADEBITVISA 
			|| cardOptionJsonTypes === jsonTypeConstant.VESTADEBITMASTER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTADEBITDISCOVER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTADEBITVISAOTHER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTADEBITMASTERCARDOTHER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTADEBITDISCOVERCARDOTHER) {
		cardOptionJsonType = jsonTypeConstant.VESTADEBIT;
	} else if(cardOptionJsonTypes === jsonTypeConstant.VESTACREDITVISA 
			|| cardOptionJsonTypes === jsonTypeConstant.VESTACREDITMASTER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTACREDITDISCOVER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTACREDITVISAOTHER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTACREDITMASTERCARDOTHER
			|| cardOptionJsonTypes === jsonTypeConstant.VESTACREDITDISCOVERCARDOTHER) {
		cardOptionJsonType = jsonTypeConstant.VESTACREDIT;
	}
	return cardOptionJsonType;
}

/********************************************************************************************
' Name                 :   handleBpVerifyFundingSource
' Return type          :   None
' Input Parameter(s)   :   applyClicked
' Purpose              :   This method is to call BP_VERIFY_FUNDING_SOURCE_3_2 API when user 
							enters any funding source except Card.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function handleBpVerifyFundingSource(applyClicked) {
    showProgressBar(); /* To show the progress bar */
    var request = {};
    request.userId = eval(getCookie("userId"));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.fundingSources = getFundingSources(applyClicked);
    request.processAsImmediate = checkForProcessAsImmediate();

	var call_bp_verify_funding_sources = new bp_verify_funding_sources(request,applyClicked);
	call_bp_verify_funding_sources.call();
}

/********************************************************************************************
' Name                 :   handleBpVerifyFundingSourceOnSuccess
' Return type          :   None
' Input Parameter(s)   :   applyClicked
' Purpose              :   This method is to handle the success response of 
							BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function handleBpVerifyFundingSourceOnSuccess(applyClicked){
	if(applyClicked) {
		updatePromoSectionUI();
		this.applyClicked = undefined;
	}
	updateSummarySectionUI();
}

/********************************************************************************************
' Name                 :   getScheduledSubmitDate
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used toget the first scheduled submit date from 
							BP_GET_PENDING_TRANSACTION API response when BP_PROMO_WILL_EXPIRE_BEFORE_SCHEDULED_PAYMENT_DUE 
							error cod comes in BP_VERIFY_FUNDING_SOURCE_3_2 API response.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   19 Jun, 2014      -   Karuna Mishra
'*******************************************************************************************/
function getScheduledSubmitDate(){
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	pendingTransactions.sort(compareChargeDate);
	for(var index in pendingTransactions) {
		if(pendingTransactions[index].submitType === 'SCHEDULED'){
			return pendingTransactions[index].scheduledSubmitDate;
		}
	}
}

/********************************************************************************************
' Name                 :   compareChargeDate
' Return type          :   int index
' Input Parameter(s)   :   Object a, Object b
' Purpose              :   This method is used to sort the array on the basis of charge date.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   19 Jun, 2014     -   Karuna Mishra
'*******************************************************************************************/
function compareChargeDate(a, b){
    if(a.scheduledSubmitDate < b.scheduledSubmitDate) {
		return -1;
	} else if(a.scheduledSubmitDate > b.scheduledSubmitDate) {
		return 1;
	}
	return 0;
}

/********************************************************************************************
' Name                 :   displayFundingSourcesErrorMessage
' Return type          :   None
' Input Parameter(s)   :   fundingSourcesArray
' Purpose              :   This method is Used to display extra funding sources those are not 
							required in Checkout process and make over payment. It comes in 
							error response of BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function displayFundingSourcesErrorMessage(fundingSourcesArray) {
	for (var index = 0; index < fundingSourcesArray.length; index++) {
		var errorChitPin = (fundingSourcesArray[index].loadAccountNumber).trim();
		var errorChitAmount = fundingSourcesArray[index].amount;
		var errorChitType = fundingSourcesArray[index].type;
		$("#historyFundingSources").show(); /* Show all history funds */
		if(index == 0 ){
			removeChitErrorBorder();
		}
		$("#editCashSummaryTotal").hide(); /* Show edit icon with total amount */
		$("#cashPaymnetInfoMessage").hide(); /* Show info text message below the edit icon. */
		/* Display error message on new structure */
		$("#historyFundingSources").children().each(function (index) {
			var amount = $(this).find("#historyFundRowAmount").text();
			var pin = $(this).find("#historyFundRowPin").text().trim().replace(/[\<\>\;\-\&\/\s]+/g, "");
			if ("PreCash".toUpperCase() === errorChitType.toUpperCase() && pin.length > 11) {
				var modifiedApiPin = errorChitPin.substring(errorChitPin.length - 12, errorChitPin.length);
				var modifiedJspPin = pin.substring(pin.length - 12, pin.length);
				if (modifiedApiPin == modifiedJspPin &&
						getFormatedNumber(errorChitAmount) == getFormatedNumber(amount)) {
					$(this).find("#apiFundError_redBorder").addClass("error_red_border1"); /* Highlight this  div */
				}
			} else if (errorChitPin == pin && getFormatedNumber(errorChitAmount) == getFormatedNumber(amount)) {
				$(this).find("#apiFundError_redBorder").addClass("error_red_border1"); /* Highlight this  div */
			}
		});
	}
	activateCheckoutPayButton();
}

/********************************************************************************************
' Name                 :   updateSummarySectionUI
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to update the summary section and enable the PAY button 
							on success response of BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function updateSummarySectionUI(){
	var registerUser = parseBoolean(localStorage.getItem("registerUser"));
	updateNewCreditsArea(); /* To update the new credit section whenever summary section updates.*/
	showTotalPaymentAndDue();
	var totalDueAmt = getFormatedNumber($("#amountDueTotal").text(), false);
	var totalPaymentAmt = getFormatedNumber($("#cashSummaryTotalAmount").text(), false);
	if(!isRegisterSelected) {
		if (registerUser === false) {
			if (isGrtr === false) {
				if (totalPaymentAmt === totalDueAmt) {
					enableCheckoutAddSubmitButton();
				}
				registerAdditionalInfoToValidate();
			} else {
				if (totalPaymentAmt > totalDueAmt) {
					deActivateCheckoutPayButton();
					enableCreateAccCheckoutRegisterBtn();
				}
				registerCreateProfileToValidate();
			}
		} else {
			activateCheckoutPayButton();
		}
	}
	/* Checking if the CARD section is open then enable the PAY button and return */
	for(var arrayIndex in cardOptionJsonTypes) {
		if ($("#panel" + cardOptionJsonTypes[arrayIndex]).is(":visible") 
				&& getSelectedDebitOrCreditCard(cardOptionJsonTypes[arrayIndex])) {
			/* Checking if cardInfoObject exists and contains the data */
			if(cardInfoObject && cardInfoObject.length > 0 ) {
				activateCheckoutPayButton();
				return;
			}
		} else if($("#panel" + cardOptionJsonTypes[arrayIndex]).is(":visible")){
			deActivateCheckoutPayButton();
			return;
		}	
	}
	var cashSummaryTotalAmount = getFormatedNumber($('#cashSummaryTotalAmount').html(), false);
	var mainPayAmountDueTotal = getFormatedNumber($('#amountDueTotal').text(), false);
	var immediateOrScheduled = false;
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	for (var index in pendingTransactions) {
		/*var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;*/
		if (pendingTransactions[index].submitType === 'IMMEDIATE') {
			immediateOrScheduled = true;
		}
	}
	if (registerUser) {
		if ((cashSummaryTotalAmount >= mainPayAmountDueTotal && cashSummaryTotalAmount) 
				|| ((immediateOrScheduled && !mainPayAmountDueTotal)
				|| (( $('#listOfPaymentCardDEBIT').is(":visible") 
				|| $('#listOfPaymentCardCREDIT').is(":visible"))))){
			activateCheckoutPayButton();
		} else {
			deActivateCheckoutPayButton();
		}
	}
	updateSummarySectionFromCashClick();
	updateNewCreditsArea();
}

/********************************************************************************************
' Name                 :   updateNewCreditsArea
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to update the summary section and enable the PAY button 
							on success response of BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function updateNewCreditsArea() {
	var promoVal = 0;
	if($('#checkoutPromoCodeAmount1').text()){
		promoVal = getFormatedNumber($('#checkoutPromoCodeAmount1').text());
	}
	var amountAdded = calculateCashSummaryTotalAmount() + promoVal;
	var creditsAppliedToSummary = calculateCreditsApplied();
	var addedAmount = getFormatedNumber(amountAdded, true);
    var amountDueToPay = getFormatedNumber($("#billTotalAmount").text()) + getFormatedNumber($("#totalFeeValue").text()) ;
    var newCredits = amountAdded - (amountDueToPay - creditsAppliedToSummary); /* Calculate new credits */
    var newCreditsApplied = getFormatedNumber(newCredits, true);
    if(amountAdded){
    	$("#idOfAmountAdded").text(addedAmount);
    	if($('#sel_pay_container1').is(':visible')){
    		$("#amountAdded").show();
    	}
    } else {
    	$("#amountAdded").hide();
    }
    if(newCredits > 0) {
    	$("#idOfNewCreditsApplied").text(newCreditsApplied);
    	if($('#sel_pay_container1').is(':visible')){
    		$("#newCreditsApplied").show();
    	}
	   	var registerUser = parseBoolean(localStorage.getItem("registerUser"));
	    if (registerUser === false) {
		   	$("#discountAndPromoCodeReg").show();
			$("#promoCodeBox").show();
	    }
    } else {
	   	$("#cashPaymnetInfoMessage").hide();
	   	$("#newCreditsApplied").hide();
    }
}

/********************************************************************************************
' Name                 :   getPromoAmount
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to get the applied PROMO code amount on success 
							response of BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getPromoAmount() {
	var promoCodeAmount = 0;
	if(bp_validate_promo_code_obj){
		promoCodeAmount = bp_validate_promo_code_obj.promoCodeAmount;	
	}
	if(promoCodeAmount) {
		return promoCodeAmount;
	}
	return 0;
}

/********************************************************************************************
' Name                 :   updatePromoSectionUI
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to get the applied PROMO code amount on success 
							response of BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function updatePromoSectionUI() {
	var promoAmount = getPromoAmount();
	var totalDueAmt = getFormatedNumber($("#amountDueTotal").text());
	submitBtnDisableUI('checkoutApply');
	var summuryPromoCode = '';
	if(lastPromoCode){
		summuryPromoCode = formatMessage(messages['checkout.promocode.summuryLable'], lastPromoCode);
	} else {
		var visiblePromoCode = getVisiblePromoCodeBoxId();
		summuryPromoCode = formatMessage(messages['checkout.promocode.summuryLable'], $('#' + visiblePromoCode).val().trim());
	}
	$('#summuryPromoCode1').text(summuryPromoCode);
	$('#summuryPromoCode1').show();
	validationTracking = VALIDATED;
	$('#checkoutPromoCodeAmount1').text("-" + getFormatedNumber(promoAmount, true));
	$('#checkoutPromoCodeAmount1').show();
	$('#summuryPromoCode1').show();
	var amountChargeToday = getFormatedNumber($('#amountChargeToday').text(), false);
	amountChargeToday = amountChargeToday * 1 - promoAmount * 1;
	if($('#amountChargeToday').text()){
		if(amountChargeToday < 0){
			amountChargeToday = 0;
		}
		$('#amountChargeToday').text(getFormatedNumber(amountChargeToday, true));
	}
	totalDueAmt = totalDueAmt * 1 - promoAmount * 1;
	if(totalDueAmt < 0){
		totalDueAmt = 0;
	}
	$("#amountDueTotal").text(getFormatedNumber(totalDueAmt, true));
	$("#invalidMsgPromoCodeRes").text("");
	$("#errorPromoCodeRes").hide();
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	$("#" + visiblePromoCodeInputId).removeClass("error_red_border");
	saveSelectedFundingSource(undefined, undefined, undefined, true);  /* Calling from create_payment_options.js */ 
	updateAmountDueArea(); /* Calling from getCart.js */
}

/********************************************************************************************
' Name                 :   getVisiblePromoCodeBoxId
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to get the visible Promo code box section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getVisiblePromoCodeBoxId(){
	var promoCodeBoxId = "";
	/* Checking for promo code box id from Create Profile in case of Guest User */
	if($("#promoCodeDiscount1").is(":visible")){
		promoCodeBoxId = "promoCodeDiscount1";
	}
	/* Checking for promo code box id from "REGISTER TO USE A DISCOUNT AND PROMO CODE!" in case of Guest User */
	else if($("#promoCodeDiscount2").is(":visible")){ 
		promoCodeBoxId = "promoCodeDiscount2";
	} 
	/* Checking for promo code box id from "Discount & Promo Code" area in case of Registered User */
	else if($("#promoCodeDiscount3").is(":visible")){
		promoCodeBoxId = "promoCodeDiscount3";
	} else if(!parseBoolean(localStorage.getItem("registerUser"))){
		promoCodeBoxId = "promoCodeDiscount1";
	}
	return promoCodeBoxId;
}

function onClickServiceFeeChkPopUp() {
	callAddCardOrSubmitCard(true);
}

/********************************************************************************************
' Name                 :   callAddCardOrSubmitCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to chek either CM_ADD_PAYMENT_CARD or 
							BP_SUBMIT_PAYMENT_GROUP API will be called.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function callAddCardOrSubmitCard(serviceFlag) {
	var visibleJsonType = '';
	for(var arrayIndex in cardOptionJsonTypes) {
		var cardOptionJsonType = getVisibleJsonType(cardOptionJsonTypes[arrayIndex]);
		if ($("#panel" + cardOptionJsonType).is(":visible")) {
			visibleJsonType = cardOptionJsonType;
			break;
		}
	}
	if ($("#addCardForm" + visibleJsonType).is(":visible") && !serviceFlag) {
		getTokenForCard(typeOfPaymentCard);
	} else if (serviceFlag) {
		closeAnimatedPopup('paymentBillPayId', 'paymentBillPayPopup');
		submitCart(visibleJsonType);
	} else {
		if(!checkForCVVRequired(visibleJsonType)) {
			submitCart(visibleJsonType);
		}
	}
}

function reValidatePromoCode() {
	if(newFlag && !$("#promoCodeDiscount3").val().trim()){
		$("#promoCodeDiscount3").val(promoCodeForChek);
		newFlag = false;
		promoCodeApplyBtnDisable();
		clearIntervalApp(intervalForPromo);/* Clearing timer */
		intervalForPromo = '';
	}
}

var intervalForPromo;
function setIntervalToValidatePromo() {
   intervalForPromo = setInterval("reValidatePromoCode()", 500);
}

/********************************************************************************************
' Name                 :   checkForCVVRequired
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to check whether to show the CVV popup or not.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   13 June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function checkForCVVRequired(visibleJsonType) {
	if($('#completeItemsContainer').is(":visible") || $('#mainPaymentOptionsContainer').is(":hidden")) {
		return false;
	} else if(!$('#addCardFormSection' + visibleJsonType).length && getSelectedDebitOrCreditCard(visibleJsonType)) {
		var selectedCard = getSelectedDebitOrCreditCard(visibleJsonType);
		var selectedCardIndex = $('#' + selectedCard).val();
		var index = $('#' + selectedCard).closest('div').attr('id');
		var cvvRequiredStatus = cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus;
		createFundingSourceForCard(visibleJsonType, selectedCardIndex);
		if(cvvRequiredStatus === 'REQUIRED' && $('#cvvValue').val().length < 3) {
			if(checkForScheduledPayment()) {
				showDebitCardPopUpError();
			} else {
				showCvvRequiredPopup();
			}
			return true;
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   checkForScheduledPayment
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to check whether there is any scheduled payment 
							in the transactionor not.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   13 June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function checkForScheduledPayment() {
	if(bp_get_pending_transaction_obj) {
		if(bp_get_pending_transaction_obj.pendingTransactions) {
			for ( var index = 0; index < bp_get_pending_transaction_obj.pendingTransactions.length; index++) {
				if(bp_get_pending_transaction_obj.pendingTransactions[index].submitType != 'IMMEDIATE'){
					return true;
				}
			}
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   closeCVVPopup
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to close the CVV pop up on click of X button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   13 June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function closeCVVPopup() {
	activateCheckoutPayButton();  
	$('#cvvValue').val('');
	closeAnimatedPopup('cvvFill', 'mainContainIdNewPop');
}

/********************************************************************************************
' Name                 :   validateCVVFormat
' Return type          :   [Boolean}
' Input Parameter(s)   :   event
' Purpose              :   This method is to validate the CVV no entered into box.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   13 June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateCVVFormat(event) {
	var isValidated = isNumberKey(event);
	/*if(isValidated) {*/
		if($('#cvvValue').val() && $('#cvvValue').val().length > 2) {
			submitBtnEnableUI('cvvSubmitButton');
		} else {
			submitBtnDisableUI('cvvSubmitButton');
		}
	/*}*/
	return isValidated;
}
