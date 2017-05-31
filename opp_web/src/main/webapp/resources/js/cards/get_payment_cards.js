/* Error Code */
var INVALID_APPLICATION_ID_GET_CARD = "INVALID_APPLICATION_ID";
var USER_MISMATCH__GET_CARD = "USER_MISMATCH";
var INVALID_PARAM_GET_CARD = "INVALID_PARAM";
var CM_CHECKOUT_FEATURE_DISABLED_GET_CARD = "CM_CHECKOUT_FEATURE_DISABLED";
var CM_INVALID_FUNDING_PARTNER_GET_CARD = "CM_INVALID_FUNDING_PARTNER";
var paymentCards = {};
var forStoringLastId="";
var cardInfoObject = new Array();
var cardOptionJsonTypes = new Array(); /* Store all cards JsonType to test cvv input box have any value or not. */
var cardOptionTenderTypes = new Array(); /* Store all cards tenderType to test cvv input box have any value or not. */
var showSaveCardFlag;
var dynamicCounterDebit;
var dynamicCounterCredit;

/******************************************************************************************** 
' Name                 :   handleGetPaymentCards
' Return type          :   None
' Input Parameter(s)   :   cardPaymentBoxId, index
' Purpose              :   This method is used to call the CM_GET_PAYMENT_CARDS API for getting
                           the card and show for user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function handleGetPaymentCards(cardPaymentBoxId, cardListIndex, cardServiceFlag){
	showProgressBar();
	/* Following code is used for create request object for API call. */
	var request = {};
    request.locale = getCookie("locale");
    request.applicationId =applicationId.toString();
    request.userId = getCookie('userId');
    
    var call_cm_get_payment_card = new cm_get_payment_card(request,"manageCardsCall", cardPaymentBoxId, cardListIndex
    		, null, null, cardServiceFlag);
    call_cm_get_payment_card.call();
}

/********************************************************************************************
' Name                 :   handleCmGetPaymentCardOnSuccess
' Return type          :   None
' Input Parameter(s)   :   cardPaymentBoxId, index
' Purpose              :   This method is used to handle the CM_GET_PAYMENT_CARDS API response.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th Sept,2013     -   Ravi Raj
'*******************************************************************************************/
function handleCmGetPaymentCardOnSuccess(flagForCVV, cardPaymentBoxId, cardListIndex, cardServiceFlag) {
	/* Getting the amount due from Bills page */
	var amountDue = getFormatedNumber($("#mainPayAmountDueTotal").text(), false);
	if(amountDue > 0) {
		createPaymentOptions();
	}
	if(cm_get_payment_card_obj.paymentCards) {
		cm_get_payment_card_obj.paymentCards.sort(compareExpirationDate);
		showDefaultPaymentCards(cardPaymentBoxId, cardListIndex);
		for(var cardIndex in cm_get_payment_card_obj.paymentCards){
			if(cm_get_payment_card_obj.paymentCards[cardIndex].defaultFlag){
				hideOrShowUsedCard(cm_get_payment_card_obj.paymentCards[cardIndex].cardType);
			}
		}
	}
	if(cardServiceFlag){
		/* When user called get_payment_card API by calling delete_payment_card
		from the check out page re validate the promo code after return back to the check out page */
		$("#promoCodeDiscount3").val(promoCodeForChek);
		cardServiceFlag = false;
		promoCodeApplyBtnDisable();
	}
	/* Timer to update the check out page BILL & FEE TOTAL on top of page and check out page summary as well */
	setIntervalToCalculateServiceFeeChk();
	if(!cardServiceFlag){ /* To hide the progress bar */
		hideProgressBar();
	}
}

