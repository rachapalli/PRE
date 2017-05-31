var isDefaultFlag = "false";
var timeInteval;
var timeIntevalOfDelete;
var enableBtnFlag = false;
var regexObj = new Object();
var isCheckStatusFlag = true;
var paymentCardEditCancel;

/********************************************************************************************
' Name                 :   showEditCard
' Return type          :   None
' Input Parameter(s)   :   index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut, lastFour
' Purpose              :   Function is used for showing the edit card page with pre-filed 
							information of card.
' History Header       :   Version   -   Date              		-   Developer Name
' Added By             :   1.0       -   30th Sept,2013     	-   Karuna Mishra
'*******************************************************************************************/
function showEditCard(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut, lastFour) {
	if(($("#addCardTitle").is(':visible'))  || ($("#addCardMobTitle").is(':visible')) ){
		var fundingSourse = fundingSourceTypes_JsonType; 
		var activeAddCardFundingSourse = getVisibleAddCardFormFundingSource();
		if(activeAddCardFundingSourse != fundingSourceTypes_JsonType){
			fundingSourse = activeAddCardFundingSourse;
		}
		showAlertForCancleButtonInAddCardForm(fundingSourse,false,true, index, manageCardsCallForCheckOut, false, true, lastFour);
	}
	if(!$("#addPaymentCardForm").length){
		if(!$("#editCardContainer" + fundingSourceTypes_JsonType + index).is(':visible')){
			if(!$('#editCardForm').length || !isEditCardFieldsChanged(fundingSourceTypes_JsonType) ){
				checkCardFormChanges(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut,"fromEditCard", lastFour);
			}else{
				if(isEditCardFieldsChanged(fundingSourceTypes_JsonType) /*&& confirm(messages["checkout.msg_editCard_cancel"])*/){
					showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
					$('#clearOnClickBtn').unbind( "click" );
					$('#clearOnClickBtn').click(function(event){
						closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
						checkCardFormChanges(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut,"fromEditCard", lastFour);
					});
				}
			}
		}
	}
}

/********************************************************************************************
' Name                 :   checkCardFormChanges
' Return type          :   None
' Input Parameter(s)   :   index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fromEditCardOrAddCard, lastFour
' Purpose              :   Function is used for Check Something change in Add or Edit card form
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function checkCardFormChanges(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fromEditCardOrAddCard, lastFour){
	var paymentCard = '';
	if(fromEditCardOrAddCard === 'fromEditCard'){
		for(var indexone = 0; indexone < cm_get_payment_card_obj.paymentCards.length; indexone++){
			if(lastFour === cm_get_payment_card_obj.paymentCards[indexone].cardLastFour){
				paymentCard = cm_get_payment_card_obj.paymentCards[indexone];
			}
		}
		 /* Getting the array with index for each card */
		paymentCardEditCancel = paymentCard;
		createEditCardFormSection(fundingSourceTypes_JsonType, paymentCard, index, manageCardsCallForCheckOut);
		enableEditCardSaveButton(fundingSourceTypes_JsonType);
		deActivateCheckoutPayButton();
		$("#additional_info_box").hide();
	}
}

