
/********************************************************************************************
' Name                 :   showDefaultPaymentCardsManage
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get funding source type and calling method for debit card.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   01st July, 2014     -   Ravi Raj
'*******************************************************************************************/
function showDefaultPaymentCardsManage(manageCardsCallForCheckOut, flagForAddCard, cardType){
	removeHomeScreenArea();
	var flagObj = new Object();
	flagObj.debitFlag = true;
	flagObj.creditFlag = true;
	var containerSec =  new Object();
	containerSec.debitCardsContainerSec = '';
	containerSec.creditCardsContainerSec = '';
	var addCardBtnObj = new Object();
	addCardBtnObj.addCardBtnDebit = '';
	addCardBtnObj.addCardBtnCredit = '';
	$("#mainContainerManageCardSec").empty();
	var fullSection =   '<div class="edit_profile_section_lft">';
	var rightHandBtn = '<div class="edit_profile_section_rght width_area48 flt_lft " id="buttonSectionForManage">'
					+ '<div class="profile_field width_area100 flt_lft mob_no_add_card">'
					+ '<div class="profile_card_area fnt_wt width_area40 mob_wid100 hidden" id="addCardTitle">'+messages['profile.addCardFormTittle']+'</div>'
					+ '<div class="mob_mrgn_top5"></div></div>'
					+ getMaxCardLimitmsg();

	/* Getting fundingSourceTypes from local storage which comes in INIT_APP API call */
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	/* This code segment is used to draw the row for card on the basis of funding source. */
	for ( var fundingSourceTypesIndex in fundingSourceTypes) {
		/* Getting single fundingSourceTypeObj from fundingSourceTypes array */
		var fundingSourceTypeObj = fundingSourceTypes[fundingSourceTypesIndex];
		var fundingSourceTypes_JsonType = fundingSourceTypeObj.tenderType; /* Getting jsonType for fundingSource as came in INIT_APP API */
		var fundingSourceTypes_TenderType = fundingSourceTypeObj.tenderType; /* Getting tenderType for fundingSource as came in INIT_APP API */
		
		/* This code segment is checks for card and draw the card row on checkout page and show the default card section. */
		if (fundingSourceTypes_TenderType && fundingSourceTypes_TenderType.toUpperCase() 
											=== tenderTypeConstant.DEBIT && flagObj.debitFlag) {
			/* If Tender type is DEBIT then create cards structure on manage cards page*/
			containerSec.debitCardsContainerSec = createUsedCardPaymnetOptionManage(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType, manageCardsCallForCheckOut);
			addCardBtnObj.addCardBtnDebit = getAddCardSec(fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fundingSourceTypes_TenderType);
			flagObj.debitFlag = false;
			
		} else if (fundingSourceTypes_TenderType && fundingSourceTypes_TenderType.toUpperCase() 
											=== tenderTypeConstant.CREDIT && flagObj.creditFlag) {
			/* If Tender type is DEBIT then create cards structure on manage cards page*/
			containerSec.creditCardsContainerSec  = createUsedCardPaymnetOptionManage(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType, manageCardsCallForCheckOut);
			addCardBtnObj.addCardBtnCredit = getAddCardSec(fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fundingSourceTypes_TenderType);
			flagObj.creditFlag = false;
		}
	}
	
	fullSection += appendManageCardSec(containerSec, rightHandBtn, addCardBtnObj);
	$('#mainContainerManageCardSec').append(fullSection);
	$('#manageCardsMainContainer').show();
	
	showSuccessStripForManageCardSec(flagForAddCard, cardType);

	/* Unbind Manage card back button click.*/
	$('#manageCardsBackBtn').unbind( "click" );
	 /*Bind Manage card Back button click according to check we came Manage Card form checkout page or normal Profile link.*/
	$('#manageCardsBackBtn').click(function(event){
		onClickEditCardBackBtn(manageCardsCallForCheckOut);
	});
	$('#manageCardsBackBtnBtm').unbind( "click" );
	 /*Bind Manage card Back button click according to check we came Manage Card form checkout page or normal Profile link.*/
	$('#manageCardsBackBtnBtm').click(function(event){
		onClickEditCardBackBtn(manageCardsCallForCheckOut);
	});
	
	setManageCrdButtonsHtml();
}

