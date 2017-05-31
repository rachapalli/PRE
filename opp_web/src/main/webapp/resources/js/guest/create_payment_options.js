var editCashHistoryFundRowId = null;
var displayFeeAsFree = false;
var typeOfPaymentCard;
var chkPromoCodeRegisterBtnCount;
var validationTracking = UNVALIDATED; 
var counter=0;
var verifiedFundingSource="";
var chkRegisterBtnCount;

/********************************************************************************************
' Name                 :   createPaymentOptions
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to reset the entire CASH payment section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function createPaymentOptions() {
	editCashHistoryFundRowId = null;
	resetCashSection();
	showTotalPaymentAndDue(); /* Disable the guest user more info and create account box */
	var paymentOptionTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	var cashPaymentOptions = new Array();
	for(var paymentOptionIndex in paymentOptionTypes) {
		var paymentOptionType = paymentOptionTypes[paymentOptionIndex];
		var paymentOptionSourcesJsonType = paymentOptionType.jsonType;
		var paymentOptionTenderType = paymentOptionType.tenderType;
		if(paymentOptionSourcesJsonType === jsonTypeConstant.PROMOCREDIT){
			if(parseBoolean(localStorage.getItem("registerUser"))) {
				var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
				$("#" + visiblePromoCodeInputId).val("");
				$("#promoCodeSection").show();
			} else {
				$("#discountAndPromoCodeReg").show();
				$("#promoCodeBox").show();
			}
			$("#errorPromoCodeRes").hide();
			$("#summuryPromoCode").hide();
			$('#checkoutPromoCodeAmount').hide();
			var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
			$("#" + visiblePromoCodeInputId).removeClass("error_red_border");
			submitBtnEnableUI('checkoutApply');
			validationTracking = UNVALIDATED;
			lastPromoCode = "";
			registerEventsForPromoCode();
		}
		/* if payment method is cash (create cash options) else create card option */
		if (paymentOptionTenderType && paymentOptionTenderType.toUpperCase() === tenderTypeConstant.CASH) {
			cashPaymentOptions.push(paymentOptionType);
		}
	}
	if (cashPaymentOptions.length > 0) {
		$("#checkoutCreditsCoverAllAmountDue").hide();
		$("#cardPaymentOptionsContainer").show();
		$("#cashDataMainContainer").show(); /* Show CASH ribbon on screen */
		createCashPaymentOption(cashPaymentOptions.sort(sortByFundingSourceType));
	}
	expandSingleFundingSource();
	
}

/********************************************************************************************
' Name                 :   resetCashSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to reset the entire CASH payment section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function resetCashSection() {
	$("#historyFundingSources").empty();
	$("#historyFundingSources").hide();
	$("#opsList").empty();
	$("#opsList").hide();
	$("#optionsListContainer").hide();
	$("#newSelectOption").hide();
	$("#cashSummaryTotalArea").hide();
	$("#cashButtonImageArea").removeClass("fa fa-check fa-2x vesta_delivered_icon").addClass("fa fa-check fa-2x card_icon");
	$("#cashPaymnetInfoMessage").hide();
	$("#cashSummaryTotalAmount").text("0.00");
	clearInterval(timeIntevalOfAddCard);
	clearInterval(timeIntevalOfCard);
	deActivateCheckoutPayButton();
	addOrRemoveBorderBottom();
	clearFormField("additional_info_box");
}

/********************************************************************************************
' Name                 :   addOrRemoveBorderBottom
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to add or remove bottom border below Cash Summary section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Karuna Mishra
'*******************************************************************************************/
function addOrRemoveBorderBottom() {
	if (($("#cashSummaryTotalArea").is(":visible") && $("#newSelectOption").is(":visible")) 
			|| ($("#cashSummaryTotalArea").is(":visible") && $("#cashPaymnetInfoMessage").is(":visible"))) {
		$("#cashSummaryTotalArea").css('border-bottom', 'solid 1px #ababab');
	} else {
		$("#cashSummaryTotalArea").css('border-bottom', 'none');
	}
	if ($("#cashSummaryTotalArea").is(":visible")
			|| $("#cashPaymnetInfoMessage").is(":visible")
			|| $("#optionsListContainer").is(":visible")
			|| $("#cashPaymentOptionBox").is(":visible")) {
		addBorderBottom();
		return;
	}
	removeBorderBottom();
}

/********************************************************************************************
' Name                 :   addBorderBottom
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to add bottom border below CompleteItemsContainer.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Karuna Mishra
'*******************************************************************************************/
function addBorderBottom() {
	$("#completeItemsContainer").css('border-bottom', 'solid 1px #000');
}

/********************************************************************************************
' Name                 :   removeBorderBottom
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to remove bottom border below CompleteItemsContainer.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Karuna Mishra
'*******************************************************************************************/
function removeBorderBottom() {
	$("#completeItemsContainer").hide();
	$("#completeItemsContainer").css('border-bottom', 'none');
}

/********************************************************************************************
' Name                 :   createCashPaymentOption
' Return type          :   None
' Input Parameter(s)   :   cashPaymentOptionsArray
' Purpose              :   This method is to create the various Cash funding sources as 
							Cash payment option.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function createCashPaymentOption(cashPaymentOptionsArray) {
	$("#cashInfoTxt").show();
	$("#helpCash").show();
	var cashPaymentOptionsList = "";
	for (var paymentOptionIndex in cashPaymentOptionsArray) {
		var paymentOptionSource = cashPaymentOptionsArray[paymentOptionIndex];
		var paymentOptionSourcesMsg = paymentOptionSource.description;
		var paymentOptionSourcesJsonType = paymentOptionSource.jsonType;
		var imageURL = formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(paymentOptionSourcesJsonType));
		cashPaymentOptionsList += "<li id='cashPmtOption" + paymentOptionSourcesJsonType
								+ "' onclick=\"createSelectedCashOptionSubsection('" + paymentOptionSourcesJsonType + "')\">" 
								+	"<div id='cashPmtOptionIcon" + paymentOptionSourcesJsonType	+ "' class='vesta_img_area'><img src='" 
								+ 		imageURL + "' /></div> " 
								+ paymentOptionSourcesMsg 
								+ "  </li>";
	}
	$("#opsList").append(cashPaymentOptionsList);
}

/********************************************************************************************
' Name                 :   slideCashSelect
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to used to open the "Select Method" drop down for CASH.
							It is being call from click of optionsListContainer div.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function slideCashSelect() {
	$("#opsList").slideToggle("fast");
}

/********************************************************************************************
' Name                 :   expandSingleFundingSource
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used expand the single funding source on load of 
							checkout page.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function expandSingleFundingSource() {
	var fundingSourceArray = getAllFundingSource();
	if (fundingSourceArray.length === 1) { /* Only have one funding source */
		var fundingSourceType = fundingSourceArray[0].toUpperCase();
		if (fundingSourceType == tenderTypeConstant.CASH) {
			showCashFundingSource();
		} else if (fundingSourceType == tenderTypeConstant.DEBIT) {
			expandDebitCardSection();
		} else if (fundingSourceType == tenderTypeConstant.CREDIT) {
			expandCreditCardSection();
		} else {
			alert("Single Funding source with ( " + fundingSourceType
					+ " ) type not configured to expand { " + fundingSourceType
					+ " } section ");
		}
	}
}

