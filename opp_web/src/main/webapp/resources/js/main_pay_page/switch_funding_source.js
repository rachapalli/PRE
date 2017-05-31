
/********************************************************************************************
' Name                 :   getAllFundingSource
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get the all funding source.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function getAllFundingSource() {
	var paymentOptionTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	var fundingSourceTypes = new Array();
	for(var paymentOptionIndex in paymentOptionTypes) {
		var tenderType = paymentOptionTypes[paymentOptionIndex].tenderType;
		if(fundingSourceTypes.indexOf(tenderType) == -1) {
			fundingSourceTypes.push(tenderType);
		}
	}
	return fundingSourceTypes;
}

/********************************************************************************************
' Name                 :   expandSingleFundingSource
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand cash section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function showCashFundingSource() {
	hideAllCashAndCardTypes(false);
	/* Checking if Pop up shown when user move from Card to Cash in case of Schedule Payment */
	if($('#mainContainId').is(':visible')){
		closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId'); /* Closing the pop up */
	}
	if(timeIntevalOfAddCard) {
		clearInterval(timeIntevalOfAddCard);
	}
	if(timeIntevalOfCard){
		clearInterval(timeIntevalOfCard);
	}
	$("#cashDataMainContainer").show();
	$("#completeItemsContainer").show();
	$("#newSelectOption").slideToggle("fast");
	$("#cashButtonImageArea").removeClass("fa fa-check fa-2x card_icon").addClass("fa fa-check fa-2x vesta_delivered_icon");
	$("#optionsListContainer").show();
	$("#cashInfoTxt").show();
	$("#helpCash").show();
	deActivateCheckoutPayButton();
	updateSummarySectionFromCashClick();
	updateNewCreditsArea();
	addOrRemoveBorderBottom();
}


/********************************************************************************************
' Name                 :   updateSummarySectionFromCashClick
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used updaet summary charge on date if user is scheduled
							or immediate.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   16 June 2013    -   Karuna Mishra
'*******************************************************************************************/
function updateSummarySectionFromCashClick() {
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	var amountChargeToday = 0;
	var flagForSchedule = false;
	//var currentDate = new Date();
	for(var index in pendingTransactions) {
		//var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;
		//if(!isSameDay(scheduledSubmitdate1, currentDate)) {
			flagForSchedule = true;
			if( $('#completeItemsContainer').is(':visible') || $('#checkoutCreditsCoverAllAmountDue').is(':visible') ){
				$('#chargeOn' + index).text(messages['main_pay.confirm.charge_label']);
			}
			//$('#deleiverOn' + index).text(messages['main_pay.confirm_successDate_Label']);
			amountChargeToday += pendingTransactions[index].amount * 1  + pendingTransactions[index].fee * 1;
		//}
	}
	if(flagForSchedule) {
		$('#idOfAmountChargeToday').remove();
		$('#amountAdded').remove();
		$('#newCreditsApplied').remove();
		var creditsAmount = getFormatedNumber($('#creditsAppliedAmount').text(), false);
		var promoAmount = getFormatedNumber($('#checkoutPromoCodeAmount1').text(), false);
		amountChargeToday = amountChargeToday - (creditsAmount * 1 + promoAmount * 1);
		var txt_inv_val = 'txt_inv';
		if($('#sel_pay_container1').is(':visible')) {
			txt_inv_val = ' ';
		}
		var htmlText = "<div id='idOfAmountChargeToday' class='width_area100 mrgn_top_neg_25 " +txt_inv_val+"'>"
					+	"<div class='textBar' >"
					+	"<div class='totalpay_txt_head totalpay_mrgn fnt_wt dueText'><label>"
					+	messages['main_pay.confirm_chargedToday']
					+	"</label></div>"
					+	"</div>"
					+	"<div class='labelBar fnt_wt amountDue'>"
					+	"<label id='amountChargeToday' class='dynamiclab'>" 
					+	getFormatedNumber(amountChargeToday <= 0 ? 0 : amountChargeToday, true)
					+	"</label>"
					+	"</div>"
					+	"</div>"
					+   "<div id='amountAdded' class='width_area100 mrgn_top_neg_25 txt_inv'>"
					+	"<div class='textBar' >"
					+	"<div class='totalpay_txt_head totalpay_mrgn fnt_wtn dueText'>"
					+	"<label>"
					+	messages['checkout.lbl_amount_added']
					+	"</label>"
					+	"</div>"
					+	"</div>"
					+	"<div class='labelBar fnt_wtn amountDue'>"
					+	"<label id='idOfAmountAdded' class='dynamiclab'>" 
					+	"</label>"
					+	"</div>"
					+	"</div>"
					+   "<div id='newCreditsApplied' class='width_area100 mrgn_top_neg_25 txt_inv'>"
					+	"<div class='textBar' >"
					+	"<div class='totalpay_txt_head totalpay_mrgn fnt_wtn dueText'>"
					+	"<label>"
					+	messages['checkout.lbl_new_credits']
					+	"</label>"
					+	"</div>"
					+	"</div>"
					+	"<div class='labelBar fnt_wtn amountDue'>"
					+	"<label id='idOfNewCreditsApplied' class='dynamiclab'>" 
					+	"</label>"
					+	"</div>"
					+	"</div>";
		$('#mainpaymentTotalLabels1').append(htmlText);
	}
	
}

