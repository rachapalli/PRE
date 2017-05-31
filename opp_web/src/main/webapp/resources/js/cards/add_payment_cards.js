var timeIntevalOfCard;
var timeIntevalOfAddCard;
var cardHasAdded = false;
var regxObj = new Object(); 


/********************************************************************************************
' Name                 :   showAddPaymentCardForm
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, flagForBackButton
' Purpose              :   This method is used to add card payment for dynamically.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function showAddPaymentCardForm(fundingSourceTypes_JsonType, flagForBackButton){
	$('#giftCardId').hide();
	var addCardFormSection = createAddPaymentCardForm(fundingSourceTypes_JsonType, false);
	$('#useDiffrentCard' + fundingSourceTypes_JsonType).hide();
	emptyAllCardSection(fundingSourceTypes_JsonType);
	$("#addCardFormSection" + fundingSourceTypes_JsonType).empty();
	$("#addCardFormSection" + fundingSourceTypes_JsonType).html(addCardFormSection);
	$('#addCardFormSection' + fundingSourceTypes_JsonType).show();
	calculateMonthForExpirationDate("expiryMonthPaymentCards" + fundingSourceTypes_JsonType);
	calculateYearForExpirationDate("expiryYearPaymentCards" + fundingSourceTypes_JsonType);
	setStateList("stateOfPaymentCards" + fundingSourceTypes_JsonType);
	storeRegexExpOfAddCardFields(fundingSourceTypes_JsonType);
	clearInterval(timeIntevalOfAddCard);
	clearInterval(timeIntevalOfCard);
	enableAddCardSaveButton(fundingSourceTypes_JsonType);
}

/********************************************************************************************
' Name                 :   emptyOtherAddEditCardSection
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is clear Edit card area when user want to edit the another card . 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function emptyAllCardSection(fundingSourceTypes_JsonType){
	$("#listOfPaymentCard"+fundingSourceTypes_JsonType + " .vesta_manage_cardrow").each(function( index, element ) {
			$("#vesta_manage_cardrow_" + index).hide();
	});
}
/********************************************************************************************
' Name                 :   createAddPaymentCardForm
' Return type          :   {String}
' Input Parameter(s)   :   fundingSourceTypes_JsonType, flagForBackButton
' Purpose              :   This method is used to create the Add Payment Card form section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function createAddPaymentCardForm(fundingSourceTypes_JsonType, flagForBackButton){
	var addCardForm =  "<div class='add_pmt_method_cardarea' id='addPaymentCardForm'>"
			      	+  		"<div id='addCardForm" + fundingSourceTypes_JsonType + "' class='add_pmt_method_cardarea'>"
			      	+       "<div class='wid_flt100' id='advertisementPaymentPage" + fundingSourceTypes_JsonType + "'></div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='firstName'>" + messages['addPaymentCardForm.firstName'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard1'>"
			      	+ 					"<span class='failed_icon'></span>"
			      	+ 					"<span id='mobinvalidMsgAddCard1'></span>"
			      	+ 				"</div>"
			      	+ 				"<input type='text' name='firstName' id='firstNamePaymentCards"  + "' onblur='fisrtNameErrorValidation(\"" + fundingSourceTypes_JsonType + "\")'/>"
			      	+ 			"</div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='lastName'>" + messages['addPaymentCardForm.lastName'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard2'>"
			      	+ 					"<span class='failed_icon'></span>"
			      	+ 					"<span id='mobinvalidMsgAddCard2'></span>"
			      	+ 				"</div>"
			      	+ 				"<input type='text' name='lastName' id='lastNamePaymentCards"  + "' onblur='lastNameErrorValidation(\"" + fundingSourceTypes_JsonType + "\")'/>"
			      	+			"</div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='cardNumber'>" + messages['addPaymentCardForm.cardNo'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard3'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard3'></span>"
					+ 				"</div>"
					+ 				"<input type='tel' name='cardNumber' id='cardNoPaymentCards"  + "' onkeypress='return isValidCardNoEntered(this, event)'" 
					+ 					" onblur='cardNoErrorValidation(\"" + fundingSourceTypes_JsonType + "\")'/>"
					+			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='dateOfExpiry'>" + messages['addPaymentCardForm.expiryDate'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard4'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard4'></span>"
					+ 				"</div>"
					+ 				"<select name='dateOfExpiry' id='expiryMonthPaymentCards"  + "' class='select_wd160 mob_select_wd148' onchange='validateExpiryMonth(\"" + fundingSourceTypes_JsonType+ "\")'></select>"
					+ 				"<select name='dateOfExpiry' id='expiryYearPaymentCards"  + "' class='select_wd160 mob_select_wd148' onchange='validateExpiryMonth(\"" + fundingSourceTypes_JsonType+ "\")'></select>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+			 	"<label for='cvvNo'>" + messages['addPaymentCardForm.cvvNo'] + "</label>"
					+ 				"<div class='mob_error_msg err_cvv txt_inv' id='moberrorMainAreaAddCard6'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard6'></span>"
					+ 				"</div>"
					+ 				"<input type='tel' name='cvvNo' class='inp_cvv' id='cvvPaymentCards"  + "' maxlength='4' minlength='3'"
					+ 					" onkeypress='return isNumberKey(event)' onblur='cvvErrorValidation(\"" + fundingSourceTypes_JsonType + "\")'/>"
					+ 				"<span class='fa fa-info-circle fa-lg card_ques_icon col_wh' onclick='showAlertForCVVHint()' id='cvvHintIconAddCard" + fundingSourceTypes_JsonType + "'></span>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='firstAddress'>" + messages['addPaymentCardForm.add1'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard7'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard7'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='firstAddress' id='firstAddPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='address1ErrorValidation(\"" + fundingSourceTypes_JsonType + "\",\"firstAddPaymentCards\",\"errorMainAreaAddCard7\",\"invalidMsgAddCard7\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='secondAddress'>" + messages['addPaymentCardForm.add2'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard8'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard8'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='secondAddress' id='secondAddPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='address2ErrorValidation(\"" + fundingSourceTypes_JsonType + "\",\"secondAddPaymentCards\",\"errorMainAreaAddCard8\",\"invalidMsgAddCard8\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='city'>"+ messages['addPaymentCardForm.city'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard9'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard9'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='city' id='cityOfPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='cityErrorValidation(\"" + fundingSourceTypes_JsonType + "\",\"cityOfPaymentCards\",\"errorMainAreaAddCard9\",\"invalidMsgAddCard9\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='state'>" + messages['addPaymentCardForm.state'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard10'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard10'></span>"
					+ 				"</div>"
					+ 				"<select name='state' class='mob_wid99' id='stateOfPaymentCards'"
					+	 "onchange='stateCodeErrorValidation(\"" + fundingSourceTypes_JsonType + "\", \"stateOfPaymentCards\",\"errorMainAreaAddCard10\",\"invalidMsgAddCard10\")'></select>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='zipCode'>" + messages['addPaymentCardForm.zipCode'] +"</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard11'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard11'></span>"
					+ 				"</div>"
					+ 				"<input type='tel' name='zipCode' id='zipOfPaymentCards"  + "' maxlength='5' minlength='1'" 
					+ 					" onkeypress='return isNumberKey(event)' onblur='zipErrorValidation(\"" + fundingSourceTypes_JsonType + "\",\"zipOfPaymentCards\",\"errorMainAreaAddCard11\",\"invalidMsgAddCard11\")'/>"
					+ 			"</div>";
	if(parseBoolean(localStorage.getItem("registerUser"))) {
		if(isSaveCardEnable(fundingSourceTypes_JsonType)){ /* Checking if the card can be added for future use then show check box */
			addCardForm += "<div class='card_field_sep sv_card_later width_area40'>"
						+ "<input type='checkbox' name='checkbox' id='saveCardCheckBox" + fundingSourceTypes_JsonType + "'  checked class='txt_inv' />"
						+ "<span id='valCardCheckBox" + fundingSourceTypes_JsonType + "' class='fa fa-check fa-2x checked_mark_icon checked_def_img' onclick='changeOneTimeFlagClass(\"" + fundingSourceTypes_JsonType + "\")'></span>"
						+ messages['addPaymentCardForm.saveCardTxt'] 
			    		+ "</div>";
		} else {
			addCardForm += "<div class='card_field_sep sv_card_later width_area40'>"
						+ 	messages['addPaymentCardForm.saveCardMsg'] 
		        		+ "</div>";
		}
			
	}
	addCardForm += 		"<div class='width_area60 mob_vesta_wd100 flt_lft'>"
				+ 			"<input type='button' value='" + messages['addPaymentCardForm.backTxt'] + "' class='back_btn flt_lft' id='backPaymentCards'" 
				+ 				" onclick = 'showAlertForCancleButtonInAddCardForm(\"" + fundingSourceTypes_JsonType + "\"," + flagForBackButton + ")' />"
				+ 		"</div>"
				+	 "</div>"
				+ "</div>";
    return addCardForm;
}