/********************************************************************************************
' Name                 :   createSelectedCashOptionSubsection
' Return type          :   None
' Input Parameter(s)   :   jsonType
' Purpose              :   Function is used create the CASH funding source data entry form 
							(PIN and Amount) respective to json type (Blackhawk/PreCash/Incomm).
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function createSelectedCashOptionSubsection(jsonType) {
	$("#optionsListContainer").hide();
	$("#cashInfoTxt").hide();
	$("#helpCash").hide();
	jsonType = jsonType.trim();
	if (jsonTypeConstant.PRECASH == jsonType) {
		$("#cashPaymentOptionBox1").show();
		$("#cashPaymentOptionBox1 #cashSelectedFundingSourceImage")
				.attr("src", formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(jsonType)));
		clearFieldsOnBack('pinSectionPreCash', 'amountOfCashEvolve', 'blueBoxCnt1');
		$("#pinOfCashEvolve1").val(messages["checkout.Precash.FirstBox"]);
	} else if (jsonTypeConstant.BLACKHAWK === jsonType) {
		$("#cashPaymentOptionBox2").show();
		$("#cashPaymentOptionBox2 #cashSelectedFundingSourceImage")
				.attr("src", formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(jsonType)));
		clearFieldsOnBack('pinSectionBlackhawk', 'amountOfCashReloadit', 'blueBoxCnt2');
	} else if (jsonTypeConstant.INCOMM == jsonType) {
		$("#cashPaymentOptionBox3").show();
		$("#cashPaymentOptionBox3 #cashSelectedFundingSourceImage")
				.attr("src", formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(jsonType)));
		clearFieldsOnBack('pinSectionVanilla', 'amountOfCashVanilla', 'blueBoxCnt3');
	}
	$("#newSelectOption").hide();
	$("#opsList").hide();
	$("#optionsListContainer").hide();
	$("#historyFundingSources").hide();
	$("#cashSummaryTotalArea").hide();
	runTimerEnableSaveButton();
}

/********************************************************************************************
' Name                 :   clearFieldsOnBack
' Return type          :   None
' Input Parameter(s)   :   pinSection, cashSection, errDiv
' Purpose              :   This method is used for clearing the pin and amount fileds.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   03 December 2013   -   Karuna Mishra
'*******************************************************************************************/
function clearFieldsOnBack(pinSection, cashSection, errDiv) {
	var $inputFields = $('#' + pinSection + ' :input');
	$inputFields.each(function() {
		$(this).val('');
	});
	$("#" + cashSection).val('');
	$("#" + cashSection).removeClass("error_red_border");
	$("#" + pinSection).removeClass("error_red_border");
	$("#" + errDiv).hide();
}

/********************************************************************************************
' Name                 :   backFromSelectedFundingSource
' Return type          :   None
' Input Parameter(s)   :   id
' Purpose              :   This method is used to move back from any Cash Funding Source using 
							Back button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   03 December 2013   -   Karuna Mishra
'*******************************************************************************************/
function backFromSelectedFundingSource(id) {
	var cashFundingSourcesTotalAmount = getFormatedNumber(calculateCashSummaryTotalAmount(), false);
	if (cashFundingSourcesTotalAmount > 0) {
		$("#cashSummaryTotalArea").show();
		$("#cashInfoTxt").hide();
		$("#helpCash").hide();
	} else {
		$("#cashInfoTxt").show();
		$("#helpCash").show();
	}
	editCashHistoryFundRowId = null;
	$("#cashPaymentOptionBox" + id).hide();
	$("#optionsListContainer").show();
	$("#newSelectOption").show();
	$("#opsList").hide();
	$("#historyFundingSources").show(); /* Show history section */
	showHideAllDeleteButtonOfCash(false); /* Enable all delete buttons */
	callVerifyFundingSourceAPI();
	addOrRemoveBorderBottom();
}