/********************************************************************************************
' Name                 :   expandCardSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand Debit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function expandCardSection() {
	if($('#panelDEBIT').is(':visible') && !$('#addPaymentCardForm').is(':visible')){
		closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
		hideOrShowUsedCard(jsonTypeConstant.VESTADEBIT);
	}else if($('#panelCREDIT').is(':visible') && !$('#addPaymentCardForm').is(':visible')){
		closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
		hideOrShowUsedCard(jsonTypeConstant.VESTACREDIT);
	}else{
		closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
	}
}

/********************************************************************************************
' Name                 :   expandDebitCardSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand Debit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function expandDebitCardSection() {
	if (cardOptionTenderTypes) {
		hideOrShowUsedCard(cardOptionTenderTypes[0]);
		/* Checking if Pop up shown when user move from Card to Cash in case of Schedule Payment */
		if($('#mainContainId').is(':visible')){
			/* Closing the pop up */
			closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
		}
	}
}

/********************************************************************************************
' Name                 :   expandCreditCardSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand credit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function expandCreditCardSection() {
	if (cardOptionJsonTypes) {
		hideOrShowUsedCard(cardOptionJsonTypes[0]);
		/* Checking if Pop up shown when user move from Card to Cash in case of Schedule Payment */
		if($('#mainContainId').is(':visible')){
			/* Closing the pop up */
			closeAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
		}
	}
}