/*****************************************************************************************************
' Name                 :   createUsedCardPaymnetOptionManage
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_JsonType, fundingSourceTypes_TenderType
' Purpose              :   This method is used to show the cards on file in profile manage card section.
' History Header       :   Version   -   Date              	 -   Developer Name
' Added By             :   1.0       -   01st July, 2014     -   Ravi Raj
'*****************************************************************************************************/
function createUsedCardPaymnetOptionManage(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType, manageCardsCallForCheckOut){
	var cardsSec = '';
	var cardIcon = '';
	var divideSection = '';
	var cardsContainerSec =  new Object();
	cardsContainerSec.debitCardsContainerSec = '';
	cardsContainerSec.creditCardsContainerSec = ''; 
	var debitCreditCounterObj = new Object();
	var profileStatusUnknown = '';
	debitCreditCounterObj.debitCounter = 0;
	debitCreditCounterObj.creditCounter = 0;
	
	var addNewCardTitle = fundingSourceTypes_TenderType === tenderTypeConstant.DEBIT ? 
						  manageCard_typeConstants.DEBIT : manageCard_typeConstants.CREDIT;
	
	if (cm_get_payment_card_obj) {/* Null check for get payment card API response */
		
		if (cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length > 0) {
			cm_get_payment_card_obj.paymentCards.sort(sortByCreateDate);/* Cards sorted based on createDate */
			
			for (var index in cm_get_payment_card_obj.paymentCards) { /* Iterating through paymentCards in CM_GET_PAYEMNT_CARD API object */
				
				var profileStatusIneligible = '';
				if (fundingSourceTypes_TenderType === tenderTypeConstant.DEBIT 
						&& cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.DEBIT) {/* Check for DEBIT as tender type */
					cardIcon = getCardBrandForCard(cm_get_payment_card_obj.paymentCards[index].cardBrand);
					
					serviceFee = showServiceFeePercent(cm_get_payment_card_obj.paymentCards[index]);
					
					profileStatusIneligible = getInEligibilityMessage(cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus.toUpperCase());
					
					cardsSec += getCardSeciton(fundingSourceTypes_JsonType, cardIcon, cm_get_payment_card_obj.paymentCards[index].cardLastFour,
											   index, manageCardsCallForCheckOut, profileStatusIneligible, serviceFee);
					debitCreditCounterObj.debitCounter++;
				} else if (fundingSourceTypes_TenderType === tenderTypeConstant.CREDIT 
						&& cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.CREDIT) {
					cardIcon = getCardBrandForCard(cm_get_payment_card_obj.paymentCards[index].cardBrand);
					
					serviceFee = showServiceFeePercent(cm_get_payment_card_obj.paymentCards[index]);
					
					profileStatusIneligible = getInEligibilityMessage(cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus.toUpperCase());
					
					cardsSec += getCardSeciton(fundingSourceTypes_JsonType, cardIcon, cm_get_payment_card_obj.paymentCards[index].cardLastFour,
											   index, manageCardsCallForCheckOut, profileStatusIneligible, serviceFee);
					debitCreditCounterObj.creditCounter++;
				}
			} 
			profileStatusUnknown = getGiftCardMessage(cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus.toUpperCase(), fundingSourceTypes_TenderType);
		}
		
		cardsSec += getCardsOnFileMsg(fundingSourceTypes_TenderType, debitCreditCounterObj);
		
		if (fundingSourceTypes_TenderType === jsonTypeConstant.VESTADEBIT) {
			divideSection = '<div class="wid_area100 flt_lft" id="debit_left">';
			cardsContainerSec.debitCardsContainerSec += designManageCardsSec(cardsSec, '', addNewCardTitle, divideSection)
							+ '<div id="add_btn_deb" class="wid_flt100"></div>'	
							+ '</div>';
			return cardsContainerSec.debitCardsContainerSec;
			
		} else if (fundingSourceTypes_TenderType === jsonTypeConstant.VESTACREDIT) {
			divideSection = '<div class="wid_area100 flt_lft" id="credit_left">';
			cardsContainerSec.creditCardsContainerSec += designManageCardsSec(cardsSec, profileStatusUnknown, addNewCardTitle, divideSection)
									+ '<div id="add_btn_cred" class="wid_flt100"></div>'	
									+ '</div>';
			return cardsContainerSec.creditCardsContainerSec;
		}
	}
}


/*****************************************************************************************************
' Name                 :   sortByCreateDate
' Return type          :   none
' Input Parameter(s)   :   paymentCards1, paymentCards2
' Purpose              :   This method is used to sort the cards using created date.
' History Header       :   Version   -   Date           	   	-   Developer Name
' Added By             :   1.0       -   1st July 2014    		-   Ravi Raj
'*****************************************************************************************************/
function sortByCreateDate(paymentCards1, paymentCards2){
		/* Compare both the objects using create date then return latest create date */
	  var createDateOne = paymentCards1.createDate;
	  var createDateTwo = paymentCards2.createDate; 
	  return ((createDateOne < createDateTwo) ? -1 : ((createDateOne > createDateTwo) ? 1 : 0));
}

/*****************************************************************************************************
' Name                 :   deleteCardsOnManageCards
' Return type          :   none
' Input Parameter(s)   :   index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut
' Purpose              :   This method is used to delete debit card.
' History Header       :   Version   -   Date           	   	-   Developer Name
' Added By             :   1.0       -   1st July 2014    		-   Karuna Mishra
'*****************************************************************************************************/
function deleteCardsOnManageCards(index, fundingSourceTypes_JsonTypes, manageCardsCallForCheckOut) {
	var fundingSourceTypes_JsonType = fundingSourceTypes_JsonTypes;
	if($('#editCardForm').is(':visible')){
		if(fundingSourceTypes_JsonType  === "undefined" || typeof fundingSourceTypes_JsonType === "undefined" ){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		}
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			showAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
			$('#deleteCardBtn').unbind( "click" );
			$('#deleteCardBtn').click(function(event){
				closeAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
				handleDeletePaymentCardOnManageCards(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut);
			});
		}
	} else if ($('#addPaymentCardForm').is(':visible')) {
		if (fundingSourceTypes_JsonType === "undefined"
				|| typeof fundingSourceTypes_JsonType === "undefined") {
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		}
		if (isValueInAddCardFormFields("addCardForm"+ fundingSourceTypes_JsonType)) {
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			showAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
			$('#deleteCardBtn').unbind( "click" );
			$('#deleteCardBtn').click(function(event){
				closeAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
				handleDeletePaymentCardOnManageCards(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut);
			});
		}
	} else {
		showAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
		$('#deleteCardBtn').unbind( "click" );
		$('#deleteCardBtn').click(function(event){
			closeAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
			handleDeletePaymentCardOnManageCards(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut);
		});
	}	    /*mainPaymentPageResize();*/
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		showAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
		$('#deleteCardBtn').unbind( "click" );
		$('#deleteCardBtn').click(function(event){
			closeAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp');
			handleDeletePaymentCardOnManageCards(index, fundingSourceTypes_JsonType, manageCardsCallForCheckOut);
		});
	});
}

