var phoneDeviceID = "";

var walletId = "";
var resetPasswordUserId;
var isUserName = false;
var checkValidation = false;
var counter = 0;
var fromUserBlur = false;

var EXPIRED_PASSWORD = "USER_AUTH_EXPIRED_PWD";
var BAD_CREDENTIALS = "USER_AUTH_BAD_CREDENTIALS";
var ACCOUNT_LOCKED = "USER_AUTH_ACCOUNT_LOCKED";
var NEED_ACCEPTANCE = "USER_AUTH_TERMS_NEED_ACCEPTANCE";
var USER_MISMATCH = "USER_TERMS_USER_MISMATCH";
var TERMS_NOT_FOUND = "USER_TERMS_TERMS_NOT_FOUND";
var TYPE_MISMATCH = "USER_TERMS_TYPE_MISMATCH";

var validationFlagEmail = false;
var validationFlagPass = false;
var validationFlagUser = false;

var tempLoginName ="";
var applicationId = "";

/********************************************************************************************
 ' Name                 :   init_login_page
 ' Return type          :   None
 ' Input Parameter(s)   :   resourceAppId, messages
 ' Purpose              :   Function is used for loading the login page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th Nov,2012      -   Karuna Mishra
 '*******************************************************************************************/
function init_login_page(_applicationId, utmSource, utmCampaign, messages, utmContent) {
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		var ieVersion=new Number(RegExp.$1); // capture x.x portion and store as a number
		if(ieVersion < 8){
			/* To hide the progress bar */
            hideProgressBar();
            $('#topHeadBg').hide();
			return;
		} 
	}
	applicationId = _applicationId;
	
    init_login_messages();
    changeLanguage();
    setIntervalForLoginInitSuccess();
    var isUserChangeLanguage = getCookie("isUserChangeLanguageLogin");
    if (isUserChangeLanguage == "true") {
        setCookie("isUserChangeLanguageLogin", "false");
        fillOldLoginData();
    }
    languageDropDownForIE8();
    /* If user agent is iPhone or iPad not to show Google play icon */
    if(("wrapper" != utmContent || null === utmContent || typeof utmContent === "undefined" || utmContent)){
    	if(/(iPhone|iPad)/i.test(navigator.userAgent)){
    		$("#googlePlayIcon").hide();
    	}
    	if(/(android)/i.test(navigator.userAgent)){
    		$("#appStoreIcon").hide();
    	}
    }
    setUtmDataFromQueryStringToCookie(utmSource, utmCampaign);
    
    /* Creating message to shown on sign up area on login page */
    var arg0 = '<a href="javascript:void(0)" onclick="showTermsUrl()">';
    var arg1 = '</a>';
    var message = formatMessage(messages['createAccount.termsAndConditions'], arg0, arg1);
    $("#loginSignupTermCondArea").html(message);
    
    /* Show the check box for marketing Opt in */
    createOptInMsgAorBSection("chkOptInEnhCrtProf", "optInEhnChkCrtProf", messages['createAccount.optInEnh']);
    setMarketingFrameOfLoginSignUp();
}

function setIntervalForLoginInitSuccess(){
	apiSuccessCountDownLoginInitSuccess = setInterval("checkBooleanValueLoginInitSuccess();", 500);
}


/********************************************************************************************
' Name                 :   checkBooleanValueOfApiVariable
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Clear the interval.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
'*******************************************************************************************/
function checkBooleanValueLoginInitSuccess(){
	if (isInitAppCalledSuccess) {
		showScreenAndSetHeight('loginContainerDiv', 'login_area_jsp');
		var enabled = initAppFeatureName["ACCOUNT_REGISTRATION"];
		if(enabled === true){
			$("#createProfileArea").show();
		}
		showEmailAsUserId();
		showCheckOutPage();
		var windowsize = $(window).width();
	    if (windowsize <= minimumWindowWidthForMobile) {
	    	showFooterButtonOnLoginPage();
	    } else {
	    	$("#home_footer").show();
	    }
	    getUserNameFromCookieForRememberMe();
		onBlurValidationForLogin();
		clearIntervalApp(apiSuccessCountDownLoginInitSuccess);
	}
}

/**
 * This method is use for checking email is enable for username or not.
 */
