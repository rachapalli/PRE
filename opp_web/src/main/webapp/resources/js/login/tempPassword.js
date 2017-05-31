var privateURL = "private";
var INVALID_APP_ID = "INVALID_APPLICATION_ID";

/********************************************************************************************
 ' Name                 :   getSecurityQues
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function Use for Getting the security question from the USER_SEC_QUES API.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   3rd March,2013      -   Karuna Mishra
 '*******************************************************************************************/
function getSecurityQues() {
	/* Used for Disable the button and coming from utility.js */
	disableButton("access_ques");
	$("#securityAnswer").removeClass('error_red_border');
	if ($('#login_name').val()) {
		if (validEmailOfSecurityQues($('#login_name').val())) {
			/* To show the progress bar */
			showProgressBar();

			var request = {};
			request.username = $('#login_name').val();
			request.applicationId = applicationId;
			request.locale = getCookie("locale");
			var call_user_sec_ques = new user_sec_ques(request);
		    call_user_sec_ques.call();
		} else {
			clearSecurityAnsField(messages['login.emailUserName']);
		}
	} else {
		clearSecurityAnsField(messages['login.alert.provideusername']);
	}
}

/*******************************************************************************
 * ' Name : clearSecurityAnsField ' Return type : None ' Input Parameter(s) :
 * message ' Purpose : Function Use for showing the error message if user id is
 * wrong. ' History Header : Version - Date - Developer Name ' Added By : 1.0 -
 * 3rd March,2013 - Karuna Mishra '
 ******************************************************************************/
function clearSecurityAnsField(message){
	 $("#wrong_username").text("");
     $("#wrong_username").text(message);
     $("#wrong_username").show();
     $("#login_name").addClass('error_red_border');
     $('#login_name').focus();
     /* Used for enable the button and coming from utility.js */
     enableButton("access_ques");
}

function validEmailOfSecurityQues(userID){
	var isEmailId = initAppFeatureName["EMAIL_IS_USERNAME"];
	if(isEmailId){
	 var pattern = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	        if (pattern.test(userID)) {
	        	return true;
	        }
	        return false;
	}
	return true;
}
/********************************************************************************************
 ' Name                 :   handleUserSeqQuesOnSuccess
 ' Return type          :   None
 ' Input Parameter(s)   :   jsonResponse
 ' Purpose              :   Handle the success response of USER_SEC_QUES API.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   3rd March,2013      -   Karuna Mishra
 '*******************************************************************************************/
function handleUserSeqQuesOnSuccess() {
    $("#wrong_username").text("");
    $("#securityAnswer").val("");
    $("#securityQuestionErrorMessage").text("");
    $("#securityQuestion").text(user_sec_ques_obj.securityQuestion);
    $("#securityQuestionArea").show();
    $("#login_name").removeClass('error_red_border');
}

/********************************************************************************************
 ' Name                 :   sendTempPasswordRequest
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used to call the USER_SEND_TEMP_PWD api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   5th March,2013      -   Karuna Mishra
 '*******************************************************************************************/
function sendTempPasswordRequest() {
    if ($('#securityAnswer').val() != 0) {
        /* To show the progress bar */
        showProgressBar();

        
        /* Used for Disable the button and coming from utility.js */
        disableButton("sendSecurityAnswer");
        var request = {};
        request.userId = user_sec_ques_obj.userId;
        request.applicationId = applicationId;
        request.locale = getCookie("locale");
        request.securityAnswer = $("#securityAnswer").val();
        
        var call_user_send_temp_pwd = new user_send_temp_pwd(request);
        call_user_send_temp_pwd.call();
    } else {
    	showErrorMessageoftempPwd(messages['tempPassword.securityAns'], 'securityAnswer');
    }
}

/********************************************************************************************
 ' Name                 :   handleUserSendTempPwdOnSuccess
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used to handle the success of USER_SEND_TEMP_PWD api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   5th March,2013    -   Karuna Mishra
 '*******************************************************************************************/
function handleUserSendTempPwdOnSuccess() {
	showGeneralSuccessMsg(messages['login.alert.tempPwd']);
    $("#LogingetPwd").hide();
    $("#securityQuestionArea").hide();
    $("#LoginErrorMsg").hide();
    $("#login_txt").val("");
    $("#password_txt").val("");
    $("#securityAnswer").removeClass('error_red_border');
}


/********************************************************************************************
 ' Name                 :   showErrorMessageoftempPwd
 ' Return type          :   None
 ' Input Parameter(s)   :   errorMessage, inputName
 ' Purpose              :   Function is used for displaying the error message.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   5th March,2013    -   Karuna Mishra
 '*******************************************************************************************/
function showErrorMessageoftempPwd(errorMessage, inputName) {
    $("#securityQuestionErrorMessage").text(errorMessage);
    $("#securityQuestionErrorMessage").show();
    $('#' + inputName).addClass('error_red_border');
    $('#' + inputName).focus();
}