/********************************************************************************************
' Name                 :   validateExpiryMonth
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the expiry date. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function validateExpiryMonth(fundingSourceTypes_JsonType){
	var month = $('#expiryMonthPaymentCards' + ' :selected').val().trim().toString();
	var year = $('#expiryYearPaymentCards' + ' :selected').val().trim().toString();
	var currentTime = new Date();
	var currentMonth = currentTime.getMonth() + 1;
	var currentYear = currentTime.getFullYear().toString();
	var century = currentYear.substring(0,2);

	if(month && year && (year != messages['addPaymentCardForm.yearTxt']) && (month != messages['addPaymentCardForm.monthTxt'])){
		if((month < currentMonth) && ((century+year) === currentYear)){
			showErrorDiv("expiryMonthPaymentCards", "errorMainAreaAddCard4", "invalidMsgAddCard4", messages['editPaymentCard.month']);
		}else{
			hideErrorDiv("expiryMonthPaymentCards", "errorMainAreaAddCard4", "invalidMsgAddCard4");
		}
	} else {
		hideErrorDiv("expiryMonthPaymentCards", "errorMainAreaAddCard4", "invalidMsgAddCard4"); 
	}
}

/********************************************************************************************
' Name                 :   isSaveCardEnable
' Return type          :   {Boolean}
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for check whether card can be saved for future 
							use or not.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function isSaveCardEnable(fundingSourceTypes_JsonType) {
	if (fundingSourceTypes_JsonType == jsonTypeConstant.VESTADEBIT) { /* Checking fundingSourceTypes_JsonType as DEBIT and returning if user can save it for later use */
		return cm_get_payment_card_obj.canAddDebit;
	} else if (fundingSourceTypes_JsonType == jsonTypeConstant.VESTACREDIT) { /* Checking fundingSourceTypes_JsonType as CREDIT and returning if user can save it for later use */
		return cm_get_payment_card_obj.canAddCredit;
	}
}

