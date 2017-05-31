/*******************************************************************************
 * Code for showing the create account page and additional info box as per the
 * condition
 *****************************************************************************/
var isGrtr = false;
var submitBtnAddInfoCountdown, chkRegisterBtnCount;

/********************************************************************************************
' Name                 :   showTotalPaymentAndDue
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to show additional info or create user section for guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function showTotalPaymentAndDue() {
    var totalDueAmt = getFormatedNumber($("#amountDueTotal").text(), false);
    var totalPaymentAmt = getFormatedNumber($("#cashSummaryTotalAmount").text(), false);
    if ((totalPaymentAmt > totalDueAmt)) {
        isGrtr = true;
        showCreateProfAndAdditionalInfoBox(isGrtr);
    } else if ((totalPaymentAmt < totalDueAmt)) {
        deActivateCheckoutPayButton();
        $("#btnContinueChkOut").val(messages['checkout.lbl_submit_payment']);
        $("#btnBigContinueChkOut").val(messages['checkout.lbl_submit_payment']);
        if(!isRegisterSelected) {
        	$("#createAccountBoxChkOut").hide();
	        $("#additional_info_box").hide();
	        clearInterval(submitBtnAddInfoCountdown);
	        clearInterval(submitBtnCreateProfCountdown);
	        clearIntervalApp(chkRegisterBtnCount);
        }
    } else if ((totalPaymentAmt === totalDueAmt)) {
        isGrtr = false;
        showCreateProfAndAdditionalInfoBox(isGrtr);
        var registerUser = parseBoolean(localStorage.getItem("registerUser"));
        if(!registerUser) {
        	$("#discountAndPromoCodeReg").show();
        	$("#promoCodeBox").show();
        }
    }
}

/********************************************************************************************
' Name                 :   showCreateProfAndAdditionalInfoBox
' Return type          :   None
' Input Parameter(s)   :   amountIsGrtr
' Purpose              :   This method is to show additional info section for guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function showCreateProfAndAdditionalInfoBox(amountIsGrtr) {
	var registerUser = parseBoolean(localStorage.getItem("registerUser"));
	/*Show the check box for marketing Opt in */
	if (registerUser === false) {
		if(!isRegisterSelected) {
			if (amountIsGrtr === true) {
				displayCreateAccountForGuest();
				clearFormField("additional_info_box");
			} else {
				displayAdditionalInfoForGuest();
				clearFormField("createAccountBoxChkOut");
			}
		}
		$("#chkPromoCode").prop('checked', false);
		$("#chkPromoCodeIcon").removeClass("add_bill_activ_chkbox_icon flt_lft");
		$("#chkPromoCodeIcon").addClass("add_bill_inactiv_chkbox_icon flt_lft");
		$("#frmGuestPromoCodeRes").hide();
	}
}

/********************************************************************************************
' Name                 :   checkForCreateAccountSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to display Create Account	section for guest user if user selects Register.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   17th June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function checkForCreateAccountSection() {
	isRegisterSelected = true;
	displayCreateAccountForGuest();
}

/********************************************************************************************
' Name                 :   displayCreateAccountForGuest
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to display and update the area for Create Account	section for guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   17th June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function displayCreateAccountForGuest() {
	var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
	var arg1 = '</a>';
	$("#chkoutAddInfoMobErrorMsgDiv").hide();
	/* Show the check box for marketing Opt in */
	createOptInMsgAorBSection("chkOptInEnhCreatProf", "optInEhnChkCreatProf", messages['createAccount.optInEnh']);
	/* Commenting the code as per the Bug 4822
	$("#btnContinueChkOut").val(messages['checkout.lbl_save_and_submit_payment']);
	$("#btnBigContinueChkOut").val(messages['checkout.lbl_save_and_submit_payment']);*/
	var message = formatMessage(messages['checkout.guestUserPromoCodeRegisterTermCond'], arg0, arg1);
	$("#chkoutCreateProfTermsCondAre").html(message);
	if($("#additional_info_box").is(':visible')) {
		fillPromoRegisterFromAdditionalInfo();
	}
	if($("#createAccountBoxChkOut").is(':hidden')) {
		fillCreateProfileFromPromoRegister();
		$("#createAccountBoxChkOut").show();
	}
	$("#additional_info_box").hide();
	registerCreateProfileToValidate();
	enableCreateAccCheckoutRegisterBtn();
	if($('#guestSchedPayPopup').is(':visible')) {
		closeAnimatedPopup('schedulePayGuestPopUpId', 'guestSchedPayPopup');
	}
}