/*****************************************************************************************************
' Name                 :   handleDeletePaymentCardOnManageCards
' Return type          :   none
' Input Parameter(s)   :   index, cardExpandBoxId, manageCardsCallForCheckOut
' Purpose              :   This method is used to send request for delete card API.
' History Header       :   Version   -   Date           	   	-   Developer Name
' Added By             :   1.0       -   17 July 2014    		-   UmaMaheswara Rao
'*****************************************************************************************************/
function handleDeletePaymentCardOnManageCards(index, cardExpandBoxId, manageCardsCallForCheckOut) {
		/* To show the progress bar */
		showProgressBar();
		var paymentCard = cm_get_payment_card_obj.paymentCards[index];
		var request = {};
		/* hold the request for the API delete payment card */
		request.applicationId = applicationId;
		request.locale = getCookie("locale");
		request.userId = eval(getCookie('userId'));
		request.paymentCardId = paymentCard.id;

		var call_cm_delete_payment_card = new cm_delete_payment_card(request, index, cardExpandBoxId, manageCardsCallForCheckOut);
		call_cm_delete_payment_card.call();/* Call for the API delete payment card with the required parameters */
}

function showAddPaymentCardFormForManage(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut, isCallFromAddcard){
	$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
	$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
	createSuccessAndErrorMessage(fundingSourceTypes_TenderType);
	if ($("#editCardForm").is(':visible')) {/* Checking Edit card form visible or not */
		editCardCancelBtn(fundingSourceTypes_TenderType,false, manageCardsCallForCheckOut,isCallFromAddcard);
	}
	if(($("#addCardTitle").is(':visible')) || ($("#addCardMobTitle").is(':visible'))){
		showAlertForCancleButtonInAddCardForm(fundingSourceTypes_TenderType,false,false, 0, manageCardsCallForCheckOut,true);
	}
	if (!$("#editCardForm").length && !$("#addPaymentCardForm").length) {
		showAddCardform(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut);
	}
}

/********************************************************************************************
' Name                 :   showAddCardform
' Return type          :   None
' Input Parameter(s)   :   fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut
' Purpose              :   This method is used open add card form in manage card section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   14th july,2014     -   Karuna mishra
'*******************************************************************************************/
function showAddCardform(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut) {
	var addCardFormSection = createAddPaymentCardFormForManage(fundingSourceTypes_TenderType, false, manageCardsCallForCheckOut);
	$('#addNewCardBtnForManage' + tenderTypeConstant.DEBIT).hide();
	$('#addNewCardBtnForManage' + tenderTypeConstant.CREDIT).hide();
	/*$("#buttonSectionForManage").append(addCardFormSection);*/
	$(addCardFormSection).insertBefore('#addNewCardBtnForManage'+fundingSourceTypes_TenderType);
	showScreenAndSetHeight('manageCardsMainContainer', 'manage_card_area');
	$('#buttonSectionForManage').show();
	var windowWidth = $(window).width();
    if (windowWidth >= minimumWindowWidthForMobile) {
		if(fundingSourceTypes_TenderType ===  jsonTypeConstant.VESTADEBIT){
		$('#addCardTitle').removeClass('hidden');
		}else if(fundingSourceTypes_TenderType === jsonTypeConstant.VESTACREDIT){
			$('#addCardTitle').addClass('hidden');
			$('#addCardMobTitle').show();
		}
    }
	$('#advertisement').html("<iframe src='"+messages['paymentCardForm.promo']+"' class='ads'></ifarme>");
	setExtraMarginForAndroid('addCardFormBottomId');
	calculateMonthForExpirationDate("expiryMonthPaymentCards");
	calculateYearForExpirationDate("expiryYearPaymentCards");
	setStateList("stateOfPaymentCards");
	storeRegexExpOfAddCardFields(fundingSourceTypes_TenderType);
	clearInterval(timeIntevalOfAddCard);
	clearInterval(timeIntevalOfCard);
	enableAddCardSaveButton(fundingSourceTypes_TenderType);
}

