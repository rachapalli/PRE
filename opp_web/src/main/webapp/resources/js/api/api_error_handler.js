/**
 * This file is used to contain all the web service error handler within the application.
 */
/********************************************************************************************
' Name                 :   handle_init_app
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the INIT_APP API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   27th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_init_app(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_init_app.prototype.error = function () {
    handleError(this.req, this.startTime, this.apiName);
    try {
        var responseJsonObj = JSON.parse(this.req.responseText);
        var errorMessage = responseJsonObj.errorMessage;
        if (responseJsonObj.errorCode === init_app_constant.INVALID_APP_ID) {
            errorMessage += "<br/>" + messages['login.alert.missing'];
            location.href = 'home.jsp';
        }
        showGeneralErrorMsg(errorMessage);
    } catch (e) {
        location.href = 'home.jsp';
    }
};

/********************************************************************************************
' Name                 :   handle_user_auth
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_AUTH API error with following members
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   19th Nov,2012		- Karuna Mishra '
'*******************************************************************************************/
function handle_user_auth(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_auth.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var message = user_auth_obj.errorMessage;
    if (user_auth_obj.errorCode == user_auth_constant.BAD_CREDENTIALS) {
        $("#LoginErrorMsgOfApi").text(message);
        $('#LoginErrorMsgOfApi').show();
        counter++;
        var failedtampt = (init_app_obj.maxLoginAttempts / 2);
        if (failedtampt == counter) {
            showForgotPasswordArea();
        }
    } else if (user_auth_obj.errorCode === user_auth_constant.NEED_ACCEPTANCE) {
        // open user terms pop-up window
        $('#terms_conditions').attr('data', init_app_obj.currentTermsUrl);
        $('.backdrop, .inner_box').animate({'opacity': '.50'}, 300, 'linear');
        $('.inner_box').animate({'opacity': '1.00'}, 300, 'linear');
        $('.backdrop, .inner_box').show();
        $('#chkAcceptTerms').attr("checked", false);

    } else if (user_auth_obj.errorCode === user_auth_constant.INVALID_APP_ID) {
        message += "<br/>" + messages['login.alert.missing'];
        location.href = 'home.jsp';
    }
    $("#LoginErrorMsgOfApi").text(message);
    $('#LoginErrorMsgOfApi').show();
};

/********************************************************************************************
' Name                 :   handle_user_terms
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_TERMS API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_terms(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_terms.prototype.error = function() {
	var error_user_auth = new handle_init_app(req, startTime, "USER_TERMS");
    error_user_auth.error();
};

/********************************************************************************************
' Name                 :   handle_user_sec_ques
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_SEC_QUES API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Karuna Mishra
'*******************************************************************************************/
function handle_user_sec_ques(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_sec_ques.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
    $("#wrong_username").text(user_sec_ques_obj.errorMessage);
    $("#wrong_username").show();
    $("#securityQuestionArea").hide();
    $("#login_name").addClass('error_red_border');
};

/********************************************************************************************
' Name                 :   handle_user_send_temp_pwd
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_SEND_TEMP_PWD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_send_temp_pwd(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_send_temp_pwd.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	if (user_send_temp_pwd_obj.errorCode === user_send_temp_pwd_constant.USER_SEND_TEMP_PWD_USER_NOT_FOUND) {
        /*Show slide down error message for matching error code */
    	showErrorMessageoftempPwd(user_send_temp_pwd_obj.errorMessage, 'securityAnswer');
    } else if (user_send_temp_pwd_obj.errorCode === user_send_temp_pwd_constant.USER_SEND_TEMP_PWD_WRONG_SEC_ANSWER) {
    	showErrorMessageoftempPwd(user_send_temp_pwd_obj.errorMessage, 'securityAnswer');
    } else if (user_send_temp_pwd_obj.errorCode === user_send_temp_pwd_constant.USER_SEND_TEMP_PWD_INVALID_PHONE) {
    	showErrorMessageoftempPwd(user_send_temp_pwd_obj.errorMessage, 'securityAnswer');
    } else if (user_send_temp_pwd_obj.errorCode === user_send_temp_pwd_constant.USER_SEND_TEMP_PWD_USER_LOCKED) {
    	showErrorMessageoftempPwd(user_send_temp_pwd_obj.errorMessage, 'securityAnswer');
    } else if (user_send_temp_pwd_obj.errorCode === user_send_temp_pwd_constant.INVALID_APP_ID) {
    	showGeneralErrorMsg(user_send_temp_pwd_obj.errorMessage + "<br/>" + messages['login.alert.missing']);
    } else {
    	showGeneralErrorMsg(user_send_temp_pwd_obj.errorMessage);
    }
};