/********************************************************************************************
' Name                 :   showAlertForCVVHint
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for showing Alert for CVV hint.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function showAlertForCVVHint(){
	alert(messages['manageCardCVVHintTxt']);
}

/********************************************************************************************
' Name                 :   changeOneTimeFlagClass
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   This method is used to change the class for check box and set the 
                           property checked true.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   7th Oct,2013      -   Ravi Raj
'*******************************************************************************************/
function changeOneTimeFlagClass(fundingSourceTypes_JsonType){
	if($('#saveCardCheckBox' + fundingSourceTypes_JsonType).is(":checked")) { /* Checking if check box of future use is marked then unmarked it and change icon image */
		$("#saveCardCheckBox" + fundingSourceTypes_JsonType).prop('checked', false);
		$("#valCardCheckBox" + fundingSourceTypes_JsonType).removeClass("checked_mark_icon checked_def_img");
		$("#valCardCheckBox" + fundingSourceTypes_JsonType).addClass("unchecked_mark_icon checked_def_img"); 
	} else { /* Checking if check box of future use is not marked then mark it and change icon image */
		$("#saveCardCheckBox" + fundingSourceTypes_JsonType).prop('checked', true);
		$("#valCardCheckBox" + fundingSourceTypes_JsonType).removeClass("unchecked_mark_icon checked_def_img");
		$("#valCardCheckBox" + fundingSourceTypes_JsonType).addClass("checked_mark_icon checked_def_img"); 
	}
}

/********************************************************************************************
' Name                 :   showAlertForCancleButtonInAddCardForm
' Return type          :   None
' Input Parameter(s)   :   undingSourceTypes_TenderType, flagForBackButton, isCallFromEditCard, index
'		, manageCardsCallForCheckOut, callFromAnotherCard, callFromEditCard, lastFour
' Purpose              :   This is used to show alert if user try to Cancel filled Add Card form.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   10th Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function showAlertForCancleButtonInAddCardForm(fundingSourceTypes_TenderType, flagForBackButton, isCallFromEditCard, index
		, manageCardsCallForCheckOut, callFromAnotherCard, callFromEditCard, lastFour){
	$('#addCardTitle').addClass('hidden');
	var fundingSourse = fundingSourceTypes_TenderType;
	if(callFromAnotherCard){
		if(fundingSourceTypes_TenderType === detail_view_typeConstants.CREDIT){
			fundingSourse = detail_view_typeConstants.DEBIT;
		}else if(fundingSourceTypes_TenderType === detail_view_typeConstants.DEBIT){
			fundingSourse = detail_view_typeConstants.CREDIT;
		}
	}
	if(isValueInAddCardFormFields("addCardForm" + fundingSourse, callFromAnotherCard)) { /* Checking if user has filled any field in the form */
		var pathName = window.location.hash;
		/* Remove Add Card Form  from Manage Card Section if we are on Checkout Page then we will not remove Add card form. */
		showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		$('#clearOnClickBtn').unbind( "click" );
		$('#clearOnClickBtn').click(function(event){
			closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
			backToManageListScreen(fundingSourceTypes_TenderType, flagForBackButton, callFromAnotherCard);  /*If user clicks YES then move back to Card List Panel */
			if((!callFromEditCard && flagForBackButton && pathName != '#checkout' && pathName != '#error') || callFromAnotherCard) {
				showAddCardform(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut);
			}
			if(isCallFromEditCard ){
				checkCardFormChanges(index, fundingSourceTypes_TenderType, manageCardsCallForCheckOut,"fromEditCard", lastFour);
			}
			if (parseBoolean(localStorage.getItem("registerUser")) === false) {  /* Checking if its a GUEST user then clear the filled additional information field form */
				clearFormField("additional_info_box");
				$("#additional_info_box").hide();
			}
		});
		/*	if(confirm(messages["checkout.msg_payment_not_saved"])){  If filled then showing user a confirmation pop-up about his data will no longer be saved 
			backToManageListScreen(fundingSourceTypes_TenderType, flagForBackButton);  If user clicks YES then move back to Card List Panel 
			if (parseBoolean(localStorage.getItem("registerUser")) === false) {  Checking if its a GUEST user then clear the filled additional information field form 
				clearFormField("additional_info_box");
				$("#additional_info_box").hide();
			}
		}	*/
	} else { /* If user didn't filled any of the filled then let him move to List of Card panel without confirmation message */
		backToManageListScreen(fundingSourceTypes_TenderType, flagForBackButton, callFromAnotherCard);
		if (parseBoolean(localStorage.getItem("registerUser")) === false) { /* Checking if its a GUEST user then clear the filled additional information field form */
			clearFormField("additional_info_box");
			$("#additional_info_box").hide();
		}
	}
	if(!$("#addPaymentGiftId").is(":visible")){
		$('#giftCardId').show();
	}
}