/********************************************************************************************
' Name                 :   setIntervalToCalculateServiceFeeChk
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to run an interval to update check out summary.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Dec,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function setIntervalToCalculateServiceFeeChk() {
	intervalForServiceFee = setInterval("showBillAndFeecheckOut()", 500);
}

/********************************************************************************************
' Name                 :   showBillAndFeecheckOut
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get update summary section dynamically.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Dec,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function showBillAndFeecheckOut() {
	/*Get selected Card id from the check out page*/
	var percentAmount = 0;
	var percentChargeToday = 0;
	var billInformation = new Object();
	billInformation.billAndFeTotal = 0;
	billInformation.chargeToday = 0;
	billInformation.amountDue = 0;
	
	/* Passing an object to calculate information about summary. */
	amountDueAndChargeTodayForServiceFee(billInformation);
	/* Get card Service fee percent after validating from the INIT_APP response */
	var serviceFeePercent = getServiceFeePercent();
	/* Hiding summary bill fee content before loading page*/
	$('#cardFeePercent').hide();
	$('#infoCardFeeId').hide();
	$('#cardserviceAmount').hide();
	if(serviceFeePercent){
		/* If there is any serviceFeePercent then calculate the amount of card service fee and update it on top and summary as well.*/
		if(billInformation.chargeToday){
			/* Calculated card service fee amount for the Charge today amount */
			percentChargeToday =  billInformation.chargeToday/100*serviceFeePercent;
		}
		
		if(billInformation.amountDue){
			/* Calculated card service fee amount for the amount due  */
			percentAmount = billInformation.amountDue/100*serviceFeePercent;
			/* If there is any card service fee amount then showing and updating it on check out page summary */
			$('#cardFeePercent').text(formatMessage(messages['detailView.serviceFee'], serviceFeePercent));
			$('#cardserviceAmount').text(getFormatedNumber(Number(percentAmount.toFixed(2)), true));
			/* Updating summary section and showing with data */
			$('#cardFeePercent').show();
			$('#infoCardFeeId').show();
			$('#cardserviceAmount').show();
		}
	}
	/* Calculating bill and feel total without detecting PROMO and credits then after added if there is any card fee amount */
	var billAndFeeTotal = billInformation.billAndFeTotal + Number(percentAmount.toFixed(2));
	/* Calculating amount due after detecting from the PROMO and credits then after added if there is any card fee amount */
	var amountDueTotal = billInformation.amountDue + Number(percentAmount.toFixed(2));
	/* Calculating Charge Today amount and added corresponding fee to that */
	var chargeToday = billInformation.chargeToday + Number(percentChargeToday.toFixed(2)); 
	
	$('#billAndFeeId').text(formatMessage(messages['checkout.dollarSign_fee'], getFormatedNumber(billAndFeeTotal.toFixed(2), true)));
	$('#summaryBillFeetotal').text(messages['checkout.billAndServiceFee']);
	$('#summaryBillFeetotalAmount').text(getFormatedNumber(billAndFeeTotal.toFixed(2), true));
	
	if(amountDueTotal > 0){/* Updating amount due if there is any amount */
		$("#amountDueTotal").text(getFormatedNumber(amountDueTotal.toFixed(2), true));
	} else { 
		$("#amountDueTotal").text(getFormatedNumber(0, true));
	}
	
	if(chargeToday > 0){/* Updating charge today if there is any amount */
		$("#amountChargeToday").text(getFormatedNumber(chargeToday.toFixed(2), true));
	} else {
		$("#amountChargeToday").text(getFormatedNumber(0, true));
	}
}

/********************************************************************************************
' Name                 :   getServiceFeePercent
' Return type          :   serviceFeePercent
' Input Parameter(s)   :   None
' Purpose              :   This method is used to validate service fee percent from INIT_APP by
' matching GET_PAYMENT_CARDS API response.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Dec,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getServiceFeePercent() {
	var serviceFeePercent = 0;
	var selectedIndex = getSelectedCardIdFromCardSec();
	if(selectedIndex){/* If there is any selected card then get INDEX of that card by splitting*/
		if(cm_get_payment_card_obj.paymentCards){
				if(cm_get_payment_card_obj.paymentCards[selectedIndex].fundingPartnerFeeConfig){
					 return serviceFeePercent = cm_get_payment_card_obj.paymentCards[selectedIndex].fundingPartnerFeeConfig.serviceFeePercent;
			}
		}
	}
	return serviceFeePercent;
}

/********************************************************************************************
' Name                 :   getSelectedCardIdFromCardSec
' Return type          :   selectedCard
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get Selected card id from DEBIT/CREDIT section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Dec,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function getSelectedCardIdFromCardSec() {
	var selectedCard = '';
	if($('#cardButtonImageAreaDEBIT').hasClass("vesta_delivered_icon")){/* DEBIT panel selects then proceed */
		if($('#addCardFormDEDIT').is(':visible')) {/* DEBIT add card form visible then assigning null to selectedCard */
			return selectedCard = null;
		} else {/* DEBIT add card form not visible then assigning selected card id to selectedCard */
			var getId = $('#cardPaymentOptionsContainer #panelDEBIT').find('.chkout_correct_icon').attr('id');
			return selectedCard = $('#'+ getId).closest('div').attr('id');
		}
	} else if($('#cardButtonImageAreaCREDIT').hasClass("vesta_delivered_icon")){/* CREDIT panel selects then proceed */
		if($('#addCardFormCREDIT').is(':visible')) {/* CREDIT add card form visible then assigning null to selectedCard */
			return selectedCard = null;
		} else {/* CREDIT add card form not visible then assigning selected card id to selectedCard */
			var getId = $('#cardPaymentOptionsContainer #panelCREDIT').find('.chkout_correct_icon').attr('id');
			return selectedCard = $('#'+ getId).closest('div').attr('id');
		}
	} else if ($('#cashButtonImageArea').hasClass("vesta_delivered_icon")){
		/* When user selects CASH section assigning null to selectedCard */
		return selectedCard = null;
	}
	return selectedCard;
}

/********************************************************************************************
' Name                 :   amountDueAndChargeTodayForServiceFee
' Return type          :   None
' Input Parameter(s)   :   billInformation
' Purpose              :   This method is used to Calculate summary content using GET_PENDING_TRANSACTIONS.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Dec,2014     -   UmaMaheswaraRao
'*******************************************************************************************/
function amountDueAndChargeTodayForServiceFee(billInformation) {
	var chargeToday = 0;
	var billAndFee = 0;
	var currentDate = new Date();
	if (bp_get_pending_transaction_obj.pendingTransactions) {
		var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
		for (var index in pendingTransactions) {
			var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;
			if (isSameDay(currentDate,scheduledSubmitdate1)) {
				chargeToday += pendingTransactions[index].amount + pendingTransactions[index].fee;
			}
			billAndFee += pendingTransactions[index].amount + pendingTransactions[index].fee;
		}
		var creditsFromCart = calculateCreditsApplied(billAndFee);
		var chkPromoTotal = getFormatedNumber($("#checkoutPromoCodeAmount1").text());
		billInformation.billAndFeTotal +=billAndFee;
		billInformation.amountDue += billAndFee - (creditsFromCart + chkPromoTotal); 
		billInformation.chargeToday += chargeToday  - (creditsFromCart + chkPromoTotal); 
	}
}

