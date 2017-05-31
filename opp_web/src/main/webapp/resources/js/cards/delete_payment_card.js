/********************************************************************************************
' Name                 :   handleDeletePaymentCard
' Return type          :   None
' Input Parameter(s)   :   index, cardExpandBoxId
' Purpose              :   This method is used to deleting the selected user card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Karuna Mishra
'*******************************************************************************************/
function handleDeletePaymentCard(index, cardExpandBoxId) {
	if (confirm(messages['editPaymentCard.delete'])) {
		/* To show the progress bar */
		showProgressBar();
		var paymentCard = cm_get_payment_card_obj.paymentCards[index];
		var request = {};
		request.applicationId = applicationId;
		request.locale = getCookie("locale");
		request.userId = eval(getCookie('userId'));
		request.paymentCardId = paymentCard.id;

		var call_cm_delete_payment_card = new cm_delete_payment_card(request, index, cardExpandBoxId);
		call_cm_delete_payment_card.call();
	}
}

/********************************************************************************************
' Name                 :   handleDeletePaymentCardFromBack
' Return type          :   None
' Input Parameter(s)   :   goBack
' Purpose              :   This method is used to deleting the on click back.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Karuna Mishra
'*******************************************************************************************/
function handleDeletePaymentCardFromBack(goBack) {
	/* To show the progress bar */
	showProgressBar();
	var request = {};
	/* hold the request for the API delete payment card */
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.userId = eval(getCookie('userId'));
	request.paymentCardId = cm_add_payment_card_obj.paymentCard.id;

	var call_cm_delete_payment_card = new cm_delete_payment_card(request, null, cm_add_payment_card_obj.paymentCard.cardType
			, null, goBack);
	call_cm_delete_payment_card.call();/* Call for the API delete payment card with the required parameters */
}

/********************************************************************************************
' Name                 :   deletePaymentCardOngoBack
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to render the pop up.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Karuna Mishra
'*******************************************************************************************/
function deletePaymentCardOngoBack() {
	promoCodeForChek = $("#promoCodeDiscount3").val().trim();
	handleDeletePaymentCardFromBack(callFrom_constant.FROM_GO_BACK);
	closeAnimatedPopup('paymentBillPayId', 'paymentBillPayPopup');
}

/********************************************************************************************
' Name                 :   handleCMDeletePaymentCardOnSuccess
' Return type          :   None
' Input Parameter(s)   :   cardExpandBoxId, index, manageCardCall, goBack
' Purpose              :   This method is used to deleting the selected user card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Karuna Mishra
'*******************************************************************************************/
function handleCMDeletePaymentCardOnSuccess(cardExpandBoxId, index, manageCardCall, goBack){
	if ((callFrom_constant.MANAGE_CARD_DELTE_CALL === manageCardCall
			|| callFrom_constant.MANAGE_DELTE_CARD_SCHEDULE_CALL === manageCardCall
			|| callFrom_constant.MANAGE_CARD_FROM_MAINPAGE === manageCardCall
			|| callFrom_constant.MANAGE_CARD_CHECKOUT_CALL === manageCardCall) && goBack != callFrom_constant.FROM_GO_BACK) {
		
		handleGetPaymentCardsForProfile(callFrom_constant.MANAGE_CARD_DELTE_CALL, "deleteCard", cardExpandBoxId);
		/* Below API calls are used to refresh the page and update the scheduled bills and cards on manage cards page and bill status section */
		handleBPSchedulePaymentHist();
		handleGetLatestBPHistory();
	} else {
		handleGetPaymentCards(null, null, true);
	}
}