/********************************************************************************************
' Name                 :   createEditCardFormSection
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, paymentCard, index, manageCardsCallForCheckOut
' Purpose              :   Function is used for creating the Edit card page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function createEditCardFormSection(fundingSourceTypes_JsonType, paymentCard, index, manageCardsCallForCheckOut){
	var flagForBackButton = false;
	var editCardForm = "<div id='editCardContainer"+fundingSourceTypes_JsonType + index +"' class='add_pmt_method_cardarea'>"
						+ "<div id='editCardForm' class='add_pmt_method_cardarea'>" 
						+ " <div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.userName'] + "</label>"
						+ "<label class='fnt_wt' id='editCrdPmtNameOnCrd"  + "'>" + "</label>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.typeOfCrd'] + "</label>"
						+ "<label class='fnt_wt' id='editCrdPmtCrdTyp" +  "'>" + "</label>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.cardLastFr'] + "</label>"
						+ "<label class='fnt_wt' id='editCrdPmtlstFour"  + "'>" + "</label>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.cardExpiryDate'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard1'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard1'></span>"
						+ "</div>"
						+ "<select name='select' id='editCardPmtMmSelect' class='select_wd88' onchange='validateExpiryMonthYearOfEditCard(\"" + fundingSourceTypes_JsonType + "\")'>"
						+ "</select>"
						+ "<select name='select2' id='editCardPmtYySelect' class='select_wd88' onchange='validateExpiryMonthYearOfEditCard(\"" + fundingSourceTypes_JsonType + "\")'>"
						+ "</select>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label for='cvvNo'>" + messages['addPaymentCardForm.cvvNo'] + "</label>"
						+ "<div class='mob_error_msg err_cvv txt_inv' id='moberrorMainAreaAddCard6'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgAddCard6'></span>"
						+ "</div>"
						+ "<input type='tel' name='cvvNo' class='inp_cvv' id='cvvPaymentCards" + "' maxlength='4' minlength='3'"
						+ 	" onkeypress='return isNumberKey(event)' onblur='cvvErrorValidation(\"" + fundingSourceTypes_JsonType + "\")'/>"
						+ "<span class='fa fa-info-circle fa-lg card_ques_icon' onclick='showAlertForCVVHint()' id='cvvHintIconAddCard" + fundingSourceTypes_JsonType + "'></span>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.address1'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard3'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard3'></span>"
						+ "</div>"
						+ "<input type='text' id='editCrdPmtAddress1"  + "' onblur='address1ErrorValidation(\"" 
						+ 	fundingSourceTypes_JsonType + "\", \"editCrdPmtAddress1\",\"errorMainAreaEditCard3\",\"invalidMsgEditCard3\")'/>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.address2'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard4'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard4'></span>"
						+ "</div>"
						+ "<input type='text'  id='editCrdPmtAddress2" + "' onblur='address2ErrorValidation(\"" 
						+ 	fundingSourceTypes_JsonType + "\", \"editCrdPmtAddress2\",\"errorMainAreaEditCard4\",\"invalidMsgEditCard4\")'/>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.city'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard5'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard5'></span>"
						+ "</div>"
						+ "<input type='text'  id='editCrdPmtCity" + "' onblur='cityErrorValidation(\"" + fundingSourceTypes_JsonType 
						+ 	"\", \"editCrdPmtCity\",\"errorMainAreaEditCard5\",\"invalidMsgEditCard5\")'/>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.state'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard6'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard6'></span>"
						+ "</div>"
						+ "<select id='editCrdPmtState' onchange='sateCodeErrorValidation(\"" + fundingSourceTypes_JsonType 
						+ 	"\", \"editCrdPmtState\",\"errorMainAreaEditCard6\",\"invalidMsgEditCard6\")'>"
						+ "</select>"
						+ "</div>"
						+ "<div class='card_field_sep'>"
						+ "<label>" + messages['editPaymentCard.zip'] + "</label>"
						+ "<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaEditCard7'>"
						+ "<span class='failed_icon'></span>"
						+ "<span id='mobinvalidMsgEditCard7'></span>"
						+ "</div>"
						+ "<input type='tel'  id='editCrdPmtZip"  +"' maxlength='5' minlength='1' onkeypress='return isNumberKey(event)'" 
						+ 	" onblur='zipErrorValidation(\"" + fundingSourceTypes_JsonType + "\", \"editCrdPmtZip\",\"errorMainAreaEditCard7\",\"invalidMsgEditCard7\")'/>"
						+ "</div>"
						+ "<div class='card_field_sep txt_nwmiddle'>"
						+ "<input type='button' id='editCrdPmtSave' class='mob_mrgn_rght0 sv_submit_inactive_btn bg_grey1 wid_min116 hgt34 mrgn_both flt_rght' onclick='makeRequestObjForEditCardOnSave(\"" + paymentCard.id + "\",\"" 
						+ 	paymentCard.firstName + "\",\"" + paymentCard.lastName + "\",\"" + fundingSourceTypes_JsonType + "\",\"" + index + "\",\"" + manageCardsCallForCheckOut + "\");' value='" + messages['addPaymentCardForm.saveTxt'] + "'/>"
						+ "<input type='button' id='editCrdPmtBack' class='edit_card_cancelbtn flt_lft' onclick='editCardCancelBtn(\"" + fundingSourceTypes_JsonType + "\"," + flagForBackButton + ")'"
						+ 	" value='" + messages['addPaymentCardForm.backTxt'] + "'/>"
						+ "</div>"
						+ "</div>"
						+ "</div>";
	$('#buttonSection' + fundingSourceTypes_JsonType).hide();
	emptyOtherAddEditCardSection(index, fundingSourceTypes_JsonType);
	$("#editCardFormSection" +  index).html(editCardForm);
	$('#editCardFormSection' +  index).show();
	uploadDataOfCards(paymentCard, fundingSourceTypes_JsonType);
	storeRegexExp(fundingSourceTypes_JsonType);
}

/********************************************************************************************
' Name                 :   emptyOtherAddEditCardSection
' Return type          :   None
' Input Parameter(s)   :   cardIndex, fundingSourceTypes_JsonType
' Purpose              :   Function is clear Edit card area when user want to edit the another card . 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function emptyOtherAddEditCardSection(cardIndex, fundingSourceTypes_JsonType){
	$("#managePaymentCards .mng_card_area").each(function( index, element ) {
		if(cardIndex != index){
			$("#editCardFormSection" +  index).empty();
		}
	});
}

/********************************************************************************************
' Name                 :   validateExpiryMonthYearOfEditCard
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the expiry date. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function validateExpiryMonthYearOfEditCard(fundingSourceTypes_JsonType){
	var month = $('#editCardPmtMmSelect'+ ' :selected').val().trim().toString();
	var year = $('#editCardPmtYySelect'+  ' :selected').val().trim().toString();
	var currentTime = new Date();
	var currentMonth = currentTime.getMonth() + 1;
	var currentYear = currentTime.getFullYear().toString();
	var centuary = currentYear.substring(0,2);
	if(month && year && (year != messages['addPaymentCardForm.yearTxt']) && (month != messages['addPaymentCardForm.monthTxt'])) {
		if((month < currentMonth) && ((centuary+year) === currentYear)) {
			showErrorDiv("editCardPmtMmSelect", "errorMainAreaEditCard1", "invalidMsgEditCard1", messages['editPaymentCard.month']);
		} else {
			hideErrorDiv("editCardPmtMmSelect", "errorMainAreaEditCard1", "invalidMsgEditCard1");
		}
	} else {
		hideErrorDiv("editCardPmtMmSelect", "errorMainAreaEditCard1", "invalidMsgEditCard1");
	}
}

/********************************************************************************************
' Name                 :   editCardCancelBtn
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut, isCallFromAddcard
' Purpose              :   Function is used for validating the expiry date. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function editCardCancelBtn(fundingSourceTypes_TenderType , flagForBackButton, manageCardsCallForCheckOut, isCallFromAddcard){
	if(isEditCardFieldsChanged(fundingSourceTypes_TenderType)){
		showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		$('#clearOnClickBtn').unbind( "click" );
		$('#clearOnClickBtn').click(function(event){
			closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
			backToCardList(fundingSourceTypes_TenderType ,flagForBackButton);
			if( isCallFromAddcard ){
				showAddCardform(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut);
			}
		});
	} else {
		backToCardList(fundingSourceTypes_TenderType ,flagForBackButton);
	}
}

/********************************************************************************************
' Name                 :   backToCardList
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_TenderType , flagForBackButton
' Purpose              :   Function is used for validating the expiry date. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function backToCardList(fundingSourceTypes_TenderType , flagForBackButton){
	$("#managePaymentCards .mng_card_area").each(function( index, element ) {
			$("#editCardFormSection" +  index).empty();
	});
}

/********************************************************************************************
' Name                 :   isEditCardFieldsChanged
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for validating the expiry date. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   21st Oct,2013       -   Karuna Mishra
'*******************************************************************************************/
function isEditCardFieldsChanged(fundingSourceTypes_TenderType){
	var date = paymentCardEditCancel.cardExpireDate;
	var month = date.toString().substring(0, 2);
	var expireMonth;
	if(month === "12" || month === "10" || month === "11"){
		expireMonth = date.toString().substring(0, 2);
	} else {
		expireMonth = date.toString().substring(1, 2);
	}
	var expireYear = date.toString().substring(2);

	if(($("#editCrdPmtAddress1" ).val() != paymentCardEditCancel.address1)){
		return true;
	} else if(($("#editCrdPmtAddress2"  ).val() || paymentCardEditCancel.address2) && ($("#editCrdPmtAddress2" ).val() != paymentCardEditCancel.address2)){
		return true;
	} else if($("#editCrdPmtCity" ).val() != paymentCardEditCancel.city){
		return true;
	} else if($("#editCrdPmtZip"  ).val() != paymentCardEditCancel.zip){
		return true;
	} else if($("#editCrdPmtState" ).val() != paymentCardEditCancel.state){
		return true;
	} else if($("#editCardPmtMmSelect").val() != expireMonth){
		return true;
	} else if($("#editCardPmtYySelect" ).val() != expireYear){
		return true;
	} else if($("#cvvPaymentCards"  ).val()){
		return true;
	}
	return false;
}