/********************************************************************************************
' Name                 :   displayAdditionalInfoForGuest
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to display and update the area for Additional info 
							section for guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   17th June, 2013     -   Karuna Mishra
'*******************************************************************************************/
function displayAdditionalInfoForGuest() {
	var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
	var arg1 = '</a>';
	clearFormData('additional_info_box_fields');
	$("#chkoutMobErrorMsgDiv").hide();
	/* Show the check box for marketing Opt in */
	createOptInMsgAorBSection("chkOptInEnhAddInfo", "optInEhnChkAddInfo", messages['createAccount.optInEnh.guest']);
	$("#btnContinueChkOut").val(messages['checkout.lbl_submit_payment']);
	$("#btnBigContinueChkOut").val(messages['checkout.lbl_submit_payment']);
	var message = formatMessage(messages['checkout.termCondition'], arg0, arg1);
	$("#addInfoTermsCondAre").html(message);
	if($("#createAccountBoxChkOut").is(':visible')) {
		fillPromoRegisterFromCreateProfile();
	}
	$("#additional_info_box").show();
	$("#createAccountBoxChkOut").hide();
	fillAdditionalInfoFromPromoRegister();
	clearIntervalApp(chkRegisterBtnCount);
	registerAdditionalInfoToValidate();
}

/********************************************************************************************
' Name                 :   registerCreateProfileToValidate
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to register the field for blur event to validate 
							the data for Create Account Info form for Guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function registerCreateProfileToValidate() {
    $('#emailIdChkOut').blur(function () {
    	this.value = this.value.toLowerCase();
        validateEmailInfo('emailIdChkOut', 'errorMainAreaChkOut1', 'invalidMsgChkOut1', messages['createAccount.invalidEmailMsg'],
                          'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
    });
    $('#confrmEmailIdChkOut').blur(function () {
    	this.value = this.value.toLowerCase();
        validateReenterEmail('emailIdChkOut', 'confrmEmailIdChkOut', 'errorMainAreaChkOut2', 'invalidMsgChkOut2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
    });
    $('#passwordChkOut').blur(function () {
        passwordMatchUserName('emailIdChkOut', 'passwordChkOut', 'errorMainAreaChkOut3', 'invalidMsgChkOut3',
                              messages['createAccount.invalidpasswordMsgSame'], 'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
    });
    $('#mobileNoChkOut').blur(function () {
        validatePhoneInfo('mobileNoChkOut', 'errorMainAreaChkOut4', 'invalidMsgChkOut4', messages['createAccount.invalidphoneMsg'],
                          'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
    });
    $('#zipCodeChkOut').blur(function () {
        validateZipcodeInfo('zipCodeChkOut', 'errorMainAreaChkOut5', 'invalidMsgChkOut5', messages['createAccount.invalidzipCodeMsg'],
                            'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
    });
    customKeypressValidator('mobileNoChkOut');
}

/********************************************************************************************
' Name                 :   registerAdditionalInfoToValidate
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to register the field for blur event to validate 
							the data for Additional Info form for Guest user.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function registerAdditionalInfoToValidate() {
    $('#emailIdAddInfoChkOut').blur(function () {
    	this.value = this.value.toLowerCase();
        validateEmailInfo('emailIdAddInfoChkOut', 'errorMainAreaAddInfoChkOut1', 'invalidMsgAddInfoChkOut1',
        		messages['createAccount.invalidEmailMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
    });
    $('#mobileNoAddInfoChkOut').blur(function () {
        validatePhoneInfo('mobileNoAddInfoChkOut', 'errorMainAreaAddInfoChkOut2', 'invalidMsgAddInfoChkOut2',
        		messages['createAccount.invalidphoneMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut','chkoutPaymentSec');
    });
    $('#zipCodeAddInfoChkOut').blur(function () {
        validateZipcodeInfo('zipCodeAddInfoChkOut', 'errorMainAreaAddInfoChkOut3', 'invalidMsgAddInfoChkOut3',
        		messages['createAccount.invalidzipCodeMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
    });
    customKeypressValidator('mobileNoAddInfoChkOut');
}

/********************************************************************************************
' Name                 :   validateAdditionalInfoForCards
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to validate the data for Additional Info form for 
							Guest user in case of paying by Card section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateAdditionalInfoForCards() {
	$('#emailIdAddInfoChkOut').blur(function() {
		this.value = this.value.toLowerCase();
		validateEmailInfoForGuest('emailIdAddInfoChkOut', 'errorMainAreaAddInfoChkOut1', 'invalidMsgAddInfoChkOut1', 
				messages['createAccount.invalidEmailMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
	});
	$('#mobileNoAddInfoChkOut').blur(function() {
		validatePhoneInfoForGuest('mobileNoAddInfoChkOut', 'errorMainAreaAddInfoChkOut2', 'invalidMsgAddInfoChkOut2', 
				messages['createAccount.invalidphoneMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
	});
	$('#zipCodeAddInfoChkOut').blur(function() {
		validateZipcodeInfoForGuest('zipCodeAddInfoChkOut', 'errorMainAreaAddInfoChkOut3', 'invalidMsgAddInfoChkOut3', 
				messages['createAccount.invalidzipCodeMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
	});
	customKeypressValidator('mobileNoAddInfoChkOut');
}

/********************************************************************************************
' Name                 :   validateAdditionalInfo
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to validate the data for Additional Info form for 
							Guest user onClick of PAY button. 
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateAdditionalInfo(){
	validateEmailInfo('emailIdAddInfoChkOut', 'errorMainAreaAddInfoChkOut1', 'invalidMsgAddInfoChkOut1',
            messages['createAccount.invalidEmailMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
	validatePhoneInfo('mobileNoAddInfoChkOut', 'errorMainAreaAddInfoChkOut2', 'invalidMsgAddInfoChkOut2',
            messages['createAccount.invalidphoneMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut','chkoutPaymentSec');
	validateZipcodeInfo('zipCodeAddInfoChkOut', 'errorMainAreaAddInfoChkOut3', 'invalidMsgAddInfoChkOut3',
            messages['createAccount.invalidzipCodeMsg'], 'frmGuestAddInfoChkOut', 'btnContinueChkOut', 'chkoutPaymentSec');
}

/********************************************************************************************
' Name                 :   validateCreateProfile
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is to validate the data for Create Profile form for 
							Guest user onClick of PAY button. 
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateCreateProfile() {
	validateEmailInfo('emailIdChkOut', 'errorMainAreaChkOut1', 'invalidMsgChkOut1', messages['createAccount.invalidEmailMsg'],
            'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
	 
	validateReenterEmail('emailIdChkOut', 'confrmEmailIdChkOut', 'errorMainAreaChkOut2', 'invalidMsgChkOut2',
             messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
	 
	passwordMatchUserName('emailIdChkOut', 'passwordChkOut', 'errorMainAreaChkOut3', 'invalidMsgChkOut3',
             messages['createAccount.invalidpasswordMsgSame'], 'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
	
	validatePhoneInfo('mobileNoChkOut', 'errorMainAreaChkOut4', 'invalidMsgChkOut4', messages['createAccount.invalidphoneMsg'],
             'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
	 
	validatePhoneInfo('mobileNoChkOut', 'errorMainAreaChkOut4', 'invalidMsgChkOut4', messages['createAccount.invalidphoneMsg'],
             'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
	
	validateZipcodeInfo('zipCodeChkOut', 'errorMainAreaChkOut5', 'invalidMsgChkOut5', messages['createAccount.invalidzipCodeMsg'],
             'frmGuestCreateAccChkOut', 'createAccChkRegisterBtn','chkoutPaymentSec');
}

/********************************************************************************************
' Name                 :   validateEmailInfoForGuest
' Return type          :   None
' Input Parameter(s)   :   emailElementDiv, errorMainAreaDivId,	errorMsgDivId, errorMsgText, 
							frmElementDivId, submitBtnId, mobRowBoxDivId
' Purpose              :   This method is to validate the data of Email Id field for Guest User.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateEmailInfoForGuest(emailElementDiv, errorMainAreaDivId, errorMsgDivId, 
		errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId) {
	var emailRegEx = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	customValidatorForGuest(emailElementDiv, emailRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
			frmElementDivId, submitBtnId, mobRowBoxDivId);
}

/********************************************************************************************
' Name                 :   validateZipcodeInfoForGuest
' Return type          :   None
' Input Parameter(s)   :   zipcodeElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
							frmElementDivId, submitBtnId, mobRowBoxDivId
' Purpose              :   This method is to validate the data of ZipCode field for Guest User.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validateZipcodeInfoForGuest(zipcodeElementId, errorMainAreaDivId, errorMsgDivId, 
		errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId) {
	var zipRegEx = /^\d{5}$/;
	customValidatorForGuest(zipcodeElementId, zipRegEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
			frmElementDivId, submitBtnId, mobRowBoxDivId);
}

/********************************************************************************************
' Name                 :   validatePhoneInfoForGuest
' Return type          :   None
' Input Parameter(s)   :   phoneElementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
							frmElementDivId, submitBtnId, mobRowBoxDivId
' Purpose              :   This method is to validate the data of Phone field for Guest User.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function validatePhoneInfoForGuest(phoneElementId, errorMainAreaDivId, errorMsgDivId, 
		errorMsgText, frmElementDivId, submitBtnId, mobRowBoxDivId) {
	var phoneRegEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	customValidatorForGuest(phoneElementId, phoneRegEx, errorMainAreaDivId,	errorMsgDivId, 
			errorMsgText, frmElementDivId, submitBtnId,	mobRowBoxDivId);
	formatPhoneNo('#' + phoneElementId);
}

/********************************************************************************************
' Name                 :   customValidatorForGuest
' Return type          :   None
' Input Parameter(s)   :   elementId, regEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
								frmElementDivId, submitBtnId, mobRowBoxDivId
' Purpose              :   This method is common to validate all the field data of form for Guest User.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function customValidatorForGuest(elementId, regEx, errorMainAreaDivId, errorMsgDivId, errorMsgText, 
		frmElementDivId, submitBtnId, mobRowBoxDivId) {
	var elementValue = $('#' + elementId).val();
	if (elementValue) {
		if (regEx.test(elementValue)) {
			hideErrorBox(frmElementDivId, elementId, errorMainAreaDivId, errorMsgDivId,mobRowBoxDivId);
		} else {
			showErrorBox(elementId, errorMainAreaDivId, errorMsgDivId, errorMsgText, mobRowBoxDivId);
		}
	} else {
		hideErrorBox(frmElementDivId, elementId, errorMainAreaDivId,errorMsgDivId, mobRowBoxDivId);
	}
}

/********************************************************************************************
' Name                 :   enableDisableSubmitForGuest
' Return type          :   None
' Input Parameter(s)   :   frmElementDivId, submitBtnId
' Purpose              :   This method is to validate the data of form for Guest User and enable PAY button.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2013     -   Karuna Mishra
'*******************************************************************************************/
function enableDisableSubmitForGuest(frmElementDivId) {
	var regxObj = new Object();
	regxObj["zipCodeAddInfoChkOut"] = /^\d{5}$/;
	regxObj["emailIdAddInfoChkOut"] = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	regxObj["mobileNoAddInfoChkOut"] = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	var zipFlag = false;
	var emailFlag = false;
	var phoneFlag = false;
	
	var $inputFields = $('#' + frmElementDivId + ' :input');
	$inputFields.each(function() {
		var regEx = regxObj[$(this).attr('id')];
		if (regEx && regEx.test($(this).val())) {
			if($(this).attr('id') == "zipCodeAddInfoChkOut"){
				zipFlag = true;
				hideErrorBox("frmGuestAddInfoChkOut", "zipCodeAddInfoChkOut", "errorMainAreaAddInfoChkOut3", "invalidMsgAddInfoChkOut3","chkoutPaymentSec");
			}else if($(this).attr('id') == "emailIdAddInfoChkOut"){
				emailFlag = true;
				hideErrorBox("frmGuestAddInfoChkOut", "emailIdAddInfoChkOut", "errorMainAreaAddInfoChkOut1", "invalidMsgAddInfoChkOut1","chkoutPaymentSec");
			}else if($(this).attr('id') == "mobileNoAddInfoChkOut"){
				phoneFlag = true;
				hideErrorBox("frmGuestAddInfoChkOut", "mobileNoAddInfoChkOut", "errorMainAreaAddInfoChkOut2", "invalidMsgAddInfoChkOut2","chkoutPaymentSec");
			}
		}
	});
	if(zipFlag && emailFlag && phoneFlag){
		activateCheckoutPayButton();
	} else {
		deActivateCheckoutPayButton();
	}
}

