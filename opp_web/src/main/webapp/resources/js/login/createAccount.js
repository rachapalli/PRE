var INITAPITIMEOUT = 45000;
var termsId = "";
var createAccountFlag = false;
var selectedQuestionIndex, timeInteval;
var applicationId = "";

/**
 * Function is used for opening the Create Account page on the click of Get started button.
 */
function loadCreateAccountPage(_applicationId, messages, utmSource, utmCampaign) {
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		var ieVersion=new Number(RegExp.$1); // capture x.x portion and store as a number
		if(ieVersion < 8){
			$('#topProfileHeadBg').hide();
			$('#signUpContainerDiv').hide();
			/* To hide the progress bar */
			hideProgressBar();
			return;
		} 
	}
	applicationId = _applicationId;

	/* To hide the progress bar */
	showProgressBar();

	lastWindowWidth = $(window).width();
	lastWindowHeight = $(window).height();

	setCookie("isCreateProfileLoaded", true);
	var arg0 = '<a href="javascript:void(0)" onclick="showTermsUrl()">';
	var arg1 = '</a>';
	var message = formatMessage(messages['createAccount.termsAndConditions'], arg0, arg1);
	$("#createAccountTermCondArea").html(message);

	setUtmDataFromQueryStringToCookie(utmSource, utmCampaign);
	
	/* Show the check box for marketing Opt in */
	createOptInMsgAorBSection("chkOptInEnhCrtProf", "optInEhnChkCrtProf", messages['createAccount.optInEnh']);

	validateCreateAccountField();
	changeLanguageOfAcc();
	setIntervalForCreateAccInitSuccess();
	enableCreateAccountButton();
	
	var isUserChangeLanguage = getCookie("isUserChangeLanguageCreateProfile");
	if (isUserChangeLanguage == "true") {
		setCookie("isUserChangeLanguageCreateProfile", "false");
		fillOldData();
	}
	if($('#createAccount').is(':visible')){
		/*To hide the progress bar */
		hideProgressBar();
	}
	languageDropDownForIE8();
	setMarketingFrame();

	$("#frmCreateAcc").keypress(function (e) {
		var pressedKeyCode = e.keyCode || e.charCode;
		if (pressedKeyCode == 13) {
			if(!$('#createAccountBtn').is(':disabled') || !$('#createAccountBtnBtm').is(':disabled')){
				callCreateAccountOrUpgradeUser();
			}
		}
	});
}

function setMarketingFrame() {
	var url = messages['createAccount.image.desktop'];
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
    	url = messages['createAccount.image.mobile'];
    }
    $('#signUpImageRight').attr('src', url);
}

function callSubmitClick() {
    if (!$('#createAccountBtn').is(":disabled") || !$('#createAccountBtnBtm').is(':disabled') ){
        $('#createAccountBtn').click();
    }
}

/********************************************************************************************
 ' Name                 :   validateAddBillGuestCreateProfile
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This function used for validating the UI fields of create profile.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   09th july,2013       -   Karuna Mishra
 '*******************************************************************************************/
function validateCreateAccountField() {
	$("#password").keypress(function(e) {
		  if (e.which == 96 || e.which == 59)  {
			    e.preventDefault();
			}
	});
    $('#emailPrompt').blur(function () {
    	this.value = this.value.toLowerCase().trim();
        validateEmailInfo('emailPrompt', 'errorCrtAcctMainArea1', 'invalidMsgCreatAcc1', messages['createAccount.invalidEmailMsg'],
                          'frmCreateAcc', 'createAccountBtn','createAccountForm', 'createAccountBtnBtm');
        validateReenterEmail('emailPrompt', 'reEnterEmail', 'errorCrtAcctMainArea2', 'invalidMsgCreatAcc2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmCreateAcc', 'createAccountBtn', 'createAccountForm', 'createAccountBtnBtm');
    });

    $('#reEnterEmail').blur(function () {
    	this.value = this.value.toLowerCase().trim();
        validateReenterEmail('emailPrompt', 'reEnterEmail', 'errorCrtAcctMainArea2', 'invalidMsgCreatAcc2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmCreateAcc', 'createAccountBtn', 'createAccountForm', 'createAccountBtnBtm');
    });

    $('#password').blur(function () {
        passwordMatchUserName('reEnterEmail', 'password', 'errorCrtAcctMainArea7', 'invalidMsgCreatAcc7',
                              messages['createAccount.invalidpasswordMsgSame'], 'frmCreateAcc', 'createAccountBtn','createAccountForm', 'createAccountBtnBtm');
    });

    $('#phonePrompt').blur(function () {
        validatePhoneInfo('phonePrompt', 'errorCrtAcctMainArea3', 'invalidMsgCreatAcc3', messages['createAccount.invalidphoneMsg'],
                          'frmCreateAcc', 'createAccountBtn','createAccountForm', 'createAccountBtnBtm');
    });

    $('#zipCodePrompt').blur(function () {
        validateZipcodeInfo('zipCodePrompt', 'errorCrtAcctMainArea4', 'invalidMsgCreatAcc4', messages['createAccount.invalidzipCodeMsg'],
                            'frmCreateAcc', 'createAccountBtn','createAccountForm', 'createAccountBtnBtm');
    });
    customKeypressValidator('phonePrompt');
}

