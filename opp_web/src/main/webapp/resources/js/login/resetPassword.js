var INVALID_APP_ID = "INVALID_APPLICATION_ID";


/********************************************************************************************
 ' Name                 :   sendResetPasswordRequest
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for sending the reset password request to server.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   14th March,2013    -   Karuna Mishra
 '*******************************************************************************************/
function sendResetPasswordRequest() {
    if (validateInputFieldOfResetArea()) {
        /* To show the progress bar */
        showProgressBar();

        $('#new_pwd').removeClass("error_red_border");
        $('#re_new_pwd').removeClass("error_red_border");
        /* Used for Disable the button and coming from utility.js */
        disableButton("reset_pwd");
        
        var request = {};
        request.userId = user_auth_obj.userId;
        request.applicationId = applicationId;
        request.locale = getCookie("locale");
        request.newPassword = $('#re_new_pwd').val();
        
        var call_user_reset_pwd = new user_reset_pwd(request);
        call_user_reset_pwd.call();
    }
}

/*******************************************************************************
 * ' Name : handleUserResetPwdOnSuccess ' Return type : None ' Input
 * Parameter(s) : jsonResponse ' Purpose : Show reset password Success Response '
 * History Header : Version - Date - Developer Name ' Added By : 1.0 - 15th
 * March,2013 - Karuna Mishra '
 ******************************************************************************/
function handleUserResetPwdOnSuccess(user_reset_pwd_obj) {
	resetPswd = true;
    $("#LogingetPwd").hide();
    $("#securityQuestionArea").hide();
    $("#forcedPwd").hide();
    $("#login_txt").val(user_auth_obj.userName);/* Getting user name from USER_AUTH response object and setting it to user name field*/
    $("#password_txt").val($('#re_new_pwd').val());
    showGeneralSuccessMsg(messages['login.resetPwdMsg']);
}

/********************************************************************************************
 ' Name                 :   showErrorMessageforreset
 ' Return type          :   None
 ' Input Parameter(s)   :   errorMessage
 ' Purpose              :   Display Resset password Error message on JSP.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   14th March,2013    -   Karuna Mishra
 '*******************************************************************************************/
function showErrorMessageforreset(errorMessage) {
    $("#wrong_resetpwd").text(errorMessage);
    $("#wrong_resetpwd").show();
}

/********************************************************************************************
 ' Name                 :   validateInputFieldOfResetArea
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Validate the password and re-enter password fields.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   14th March,2013    -   Karuna Mishra
 '*******************************************************************************************/
function validateInputFieldOfResetArea() {
    var element1 = $('#new_pwd').val();
    var element2 = $('#re_new_pwd').val();

    if (element1 == '') {
        $('#re_new_pwd').removeClass("error_red_border");
        showErrorMessageofFieldValidation(messages['login.alert.newPwd'], 'new_pwd', 'wrong_resetpwd');
        /* Used for enable the button and coming from utility.js */
        enableButton("reset_pwd");
    } else if (element2 == '') {
        $('#new_pwd').removeClass("error_red_border");
        showErrorMessageofFieldValidation(messages['login.alert.rePwd'], 're_new_pwd', 'wrong_resetpwd');
        /* Used for enable the button and coming from utility.js */
        enableButton("reset_pwd");
    } else if (element1 != element2) {
        showErrorMessageofFieldValidation(messages['login.alert.validateNewPwd'], 'new_pwd', 'wrong_resetpwd');
        /* Used for enable the button and coming from utility.js */
        enableButton("reset_pwd");
        $('#re_new_pwd').removeClass("error_red_border");
        $('#new_pwd').val("");
        $('#re_new_pwd').val("");
        return false;
    } else {
        return true;
    }
}

/********************************************************************************************
 ' Name                 :   showErrorMessageofFieldValidation
 ' Return type          :   None
 ' Input Parameter(s)   :   errorMessage, inputName
 ' Purpose              :   Function is used for displaying the error message.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th June,2013    -   Karuna Mishra
 '*******************************************************************************************/
function showErrorMessageofFieldValidation(errorMessage, inputName, errorMesgDiv) {
    $("#" + errorMesgDiv).text("");
    $("#" + errorMesgDiv).text(errorMessage);
    $("#" + errorMesgDiv).show();
    $('#' + inputName).addClass('error_red_border');
    $('#' + inputName).focus();
}

/********************************************************************************************
 ' Name                 :   hideForceResetPwdMsg
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for hiding force password area.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th June,2013    -   Karuna Mishra
 '*******************************************************************************************/
function hideForceResetPwdMsg() {
    $("#forcedPwd").hide();
    $("#new_pwd").val("");
    $("#new_pwd").removeClass("error_red_border");
    $("#re_new_pwd").val("");
    $("#re_new_pwd").removeClass("error_red_border");

    $("#wrong_resetpwd").text("");
    $("#wrong_resetpwd").hide();
    $('#LogingetPwd').hide();
    $('#securityQuestionArea').hide();
    $("#login_name").removeClass('error_red_border');
}