function showEmailAsUserId() {
    isUserName = initAppFeatureName["EMAIL_IS_USERNAME"];
    if (isUserName) {
        $("#lblUserName").text(messages['login.emailid']);
        $("#login_txt").attr("placeholder", messages['login.email_input']);
        $("#lblUserNameForgt").text(messages['forgetPassword.tip.label']);
        $("#login_name").attr("placeholder", messages['login.email_input']);
    } else {
    	$("#lblUserName").text(messages['login.userid']);
        $("#login_txt").attr("placeholder", messages['login.user_input']);
    }
}

/**
 * Used for display CheckOutPage for submit payments.
 */
function showCheckOutPage() {
    var enabled = initAppFeatureName["GUEST_USER"];
    var enabledChk = initAppFeatureName["CHECKOUT"];
    if (enabled === true && enabledChk === true) {
        $("#guestUser").show();
        $("#locatorShowId").hide();
        return;
    }
    $("#guestUser").hide();
}

/*******************************************************************************
 * ' Name : showFooterButtonOnLoginPage ' Return type : None ' Input
 * Parameter(s) : None ' Purpose : This method is used for show or hide locator
 * and more button. ' History Header : Version - Date - Developer Name ' Added
 * By : 1.0 - 17th Aug,2013 - Ravi Raj '
 ******************************************************************************/
function showFooterButtonOnLoginPage(){
	$("#home_footer").show();
    $("#footerHomeTab").hide();
    $("#footerHistoryTab").hide();
	if(initAppFeatureName["LOCATOR"]) {
        $("#locator_tag").show();
        // show locator footer on mobile.
        $(".wd_mob_foot").each(function (){
        	$(this).removeClass(".wd_mob_foot").addClass("wd_moblogin_foot");
 	    	$("#mob_fotr_add_money").addClass("footer_login_cls");
 	    	$(".dmy_cls").addClass("footer_login_cls1");
 	    	$("#mob_fotr_more").addClass("footer_login_cls");
 	    	$(".dmy_cls").addClass("footer_login_cls1");
 	    	
        });
    } else {
     	// change css
     	$(".wd_mob_foot").each(function (){
     		$(this).removeClass(".wd_mob_foot").addClass("wd_moblogin_foot1");
     	});
    }
	setSectionHeightForMobile();
}

/********************************************************************************************
 ' Name                 :   init_login_messages
 ' Return type          :   None
 ' Input Parameter(s)   :   messages
 ' Purpose              :   Function is used for assiging the property file value to js variables.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   2nd April,2013    -   Karuna Mishra
 '*******************************************************************************************/
function init_login_messages() {
    lastWindowWidth = $(window).width();
	lastWindowHeight = $(window).height();
	
	setExtraMarginForAndroid('loginSpacer');
	if( (navigator.userAgent).match(/Android 2/i) ) {
    	$('#login_area_jsp').oneFingerScroll();
	}
    callApiOnEnter();
}

/********************************************************************************************
 ' Name                 :   changeLanguage
 ' Return type          :   None
 ' Input Parameter(s)   :   
 ' Purpose              :   Function changes the locale of page according to locale find in cookie or default.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   12th Nov,2012  	-   Karuna Mishra
 '*******************************************************************************************/
function changeLanguage() {
    locale = getLocaleValue();
    selIndex = eval(getCookie('localeIndex'));
    /* change page language as per locale selection. */ 
    /*$('.toggle').html(document.getElementById("langDD").options[selIndex].text
                              + '<span class="caret"></span>');*/
    var call_init_app = new init_app(locale);
    call_init_app.call();
}


/********************************************************************************************
 ' Name                 :   handleAuthenticate
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for checking user authentication for Precash payment application.Using User_Auth
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   19th Nov,2012     -   Karuna Mishra
 '*******************************************************************************************/