/********************************************************************************************
 ' Name                 :   enableCreateAccountButton
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for Enable the create account button on create
 account page after all filed is filled.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th july,2013       -   Karuna Mishra
 '*******************************************************************************************/
function enableCreateAccountButton() {
	if( (navigator.userAgent).match(/Android 2/i) ) {
		$('#createAccountForm').oneFingerScroll();
		setExtraMarginForAndroid('frmCreateAcc');
	}
    timeInteval = setInterval("enableDisableSubmit('createAccountForm', 'createAccountBtn', 'createAccountBtnBtm')", 500);
}

/********************************************************************************************
 ' Name                 :   callCreateAccountOrUpgradeUser
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This function used for calling the API to register a new user or
 upgrade a guest user when user clicks on Signup in Main_Paymnet_page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th July,2013       -   Karuna Mishra
 '*******************************************************************************************/
function callCreateAccountOrUpgradeUser() {
	var userId = getCookie("userId");
	/* Added undefined check, sometimes userId added as undefined on URL, while upgrading guest user.*/
    if (userId && userId !== "undefined" && userId !== null) {
        upgradeGuestUserToRegistered(6, 'frmCreateAcc');
    } else {
        handleCreateAccount();
    }
}

/**
 * Function is used for sending request USER_INT_REG api to crate new user.
 */
function handleCreateAccount() {
    /* To show the progress bar */
    showProgressBar();

    var request = {};
    var locale = getCookie("locale");
    var utmSource = getCookie("utmSource");
    var utmCampaign = getCookie("utmCampaign");
    request.applicationId = applicationId;
    request.locale = locale;
    request.timeZone = calculate_time_zone();
    if (createAccountFlag) {
        request.userName = $('#emailPrompt').val();
    } else {
        request.userName = $('#username').val();
    }
    request.password = $('#password').val();
    request.firstName = messages['createAccount.firstNameInput'];
    request.middleInitial = null;
    request.lastName = messages['createAccount.lastNameInput'];
    request.address1 = null;
    request.address2 = null;
    request.city = null;
    request.state = null;
    request.zip = $('#zipCodePrompt').val();
    request.email = $('#emailPrompt').val();
    request.mobilePhone = $('#phonePrompt').val();
    request.mobileCarrierId = null;
    request.pin = null;
    request.contactPreference = "BOTH";
    request.securityQuestion = $('#securityQuestionforCreateAct').val();
    request.answer = $('#securityAnswerforCreateAct').val();
    request.acceptedTermId = localStorage.getItem("init_app_currentterms_id");
    if(utmSource) {
    	request.utmSource = utmSource;
    }
    if(utmCampaign) {
    	request.utmCampaign = getCookie("utmCampaign");
    }
    var $checkboxFields = $('#' + 'createAccountForm' + ' input[type=checkbox]');
    $checkboxFields.each(function() {
		if($(this).is(":checked")) {
			request.marketingOptIn  = "true";
		} else {
			request.marketingOptIn  = "false";
		}
	});

    var call_user_init_reg = new user_init_reg(request);
    call_user_init_reg.call();
}

function handleUserInitRegOnSuccess(){
	setCookie("userId", user_init_reg_obj.user.id);
	setCookie("userName", user_init_reg_obj.user.username);
	setCookie("walletId", user_init_reg_obj.wallet.id);
	setCookie("userAccountNumber", user_init_reg_obj.wallet.accountNum);

	gaHandleSignup(applicationId,user_init_reg_obj.user.id,false);

	/* To clear the time interval set at page start to check the fields */
	clearInterval(timeInteval);
	localStorage.setItem("registerUser", true);
	setCookie('isSignedUp', true);
	location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + "#searchBiller";
	/* To hide the progress bar */
	if ($("#searchBillerSec").is(":visible")) {
		hideProgressBar();
	}
}

/**
 * Function is used for redirecting user to login page after click on cancel button.
 */
function loadLoginpage() {
    moveToLoginPage();
}

/**
 * Function is used for getting security questions from INIT_APP Api.
 */