/********************************************************************************************
' Name                 :   showBillPayFees
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To show biil pay fees url on click of icon.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   18 Dec 2014   -   Mohit Arya
'*******************************************************************************************/
function showBillPayFees(){
	showAnimatedPopup('billFeesPopup', 'billFeesCredPopup');
}

/********************************************************************************************
' Name                 :   showDefaultPaymentCards
' Return type          :   String paymentOptionStructure
' Input Parameter(s)   :   cardPaymentBoxId, cardListIndex
' Purpose              :   This method is used to show the default card for user if user had 
                           added some payments card previously.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   01st Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function showDefaultPaymentCards(cardPaymentBoxId, cardListIndex){
	var cardIcon = new Object();
	cardIcon.visaCardBrand = '';
	cardIcon.discoverCardBrand = '';
	cardIcon.masterCardBrand = '';
	
	$("#cardPaymentOptionsContainer").empty();
	var paymentOptionStructure = "";
	/* Getting fundingSourceTypes from local storage which comes in INIT_APP API call */
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	
	/* This code segment is used to draw the row for card on the basis of funding source. */
	for(var fundingSourceTypesIndex in fundingSourceTypes) {
		var debitOrCreditFlag = true;
		paymentOptionStructure = "";
		/* Getting single fundingSourceTypeObj from fundingSourceTypes array */
		var fundingSourceTypeObj = fundingSourceTypes[fundingSourceTypesIndex];
		var fundingSourceTypes_JsonType = fundingSourceTypeObj.jsonType; /* Getting jsonType for fundingSource as came in INIT_APP API */
		var fundingSourceTypes_TenderType = fundingSourceTypeObj.tenderType; /* Getting tenderType for fundingSource as came in INIT_APP API */
		var fundingSourceTypes_ServiceFeeFlat = getFormatedNumber(fundingSourceTypeObj.serviceFeeFlat); /* Getting serviceFeeFlat for fundingSource as came in INIT_APP API */
		var fundingSourceTypes_ServiceFeePercent = getFormatedNumber(fundingSourceTypeObj.serviceFeePercent); /* Getting serviceFeePercent for fundingSource as came in INIT_APP API */
		var serviceFeeInfoText = getPaymentModeFee(fundingSourceTypes_ServiceFeeFlat, fundingSourceTypes_ServiceFeePercent); 
		
		if(messages["checkout.lbl_payment_option_free"] === serviceFeeInfoText) { /* Checking text message with properties and changing the CSS class */
			cardFeeTextClass = "card_fee green_txt";
		}
		
		/* This code segment is checks for card and draw the card row on checkout page and show the default card section. */
		if(fundingSourceTypes_TenderType 
				&& fundingSourceTypes_TenderType.toUpperCase() !== tenderTypeConstant.CASH
				&& fundingSourceTypes_TenderType.toUpperCase() !== tenderTypeConstant.PROMO ){
			cardOptionJsonTypes.push(fundingSourceTypes_JsonType);
			cardOptionTenderTypes.push(fundingSourceTypes_TenderType);
		
			for(var index = 0; index < fundingSourceTypesIndex; index++){
				if(fundingSourceTypes_TenderType === fundingSourceTypes[index].tenderType){
					debitOrCreditFlag = false;
				}
			}
			if(debitOrCreditFlag){
				getCardBrandIcon(fundingSourceTypes, fundingSourceTypes_TenderType, cardIcon);
				paymentOptionStructure = "<div onclick=\"hideOrShowUsedCard('" + fundingSourceTypes_TenderType + "');\"  class='new_carduser_btn'>"
				+ '<div id="cardButtonImageArea' + fundingSourceTypes_TenderType + '" class="fa fa-check fa-2x card_icon"></div>'
				+ '<div class="new_user_cardtxt"> ' + fundingSourceTypes_TenderType.toLowerCase() + " " + messages['checkout.lbl_card'] + '</div>'
				+ '<div class="card_method">'
				+ '<div class="center_vertical" id="logoCardBrand">'
				+ cardIcon.discoverCardBrand
				+ cardIcon.masterCardBrand
				+ cardIcon.visaCardBrand
				+ '</div>'
				+ '</div>'
				+ '</div>'
				+ '<div class="clear"></div>';
		
			paymentOptionStructure += createUsedCardPaymnetOption(fundingSourceTypes_TenderType, fundingSourceTypes_TenderType);
			}
		}
		if(paymentOptionStructure) {
			$("#cardPaymentOptionsContainer").append(paymentOptionStructure);
			$('#advertisementPaymentPage'+fundingSourceTypes_TenderType).html("<iframe src='"+messages['paymentCardForm.promo']+"' class='ads'></ifarme>");
			callSelectCheckBox(0, fundingSourceTypes_TenderType);
			/* This code segment is used to calculate the month, year and state list when get card return with blank array. */
			if((cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0) || calculateMonthAndYear(fundingSourceTypes_TenderType)) {
				$("#newCardId" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
				$("#newCardId" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
				if (!cm_get_payment_card_obj.paymentCards || cm_get_payment_card_obj.paymentCards.length < localStorage.getItem("maxUserRegisteredCards")*1) {
					calculateMonthForExpirationDate("expiryMonthPaymentCards");
				  	calculateYearForExpirationDate("expiryYearPaymentCards");
				  	setStateList("stateOfPaymentCards");
				}
			}
			/* This code segment is used to register the event for list of card. 
			if(fundingSourceTypes_JsonType === jsonTypeConstant.VESTADEBIT && dynamicCounterDebit && dynamicCounterDebit > 0) {
				for(var index=0; index < dynamicCounterDebit; index++){
					createFundingSourceForCard(fundingSourceTypes_JsonType, index);
				}
			} else if(fundingSourceTypes_JsonType === jsonTypeConstant.VESTACREDIT && dynamicCounterCredit && dynamicCounterCredit > 0) {
				for(var index=0; index < dynamicCounterCredit; index++){
					createFundingSourceForCard(fundingSourceTypes_JsonType, index);
				}
			}*/
			/* This code segment is used to show the default check card row when user comes from edit card. */
			if(cardListIndex){
				checkStatusOfSelectedChkBox(cardListIndex, fundingSourceTypes_TenderType);
			}
		}
	}
	expandSingleFundingSource(); /* This method checks if only one funding source is available for user then show it as expanded */
	if(cardPaymentBoxId){ /* This code segment is used to default show the card panel, which user was working or added or edited card. */
		hideOrShowUsedCard(cardPaymentBoxId);
	}
}

/********************************************************************************************
' Name                 :   checkSelectedDebitOrCreditCard
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to find selected Debit or Credit card in checkout page.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   19 june 2014   -    Karuna Mishra
'*******************************************************************************************/
function checkSelectedDebitOrCreditCard(fundingSourceTypes_JsonType) {
	var selectedCardId = getSelectedDebitOrCreditCard(fundingSourceTypes_JsonType);
	if(!selectedCardId) {
		checkStatusOfSelectedChkBox(0, fundingSourceTypes_JsonType);
	}
}

/********************************************************************************************
' Name                 :   getPaymentModeFee
' Return type          :   String
' Input Parameter(s)   :   fundingSourceTypes_ServiceFeeFlat, paymentOptionServiceFeePercent
' Purpose              :   This method is used to get the message from properties file and 
							combine service fee with message.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24th Sep, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getPaymentModeFee(fundingSourceTypes_ServiceFeeFlat, fundingSourceTypes_ServiceFeePercent) {
	var serviceFeeInfoText = "";
	/* Checking for Service Fee Flat and Service Fee Percent both exists then show message as VARIES */
	if (fundingSourceTypes_ServiceFeeFlat > 0 && fundingSourceTypes_ServiceFeePercent > 0) {
		displayFeeAsFree = true;
		serviceFeeInfoText = formatMessage(
				messages["checkout.lbl_payment_option_flatFee_with_percentFee"],
				displayDefaultDecimalNumber(fundingSourceTypes_ServiceFeeFlat),
				displayDefaultDecimalNumber(fundingSourceTypes_ServiceFeePercent));
	} else if (fundingSourceTypes_ServiceFeeFlat > 0) { /* Checking if only Service Fee Flat exists then show message as FEE */
		displayFeeAsFree = true;
		serviceFeeInfoText = formatMessage(
				messages["checkout.lbl_payment_option_flat_fee"],
				displayDefaultDecimalNumber(fundingSourceTypes_ServiceFeeFlat));
	} else if (fundingSourceTypes_ServiceFeePercent > 0) { /* Checking if only Service Fee Percent exists then show message as PERCENTAGE */
		displayFeeAsFree = true;
		serviceFeeInfoText = formatMessage(
				messages["checkout.lbl_payment_option_percent_fee"],
				displayDefaultDecimalNumber(fundingSourceTypes_ServiceFeePercent));
	} else if (fundingSourceTypes_ServiceFeeFlat == 0
			&& fundingSourceTypes_ServiceFeePercent == 0 && displayFeeAsFree) { /* Checking if only both doesn't exists then show message as FREE */
		serviceFeeInfoText = messages["checkout.lbl_payment_option_free"];
	}
	return serviceFeeInfoText;
}