/********************************************************************************************
' Name                 :   hideOrShowUsedCard
' Return type          :   None
' Input Parameter(s)   :   paymentOptionSourcesJsonType
' Purpose              :   This method is used expand Debit/Credit card section and showing added 
							card's information.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function hideOrShowUsedCard(paymentOptionSourcesJsonType) {
	if(!$('#panel'+paymentOptionSourcesJsonType).is(':visible')){
		var fundingSourceTypes_JsonType="";
		if ($('#addPaymentCardForm').is(':visible') && cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0) {
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
			if (isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
				showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
			} else {
				var addCardForm = "";
				if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTADEBIT){
					$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
					$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
					addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
				} else if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTACREDIT){
					$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
					$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
					addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
				}

				$("#panel" + paymentOptionSourcesJsonType).html(addCardForm);
				$('#advertisementPaymentPage'+paymentOptionSourcesJsonType).html("<iframe src='"+messages['paymentCardForm.promo']+"' class='ads'></ifarme>");
				if(cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0) {
					calculateMonthForExpirationDate("expiryMonthPaymentCards");
					calculateYearForExpirationDate("expiryYearPaymentCards");
					setStateList("stateOfPaymentCards");
				} else if(calculateMonthAndYear(paymentOptionSourcesJsonType)) {
					calculateMonthForExpirationDate("expiryMonthPaymentCards");
					calculateYearForExpirationDate("expiryYearPaymentCards");
					setStateList("stateOfPaymentCards");
				}
				var isBoxVisible = $("#panel" + paymentOptionSourcesJsonType).is(":visible");
				if (!isBoxVisible) {
					if (switchCashToCard() && switchToCashOrCardToCard(paymentOptionSourcesJsonType)) {
						hideAllCashAndCardTypes(false);
						$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						/* Checking if forStoringLastId contains other then current JsonType. e.g. if previously user has clicked in VestaDebitVisa
						 * and now clicking on VestaCreditVisa then remove the enable icon from both. */
						if(forStoringLastId && forStoringLastId !== paymentOptionSourcesJsonType){
							$("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						}
						$("#cardButtonImageArea" + paymentOptionSourcesJsonType).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						forStoringLastId = paymentOptionSourcesJsonType;
						editCashHistoryFundRowId = null;
						showTotalPaymentAndDue();
						returnToPriorState(paymentOptionSourcesJsonType);
						/* Clear all field of old form */
						clearFieldsOfPage("addCardForm" + paymentOptionSourcesJsonType, paymentOptionSourcesJsonType);
						addOrRemoveBorderBottom();
						$("#cardButtonImageArea" + paymentOptionSourcesJsonType).toggleClass("vesta_delivered_icon");
						$("#panel" + paymentOptionSourcesJsonType).show();
						showHideSubmitPaymentButton(paymentOptionSourcesJsonType);
						var isAddCardFormVisible = $("#addCardForm" + paymentOptionSourcesJsonType).is(":visible");
						if (isAddCardFormVisible) {
							clearInterval(timeIntevalOfAddCard);
							clearInterval(timeIntevalOfCard);
							enableAddCardSaveButton(paymentOptionSourcesJsonType);
						} else {
							clearInterval(timeIntevalOfAddCard);
							clearInterval(timeIntevalOfCard);
							$("#additional_info_box").hide();
							var selectedCard = getSelectedDebitOrCreditCard(paymentOptionSourcesJsonType);
							if(selectedCard) {
								createFundingSourceForCard(paymentOptionSourcesJsonType, $('#' + selectedCard).val() * 1);
							}
						}
						refreshSummarySectionOnClickOfCard();
						updateNewCreditsArea();
					}
				} /* Working for bug #4798
		else {
			hideAllCashAndCardTypes(true);
		}*/
				checkPayButtonEnableOrNot(paymentOptionSourcesJsonType);
			}
			$('#clearOnClickBtn').unbind( "click" );
			$('#clearOnClickBtn').click(function(event){
				closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
				if( (paymentOptionSourcesJsonType === jsonTypeConstant.VESTADEBIT || paymentOptionSourcesJsonType === jsonTypeConstant.VESTACREDIT) &&
						cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0 ){
					var addCardForm = "";
					if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTADEBIT){
						$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
						$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
						addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
					} else if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTACREDIT){
						$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
						$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
						addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
					}
					$("#panel" + paymentOptionSourcesJsonType).html(addCardForm);
					$('#advertisementPaymentPage'+paymentOptionSourcesJsonType).html("<iframe src='"+messages['paymentCardForm.promo']+"' class='ads'></ifarme>");
					if(cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0) {
						calculateMonthForExpirationDate("expiryMonthPaymentCards");
						calculateYearForExpirationDate("expiryYearPaymentCards");
						setStateList("stateOfPaymentCards");
					} else if(calculateMonthAndYear(paymentOptionSourcesJsonType)) {
						calculateMonthForExpirationDate("expiryMonthPaymentCards");
						calculateYearForExpirationDate("expiryYearPaymentCards");
						setStateList("stateOfPaymentCards");
					}
				}
				var isBoxVisible = $("#panel" + paymentOptionSourcesJsonType).is(":visible");
				if (!isBoxVisible) {
					if (switchCashToCard() && switchToCashOrCardToCard(paymentOptionSourcesJsonType)) {
						hideAllCashAndCardTypes(false);
						$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						/* Checking if forStoringLastId contains other then current JsonType. e.g. if previously user has clicked in VestaDebitVisa
						 * and now clicking on VestaCreditVisa then remove the enable icon from both. */
						if(forStoringLastId && forStoringLastId !== paymentOptionSourcesJsonType){
							$("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						}
						$("#cardButtonImageArea" + paymentOptionSourcesJsonType).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
						forStoringLastId = paymentOptionSourcesJsonType;
						editCashHistoryFundRowId = null;
						showTotalPaymentAndDue();
						returnToPriorState(paymentOptionSourcesJsonType);
						/* Clear all field of old form */
						clearFieldsOfPage("addCardForm" + paymentOptionSourcesJsonType, paymentOptionSourcesJsonType);
						addOrRemoveBorderBottom();
						$("#cardButtonImageArea" + paymentOptionSourcesJsonType).toggleClass("vesta_delivered_icon");
						$("#panel" + paymentOptionSourcesJsonType).show();
						showHideSubmitPaymentButton(paymentOptionSourcesJsonType);
						var isAddCardFormVisible = $("#addCardForm" + paymentOptionSourcesJsonType).is(":visible");
						if (isAddCardFormVisible) {
							clearInterval(timeIntevalOfAddCard);
							clearInterval(timeIntevalOfCard);
							enableAddCardSaveButton(paymentOptionSourcesJsonType);
						} else {
							clearInterval(timeIntevalOfAddCard);
							clearInterval(timeIntevalOfCard);
							$("#additional_info_box").hide();
							var selectedCard = getSelectedDebitOrCreditCard(paymentOptionSourcesJsonType);
							if(selectedCard) {
								createFundingSourceForCard(paymentOptionSourcesJsonType, $('#' + selectedCard).val() * 1);
							}
						}
						refreshSummarySectionOnClickOfCard();
						updateNewCreditsArea();
					}
				} /* Working for bug #4798
		else {
			hideAllCashAndCardTypes(true);
		}*/
				//checkPayButtonEnableOrNot(paymentOptionSourcesJsonType);
			});


		}else {
			if( (paymentOptionSourcesJsonType === jsonTypeConstant.VESTADEBIT || paymentOptionSourcesJsonType === jsonTypeConstant.VESTACREDIT) &&
					cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0 ){
				var addCardForm = "";
				if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTADEBIT){
					$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
					$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
					addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
				} else if(paymentOptionSourcesJsonType === jsonTypeConstant.VESTACREDIT){
					$("#panel" + jsonTypeConstant.VESTADEBIT + " #addPaymentCardForm").remove();
					$("#panel" + jsonTypeConstant.VESTACREDIT + " #addPaymentCardForm").remove();
					addCardForm = createAddPaymentCardForm(paymentOptionSourcesJsonType, true);
				}
				$("#panel" + paymentOptionSourcesJsonType).html(addCardForm);
				$('#advertisementPaymentPage'+paymentOptionSourcesJsonType).html("<iframe src='"+messages['paymentCardForm.promo']+"' class='ads'></ifarme>");
				if(cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length <= 0) {
					calculateMonthForExpirationDate("expiryMonthPaymentCards");
					calculateYearForExpirationDate("expiryYearPaymentCards");
					setStateList("stateOfPaymentCards");
				} else if(calculateMonthAndYear(paymentOptionSourcesJsonType)) {
					calculateMonthForExpirationDate("expiryMonthPaymentCards");
					calculateYearForExpirationDate("expiryYearPaymentCards");
					setStateList("stateOfPaymentCards");
				}
			}

			var isBoxVisible = $("#panel" + paymentOptionSourcesJsonType).is(":visible");
			if (!isBoxVisible) {
				if (switchCashToCard() && switchToCashOrCardToCard(paymentOptionSourcesJsonType)) {
					hideAllCashAndCardTypes(false);
					$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					/* Checking if forStoringLastId contains other then current JsonType. e.g. if previously user has clicked in VestaDebitVisa
					 * and now clicking on VestaCreditVisa then remove the enable icon from both. */
					if(forStoringLastId && forStoringLastId !== paymentOptionSourcesJsonType){
						$("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					}
					$("#cardButtonImageArea" + paymentOptionSourcesJsonType).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					forStoringLastId = paymentOptionSourcesJsonType;
					editCashHistoryFundRowId = null;
					showTotalPaymentAndDue();
					returnToPriorState(paymentOptionSourcesJsonType);
					/* Clear all field of old form */
					clearFieldsOfPage("addCardForm" + paymentOptionSourcesJsonType, paymentOptionSourcesJsonType);
					addOrRemoveBorderBottom();
					$("#cardButtonImageArea" + paymentOptionSourcesJsonType).toggleClass("vesta_delivered_icon");
					$("#panel" + paymentOptionSourcesJsonType).show();
					showHideSubmitPaymentButton(paymentOptionSourcesJsonType);
					var isAddCardFormVisible = $("#addCardForm" + paymentOptionSourcesJsonType).is(":visible");
					if (isAddCardFormVisible) {
						clearInterval(timeIntevalOfAddCard);
						clearInterval(timeIntevalOfCard);
						enableAddCardSaveButton(paymentOptionSourcesJsonType);
					} else {
						clearInterval(timeIntevalOfAddCard);
						clearInterval(timeIntevalOfCard);
						$("#additional_info_box").hide();
						var selectedCard = getSelectedDebitOrCreditCard(paymentOptionSourcesJsonType);
						if(selectedCard) {
							createFundingSourceForCard(paymentOptionSourcesJsonType, $('#' + selectedCard).val() * 1);
						}
					}
					refreshSummarySectionOnClickOfCard();
					updateNewCreditsArea();
				}
			} /* Working for bug #4798
	else {
		hideAllCashAndCardTypes(true);
	}*/
			checkPayButtonEnableOrNot(paymentOptionSourcesJsonType);
		}
	}
}