/********************************************************************************************
' Name                 :   clearFormField
' Return type          :   None
' Input Parameter(s)   :   formBoxId
' Purpose              :   This method is used to clear data from all form fields.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function clearFormField(formBoxId){
	$("#" + formBoxId).find('input[type="text"]').each(function() {
		$(this).val("");
		removeErrorBorderClass($(this).attr('id')); /* Removing erro border if there is any */
	});
	$("#" + formBoxId).find('input[type="password"]').each(function() {
		$(this).val("");
		removeErrorBorderClass($(this).attr('id')); /* Removing erro border if there is any */
	});
	$("#" + formBoxId).find('input[type="tel"]').each(function() {
		$(this).val("");
		removeErrorBorderClass($(this).attr('id')); /* Removing erro border if there is any */
		$("#frmGuestAddInfoChkOut .mob_error_msg").hide();
	});
}

/********************************************************************************************
' Name                 :   backToManageListScreenPreviousFunction
' Return type          :   None
' Input Parameter(s)   :   String fundingSourceTypes_JsonType, flagForBackButton
' Purpose              :   This method is used to show the manage list screen on the click of
                           back button.Previous dolly function
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function backToManageListScreenPreviousFunction(fundingSourceTypes_JsonType, flagForBackButton){
	if(flagForBackButton){
		$('#panel' + fundingSourceTypes_JsonType).hide();
		$("#cardButtonImageArea" + fundingSourceTypes_JsonType).toggleClass("vesta_delivered_icon");
	}
	$('#addCardFormSection' + fundingSourceTypes_JsonType).hide();
	$('#listOfPaymentCard' + fundingSourceTypes_JsonType).show();
	showAllCardSection(fundingSourceTypes_JsonType);
	$('#useDiffrentCard' + fundingSourceTypes_JsonType).show();
	clearFormField('addCardForm' + fundingSourceTypes_JsonType);
	clearInterval(timeIntevalOfAddCard);
	clearInterval(timeIntevalOfCard);
	if($('#listOfPaymentCard' + fundingSourceTypes_JsonType).is(":visible")) {
		activateCheckoutPayButton();
	} else {
		deActivateCheckoutPayButton();
	}
}

/********************************************************************************************
' Name                 :   showAllCardSection
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is clear Edit card area when user want to edit the another card . 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function showAllCardSection( fundingSourceTypes_JsonType){
	$("#listOfPaymentCard"+fundingSourceTypes_JsonType + " .vesta_manage_cardrow").each(function( index, element ) {
			$("#vesta_manage_cardrow_" + index).show();
	});
}

/********************************************************************************************
' Name                 :   backToManageListScreen
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, flagForBackButton, callFromAnotherCard
' Purpose              :   This method is used to show the manage list screen on the click of
                           back button.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   04 July,2014      -   Ravi Raj
'*******************************************************************************************/
function backToManageListScreen(fundingSourceTypes_JsonType, flagForBackButton, callFromAnotherCard){
	if(flagForBackButton){
		$('#panel' + fundingSourceTypes_JsonType).hide();
		$("#cardButtonImageArea" + fundingSourceTypes_JsonType).toggleClass("vesta_delivered_icon");
	}
	var pathName = window.location.hash;
	/* Remove Add Card Form  from Manage Card Section if we are on Checkout Page then we will not remove Add card form. */
	if(pathName !='#checkout' || $('#mainContainerManageCardSec').is(':visible') ){ 
		$('#addPaymentCardForm').remove();
	}
	if(callFromAnotherCard){
		var fundingSourse = "";
		if(fundingSourceTypes_JsonType === detail_view_typeConstants.CREDIT){
			fundingSourse = detail_view_typeConstants.DEBIT;
		}else if(fundingSourceTypes_JsonType === detail_view_typeConstants.DEBIT){
			fundingSourse = detail_view_typeConstants.CREDIT;
		}
		$('#addNewCardBtnForManage'+fundingSourse).show();
	}else{
		$('#addNewCardBtnForManage' + tenderTypeConstant.DEBIT).show();
		$('#addNewCardBtnForManage' + tenderTypeConstant.CREDIT).show();
	}
	
	clearFormField('addCardForm' + fundingSourceTypes_JsonType);
	clearInterval(timeIntevalOfAddCard);
	clearInterval(timeIntevalOfCard);
	if($('#listOfPaymentCard' + fundingSourceTypes_JsonType).is(":visible")) {
		activateCheckoutPayButton();
	} else {
		deActivateCheckoutPayButton();
	}
}

/********************************************************************************************
' Name                 :   calculateMonthForExpirationDate
' Return type          :   None
' Input Parameter(s)   :   monthElementId
' Purpose              :   This method is used to calculate the the month for date of expiry.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function calculateMonthForExpirationDate(monthElementId){
	var monthSelect = document.getElementById(monthElementId);
	var option = document.createElement('option');
	option.innerHTML = messages['addPaymentCardForm.monthTxt'];
	monthSelect.appendChild(option);
	for ( var index = 1; index < 13; index++) {
		var option = document.createElement('option');
		option.innerHTML = index;
		option.value = index;
		monthSelect.appendChild(option);
	}
}

/********************************************************************************************
' Name                 :   calculateYearForExpirationDate
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to for calculating the next 9 year for card 
                           expiration year.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function calculateYearForExpirationDate(yearElementId){
	var date = new Date();
	var year = date.getFullYear();
	var yearSelect = document.getElementById(yearElementId);
	var option = document.createElement('option');
	option.innerHTML = messages['addPaymentCardForm.yearTxt'];
	yearSelect.appendChild(option);
	for ( var index = 0; index <= 9; index++) {
		var finalyear = year + index;
		var option = document.createElement('option');
		option.innerHTML = finalyear.toString();
		option.value = finalyear.toString().substring(2);
		yearSelect.appendChild(option);
	}
}

/********************************************************************************************
' Name                 :   setStateList
' Return type          :   None
' Input Parameter(s)   :   stateElementId
' Purpose              :   This method is used to show the state code.
' History Header       :   Version   -   Date                 -   Developer Name
' Added By             :   1.0       -   4th October,2013     -   Karuna Mishra
'*******************************************************************************************/
function setStateList(stateElementId){
	var state = document.getElementById(stateElementId);
	var counter = messages['editProfile.state.code.counter']; /* Reading counter value and state code from the property file. */

    //Create the first option in the list, with value hard coded to be empty string
    var option = document.createElement('option');
    option.innerHTML = messages['editProfile.state.codeOption.0'];
    option.value = '';
    state.appendChild(option);

    //First option is created above, start fetching from the resource bundle with the second option
	for ( var index = 1; index <= counter; index++) {
		var option = document.createElement('option');
		option.innerHTML = messages['editProfile.state.codeOption' + '.' + index];
		option.value = messages['editProfile.state.codeValue' + '.' + index];
		state.appendChild(option);
	}
}