/********************************************************************************************
' Name                 :   showHideAllDeleteButtonOfCash
' Return type          :   None
' Input Parameter(s)   :   isShowDeleteIcon
' Purpose              :   This method is used to move back from any Cash Funding Source using 
							Back button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   03 December 2013   -   Karuna Mishra
'*******************************************************************************************/
function showHideAllDeleteButtonOfCash(isShowDeleteIcon) {
	$("#historyFundingSources .delete_icon").each(function() {
		if (isShowDeleteIcon) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
}

/********************************************************************************************
' Name                 :   callVerifyFundingSourceAPI
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to check whether BP_VERIFY_FUNDING_SOURCE3_2 API
							can be called or not on the basis of added amount.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   03 December 2013   -   Karuna Mishra
'*******************************************************************************************/
function callVerifyFundingSourceAPI() {
	$("#optionsListContainer").show();
	var checkoutTotalDueAmount = getFormatedNumber($("#amountDueTotal").text(), false);
	var cashFundingSourcesTotalAmount = getFormatedNumber(calculateCashSummaryTotalAmount(), false);
	/* total fund amount is greater than or same as due amount */ 
	if (cashFundingSourcesTotalAmount >= checkoutTotalDueAmount && $("#checkoutApply").is(":enabled")) {
		$("#historyFundingSources").hide(); /* Hide all history funds */
		$("#editCashSummaryTotal").show(); /* Show edit icon with total amount */
		$("#cashPaymnetInfoMessage").show(); /* Show info text message below the total amount area. */
		$("#newSelectOption").hide();
		$("#optionsListContainer").hide();
		/* Create funding sources to call funding sources API. 
		 * The false means Promo code section apply button is not clicked to invoke the API call.*/
		handleBpVerifyFundingSource(false);
	} else if(cashFundingSourcesTotalAmount >= checkoutTotalDueAmount && $("#checkoutApply").is(":disabled")){
		$("#historyFundingSources").hide(); /* Hide all history funds */
		$("#editCashSummaryTotal").show(); /* Show edit icon with total amount */
		$("#cashPaymnetInfoMessage").show(); /* Show info text message below the total amount area. */
		if(checkoutTotalDueAmount){
			$("#newSelectOption").hide();
			$("#optionsListContainer").hide();
		} else {
			$("#newSelectOption").show();
			$("#optionsListContainer").show();
		}
		/* Create funding sources to call funding sources API. 
		 * The false means Promo code section apply button is not clicked to invoke the API call.*/
		handleBpVerifyFundingSource(false);
	}  else {
		$("#editCashSummaryTotal").hide(); /* Hide edit icon with total amount */
		$("#newSelectOption").show();
		$("#opsList").hide();
		removeChitErrorBorder();
		deActivateCheckoutPayButton();/* Disable submit button. */
		showTotalPaymentAndDue(); /* Disable the guest user more info and create account box */
	}
}

function removeChitErrorBorder() {
	$('#cashDataMainContainer .error_red_border1').each(function() {
			$(".error_red_border1").removeClass("error_red_border1");
	});
}

/********************************************************************************************
' Name                 :   saveSelectedFundingSource
' Return type          :   None
' Input Parameter(s)   :   pinSection, cashDivId, boxId, applyClicked
' Purpose              :   This method is used to save the Pin and Amount entered and check for 
							call of BP_VERIFY_FUNDING_SOURCE3_2 API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   03 December 2013   -   Karuna Mishra
'*******************************************************************************************/
function saveSelectedFundingSource(pinSection, cashDivId, cashPaymentOptionBox, applyClicked) {
	var pin = "";
	if(pinSection) {
		var $inputFields = $('#' + pinSection + ' :input');/* what ever the pin user enters iterating them to get */
		$inputFields.each(function() {
			pin += $(this).val();/* Each pin entry adding to this pin variable */
		});
	}
	var fundingSourceType = getVisibleCashFundingSource();
	var amount = "";
	if(cashDivId) {/* From the cash 'Div' fetching the amount and formatting it */
		amount = getFormatedNumber($("#" + cashDivId).val(), false);
	}
	if (editCashHistoryFundRowId) { /* Checking if any Cash funding source is edited */
		showHideAllDeleteButtonOfCash(false); /* Disable or hide all delete buttons. */
		$("#" + editCashHistoryFundRowId + " #historyFundRowPin").text(formatPinAsPerFundingSource(fundingSourceType, pin));
		$("#" + editCashHistoryFundRowId + " #historyFundRowAmount").text(getFormatedNumber(amount, true));
		//$("#" + editCashHistoryFundRowId + " #apiFundError_redBorder").removeClass("error_red_border1");
		removeChitErrorBorder();
		editCashHistoryFundRowId = null;
		$("#historyFundingSources").show(); /* Show history section */
	} else if(fundingSourceType && pin && amount){
		$("#historyFundingSources").append(
				createNewRowForHistoryFund(fundingSourceType, pin, amount)); /* Save the selected funding source */
	}
	if(fundingSourceType && !applyClicked) {
		$("#historyFundingSources").show();
		/* Update the cash summary total amount and show it */
		$("#cashSummaryTotalAmount").text(getFormatedNumber(calculateCashSummaryTotalAmount(), true));
		$("#cashSummaryTotalArea").show();
	}
	/* Hide the form to enter the Cash funding details with Pin and Amount */
	$("#" + cashPaymentOptionBox).hide();
	
	var checkoutTotalDueAmount = getFormatedNumber($("#amountDueTotal").text(), false);
	var cashFundingSourcesTotalAmount = getFormatedNumber(calculateCashSummaryTotalAmount(), false);
	/* Checking if total fund amount is greater than or same as due amount */ 
	if (cashFundingSourcesTotalAmount >= checkoutTotalDueAmount) {
		$("#historyFundingSources").hide(); /* Hide all history funds */
		$("#editCashSummaryTotal").show(); /* Show edit iocn with total amount */
		$("#cashPaymnetInfoMessage").show(); /* Show info text message below the edit icon. */
		/* Show info text below the total amount area. Call funding sources api.
		 * The false means Promo code section apply button is not clicked to invoke the API call.*/
		if(!applyClicked){
			handleBpVerifyFundingSource(false);
		}
	} else {
		updateNewCreditsArea(); /* To update the new credit section whenever summary section updates.*/
		$("#editCashSummaryTotal").hide(); /* Hide edit icon of total amount */
		if(!applyClicked){
			$("#newSelectOption").show();
			$("#optionsListContainer").show();
			$("#opsList").hide();
		}
		deActivateCheckoutPayButton();/* Disable submit button. */
		showTotalPaymentAndDue(); /* Disable the guest user more info and create account box */
	}
	if(!applyClicked){
		addOrRemoveBorderBottom();
	}
	/* Clearing the Pin entered into form fields */
	var $inputFieldsOfSave = $('#' + pinSection + ' :input');
	$inputFieldsOfSave.each(function() {
		$(this).val('');
	});
	/* Clearing the Amount entered into form fields */
	$("#" + cashDivId).val('');
	
	var totalvalue = getFormatedNumber($('#cashSummaryTotalAmount').html(), false);
	var amountDue = getFormatedNumber($('#amountDueTotal').text(), false);
	if(totalvalue >= amountDue  && totalvalue && parseBoolean(localStorage.getItem("registerUser"))){
		$("#optionsListContainer").hide();
		activateCheckoutPayButton();
	} else {
		deActivateCheckoutPayButton();
	}
	clearIntervalApp(timerEnableSaveButton);
}

/********************************************************************************************
' Name                 :   formatPinAsPerFundingSource
' Return type          :   None
' Input Parameter(s)   :   fundingSourceType, pin
' Purpose              :   Function is used format the Pin UI as per Funding source.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function formatPinAsPerFundingSource(fundingSourceType, pin) {
	if (jsonTypeConstant.BLACKHAWK == fundingSourceType) {
		return pin;
	} else if (jsonTypeConstant.PRECASH == fundingSourceType) {
		return pin.substring(0, 4) + " " + pin.substring(4, 8) + " " + pin.substring(8, 12) + " " + pin.substring(12, 16);
	} else if (jsonTypeConstant.INCOMM == fundingSourceType) {
		return pin.substring(0, 3) + " " + pin.substring(3, 6) + " " + pin.substring(6, 10);
	}
	return pin;
}

/********************************************************************************************
' Name                 :   createNewRowForHistoryFund
' Return type          :   None
' Input Parameter(s)   :   fundingSourceType, pin, amount
' Purpose              :   Function is used create a new row when new Cash funding source is added. 
							type (Blackhawk/PreCash/Incomm).
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function createNewRowForHistoryFund(fundingSourceType, pin, amount) {
	pin = formatPinAsPerFundingSource(fundingSourceType, pin);
	var uId = generateUUID();
	var imageURL = formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(fundingSourceType));
	/* Create the new html div and add the selected funding source to history */
	var historyFundRow = '<div class="vesta_summary_cashsec" id="history'
			+ uId
			+ '" >'
			+ '<div class="vesta_wd25 vesta_mrgntop8 mob_vesta_mrgn_null mob_vesta_wd100">'
			+ '<div class="vesta_img_area"> <img src="'
			+ imageURL
			+ '" /> <span id="historyFundRowFundingType" class="txt_inv"> '
			+ fundingSourceType
			+ ' </span> &nbsp;</div>'
			+ '</div>'
			+ '<div id="apiFundError_redBorder" class="vesta_wd50 vesta_mrgntop8 mob_vesta_mrgn_null mob_vesta_wd65">'
			+ '<div class="vesta_wd70 mob_vesta_wd100">'
			+ messages["checkout.lbl_number"]
			+ ' <span id="historyFundRowPin">'
			+ pin
			+ '</span> </div>'
			+ '<div class="vesta_wd30 mob_vesta_wd100 txt_nwrght mob_txt_lft" id="historyFundRowAmount">'
			+ '<span class="disp_show_hide">'
			+ messages["checkout.lbl_Amount"]
			+ '</span>'
			+ " "
			+ getFormatedNumber(amount, true)
			+ '</div>'
			+ '</div>'
			+ '<div class="vesta_wd15 flt_rght mrgn_lft mob_vesta_wd30">'
			+ '<span class="edit_icon tooltip" title=' + messages['editBill.editButtonMsg'] + ' onclick="editSelectedFundRow(\'history'
			+ uId
			+ '\');" ><i class="fa fa-pencil fa-2x"></i></span>'
			+ '<span class="delete_icon tooltip" title=' + messages['addPaymentCardForm.deleteTxt'] + ' onclick="deleteSelectedFundRow(\'history'
			+ uId + '\');"><i class="fa fa-trash-o fa-2x"></i></span>' + '</div>' + '</div>';
	return historyFundRow;
}

/********************************************************************************************
' Name                 :   getVisibleCashFundingSource
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used get the visible cash funding source as per json 
							type (Blackhawk/PreCash/Incomm).
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function getVisibleCashFundingSource() {
	/* Getting fundingSourceTypes from local storage which comes in INIT_APP API call */
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	/* This code segment is used to draw the row for card on the basis of funding source. */
	for(var fundingSourceTypesIndex in fundingSourceTypes) {
		/* Getting single fundingSourceTypeObj from fundingSourceTypes array */
		var fundingSourceTypeObj = fundingSourceTypes[fundingSourceTypesIndex];
		if ($("#pinSection" + fundingSourceTypeObj.jsonType).is(":visible")) {
			return fundingSourceTypeObj.jsonType;
		}
	}
	return null;
}