/*******************************************************************************
 * ' Name 					: uploadDataOfCards 
 * ' Return type 			: None 
 * ' Input Parameter(s) 	: paymentCard, fundingSourceTypes_JsonType 
 * ' Purpose 				: Function is used for filling the edit card page fields. 
 * ' History Header 		: Version      	- Date          - Developer Name 
 * ' Added By 				: 1.0         	- 1st Oct,2013  - Karuna Mishra 
 ******************************************************************************/
function uploadDataOfCards(paymentCard, fundingSourceTypes_JsonType) {
	/* Getting the value from card array and filling it to the Edit card page fields. */
	$("#editCrdPmtFisrtName" ).val(paymentCard.firstName);
	$("#editCrdPmtLastName" ).val(paymentCard.lastName);
	$("#editCrdPmtAddress1" ).val(paymentCard.address1);
	$("#editCrdPmtAddress2").val(paymentCard.address2);
	$("#editCrdPmtCity" ).val(paymentCard.city);
	$("#editCrdPmtZip" ).val(paymentCard.zip);
	$("#editCrdPmtCrdTyp").text(setCardBrand(paymentCard));
	$("#editCrdPmtlstFour").text("****" + " " + "****" + " " + "****" + " " + paymentCard.cardLastFour);
	$("#editCrdPmtNameOnCrd").text(paymentCard.firstName + " " + paymentCard.lastName);
	$("#editCardPmtMmSelect").empty();
	$("#editCardPmtYySelect").empty();
	calculateMonthForExpirationDate("editCardPmtMmSelect" );
	calculateYearForExpirationDate("editCardPmtYySelect");
	setStateList("editCrdPmtState" );
	setExpireDate(paymentCard, fundingSourceTypes_JsonType);
	$("#editCrdPmtState").val(paymentCard.state);
}

