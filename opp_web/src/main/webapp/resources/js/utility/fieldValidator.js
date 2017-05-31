/********************************************************************************************
' Name                 :   validateEmailInfo
' Return type          :   None 
' Input Parameter(s)   :   emailElementDiv, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validateEmailInfo(emailElementDiv, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId,mobRowBoxDivId, submitBtnIdBtm) {
	var emailRegEx = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	customValidator(emailElementDiv, emailRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId,mobRowBoxDivId, submitBtnIdBtm);
}

/********************************************************************************************
' Name                 :   validateReenterEmail
' Return type          :   None 
' Input Parameter(s)   :   emailElementId, reEnterElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validateReenterEmail(emailElementId, reEnterElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm) {
	var emailVal = $('#' + emailElementId).val();
	var reEmailVal = $('#' + reEnterElementId).val();
	if (reEmailVal && emailVal !== reEmailVal) {
		showErrorBox(reEnterElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, mobRowBoxDivId);
	} else {
		hideErrorBox(frmElementDivId, reEnterElementId, errorMainAreaDivId, errorMsgDivId,mobRowBoxDivId);
	}
	enableDisableSubmit(frmElementDivId, submitBtnId, submitBtnIdBtm);
}

/********************************************************************************************
' Name                 :   passwordMatchUserName
' Return type          :   None 
' Input Parameter(s)   :   emailElementId, passwordElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function passwordMatchUserName(emailElementId, passwordElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm) {
	var username = $('#' + emailElementId).val();
	var password = $('#' + passwordElementId).val();
	if(username && password && password === username){
		showErrorBox(passwordElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, mobRowBoxDivId);
	} 
	else {
		validatePasswordInfo(passwordElementId, errorMainAreaDivId, errorMsgDivId, messages['createAccount.invalidpasswordMsg'], frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm);
	} 
}

/********************************************************************************************
' Name                 :   validatePasswordInfo
' Return type          :   None 
' Input Parameter(s)   :   passwordElementId,passwordRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validatePasswordInfo(passwordElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm) {
	var passwordRegEx = /^(?=\S+$).{4,20}/;
	customValidator(passwordElementId, passwordRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId,mobRowBoxDivId, submitBtnIdBtm);
}

/********************************************************************************************
' Name                 :   validatePhoneInfo
' Return type          :   None 
' Input Parameter(s)   :   phoneElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validatePhoneInfo(phoneElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm) {
	var phoneRegEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	customValidator(phoneElementId, phoneRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm);
	formatPhoneNo('#' + phoneElementId);
}

/********************************************************************************************
' Name                 :   validateZipcodeInfo
' Return type          :   None 
' Input Parameter(s)   :   zipcodeElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function validateZipcodeInfo(zipcodeElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId,mobRowBoxDivId, submitBtnIdBtm) {
	var zipRegEx = /^\d{5}$/;
	customValidator(zipcodeElementId, zipRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId,mobRowBoxDivId, submitBtnIdBtm);
}

/********************************************************************************************
' Name                 :   customValidator
' Return type          :   None 
' Input Parameter(s)   :   elementId, regEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
						   frmElementDivId, submitBtnId
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function customValidator(elementId, regEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId, submitBtnIdBtm) {
	var elementValueOne = $('#' + elementId).val();
	var elementValue = elementId === 'phonePrompt' ? elementValueOne.replace(/-/g,'') : elementValueOne;
	if (elementValue) {
		if (regEx.test(elementValue)) {
			hideErrorBox(frmElementDivId, elementId, errorMainAreaDivId, errorMsgDivId,mobRowBoxDivId);
		} 
		else {
			showErrorBox(elementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, mobRowBoxDivId);
		}
	} 
	else {
		hideErrorBox(frmElementDivId, elementId, errorMainAreaDivId, errorMsgDivId, mobRowBoxDivId);
	}
	
	enableDisableSubmit(frmElementDivId, submitBtnId, submitBtnIdBtm);
}

/********************************************************************************************
' Name                 :   customKeypressValidator
' Return type          :   None 
' Input Parameter(s)   :   elementId, regEx
' Purpose              :   Function is used for key press event validation.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   13th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function customKeypressValidator(elementId){
	$("#" + elementId).keypress(function(e) {
		return isValidPhoneEntered(this, e);
	});
}

/********************************************************************************************
' Name                 :   showErrorBox
' Return type          :   None 
' Input Parameter(s)   :   elementId, errorMainAreaDivId, errorMsgDivId, errorMsgText
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   13th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function showErrorBox(elementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, mobRowBoxDivId) {
	applyErrorClass(elementId);
	/* Removed due to new error handling changes */
	$('#' + "mob" + errorMsgDivId).text(errorMsgText);
	$('#' + "mob" + errorMainAreaDivId).show();
}