/********************************************************************************************
' Name                 :   createAddPaymentCardFormForManage
' Return type          :   {String}
' Input Parameter(s)   :   fundingSourceTypes_JsonType, flagForBackButton, manageCardsCallForCheckOut
' Purpose              :   This method is used to create the Add Payment Card form section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   13 September,2013     	-   Karuna Mishra
'*******************************************************************************************/
function addCardTitle(){
	var fundingSource = getVisibleAddCardFormFundingSource();
	var windowWidth = $(window).width();
    if (windowWidth >= minimumWindowWidthForMobile) {
    	if(fundingSource && fundingSource === jsonTypeConstant.VESTACREDIT &&  $('#addCardForm'+fundingSource).is(":visible") ){
    		$('#addCardTitle').addClass('hidden');
			$('#addCardMobTitle').show();
    	}else if($('#addCardForm'+fundingSource).is(":visible")){
    		$('#addCardTitle').removeClass('hidden');
			$('#addCardMobTitle').hide();
    	}else{
    		$('#addCardTitle').addClass('hidden');
			$('#addCardMobTitle').hide();
    	}
    } else {
		$('#addCardTitle').removeClass('hidden');
		$('#addCardMobTitle').show();
    }
}

/********************************************************************************************
' Name                 :   createAddPaymentCardFormForManage
' Return type          :   {String}
' Input Parameter(s)   :   fundingSourceTypes_JsonType, flagForBackButton, manageCardsCallForCheckOut
' Purpose              :   This method is used to create the Add Payment Card form section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   17 July,2013     	-   UmaMaheswara Rao
'*******************************************************************************************/
function createAddPaymentCardFormForManage(fundingSourceTypes_TenderType, flagForBackButton, manageCardsCallForCheckOut){
	var addCardForm =  "<div class='add_pmt_method_cardarea' id='addPaymentCardForm'>"
			      	+  		"<div id='addCardForm" + fundingSourceTypes_TenderType + "' class='add_pmt_method_cardarea'>"
			      	+		"<div class='mob_add_card profile_field profile_card_area fnt_wt width_area40 mob_wid100' id='addCardMobTitle'>"+messages['profile.addCardFormTittle']+"</div>"
			      	+       "<div class='adContainer' id='advertisement'></div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='firstName'>" + messages['addPaymentCardForm.firstName'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard1'>"
			      	+ 					"<span class='failed_icon'></span>"
			      	+ 					"<span id='mobinvalidMsgAddCard1'></span>"
			      	+ 				"</div>"
			      	+ 				"<input type='text' name='firstName' id='firstNamePaymentCards"  + "' onblur='fisrtNameErrorValidation(\"" + fundingSourceTypes_TenderType + "\")'/>"
			      	+ 			"</div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='lastName'>" + messages['addPaymentCardForm.lastName'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard2'>"
			      	+ 					"<span class='failed_icon'></span>"
			      	+ 					"<span id='mobinvalidMsgAddCard2'></span>"
			      	+ 				"</div>"
			      	+ 				"<input type='text' name='lastName' id='lastNamePaymentCards"  + "' onblur='lastNameErrorValidation(\"" + fundingSourceTypes_TenderType + "\")'/>"
			      	+			"</div>"
			      	+ 			"<div class='card_field_sep'>"
			      	+ 				"<label for='cardNumber'>" + messages['addPaymentCardForm.cardNo'] + "</label>"
			      	+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard3'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard3'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='cardNumber' id='cardNoPaymentCards"  + "' onkeypress='return isValidCardNoEntered(this, event)'" 
					+ 					" onblur='cardNoErrorValidation(\"" + fundingSourceTypes_TenderType + "\")'/>"
					+			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='dateOfExpiry'>" + messages['addPaymentCardForm.expiryDate'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard4'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard4'></span>"
					+ 				"</div>"
					+ 				"<select name='dateOfExpiry' id='expiryMonthPaymentCards"  + "' class='select_wd160 mob_select_wd148' onchange='validateExpiryMonth(\"" + fundingSourceTypes_TenderType+ "\")'></select>"
					+ 				"<select name='dateOfExpiry' id='expiryYearPaymentCards"  + "' class='select_wd160 mob_select_wd148' onchange='validateExpiryMonth(\"" + fundingSourceTypes_TenderType+ "\")'></select>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+			 	"<label for='cvvNo'>" + messages['addPaymentCardForm.cvvNo'] + "</label>"
					+ 				"<div class='mob_error_msg err_cvv txt_inv' id='moberrorMainAreaAddCard6'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard6'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='cvvNo' class='inp_cvv' id='cvvPaymentCards" + "' maxlength='4' minlength='3'"
					+ 					" onkeypress='return isNumberKey(event)' onblur='cvvErrorValidation(\"" + fundingSourceTypes_TenderType + "\")'/>"
					+ 				"<span class='fa fa-info-circle fa-lg card_ques_icon' onclick='showAlertForCVVHint()' id='cvvHintIconAddCard" + fundingSourceTypes_TenderType + "'></span>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='firstAddress'>" + messages['addPaymentCardForm.add1'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard7'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard7'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='firstAddress' id='firstAddPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='address1ErrorValidation(\"" + fundingSourceTypes_TenderType + "\",\"firstAddPaymentCards\",\"errorMainAreaAddCard7\",\"invalidMsgAddCard7\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='secondAddress'>" + messages['addPaymentCardForm.add2'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard8'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard8'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='secondAddress' id='secondAddPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='address2ErrorValidation(\"" + fundingSourceTypes_TenderType + "\",\"secondAddPaymentCards\",\"errorMainAreaAddCard8\",\"invalidMsgAddCard8\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='city'>"+ messages['addPaymentCardForm.city'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard9'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard9'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='city' id='cityOfPaymentCards"  + "' maxlength='30'" 
					+ 					" onblur='cityErrorValidation(\"" + fundingSourceTypes_TenderType + "\",\"cityOfPaymentCards\",\"errorMainAreaAddCard9\",\"invalidMsgAddCard9\")'/>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='state'>" + messages['addPaymentCardForm.state'] + "</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard10'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard10'></span>"
					+ 				"</div>"
					+ 				"<select name='state' class='mob_wid99' id='stateOfPaymentCards'" 
					+ 				 " onchange='stateCodeErrorValidation(\"" + fundingSourceTypes_TenderType + "\", \"stateOfPaymentCards\",\"errorMainAreaAddCard10\",\"invalidMsgAddCard10\")'></select>"
					+ 			"</div>"
					+ 			"<div class='card_field_sep'>"
					+ 				"<label for='zipCode'>" + messages['addPaymentCardForm.zipCode'] +"</label>"
					+ 				"<div class='mob_error_msg desk_wid_input txt_inv' id='moberrorMainAreaAddCard11'>"
					+ 					"<span class='failed_icon'></span>"
					+ 					"<span id='mobinvalidMsgAddCard11'></span>"
					+ 				"</div>"
					+ 				"<input type='text' name='zipCode' id='zipOfPaymentCards"  + "' maxlength='5' minlength='1'" 
					+ 					" onkeypress='return isNumberKey(event)' onblur='zipErrorValidation(\"" + fundingSourceTypes_TenderType + "\",\"zipOfPaymentCards\",\"errorMainAreaAddCard11\",\"invalidMsgAddCard11\")'/>"
					+ 			"</div>"
					+ 		"<div class='wid_flt50 mrgn_debitbtn flt_lft'>"
					+ 			"<input type='button' id='backBtnIdForAddCardForm' value='" + messages['addPaymentCardForm.backTxt'] + "' class='back_btn wid_min116 hgt34 flt_lft bg_black mrgn_left10' id='backPaymentCards'" 
					+ 				" onclick = 'showAlertForCancleButtonInAddCardForm(\"" + fundingSourceTypes_TenderType + "\"," + flagForBackButton + ")' />"
					+ 		"</div>"
					+		"<div class='wid_flt40 txt_nwrght z101 pos_relnw flt_rgt'>"
					+		"<input type='button' id='saveBtnIdForAddCardForm' value='" + messages['editProfile.saveBtn'] + "'  class='sv_submit_inactive_btn wid_min116 hgt34' onclick='getTokenForCard(\"" + fundingSourceTypes_TenderType + "\",\"" + callFrom_constant.MANAGE_ADD_CARD_CALL + "\",\"" + manageCardsCallForCheckOut + "\");'/>"
					+       "<div id='addCardFormBottomId'></div>"
					+		"</div>"
					+	 "</div>"
					+ "</div>";
    return addCardForm;
}


/********************************************************************************************
' Name                 :   onClickEditCardBackBtn
' Return type          :   None
' Input Parameter(s)   :   btnId
' Purpose              :   This method is used to click of back button in manage card section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   11th july,2014     -   Karuna Mishra
'*******************************************************************************************/
function onClickEditCardBackBtn(manageCardsCallForCheckOut ) {
	var fundingSourceTypes_JsonType = '';
	if ($('#editCardForm').is(':visible')) {
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if (isEditCardFieldsChanged(fundingSourceTypes_JsonType)) {
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} 
		
		/* This code is use for when user coming from check out page then we check this condition */
		/*else if (manageCardsCallForCheckOut === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL) {
			btnVerifyClick(manageCardsCallForCheckOut);
		}*/ else {
			navigateToProfile();
		}
	} else if ($('#addPaymentCardForm').is(':visible')) {
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if (isValueInAddCardFormFields("addCardForm"
				+ fundingSourceTypes_JsonType)) {
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}
		/* This code is use for when user coming from check out page then we check this condition */
		/*else if (manageCardsCallForCheckOut === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL) {
			btnVerifyClick(manageCardsCallForCheckOut);
		}*/ else {
			navigateToProfile();
		}
	} 
			/* This code is use for when user coming from check out page then we check this condition */
			/*else if (manageCardsCallForCheckOut === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL) {
				btnVerifyClick(manageCardsCallForCheckOut);
			}*/ 
	else {
		navigateToProfile();
	}
	$('#clearOnClickBtn').unbind("click");
	$('#clearOnClickBtn').click(function(event) {
		
		/* This code is use for when user coming from check out page then we check this condition */
		/*if (manageCardsCallForCheckOut === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL) {
			closeAnimatedPopup('editCardOnManagesCard',
					'editcardCredPopUp');
			btnVerifyClick(manageCardsCallForCheckOut);
		} else {*/
			navigateToProfile();
		/*}*/
	});
}

/********************************************************************************************
' Name                 :   getFundingSource
' Return type          :   None
' Input Parameter(s)   :   formId
' Purpose              :   This method is used get funding source of open add or edit card form.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   14th july,2014     -   Karuna Mishra
'*******************************************************************************************/
function getFundingSource(formId) {
	if (formId === 'addPaymentCardForm') {
		var childId = $('#' + formId + ' :first-child').attr('id');
		if (childId === 'addCardFormDEBIT') {
			return "DEBIT";
		} else if (childId === 'addCardFormCREDIT') {
			return "CREDIT";
		} else {
			return null;
		}
	} else {
		var parentId = $('#'+formId).parent().attr('id');
		parentId = parentId.slice(0, - 1);
		if (parentId === 'editCardContainerDEBIT') {
			return 'DEBIT';
		} else if (parentId === 'editCardContainerCREDIT') {
			return 'CREDIT';
		} else {
			return null;
		}
	}
}

/********************************************************************************************
' Name                 :   designAddCardButton
' Return type          :   addCardBtnSection
' Input Parameter(s)   :   fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fundingSourceTypes_TenderType, typeOfCard
' Purpose              :   This method is used to design add card button for manage cards page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function designAddCardButton(fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fundingSourceTypes_TenderType, typeOfCard) {
	var cardIcon = new Object();
	cardIcon.visaCardBrand = '';
	cardIcon.discoverCardBrand = '';
	cardIcon.masterCardBrand = '';
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	getCardBrandIcon(fundingSourceTypes, fundingSourceTypes_TenderType, cardIcon);
	var addCardBtnSection 	= '<div class="wid_flt100 add_card_margin" id="newCardId'+fundingSourceTypes_TenderType+'">'
							+ '<div id="addNewCardBtnForManage'+fundingSourceTypes_TenderType+'" class="change_pass_btn mng_card_pdng clear flt_lft box_border"'
							+ 'onclick="showAddPaymentCardFormForManage(\'' + fundingSourceTypes_TenderType + '\', false,\'' + manageCardsCallForCheckOut + '\', \'true\' )">' 
							+ '<span class="new_card_left">' + formatMessage(messages['addNewCard.title'], typeOfCard) + '</span>'
							+ '<div class="new_card_right">'
							+ '<div class="center_vertical">'
							+ cardIcon.discoverCardBrand
							+ cardIcon.masterCardBrand
							+ cardIcon.visaCardBrand
							+ '</div>'
							+ '</div>'
							+ '</div>'
							+ '</div>';
	return addCardBtnSection;
}

/********************************************************************************************
' Name                 :   getCardBrandIcon
' Return type          :   addCardBtnSection 
' Input Parameter(s)   :   fundingSourceTypes
' Purpose              :   This method is used to create icon for Add Card button for Discover, Master and Visa.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   17th Sep 2014 	-   Karuna Mishra
'****************************************************************************************** */
function getCardBrandIcon(fundingSourceTypes, fundingSourceTypes_TenderType, cardIcon) {
	 cardIcon.discoverCardBrand='';cardIcon.masterCardBrand ='';cardIcon.visaCardBrand='';
	for(var fundingSourceTypesIndex in fundingSourceTypes) {
		var fundingSourceTypes_TenderTypes = fundingSourceTypes[fundingSourceTypesIndex].tenderType;  /*Getting tenderType for fundingSource as came in INIT_APP API*/ 
		if(fundingSourceTypes_TenderType === fundingSourceTypes_TenderTypes){
			 if(fundingSourceTypes[fundingSourceTypesIndex].cardBrand === cardBrandConstant.DISCOVER_NEW){
				 cardIcon.discoverCardBrand =  '<div class="discover_card_method"></div>';
			}else if(fundingSourceTypes[fundingSourceTypesIndex].cardBrand === cardBrandConstant.MASTERCARD){
				cardIcon.masterCardBrand =  '<div class="master_card_method"></div>';
			}else if(fundingSourceTypes[fundingSourceTypesIndex].cardBrand === cardBrandConstant.VISA){
				cardIcon.visaCardBrand =  '<div class="visa_card_method"></div>';
			}
		}
	}
}

/********************************************************************************************
' Name                 :   getGiftCardMessage
' Return type          :   profileStatusUnknown
' Input Parameter(s)   :   cvvRequiredStatus
' Purpose              :   This method is used to get gift card message.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getGiftCardMessage (cvvRequiredStatus, fundingSourceTypes_TenderType) {
	var profileStatusUnknown = '<div class="gift_card mng_gift" id="">'+messages['profile.statusUnknown']+'</div>';
		/* Checking cvvRquiredStatus UNKNOWN then show required message */
	return cvvRequiredStatus === cvvRequiredStatusConstant.UNKNOWN ? profileStatusUnknown : '';
}

/********************************************************************************************
' Name                 :   getInEligibilityMessage
' Return type          :   profileStatusIneligible
' Input Parameter(s)   :   cvvRequiredStatus
' Purpose              :   This method is used to get eligibility message using cvvrequired status.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getInEligibilityMessage (cvvRequiredStatus) {
	var profileStatusIneligible = '<div id="" class="width_area100 faq_a fnt_size15">' + messages['profile.cardNotEligibleForSchedule']
								+'<span onclick="showFAQUrl()">'+ messages['profile.faq'] +'</span></div>';
		/* Checking cvvRquiredStatus REQUIRED  then show card not eligible  message */
	return cvvRequiredStatus === cvvRequiredStatusConstant.REQUIRED ? profileStatusIneligible : '';
}

/********************************************************************************************
' Name                 :   getCardSeciton
' Return type          :   cardSec
' Input Parameter(s)   :   fundingSourceTypes_JsonType, cardIcon, cardLastFour, index, 
'                          manageCardsCallForCheckOut, profileStatusIneligible
' Purpose              :   This method is used to design each card section on manage cards page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getCardSeciton (fundingSourceTypes_JsonType, cardIcon, cardLastFour, index, manageCardsCallForCheckOut
						, profileStatusIneligible, serviceFee) {
	var cardSec =	'<div class="clear"></div>' 
					+ '<div id="managePaymentCards">'
					+ '<div class="mng_card_area" id="listOfPaymentCards' + fundingSourceTypes_JsonType + '">' 
					+ '<div class="wid_flt80">'
					+  cardIcon
					+ '<div class="mob_fnt13">'
					+ '<span id="" class="card_mng_mrgn">'+formatMessage(messages['profile.cardLastFourDigit'], cm_get_payment_card_obj.paymentCards[index].cardLastFour)
					+'</span>'
					+ serviceFee
					+ '</div></div>'
					+ '<div class="wid_flt20 flt_rght mrgn_top">'
					+ '<div class="tooltip delete_card_file" title="Delete">'
					+ 	'<i class="fa fa-trash-o fa-lg fa-2x flt_rght"'
					+   'onclick="deleteCardsOnManageCards(\'' + index + '\',\'' + fundingSourceTypes_JsonType + '\',\'' + manageCardsCallForCheckOut + '\')"></i>'
					+ '</div>'
					+ '<div class="tooltip edit_card_file" title="Edit">'
					+ 	'<i class="fa fa-pencil fa-lg fa-2x flt_rght"'
					+ 'onclick="showEditCard(\'' + index + '\',\'' + fundingSourceTypes_JsonType + '\',\'' + manageCardsCallForCheckOut + '\',\'' + cardLastFour + '\')"></i>'
					+ '</div>'
					+ '</div>'
					+ profileStatusIneligible
					+ '<div id="editCardFormSection' +  index + '"></div>'
					+ '</div>'
					+ '</div>';
	return cardSec;
}

/********************************************************************************************
' Name                 :   designManageCardsSec
' Return type          :   cardsMainContainerSec
' Input Parameter(s)   :   cardsSec, profileStatusUnknown, addNewCardTitle, divideSection
' Purpose              :   This method is used to design manage cards section for the all cards.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function designManageCardsSec(cardsSec, profileStatusUnknown, addNewCardTitle, divideSection) {
	var cardsMainContainerSec 	= divideSection
								+ '<div class="profile_field width_area100 flt_lft" id="profileArea">'
								+ '<div class="profile_card_area fnt_wt width_area45 mob_wid100" id="cardsTextForProfile">'
								+ formatMessage(messages['profile.card_on_file'], addNewCardTitle) 
								+ '</div>'
								+ '<div class="mob_mrgn_top5"></div>'
								+ '</div>'
								+ cardsSec
								+ profileStatusUnknown;
	return cardsMainContainerSec;
}

/********************************************************************************************
' Name                 :   getAddCardSec
' Return type          :   addCardBtnSection
' Input Parameter(s)   :   fundingSourceTypes_JsonType, manageCardsCallForCheckOut, addNewCardTitle
' Purpose              :   This method is used to design card section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getAddCardSec(fundingSourceTypes_JsonType, manageCardsCallForCheckOut, fundingSourceTypes_TenderType) {
	var addCardBtnSection = '';
	var typeOfCard = fundingSourceTypes_TenderType === tenderTypeConstant.DEBIT ? 
					 manageCard_typeConstants.DEBIT : manageCard_typeConstants.CREDIT;
	if (!cm_get_payment_card_obj.paymentCards || cm_get_payment_card_obj.paymentCards.length < localStorage.getItem("maxUserRegisteredCards")*1) {
	addCardBtnSection = designAddCardButton(fundingSourceTypes_JsonType, manageCardsCallForCheckOut, 
						fundingSourceTypes_TenderType, typeOfCard);
	}
	return addCardBtnSection;
}

/********************************************************************************************
' Name                 :   appendManageCardSec
' Return type          :   addCardBtnSection
' Input Parameter(s)   :   containerSec, rightHandBtn, addCardBtnObj
' Purpose              :   This method is used to append total manage card  section to page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function appendManageCardSec(containerSec, rightHandBtn, addCardBtnObj) {
	var fullSection = containerSec.debitCardsContainerSec
					+ containerSec.creditCardsContainerSec
					+ '</div>'
					+ rightHandBtn
					+ addCardBtnObj.addCardBtnDebit
					+ addCardBtnObj.addCardBtnCredit
					+ '</div>'
					+ '</div>';
	return fullSection;
}

/********************************************************************************************
' Name                 :   showSuccessStripForManageCardSec
' Return type          :   None
' Input Parameter(s)   :   flagForAddCard
' Purpose              :   This method is used to create success stripts when card successfully added or deleted.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function showSuccessStripForManageCardSec(flagForAddCard, cardType) {
	createSuccessAndErrorMessage(cardType);
	if (flagForAddCard === callFrom_constant.MANAGE_CARD_DELETE) {
	 /*If user successfully deletes the card then show success alert*/ 
	showSucessMessageForAddAndEditCard(messages['deleteCard.confirmationMessage.success']);
	restartTimerForSlideDown(); /*run timer for 15 seconds if the alerts are visible*/ 
	} else if (flagForAddCard === callFrom_constant.MANAGE_CARD_ADD_CARD) {
	 /*If user successfully added the card then show success alert */
	showSucessMessageForAddAndEditCard(messages['addCard.confirmationMessage.success']);
	restartTimerForSlideDown(); /*run timer for 15 seconds if the alerts are visible*/ 
	}
}

/********************************************************************************************
' Name                 :   getCardsOnFileMsg
' Return type          :   cardsSec
' Input Parameter(s)   :   fundingSourceTypes_TenderType, debitCounter, creditCounter
' Purpose              :   This method is used to get cards on file message.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   3rd Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getCardsOnFileMsg (fundingSourceTypes_TenderType, debitCreditCounterObj) {
	var cardsSec =  '<div class="clear"></div>' 
	     			+ '<div id="managePaymentCards' +  fundingSourceTypes_TenderType + '">'+ messages['profile.dontHaveCards'] +'</div>';
	 
	return fundingSourceTypes_TenderType === tenderTypeConstant.DEBIT ? !debitCreditCounterObj.debitCounter ? cardsSec : '' 
											 : !debitCreditCounterObj.creditCounter ? cardsSec : '';
}
/********************************************************************************************
' Name                 :   manageCardSectionOnMobileWidth
' Return type          :   none
' Input Parameter(s)   :   debitButtonHtml, creditButtonHtml
' Purpose              :   This method is used to Create manage card Add Buttons in mobile width.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   4th Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function manageCardSectionOnMobileWidth (debitButtonHtml, creditButtonHtml, debitSecctionId, creditSectionId) {
	$('#'+debitSecctionId).append(debitButtonHtml);
	$('#'+creditSectionId).append(creditButtonHtml);
}

/********************************************************************************************
' Name                 :   setManageCrdButtonsHtml
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to Create manage card Add Buttons in mobile width.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   4th Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function setManageCrdButtonsHtml() {
	var windowWidth = $(window).width();
	if (windowWidth <= minimumWindowWidthForMobile) {
		var debitButtonHtml = $('#newCardIdDEBIT').html();
		var creditButtonHtml = $('#newCardIdCREDIT').html();
		if(debitButtonHtml && creditButtonHtml){
		$('#addNewCardBtnForManageDEBIT').remove();
		$('#addNewCardBtnForManageCREDIT').remove();
		$('#addPaymentCardForm').remove();
		manageCardSectionOnMobileWidth (debitButtonHtml, creditButtonHtml,'add_btn_deb','add_btn_cred');
		}
	}else {
		var debitButtonHtml = $('#add_btn_deb').html();
		var creditButtonHtml = $('#add_btn_cred').html();
		if(debitButtonHtml && creditButtonHtml){
			$('#addNewCardBtnForManageDEBIT').remove();
			$('#addPaymentCardForm').remove();
			$('#addNewCardBtnForManageCREDIT').remove();
			manageCardSectionOnMobileWidth (debitButtonHtml, creditButtonHtml,'newCardIdDEBIT','newCardIdCREDIT');
		}
	}
}

/********************************************************************************************
' Name                 :   getMaxCardLimitmsg
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to maxcardLimit message.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sep ,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getMaxCardLimitmsg() {
	var maxCardLimit = "";
	if(cm_get_payment_card_obj){
		if (cm_get_payment_card_obj.paymentCards.length >= localStorage.getItem("maxUserRegisteredCards")*1) {
			maxCardLimit = '<div id="" class="mrgn_max_card flt_lft">'+formatMessage(messages['profile.manageMaxCardLimit'], localStorage.getItem("maxUserRegisteredCards")*1)  +'</div>'; /* Check for max limit then satisfies show max limit message */
		}
	}
	return maxCardLimit;
}