/*****************************************************************************************************
' Name                 :   createUsedCardPaymnetOption
' Return type          :   String usedCardStructure
' Input Parameter(s)   :   fundingSourceTypes_JsonType, fundingSourceTypes_TenderType
' Purpose              :   This method is used to show the default card or if user don't have 
                           added card than its shows add payment card button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   01st Oct, 2013     -   Ravi Raj
'*****************************************************************************************************/
function createUsedCardPaymnetOption(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType){
	var addedCardList = new Array();
	/* Checking for paymentCards in CM_GET_PAYEMNT_CARD API object */
	if(cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length > 0) {
		for(var index in cm_get_payment_card_obj.paymentCards) { /* Iterating through paymentCards in CM_GET_PAYEMNT_CARD API object */
			/* Checking tenderType as DEBIT and if exists then add all DEBIT CARD information into array in a sequence 
			 * because at a time only one tenderType(DEBIT/CREDIT) will be sent to method and it will match all paymentCards */
			if(fundingSourceTypes_TenderType === tenderTypeConstant.DEBIT) {
				/* Checking cardType as DEBIT or UNKNOWN and if exists then push it into array */
				if(cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.DEBIT 
						|| cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.UNKNOWN) {
					addedCardList.push(cm_get_payment_card_obj.paymentCards[index]);
				}
			}
			/* Checking tenderType as CREDIT and if exists then add all CREDIT CARD information into array in a sequence */
			else if(fundingSourceTypes_TenderType === tenderTypeConstant.CREDIT) {
				/* Checking cardType as CREDIT and if exists then push it into array */
				if(cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.CREDIT) {
					addedCardList.push(cm_get_payment_card_obj.paymentCards[index]);
				}
			}
		}
	}
	var defaultcardStructure = '<div id="panel' + fundingSourceTypes_JsonType + '" class="card_infobox txt_inv">' 
								/*+ '<div id="addCardFormSection' + fundingSourceTypes_JsonType + '"></div>'*/;
	if(addedCardList && addedCardList.length > 0) { /* Checking if any card is added into addedCardList then create card list panel */
		defaultcardStructure += createPaymentCardList(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType);	
	} else { /* Otherwise add card form will be added */
		defaultcardStructure += createAddCardFormForUser(fundingSourceTypes_JsonType); 
	}
	
	return defaultcardStructure;
}