/********************************************************************************************
' Name                 :   hideErrorBox
' Return type          :    
' Input Parameter(s)   :   frmElementDivId, elementId, errorMainAreaDivId, errorMsgDivId, 
						   mobErrorMainAreaDivId, mobErrorMsgDivId, mobRowBoxDivId
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   13th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function hideErrorBox(frmElementDivId, elementId, errorMainAreaDivId, errorMsgDivId, mobErrorMainAreaDivId, mobErrorMsgDivId, mobRowBoxDivId) {
	removeErrorBorderClass(elementId);
	/* Removed due to new error handling changes */
	$('#' + "mob" + errorMsgDivId).text('');
	$('#' + "mob" + errorMainAreaDivId).hide();
}

/********************************************************************************************
' Name                 :   addHeightClass
' Return type          :   None 
' Input Parameter(s)   :   elementId
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   13th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function addHeightClass(elementId, className) {
	if(className){
		$('#' + elementId).addClass(className);
	}else{
		$('#' + elementId).addClass("add_bill_hght_sep");
	}
	
}

/********************************************************************************************
' Name                 :   removeHeightClass
' Return type          :   None 
' Input Parameter(s)   :   elementId
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function removeHeightClass(elementId, className) {
	if(className){
		$('#' + elementId).removeClass(className);
	}else{
		$('#' + elementId).removeClass("add_bill_hght_sep");
	}
	
}

/********************************************************************************************
' Name                 :   clearFormData
' Return type          :    
' Input Parameter(s)   :   elementDivId
' Purpose              :   Function is used for clearing the fields when page loads.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function clearFormData(elementDivId) {
	$("#" + elementDivId).find('input[type="text"]').each(function() {
		$(this).val('');
		removeErrorBorderClass($(this).attr('id'));
	});
	$("#" + elementDivId).find('input[type="tel"]').each(function() {
		$(this).val('');
		removeErrorBorderClass($(this).attr('id'));
	});
}

/********************************************************************************************
' Name                 :   hideErrorMsgDiv
' Return type          :    
' Input Parameter(s)   :   errorMsgDivId, mobErrorMsgDivId
' Purpose              :   Function is used for hiding the error message div when page reloads.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function hideErrorMsgDiv(frmCreateAccDiv, mobErrorMsgDivId) {
	var count = 1;
	var errorDivName = mobErrorMsgDivId.substring(0, mobErrorMsgDivId.length - 1);
	var $inputFields = $('#' + frmCreateAccDiv + ' :input');
	$inputFields.each(function() {
		$('#' + errorDivName + count).hide();
		count++;
	});
}

/********************************************************************************************
' Name                 :   enableDisableSubmit
' Return type          :   None 
' Input Parameter(s)   :   elementDivId, submitBtnId
' Purpose              :   Function is used for showing the success api response.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   14th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function enableDisableSubmit(frmElementDivId, submitBtnId, submitBtnIdBtm) {
	var buttonStatusEnabled = true;
	var $inputFields = $('#' + frmElementDivId + ' :input');
	$inputFields.each(function() {
		var inputType = $(this).attr('type');
		if(inputType && inputType != 'checkbox') {
			if($(this).hasClass('error_red_border') || !$(this).val()) {
				buttonStatusEnabled = false;
			}
		}
	});
	if($("#apiFundError_redBorder").hasClass('error_red_border1')){
		buttonStatusEnabled = false;
	}
	if(buttonStatusEnabled) {
		if(submitBtnId === "btnContinueChkOut" || submitBtnIdBtm === "btnContinueChkOut"){
			activateCheckoutPayButton();
			return;
		}
		submitBtnEnableUI(submitBtnId);		
		submitBtnEnableUI(submitBtnIdBtm);	
	} else {
		if(submitBtnId === "btnContinueChkOut" || submitBtnIdBtm === "btnContinueChkOut"){
			deActivateCheckoutPayButton();
			return;
		}
		submitBtnDisableUI(submitBtnId);
		submitBtnDisableUI(submitBtnIdBtm);	
	}
}

/********************************************************************************************
' Name                 :   submitBtnEnableUI
' Return type          :   None 
' Input Parameter(s)   :   submitBtnId
' Purpose              :   Function is used to changes the UI for enabled submit button.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   20th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function submitBtnEnableUI(submitBtnId) {
	$('#' + submitBtnId).removeClass('sv_submit_inactive_btn');
	$('#' + submitBtnId).addClass('sv_submit_active_btn');
	enableButton(submitBtnId);
}

/********************************************************************************************
' Name                 :   submitBtnDisableUI
' Return type          :    
' Input Parameter(s)   :   submitBtnId
' Purpose              :   Function is used to changes the UI for disabled submit button.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -   20th June,2013	   -   Karuna Mishra
'*******************************************************************************************/
function submitBtnDisableUI(submitBtnId) {
	$('#' + submitBtnId).removeClass('sv_submit_active_btn');
	$('#' + submitBtnId).addClass('sv_submit_inactive_btn');
	disableButton(submitBtnId);
}