/********************************************************************************************
' Name                 :   refreshSummarySectionOnClickOfCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand Debit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function refreshSummarySectionOnClickOfCard() {
	var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions;
	var currentDate = new Date();
	for(var index in pendingTransactions) {
		var scheduledSubmitdate1 = pendingTransactions[index].scheduledSubmitDate;
		if(!isSameDay(scheduledSubmitdate1,currentDate)) {
			createSummarySectionInCheckout();
			var promoCodeValue = $("#promoCodeDiscount3").val().trim();
			if(promoCodeValue && promoCodeValue.length > 0 && $("#checkoutApply").is(":disabled")){
				getPromoFundingSources(true);
				updatePromoSectionUI();
			}
			return;
		}
	}
}


/********************************************************************************************
' Name                 :   hideAllCashAndCardTypes
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand Debit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function hideAllCashAndCardTypes(isCardOpen) {
	hideAllCardTypes(isCardOpen);
	$("#optionsListContainer").hide();
	$("#newSelectOption").hide();
	$("#opsList").hide();
	$("#cashPaymentOptionBox1").hide();
	$("#cashPaymentOptionBox2").hide();
	$("#cashPaymentOptionBox3").hide();
	$('#completeItemsContainer').hide();
}

/********************************************************************************************
' Name                 :   hideAllCardTypes
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand Debit card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function hideAllCardTypes(isCardOpen) {
	/*Working for bug #4798
	 if(!isCardOpen) {
		 $("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("card_icon");
	}*/
	$("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
	$("#cardPaymentOptionsContainer .card_infobox").each(function() {
		$(this).hide();
	});
}

