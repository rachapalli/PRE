/********************************************************************************************
' Name                 :   resetCheckoutPage
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   reset checkout page.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   pradeepy
'*******************************************************************************************/
function resetCheckoutPage() {
	$('#checkoutFundingSourceTotal').text(getFormatedNumber(0, true));
	$('#additional_info_box').hide();
	hideErrorDivs('errorMainAreaAddInfoChkOut', 3);
	clearFormData('frmGuestAddInfoChkOut');
	$('#createAccountBoxChkOut').hide();
	clearIntervalApp(chkRegisterBtnCount);
	hideErrorDivs('errorMainAreaChkOut', 5);
	clearFormData('frmGuestCreateAccChkOut');
	deActivateCheckoutPayButton();
}

/********************************************************************************************
' Name                 :   hideErrorDivs
' Return type          :   none
' Input Parameter(s)   :   divElementId, totalCount
' Purpose              :   hide error divs.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   12 June 2013   -   pradeepy
'*******************************************************************************************/
function hideErrorDivs(divElementId, totalCount) {
	for(var count=1; count<=totalCount; count++){
		$('#' + divElementId + count).hide();
	}
}

/********************************************************************************************
' Name                 :   calulateFundingSourceTotalAmount
' Return type          :   amount
' Input Parameter(s)   :   jqueryObject
' Purpose              :   calculate funding source total amount.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   12 June 2013   -   pradeepy
'*******************************************************************************************/
function calulateFundingSourceTotalAmount(jqueryObject){
	var $historyFundsDIV = jqueryObject.parents('div:eq(2)'); // other way use id
	var amount = 0;
	$($historyFundsDIV).find(".removableRow").each(function(indexCounter){
		amount += getFormatedNumber( $(this).find(".add_pmt_wd_d").text() );
	} );
	return amount;
}

/********************************************************************************************
' Name                 :   closeAlreadyOpenDivs
' Return type          :   closedAllOpenDivStatus
' Input Parameter(s)   :   jqueryObject
' Purpose              :   close all divs those open for edit operation.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   12 June 2013   -   pradeepy
'*******************************************************************************************/
function closeAlreadyOpenDivs(jqueryObject){
	var closedAllOpenDivStatus = true;
	var $historyFundsDIV = jqueryObject.parents('div:eq(2)');
	//close already open divs those open for edit amount.
	$($historyFundsDIV).find(".add_pmt_addition_icon").each(function(indexCounter){
		var $currentremovableRow = $(this).parents('div:eq(1)');
		var pinNumber = $($currentremovableRow).find(".add_pmt_wd_c input[type=\"text\"] ").val();
		var amount = $($currentremovableRow).find(".add_pmt_wd_d input[type=\"text\"] ").val();
		if(pinNumber == "" || amount == ""){
			closedAllOpenDivStatus = false;
			return false;
		}
		$($currentremovableRow).find(".add_pmt_wd_c").empty().text(pinNumber);
		$($currentremovableRow).find(".add_pmt_wd_d").empty().text(amount);
		$($currentremovableRow).find(".add_pmt_ques_icon").hide();
		$(this).removeClass("add_pmt_addition_icon").addClass("add_pmt_pencil_icon");
	} );
	return closedAllOpenDivStatus;
}

/********************************************************************************************
' Name                 :   expandRow
' Return type          :   none
' Input Parameter(s)   :   id
' Purpose              :   expand or collapse the selected funding source.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   12 June 2013   -   pradeepy
'*******************************************************************************************/
function expandRow(id){
	// if true expand the box and display '-' icon
	if($("#"+id).hasClass('add_pmt_plus_icon')){
		$("#"+id).removeClass("add_pmt_plus_icon").addClass("add_pmt_minus_icon").show();
		$("#expandBox"+id).show();
	}else{
		$("#"+id).removeClass("add_pmt_minus_icon").addClass("add_pmt_plus_icon").show();
		$("#expandBox"+id).hide();
	}
}