/********************************************************************************************
' Name                 :   mobShowErrorMsgInDiv
' Return type          :   boolean
' Input Parameter(s)   :   frmMainDivId, errorMsgDivId, mobErrorMsgDiv
' Purpose              :   To show the error message in mobile view when page resizes.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function mobShowErrorMsgInDiv(frmMainDivId, errorMsgDivId, errorMainAreaDivId) {
	var flag = true;
	var count = 1;
	var errorDivName = errorMsgDivId.substring(0, errorMsgDivId.length - 1);
	var errorDivNameMain = errorMainAreaDivId.substring(0, errorMainAreaDivId.length - 1);
	var $inputFields = $('#' + frmMainDivId + ' :input');
	$inputFields.each(function() {
		var inputElementId = $(this).attr('id');
		if (inputElementId != "promoCodeDiscount1") {
			if ($(this).hasClass('error_red_border')) {
				var errorMsg = $('#' + errorDivName + count).text();
				if (errorMsg) {
					$('#' + "mob" + errorDivName + count).text(errorMsg);
					$('#' + "mob" + errorDivNameMain + count).show();
				} else {
					$('#' + "mob" + errorDivNameMain + count).hide();
				}

			}
			count++;
		}
		
		
	});
	return flag;
}

/********************************************************************************************
' Name                 :   mobShowErrorMsgInDivAddBiller
' Return type          :   boolean
' Input Parameter(s)   :   frmMainDivId, errorMsgDivId, mobErrorMsgDiv
' Purpose              :   To show the error message in mobile view when page resizes.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function mobShowErrorMsgInDivAddBiller(frmMainDivId, errorMsgDivId, mobErrorMsgDiv, mobErrorMainAreaDivId) {
	var flag = false;
	var count = 1;
	var $inputFields = $('#' + frmMainDivId + ' :input');
	$inputFields.each(function() {
		if(!flag){
			if($(this).hasClass('error_red_border')) {
				var inputElementId = $(this).attr('id');
				if(inputElementId.indexOf('replicaof') !== -1){
					errorMsgDivId += 'Dual';
					inputElementId = inputElementId.replace('replicaof', '');
				}
				var errorMsg = $('#' + errorMsgDivId + inputElementId + ' #errAddbillMsg').text();
				if(errorMsg) {
					$('#' + mobErrorMsgDiv).text(errorMsg);
					$('#' + mobErrorMainAreaDivId).show();
				} else {
					$('#' + mobErrorMainAreaDivId).hide();
				}
				
				flag = true;
			}
		}
		count++;
	});
	return flag;
}

/********************************************************************************************
' Name                 :   showMobileErrorAndChangeHeight
' Return type          :   
' Input Parameter(s)   :   rowBoxDivId, frmMainDivId, errorMsgDivId, mobErrorMainAreaDivId, mobErrorMsgDiv, frameHeight
' Purpose              :   To show the error message in mobile view when page resizes for Create Profile pages.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function showMobileErrorAndChangeHeight(rowBoxDivId, frmMainDivId, errorMsgDivId,errorMainAreaDivId, frameHeight){
	mobShowErrorMsgInDiv(frmMainDivId, errorMsgDivId, errorMainAreaDivId);
	return getFrameHeightWithErrorForMobile(frameHeight, errorMainAreaDivId);
}

/********************************************************************************************
' Name                 :   showErrorBoxOnStandard
' Return type          :   None
' Input Parameter(s)   :   frmMainDivId, errorMsgDiv, errorMsgDivStand
' Purpose              :   To show the error box on standard width when page resizes.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function showErrorBoxOnStandardWidth(frmMainDivId, errorMsgDiv, errorMsgDivStand) {
	$('#' + errorMsgDivStand).show();
	var count = 1;
	var errorDivName = errorMsgDiv.substring(0, errorMsgDiv.length - 1);
	var $inputFields = $('#' + frmMainDivId + ' :input');
	$inputFields.each(function() {
		var inputElementId = $(this).attr('id');
		if (inputElementId != "promoCodeDiscount1") {
		if($(this).hasClass('error_red_border')) {
			/* Removed due to new error handling changes */
			$('#' +"mob"+ errorDivName + count).hide();
		}
		count++;
		}
	});
}