/********************************************************************************************
' Name                 :   createPaymentCardList
' Return type          :   String listOfPaymentCards
' Input Parameter(s)   :   fundingSourceTypes_JsonType, fundingSourceTypes_TenderType
' Purpose              :   This method is used to create the row for list of card section.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Nov, 2013     -   Ravi Raj
'*******************************************************************************************/
function createPaymentCardList(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType){
	var giftWarningMsg = "";
	if(giftCardWarningMsg(fundingSourceTypes_JsonType)) { /* When ever it is true then go inside then store message in to variable */
		giftWarningMsg = '<div id="giftCardId" class="gift_card">' + messages['checkout.giftCard.label'] + '</div>'; 
	}
	/* Designing the Card List panel outer panel and calling method to create list of cards */
	var listOfPaymentCards = 	"<div class='add_pmt_method_cardarea' id='listOfPaymentCard" + fundingSourceTypes_JsonType + "'>"
							+ 	showListOfDebitOrCreditCard(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType)
							+ '<div id="buttonSection' + fundingSourceTypes_JsonType + '"><div class="debit_vesta_btnarea">'
							+  giftWarningMsg /* Gift card warning message with div */
							+ '<input type="button" value="' + messages['addPaymentCardForm.manageAndAddCards'] 
							+ 	'" class="mrgn_top mng_card_btn flt_lft mob_flt_none bg_lightblue" onclick ="navigateToManageCards(\'' + callFrom_constant.MANAGE_CARD_CHECKOUT_CALL + '\')"/>' //onclick ="showAddPaymentCardForm(\'' + fundingSourceTypes_JsonType + '\', false)"/>'
							+ '</div></div></div>';
	return listOfPaymentCards;
}