/********************************************************************************************
' Name                 :   fisrtNameErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the first name field onBlur.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function fisrtNameErrorValidation(fundingSourceTypes_JsonType) {
	var textValue = $("#firstNamePaymentCards" ).val();
	var regEx = /^[A-Za-z0-9\s,.'-]{0,50}$/;
	showHideError(regEx, textValue, "firstNamePaymentCards", "errorMainAreaAddCard1", "invalidMsgAddCard1", messages['editProfile.errorMsg.firstName'], true);
}

/********************************************************************************************
' Name                 :   lastNameErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the last name field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function lastNameErrorValidation(fundingSourceTypes_JsonType) {
	var textValue = $("#lastNamePaymentCards" ).val();
	var regEx = /^[A-Za-z0-9\s,.'-]{0,50}$/;
	showHideError(regEx, textValue, "lastNamePaymentCards", "errorMainAreaAddCard2", "invalidMsgAddCard2", messages['editProfile.errorMsg.lastName'],true);
}

/********************************************************************************************
' Name                 :   address1ErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId
' Purpose              :   Function is used for validating the address 1 field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function address1ErrorValidation(fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId) {
	var textValue = $("#"+ elementId).val();
	var regEx = /^(?:(?! ).)[a-zA-Z0-9\s,.'-]*$/;
	showHideError(regEx, textValue, elementId, errorMainDivId, errorMsgDivId, messages['editProfile.errorMsg.add1'],true);
}

/********************************************************************************************
' Name                 :   address2ErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId
' Purpose              :   Function is used for validating the address 2 field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function address2ErrorValidation(fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId) {
	var textValue = $("#"+ elementId ).val();
	var regEx = /^[a-zA-Z0-9\s,.'-]*$/;
	showHideError(regEx, textValue, elementId, errorMainDivId, errorMsgDivId, messages['editProfile.errorMsg.add2'],true);
}

/********************************************************************************************
' Name                 :   cityErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId
' Purpose              :   Function is used for validating the city field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function cityErrorValidation(fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId) {
	var textValue = $("#"+ elementId).val();
	var regEx = /^[A-Za-z0-9 ]{0,50}$/;
	showHideError(regEx, textValue, elementId, errorMainDivId, errorMsgDivId, messages['editProfile.errorMsg.city'],true);
}

/********************************************************************************************
' Name                 :   zipErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId
' Purpose              :   Function is used for validating the zip field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function zipErrorValidation(fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId) {
	var textValue = $("#"+ elementId ).val();
	var regEx = /^\d{5}$/;
	showHideError(regEx, textValue, elementId, errorMainDivId, errorMsgDivId, messages['editProfile.errorMsg.zip'],true);
}

/********************************************************************************************
' Name                 :   cvvErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the cvv field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function cvvErrorValidation(fundingSourceTypes_JsonType) {
	var textValue = $("#cvvPaymentCards" ).val();
	var regEx = /^[0-9]{3,4}$/;
	showHideError(regEx, textValue, "cvvPaymentCards", "errorMainAreaAddCard6", "invalidMsgAddCard6", messages['editProfile.errorMsg.cvv'],true);
}

/********************************************************************************************
' Name                 :   cardNoErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the Card No field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function cardNoErrorValidation(fundingSourceTypes_JsonType){
	var textValue = $("#cardNoPaymentCards").val();
	textValue = textValue.replace(/[\s\-]/g, '');
    var regEx = /^\d{16}$/;
    var flag = validatePinLunhForAddCardForm(textValue);
    showHideError(regEx, textValue, "cardNoPaymentCards", "errorMainAreaAddCard3", "invalidMsgAddCard3", messages['editProfile.errorMsg.card'], flag); 
}

/********************************************************************************************
' Name                 :   stateCodeErrorValidation
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId
' Purpose              :   Function is used for validating the State field onBlur.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function stateCodeErrorValidation(fundingSourceTypes_JsonType, elementId, errorMainDivId, errorMsgDivId){
	if ($('#' + elementId)[0].selectedIndex > 0) {
		$('#' + elementId).removeClass("error_red_border");
		$("#" + errorMainDivId).hide();
		$("#" + "mob" + errorMainDivId).hide();
		$("#" + errorMsgDivId).text("");
		$("#" + "mob" + errorMsgDivId).text("");
	} else {			
		/* Show error message */ 
		$('#' + elementId ).addClass("error_red_border");
		$("#" + errorMsgDivId).text(messages['editProfile.errorMsg.state']);
		$("#" + errorMainDivId).hide();
		$('#' + "mob" + errorMsgDivId).text(messages['editProfile.errorMsg.state']);
		$('#' + "mob" + errorMainDivId).show();
	}
}

/********************************************************************************************
' Name                 :   showHideError
' Return type          :   None
' Input Parameter(s)   :   regEx, textValue, elementId, fundingSourceTypes_JsonType, errorMainDivId, errorMsgDivId, errorMsg
' Purpose              :   Function is used for showing the error inline message on mobile and standard width.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function showHideError(regEx, textValue, elementId, errorMainDivId, errorMsgDivId, errorMsg, flag) {
	if(textValue){
		if (regEx.test(textValue) && flag) {
			hideErrorDiv(elementId, errorMainDivId, errorMsgDivId);
		} else {
			showErrorDiv(elementId, errorMainDivId, errorMsgDivId, errorMsg);
		}
	}else{
		hideErrorDiv(elementId, errorMainDivId, errorMsgDivId);
	}
}

/********************************************************************************************
' Name                 :   showErrorDiv
' Return type          :   None
' Input Parameter(s)   :   elementId, fundingSourceTypes_JsonType, errorMainDivId, errorMsgDivId, errorMsg
' Purpose              :   Function is used for showing the error message. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th july,2013       -   Karuna Mishra
'*******************************************************************************************/
function showErrorDiv(elementId, errorMainDivId, errorMsgDivId, errorMsg){
	/* Show error message */ 
	enableBtnFlag = false; 
	buttonStatusEnabled = false;
	$("#" + elementId ).addClass("error_red_border");
	$("#"+ errorMsgDivId).text(errorMsg);
	$('#' + errorMainDivId).hide();
	$('#' + "mob" + errorMsgDivId).text(errorMsg);
	$('#' + "mob" + errorMainDivId).show();
}

/********************************************************************************************
' Name                 :   hideErrorDiv
' Return type          :   None
' Input Parameter(s)   :   elementId, fundingSourceTypes_JsonType, errorMainDivId, errorMsgDivId, errorMsg
' Purpose              :   Function is used for hiding the error message. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th july,2013       -   Karuna Mishra
'*******************************************************************************************/
function hideErrorDiv(elementId, errorMainDivId, errorMsgDivId){
	/*  hide error message */
	$("#" + elementId).removeClass("error_red_border");
	$("#" + errorMainDivId).hide();
	$("#"+ "mob" + errorMainDivId).hide();
	$("#" + errorMsgDivId).text("");
	$("#" + "mob"+errorMsgDivId).text("");
	enableBtnFlag = true;
}