/********************************************************************************************
' Name                 :   handle_user_reset_pwd
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_RESET_PWD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Karuna Mishra
'*******************************************************************************************/
function handle_user_reset_pwd(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_reset_pwd.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
    if (user_reset_pwd_obj.errorCode === user_reset_pwd_constant.USER_RESET_PWD_USER_MISMATCH) {
        showErrorMessageforreset(user_reset_pwd_obj.errorMessage);
    } else if (user_reset_pwd_obj.errorCode === user_reset_pwd_constant.USER_RESET_PWD_INVALID_PWD) {
        showErrorMessageforreset(user_reset_pwd_obj.errorMessage);
    } else if (user_reset_pwd_obj.errorCode === user_reset_pwd_constant.USER_RESET_PWD_NOT_TEMP) {
        showErrorMessageforreset(user_reset_pwd_obj.errorMessage);
    } else if (user_reset_pwd_obj.errorCode === user_reset_pwd_constant.INVALID_APP_ID) {
    	showGeneralErrorMsg(user_reset_pwd_obj.errorMessage + "<br/>" + messages['login.alert.missing']);
    } else {
    	showGeneralErrorMsg(user_reset_pwd_obj.errorMessage);
    }
};

/********************************************************************************************
' Name                 :   handle_user_get_profile
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_GET_PROFILE API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_get_profile(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_get_profile.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
    if (user_get_profile_obj.errorCode === user_get_profile_constant.USER_GET_PROFILE) {
    	showGeneralErrorMsg(user_get_profile_obj.errorMessage);
    } else if (user_get_profile_obj.errorCode === user_get_profile_constant.INVALID_APP_ID) {
    	showGeneralErrorMsg(user_get_profile_obj.errorMessage + "<br/>" + messages['login.alert.missing']);
    } else {
    	showGeneralErrorMsg(user_get_profile_obj.errorMessage);
    }
};

/********************************************************************************************
' Name                 :   handle_user_upd_profile
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_UPD_PROFILE API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_upd_profile(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_upd_profile.prototype.error = function() {
	activateCheckoutPayButton();
	enableAddCardSaveButton(getVisibleAddCardFormFundingSource());
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = user_upd_profile_obj.errorMessage;
	var errorCode = user_upd_profile_obj.errorCode;

	if (errorCode === user_upd_profile_constant.USER_UPD_PROFILE_SEC_ANSWER) {
		showGeneralErrorMsg(errorMessage);
		$("#editProfileSecurityAnswer").focus();
	} else if (errorCode === user_upd_profile_constant.USER_UPD_PROFILE_ADDRESS) {
		showGeneralErrorMsg(errorMessage);
		$("#editProfileAdd1").focus();
	}
	showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_user_init_reg
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_INIT_REG API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_init_reg(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_init_reg.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = user_init_reg_obj.errorMessage;
	var errorCode = user_init_reg_obj.errorCode;
	if (errorCode === user_init_reg_constant.USER_INT_REG_DUPLICATE_USERNAME) {
		/* Show slid down error message for matching error code */
		if (createAccountFlag) {
			showGeneralErrorMsg(errorMessage, 'emailPrompt');
		} else {
			showGeneralErrorMsg(errorMessage, 'username');
		}
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_BAD_USERNAME) {
		if (createAccountFlag) {
			showGeneralErrorMsg(errorMessage, 'emailPrompt');
		} else {
			showGeneralErrorMsg(errorMessage, 'username');
		}
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_BAD_PASSWORD) {
		showGeneralErrorMsg(errorMessage, 'password');
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_BAD_TERMS_ID) {
		showGeneralErrorMsg(errorMessage);
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_INVALID_PHONE) {
		showGeneralErrorMsg(errorMessage, 'phonePrompt');
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_INVALID_QUESTION) {
		showGeneralErrorMsg(errorMessage);
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_INVALID_ANSWER) {
		showGeneralErrorMsg(errorMessage, 'securityQuestionforCreateAct');
		$('#securityQuestionforCreateAct').focus();
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_INVALID_PIN) {
		showGeneralErrorMsg(errorMessage);
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_FAILURE) {
		showGeneralErrorMsg(errorMessage);
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_BAD_EMAIL) {
		showGeneralErrorMsg(errorMessage, 'emailPrompt');
	} else if (errorCode === user_init_reg_constant.INVALID_APPLICATION_ID) {
		showGeneralErrorMsg(errorMessage);
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_INVALID_PARAM) {
		showGeneralErrorMsg(errorMessage);
		$('#mobileCarrierId').focus();
	} else if (errorCode === user_init_reg_constant.USER_INT_REG_EMAIL_USERNAME_MISMATCH) {
		showGeneralErrorMsg(errorMessage);
	}
	showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_user_guest
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the USER_GUEST API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_user_guest(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_user_guest.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	showGeneralErrorMsg(user_guest_obj.errorMessage);
};