/********************************************************************************************
' Name                 :   calculateCashSummaryTotalAmount
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to calculate the Sumary Total as per amount entered.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function calculateCashSummaryTotalAmount() {
	var cashSummaryTotalAmount = 0;
	$("#historyFundingSources #historyFundRowAmount").each(function() {
		cashSummaryTotalAmount += getFormatedNumber($(this).text(), false);
	});
	if (cashSummaryTotalAmount == 0) {
		$("#cashSummaryTotalArea").hide();
	}
	return cashSummaryTotalAmount;
}

/********************************************************************************************
' Name                 :   deleteSelectedFundRow
' Return type          :   None
' Input Parameter(s)   :   uniqueRowId
' Purpose              :   Function is used to delete teh selected funding row from added Cash history section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function deleteSelectedFundRow(uniqueRowId) {
	if (confirm(messages["checkout.validation.deleteConfirm"])) {
		$("#" + uniqueRowId).remove();
		$("#cashSummaryTotalAmount").text(getFormatedNumber(calculateCashSummaryTotalAmount(true), true));
		if (calculateCashSummaryTotalAmount() <= 0) {
			updateNewCreditsArea();
			$("#cashInfoTxt").show();
			$("#helpCash").show();
		}
		callVerifyFundingSourceAPI();
	}
}

/********************************************************************************************
' Name                 :   openCashSummaryForEditAmount
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to open the added Cash History section and removing 
							the Cash Summary Amount section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   24 October 2013    -   Karuna Mishra
'*******************************************************************************************/
function openCashSummaryForEditAmount() {
	/* Show History Funds without select a type Option */
	$("#historyFundingSources").show();
	removeChitErrorBorder();
	$("#editCashSummaryTotal").hide();
	$("#cashPaymnetInfoMessage").hide();
	addOrRemoveBorderBottom();
}

/********************************************************************************************
' Name                 :   editSelectedFundRow
' Return type          :   None
' Input Parameter(s)   :   uniqueRowId
' Purpose              :   Function is used to edit the already added amount.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28 Nov 2013    -   Karuna Mishra
'*******************************************************************************************/
function editSelectedFundRow(uniqueRowId) {
	var fundingType = $("#" + uniqueRowId + " #historyFundRowFundingType").text();
	var pinNumber = $("#" + uniqueRowId + " #historyFundRowPin").text().trim();
	var amount = getFormatedNumber($("#" + uniqueRowId + " #historyFundRowAmount").text(), false);
	editCashHistoryFundRowId = uniqueRowId;
	$("#optionsListContainer").hide(); 	/* Hide select type */
	$("#cashInfoTxt").hide();
	$("#helpCash").hide();
	showHideAllDeleteButtonOfCash(true); /* Disable all delete buttons */
	var fundingSourceType = fundingType.replace(/[\s]/g, '');
	pinNumber = pinNumber.replace(/[\s]/g, '');
	setPinNumberInFieldsOnEdit(pinNumber, amount, fundingSourceType);
	if(jsonTypeConstant.PRECASH === fundingSourceType) {
		$("#cashPaymentOptionBox1 #cashSelectedFundingSourceImage").attr("src",
				formatMessage(messages["checkout.image_fundingSource_URL"],	getImageNameByJsonType(fundingType)));
		$("#cashPaymentOptionBox1").show();
	} else if(jsonTypeConstant.BLACKHAWK == fundingSourceType) {
		$("#cashPaymentOptionBox2 #cashSelectedFundingSourceImage").attr("src",
				formatMessage(messages["checkout.image_fundingSource_URL"], getImageNameByJsonType(fundingType)));
		$("#cashPaymentOptionBox2").show();
	} else if(jsonTypeConstant.INCOMM == fundingSourceType) {
		$("#cashPaymentOptionBox3 #cashSelectedFundingSourceImage").attr("src",
				formatMessage(messages["checkout.image_fundingSource_URL"],	getImageNameByJsonType(fundingType)));
		$("#cashPaymentOptionBox3").show();
	}
	$("#historyFundingSources").hide(); /* Hide history section */
	$("#cashSummaryTotalArea").hide();
	clearIntervalApp(submitBtnCreateProfCountdown);
	clearIntervalApp(submitBtnAddInfoCountdown);
	deActivateCheckoutPayButton();/* Disable submit button */
}