/******************************************************************************************
Name                 :   enableCheckoutAddSubmitButton
Return type          :   None
Input Parameter(s)   :   None
Purpose              :   To check and enable and disable the submit button of Additional Info section.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   17th June, 2013   -   Karuna Mishra
*******************************************************************************************/
function enableCheckoutAddSubmitButton() {
	clearIntervalApp(submitBtnCreateProfCountdown);
	/* To check the status of fields at 500 ms interval and if Ok enable the Submit button*/
	submitBtnAddInfoCountdown = setInterval("enableDisableSubmit('frmGuestAddInfoChkOut', 'btnContinueChkOut')", 500);
}

/********************************************************************************************
' Name                 :   enableCheckoutRegisterBtn
' Return type          :   None
' Input Parameter(s)   :   request obj
' Purpose              :   Function is used for enabling/Disabling the Register button.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function enableCheckoutRegisterBtn() {
	/* To check the status of fields at 500 ms interval and if Ok enable the Register button*/
	chkPromoCodeRegisterBtnCount = setInterval("enableDisablePromoResSubmit('frmGuestPromoCodeRes', 'btnRegisterPromoCode')", 500);
}

/********************************************************************************************
' Name                 :   enableCreateAccCheckoutRegisterBtn
' Return type          :   None
' Input Parameter(s)   :   request obj
' Purpose              :   Function is used for enabling/Disabling the Register button.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Feb,2014      -   Karuna Mishra
'*******************************************************************************************/
function enableCreateAccCheckoutRegisterBtn() {
	/* To check the status of fields at 500 ms interval and if Ok enable the Register button*/
	chkRegisterBtnCount = setInterval("enableDisableSubmit('createAccountBoxChkOut', 'createAccChkRegisterBtn')", 500);
}