/********************************************************************************************
' Name                 :   createSuccessAndErrorMessage
' Return type          :   none
' Input Parameter(s)   :   fundingSourceTenderType
' Purpose              :   This method is used to Create success and error message message.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sep ,2014     -   Bipin Bangwal
'*******************************************************************************************/
function createSuccessAndErrorMessage(fundingSourceTenderType) {
	if(fundingSourceTenderType){
		var divId = '';
		$("#generalSuccessNotificationForAddCard").remove();
		$("#generalErrorNotificationForAddCard").remove();
		var succesAndErrorMessage = '<div class="general_error txt_inv" id="generalErrorNotificationForAddCard">'
			+ 	'<div class="submit_text card_text" id="generalErrorNotificationForAddCardText"></div>'
			+ 	'<div class="general_error_close card_close"  onclick="disolvePopup(\'generalErrorNotificationForAddCard\')"><i class="fa fa-times fa-2x rght_msg_close"></i></div>'
			+ '</div>'
			+ '<div class="general_submit txt_inv" id="generalSuccessNotificationForAddCard">'
			+ 	'<div class="submit_text card_text" id="generalSuccessNotificationForAddCardText"></div>'
			+ 	'<div class="general_submit_close card_close"  onclick="disolvePopup(\'generalSuccessNotificationForAddCard\')"><i class="fa fa-times fa-2x rght_msg_close"></i></div>'
			+ '</div>'
			if(fundingSourceTenderType === jsonTypeConstant.VESTADEBIT){
				divId = 'debit_left';
			}else if(fundingSourceTenderType === jsonTypeConstant.VESTACREDIT){
				divId = 'credit_left';
			}
		$('#'+divId+' #profileArea').after( succesAndErrorMessage );
	}
}