/********************************************************************************************
' Name                 :   setPinNumberInFieldsOnEdit
' Return type          :   None
' Input Parameter(s)   :   pin, amount, fundingType
' Purpose              :   Function is used to put the pin number in Pin number fields as per 
							there funding source type.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   02 Dec 2013    	-   Karuna Mishra
'*******************************************************************************************/
function setPinNumberInFieldsOnEdit(pin, amount, fundingType) {
	if(jsonTypeConstant.BLACKHAWK === fundingType) {
		$("#pinOfCashREloadit").val(pin);
		$("#amountOfCashReloadit").val(amount);
	} else if(jsonTypeConstant.PRECASH === fundingType) {
		$("#pinOfCashEvolve1").val(pin.substring(0, 4));
		$("#pinOfCashEvolve2").val(pin.substring(4, 8));
		$("#pinOfCashEvolve3").val(pin.substring(8, 12));
		$("#pinOfCashEvolve4").val(pin.substring(12, 16));
		$("#amountOfCashEvolve").val(amount);
	} else if(jsonTypeConstant.INCOMM === fundingType) {
		$("#pinOfCashVanilla1").val(pin.substring(0, 3));
		$("#pinOfCashVanilla2").val(pin.substring(3, 6));
		$("#pinOfCashVanilla3").val(pin.substring(6, 10));
		$("#amountOfCashVanilla").val(amount);
	}
}

/********************************************************************************************
' Name                 :   getImageNameByJsonType
' Return type          :   None
' Input Parameter(s)   :   jsonType
' Purpose              :   Function is used to get the funding source cash image name based 
							on the jsonType..
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   01 Oct 2013    -   Karuna Mishra
'*******************************************************************************************/
function getImageNameByJsonType(jsonType) {
	jsonType = jsonType.trim();
	var imageName = "";
	if(jsonTypeConstant.BLACKHAWK === jsonType) {
		imageName = "reloadit";
	} else if(jsonTypeConstant.PRECASH === jsonType) {
		imageName = "evolvepb-logo_small";
	} else if(jsonTypeConstant.INCOMM === jsonType) {
		imageName = "biller_logo_icon";
	} else {
		imageName = "logo";
	}
	return imageName;
}

var timerEnableSaveButton;
function runTimerEnableSaveButton() {/* Run Timer for save button on cash section */
	timerEnableSaveButton = setInterval('validatePinAndAmount()', 500);/* Calling validatePinAndAmount() with in the time gap*/
}

/********************************************************************************************
' Name                 :   validatePinAndAmount
' Return type          :   Boolean
' Input Parameter(s)   :   None
' Purpose              :   Function is used to validate if pin and amount has valid input 
							remove error_red_border class.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   25 Nov 2013    -   Karuna Mishra
'*******************************************************************************************/
function validatePinAndAmount() {
	var amount = '';
	var pin = '';
	var fundingSourceType = getVisibleCashFundingSource();/* Fetching the visible funding source */
	
	if ($('#cashPaymentOptionBox1').is(':visible')) {/* Evolve cash box is visible then proceed */
		amount = getFormatedNumber($("#amountOfCashEvolve").val(), false);/* Get amount from the relevant cash div and formatted it */
		var $inputFields = $('#pinSectionPreCash :input');/* Due to multiple input boxes gettting each of them through iterating */
			$inputFields.each(function() {
				pin += $(this).val();/* Getting pin number from the relevant 'Div' */
			});
	} else if ($('#cashPaymentOptionBox2').is(':visible')) {/* Reload it cash box is visible then proceed */
		amount = getFormatedNumber($("#amountOfCashReloadit").val(), false);/* Get amount from the relevant cash div and formatted it */
		pin += $('#pinOfCashREloadit').val();/* Getting pin number from the relevant 'Div' */
	} else if ($('#cashPaymentOptionBox3').is(':visible')) {/* Vanilla cash box is visible then proceed */
		amount = getFormatedNumber($("#amountOfCashVanilla").val(), false);/* Get amount from the relevant cash div and formatted it */
		var $inputFields = $('#pinSectionInComm :input');/* Due to multiple input boxes gettting each of them through iterating */
		$inputFields.each(function() {
			pin += $(this).val();/* Getting pin number from the relevant 'Div' */
		});
	}
	
	if (jsonTypeConstant.BLACKHAWK == fundingSourceType) {/* Visible funding source is BLACKHAWK then proceed  */
		validateCashFundingFields(pin, amount, 'saveBtnOfRelodit');
	} else if (jsonTypeConstant.INCOMM == fundingSourceType) {/* Visible funding source is INCOMM then proceed  */
		validateCashFundingFields(pin, amount, 'saveBtnOfVanilla');
	} else if (jsonTypeConstant.PRECASH == fundingSourceType) {/* Visible funding source is PRECASH then proceed  */
		if (pin.length < 16 && !amount) {/* Check for pin length must be 16 and amount not be empty  */
			$("#saveBtnOfEvolve").removeClass("bg_green").addClass("bg_grey1");
			disableButton('saveBtnOfEvolve');
			return false;
		} else if (!amount) {/* Amount should not be empty*/
			$("#saveBtnOfEvolve").removeClass("bg_green").addClass("bg_grey1");
			disableButton('saveBtnOfEvolve');
			return false;
		} else if (pin.length < 16) {/* Pin should not be less than 16 for Evolve */
			$("#saveBtnOfEvolve").removeClass("bg_green").addClass("bg_grey1");
			disableButton('saveBtnOfEvolve');
			return false;
		} else if(amount && validatePinLunh(pin)) {/* amount should not be empty and MOD10 check should satisfy */
			$("#pinOuterSection").removeClass("error_red_border");
			$("#blueBoxCnt1").hide();
			$("#saveBtnOfEvolve").removeClass("bg_grey1").addClass("bg_green");
			enableButton('saveBtnOfEvolve');
			return false;
		}
	}
}

/********************************************************************************************
' Name                 :   validateCashFundingFields
' Return type          :   Boolean
' Input Parameter(s)   :   pin, amount, saveBtn
' Purpose              :   Function is used to validate if pin and amount has valid input 
							remove error_red_border class.
' History Header       :   Version   -   Date            	-   Developer Name
' Added By             :   1.0       -   28 Nov 2013    	-   Karuna Mishra
'*******************************************************************************************/
function validateCashFundingFields(pin, amount, saveBtn) {
	if (!pin && !amount) {/* Pin and amount should not be empty */
		$("#"+saveBtn).removeClass("bg_green").addClass('bg_grey1');
		disableButton(saveBtn);
		return false;
	} else if (pin.length !== 10) {/* Pin length should not be less than 10 digit */
		$("#"+saveBtn).removeClass("bg_green").addClass('bg_grey1');
		disableButton(saveBtn);
		return false;
		if (!pin) {/* Pin should not be empty */
			$("#"+saveBtn).removeClass("bg_green").addClass('bg_grey1');
			disableButton(saveBtn);
			return false;
		}
	} else if (!amount) {/* amount should not be empty */
		$("#"+saveBtn).removeClass("bg_green").addClass('bg_grey1');
		disableButton(saveBtn);
		return false;
	} else if (amount && pin && pin.length === 10) {/* Pin and amount should not be empty and pin number should be 10 digit*/
		$("#"+saveBtn).addClass("bg_green").removeClass("bg_grey1");
		enableButton(saveBtn);
		return false;
	}
}