/********************************************************************************************
' Name                 :   storeRegexExpOfAddCardFields
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_TenderType
' Purpose              :   Function is used for storing the regex expression for Input fields.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   23th Oct,2013     -   Karuna Mishra
'*******************************************************************************************/
function storeRegexExpOfAddCardFields(fundingSourceTypes_TenderType) {
	regxObj["firstNamePaymentCards"] = /^[A-Za-z0-9\s,.'-]{0,50}$/;
	regxObj["lastNamePaymentCards" ] = /^[A-Za-z0-9\s,.'-]{0,50}$/;
	regxObj["cvvPaymentCards" ] = /^[0-9]{3,4}$/;
	regxObj["firstAddPaymentCards" ] = /^(?:(?! ).)[a-zA-Z0-9\s,.'-]*$/;
	regxObj["secondAddPaymentCards" ] = /^[a-zA-Z0-9\s,.'-]*$/;
	regxObj["cityOfPaymentCards" ] = /^[A-Za-z0-9 ]{0,50}$/;
	regxObj["zipOfPaymentCards" ] = /^\d{5}$/;
	regxObj["cardNoPaymentCards"] = /^\d{16}$/;
}

/********************************************************************************************
' Name                 :   enableAddCardSaveButton
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used to run 2 timers to enable Pay button when there 
							is no error and empty fields in Add Payment Card Form. 
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   17th Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function enableAddCardSaveButton(fundingSourceTypes_JsonType) {
	timeIntevalOfAddCard = setInterval("enableDisableSaveBtn('addCardForm" + fundingSourceTypes_JsonType + "', 'secondAddPaymentCards" 
			 + "','" + fundingSourceTypes_JsonType + "')", 500);
	timeIntevalOfCard = setInterval("validateOnKeyPress('addCardForm" + fundingSourceTypes_JsonType + "','" + fundingSourceTypes_JsonType + "')", 500);
}

/********************************************************************************************
' Name                 :   enableDisableSaveBtn
' Return type          :   None 
' Input Parameter(s)   :   frmElementDivId, submitBtnId, elementId, fundingSourceTypes_JsonType
' Purpose              :   Function is used to enable Pay button when there is no error and 
							empty fields in Add Payment Card Form. 
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   17th Oct,2013	   -   Karuna Mishra
'*******************************************************************************************/
function enableDisableSaveBtn(frmElementDivId, elementId, fundingSourceTypes_JsonType) {
	var buttonStatusEnabled = true;
	var month = $('#expiryMonthPaymentCards'  + ' :selected').val();
	var year = $('#expiryYearPaymentCards'  + ' :selected').val();
	var $inputFields = $('#' + frmElementDivId + ' :input'); /* Getting all the input field of form into a variable */
	$inputFields.each(function() { /* Iterating through all the input fields in the form */
		var regEx = regxObj[$(this).attr('id')]; /* Getting reglar expression associated wiyh current field id */
		if($(this).attr('id') != elementId) { /* Checking if current field is not "Addess2" field because its not a mandatory field */
			var value = $(this).val(); /* Getting the evalue of current field */
			if($(this).attr('id') === "cardNoPaymentCards" ){ /* Checking for the field that contains Card No */
				value = value.replace(/[\s\-]/g, ''); /* Removing any - or spaces from Card No */
			}
			/* Validating if required field does not contain any value or has error red border or does not pass its regular expression */
			if( $(this).hasClass('error_red_border') || !value || (regEx && !regEx.test(value))) {
				buttonStatusEnabled = false;
			}
		} else {
			/* Validating if optional field has error red border or does not pass its regular expression */
			if($(this).hasClass('error_red_border') || (regEx && !regEx.test($(this).val()))) {
				buttonStatusEnabled = false;
			}	
		}
		/* Validating the expiration month and year fields */
		if(($(this).attr('id') === 'expiryMonthPaymentCards' ) || ($(this).attr('id') === 'expiryYearPaymentCards')) {
			if((year === messages['addPaymentCardForm.yearTxt']) || (month === messages['addPaymentCardForm.monthTxt'])){
				buttonStatusEnabled = false;
			}
		}
	});
	if(buttonStatusEnabled) { /* Checking if all the validation successfully passes */
		if(parseBoolean(localStorage.getItem("registerUser"))) { /* Checking if its a registered user then enable PAY button */
			activateSaveButtonInAddCard();
			activateCheckoutPayButton();
		} else {
			enableDisableSubmitForGuest('frmGuestAddInfoChkOut');
		}
		typeOfPaymentCard = fundingSourceTypes_JsonType;
	} else { /* Otherwise if any of the validation fails disable the PAY button */
		deActivateSaveButtonInAddCard();
		deActivateCheckoutPayButton();
	}
}

/********************************************************************************************
' Name                 :   validateOnKeyPress
' Return type          :   None 
' Input Parameter(s)   :   frmElementDivId, fundingSourceTypes_JsonType
' Purpose              :   Function is used to remove and hide error red border and error 
							message on key press. 
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   17th Oct,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validateOnKeyPress(frmElementDivId, fundingSourceTypes_JsonType) {
	var $inputFields = $('#' + frmElementDivId + ' :input'); /* Getting all the input field of form into a variable */
	$inputFields.each(function() { /* Iterating through all the input fields in the form */
		var regEx = regxObj[$(this).attr('id')]; /* Getting reglar expression associated with current field id */
		var value = $(this).val(); /* Getting the evalue of current field */
		if($(this).attr('id')=== "cardNoPaymentCards" ) { /* Checking for the field that contains Card No */
			value = value.replace(/[\s\-]/g, ''); /* Removing any - or spaces from Card No */
		}
		if((regEx && regEx.test(value)) ) {/* Validating the field with its regular expression */
			
			if($(this).attr('id') === "firstNamePaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard1").hide();
				$("#"+ "moberrorMainAreaAddCard1").hide();
			} else if($(this).attr('id') === "lastNamePaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard2").hide();
				$("#"+ "moberrorMainAreaAddCard2").hide();
			} else if($(this).attr('id') === "cardNoPaymentCards"  && validatePinLunhForAddCardForm(value)) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard3").hide();
				$("#"+ "moberrorMainAreaAddCard3").hide();
			} else if($(this).attr('id') === "zipOfPaymentCards"  ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard11").hide();
				$("#"+ "moberrorMainAreaAddCard11").hide();
			} else if($(this).attr('id') === "cvvPaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard6").hide();
				$("#"+ "moberrorMainAreaAddCard6").hide();
			} else if($(this).attr('id') === "firstAddPaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard7").hide();
				$("#"+ "moberrorMainAreaAddCard7").hide();
			} else if($(this).attr('id') === "secondAddPaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard8").hide();
				$("#"+ "moberrorMainAreaAddCard8").hide();
			} else if($(this).attr('id') === "cityOfPaymentCards" ) {
				$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
				$("#errorMainAreaAddCard9").hide();
				$("#"+ "moberrorMainAreaAddCard9").hide();
			}
		}
	});
}