/********************************************************************************************
' Name                 :   clearFieldsOfPage
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for clearing the form fields when page loads.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function clearFieldsOfPage(elementDivId, paymentOptionSourcesJsonType) {
	$("#expiryMonthPaymentCards" + paymentOptionSourcesJsonType).val("");
	$("#expiryYearPaymentCards" + paymentOptionSourcesJsonType).val("");
	$("#stateOfPaymentCards" + paymentOptionSourcesJsonType).val("");
	/* This piece of code will clears the form when there is type = "text" */
	var $inputFields = $('#' + elementDivId + ' :input[type="text"]');
	$inputFields.each(function() {
		$(this).val('');
	});
	/* This piece of code will clears the form when there is type = "tel" */
	$inputFields = $('#' + elementDivId + ' :input[type="tel"]');
	$inputFields.each(function() {
		$(this).val('');
	});
}

/********************************************************************************************
' Name                 :   showHideSubmitPaymentButton
' Return type          :   None
' Input Parameter(s)   :   paymentOptionSourcesJsonType
' Purpose              :   Function is used for enable or disable the PAY button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function showHideSubmitPaymentButton(paymentOptionSourcesJsonType) {
	var isBoxVisible = $("#panel" + paymentOptionSourcesJsonType).is(":visible");
	if(isBoxVisible) {
		if (!parseBoolean(localStorage.getItem("registerUser"))) { /* Checking for Guest user */
	         /* Show the check box for marketing Option */
	         createOptInMsgAorBSection("chkOptInEnhAddInfo", "optInEhnChkAddInfo", messages['createAccount.optInEnh.guest']);
	         if(!isRegisterSelected) {
	        	 $("#additional_info_box").show();
	        	 if ($('#chkPromoCode').is(":checked")) {
	        		 showRegFormOFPromoCode();
	        	 }
		         validateAdditionalInfoForCards();
	         }
	         isGrtr = false;
		}
		return;
	}
}