function handleAuthenticate() {
    showProgressBar(); /* To show the progress bar */
    /* Used for disable the button and coming from utility.js */
    disableButton("login_frm");
    var locale = getCookie("locale");
    var str = navigator.userAgent;
    var userAgent = (str.substring(0, 50));
    var request = {};

    request.userName = $('#login_txt').val();
    request.password = $('#password_txt').val();
    request.locale = locale;
    request.applicationId = applicationId;
    request.timeZone = calculate_time_zone();
    request.phoneMetaData = new Object();
    request.phoneMetaData.phoneDeviceID = getClientIp();
    request.phoneMetaData.phoneNumber = null;
    request.phoneMetaData.phoneSoftwareVersion = userAgent;
    request.phoneMetaData.phoneServiceProvider = null;
    request.phoneMetaData.phoneSimSerialNumber = null;
    request.phoneMetaData.phoneSubscriberID = null;
    request.phoneMetaData.phoneModel = null;
    request.phoneMetaData.phoneDeviceName = null;
    request.phoneMetaData.phoneOSVersion = null;
    request.phoneMetaData.appBuildOSVersion = null;
    request.phoneMetaData.appBuildSDKVersion = null;

    var call_user_auth = new user_auth(request);
    call_user_auth.call();
}

/********************************************************************************************
' Name                 :   handleUserAuthOnSuccess
' Return type          :   None
' Input Parameter(s)   :   user_auth_obj
' Purpose              :   To handle the USER_AUTH API success scenario
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handleUserAuthOnSuccess() {
	/* Used for enable the button and coming from utility.js */
    enableButton("login_frm");
    countOFEnter = 0;
    localStorage.setItem("registerUser", true);
    locale = getLocaleValue();
    gaLogin(user_auth_obj.userId,getClientIp());
    if (user_auth_obj.temppwd == true) {
        /* To hide the progress bar */
        hideProgressBar();
        close_box();
        $('#forcedPwd').show();
        $("#LogingetPwd").hide();
        $("#LoginErrorMsg").hide();

        $("#securityQuestionArea").hide();
        $("#securityQuestionErrorMessage").text("");
        if(!(navigator.userAgent).match(/Android/i)) {
     	   setSectionHeightForMobile();
        }
        startSessionTimeoutTimer();
    } else {
        $('#chkAcceptTerms').attr("checked", true);
        location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + "#home";
    }
    applyRememberMeForUser();
} 

/********************************************************************************************
' Name                 :   handleUserAuthOnError
' Return type          :   None
' Input Parameter(s)   :   req, startTime, user_auth_obj
' Purpose              :   To handle the USER_AUTH API error scenario
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handleUserAuthOnError(req, startTime) {
	/* Used for enable the button and coming from utility.js */
    enableButton("login_frm");
    countOFEnter = 0;
    var error_user_auth = new handle_user_auth(req, startTime, "USER_AUTH");
    if (user_auth_obj.user != null) {
        if (user_auth_obj.temppwd === true) {
            close_box();
            $('#forcedPwd').show();
            $("#LogingetPwd").hide();
            $("#LoginErrorMsg").hide();

            $("#securityQuestionArea").hide();
            $("#securityQuestionErrorMessage").text("");
            $('#new_pwd').removeClass("error_red_border");
            $('#re_new_pwd').removeClass("error_red_border");
            $('#new_pwd').focus();
        } else {
        	error_user_auth.error();
        }
        // Store data into cookie.
        setCookie("userId", user_auth_obj.userId);
        setCookie("userName", user_auth_obj.userName);
    } else {
		gaLoginFailed(getClientIp());
    	error_user_auth.error();
    }
}

/********************************************************************************************
 ' Name                 :   userTermsAndConditions
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Check for Terms and condition is accepted by User before further processing.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Nov,2012     -   Karuna Mishra
 '*******************************************************************************************/
function userTermsAndConditions() {
    /* To show the progress bar */
    showProgressBar();

    disableButton("termCont");
    if (getCookie("userId") === "") {
        moveToLoginPage();
        return;
    }
    // to hold request parameters and values for request parameters
    var request = {};
    request.locale = locale;
    request.applicationId = applicationId;
    request.termsId = init_app_obj.init_app_currentterms_id;
    request.accepted = $('#chkAcceptTerms').is(":checked");
    request.userId = eval(getCookie('userId'));

    var call_user_terms = new user_terms(request);
    call_user_terms.call();
}

/********************************************************************************************
' Name                 :   acceptTermCndChkBox
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for accepting the term conditon check box.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   19th Nov,2012     -   Karuna Mishra
'*******************************************************************************************/
function acceptTermCndChkBox() {
   if ($('#chkAcceptTerms').is(':checked')) {
       userTermsAndConditions();
   } else {
	   showGeneralErrorMsg(messages['login.alert.termCondition']);
       enableButton("termCont"); /* Used for enable the button and coming from utility.js */
   }
}