/********************************************************************************************
' Name                 :   validatePinLunh
' Return type          :   Boolean
' Input Parameter(s)   :   pin
' Purpose              :   Function is used for validating pin number .
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   20 Dec,2013        -   Karuna Mishra
'*******************************************************************************************/
function validatePinLunh(pin) {
	var doubled = [];
	for ( var i = pin.length - 2; i >= 0; i = i - 2) {
		doubled.push(2 * pin[i]);
	}
	var total = 0;
	for ( var i = ((pin.length % 2) == 0 ? 1 : 0); i < pin.length; i = i + 2) {
		total += parseInt(pin[i]);
	}
	for ( var i = 0; i < doubled.length; i++) {
		var num = doubled[i];
		var digit;
		while (num != 0) {
			digit = num % 10;
			num = parseInt(num / 10);
			total += digit;
		}
	}
	if (total % 10 == 0) {
		return (true);
	} else {
		$("#pinOuterSection").addClass("error_red_border");
		hideOrShowCashErrorMessage("blueBoxCnt1", "blueBoxMsgDiv1",	messages["checkout.validation.validPin"]);
		
		$("#saveBtnOfEvolve").removeClass("bg_green");
		disableButton('saveBtnOfEvolve');
		return (false);
	}
}

/********************************************************************************************
' Name                 :   onBlurPinOrAmountValidation
' Return type          :   None
' Input Parameter(s)   :   pinId, amountId, errorDivCnt, errDivBox, pinSection
' Purpose              :   Function is used to validate if pin and amount has valid input 
							remove error_red_border class.
' History Header       :   Version   -   Date             	-   Developer Name
' Added By             :   1.0       -   25 Nov, 2013      -   Karuna Mishra
'*******************************************************************************************/
function onBlurPinOrAmountValidation(pinId, amountId, errorDivCnt, errDivBox, pinSection) {
	if (!$("#" + pinId).val() && !$("#" + amountId).val()) {
		addClassNdRemoveClass(pinId, "");
		addClassNdRemoveClass(amountId, "");
		if (pinSection) {
			addClassNdRemoveClass(pinSection, "");
		}
		hideOrShowCashErrorMessage(errorDivCnt, errDivBox);
	} else if (!$("#" + pinId).val() && $("#" + amountId).val()) {
		if ($("#" + pinId).hasClass("error_red_border")) {
			addClassNdRemoveClass(amountId, "");
			hideOrShowCashErrorMessage(errorDivCnt, errDivBox, messages["checkout.validation.pinRequired"]);
		}
	} else if ($("#" + pinId).val() && !$("#" + amountId).val()) {
		if ($("#" + amountId).hasClass("error_red_border")) {
			addClassNdRemoveClass(pinId, "");
			if (pinSection) {
				addClassNdRemoveClass(pinSection, "");
			}
			hideOrShowCashErrorMessage(errorDivCnt, errDivBox, messages["checkout.validation.amountRequired"]);
		}
	} else {
		addClassNdRemoveClass(pinId, "");
		addClassNdRemoveClass(amountId, "");
		if(pinSection) {
			addClassNdRemoveClass(pinSection, "");
		}
		hideOrShowCashErrorMessage(errorDivCnt, errDivBox);
	}
}

/********************************************************************************************
' Name                 :   hideOrShowCashErrorMessage
' Return type          :   None
' Input Parameter(s)   :   errorContainerId, errorMsgBoxId, message
' Purpose              :   Function is used to validate if pin and amount has valid input 
							remove error_red_border class.
' History Header       :   Version   -   Date             -   Developer Name
' Added By             :   1.0       -   25 Nov, 2013     -   Karuna Mishra
'*******************************************************************************************/
function hideOrShowCashErrorMessage(errorContainerId, errorMsgBoxId, message) {
	if (message) {
		$("#" + errorContainerId).show();
		$("#" + errorMsgBoxId).text(message).show();
	} else {
		$("#" + errorContainerId).hide();
		$("#" + errorMsgBoxId).text("").hide();
	}
}

/********************************************************************************************
' Name                 :   sortByFundingSourceType
' Return type          :   None
' Input Parameter(s)   :   a, b
' Purpose              :   Function is used to sort the payment options by funding source type.
' History Header       :   Version   -   Date             -   Developer Name
' Added By             :   1.0       -   23 Sep, 2013     -   Karuna Mishra
'*******************************************************************************************/
function sortByFundingSourceType(a, b) {
	var cnt = 0, tem;
	a = String(a.description).toLowerCase();
	b = String(b.description).toLowerCase();
	if (a === b) {
		return 0;
	}
	if (/\d/.test(a) || /\d/.test(b)) {
		var Rx = /^\d+(\.\d+)?/;
		while (a.charAt(cnt) === b.charAt(cnt) && !Rx.test(a.substring(cnt))) {
			cnt++;
		}
		a = a.substring(cnt);
		b = b.substring(cnt);
		if (Rx.test(a) || Rx.test(b)) {
			if (!Rx.test(a)) {
				return a ? 1 : -1;
			}
			if (!Rx.test(b)) {
				return b ? -1 : 1;
			}
			tem = parseFloat(a) - parseFloat(b);
			if (tem != 0) {
				return tem;
			}
			a = a.replace(Rx, '');
			b = b.replace(Rx, '');
			if (/\d/.test(a) || /\d/.test(b)) {
				return a1Sort(a, b);
			}
		}
	}
	if (a === b) {
		return 0;
	}
	return a > b ? 1 : -1;
}