function enableRecieptCreateSubmitButton() {
	submitBtnCreateProfCountdown = setInterval("enableDisableSubmit('createAccountBoxSummary', 'btnContinueSummary')", 500);
}

function enableDetailCreateSubmitButton() {
	submitBtnCreateProfDetailCountdown = setInterval("enableDisableSubmit('createAccountBoxDetail', 'btnContinueDetail')", 500);
}

/******************************************************************************************
Name                 :   useSameOrDifferentdebitCard
Return type          :   None
Input Parameter(s)   :   None
Purpose              :   To check and enable and disable the submit button.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   17th June, 2013   -   Karuna Mishra
*******************************************************************************************/
function useSameOrDifferentdebitCard(current){
	if(current.id === 'sameDebitcardNew') {
		closeAnimatedPopup('idOfDebitCardPopUpErrorNew', 'mainContainIdNew');
		showAnimatedPopup('cvvFill', 'mainContainIdNewPop');
	} else if(current.id === 'differentDebitcardNew') {
		closeAnimatedPopup('idOfDebitCardPopUpErrorNew', 'mainContainIdNew');
		activateCheckoutPayButton();
	}
}

function enableDisablePromoResSubmit(frmElementDivId, submitBtnId) {
	var buttonStatusEnabled = true;
	var $inputFields = $('#' + frmElementDivId + ' :input');
	$inputFields.each(function() {
		var inputType = $(this).attr('type');
		if(inputType && inputType != 'checkbox' && $(this).attr('id') != 'promoCodeDiscount1') {
			if($(this).hasClass('error_red_border') || !$(this).val()) {
				buttonStatusEnabled = false;
			}
		}
	});
	if(buttonStatusEnabled) {
		submitBtnEnableUI(submitBtnId);
	}else {
		submitBtnDisableUI(submitBtnId);
	}
}