/********************************************************************************************
' Name                 :   getTokenForCard
' Return type          :   None
' Input Parameter(s)   :   cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut
' Purpose              :   This method is used to call the tokenization java script for get 
                           token for card no.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function getTokenForCard(cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut){
	if(enableBtnFlag){
		showProgressBar();/* Show progress bar on click of respective button */
		submitBtnDisableUI('saveBtnIdForAddCardForm');/* Disabling the add card form save button on manage cards */
		var cardNumber = $('#cardNoPaymentCards' ).val().toString();
		var cardNum = cardNumber.replace(/[\s\-]/g, '');
        var cardToken , lastFour, firstSix, paymentDeviceTypeCD;
        VestaToken.getCreditCardToken({
              chargeAccountNumber: cardNum,
              onSuccess: function (data) {
            	  clearIntervalApp(timeIntevalOfAddCard);/* Clearing the interval and making it as null */
            		timeIntevalOfAddCard = null;
                  //populate the token
                  var ccNum = cardNum;
                  if (ccNum != 0) {
                	  cardToken = data.ChargeAccountNumberToken;
                	  lastFour = data.PaymentDeviceLast4;
                      if (ccNum.length >= 6) {
                    	  firstSix = ccNum.substr(0, 6);
                      }
                  }
                  paymentDeviceTypeCD = data.PaymentDeviceTypeCD;
                  //Calling add card api for adding the card for payment.
                  handleAddPaymentCards(cardToken, lastFour, firstSix, cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut);
              },
              onFail: function (failure) {
            	  activateCheckoutPayButton();
            	  showGeneralErrorMsg(failure);
            	  hideProgressBar(); 
              },
              onInvalidInput: function (failure) {
            	  activateCheckoutPayButton();
            	  showGeneralErrorMsg(failure);
            	  hideProgressBar(); 
              }
          });
	}else{
		enableAddCardSaveButton(cardPaymentBoxId);
	}
}