/********************************************************************************************
' Name                 :   handle_upgrade_guest_user
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the UPGRADE_GUEST_USER API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_upgrade_guest_user(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_upgrade_guest_user.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	if(upgrade_guest_user_obj.errorMessage) {
		showGeneralErrorMsg(upgrade_guest_user_obj.errorMessage);
	}
};

/********************************************************************************************
' Name                 :   handle_bp_biller_corp_search
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_BILLER_CORP_SEARCH API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_biller_corp_search(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_biller_corp_search.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);

	var message = bp_biller_corp_search_obj.errorMessage;
	if (bp_biller_corp_search_obj.errorCode === bp_biller_corp_search_constant.INVALID_APP_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_biller_corp_search_obj.errorCode === bp_biller_corp_search_constant.USER_MISMATCH) {
    	message += "<br/>" + messages['login.alert.missing'];
    }

	showGeneralErrorMsg(bp_biller_corp_search_obj.errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_biller_corp_creds
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_BILLER_CORP_CREDS API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_biller_corp_creds(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_biller_corp_creds.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);

	var fieldIdToHighlight = null;
	var message = bp_biller_corp_creds_obj.errorMessage;
	if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_SAVE_ACCT_CREDS_NICKNAME) {
    	/* Highlight the Nick Name TextField */
    	fieldIdToHighlight = 'nickName';
        $('#nickName').keyup(function (e) {
            removeErrorBorderClass("nickName");
        });
    } else if (bp_biller_corp_creds_obj.errorCode ===  bp_biller_corp_creds_constant.BP_SAVE_ACCT_CREDS_BILLER_ACCT) {
    	fieldIdToHighlight = '21';
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_INVALID_ACCT_NUMBER ) {
        /* Highlight the Billing Account Number TextField */
    	fieldIdToHighlight = '21';
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_TOO_MANY_BILLERS
    		|| bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_INVALID_ACCT_ZIP) {
    	/* if remitBillers array size > 0 move to next page without display error message. */
    	if( bp_biller_corp_creds_obj.remitBillers && bp_biller_corp_creds_obj.remitBillers.length > 0){
    		/* redirect user on new screen to display list of states. call new js new method */
    		navigateToAuxiliaryBiller(bp_biller_corp_creds_obj, addBill);
    		return false;
    	}
    	/* if remitBillers array is empty show error message on the screen and highlight the account number input field. */
    	fieldIdToHighlight = '21';
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.INVALID_APP_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.USER_MISMATCH) {
    	message += "<br/>" + messages['login.alert.missing'];
    } /*Error handling in dolly to Get Biller Corp Credentials*/
    else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_BILLER_CORP_CREDS) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_INACTIVE_EXTERNAL_MERCH_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_biller_corp_creds_obj.errorCode === bp_biller_corp_creds_constant.BP_INVALID_EXTERNAL_MERCH_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    }

	/* Show error pop-up message */
	showGeneralErrorMsg(message, fieldIdToHighlight);
};