/********************************************************************************************
' Name                 :   showAddFundInstructionalMessage
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   To display the instructional message in slid down popup on checkout JSP.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   14 June 2013   -   pradeepy
'*******************************************************************************************/
function showAddFundInstructionalMessage(){
	showGeneralSuccessMsg(messages["checkout.instructional_message"]);
}

/********************************************************************************************
' Name                 :   onBlurValidation
' Return type          :   none
' Input Parameter(s)   :   id
' Purpose              :   To validate if pin and amount has valid input remove error_red_border class.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   karunam
'*******************************************************************************************/
function onBlurValidation(id){
	if( $("#pin"+id).val() && $("#amount"+id).val()){
		addClassNdRemoveClass('pin',id);
		addClassNdRemoveClass('amount',id);
		showErrorMessage(id);
		mobileValidationOfPinAmtFields();
	} else if($("#pin"+id).val()){
		addClassNdRemoveClass('pin',id);
		if($("#amount"+id).val()){
			addClassNdRemoveClass('amount',id);
			showErrorMessage(id);
			mobileValidationOfPinAmtFields();
		}else{
			if($("#amount"+id).hasClass("error_red_border")){
			showErrorMessage(id, messages["checkout.validation.amountRequired"]);
			mobileValidationOfPinAmtFields(messages["checkout.validation.amountRequired"]);
			}
		}
	} else if($("#amount"+id).val()){
		addClassNdRemoveClass('amount',id);
		if($("#pin"+id).val()){
			addClassNdRemoveClass('pin',id);
			showErrorMessage(id);
			mobileValidationOfPinAmtFields();
		} else{
			if($("#pin"+id).hasClass("error_red_border")){
			showErrorMessage(id,messages["checkout.validation.pinRequired"]);
			mobileValidationOfPinAmtFields(messages["checkout.validation.pinRequired"]);
			}
		}
	}
}

/********************************************************************************************
' Name                 :   onBlurValidation
' Return type          :   none
' Input Parameter(s)   :   id
' Purpose              :   To validate if pin and amount has valid input remove error_red_border class.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   karunam
'*******************************************************************************************/
function addClassNdRemoveClass(elementId, id){
	if($("#"+ elementId + id).hasClass("error_red_border")){
		$("#"+ elementId + id).removeClass("error_red_border");
	}
}
	
/********************************************************************************************
' Name                 :   showErrorMessage
' Return type          :   none
' Input Parameter(s)   :   id, message
' Purpose              :   To show error messages.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   karunam
'*******************************************************************************************/
function showErrorMessage(id, message){
	if(message){
	$("#fundingSourceErrorContainer"+id).show();
		$("#pinErrorMsg"+id).text(message);
		$("#pinErrorMsg"+id).show();
	}else{
		$("#fundingSourceErrorContainer"+id).hide();
		$("#pinErrorMsg"+id).text("");
		$("#pinErrorMsg"+id).hide();
	}
}

/********************************************************************************************
' Name                 :   addClassError
' Return type          :   none
' Input Parameter(s)   :   element, id
' Purpose              :   To ad the error class to element.
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   karunam
'*******************************************************************************************/
function addClassError(element, id){
	$("#"+ element +id).addClass("error_red_border");
	$("#"+ element +id).focus();
}

/********************************************************************************************
' Name                 :   mobileValidationOfPinAmtFields
' Return type          :   none
' Input Parameter(s)   :   message
' Purpose              :   To validate if pin and amount has valid input in case of mobile
' History Header       :   Version   -   Date           -   Developer Name 
' Added By             :   1.0       -   17 July 2013   -   karunam
'*******************************************************************************************/
function mobileValidationOfPinAmtFields(message){
	var windowsize = $(window).width();
	if (windowsize <= minimumWindowWidthForMobile) {
		if(message){
			$("#mobChkoutPinAmountErrorMsg").text(message);
		}else{
			$("#mobChkoutPinAmountErrorMsg").text("");
			$("#mobChkoutPinAmountValidationMsgDiv").hide();
		}
	}
}