/********************************************************************************************
' Name                 :   handleAddPaymentCards
' Return type          :   None
' Input Parameter(s)   :   cardToken, lastFour, firstSix, cardPaymentBoxId, manageCardCallForAddingCard
' , manageCardsCallForCheckOut
' Purpose              :   This method is used to call the CM_ADD_PAYMENT_CARDS api for adding
                           the card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function handleAddPaymentCards(cardToken, lastFour, firstSix, cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut){
	deActivateCheckoutPayButton();
	showProgressBar();
	var month = $('#expiryMonthPaymentCards' + ' :selected').val().trim().toString();
	var year = $('#expiryYearPaymentCards' + ' :selected').val().trim().toString();
	var countryCode = messages['addPaymentCardForm.countryCode'];
	var defaultFlag = false;
	if($('#saveCardCheckBox' + cardPaymentBoxId) && $('#saveCardCheckBox' + cardPaymentBoxId).is(":checked")
			|| manageCardCallForAddingCard === callFrom_constant.MANAGE_ADD_CARD_CALL){
		defaultFlag = true;
	}
	var oneTimeUseFlag = true;
	if(parseBoolean(localStorage.getItem("registerUser"))) {
		if(isSaveCardEnable(cardPaymentBoxId)) {
			oneTimeUseFlag = getOneTimeFlag(cardPaymentBoxId);	
		} 
		if(manageCardCallForAddingCard === callFrom_constant.MANAGE_ADD_CARD_CALL) {
			oneTimeUseFlag = false;
		}
	}
	/* Following code is used for create request object for API call. */
	var request = {};
	request.locale = getCookie("locale").toString();
	request.applicationId =applicationId.toString();
	request.userId = getCookie('userId');
	request.cardToken = cardToken;
	request.cardFirstSix = firstSix;
	request.cardLastFour = lastFour;
	request.cardExpireDate = getDateOfExpiry(month, year);
	request.defaultFlag = defaultFlag;
	request.oneTimeUseFlag = oneTimeUseFlag;
	request.firstName = $('#firstNamePaymentCards').val().trim().toString();
	request.lastName =  $('#lastNamePaymentCards').val().trim().toString();
	request.address1 = $('#firstAddPaymentCards').val().trim().toString();
	request.address2 = $('#secondAddPaymentCards').val().trim().toString();
	request.city =  $('#cityOfPaymentCards').val().trim().toString();
	request.state =  $("#stateOfPaymentCards").val().trim().toString();
	request.country = countryCode.toString();
	request.zip = $('#zipOfPaymentCards').val().trim().toString();
	request.cvv = $('#cvvPaymentCards').val().trim().toString();
	/* This code segment is used for making CM_ADD_PAYMENT_CARDS API call. */
	var call_cm_add_payment_card_obj = new cm_add_payment_card(request, cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut);
	call_cm_add_payment_card_obj.call();
}

/********************************************************************************************
' Name                 :   getDateOfExpiry
' Return type          :   Date
' Input Parameter(s)   :   month, year
' Purpose              :   This method is used to calculate the expiry date of card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function getDateOfExpiry(month, year){
	var dateOfExpiration;
	if (month.length < 2) {
		dateOfExpiration = "0" + month + "/" + year;
	} else {
		dateOfExpiration = month + "/" + year;
	}
	return dateOfExpiration.toString();
}

/********************************************************************************************
' Name                 :   getOneTimeFlag
' Return type          :   {Boolean}
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   This method is used to return the one time flag value as a string.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function getOneTimeFlag(fundingSourceTypes_JsonType){
	if ($('#saveCardCheckBox' + fundingSourceTypes_JsonType).is(':checked')) {
		return false;
	}
	return true;
}

/********************************************************************************************
' Name                 :   handleCmAddPaymentCardOnSuccess
' Return type          :   None
' Input Parameter(s)   :   cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut
' Purpose              :   This method is used to handle the response of CM_ADD_PAYMENT_CARDS 
							API for adding the card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function handleCmAddPaymentCardOnSuccess(cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut){
	cardInfoObject[0] = new Object();
	cardInfoObject[0].cvv = $('#cvvPaymentCards' ).val().trim().toString();
	cardInfoObject[0].amount = ""+ getFormatedNumber($('#amountDueTotal').text());
	cardInfoObject[0].loadAccountNumber = cm_add_payment_card_obj.paymentCard.id;
	cardPaymentBoxId = cm_add_payment_card_obj.paymentCard.fundingPartnerFeeConfig.jsonType;
	cardInfoObject[0].type = cardPaymentBoxId;
	clearInterval(timeInteval);
	clearInterval(timeIntevalOfCard);

	validatePopUpForProfileAddCard();
}

/********************************************************************************************
' Name                 :   validatePopUpForProfileAddCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate GetPaymentCards/ SubmitPaymentGroup.
' History Header       :   Version   -   Date             -   Developer Name
' Added By             :   1.0       -   13th Feb,2015    -   UmaMaheswara Rao
'*******************************************************************************************/
function validatePopUpForProfileAddCard() {
	/* Get the service fee percent by iterating cards */
	var serviceFeePercent = calculateAddCardServiceFeePercent();
	/* Calculate service fee using service fee percent */
	var serviceFee = calculateCardServiceFee(serviceFeePercent);
	/* When check out page not visible */
	if (serviceFeePercent > 0 && $('#chkoutPaymentSec').is(":hidden")) {
		$("#addCardServiceId").text(formatMessage(messages['manageCard.addCardPopUp'], serviceFeePercent));
		$("#addCardIdForChange").text(messages['manageProfile.serviceText']);
		showAnimatedPopup('cardBillPayId', 'cardBillPayPopup'); 
		hideProgressBar();
	} else if (serviceFeePercent == 0 && $('#chkoutPaymentSec').is(":hidden")) {/* Check out is hidden and there is no fee */
		handleGetPaymentCardsForProfile(callFrom_constant.MANAGE_CARD_DELTE_CALL, "addCard"
				, cm_add_payment_card_obj.paymentCard.cardType);
	} else if (serviceFeePercent && serviceFee && $('#chkoutPaymentSec').is(":visible")) { /* Check out page and if theer is any service fee */
		$("#chkOutServiceFeeId").text(formatMessage(messages['checkout.serviceFeePopUp'], serviceFeePercent, serviceFee));
		$("#chkOutUseDebitId").text(messages['checkout.useDebitForFree']);
		showAnimatedPopup('paymentBillPayId', 'paymentBillPayPopup'); 
		hideProgressBar();
	} else if (serviceFeePercent == 0 && $('#chkoutPaymentSec').is(":visible")) { /* Chekc out page is visible and there is no service fee */
		submitCart(getVisibleFundingType());
	}
}