/********************************************************************************************
' Name                 :   handle_bp_get_corp_account
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_GET_CORP_ACCOUNT API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_get_corp_account(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_get_corp_account.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);

	var message = bp_get_corp_account_obj.errorMessage;
	if (bp_get_corp_account_obj.errorCode === bp_get_corp_account_constant.INVALID_APP_ID) {
        message += "<br/>" + messages['login.alert.missing'];
    }

    /* Show error pop-up message */
	showGeneralErrorMsg(bp_get_corp_account_obj.errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_save_biller_corp_acct_creds
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_SAVE_BILLER_CORP_ACCT_CREDS API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_save_biller_corp_acct_creds(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_save_biller_corp_acct_creds.prototype.error = function() {
    var req = this.req;
    handleError(req, this.startTime, this.apiName);

	var fieldIdToHighlight = null;
	var message = bp_save_biller_corp_acct_creds_obj.errorMessage;
	if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_SAVE_ACCT_CREDS_NICKNAME) {
    	/* Highlight the Nick Name TextField */
    	fieldIdToHighlight = 'nickName';
        $('#nickName').keyup(function (e) {
            removeErrorBorderClass("nickName");
        });
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode ===  bp_save_biller_corp_acct_creds_constant.BP_SAVE_ACCT_CREDS_BILLER_ACCT) {
    	fieldIdToHighlight = '21';
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_INVALID_ACCT_NUMBER ) {
        /* Highlight the Billing Account Number TextField */
    	fieldIdToHighlight = '21';
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_SAVE_ACCT_CREDS_REGISTRATION_FAILURE) {
    	/* if remitBillers array size > 0 move to next page without display error message. */
    	if(bp_save_biller_corp_acct_creds_obj.failedValidationsErrorCode === bp_save_biller_corp_acct_creds_constant.BP_TOO_MANY_BILLERS ||
    			bp_save_biller_corp_acct_creds_obj.failedValidationsErrorCode === bp_save_biller_corp_acct_creds_constant.BP_INVALID_ACCT_ZIP){
    		if(bp_save_biller_corp_acct_creds_obj.remitBillers &&
    				bp_save_biller_corp_acct_creds_obj.remitBillers.length > 0) {
    			/* redirect user on new screen to display list of states. call new js new method */
        		navigateToAuxiliaryBiller(addBill);
        		return false;
    		}
    	}
    	/* if remitBillers array is empty show error message on the screen and highlight the account number input field.
        Loop through the failed validations and get the 1st error message.
         */
        if (req != null && req.responseText != null) {
            var reqObj = JSON.parse(req.responseText);
            if (reqObj != null) {
                console.log("reqObj is " + reqObj);
                var failedValidations = reqObj.failedValidations;
                if (failedValidations != null && failedValidations.length > 0) {
                    //get the 1st validation, display that message to the user
                    var failedValidation = failedValidations[0];
                    if (failedValidation != null) {
                        var userErrorMessage = failedValidation.errorMessage;
                        if (userErrorMessage != null) {
                            message = userErrorMessage;
                        }
                    }
                }
            }
        }
    	fieldIdToHighlight = '21';
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.INVALID_APP_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.USER_MISMATCH) {
    	message += "<br/>" + messages['login.alert.missing'];
    } /*Error handling in dolly to Get Biller Corp Credentials*/
    else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_BILLER_CORP_CREDS) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_INACTIVE_EXTERNAL_MERCH_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_save_biller_corp_acct_creds_obj.errorCode === bp_save_biller_corp_acct_creds_constant.BP_INVALID_EXTERNAL_MERCH_ID) {
    	message += "<br/>" + messages['login.alert.missing'];
    }

	/* Show error pop-up message */
	/*showGeneralErrorMsg(message, fieldIdToHighlight);*/
	showGeneralErrorMsg(message, fieldIdToHighlight);
};

/********************************************************************************************
' Name                 :   handle_bp_account_lite
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_ACCOUNT_LITE API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_account_lite(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_account_lite.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var message = bp_account_lite_obj.errorMessage;
	if (bp_account_lite_obj.errorCode === bp_account_lite_constant.INVALID_APP_ID) {
		message += "<br/>" + messages['login.alert.missing'];
    } else if (bp_account_lite_obj.errorCode === bp_account_lite_constant.BP_CREDS) {
        $('#MainHolder').empty();
        bpCredError = true;
        handleBpAccountLiteOnSuccess();
        return;
    }
	showGeneralErrorMsg(message);
};

/********************************************************************************************
' Name                 :   handle_bp_get_pending_transaction
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_GET_PENDING_TRANSACTION API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_get_pending_transaction(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_get_pending_transaction.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	showGeneralErrorMsg(bp_get_pending_transaction_obj.errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_hist
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_HIST API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_hist(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_hist.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_hist_obj.errorMessage;
	if (bp_hist_constant.INVALID_APP_ID === bp_hist_obj.errorCode) {
		message += "<br/>" + messages['login.alert.missing'];
	}
	showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_scheduled_payment_hist
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_SCHEDULE_PAYMENT_HIST API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_scheduled_payment_hist(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_scheduled_payment_hist.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_scheduled_payment_hist_obj.errorMessage;
    if (bp_scheduled_payment_hist_constant.INVALID_APP_ID === bp_scheduled_payment_hist_obj.errorCode) {
        message += "<br/>" + messages['login.alert.missing'];
    }
    showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_cancel_scheduled_payment
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CANCEL_SCHEDULE_PAYMENT API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_cancel_scheduled_payment(req, startTime, apiName, callFrom) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;	this.callFrom = callFrom;
}
/* Creating a method for the above class */
handle_bp_cancel_scheduled_payment.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_cancel_scheduled_payment_obj.errorMessage;
	closeCancelPopup();
    if (bp_cancel_scheduled_payment_constant.INVALID_APP_ID === bp_cancel_scheduled_payment_obj.errorCode) {
        message += "<br/>" + messages['login.alert.missing'];
    } else if(this.callFrom === callFrom_constant.SIDE_BAR_CANCEL_CALL){
    	clearTimeout(timeOutForErrorSlide);
    	showSideBarAlerts('sideBarAlertFailureId', 'sideBarAlertFailureTxtId', errorMessage);		
		restartTimerForSlideDown();
    	return;
    }
    showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_remove_biller_corp_account
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_REMOVE_BILLER_CORP_ACCOUNT API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_remove_biller_corp_account(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_remove_biller_corp_account.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var message = bp_remove_biller_corp_account_obj.errorMessage;

    if (bp_remove_biller_corp_account_constant.INVALID_APP_ID === bp_remove_biller_corp_account_obj.errorCode) {
        message += "<br/>" + messages['login.alert.missing'];
    }
    showGeneralErrorMsg(message);
};