/********************************************************************************************
' Name                 :   showRegFormOFPromoCode
' Return type          :   None
' Input Parameter(s)   :   None   
' Purpose              :   Function is used for Showing the registration fields.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function showRegFormOFPromoCode() {
	var totalDueAmt = getFormatedNumber($("#amountDueTotal").text(), false);
	var totalPaymentAmt = getFormatedNumber($("#cashSummaryTotalAmount").text(), false);
	if (!$('#chkPromoCode').is(":checked")) {
		var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
		var arg1 = '</a>';
		message = formatMessage(messages['checkout.guestUserPromoCodeRegisterTermCond'], arg0, arg1);
		$("#chkPromoCode").prop('checked', true);
		$("#chkPromoCodeIcon").removeClass("add_bill_inactiv_chkbox_icon flt_lft");
		$("#chkPromoCodeIcon").addClass("add_bill_activ_chkbox_icon flt_lft");
		/* clearing promocode and password whenever expanding discount and promo section. Bug 4865*/
		$('#promoCodeDiscount1').val('');
		$('#passwordPromoCode').val('');
		$("#frmGuestPromoCodeRes").show();
		$("#checkoutDiscountPromoTermsCond").html(message);
		/* Show the check box for marketing Opt in */
		createOptInMsgAorBSection("chkOptInEnhCreatProfPromo", "optInEhnChkCreatProfPromo", messages['createAccount.optInEnh']);
		if($("#additional_info_box").is(":visible")) {
			fillPromoRegisterFromAdditionalInfo();
		} else if($("#createAccountBoxChkOut").is(":visible")) {
			fillPromoRegisterFromCreateProfile();
		}
		/*  To be called from create_acc_guest.js*/
		validateCheckoutRegistrationFields();
		enableCheckoutRegisterBtn();
	} else {
		offPromoCodeRegisterScreen();
		/* Fill the data in "Create Profile" area on click of Cancel or unmark of check box and if incase of 
		 * atleast 1 schedule payment if user clicked "Register" button then also same*/
		if (totalPaymentAmt > totalDueAmt || isRegisterSelected) {
			fillCreateProfileFromPromoRegister();
		} else if(totalPaymentAmt === totalDueAmt || $("#panel"+jsonTypeConstant.DEBIT).is(":visible") || $("#panel"+jsonTypeConstant.CREDIT).is(":visible")) {
			fillAdditionalInfoFromPromoRegister();
		}
		cancelBtnOfPromoCode();
	}
}

/********************************************************************************************
' Name                 :   fillPromoRegisterFromAdditionalInfo
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to auto fill Promo register form from Addtional info form.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24 Jun, 2014      -   Karuna Mishra
'*******************************************************************************************/
function fillPromoRegisterFromAdditionalInfo() {
	$('#emailIdPromoCode').val($("#emailIdAddInfoChkOut").val());
	$('#confrmEmailIdPromoCode').val($("#emailIdAddInfoChkOut").val());
	$('#mobileNoPromoCode').val($("#mobileNoAddInfoChkOut").val());
	$('#zipCodePromoCode').val($("#zipCodeAddInfoChkOut").val());
	if ($('#chkOptInEnhAddInfo').is(":checked")) {
		$("#chkOptInEnhCreatProfPromo").prop('checked', true);
	} else {
		$("#chkOptInEnhCreatProfPromo").prop('checked', false);
	}
	clearFormField("additional_info_box");
	$("#additional_info_box").hide();
}

/********************************************************************************************
' Name                 :   fillPromoRegisterFromCreateProfile
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to auto fill Promo register form from Create Profile form.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24 Jun, 2014      -   Karuna Mishra
'*******************************************************************************************/
function fillPromoRegisterFromCreateProfile() {
	$('#emailIdPromoCode').val($("#emailIdChkOut").val());
	$('#confrmEmailIdPromoCode').val($("#confrmEmailIdChkOut").val());
	$('#passwordPromoCode').val($("#passwordChkOut").val());
	$('#mobileNoPromoCode').val($("#mobileNoChkOut").val());
	$('#zipCodePromoCode').val($("#zipCodeChkOut").val());
	$('#promoCodeDiscount1').val($("#promoCodeDiscount2").val());
	if ($('#chkOptInEnhCreatProf').is(":checked")) {
		$("#chkOptInEnhCreatProfPromo").prop('checked', true);
	} else {
		$("#chkOptInEnhCreatProfPromo").prop('checked', false);
	}
	clearFormField("createAccountBoxChkOut");
	$("#createAccountBoxChkOut").hide();
	clearIntervalApp(chkRegisterBtnCount);
}

/********************************************************************************************
' Name                 :   fillCreateProfileFromPromoRegister
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to auto fill Create Profile form from Promo register form.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24 Jun, 2014      -   Karuna Mishra
'*******************************************************************************************/
function fillCreateProfileFromPromoRegister() {
	$('#emailIdChkOut').val($("#emailIdPromoCode").val());
	$('#confrmEmailIdChkOut').val($("#confrmEmailIdPromoCode").val());
	$('#passwordChkOut').val($("#passwordPromoCode").val());
	$('#mobileNoChkOut').val($("#mobileNoPromoCode").val());
	$('#zipCodeChkOut').val($("#zipCodePromoCode").val());
	$('#promoCodeDiscount2').val($("#promoCodeDiscount1").val());
	if ($('#chkOptInEnhCreatProfPromo').is(":checked")) {
		$("#chkOptInEnhCreatProf").prop('checked', true);
	} else {
		$("#chkOptInEnhCreatProf").prop('checked', false);
	}
	$("#createAccountBoxChkOut").show();
	validateCreateProfile();
}

/********************************************************************************************
' Name                 :   fillAdditionalInfoFromPromoRegister
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to auto fill Addtional info form from Promo register form.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24 Jun, 2014      -   Karuna Mishra
'*******************************************************************************************/
function fillAdditionalInfoFromPromoRegister() {
	$('#emailIdAddInfoChkOut').val($("#emailIdPromoCode").val());
	$('#mobileNoAddInfoChkOut').val($("#mobileNoPromoCode").val());
	$('#zipCodeAddInfoChkOut').val($("#zipCodePromoCode").val());
	if ($('#chkOptInEnhCreatProfPromo').is(":checked")) {
		$("#chkOptInEnhAddInfo").prop('checked', true);
	} else {
		$("#chkOptInEnhAddInfo").prop('checked', false);
	}
	$("#additional_info_box").show();
	validateAdditionalInfo();
}