/********************************************************************************************
' Name                 :   giftCardWarningMsg
' Return type          :   {Boolean}
' Input Parameter(s)   :   None
' Purpose              :   This method is used to check cvv required status to shwo gift card warning msg.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   31st May, 2014     -   Ravi Raj
'*******************************************************************************************/
function giftCardWarningMsg(fundingSourceTypes_JsonType) {
	if(cm_get_payment_card_obj) { /* Checking if CM_GET_PAYMENT_CARD object contains any data */
		for(var index in cm_get_payment_card_obj.paymentCards) { /* Iterating through paymentCards object array */
			var paymentCard = cm_get_payment_card_obj.paymentCards[index]; /* Getting individual cards to check status*/
			if(paymentCard.cvvRequiredStatus.toUpperCase() === cvvRequiredStatusConstant.UNKNOWN && fundingSourceTypes_JsonType === paymentCard.cardType){
				return true; /* return true in case condition executes and status comes as above*/
			}
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   showListOfDebitOrCreditCard
' Return type          :   String listOfCard
' Input Parameter(s)   :   fundingSourceTypes_JsonType, fundingSourceTypes_TenderType
' Purpose              :   This method is used to create complete DEBIT/CREDIT card panel 
							with all the Card information returned from CM_GET_PAYMENT_CARD API.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function showListOfDebitOrCreditCard(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType){
	var listOfCard="";
	/* Checking if paymentCards exists in CM_GET_PAYMENT_CARD object */
	if(cm_get_payment_card_obj.paymentCards.length > 0){
		listOfCard = createListOfCard(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType);
	}
	return listOfCard;
}

/********************************************************************************************
' Name                 :   createListOfCard
' Return type          :   String cardListDesign
' Input Parameter(s)   :   fundingSourceTypes_JsonType, fundingSourceTypes_TenderType
' Purpose              :   This method is used to check the tenderType and create the row on 
                           the condition of tenderType.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function createListOfCard(fundingSourceTypes_JsonType, fundingSourceTypes_TenderType){
	var cardListDesign = "";
	var counter = 0;
	var paymentCardSortedArray = cm_get_payment_card_obj.paymentCards;
	dynamicCounterDebit = 0;
	dynamicCounterCredit = 0;
	if(fundingSourceTypes_TenderType == tenderTypeConstant.DEBIT){ /* Checking for fundingSourceType as DEBIT card */
		for(var index in paymentCardSortedArray) { /* Iterating through the paymentCards array */
			var paymentCard = paymentCardSortedArray[index]; /* Getting the single payment card information */
			if(paymentCard.cardType.toUpperCase() == tenderTypeConstant.DEBIT 
					|| paymentCard.cardType.toUpperCase() == tenderTypeConstant.UNKNOWN) { /* Checking if current paymentCard in array is a DEBIT card or UNKNOWN */
				cardListDesign += createRowForCard(paymentCard, index, fundingSourceTypes_JsonType, counter); /* Calling method to create single row for current DEBIT/UNKNOWN card */
				dynamicCounterDebit++; 
				counter++;
			}
		}
	} else if(fundingSourceTypes_TenderType == tenderTypeConstant.CREDIT) { /* Checking for fundingSourceType as CREDIT card */
		for(var index in paymentCardSortedArray) { /* Iterating through the paymentCards array */
			var paymentCard = paymentCardSortedArray[index]; /* Getting the single payment card information */
			if(paymentCard.cardType == tenderTypeConstant.CREDIT) { /* Checking if current paymentCard in array is a DEBIT card or UNKNOWN */
				cardListDesign += createRowForCard(paymentCard, index, fundingSourceTypes_JsonType, counter); /* Calling method to create single row for current CREDIT card */
				dynamicCounterCredit++;
				counter++;
			}
		}
	}
	return cardListDesign;
}

/********************************************************************************************
' Name                 :   createRowForCard
' Return type          :   String debitCardList
' Input Parameter(s)   :   paymentCard, index, fundingSourceTypes_JsonType, counter
' Purpose              :   This method is used to create the row for credit card and debit card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   7th Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function createRowForCard(paymentCard, index, fundingSourceTypes_JsonType, counter) {
	var cardNotEligibleForSchedule = '';
	var createdCardRow = "<div class='vesta_manage_cardrow white_topbrdr' id='vesta_manage_cardrow_" + index + "'  onclick='checkStatusOfSelectedChkBox(" + counter + ",\"" + fundingSourceTypes_JsonType + "\")' >"
	           			+ "<div class='vesta_manage_card15 mrgn_rght5' id='manageCardLeftSection_" + index + "' onclick='callSelectCheckBox(" + counter + ",\"" + fundingSourceTypes_JsonType + "\")'>"
	           			+ "<div class='mrgn_top8 mrgn_mob_none width_area100' id='"+index+"'>";
	
	if(paymentCard.cvvRequiredStatus === cvvRequiredStatusConstant.REQUIRED){
		cardNotEligibleForSchedule = '<div class="card_info" id="cardNotEligibleForSchedule">'+messages['profile.cardNotEligibleForSchedule']
									+'<span onclick="showFAQUrl()">'+ messages['profile.faq'] +'</span></div>';
	}	
	
	if(paymentCard.defaultFlag === true) {
		createdCardRow += "<input type='checkbox' id='defaultChkBox" + fundingSourceTypes_JsonType + counter + "' class='txt_inv' value='" + index + "' checked />";
	} else {
		createdCardRow += "<input type='checkbox' id='defaultChkBox" + fundingSourceTypes_JsonType + counter + "' class='txt_inv' value='" + counter +"' />";
	}
	createdCardRow += "<span id='manageCheckBox" + fundingSourceTypes_JsonType + "_" + counter + "' class='fa fa-check fa-2x chkout_correctbw_icon check_pay_inner'></span>"		    
				    + "</div>" 
				    + "</div>"
					+ "<div class='vesta_manage_card80' id='manageCardRightSection_" + index + "' >"					
					+ "<div class='add_pmt_method_cardarea width_area75 mob_wid100 mrgn_bottom0'>";	
	if(paymentCard.cardBrand == cardBrandConstant.MASTERCARD) {
		createdCardRow += "<div class='master_card_icon' id='masterIcon_" + index + "'></div>";	
	} else if(paymentCard.cardBrand == cardBrandConstant.VISA) {
		createdCardRow += "<div class='visa_card_icon' id='visaIcon_" + index + "'></div>";
	} else if(paymentCard.cardBrand == cardBrandConstant.DISCOVER_NEW) {
		createdCardRow += "<div class='discover_card_icon' id='discoverIcon_" + index + "'></div>";
	} else {
		createdCardRow += "<div class='master_card_icon' id='masterIcon_" + index + "'></div>";
	}	
	createdCardRow += "<div class='vesta_manage_card45 mrgn_top8 fnt_itc' id='lastFour_"+index+"'>"
					+ formatMessage(messages['getPaymentCards.cardEndTxt'], paymentCard.cardLastFour) 
					+ "</div>"
				    + "<div class='vesta_manage_card25 mob_vesta_wd100 mrgn_top8 fnt_itc card_expiry'>"
				    + formatMessage(messages['getPaymentCards.expDateTxt'], getExpirationDateOfCard(paymentCard.cardExpireDate))
				    + "</div></div>"
				    + "<div class='vesta_manage_card25 mob_vesta_wd100 mrgn_top8'>"
				    + "<div class='add_pmt_method_cardarea mob_txt_lft'>"
					+ "<div>" + paymentCard.firstName + " " + paymentCard.lastName + "</div>"
					+ "<input name='CardId' type='hidden' id='cardId" + fundingSourceTypes_JsonType + "_" + counter + "' value='" + paymentCard.id + "' >"
					+ "</div>"
				    + "</div>" 
				    + "</div>"				    
				    + "<div class='clear'></div>"
				    + cardNotEligibleForSchedule
				    + "</div>"
				    + "<div class='clear'></div>";

	return createdCardRow;
}

/********************************************************************************************
' Name                 :   callSelectCheckBox
' Return type          :   None
' Input Parameter(s)   :   index, fundingSourceTypes_JsonType
' Purpose              :   This method is used for selecting the checkbox for mobile width on the click of right section of manage card.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   15th Oct, 2013     -   Karuna Mishra
'*******************************************************************************************/
function callSelectCheckBox(index, fundingSourceTypes_JsonType){
	var chkboxId = "#defaultChkBox" + fundingSourceTypes_JsonType + index;
	var count = 0;
	// make div dynamic
	$("#listOfPaymentCard" + fundingSourceTypes_JsonType).find('input[type="checkbox"]').each(function() {
		$(this).attr("checked",false);
		$(this).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + count).removeClass("chkout_correct_icon");
		$(this).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + count).addClass("chkout_correctbw_icon");  
		count++;
	});
	$(chkboxId).attr("checked",true);
	$(chkboxId).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + index).removeClass("chkout_correctbw_icon");
	$(chkboxId).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + index).addClass("chkout_correct_icon");
	$('#cvvValue').val(''); /* Clearing the CVV field from CVV required popup */
}