/********************************************************************************************
' Name                 :   checkPayButtonEnableOrNot
' Return type          :   None
' Input Parameter(s)   :   paymentOptionSourcesJsonType
' Purpose              :   Function is used for enable or disable the PAY button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function checkPayButtonEnableOrNot(paymentOptionSourcesJsonType){
	var checkBoolenValue = false;
	if($('#panel' + paymentOptionSourcesJsonType).is(':visible')) {
		$('#panel' + paymentOptionSourcesJsonType + ' input:checked').each(function() {
			checkBoolenValue  = true; // "this" is the current element in the loop
		});
	}

	if(!$("#addCardForm" + paymentOptionSourcesJsonType).length && checkBoolenValue ){
		activateCheckoutPayButton();
	}
}

/********************************************************************************************
' Name                 :   switchToCashOrCardToCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used switch between either Card section to Cash section 
							or Card to Card (like Debit Card section to Credit Card section)
							and	making UI adjustment.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function switchToCashOrCardToCard(paymentOptionSourcesJsonType) {
	var visibleCard = "";
	for(var arrayIndex in cardOptionJsonTypes) {
		/* Check for card visibility in Card section */
		if ($("#panel" + cardOptionJsonTypes[arrayIndex]).is(":visible")) {
			visibleCard = cardOptionJsonTypes[arrayIndex];
			break;
		}
	}
	if($("#addPaymentCardForm").is(":visible")) {/* Check for Add Card form visibility in card section */
		if (isValueInAddCardFormFields("addPaymentCardForm")) {
			/* render pop up if there is any thing filled in add card form */
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');

			$('#clearOnClickBtn').unbind( "click" );
			$('#clearOnClickBtn').click(function(event){
				/* Close pop up on click of cancel changes  */
				closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
				if(paymentOptionSourcesJsonType === tenderTypeConstant.CASH){
					$("#additional_info_box").hide();/* If it is guest user close aditional info box */
					deActivateCheckoutPayButton();/* deactivating pay button */
					if(parseBoolean(localStorage.getItem("registerUser")) || isRegisterSelected){  /* only execute when user is registered for show when user click on cash ribbon */
						for(var index in bp_get_pending_transaction_obj.pendingTransactions) {
							if(bp_get_pending_transaction_obj.pendingTransactions[index].submitType === "SCHEDULED") { /* Then launch the Credential Error pop-up. */
								if($("#completeItemsContainer").is(":hidden")){
									/* render the pop up if there is any scheduled payments  */
									showAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
								}
								return;
							}
						}
					}
					showCashFundingSource();
				}else{
					hideAllCashAndCardTypes(false);
					$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					/* Checking if forStoringLastId contains other then current JsonType. e.g. if previously user has clicked in VestaDebitVisa
					 * and now clicking on VestaCreditVisa then remove the enable icon from both. */
					if(forStoringLastId && forStoringLastId !== paymentOptionSourcesJsonType){
						$("#cardButtonImageArea" + forStoringLastId).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					}
					$("#cardButtonImageArea" + paymentOptionSourcesJsonType).removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
					forStoringLastId = paymentOptionSourcesJsonType;
					editCashHistoryFundRowId = null;
					showTotalPaymentAndDue();
					returnToPriorState(paymentOptionSourcesJsonType);
					/* Clear all field of old form */
					clearFieldsOfPage("addCardForm" + paymentOptionSourcesJsonType, paymentOptionSourcesJsonType);
					addOrRemoveBorderBottom();
					$("#cardButtonImageArea" + paymentOptionSourcesJsonType).toggleClass("vesta_delivered_icon");
					$("#panel" + paymentOptionSourcesJsonType).show();
					showHideSubmitPaymentButton(paymentOptionSourcesJsonType);
					var isAddCardFormVisible = $("#addCardForm" + paymentOptionSourcesJsonType).is(":visible");
					if (isAddCardFormVisible) {
						clearInterval(timeIntevalOfAddCard);
						clearInterval(timeIntevalOfCard);
						enableAddCardSaveButton(paymentOptionSourcesJsonType);
					} else {
						clearInterval(timeIntevalOfAddCard);
						clearInterval(timeIntevalOfCard);
						$("#additional_info_box").hide();
						var selectedCard = getSelectedDebitOrCreditCard(paymentOptionSourcesJsonType);
						if(selectedCard) {
							createFundingSourceForCard(paymentOptionSourcesJsonType, $('#' + selectedCard).val() * 1);
						}
					}
					refreshSummarySectionOnClickOfCard();
					updateNewCreditsArea();
				
				}
			});
		}else{
			return true;
		}
	} else {
		return true;
	}
}

/********************************************************************************************
' Name                 :   isValueInAddCardFormFields
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used check is any value entered in form field or not.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function isValueInAddCardFormFields(formDivId) {
	var flag = false;
	var $inputFields = $('#' + formDivId + ' :input');
	$inputFields.each(function() {
		if ($(this).val() && $(this).val().length > 0) {
			if ($(this).val() === messages['addPaymentCardForm.monthTxt'] || $(this).val() === messages['addPaymentCardForm.yearTxt'] 
					|| $(this).attr("type") === "button"
					|| $(this).attr("type") === "checkbox") {
				/* Do nothing and continue to check */ 
			} else {
				flag = true;
				/* To break the jQuery each loop return false. return true acts as continue in java */
				return false;
			}
		}
	});
	return flag;
}