/********************************************************************************************
' Name                 :   offPromoCodeRegisterScreen
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for hiding the Register Promo code screen on Checkout Page load.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function offPromoCodeRegisterScreen() {
	$("#chkPromoCode").prop('checked', false);
	$("#chkPromoCodeIcon").removeClass("add_bill_activ_chkbox_icon flt_lft");
	$("#chkPromoCodeIcon").addClass("add_bill_inactiv_chkbox_icon flt_lft");
	$("#frmGuestPromoCodeRes").hide();
}

/********************************************************************************************
' Name                 :   validateCheckoutRegistrationFields
' Return type          :   None
' Input Parameter(s)   :   None 
' Purpose              :   Function is used for validating the registration fields.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function validateCheckoutRegistrationFields(){
	$('#emailIdPromoCode').blur(function () {
		this.value = this.value.toLowerCase();
		validateEmailInfo('emailIdPromoCode', 'errorPromoCode1', 'invalidMsgPromoCode1', messages['createAccount.invalidEmailMsg'],
				'frmGuestPromoCodeRes', 'btnRegisterPromoCodeNew','chkoutPaymentSec');
	});
	$('#confrmEmailIdPromoCode').blur(function () {
		this.value = this.value.toLowerCase();
		validateReenterEmail('emailIdPromoCode', 'confrmEmailIdPromoCode', 'errorPromoCode2', 'invalidMsgPromoCode2',
				messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestPromoCodeRes', 'btnRegisterPromoCodeNew', 'chkoutPaymentSec');
	});
	$('#passwordPromoCode').blur(function () {
		passwordMatchUserName('emailIdPromoCode', 'passwordPromoCode', 'errorPromoCode3', 'invalidMsgPromoCode3',
				messages['createAccount.invalidpasswordMsgSame'], 'frmGuestPromoCodeRes', 'btnRegisterPromoCodeNew','chkoutPaymentSec');
	});
	$('#mobileNoPromoCode').blur(function () {
		validatePhoneInfo('mobileNoPromoCode', 'errorPromoCode4', 'invalidMsgPromoCode4', messages['createAccount.invalidphoneMsg'],
				'frmGuestPromoCodeRes', 'btnRegisterPromoCodeNew','chkoutPaymentSec');
	});
	$('#zipCodePromoCode').blur(function () {
		validateZipcodeInfo('zipCodePromoCode', 'errorPromoCode5', 'invalidMsgPromoCode5', messages['createAccount.invalidzipCodeMsg'],
				'frmGuestPromoCodeRes', 'btnRegisterPromoCodeNew', 'chkoutPaymentSec');
	});
	customKeypressValidator('mobileNoPromoCode');
}

/********************************************************************************************
' Name                 :   cancelBtnOfPromoCode
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for moveing back to perior state from register page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function cancelBtnOfPromoCode() {
	clearInterval(chkPromoCodeRegisterBtnCount);
	clearFormField("frmGuestPromoCodeRes"); /* To be called from fieldValidator.js*/
	var count = 0;
	var $inputFields = $('#frmGuestPromoCodeRes' + ' :input');
	$inputFields.each(function() {
		if($(this).hasClass('error_red_border')) {
			$(this).removeClass('error_red_border');
			if(count === 6){
				$('#moberrorPromoCode' + (count-1)).hide();
				$('#errorPromoCode' + (count-1)).hide();
			} else {
				$('#moberrorPromoCode' + count).hide();
				$('#errorPromoCode' + (count)).hide();
			}
		} 
		count++;
	});
}

/********************************************************************************************
' Name                 :   cancelBtnOfCreateAccCheckout
' Return type          :   None
' Input Parameter(s)   :   frmDiv
' Purpose              :   Function is used for moveing back to perior state from register page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function cancelBtnOfCreateAccCheckout(frmDiv) {
	/* To be called from fieldValidator.js*/
	$('#emailIdPromoCode').val($("#emailIdChkOut").val());
	$('#confrmEmailIdPromoCode').val($("#confrmEmailIdChkOut").val());
	$('#passwordPromoCode').val($("#passwordChkOut").val());
	$('#mobileNoPromoCode').val($("#mobileNoChkOut").val());
	$('#zipCodePromoCode').val($("#zipCodeChkOut").val());
	$('#promoCodeDiscount1').val($("#promoCodeDiscount2").val());
	clearFormField("createAccountBoxChkOut");
	$("#passwordChkOut").val("");
	var count = 1;
	var $inputFields = $('#'+ frmDiv + ' :input');
	$inputFields.each(function() {
		if($(this).hasClass('error_red_border')) {
			$(this).removeClass('error_red_border');
			$('#moberrorPromoCode'+ count).hide();
			$('#errorPromoCode'+ (count)).hide();
		} 
		count++;
	});
}

/********************************************************************************************
' Name                 :   promoCodeErrorHandling
' Return type          :   None
' Input Parameter(s)   :   errorMsg, elementId
' Purpose              :   Function is used for showing the error on promo code field if 
' 							BP_VERIFY_FUNDING_SOURCE Api return error containg prefix "BP_PROMO"
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function promoCodeErrorHandling(errorMsg, elementId){
	if(elementId) {
		$("#" + elementId).addClass("error_red_border");
		$("#invalidMsgPromoCodeRes").text(errorMsg);
		$("#errorPromoCodeRes").show();
		$("#discountAndPromoCodeReg").hide();
		$("#promoCodeSectionLabel").focus();
		$("#" + elementId).focus();
		submitBtnEnableUI('checkoutApply');
	}
}

/********************************************************************************************
' Name                 :   registerEventsForPromoCode
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for changeing the state of Apply button on keypress of promocode field.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function registerEventsForPromoCode(){
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	$("#" + visiblePromoCodeInputId).keyup(function() {
		var promocodeEntryValue = $("#" + visiblePromoCodeInputId).val();
		if(promocodeEntryValue != lastPromoCode) {
			$("#invalidMsgPromoCodeRes").text("");
			$("#errorPromoCodeRes").hide();
			$('#summuryPromoCode').hide();
			$('#checkoutPromoCodeAmount').hide();
			$("#checkoutPromoCodeAmount").text("");
			$("#" + visiblePromoCodeInputId).removeClass("error_red_border");
			validationTracking = NOTVALIDATED;
			submitBtnEnableUI('checkoutApply');
			updateAmountDueArea();
			/* To update the new credit section whenever summary section updates.*/
			updateNewCreditsArea();
		}
	});
	$("#" + visiblePromoCodeInputId).blur(function() {
		lastPromoCode = $("#" + visiblePromoCodeInputId).val();
	});
	$("#" + visiblePromoCodeInputId).bind("mouseup", function(e){
		var $input = $(this),
	      oldValue = $input.val();

	  if (oldValue == "") return;

	  // When this event is fired after clicking on the clear button
	  // the value is not cleared yet. We have to wait for it.
	  setTimeout(function(){
	    var newValue = $input.val();

	    if (newValue == ""){
	    	clearPromoCodeBox();
	    }
	  }, 1);
	});
	
}

/********************************************************************************************
' Name                 :   enableDisableRegisterBtn
' Return type          :   None
' Input Parameter(s)   :   frmElementDivId, submitBtnId
' Purpose              :   Function is used for activating the register button..
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   18th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function enableDisableRegisterBtn(frmElementDivId, submitBtnId){
	var buttonStatusEnabled = true;
	var $inputFields = $('#' + frmElementDivId + ' :input');
	$inputFields.each(function() {
		var inputType = $(this).attr('type');
		var inputId= $(this).attr('id');
		if(inputId != 'promoCodeDiscount1'){
			if(inputType && inputType != 'checkbox') {
				if($(this).hasClass('error_red_border') || !$(this).val()) {
					buttonStatusEnabled = false;
				}
			}
		}
	});
	if(buttonStatusEnabled) {
		submitBtnEnableUI(submitBtnId);
	} else {
		submitBtnDisableUI(submitBtnId);
	}
}