/********************************************************************************************
' Name                 :   getVisibleFundingType
' Return type          :   visibleJsonType
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get the Funding type based on visibility. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Feb,2015     -   UmaMaheswara Rao
'*******************************************************************************************/
function getVisibleFundingType() {
	var visibleJsonType = '';
	for(var arrayIndex in cardOptionJsonTypes) {/* Iterate the Json types */
		var cardOptionJsonType = "";
		/* Match with the Json types to return fundign type */
		if (cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITVISA 
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITMASTER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITDISCOVER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITVISAOTHER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITMASTERCARDOTHER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTADEBITDISCOVERCARDOTHER) {
			cardOptionJsonType = jsonTypeConstant.VESTADEBIT;
		} else if (cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITVISA 
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITMASTER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITDISCOVER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITVISAOTHER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITMASTERCARDOTHER
				|| cardOptionJsonTypes[arrayIndex] === jsonTypeConstant.VESTACREDITDISCOVERCARDOTHER) {
			/* Match with the Json types to return fundign type */
			cardOptionJsonType = jsonTypeConstant.VESTACREDIT;
		}
		if ($("#panel" + cardOptionJsonType).is(":visible")) {/* Return visible panle like DEBIT/REIT. */
			visibleJsonType = cardOptionJsonType;
			break;
		}
	}
	return visibleJsonType;
}

/********************************************************************************************
' Name                 :   calculateAddCardServiceFeePercent
' Return type          :   None
' Input Parameter(s)   :   ServiceFeePercent
' Purpose              :   This method is used to fetch serviceFeePercent from ADD_PAYMENT_CARDS. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Feb,2015    -   UmaMaheswar Rao
'*******************************************************************************************/
function calculateAddCardServiceFeePercent() {
	var serviceFeePercent = 0;
	/* Getting service fee percent by iterating pament cards */
	if (cm_add_payment_card_obj.paymentCard.fundingPartnerFeeConfig) {
		if(cm_add_payment_card_obj.paymentCard.fundingPartnerFeeConfig.serviceFeePercent > 0){
			serviceFeePercent = cm_add_payment_card_obj.paymentCard.fundingPartnerFeeConfig.serviceFeePercent;
		}
	}
	return serviceFeePercent;
}

/********************************************************************************************
' Name                 :   calculateCardServiceFee
' Return type          :   serviceFeePercent
' Input Parameter(s)   :   serviceFee
' Purpose              :   This method is used to calculate the seviceFee using ServiceFeePercent. 
							API for adding the card.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   13th ,2015     -   UmaMaheswara Rao
'*******************************************************************************************/
function calculateCardServiceFee(serviceFeePercent) {
	var serviceFee = 0;
	var amountDueChkOut = getFormatedNumber($("#amountDueTotal").text());
	/* CValculating service fee by using service fee percent */
	if(serviceFeePercent){
		serviceFee = amountDueChkOut/100*serviceFeePercent;
	}
	return serviceFee.toFixed(2);
}

/********************************************************************************************
' Name                 :   onClickServiceOkBtn
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to call Get_Payment_cards from profile Page. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Feb,2015     -   UmaMaheswara Rao
'*******************************************************************************************/
function onClickServiceOkBtn() {
	closeAnimatedPopup('cardBillPayId', 'cardBillPayPopup');
	/* Call get paymetn cards API */
	handleGetPaymentCardsForProfile(callFrom_constant.MANAGE_CARD_DELTE_CALL, "addCard"
			, cm_add_payment_card_obj.paymentCard.cardType);
}

/********************************************************************************************
' Name                 :   showSucessMessageForAddAndEditCard
' Return type          :   None
' Input Parameter(s)   :   messsageKey
' Purpose              :   This method is used to show success message when user add or edit the card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th july,2014     -   Karuna Mishra
'*******************************************************************************************/
function showSucessMessageForAddAndEditCard(messsageKey){
	$('#generalSuccessNotificationForAddCardText').html("");
	$('#generalSuccessNotificationForAddCardText').html(messsageKey);
	$('#generalSuccessNotificationForAddCard').show();
}

/********************************************************************************************
' Name                 :   showErrorMessageForAddAndEditCard
' Return type          :   None
' Input Parameter(s)   :   messsageKey
' Purpose              :   This method is used to show error message when user add or edit the card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th july,2014     -   Karuna Mishra
'*******************************************************************************************/
function showErrorMessageForAddAndEditCard(messsageKey){
	$('#generalErrorNotificationForAddCardText').html("");
	$('#generalErrorNotificationForAddCardText').html(messsageKey);
	$('#generalErrorNotificationForAddCard').show();
}