/********************************************************************************************
' Name                 :   checkStatusOfSelectedChkBox
' Return type          :   None
' Input Parameter(s)   :   index, fundingSourceTypes_JsonType
' Purpose              :   Function is used for checking the status of checkbox.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct,2013      -   Karuna Mishra
'*******************************************************************************************/
function checkStatusOfSelectedChkBox(index, fundingSourceTypes_JsonType){
	var chkboxId = "#defaultChkBox" + fundingSourceTypes_JsonType + index;
	var count = 0;
	// make div dynamic
	$("#listOfPaymentCard" + fundingSourceTypes_JsonType).find('input[type="checkbox"]').each(function() {
		$(this).attr("checked",false);
		$(this).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + count).removeClass("chkout_correct_icon");
		$(this).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + count).addClass("chkout_correctbw_icon");  
		count++;
	});
	$(chkboxId).attr("checked", true);
	$(chkboxId).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + index).removeClass("chkout_correctbw_icon");
	$(chkboxId).parent().find("#manageCheckBox" + fundingSourceTypes_JsonType + "_" + index).addClass("chkout_correct_icon");
	$('#cvvValue').val(''); /* Clearing the CVV field from CVV required popup */
	activateCheckoutPayButton();
	createFundingSourceForCard(fundingSourceTypes_JsonType, index);
}

/********************************************************************************************
' Name                 :   getExpirationDateOfCard
' Return type          :   String
' Input Parameter(s)   :   date
' Purpose              :   This method is used to format the date which is return by 
                           get_payment_card api as card expiration date.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function getExpirationDateOfCard(date){
	var expireMonth= date.toString().substring(0,2);
	var expireYear = date.toString().substring(2);
	var expireDate = expireMonth + "/" + expireYear;
	return expireDate;
}

/********************************************************************************************
' Name                 :   calculateMonthAndYear
' Return type          :   {Boolean}
' Input Parameter(s)   :   fundingSourceTypes_TenderType
' Purpose              :   This method is used to 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function calculateMonthAndYear(fundingSourceTypes_TenderType){
	var flag = true;
	if(fundingSourceTypes_TenderType == tenderTypeConstant.DEBIT) {
		for(var index in cm_get_payment_card_obj.paymentCards) {
			var paymentCard = cm_get_payment_card_obj.paymentCards[index];
			if(paymentCard.cardType === tenderTypeConstant.DEBIT 
					|| paymentCard.cardType === tenderTypeConstant.UNKNOWN) {
				flag = false;
			}
		}
	} else if(fundingSourceTypes_TenderType == tenderTypeConstant.CREDIT) {
		for(var index in cm_get_payment_card_obj.paymentCards) {
			var paymentCard = cm_get_payment_card_obj.paymentCards[index];
			if(paymentCard.cardType == tenderTypeConstant.CREDIT) {
				flag = false;
			}
		}
	}
	return flag;
}

/********************************************************************************************
' Name                 :   createAddCardFormForUser
' Return type          :   String addButtonStructure
' Input Parameter(s)   :   String cardPaymentBoxId
' Purpose              :  This segment is used to show the add payment card button when get 
                          payment cards api not return paymentCards array.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   08th Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function createAddCardFormForUser(fundingSourceTypes_JsonType){
	/* This segment is used to show the add payment card button when get payment cards api not return paymentCards array. */
	var addButtonStructure = "";
	if (!cm_get_payment_card_obj.paymentCards || cm_get_payment_card_obj.paymentCards.length < localStorage.getItem("maxUserRegisteredCards")*1) {
		addButtonStructure = createAddPaymentCardForm(fundingSourceTypes_JsonType, true);
	} else {
		addButtonStructure = "<span class='card_limit_reached'>"+  (formatMessage(messages['checkout.maxCardLimit'], localStorage.getItem("maxUserRegisteredCards")*1)) +"</span>"
								+ '<input type="button" value="' + messages['addPaymentCardForm.manageAndAddCards'] 
								+ 	'" class="mrgn_top mng_card_btn flt_lft mob_flt_none bg_lightblue"' 
								+		' onclick ="navigateToManageCards(\'' + callFrom_constant.MANAGE_CARD_CHECKOUT_CALL + '\')"/>';
	}
	addButtonStructure +=  '</div>'
		+ '<div class="clear"></div>';
	storeRegexExpOfAddCardFields(callSelectCheckBox);
	return addButtonStructure;
}