/********************************************************************************************
' Name                 :   switchCashToCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used switch between Cash To Card (either Debit/Credit).
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function switchCashToCard() {
	var pinLength = "";
	var amountLength = "";
	var isVisible = false;
	var pin = "";
	var amount = "";
	var visibleJsonType = getVisibleCashFundingSource();
	
	/* Check if any data is added into the list */
	if (jsonTypeConstant.PRECASH == visibleJsonType) {
		isVisible = $("#cashPaymentOptionBox1").is(":visible");
		var $inputFields = $('#' + 'pinSectionPreCash' + ' :input');
		$inputFields.each(function() {
			pin = pin + $(this).val();
		});
		pinLength = pin.length;
		amount = getFormatedNumber($("#" + 'amountOfCashEvolve').val(), false);
		amountLength = amount.length;
	} else if (jsonTypeConstant.BLACKHAWK == visibleJsonType) {
		isVisible = $("#cashPaymentOptionBox2").is(":visible");
		var $inputFields = $('#pinSectionBlackhawk' + ' :input');
		$inputFields.each(function() {
			pin = pin + $(this).val();
		});
		pinLength = pin.length;
		amount = getFormatedNumber($("#" + 'amountOfCashReloadit').val(), false);
		amountLength = amount.length;
	} else if (jsonTypeConstant.INCOMM == visibleJsonType) {
		isVisible = $("#cashPaymentOptionBox3").is(":visible");
		var $inputFields = $('#' + 'pinSectionInComm' + ' :input');
		$inputFields.each(function() {
			pin = pin + $(this).val();
		});
		pinLength = pin.length;
		amount = getFormatedNumber($("#" + 'amountOfCashVanilla').val(), false);
		amountLength = amount.length;
	}
	if ($("#historyFundingSources #historyFundRowAmount").length > 0
			|| (isVisible && (pinLength > 0 || amountLength > 0))) {
		if (confirm(messages["checkout.msg_payment_not_saved"])) {
			$("#cashDataMainContainer #pinOfCash").val("");
			$("#cashDataMainContainer #amountOfCash").val("");
			$("#historyFundingSources").empty();
			$("#cashSummaryTotalAmount").text("0.00");
			$("#cashPaymentOptionBox1").hide();
			$("#cashPaymentOptionBox2").hide();
			$("#cashPaymentOptionBox3").hide();
			$("#cashSummaryTotalArea").hide();
			deActivateCheckoutPayButton();/* Disable submit button. */
			showTotalPaymentAndDue(); /* Disable the guest user more info and create account box */
		} else {
			return false;
		}
	}
	$("#cashPaymnetInfoMessage").hide();
	$("#opsList").hide();
	$("#optionsListContainer").hide();
	$("#newSelectOption").hide();
	addOrRemoveBorderBottom();
	clearFormField("additional_info_box");
	if(!isRegisterSelected) {
		clearFormField("createAccountBoxChkOut");
	}
	$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
	return true;
}

/********************************************************************************************
' Name                 :   expandCashSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand cash section when switching between 
							Card(Debit/Credit) To Cash.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function expandCashSection() {
	if (!$("#completeItemsContainer").is(":visible")) {/* check if the container is hidden */
		if (!parseBoolean(localStorage.getItem("registerUser"))) { /* Checking for Guest user */
			$("#additional_info_box").hide();/* Hide aditional info box if it is guest user */
		}
		if(switchToCashOrCardToCard(tenderTypeConstant.CASH)) {/* If returns true then execute below script*/
			deActivateCheckoutPayButton();/* Deactivate pay button */
			if(parseBoolean(localStorage.getItem("registerUser")) || isRegisterSelected) {  /* only execute when user is registered for show when user click on cash ribbon */
				for(var index in bp_get_pending_transaction_obj.pendingTransactions) {
					if(bp_get_pending_transaction_obj.pendingTransactions[index].submitType === "SCHEDULED") { /* Then launch the Credential Error pop-up. */
						if($("#completeItemsContainer").is(":hidden")) {
							/* Render pop up if there is any scheduled payments*/
							showAnimatedPopup('idOfDebitCardPopUpError','mainContainId');
						}
						return;
					}
				}
			}
			showCashFundingSource();
		}
	} 
}

/********************************************************************************************
' Name                 :   returnToPriorState
' Return type          :   None
' Input Parameter(s)   :   String cardPaymentBoxId
' Purpose              :   This method is used to hide the all open section and show only 
                           manage card section when user hide the credit or debit card section 
                           and again click for show the sction.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   4th Oct, 2013     -   Ravi Raj
'*******************************************************************************************/
function returnToPriorState(cardPaymentBoxId){
	if(cm_get_payment_card_obj.paymentCards && cm_get_payment_card_obj.paymentCards.length > 0){
		$('#addCardFormSection' + cardPaymentBoxId).hide();
		$("#listOfPaymentCard" + cardPaymentBoxId).show();
		$('#buttonSection' + cardPaymentBoxId).show();
	}else{
		$('#addCardFormSection' + cardPaymentBoxId).show();
		$("#listOfPaymentCard" + cardPaymentBoxId).hide();
		$('#buttonSection' + cardPaymentBoxId).hide();
		$('#cvvForDefaultCard' + cardPaymentBoxId).val("");
	}
}