/********************************************************************************************
' Name                 :   hideMobErrorMsgInDiv
' Return type          :   None
' Input Parameter(s)   :   frmMainDivId, mobErrorMsgDiv, mobErrorMainAreaDivId
' Purpose              :   To hide the error box on standard width when page resizes.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function hideMobErrorMsgInDiv(frmMainDivId, mobErrorMsgDiv, mobErrorMainAreaDivId) {
	var $inputFields = $('#' + frmMainDivId + ' :input');
	$inputFields.each(function() {
		if(!($(this).hasClass('error_red_border'))) {
			$('#' + mobErrorMsgDiv).text("");
			$('#' + mobErrorMainAreaDivId).hide();
		}
	});
}

/********************************************************************************************
' Name                 :   hideErrorMsgForStandrdWidth
' Return type          :   None
' Input Parameter(s)   :   frmMainDivId, errorMainAreaDivId
' Purpose              :   To hide the error box on standard width when page resizes.
' History Header       :   Version   -   Date              	-   Developer Name 
' Added By             :   1.0       -   28 June 2013   	-   Karuna Mishra
'*******************************************************************************************/
function hideErrorMsgForStandrdWidth(frmMainDivId,errorMainAreaDivId){
	var count = 1;
	var $inputFields = $('#' + frmMainDivId + ' :input');
	$inputFields.each(function() {
		if(!($(this).hasClass('mob_error_msg'))) {
			$('#' + "mob"+ errorMainAreaDivId+ count ).show();
		}
		count++;
	});
}