/**
 * Closes the PopUp message.
 */
function close_box() {
    $('.backdrop, .inner_box').animate({'opacity': '0'}, 300, 'linear', function () {
        $('.backdrop, .inner_box').hide();
    });
}
/********************************************************************************************
 ' Name                 :   getLocaleValue
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Fetch the locale from the cookie, if not in cookies set the default locale.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   17th Nov,2012      -   Karuna Mishra
 '*******************************************************************************************/
function getLocaleValue() {
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

/********************************************************************************************
 ' Name                 :   fillOldLoginData
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Sget Data from cookies, decode the Base64 data and fill the form with Data.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   17th Nov,2012     -
 '*******************************************************************************************/
function fillOldLoginData() {
    // get Data from cookies after refresh the page.
    var oldDataObject = JSON.parse(Base64.decode(localStorage.getItem("loginFormData")));
    $('#login_txt').val(oldDataObject.userName);
}

/********************************************************************************************
 ' Name                 :   validateLoginPage
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   validateLoginPage function Performs the Validation for user input on Enter key press.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   4th Dec,2013      -   Karuna Mishra
 '*******************************************************************************************/
function validateLoginPage() {
    hideForceResetPwdMsg();
    if ($("#password_txt").val().length <= 0) {
        $("#password_txt").addClass("error_red_border");
        $("#LoginErrorMsg").show();
        $("#LoginErrorMsg").text(messages['login.fillTheFieldMsg']);
        $("#password_txt").focus();
    }
    checkValidation = true;
    if (isUserName) {
        if (!validateEmailId(true)) {
        	countOFEnter = 0;
            return;
        }
    } else if (!validateName(true)) {
    	countOFEnter = 0;
        return;
    }
    if (!validatePass1(true)) {
    	countOFEnter = 0;
        return;
    }

    // Call Api
    handleAuthenticate();
}

/********************************************************************************************
 ' Name                 :   callApiOnEnter
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for making api calls for apriprote buttons.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   22nd June,2013     -   Karuna Mishra
 '*******************************************************************************************/
function callApiOnEnter() {
    $("#login_txt").keypress(function (e) {
        return enterKeyMethodCall(e, 1);
    });

    $("#password_txt").keypress(function (e) {
        return enterKeyMethodCall(e, 1);
    });

    $("#login_name").keypress(function (e) {
        return enterKeyMethodCall(e, 2);
    });

    $("#securityAnswer").keypress(function (e) {
        return enterKeyMethodCall(e, 3);
    });

    $("#new_pwd").keypress(function (e) {
        return enterKeyMethodCall(e, 4);
    });

    $("#re_new_pwd").keypress(function (e) {
        return enterKeyMethodCall(e, 4);
    });
}

/********************************************************************************************
 ' Name                 :   enterKeyMethodCall
 ' Return type          :
 ' Input Parameter(s)   :   e, key
 ' Purpose              :   Function is used for making api calls for enter key.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   22nd June,2013     -   Karuna Mishra
 '*******************************************************************************************/
var countOFEnter = 0;
function enterKeyMethodCall(e, key) {
    var pressedKeyCode = e.keyCode || e.charCode;
    if (pressedKeyCode == 13) {
    	countOFEnter++;
        switch (key) {
            case 1:
            	if(countOFEnter === 1){
                validateLoginPage();
            	}
                break;
            case 2:
                getSecurityQues(applicationId);
                break;
            case 3:
                sendTempPasswordRequest(applicationId);
                break;
            case 4:
                sendResetPasswordRequest(applicationId);
                break;
        }
        return false;
    }
    return true;
}

/********************************************************************************************
 ' Name                 :   callApiOnEnter
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for showing the forget password option to the user.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   20th April,2013     -   Karuna Mishra
 '*******************************************************************************************/

function showForgotPasswordArea() {
    $('#wrong_username').text("");

    $('#login_name').val($('#login_txt').val());
    $('#LogingetPwd').show();
    $('#login_name').focus();
    $("#securityQuestionArea").hide();

    $("#securityQuestionErrorMessage").text("");

    $("#securityAnswer").val("");
    $('#forcedPwd').hide();
    $("#LoginErrorMsgOfApi").hide();
    $("#login_txt").removeClass("error_red_border");
    $("#LoginErrorEmailMsg").hide();
    $("#password_txt").removeClass("error_red_border");
    $("#LoginErrorMsg").hide();
    
    if(!(navigator.userAgent).match(/Android/i)) {
    	setSectionHeightForMobile();
    }
}

function loginResize() {
	var currentWindowWidth = $(window).width();
    if(!(navigator.userAgent).match(/Android/i) || lastWindowWidth != currentWindowWidth) {
	    if (currentWindowWidth <= minimumWindowWidthForMobile) {
	    	if(!(navigator.userAgent).match(/Android/i)) {
	    		showFooterButtonOnLoginPage();
	    	}
	    }
		clearTimeout(this.id);
	    this.id = setTimeout(setSectionHeightForMobile, 500);
	    lastWindowWidth = currentWindowWidth;
    }
}

/********************************************************************************************
' Name                 :   setSectionHeightForMobile
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for calculating the window height of login page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   17th Aug,2013     -   Ravi Raj
'*******************************************************************************************/
function setSectionHeightForMobile() {
	/* Change section height as it might be possible that an error is shown in div */
	var frameHeight = getContainerHeight();
	$('#login_area_jsp').css('height', frameHeight);
}


/**
 * To create the Security Questions list as hidden fields.
 * @param responseJsonObj
 * @returns {String}
 */
function getSeqQuestionsFields(responseJsonObj) {
    var terms_id = responseJsonObj.applicationConfiguration.currentTerms.id;
    var seqQuesInput = '<input type="hidden" name="terms_id" value="' + terms_id + '" />';
    return seqQuesInput;
}

/********************************************************************************************
 ' Name                 :   validateName
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   Boolean showErrorMessageUser
 ' Purpose              :   This method is use for username field validation.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   25th March, 2013    -   Ravi Raj
 '*******************************************************************************************/
function validateName(showErrorMessageUser) {
    if ($("#login_txt").val().length > 0) {
        // if it's NOT valid
        if ($("#login_txt").val().length < 4) {
            if (undefined != showErrorMessageUser && true === showErrorMessageUser) {
                $("#login_txt").addClass("error_red_border");
                $("#LoginErrorEmailMsg").show();
                $("#LoginErrorEmailMsg").text(messages['login.alert.userNameValidation']);
            }
            return false;
        }
        // if it's valid
        else {
            $("#LoginErrorMsgOfApi").hide();
            $("#login_txt").removeClass("error_red_border");
            $("#LoginErrorEmailMsg").hide();
            return true;
        }
    } else {
        if (checkValidation) {

            $("#LoginErrorMsgOfApi").hide();
            $("#login_txt").addClass("error_red_border");
            $("#LoginErrorEmailMsg").show();
            $("#LoginErrorEmailMsg").text(messages['login.fillTheFieldMsg']);
        }
    }
}

/********************************************************************************************
 ' Name                 :   validatePass1
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   Boolean showErrorMessageUser
 ' Purpose              :   This method is use for password validation in Log In page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   25th March, 2013    -   Ravi Raj
 '*******************************************************************************************/
function validatePass1(showErrorMessage) {
    if ($("#password_txt").val().length > 0) {
        // it's NOT valid
        if ($("#password_txt").val().length < 4) {
            if (undefined != showErrorMessage && true === showErrorMessage) {
                $("#LoginErrorMsgOfApi").hide();
                $("#password_txt").addClass("error_red_border");
                $("#LoginErrorMsg").show();
                $("#LoginErrorMsg").text(messages['login.alert.pwdValidation']);
            }
            return false;
        }
        // it's valid
        else {
            $("#password_txt").removeClass("error_red_border");
            $("#LoginErrorMsg").hide();
            return true;
        }
    } else {
        if (checkValidation) {
            $("#LoginErrorMsgOfApi").hide();
            $("#password_txt").addClass("error_red_border");
            $("#LoginErrorMsg").show();
            $("#LoginErrorMsg").text(messages['login.fillTheFieldMsg']);
            return false;
        }

    }
}

/********************************************************************************************
 ' Name                 :   validateEmailId
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   Boolean showErrorMessageMail
 ' Purpose              :   This method is use for email as user field validation in Log In page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   25th March, 2013    -   Ravi Raj
 '*******************************************************************************************/
function validateEmailId(showErrorMessageMail) {
    var pattern = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
    if ($("#login_txt").val().length > 0) {
        if (pattern.test($("#login_txt").val())) {
            $("#LoginErrorMsgOfApi").hide();
            $("#LoginErrorEmailMsg").hide();
            $("#login_txt").removeClass("error_red_border");
            return true;
        } else {
        	if (undefined != showErrorMessageMail && true === showErrorMessageMail) {
        		$("#login_txt").addClass("error_red_border");
        		$("#LoginErrorEmailMsg").show();
        		$("#LoginErrorEmailMsg").text(messages['login.emailUserName']);
        	}
        	return false;
        }
    } else {
		    if (checkValidation) {
			$("#LoginErrorMsgOfApi").hide();
			$("#login_txt").addClass("error_red_border");
			$("#LoginErrorEmailMsg").show();
			$("#LoginErrorEmailMsg").text(messages['login.fillTheFieldMsg']);
			if (!fromUserBlur) {
				$("#login_txt").focus();
				fromUserBlur = false;
			}
			return false;
		}
    }
}

/*******************************************************************************
 * ' Name : onBlurValidationForLogin ' Return type : None ' Input Parameter(s) :
 * None ' Purpose : This method is use for validating login form on blur and
 * keyup event. ' History Header : Version - Date - Developer Name ' Added By :
 * 1.0 - 25th March, 2013 - Ravi Raj '
 ******************************************************************************/
function onBlurValidationForLogin() {
    if (isUserName) {
        // On blur
        $("#login_txt").blur(function () {
        	this.value = this.value.toLowerCase();
        	fromUserBlur = true;
        	if($("#login_txt").val() === ""){
        		$("#LoginErrorMsgOfApi").hide();
                $("#LoginErrorEmailMsg").hide();
                $("#login_txt").removeClass("error_red_border");
                return;
        	}
            validateEmailId(true);
        });
        $("#login_txt").keyup(function () {
            validateEmailId(false);
        });
    } else {
        // On blur
        $("#login_txt").blur(function () {
        	this.value = this.value.toLowerCase();
            validateName(true);
        });
        $("#login_txt").keyup(function () {
            validateName(false);
        });
    }
    $("#password_txt").blur(function () {
    	if($("#password_txt").val() === ""){
    		$("#password_txt").removeClass("error_red_border");
            $("#LoginErrorMsg").hide();
    		return;
    	}
    	validatePass1(true);
    });
    $("#password_txt").keyup(function () {
        validatePass1(false);
        if($("#password_txt").val() === ""){
    		$("#password_txt").removeClass("error_red_border");
            $("#LoginErrorMsg").hide();
    		return;
    	}
    });
}

/********************************************************************************************
 ' Name                 :   handleCreateGuestUser
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This function is used for guest login.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May, 2013    -   Karuna Mishra
 '*******************************************************************************************/
function handleCreateGuestUser() {
    deleteCookieForGuestUser();
    localStorage.setItem("registerUser", false);
    setCookie("userNameForRememberMe", "");
    location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + "#searchBiller";

}

/********************************************************************************************
' Name                 :   applyRememberMeForUser
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This function is used save the user name is cookie if remember me box is checked.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th August, 2013 -   Ravi Raj
'*******************************************************************************************/
function applyRememberMeForUser(){
	if ($('#rememberMe').is(':checked')) {
		setCookie("userNameForRememberMe", $('#login_txt').val(), 365);
	}else{
		setCookie("userNameForRememberMe", ""); 
	}
}
/********************************************************************************************
' Name                 :   getUserNameFromCookieForRememberMe
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This function is used get the user name from cookie if userName
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th August, 2013 -   Ravi Raj
'*******************************************************************************************/
function getUserNameFromCookieForRememberMe(){
	var userName = getCookie("userNameForRememberMe");
	if(userName){
		$('#login_txt').val(userName);
	}
}


function enableDisableContinueButton() {
	if($('#chkAcceptTerms').is(':checked')) {
		if($('#termCont').hasClass('grey_terms_cond_btn')) {
			$('#termCont').removeClass('grey_terms_cond_btn');
			$('#termCont').addClass('green_terms_cond_btn');
			enableButton("termCont");
		}
	} else {
		if($('#termCont').hasClass('green_terms_cond_btn')) {
			$('#termCont').removeClass('green_terms_cond_btn');
			$('#termCont').addClass('grey_terms_cond_btn');
			disableButton("termCont");
		}
	}
}