/********************************************************************************************
' Name                 :   compareExpirationDate
' Return type          :   int index
' Input Parameter(s)   :   Object a, Object b
' Purpose              :   This method is used to sort the array on the basis of dete of card 
                           expiration and also show the default card at top.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   3rd Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function compareExpirationDate(a, b){
	var x = conertDateToMiliSeconds(a.cardExpireDate);
    var y = conertDateToMiliSeconds(b.cardExpireDate);
	
    if(a.defaultFlag === true){
    	return -1;
    } else if(b.defaultFlag === true ){
    	return 1;
    } else if(x > y) {
		return -1;
	} else if(x < y) {
		return 1;
	}
	return 0;
}

/********************************************************************************************
' Name                 :   conertDateToMiliSeconds
' Return type          :   Time InMilis
' Input Parameter(s)   :   String date
' Purpose              :   This method is used to convert the date in time(In Milis).
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function conertDateToMiliSeconds(date){
	var currentDate = new Date();
	var currentYear= currentDate.getFullYear().toString();
	var firstTwoDigit = currentYear.substring(0, 2);
	var length = date.length;
	var month;
	var year = firstTwoDigit;
	if(length === 4){
		month = date.substring(0, 2);
		year += date.substring(2, 4);
	} else {
		month ="0"+ date.substring(0, 1);
		year += date.substring(1, 3);
	}
		
	var finalDate ="" + year + "-" + month + "-" + "30";
	var calculatedDate = new Date(finalDate).getTime();
	return parseInt(calculatedDate);
}

/********************************************************************************************
' Name                 :   createFundingSourceForCard
' Return type          :   None
' Input Parameter(s)   :   String fundingSourceTypes_JsonType, index
' Purpose              :   This method is used to show and hide the submit button from 
                           checkout page on the basis of cvv field on manage card section.
                           and again click for show the sction.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   8th Oct, 2013     -   Karuna Mishra
'*******************************************************************************************/
function createFundingSourceForCard(fundingSourceTypes_JsonType, index){
	cardInfoObject[0] = new Object();
	var amountDueToPay = getFormatedNumber($("#amountDueTotal").text(), false);
	cardInfoObject[0].amount = "" + amountDueToPay;	
	cardInfoObject[0].loadAccountNumber = $('#cardId' + fundingSourceTypes_JsonType + '_' + index).val();
	for(var cardIndex in cm_get_payment_card_obj.paymentCards){
		if(cm_get_payment_card_obj.paymentCards[cardIndex].id * 1 === cardInfoObject[0].loadAccountNumber * 1){
			index = cardIndex;
			break;
		}
	}
	cardInfoObject[0].type = cm_get_payment_card_obj.paymentCards[index].fundingPartnerFeeConfig.jsonType;
}

/********************************************************************************************
' Name                 :   handlingScheduledCardDelete
' Return type          :   SNone
' Input Parameter(s)   :   index, cardExpandBoxId
' Purpose              :   This method is used to handle the card delete for schedule payments.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Karuna Mishra
'*******************************************************************************************/
function handlingScheduledCardDelete(val){
	closeAnimatedPopup("idOfDeleteDebitCardPopUpError", "idOfDeleteDebitCardPopUpErrorContainer");
		/* To show the progress bar */
		showProgressBar();
		var splitname = val.split("_");
		var paymentCard = cm_get_payment_card_obj.paymentCards[splitname[0]];
		var request = {};
		request.applicationId = applicationId;
		request.locale = getCookie("locale");
		request.userId = eval(getCookie('userId'));
		request.paymentCardId = paymentCard.id;
		request.cancelScheduledPayments = true;

		var call_cm_delete_payment_card = new cm_delete_payment_card(request, splitname[0],splitname[1], 
				callFrom_constant.MANAGE_DELTE_CARD_SCHEDULE_CALL);
		call_cm_delete_payment_card.call();
}

function getCardBrand(cardNum){
    var cardBrand="";
    var regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    var regexMaster = /^5[1-5][0-9]{14}$/;
    var regexDiscover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
    if(regexVisa.test(cardNum)){
    	cardBrand = "VS";
    }else if(regexMaster.test(cardNum)){
    	cardBrand = "MC";	
    }else if(regexDiscover.test(cardNum)){
    	cardBrand = "DS";
    }
    return cardBrand;
}