/********************************************************************************************
' Name                 :   activateCheckoutPayButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to activate both the Pay buttons in Add Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function activateCheckoutPayButton() {
	submitBtnEnableUI('btnContinueChkOut');
	submitBtnEnableUI('btnBigContinueChkOut');
}

/********************************************************************************************
' Name                 :   activateMainPaymentPageNextButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to activate both the Next buttons in Main Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function activateMainPaymentPageNextButton() {
	enableButton("nextBtnOfMainPage");
	enableButton("nextBtnOfMainPageBtm");
}

/********************************************************************************************
' Name                 :   deActivateMainPaymentPageNextButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to deactivate both the Next buttons in Main Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function deActivateMainPaymentPageNextButton() {
	disableButton("nextBtnOfMainPage");
	disableButton("nextBtnOfMainPageBtm");
}

/********************************************************************************************
' Name                 :   activateAddBillPageSaveButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to activate both the Save buttons in Add Bill Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function activateAddBillPageSaveButton() {
	submitBtnEnableUI('btnContinue');
	submitBtnEnableUI("btnContinueBtm");
}

/********************************************************************************************
' Name                 :   deActivateAddBillPageSaveButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to deactivate both the Save buttons in Add Bill Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function deActivateAddBillPageSaveButton() {
	submitBtnDisableUI("btnContinue");
	submitBtnDisableUI("btnContinueBtm");
}

/********************************************************************************************
' Name                 :   activateAuxilaryPageSaveButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to activate both the Save buttons in Auxilary Bill page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function activateAuxilaryPageSaveButton() {
	submitBtnEnableUI('btnSaveAuxiliaryList');
	submitBtnEnableUI("btnSaveAuxiliaryListBtm");
}

/********************************************************************************************
' Name                 :   deActivateAuxilaryPageSaveButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to deactivate both the Save buttons in Auxilary Bill page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function deActivateAuxilaryPageSaveButton() {
	submitBtnDisableUI("btnSaveAuxiliaryList");
	submitBtnDisableUI("btnSaveAuxiliaryListBTM");
}

/********************************************************************************************
' Name                 :   activateSaveButtonInAddCard
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to activate both the Pay buttons in Add Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function activateSaveButtonInAddCard() {
	submitBtnEnableUI('saveBtnIdForAddCardForm');
}

/********************************************************************************************
' Name                 :   deActivateSaveButtonInAddCard
' Return type          :   None
' Input Parameter(s)   :   String cardPaymentBoxId
' Purpose              :   This method is used to deactivate both the Pay buttons in Add Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function deActivateSaveButtonInAddCard() {
	submitBtnDisableUI('saveBtnIdForAddCardForm');
}

/********************************************************************************************
' Name                 :   inActivateCheckoutPayButton
' Return type          :   None
' Input Parameter(s)   :   String cardPaymentBoxId
' Purpose              :   This method is used to deactivate both the Pay buttons in Add Payment Page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18 Jun, 2014     -   Ravi Raj
'*******************************************************************************************/
function deActivateCheckoutPayButton() {
	submitBtnDisableUI('btnContinueChkOut');
	submitBtnDisableUI('btnBigContinueChkOut');
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
function handleBpVerifyPromoCode(applyClicked) {
    showProgressBar(); /* To show the progress bar */
    var request = {};
    request.userId = eval(getCookie("userId"));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.promoCode = getPromoFundingSources(applyClicked);

	var call_bp_validate_promo_code = new bp_validate_promo_code(request,applyClicked);
	call_bp_validate_promo_code.call();
}


/********************************************************************************************
' Name                 :   handleBpValidatePromoCode
' Return type          :   None
' Input Parameter(s)   :   applyClicked
' Purpose              :   This method is to handle the success response of 
							BP_VERIFY_FUNDING_SOURCE_3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function handleBpValidatePromoCode(applyClicked){
	if(applyClicked) {
		updatePromoSectionUI();
		this.applyClicked = undefined;
	}
	updateSummarySectionUI();
}

/********************************************************************************************
' Name                 :   getVisibleAddCardFormFundingSource
' Return type          :   fundingSource
' Input Parameter(s)   :   None
' Purpose              :   This method is get funding source for add card form.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getVisibleAddCardFormFundingSource(){
	if($("#addCardFormDEBIT").is(":visible")){
		return "DEBIT";
	}else if($("#addCardFormCREDIT").is(":visible")){
		return "CREDIT";
	}
}


/********************************************************************************************
' Name                 :   getPromoFundingSources
' Return type          :   Boolean
' Input Parameter(s)   :   None
' Purpose              :   This method is used to get the promo funding source.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function getPromoFundingSources(applyClicked) {
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	var lastPromoCode = $('#' + visiblePromoCodeInputId).val().trim();
	var paymentOptionTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	for (var index = 0; index < paymentOptionTypes.length; index++) {
		var fundingSourceType = paymentOptionTypes[index].jsonType.trim();
		/* Checking for fundingSource jsonType for Promo type */
		if(fundingSourceType === "PromoCredit"){
			if(lastPromoCode) {
				return lastPromoCode;
				break;
			}
		}
	}
	
	return null;
}