/********************************************************************************************
 ' Name                 :   setCardBrand
 ' Return type          :   {String}
 ' Input Parameter(s)   :   paymentCard
 ' Purpose              :   Function is used for setting the card brand name on page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
 '*******************************************************************************************/
function setCardBrand(paymentCard) {
	if (paymentCard.cardBrand === cardBrandConstant.VISA) {
		return "VISA";
	} else if (paymentCard.cardBrand === cardBrandConstant.MASTERCARD) {
		return "MASTER";
	} else if (paymentCard.cardBrand === cardBrandConstant.DISCOVER_NEW) {
		return "DISCOVER";
	}
	return "";
}

/********************************************************************************************
' Name                 :   setExpireDate
' Return type          :   None
' Input Parameter(s)   :   paymentCard, fundingSourceTypes_JsonType
' Purpose              :   Function is used for setting the Expire date of card on page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function setExpireDate(paymentCard, fundingSourceTypes_JsonType) {
	var expireMonth = "";
	var date = paymentCard.cardExpireDate;
	var month = date.toString().substring(0, 2);
	if(month === "12" || month === "10" || month === "11") {
		expireMonth = date.toString().substring(0, 2);
	} else {
		expireMonth = date.toString().substring(1, 2);
	}
	var expireYear = date.toString().substring(2);
	$("#editCardPmtMmSelect" ).val(expireMonth);
	$("#editCardPmtYySelect").val(expireYear);
}

/********************************************************************************************
' Name                 :   storeRegexExp
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for storing the regex expression for Input fields.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   23th Oct,2013     -   Karuna Mishra
'*******************************************************************************************/
function storeRegexExp(fundingSourceTypes_JsonType) {
	regexObj["editCrdPmtAddress1" ] = /^[a-zA-Z0-9\s,.'-]*$/;
	regexObj["editCrdPmtAddress2" ] = /^[a-zA-Z0-9\s,.'-]*$/;
	regexObj["editCrdPmtCity" ] = /^[A-Za-z0-9 ]{0,50}$/;
	regexObj["cvvPaymentCards" ] = /^[0-9]{3,4}$/;
	regexObj["editCrdPmtZip" ] = /^\d{5}$/;
}

/********************************************************************************************
' Name                 :   enableEditCardSaveButton
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType
' Purpose              :   Function is used for start the timer which will check to enable 
							the edit card save button when there is no error and empty fields. 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   10th july,2013       -   Karuna Mishra
'*******************************************************************************************/
function enableEditCardSaveButton(fundingSourceTypes_JsonType) {
   timeInteval = setInterval("enableDisableSaveBtnOfEdit('editCardForm', 'editCrdPmtSave', 'editCrdPmtAddress2" + "','" + fundingSourceTypes_JsonType + "')", 500);
   timeIntevalOfCard = setInterval("validateOnKeyPressOfEdit('editCardForm','" + fundingSourceTypes_JsonType + "')", 500);
}

/********************************************************************************************
' Name                 :   enableDisableSaveBtnOfEdit
' Return type          :   None 
' Input Parameter(s)   :   frmElementDivId, submitBtnId, elementId,  fundingSourceTypes_JsonType
' Purpose              :   Function is used for Enable the edit card save button when there is no error and empty fields. 
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   21st Oct,2013	   -   Karuna Mishra
'*******************************************************************************************/
function enableDisableSaveBtnOfEdit(frmElementDivId, submitBtnId, elementId, fundingSourceTypes_JsonType) {
	var month = messages['addPaymentCardForm.monthTxt'];
	var year = messages['addPaymentCardForm.yearTxt'];
	if(fundingSourceTypes_JsonType) {
		if($('#editCardPmtMmSelect'  + ' :selected').val()) {
			month = $('#editCardPmtMmSelect'  + ' :selected').val().trim().toString();
		}
		if($('#editCardPmtYySelect'  + ' :selected').val()) {
			year = $('#editCardPmtYySelect' + ' :selected').val().trim().toString();
		}
	}
	var buttonStatusEnabled = true;
	var $inputFields = $('#' + frmElementDivId + ' :input'); /* Getting all the input field of form into a variable */
	$inputFields.each(function() { /* Iterating through all the input fields in the form */
		var regEx = regexObj[$(this).attr('id')]; /* Getting reglar expression associated wiyh current field id */
		if($(this).attr('id') != elementId) { /* Checking if current field is not "Addess2" field because its not a mandatory field */
			/* Validating if required field does not contain any value or has error red border or does not pass its regular expression */
			if( $(this).hasClass('error_red_border') || !$(this).val() || (regEx && !regEx.test($(this).val())) ) {
				buttonStatusEnabled = false;
			}
		} else {
			/* Validating if optional field has error red border or does not pass its regular expression */
			if($(this).hasClass('error_red_border') || (regEx && !regEx.test($(this).val()))) {
				buttonStatusEnabled = false;
			}	
		}
		/* Validating the expiration month and year fields */
		if(($(this).attr('id') === 'editCardPmtMmSelect' ) || ($(this).attr('id') === 'editCardPmtYySelect' )){
			if((year === messages['addPaymentCardForm.yearTxt']) || (month === messages['addPaymentCardForm.monthTxt'])){
				buttonStatusEnabled = false;
			}
		}
	});

	if(buttonStatusEnabled) { /* Checking if all the validation successfully passes */
		submitBtnEnableUI(submitBtnId);
		$('#'+submitBtnId).removeClass('bg_grey1');
		enableBtnFlag = true;
	} else { /* Otherwise if any of the validation fails disable the PAY button */
		submitBtnDisableUI(submitBtnId);
		$('#'+submitBtnId).addClass('bg_grey1');
	}
}

/********************************************************************************************
' Name                 :   validateOnKeyPressOfEdit
' Return type          :   None 
' Input Parameter(s)   :   frmElementDivId, fundingSourceTypes_JsonType
' Purpose              :   Function is used to remove and hide error red border and error 
							message on key press. 
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   21th Oct,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validateOnKeyPressOfEdit(frmElementDivId, fundingSourceTypes_JsonType) {
	var $inputFields = $('#' + frmElementDivId + ' :input'); /* Getting all the input field of form into a variable */
	$inputFields.each(function() { /* Iterating through all the input fields in the form */
		var regEx = regexObj[$(this).attr('id')]; /* Getting reglar expression associated with current field id */
		if((regEx && regEx.test($(this).val())) ) { /* Validating the field with its regular expression */
			$(this).removeClass('error_red_border'); /* Removing the error red border if regular expression pass */
			if($(this).attr('id')=== "editCrdPmtAddress1" ){
				$("#errorMainAreaEditCard3").hide();
				$("#"+ "moberrorMainAreaEditCard3").hide();
			}else if($(this).attr('id')=== "editCrdPmtAddress2" ){
				$("#errorMainAreaEditCard4").hide();
				$("#"+ "moberrorMainAreaEditCard4").hide();
			}else if($(this).attr('id')=== "editCrdPmtCity" ){
				$("#errorMainAreaEditCard5").hide();
				$("#"+ "errorMainAreaEditCard5").hide();
			}else if($(this).attr('id')=== "editCrdPmtZip" ){
				$("#errorMainAreaEditCard7").hide();
				$("#"+ "moberrorMainAreaEditCard7").hide();
			}
		}
	});
}

/********************************************************************************************
' Name                 :   makeRequestObjForEditCardOnSave
' Return type          :   None
' Input Parameter(s)   :   cardId, firstName, lastName, fundingSourceTypes_JsonType, index, , manageCardsCallForCheckOut
' Purpose              :   Function is used for calling the CM_EDIT_PAYMENT_CARD Api On click save button.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   4th October,2013      -   Karuna Mishra
'*******************************************************************************************/
function makeRequestObjForEditCardOnSave(cardId, firstName, lastName, fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut){
	var month = $('#editCardPmtMmSelect' + ' :selected').val().trim().toString();
	var year = $('#editCardPmtYySelect' + ' :selected').val().trim().toString();
	/* Following code is used for create request object for API call. */
	var request = {};
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.userId = getCookie('userId');
	request.cardId = cardId;
	request.cardExpireDate = getDateOfExpiry(month, year);
	request.firstName = firstName;
	request.lastName = lastName;
	request.address1 = $("#editCrdPmtAddress1").val();
	request.address2 = $("#editCrdPmtAddress2").val();
	request.city = $("#editCrdPmtCity").val();
	request.state = $("#editCrdPmtState").val();
	request.zip = $("#editCrdPmtZip").val();
	request.cvv = $("#cvvPaymentCards").val();
	
	handleEditPaymentCards(request,fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut);
}

/********************************************************************************************
 ' Name                 :   handleEditPaymentCards
 ' Return type          :   None
 ' Input Parameter(s)   :   request, fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut
 ' Purpose              :   Function is used for editing the user card details by calling CM_EDIT_PAYMENT_CARD Api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th Sept,2013      -   Karuna Mishra
 '*******************************************************************************************/
function handleEditPaymentCards(request, fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut) {
	if(enableBtnFlag){
		/* To show the progress bar */
		showProgressBar();
		/* This code segment is used for making CM_EDIT_PAYMENT_CARDS API call. */
		var call_cm_edit_payment_card = new cm_edit_payment_card(request, fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut);
		call_cm_edit_payment_card.call();
	}
}

/********************************************************************************************
' Name                 :   handleEditPaymentCardsOnSuccess
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut
' Purpose              :   Function is used for handle the response of CM_EDIT_PAYMENT_CARD Api.
' History Header       :   Version   	-   Date              	-   Developer Name
' Added By             :   1.0       	-   24th Sept,2013      -   Karuna Mishra
'*******************************************************************************************/
function handleEditPaymentCardsOnSuccess(fundingSourceTypes_JsonType, index, manageCardsCallForCheckOut){
		clearInterval(timeInteval);
		backToCardList(fundingSourceTypes_JsonType , null);
		handleGetPaymentCards(fundingSourceTypes_JsonType, index);
		$("#editCardContainer" + fundingSourceTypes_JsonType + index).hide();
		createSuccessAndErrorMessage(fundingSourceTypes_JsonType);
		showSucessMessageForAddAndEditCard(messages['editCard.confirmationMessage.success']);
		restartTimerForSlideDown();
}