function getSecurityQuestionsForCreateAcc() {
    var securityQuestionArr = localStorage.getItem("securityQuestionArr");

    var securityQuestions = new Array();
    securityQuestions = securityQuestionArr.split(",");

    var sel = document.getElementById('securityQuestionforCreateAct');
    for (var i = 0; i < securityQuestions.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = securityQuestions[i];
        opt.value = securityQuestions[i];
        sel.appendChild(opt);
    }
    $("select#securityQuestionforCreateAct").prop('selectedIndex',
                                                  selectedQuestionIndex);
    apiTimeOutVal = JSON.parse(localStorage.getItem("apiTimeOuts"));
    checkEmailAsUserId();
    /*Checking if username flag value */
    if (createAccountFlag) {
        $("#createAccount_userName").remove();
        $("#setUserDefinekeyMsg").html(messages['createAccount.emailFeatureMsg'] + "<span class='red-astrick'>*</span>");

        $("#createAccount_phone").insertAfter("#createAccount_reEnterEmail");
        /*$("#errorSepratorCreatAcc3").insertAfter("#errorSepratorCreatAcc2");*/
        $('#chkAcceptTerms').attr("checked", false);
        $('#emailPrompt').focus();
    } else {
        $('#chkAcceptTerms').attr("checked", false);
        $('#phonePrompt').focus();
    }
    $("#createAccount").show();
    showScreenAndSetHeight(null, 'createAccountForm');
}

/**
 * get Data from cookies, decode the Base64 data and fill the form with Data.
 */
function fillOldData() {
    // get Data from cookies after refresh the page.
    var oldDataObject = JSON.parse(Base64.decode(localStorage.getItem("createProfileFormData")));
    if (createAccountFlag) {
        $('#emailPrompt').val(oldDataObject.userName);
    } else {
        $('#username').val(oldDataObject.userName);
    }
    $('#password').val(oldDataObject.password);
    $('#passwordReEentry').val(oldDataObject.reEnterPassword);
    $('#zipCodePrompt').val(oldDataObject.zip);
    $('#emailPrompt').val(oldDataObject.email);
    $('#reEnterEmail').val(oldDataObject.reEnterEmail);
    $('#phonePrompt').val(oldDataObject.mobilePhone);
    $("select#securityQuestionforCreateAct").prop('selectedIndex', Number(oldDataObject.securityQuestion));
    $('#securityAnswerforCreateAct').val(oldDataObject.answer);
    $('#chkAcceptTermsCreate').attr("checked", oldDataObject.chkBoxStatus);
    selectedQuestionIndex = Number(oldDataObject.securityQuestion);
}

/**
 * Function changes the locale of page according to locale find in cookie or
 * default.
 */
function changeLanguageOfAcc() {
    locale = getLocaleValueOfAcc();
    selIndex = eval(getCookie('localeIndex'));
    /* change page language as per locale selection. */ 
    /*$('.toggle').html(document.getElementById("langDD").options[selIndex].text
                    + '<span class="caret"></span>');*/
    if (checkForInitAppCall()) {
    	getSecurityQuestionsForCreateAcc();
    	footerUrlName = JSON.parse(localStorage.getItem("footerURls"));
    } else {
    	var call_init_app = new init_app(locale);
    	call_init_app.call();
    }
}

function setIntervalForCreateAccInitSuccess(){
	apiSuccessCountDownCreateAccInitSuccess = setInterval("checkBooleanValueForCreateAccInitSuccess();", 500);
}

/********************************************************************************************
' Name                 :   checkBooleanValueOfApiVariable
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Clear the interval.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
'*******************************************************************************************/
function checkBooleanValueForCreateAccInitSuccess(){
	if (isInitAppCalledSuccess) {
		getSecurityQuestionsForCreateAcc();
		footerUrlName = JSON.parse(localStorage.getItem("footerURls"));
		clearIntervalApp(apiSuccessCountDownCreateAccInitSuccess);
	}
}

/**
 * Fetch the locale from the cookie, if not in cookies set the default locale.
 */
function getLocaleValueOfAcc() {
    var locale = getCookie('locale');
    // Checking the locale value and Setting the locale in to cookie.
    if (locale === null || locale === "") {
        locale = 'en_US';
        setCookie('locale', locale, 365);
    }
    if (locale.indexOf("es") !== -1) {
        setCookie('localeIndex', 2);
    } else {
        setCookie('localeIndex', 1);
    }
    return locale;
}

/**
 * This method is use for checking new feature and enable email id as user name.
 */
function checkEmailAsUserId() {
	initAppFeatureName = JSON.parse(localStorage.getItem("featureNames"));
    var enabled = initAppFeatureName["EMAIL_IS_USERNAME"];
    if (enabled === true) {
        createAccountFlag = true;
        return;
    }
}

function createProfileResize() {
	var currentWindowWidth = $(window).width();
	if(!(navigator.userAgent).match(/Android/i) || lastWindowWidth != currentWindowWidth) {
		clearTimeout(this.id);
	    this.id = setTimeout(showScreenAndSetHeight(null, 'createAccountForm'), 500);
	    lastWindowWidth = currentWindowWidth;
	    setMarketingFrame();
	}
}