/********************************************************************************************
' Name                 :   handle_bp_calc_submit_date
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CALC_SUBMIT_DATE API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_calc_submit_date(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_calc_submit_date.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var message = bp_calc_submit_date_obj.errorMessage;
	if(bp_calc_submit_date_obj.errorCode === bp_calc_submit_date_constant.INVALID_APP_ID) {
        message += "<br/>" + messages['login.alert.missing'];
    }
	showGeneralErrorMsg( message);
};

/********************************************************************************************
' Name                 :   handle_bp_add_verify_cart_item
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_ADD_VERIFY_CART_ITEM API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_add_verify_cart_item(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_add_verify_cart_item.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
    if (bp_add_verify_cart_item_obj.errorCode === bp_add_verify_cart_item_constant.BP_VELOCITY) {
    	showDailyLimitPopup();
    	return;
    } else if (bp_add_verify_cart_item_obj.errorCode.indexOf("ACCT") != -1){
    	showCredentialErrorPopup();
    } else {
    	showGeneralErrorMsg(bp_add_verify_cart_item_obj.errorMessage);
    }
};

/********************************************************************************************
' Name                 :   handle_bp_verify_funding_sources
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_VERIFY_FUNDING_SOURCES_3_2 API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_verify_funding_sources(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_verify_funding_sources.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_verify_funding_sources_obj.errorMessage;
    var errorCode = bp_verify_funding_sources_obj.errorCode;
    var extrafundingSources = bp_verify_funding_sources_obj.extraFundingSources;
    /* To get the id of currently visible Promo Code Section */
    var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();

    /* If BP_PROMO_* error comes, display the erroneous promo code in the Promo Code entry field 
     * and "Apply" button will be active */
    if(errorCode.indexOf('BP_PROMO') !== -1) {
    	validationTracking = NOTVALIDATED;
    	if(errorCode === bp_verify_funding_sources_constant.PROMO_CODE_EXPIRE_MESSAGE) {
    		var mmddyy = convertToDatemmddyy(getScheduledSubmitDate());
    		errorMessage = formatMessage(messages['checkout.promo_expire_beforedate'],  mmddyy.month, mmddyy.day, mmddyy.year);
    	}
    	promoCodeErrorHandling(errorMessage, visiblePromoCodeInputId);
    	return;
    } else {
    	deActivateCheckoutPayButton();
    	if(getPromoAmount()){
    		updatePromoSectionUI();
    	}
    	var cashSummaryTotalAmount = getFormatedNumber($('#cashSummaryTotalAmount').html(), false);
	    var mainPayAmountDueTotal = getFormatedNumber($('#amountDueTotal').html(), false);
	    if( cashSummaryTotalAmount >= mainPayAmountDueTotal){
	    	activateCheckoutPayButton();
	    }else{
	    	deActivateCheckoutPayButton();
	    }
   	 	if (errorCode === bp_verify_funding_sources_constant.BP_FUNDING_SOURCE_OVER) {
   	 	showGeneralErrorMsg(errorMessage);
   	 		displayFundingSourcesErrorMessage(extrafundingSources );
   	 	return;
   	 	} else if (errorCode !== bp_verify_funding_sources_constant.BP_FUNDING_SOURCE_UNDER) {
   	 	showGeneralErrorMsg(errorMessage);
   	 	}else if (errorCode === bp_verify_funding_sources_constant.BP_FUNDING_SOURCE_UNDER) {
   	 			return;
   	 	}
    }
    showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_verify_funding_sources
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_VERIFY_FUNDING_SOURCES_3_2 API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_validate_promo_code(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_validate_promo_code.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_validate_promo_code_obj.errorMessage;
    var errorCode = bp_validate_promo_code_obj.errorCode;
    var extrafundingSources = bp_validate_promo_code_obj.extraFundingSources;
    /* To get the id of currently visible Promo Code Section */
    var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();

    /* If BP_PROMO_* error comes, display the erroneous promo code in the Promo Code entry field 
     * and "Apply" button will be active */
    if(errorCode.indexOf('BP_PROMO') !== -1) {
    	validationTracking = NOTVALIDATED;
    	if(errorCode === bp_validat_promo_code_constant.BP_PROMO_WILL_EXPIRE_BEFORE_SCHEDULED_PAYMENT_DUE) {
    		var mmddyy = convertToDatemmddyy(bp_validate_promo_code_obj.promoCodeExpirationDate);
    		errorMessage = formatMessage(messages['checkout.promo_expire_beforedate'],  mmddyy.month, mmddyy.day, mmddyy.year);
    	} else if(errorCode === bp_validat_promo_code_constant.BP_PROMO_CODE_BELOW_MIN_PAYMENT_AMOUNT){
    		errorMessage = bp_validate_promo_code_obj.errorMessage;
    	} else if(errorCode === bp_validat_promo_code_constant.BP_PROMO_CODE_LIMIT_REACHED || errorCode === bp_validat_promo_code_constant.BP_PROMO_EXPIRED){
    		errorMessage = messages['checkout.promo_no_longer_valid'];
    	}
    	promoCodeErrorHandling(errorMessage, visiblePromoCodeInputId);
    	return;
    } else {
    	deActivateCheckoutPayButton();
    	if(getPromoAmount()){
    		updatePromoSectionUI();
    	}
    	var cashSummaryTotalAmount = getFormatedNumber($('#cashSummaryTotalAmount').html(), false);
	    var mainPayAmountDueTotal = getFormatedNumber($('#amountDueTotal').html(), false);
	    if( cashSummaryTotalAmount >= mainPayAmountDueTotal){
	    	activateCheckoutPayButton();
	    }else{
	    	deActivateCheckoutPayButton();
	    }
   	 	if (errorCode === bp_validat_promo_code_constant.BP_FUNDING_SOURCE_OVER) {
   	 	showGeneralErrorMsg(errorMessage);
   	 		displayFundingSourcesErrorMessage(extrafundingSources );
   	 	return;
   	 	} else if (errorCode !== bp_validat_promo_code_constant.BP_FUNDING_SOURCE_UNDER) {
   	 	showGeneralErrorMsg(errorMessage);
   	 	}else if (errorCode === bp_validat_promo_code_constant.BP_FUNDING_SOURCE_UNDER) {
   	 			return;
   	 	}
    }
    showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_submit_payment_group
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_SUBMIT_PAYMENT_GROUP API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_submit_payment_group(req, startTime, apiName, newFlag) {
    this.req = req;
    this.startTime = startTime; 
    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_submit_payment_group.prototype.error = function() {
	var cvvRequired = "";
	
	handleError(this.req, this.startTime, this.apiName);
	/*if BP_SUBMIT_PAYMENT_GROUP gives BP_POSTING_WINDOW_EXPIRED as error code then raise a cut off time error */
	if (bp_submit_payment_group_obj.errorCode === "BP_POSTING_WINDOW_EXPIRED") {
			hideProgressBar();
		$("#cutOfTimeErrorId").show();
		return; /* On click of Back to bills button user will navigate to home page and data biller boxes will clear as well*/
	}
	var isCallFromAddCard = $('#addPaymentCardForm').is(':visible');
	if (isCallFromAddCard && parseBoolean(localStorage.getItem("registerUser"))) {
		loadCheckoutScreen();
		newFlag = true;
	}
	activateCheckoutPayButton();
	if(isCallFromAddCard){
		cvvRequired = cm_add_payment_card_obj.paymentCard.cvvRequiredStatus;
		if(bp_submit_payment_group_obj.errorCode === bp_submit_payment_group_constant.BP_CARD_NOT_ALLOWED_FOR_SCHEDULED_PAYMENTS 
				&& cvvRequired === "REQUIRED"){
			showDebitCardPopUpError();
		} else {
			showGeneralErrorMsg(bp_submit_payment_group_obj.errorMessage);
			
		}
	} else {
		showGeneralErrorMsg(bp_submit_payment_group_obj.errorMessage);
	}
};

/********************************************************************************************
' Name                 :   handle_bp_check_payment_group_status
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CHECK_PAYMENT_GROUP_STATUS API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_check_payment_group_status(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_check_payment_group_status.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	// show error pop-up message
	showGeneralErrorMsg(bp_check_payment_group_status_obj.errorMessage);
	updateCardUiIfApiFails();
};

/********************************************************************************************
' Name                 :   handle_bp_cart_hist
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CART_HIST API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_cart_hist(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_cart_hist.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_cart_hist_obj.errorMessage;
	showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_cart_receipt
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CART_RECEIPT API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_cart_receipt(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_cart_receipt.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = bp_cart_receipt_obj.errorMessage;
	showGeneralErrorMsg(errorMessage);
};

/********************************************************************************************
' Name                 :   handle_bp_cart_receipt_reprint
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the BP_CART_RECEIPT_REPRINT API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_bp_cart_receipt_reprint(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_bp_cart_receipt_reprint.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
};

/********************************************************************************************
' Name                 :   handle_cm_get_payment_card
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the CM_GET_PAYMENT_CARD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_cm_get_payment_card(req, startTime, apiName, fromSubmittPay) {
    this.req = req;
    this.startTime = startTime;
    this.apiName = apiName;
    this.fromSubmittPay = fromSubmittPay;
}
/* Creating a method for the above class */
handle_cm_get_payment_card.prototype.error = function() {
	var localObj = this;
	handleError(this.req, this.startTime, this.apiName);
	if (!localObj.fromSubmittPay) {
		showGeneralErrorMsg(cm_get_payment_card_obj.errorMessage);
	}
	createPaymentOptions();
};

/********************************************************************************************
' Name                 :   handle_cm_add_payment_card
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the CM_ADD_PAYMENT_CARD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_cm_add_payment_card(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_cm_add_payment_card.prototype.error = function() {
	activateCheckoutPayButton();
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = cm_add_payment_card_obj.errorMessage;
	if(window.location.hash === '#manageCards'){
		clearTimeout(timeOutForErrorSlide);
		showErrorMessageForAddAndEditCard(errorMessage);
		restartTimerForSlideDown();
	} else {
		showGeneralErrorMsg(cm_add_payment_card_obj.errorMessage);
	} 
		$('.main-holder-marg').scrollTop(0);
		/*showGeneralErrorMsg(cm_add_payment_card_obj.errorMessage);
	} */
		if($('#addPaymentCardForm').is(':visible')){ /* In case ADD_CARD API failed to add card then check for Add card form visible or not */
			 var childDiv = $("#addPaymentCardForm").children(":first").attr('id');/* Get first child of add card form */
				clearInterval(timeIntevalOfAddCard);
				clearInterval(timeIntevalOfCard);
			 if (childDiv.indexOf(tenderTypeConstant.DEBIT)) {/* child div id contains VistaDebit them pass it for enable method */
				 enableAddCardSaveButton(jsonTypeConstant.VESTADEBIT);
			 } else if (childDiv.indexOf(tenderTypeConstant.CREDIT)) {/* child div id contains VistaCredit them pass it for enable method */
				 enableAddCardSaveButton(jsonTypeConstant.VESTACREDIT);
			 }
		}
};

/********************************************************************************************
' Name                 :   handle_cm_edit_payment_card
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the CM_EDIT_PAYMENT_CARD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_cm_edit_payment_card(req, startTime, apiName, cardExpandBoxId, index) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName; this.cardExpandBoxId = cardExpandBoxId; this.index = index;
}

/* Creating a method for the above class */
handle_cm_edit_payment_card.prototype.error = function() {
	var localObj = this;
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = cm_edit_payment_card_obj.errorMessage;
	var errorCode = cm_edit_payment_card_obj.errorCode;
	if (cm_edit_payment_card_constant.BP_EDIT_CARD_CANCELED_SCHEDULED_PAYMENTS === errorCode) {
		var htmlElement = "";
		for(var index in cm_edit_payment_card_obj){
			htmlElement += "<li>"
					   	+	 cm_edit_payment_card_obj[index].scheduledPayments.nickname
					   	+  "</li>";
		}
		$('#editCardCancelScheduledPaymentsPopUpInnerList').append(htmlElement);
		showAnimatedPopup("editCardCancelScheduledPaymentsPopUpContainer", "editCardCancelScheduledPaymentsPopUp");
	}/* else if (errorCode === '') {
		 while editing card from the manage cards page Delete payment card returns follwoing error code show alert 
		showErrorMessageForAddAndEditCard(messages['editCard.confirmationMessage.error']);
	} */else {
		clearTimeout(timeOutForErrorSlide);
		createSuccessAndErrorMessage(localObj.cardExpandBoxId);
		showErrorMessageForAddAndEditCard(errorMessage);
		/*$("#editCardContainer" + this.cardExpandBoxId + this.index).hide();
		$('#errorForEditCardPopupId').show();*/
		restartTimerForSlideDown();
		$('.main-holder-marg').scrollTop(0);
	}
};

/********************************************************************************************
' Name                 :   handle_cm_delete_payment_card
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the CM_DELETE_PAYMENT_CARD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_cm_delete_payment_card(req, startTime, apiName, index, cardExpandBoxId, goBack) {
    this.req = req;
    this.startTime = startTime;
    this.apiName = apiName;
    this.index = index;
    this.cardExpandBoxId = cardExpandBoxId;
    this.goBack = goBack;
}
/* Creating a method for the above class */
handle_cm_delete_payment_card.prototype.error = function() {
	var localObj = this;
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = cm_delete_payment_card_obj.errorMessage;
	var errorCode = cm_delete_payment_card_obj.errorCode;
	var scheduledPayments = cm_delete_payment_card_obj.scheduledPayments;
	
	if(localObj.goBack != callFrom_constant.FROM_GO_BACK ){
		if (errorCode === cm_delete_payment_card_constant.CM_DELETE_CARD_SCHEDULED_PAYMENTS) {
			/* Which ever the card user going to delete if it is tied to schedule payments then API will return the above error code */
			var index = this.index;
			var cardExpandBoxId = this.cardExpandBoxId;
			var scheduledBillerName = "";
			/* Which ever billers are tied to deleted card render the loop then display on pop up */
			for ( var index1 = 0; index1 < scheduledPayments.length; index1++) {
				scheduledBillerName += "<li>" + scheduledPayments[index1].nickname + "</li>";
			}
			$('#showScheduledBillerForCard').empty();
			$('#showScheduledBillerForCard').append(scheduledBillerName);
			$('#headingScheduledPayments').text((messages['checkout.debit.delete_scheduled_card_label']));
			$('#paymentThisCard').text((messages['checkout.debit.delete_scheduled_card_label1']));
			$('#deletethisDebitCard').text((messages['checkout.debit.delete_scheduled_card_label4']));
			$('#dontDeleteDebitCard').val((messages['checkout.debit.delete_scheduled_card_dont_delete_label']));
			$('#deleteDebitCard').attr('name',   index+ '_' + cardExpandBoxId);
			/* Show the pop up with tied payments for the deleted card */
			showAnimatedPopup('idOfDeleteDebitCardPopUpError', 'idOfDeleteDebitCardPopUpErrorContainer');
			return;
		} /* else if (errorCode === "") {
			 while deleting card from the manage cards page Delete payment card returns follwoing error code show alert
			showErrorMessageForAddAndEditCard(messages['deleteCard.confirmationMessage.error']);
		} */
		clearTimeout(timeOutForErrorSlide);
		createSuccessAndErrorMessage(localObj.cardExpandBoxId);
		showErrorMessageForAddAndEditCard(errorMessage);
		restartTimerForSlideDown();
		/*showGeneralErrorMsg(errorMessage);*/
	} else {
		handleGetPaymentCards();
	}
};

/********************************************************************************************
' Name                 :   handle_location_load
' Return type          :   None
' Input Parameter(s)   :   req, startTime, apiName
' Purpose              :   Creating a class to handle the LOCATIO_LOAD API error with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function handle_location_load(req, startTime, apiName) {
    this.req = req;    this.startTime = startTime;    this.apiName = apiName;
}
/* Creating a method for the above class */
handle_location_load.prototype.error = function() {
	handleError(this.req, this.startTime, this.apiName);
	var errorMessage = location_load_obj.errorMessage;
	showGeneralErrorMsg(errorMessage);
};
