var isInitAppCalledSuccess = false;
var initAppFeatureName = new Object();
var footerUrlName = new Object();

/**
 * This file is used to contain all the web service request used within the application.
 */
/********************************************************************************************
 ' Name                 :   init_app
 ' Return type          :   None
 ' Input Parameter(s)   :   locale
 ' Purpose              :   Creating a class to handle the INIT_APP API call with following members
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   27th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function init_app(locale) {
	this.locale = locale;
	this.INIT_API_TIMEOUT = 45000;
}

var init_app_obj;
/* Creating a method for the above class */
init_app.prototype.call = function() {
	/* As per the multiple calling of deletecookies this code is blocked*/
	/*var userSignOut = parseBoolean(localStorage.getItem("registerUser"));
	if(userSignOut){
		deleteAllCookies();
	}*/
	apiTimeOutVal['INIT_APP'] = this.INIT_API_TIMEOUT;
	/* To show the progress bar */
	showProgressBar();
	var locale = getCookie("locale");
	/* Checking the locale value and Setting the locale in to cookie. */ 
	if (locale === null || locale === "") {
		locale = 'en_US';
		setCookie("locale", locale, 365);
	}
	var request = {};
	request.implementedApiVersion = messages['implementedApiVersion'];
	request.applicationId = applicationId;
	request.locale = locale;
	var startTime = new Date().getTime();
	makePublicAjaxCall({
		url: uri + "initializeApplication",
		requestObj: request,
		apiName: "INIT_APP",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					// Fetching data from Response object.
					var responseJsonObj = JSON.parse(req.responseText);
					init_app_obj = new parse_init_app(responseJsonObj); 

					var initAppMap = createMapForInitAppFeatures(init_app_obj);
					storeInLocalStorage(initAppMap);

					initAppFeatureName = init_app_obj.featureName;
					footerUrlName = JSON.parse(localStorage.getItem("footerURls"));
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"INIT_APP",req,e);
			} finally {
				isInitAppCalledSuccess = true;
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			if (error == 'timeout') { /* Handling the Error response. */
				showGeneralErrorMsg(messages['login.alert.timeOut']);
			}
			if (req != null) {
				var error_init_app = new handle_init_app(req, startTime,"INIT_APP");
				error_init_app.error();
			} else {
				showGeneralErrorMsg(messages['login.alert.serverError']);
			}
		}
	});
};

/********************************************************************************************
' Name                 :   user_auth
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_AUTH API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   27th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_auth(request) {
	this.request = request;
}

var user_auth_obj;
/* Creating a method for the above class */
user_auth.prototype.call = function() {
	var startTime = new Date().getTime();
	makePublicAjaxCall({
		url: uri + "public/user/authenticate",
		requestObj: this.request,
		apiName: "USER_AUTH",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					user_auth_obj = new parse_user_auth(responseJsonObj);

					var userAuthMap = createMapForUserAuth();
					storeCookieInSession(userAuthMap);

					handleUserAuthOnSuccess();
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,authUrl,req,e,status);
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_auth_obj = new parse_user_auth(responseJsonObj);

				var userAuthMap = createMapForUserAuth();
				storeCookieInSession(userAuthMap);

				handleUserAuthOnError(req, startTime);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status === 502) {
					enableButton("login_frm");
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   user_terms
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_TERMS API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_terms(request) {
	this.request = request;
}
var user_terms_obj;
/* Creating a method for the above class */
user_terms.prototype.call = function() {
	var startTime = new Date().getTime();
	makeAuthAjaxCall({
		url: uri + 'private/user/termsAndConditions',
		requestObj: this.request,
		apiName: "USER_TERMS",
		onSuccess: function (data, status, req) {
			try {
				/* Used for enable the button and coming from utility.js */
				enableButton("termCont");
				handleAuthenticate();
			} catch (e) {
				hideProgressBar();
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "USER_TERMS", req, e);
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			/* Used for enable the button and coming from utility.js */
			enableButton("termCont");
			// Error Handling.
			var error_user_terms = new handle_user_terms(req, startTime, "USER_TERMS");
			error_user_terms.error();
		}
	});
};

/********************************************************************************************
' Name                 :   user_sec_ques
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_SEC_QUES API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_sec_ques(request) {
	this.request = request;
}
var user_sec_ques_obj;
/* Creating a method for the above class */
user_sec_ques.prototype.call = function() {
	var startTime = new Date().getTime();
	makePublicAjaxCall({
		url : uri + "public/user/securityQuestion",
		requestObj : this.request,
		apiName : "USER_SEC_QUES",
		onSuccess : function(data, status, req) {
			try {
				/* Used for enable the button and coming from utility.js */
				enableButton("access_ques");

				var responseJsonObj = JSON.parse(req.responseText);
				user_sec_ques_obj = new parse_user_sec_ques(responseJsonObj);

				/* Fetching data from Response object and send to handler method. */
				handleUserSeqQuesOnSuccess();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "USER_SEC_QUES", req, e);
			} finally {
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		onError : function(req, status, error) {
			hideProgressBar(); /* To hide the progress bar */

			/* Used for enable the button and coming from utility.js */
			enableButton("access_ques");

			var responseJsonObj = JSON.parse(req.responseText);
			user_sec_ques_obj = new parse_user_sec_ques(responseJsonObj);

			// Error Handling.
			var error_user_sec_ques = new handle_user_sec_ques(req, startTime, "USER_TERMS");
			error_user_sec_ques.error();
		}
	});
};

/********************************************************************************************
' Name                 :   user_send_temp_pwd
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_SEND_TEMP_PWD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_send_temp_pwd(request) {
	this.request = request;
}
var user_send_temp_pwd_obj;
/* Creating a method for the above class */
user_send_temp_pwd.prototype.call = function() {
	var startTime = new Date().getTime();
	makePublicAjaxCall({
		url: uri + "public/user/sendNewTempPassword",
		requestObj: this.request,
		apiName: "USER_SEND_TEMP_PWD",
		onSuccess: function (data, status, req) {
			try {
				/* Used for enable the button and coming from utility.js */
				enableButton("sendSecurityAnswer");
				/* Store information into cookies like session token
                Fetching data from Response object and send to handler method.*/
				handleUserSendTempPwdOnSuccess();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"USER_SEND_TEMP_PWD",req,e);
			} finally {
				/* To hide the progress bar */
				hideProgressBar();
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */

			/* Used for enable the button and coming from utility.js */
			enableButton("sendSecurityAnswer");

			var responseJsonObj = JSON.parse(req.responseText);
			user_send_temp_pwd_obj = new parse_user_send_temp_pwd(responseJsonObj);

			// Error Handling.
			var error_user_send_temp_pwd = new handle_user_send_temp_pwd(req, startTime, "USER_SEND_TEMP_PWD");
			error_user_send_temp_pwd.error();
		}
	});
};

/********************************************************************************************
' Name                 :   user_reset_pwd
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_RESET_PWD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_reset_pwd(request) {
	this.request = request;
}
var user_reset_pwd_obj;
/* Creating a method for the above class */
user_reset_pwd.prototype.call = function() {
	var startTime = new Date().getTime();
	makeAuthAjaxCall({
		url: uri + "private/user/resetPassword",
		requestObj: this.request,
		apiName: "USER_RESET_PWD",
		onSuccess: function (data, status, req) {
			try {
				/* Used for enable the button and coming from utility.js */
				enableButton("reset_pwd");

				var responseJsonObj = JSON.parse(req.responseText);
				user_reset_pwd_obj = new parse_user_reset_pwd(responseJsonObj);

				handleUserResetPwdOnSuccess(user_reset_pwd_obj);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"USER_RESET_PWD",req,e);
			} finally {
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				/* Used for enable the button and coming from utility.js */
				enableButton("reset_pwd");

				var responseJsonObj = JSON.parse(req.responseText);
				user_reset_pwd_obj = new parse_user_reset_pwd(responseJsonObj);

				// Error Handling.
				var error_user_reset_pwd = new handle_user_reset_pwd(req, startTime, "USER_RESET_PWD");
				error_user_reset_pwd.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
			}
		}
	});
};

/********************************************************************************************
' Name                 :   user_get_profile
' Return type          :   None
' Input Parameter(s)   :   request, successResponseHandlerMethod, isAddEditBiller, billerCorpId
' , programId, isMsg, callFromMainPage
' Purpose              :   Creating a class to handle the USER_GET_PROFILE API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_get_profile(request, successResponseHandlerMethod, isAddEditBiller, billerCorpId, programId, isMsg, callFromMainPage) {
	this.request = request;
	this.successResponseHandlerMethod = successResponseHandlerMethod;
	this.isAddEditBiller = isAddEditBiller;
	this.callFromMainPage = callFromMainPage;
	/* These variable assignments will only work for Add/Edit Biller page */
	if(isAddEditBiller) {
		this.billerCorpId = billerCorpId; this.programId = programId; this.isMsg = isMsg;
	}
}
var user_get_profile_obj;
/* Creating a method for the above class */
user_get_profile.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url : uri + "private/user/getProfile",
		requestObj : this.request,
		apiName : "USER_GET_PROFILE",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_get_profile_obj = new parse_user_get_profile(responseJsonObj);

				if(localObj.isAddEditBiller) {
					handleUserGetProfileOnSuccess(user_get_profile_obj, localObj.billerCorpId, localObj.programId, localObj.isMsg);
				} else if (localObj.successResponseHandlerMethod) {
					localObj.successResponseHandlerMethod();
					hideProgressBar();
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "USER_GET_PROFILE", req, e);
			} finally {
				if ($('#chkoutPaymentSec').is(":visible")) {
					showProgressBar(); /* To show the progress bar */
				} else {
					if (isInitMainPage) {
						/*When disabling getCart() api we need to hide progress bar in place of getCart() api 
						 * we will use BP_GET_PENDING_TRANSACTIONS */
						bGetUserProfile = true;
					} else if (!localObj.callFromMainPage){
						hideProgressBar(); /* To hide the progress bar */
					}
				}
			}
		},
		/* Error response handler */ 
		onError : function(req, status, error) {
			if (isInitMainPage) {
				bGetUserProfile = true;
			} else {
				/* To hide the progress bar */
				hideProgressBar(); 
			}
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_get_profile_obj = new parse_user_get_profile(responseJsonObj);

				/* Error Handling. */ 
				var error_user_get_profile = new handle_user_get_profile(req, startTime, "USER_GET_PROFILE");
				error_user_get_profile.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502){
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   user_upd_profile
' Return type          :   None
' Input Parameter(s)   :   request, callFrom
' Purpose              :   Creating a class to handle the USER_UPD_PROFILE API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_upd_profile(request, callFrom) {
	this.request = request;
	this.callFrm = callFrom;
}
var user_upd_profile_obj;
/* Creating a method for the above class */
user_upd_profile.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;

	makeAuthAjaxCall({
		url: uri + "private/user/updateProfile",
		requestObj: this.request,
		apiName: "USER_UPD_PROFILE",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_upd_profile_obj = new parse_user_upd_profile(responseJsonObj);
				setCookie('userName', user_upd_profile_obj.user.username);
				if (localObj.callFrm === callFrom_constant.EDIT_PROFILE_SAVE_BTN_CALL) {
					userEditProfileUpdateOnSuccess();
					
				}else if (localObj.callFrm === callFrom_constant.SECURITY_SAVE_BTN_CALL) {
					userEditProfileUpdateOnSuccess(localObj.callFrm);
					
				} else if(localObj.callFrm === callFrom_constant.GUEST_USER_ON_CHECKOUT_CALL){
					handleUserUpdProfileOnSuccess();
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "USER_UPD_PROFILE", req, e);
			} finally {
				 /*To hide the progress bar */
				if(localObj.callFrm === callFrom_constant.SECURITY_SAVE_BTN_CALL){
					hideProgressBar();
				}
			}
		},
		onError: function (req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_upd_profile_obj = new parse_user_upd_profile(responseJsonObj);

				var error_user_upd_profile = new handle_user_upd_profile(req, startTime,"USER_UPD_PROFILE");
				error_user_upd_profile.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502){
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   user_init_reg
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the USER_INIT_REG API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_init_reg(request) {
	this.request = request;
}
var user_init_reg_obj;
/* Creating a method for the above class */
user_init_reg.prototype.call = function() {
	var startTime = new Date().getTime();
	
	makePublicAjaxCall({
	       url: uri + "public/user/userInternalRegistration",
	       requestObj: this.request,
	       apiName: "USER_INT_REG",
	       onSuccess: function (data, status, req) {
	    	   try {
	    		   var responseJsonObj = JSON.parse(req.responseText);
	    		   user_init_reg_obj = new parse_user_init_reg(responseJsonObj);
	    		   
	    		   handleUserInitRegOnSuccess();
	    	   } catch (e) {
	        	   console.log('Error ' + e + "\n" + e.stack);
	        	   handleApplicationError(startTime,"USER_INT_REG",req);
	           }
	       },
	       onError: function (req, status, error) {

	    	   hideProgressBar(); /* To hide the progress bar */
	    	   try {
	    		   var responseJsonObj = JSON.parse(req.responseText);
	    		   user_init_reg_obj = new parse_user_init_reg(responseJsonObj);

	    		   // Error Handling.
	    		   var error_user_init_reg = new handle_user_init_reg(req, startTime,"USER_INT_REG");
	    		   error_user_init_reg.error();
	    	   } catch (e) {
	    		   console.log('Error ' + e + "\n" + e.stack);
	    		   if(req.status === 502) {
	    			   hideProgressBar();
	    		   }
	    	   }
	       }
	   });
};

/********************************************************************************************
' Name                 :   user_guest
' Return type          :   None
' Input Parameter(s)   :   request, isContFlag
' Purpose              :   Creating a class to handle the USER_GUEST API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function user_guest(request, isContFlag) {
	this.request = request;
	this.isContFlag = isContFlag;
}
var user_guest_obj;
/* Creating a method for the above class */
user_guest.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makePublicAjaxCall({
		url: uri + "public/guestUser/createGuestUser",
		requestObj: this.request,
		apiName: "USER_GUEST",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_guest_obj = new parse_user_guest(responseJsonObj);

				gaHandleSignup(localObj.request.applicationId, user_guest_obj.userId, true);

				handleUserGuestOnSuccess(localObj.isContFlag);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"USER_GUEST",req,e);
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				user_guest_obj = new parse_user_guest(responseJsonObj);

				// Error Handling.
				var error_user_guest = new handle_user_guest(req, startTime, "USER_GUEST");
				error_user_guest.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status === 502) {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   upgrade_guest_user
' Return type          :   None
' Input Parameter(s)   :   request, fromCheckOutPage, tempSequrityQuestion, tempSecurityAnswer
' Purpose              :   Creating a class to handle the UPGRADE_GUEST_USER API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function upgrade_guest_user(request, fromCheckOutPage, tempSequrityQuestion, tempSecurityAnswer) {
	this.request = request;
	this.fromCheckOutPage = fromCheckOutPage;
	this.tempSequrityQuestion = tempSequrityQuestion;
	this.tempSecurityAnswer = tempSecurityAnswer;
}
var upgrade_guest_user_obj;
/* Creating a method for the above class */
upgrade_guest_user.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makePublicAjaxCall({
		url: uri + "public/guestUser/upgradeGuestUser",
		requestObj: this.request,
		apiName: "UPGRADE_GUEST_USER",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				upgrade_guest_user_obj = new parse_upgrade_guest_user(responseJsonObj);
                gaHandleUpgrade(applicationId, upgrade_guest_user_obj.user_id);

				handleUpgradeGuestUserOnSuccess(localObj.request, localObj.fromCheckOutPage
						, localObj.tempSequrityQuestion, localObj.tempSecurityAnswer);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "UPGRADE_GUEST_USER", req, e);
			} finally {
				if(localObj.fromCheckOutPage !=6) {
					if(localObj.fromCheckOutPage !=2){
						 /* To hide the progress bar */
						hideProgressBar();						
					}
				}
			}
		},
		onError: function (req, status, error) {
			/* To hide the progress bar */
			hideProgressBar(); 
			if(req.status != 502) {
				var responseJsonObj = JSON.parse(req.responseText);
				upgrade_guest_user_obj = new parse_upgrade_guest_user(responseJsonObj);
				var error_upgrade_guest_user = new handle_upgrade_guest_user(req, startTime, "UPGRADE_GUEST_USER");
				error_upgrade_guest_user.error();
			} else {
				hideProgressBar();
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_biller_corp_search
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_BILLER_CORP_SEARCH API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_biller_corp_search(request) {
	this.request = request;
}
var bp_biller_corp_search_obj;
/* Creating a method for the above class */
bp_biller_corp_search.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makePublicAjaxCall({
		url: uri + "public/corpBillPay/billerSearchConsolidated",
		requestObj: this.request,
		apiName: "BP_BILLER_CORP_SEARCH",
		onSuccess: function (data, status, req) {
			try {
				gaHandleSearch(localObj.request.searchCriteria);
				var responseJsonObj = JSON.parse(req.responseText);
				bp_biller_corp_search_obj = new parse_bp_biller_corp_search(responseJsonObj);

				handleBpBillerCorpSearchOnSuccess();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_BILLER_CORP_SEARCH", req, e);
			} finally {
				/* To hide the progress bar */
				hideProgressBar(); 
			}
		},
		onError: function (req, status, error) {
			/* To hide the progress bar */
			hideProgressBar(); 
			try {
				$("#searchLoadingImg").removeClass("mySearchLoading");
				$("#searchInfoText").hide();
				$('#resultSetArea').empty();
				$("#morePamentMsgArea").hide();

				var responseJsonObj = JSON.parse(req.responseText);
				bp_biller_corp_search_obj = new parse_bp_biller_corp_search(responseJsonObj);
				var error_bp_biller_corp_search = new handle_bp_biller_corp_search(req, startTime, "BP_BILLER_CORP_SEARCH");
				error_bp_biller_corp_search.error();
			} catch(e) {
				console.log('Error ' + e + "\n" + e.stack);
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_biller_corp_creds
' Return type          :   None
' Input Parameter(s)   :   request, isMsg
' Purpose              :   Creating a class to handle the BP_BILLER_CORD_CREDS API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_biller_corp_creds(request, isMsg) {
	this.request = request;
	this.isMsg = isMsg;
}
var bp_biller_corp_creds_obj;
/* Creating a method for the above class */
bp_biller_corp_creds.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makePublicAjaxCall({
		url: uri + "public/corpBillPay/billerCorpCredentials",
		requestObj: this.request,
		apiName: "BP_BILLER_CORP_CREDS",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_biller_corp_creds_obj = new parse_bp_biller_corp_creds(responseJsonObj);

				handleBpBillerCorpCredsOnSuccess(localObj.isMsg);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_BILLER_CORP_CREDS", req, e);
			} finally {
				hideProgressBar(); /* To hide the progress bar */
			}
		},
		/* Error response handler */ 
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_biller_corp_creds_obj = new parse_bp_biller_corp_creds(responseJsonObj);

				/*  Error Handling. */
				var error_bp_biller_corp_creds = new handle_bp_biller_corp_creds(req, startTime, "BP_BILLER_CORP_CREDS");
				error_bp_biller_corp_creds.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_get_corp_account
' Return type          :   None
' Input Parameter(s)   :   request, programId, isMsg
' Purpose              :   Creating a class to handle the BP_GET_CORP_ACCOUNT API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_get_corp_account(request, programId, isMsg) {
	this.request = request;
	this.programId = programId;
	this.isMsg = isMsg;
}
var bp_get_corp_account_obj;
/* Creating a method for the above class */
bp_get_corp_account.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/corpBillPay/getCorpAccount/",
		requestObj: this.request,
		apiName: "BP_GET_CORP_ACCOUNT",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_get_corp_account_obj = new parse_bp_get_corp_account(responseJsonObj);

				handleBpGetCorpAccountOnSuccess(localObj.programId, localObj.isMsg);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_GET_CORP_ACCOUNT", req, err);
			}
		},
		/*  Error response handler */ 
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_get_corp_account_obj = new parse_bp_get_corp_account(responseJsonObj);

				// Error Handling.
				var error_bp_get_corp_account = new handle_bp_get_corp_account(req, startTime, "BP_GET_CORP_ACCOUNT");
				error_bp_get_corp_account.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_save_biller_corp_acct_creds
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_SAVE_BILLER_CORP_ACCT_CREDS API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_save_biller_corp_acct_creds(request) {
	this.request = request;
}
var bp_save_biller_corp_acct_creds_obj;
/* Creating a method for the above class */
bp_save_biller_corp_acct_creds.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + 'private/corpBillPay/saveBillerCorpAccountCredentials',
		requestObj: this.request,
		apiName: "BP_SAVE_BILLER_CORP_ACCT_CREDS",
		onSuccess: function (data, status, req) {
			gaBillerSetup(localObj.request.userId,localObj.request.billerCorpId, true);
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_save_biller_corp_acct_creds_obj = new parse_bp_save_biller_corp_acct_creds(responseJsonObj);
				removeMessageFromDivId();
				handleBpSaveBillerCorpAcctCredsOnSuccess();

			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_SAVE_BILLER_CORP_ACCT_CREDS", req, e);
			}
		},
		onError: function (req, status, error) { /* Error response handler */ 
			hideProgressBar(); /* To hide the progress bar */
			try { 
				gaBillerSetup(localObj.request.userId,localObj.request.billerCorpId, false);
				var responseJsonObj = JSON.parse(req.responseText);
				bp_save_biller_corp_acct_creds_obj = new parse_bp_save_biller_corp_acct_creds(responseJsonObj);

				// Error Handling.
				var error_bp_save_biller_corp_acct_creds = new handle_bp_save_biller_corp_acct_creds(req, startTime, "BP_SAVE_BILLER_CORP_ACCT_CREDS");
				error_bp_save_biller_corp_acct_creds.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_account_lite
' Return type          :   None
' Input Parameter(s)   :   request, removeFlag
' Purpose              :   Creating a class to handle the BP_ACCOUNT_LITE API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_account_lite(request, removeFlag) {
	this.request = request;
	this.removeFlag = removeFlag;
}
var bp_account_lite_obj;
var removeBill;
var chkAccounts = false;
/* Creating a method for the above class */
bp_account_lite.prototype.call = function() {
	var startTime = new Date().getTime();
	removeBill = false;
	makeAuthAjaxCall({
		url: uri + 'private/corpBillPay/accountsLite',
		requestObj: this.request,
		apiName: "BP_GET_CORP_ACCOUNT",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_account_lite_obj = new parse_bp_account_lite(responseJsonObj); 

				handleBpAccountLiteOnSuccess();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_GET_CORP_ACCOUNT", req, e);
			} finally {
				if ($('#chkoutPaymentSec').is(":visible")) {
					showProgressBar(); /* To show the progress bar */
				} else {
					if (isInitMainPage) {
						bAccount = true;
					} else {
						checkBooleanValueOfApiVariable(); /* To hide the progress bar */
						removeBill = true;
					}
				}
			}
		},
		onError: function (req, status, error) {
			if (isInitMainPage) {
				bAccount = true;
				bGetCart = true;
			} else {
				hideProgressBar(); /* To hide the progress bar */
			}
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_account_lite_obj = new parse_bp_account_lite(responseJsonObj);

				// Error Handling.
				var error_bp_account_lite = new handle_bp_account_lite(req, startTime, "BP_GET_CORP_ACCOUNT");
				error_bp_account_lite.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_get_pending_transaction
' Return type          :   None
' Input Parameter(s)   :   request, successResponseHandler
' Purpose              :   Creating a class to handle the BP_GET_PENDING_TRANSACTION API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_get_pending_transaction(request, successResponseHandler) {
	this.request = request;
	this.successResponseHandler = successResponseHandler;
}
var bp_get_pending_transaction_obj;
/* Creating a method for the above class */
bp_get_pending_transaction.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url : uri + "private/billPay/getPendingTransactions",
		requestObj : this.request,
		apiName : "BP_GET_PENDING_TRANSACTIONS",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_get_pending_transaction_obj = new parse_bp_get_pending_transaction(responseJsonObj);

				handleBpGetPendingTransactionsOnSuccess(localObj.successResponseHandler);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
			} finally {
				if(isInitMainPage){
					bGetCart = true;
				} else {
					hideProgressBar();/* To hide the progress bar */
				}
			}
		},
		onError : function(req, status, error) {
			if(isInitMainPage){
				bGetCart = true;
			} else {
				hideProgressBar();/* To hide the progress bar */
			}
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_get_pending_transaction_obj = new parse_bp_get_pending_transaction(responseJsonObj);

				/* Error Handling. */ 
				var error_bp_get_pending_transaction = new handle_bp_get_pending_transaction(req, startTime, "BP_GET_PENDING_TRANSACTIONS");
				error_bp_get_pending_transaction.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_hist
' Return type          :   None
' Input Parameter(s)   :   request, callFor, removeFlag
' Purpose              :   Creating a class to handle the BP_HIST API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_hist(request, callFor, removeFlag) {
	this.request = request;
	this.callType = callFor;
	this.removeFlag = removeFlag;
}
var bp_hist_obj;
var chkFlagForHist = false;
/* Creating a method for the above class */
bp_hist.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/billPay/history",
		requestObj: this.request,
		apiName: "BP_HIST",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					bp_hist_obj = new parse_bp_hist(responseJsonObj);

					handleBpHistOnSuccess(localObj.callType);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_HIST", req, e);
			} finally {
				if(isInitMainPage){
					bCartHist = true;
				} else if(localObj.removeFlag || (!parseBoolean(localStorage.getItem("registerUser")) && removeBill)) {
					hideProgressBar();/* To hide the progress bar */
				}
				chkFlagForHist = true;
			}
		},
		onError: function (req, status, error) {
			hideProgressBar();/* To hide the progress bar */
			try{
				var responseJsonObj = JSON.parse(req.responseText);
				bp_hist_obj = new parse_bp_hist_obj(responseJsonObj);

				var error_bp_hist = new handle_bp_hist(req, startTime, "BP_HIST");
				error_bp_hist.error();
			}catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};
/********************************************************************************************
' Name                 :   bp_scheduled_payment_hist
' Return type          :   None
' Input Parameter(s)   :   request, callFor, removeFlag
' Purpose              :   Creating a class to handle the BP_SCHEDULE_PAYMENT_HIST API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_scheduled_payment_hist(request, callFor, removeFlag) {
	this.request = request;
	this.callArea = callFor;
	this.removeFlag = removeFlag ;
}
var bp_scheduled_payment_hist_obj;
var chkScheduleHist = false;
/* Creating a method for the above class */
bp_scheduled_payment_hist.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/corpBillPay/scheduledPaymentHistory",
		requestObj: this.request,
		apiName: "BP_SCHEDULED_PAYMENT_HIST",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					bp_scheduled_payment_hist_obj = new parse_bp_scheduled_payment_hist(responseJsonObj);
					handleBPSchedulePaymentHistOnSuccess(localObj.callArea);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"BP_SCHEDULED_PAYMENT_HIST",req,e);
			} finally {
				if ($('#chkoutPaymentSec').is(":visible")) {
					showProgressBar(); /* To show the progress bar */
					chkScheduleHist  = true;
				} else {
					if(isInitMainPage){
						bpSchedPay = true;
					} else if((!localObj.removeFlag) && localObj.callArea != callFrom_constant.SIDE_BAR_CANCEL_CALL 
							|| (!parseBoolean(localStorage.getItem("registerUser")) && removeBill)){
						hideProgressBar(); /* To hide the progress bar */
					}
				}
			}
		},
		onError: function (req, status, error) {
			if(isInitMainPage){
				bpSchedPay = true;
			}
			hideProgressBar(); /* To hide the progress bar */
			try{
				var responseJsonObj = JSON.parse(req.responseText);
				bp_scheduled_payment_hist_obj = new parse_bp_scheduled_payment_hist(responseJsonObj);

				var error_bp_scheduled_payment_hist = new handle_bp_scheduled_payment_hist(req,startTime,"BP_SCHEDULED_PAYMENT_HIST");
				error_bp_scheduled_payment_hist.error();
			}catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};
/********************************************************************************************
' Name                 :   bp_cancel_scheduled_payment
' Return type          :   None
' Input Parameter(s)   :   request, callFrom
' Purpose              :   Creating a class to handle the BP_CANCEL_SCHEDULE_PAYMENT API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_cancel_scheduled_payment(request, callFrom) {
	this.request = request;
	this.callArea = callFrom;
}
var bp_cancel_scheduled_payment_obj;
/* Creating a method for the above class */
bp_cancel_scheduled_payment.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/billPay/cancelScheduledPayment/",
		requestObj: this.request,
		apiName: "BP_CANCEL_SCHEDULED_PAYMENT",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					bp_cancel_scheduled_payment_obj = parse_bp_cancel_scheduled_payment(responseJsonObj);

					handleBPCancelSchedulePaymentHistOnSuccess(localObj.callArea);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"BP_CANCEL_SCHEDULED_PAYMENT",req,e);
			} 
		},
		onError: function (req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			try{
				var responseJsonObj = JSON.parse(req.responseText);
				bp_cancel_scheduled_payment_obj = new parse_bp_cancel_scheduled_payment(responseJsonObj);

				var error_bp_cancel_scheduled_payment = new handle_bp_cancel_scheduled_payment(req,startTime,
														"BP_CANCEL_SCHEDULED_PAYMENT", localObj.callArea);
				error_bp_cancel_scheduled_payment.error();
			}catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502){
					showGeneralErrorMsg(req.responseText);					
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_remove_biller_corp_account
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_REMOVE_BILLER_CORP_ACCOUNT API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_remove_biller_corp_account(request) {
	this.request = request;
}
var bp_remove_biller_corp_account_obj;
/* Creating a method for the above class */
bp_remove_biller_corp_account.prototype.call = function() {
	var startTime = new Date().getTime();
	makeAuthAjaxCall({
		url: uri + 'private/billPay/removeBillerCorpAccount',
		requestObj: this.request,
		apiName: "BP_REMOVE_BILLER_CORP_ACCOUNT",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				if(responseJsonObj){
					/* Storing the biller boxes data into tempBillArray so that is can be populated later after BP_ACCOUNT_LITE API call */
					setTempBillArray();
					/* Used for getting biler account info and re draw the biller boxes */
					getBillerAccounts(true);
					removeMessageFromDivId();
					/*Updating the sidebar after removing the biller*/
					handleBPSchedulePaymentHist('', true);
					handleGetLatestBPHistory(false);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_REMOVE_BILLER_CORP_ACCOUNT", req, e);
			} 
		},
		/* Error response handler */ 
		onError: function (req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_remove_biller_corp_account_obj = new parse_bp_remove_biller_corp_account(responseJsonObj);

				var error_handle_bp_remove_biller_corp_account = new handle_bp_remove_biller_corp_account(req, startTime, "BP_REMOVE_BILLER_CORP_ACCOUNT");
				error_handle_bp_remove_biller_corp_account.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					/*showGeneralErrorMsg(req.responseText);*/
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			} 
		}
	});

};

/********************************************************************************************
' Name                 :   bp_calc_submit_date
' Return type          :   None
' Input Parameter(s)   :   request, billerCorpId, liDateObject
' Purpose              :   Creating a class to handle the BP_CALC_SUMBIT_DATE API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_calc_submit_date(request, billerCorpId, liDateObject) {
	this.request = request;
	this.billerCorpId = billerCorpId;
	this.liDateObject = liDateObject;
}
var bp_calc_submit_date_obj;
/* Creating a method for the above class */
bp_calc_submit_date.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + 'private/corpBillPay/calcSubmitDate',
		requestObj: this.request,
		apiName: "BP_CALC_SUBMIT_DATE",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_calc_submit_date_obj = new parse_bp_calc_submit_date(responseJsonObj);

				handleBpCalcSumbitDateOnSuccess(localObj.billerCorpId, localObj.liDateObject);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_CALC_SUBMIT_DATE", req, e);
			} finally {
				/* To hide the progress bar */
				hideProgressBar();
			}
		},
		onError: function (req, status, error) {
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_calc_submit_date_obj = new parse_bp_calc_submit_date(responseJsonObj);

				//Error handling
				var error_bp_calc_submit_date = new handle_bp_calc_submit_date(req, startTime,"BP_CALC_SUBMIT_DATE");
				error_bp_calc_submit_date.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_add_verify_cart_item
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_ADD_VERIFY_CART_ITEM API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_add_verify_cart_item(request) {
	this.request = request;
}
var bp_add_verify_cart_item_obj;
/* Creating a method for the above class */
bp_add_verify_cart_item.prototype.call = function() {
	var startTime = new Date().getTime();
	makeAuthAjaxCall({
		url : uri + "private/corpBillPay/addVerifyCartItem/",
		requestObj : this.request,
		apiName : "BP_ADD_VERIFY_CART_ITEM",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_add_verify_cart_item_obj = new parse_bp_add_verify_cart_item(responseJsonObj);

				handleBpAddVerifyOnSuccess();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_ADD_VERIFY_CART_ITEM", req, e);
			}
		},
		onError : function(req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_add_verify_cart_item_obj = new parse_bp_add_verify_cart_item(responseJsonObj);

				var error_handle_bp_add_verify_cart_item = new handle_bp_add_verify_cart_item(req, startTime, "BP_ADD_VERIFY_CART_ITEM");
				error_handle_bp_add_verify_cart_item.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502){
					showGeneralErrorMsg(req.responseText);					
				} else {
					hideProgressBar();
				}
			}
		}
	});

};

/********************************************************************************************
' Name                 :   bp_verify_funding_sources
' Return type          :   None
' Input Parameter(s)   :   request, applyClicked
' Purpose              :   Creating a class to handle the BP_VERIFY_FUNDING_SOURCES API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_verify_funding_sources(request, applyClicked) {
	this.request = request;
	this.applyClicked = applyClicked;
}
var bp_verify_funding_sources_obj;
/* Creating a method for the above class */
bp_verify_funding_sources.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/billPay/verifyFundingSources_3_2/",
		requestObj: this.request,
		apiName: "BP_VERIFY_FUNDING_SOURCES_3_2",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					bp_verify_funding_sources_obj = new parse_bp_verify_funding_sources(responseJsonObj);

					handleBpVerifyFundingSourceOnSuccess(localObj.applyClicked);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_VERIFY_FUNDING_SOURCES_3_2", req, e);
			} finally {
				hideProgressBar();/* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_verify_funding_sources_obj = new parse_bp_verify_funding_sources(responseJsonObj);

				//Error handling
				var error_handle_bp_verify_funding_sources = new handle_bp_verify_funding_sources(req, this.startTime, "BP_VERIFY_FUNDING_SOURCES_3_2");
				error_handle_bp_verify_funding_sources.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_verify_funding_sources
' Return type          :   None
' Input Parameter(s)   :   request, applyClicked
' Purpose              :   Creating a class to handle the BP_VERIFY_FUNDING_SOURCES API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_validate_promo_code(request, applyClicked) {
	this.request = request;
	this.applyClicked = applyClicked;
}
var bp_validate_promo_code_obj;
/* Creating a method for the above class */
bp_validate_promo_code.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + "private/billPay/validatePromoCode/",
		requestObj: this.request,
		apiName: "BP_VALIDATE_PROMO_CODE",
		onSuccess: function (data, status, req) {
			try {
				if(req.status === 200) {
					var responseJsonObj = JSON.parse(req.responseText);
					bp_validate_promo_code_obj = new parse_bp_validate_promo_code(responseJsonObj);

					handleBpValidatePromoCode(localObj.applyClicked);
				}
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_VALIDATE_PROMO_CODE", req, e);
			} finally {
				hideProgressBar();/* To hide the progress bar */
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_validate_promo_code_obj = new parse_bp_validate_promo_code(responseJsonObj);

				//Error handling
				var error_handle_bp_validate_promo_code = new handle_bp_validate_promo_code(req, this.startTime, "BP_VALIDATE_PROMO_CODE");
				error_handle_bp_validate_promo_code.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_submit_payment_group
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_SUBMIT_PAYMENT_GROUP API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_submit_payment_group(request) {
	this.request = request;
}
var bp_submit_payment_group_obj;
var newFlag = false;
var promoCodeForChek = '';
/* Creating a method for the above class */
bp_submit_payment_group.prototype.call = function() {
	var startTime =  new Date().getTime();
	clearInterval(timeIntevalOfAddCard);
	makeAuthAjaxCall({
		url : uri + "private/corpBillPay/submitPaymentGroup/",
		requestObj : this.request,
		apiName : "BP_SUBMIT_PAYMENT_GROUP",
		onSuccess : function(data, status, req) {
			/* If BP_SUBMIT_CART returns with a failed response (status != 200), then remain on the Checkout page and display corresponding 
			 * error message from the resource bundle. If BP_SUBMIT_CART returns with a successful response (status = 200), 
			 * then forward the user to the History � Detail Receipt Page */
			var responseJsonObj = JSON.parse(req.responseText);
			try {
				bp_submit_payment_group_obj = new parse_bp_submit_payment_group(responseJsonObj);
				handleBpSubmitPaymentGroupOnSucess();
			} catch (e) {
				/* To hide the progress bar */
				hideProgressBar();
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "BP_SUBMIT_PAYMENT_GROUP", req, e);
			}
		},
		onError : function(req, status, error) {
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_submit_payment_group_obj = new parse_bp_submit_payment_group(responseJsonObj);
				setIntervalToCalculateServiceFeeChk();
				var error_bp_submit_payment_group = new handle_bp_submit_payment_group(req, startTime
						, "BP_SUBMIT_PAYMENT_GROUP", newFlag);
				error_bp_submit_payment_group.error();
				promoCodeForChek = $("#promoCodeDiscount3").val().trim();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			} 
		}
	});
};

/********************************************************************************************
' Name                 :   bp_check_payment_group_status
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_CHECK_PAYMENT_GROUP_STATUS API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_check_payment_group_status(request) {
	this.request = request;
}
var bp_check_payment_group_status_obj;
/* Creating a method for the above class */
bp_check_payment_group_status.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url : uri + "private/billPay/checkPaymentGroupStatus/",
		requestObj : this.request,
		apiName : "BP_CHECK_PAYMENT_GROUP_STATUS",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_check_payment_group_status_obj = new parse_bp_check_payment_group_status(responseJsonObj);
				handleBPCheckPaymentGroupStatusOnSucess(localObj.request);
			} catch (e) {
				/* To hide the progress bar */
				hideProgressBar();
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"BP_CHECK_PAYMENT_GROUP_STATUS",req,e);
			}
		},
		onError : function(req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			clearCheckCartStatusTrigger();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_check_payment_group_status_obj = new parse_bp_check_payment_group_status(responseJsonObj);

				var error_bp_check_payment_group_status = new handle_bp_check_payment_group_status(req, startTime, "BP_CHECK_PAYMENT_GROUP_STATUS");
				error_bp_check_payment_group_status.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_cart_hist
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_CART_HIST API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_cart_hist(request) {
	this.request = request;
}
var bp_cart_hist_obj;
/* Creating a method for the above class */
bp_cart_hist.prototype.call = function() {
	var startTime = new Date().getTime();

	makeAuthAjaxCall({
		url: uri + "private/billPay/cartHist",
		requestObj: this.request,
		apiName: "BP_CART_HIST",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_cart_hist_obj = new parse_bp_cart_hist(responseJsonObj);

				handleBPCartHistOnSuccess();
			} catch (e) {
				handleApplicationError(startTime,"BP_CART_HIST",req);
				console.log('Error ' + e + "\n" + e.stack);
			} finally {
				/* To hide the progress bar */
				hideProgressBar();
			}
		},
		/* Error response handler */
		onError: function (req, status, error) {
			if(isInitMainPage){
				bCartHist = true;
			}
			/* To hide the progress bar */
			hideProgressBar();
			try{
				var responseJsonObj = JSON.parse(req.responseText);
				bp_cart_hist_obj = new parse_bp_cart_hist(responseJsonObj);

				var error_bp_cart_hist = new handle_bp_cart_hist(req, startTime,"BP_CART_HIST");
				error_bp_cart_hist.error();
			} catch(e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_cart_receipt
' Return type          :   None
' Input Parameter(s)   :   request, cartId, displayPaymentSummary, returnPaymentFlag
' Purpose              :   Creating a class to handle the BP_CART_RECEIPT API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_cart_receipt(request, cartId, displayPaymentSummary, returnPaymentFlag) {
	this.request = request;
	this.cartId = cartId;
	this.displayPaymentSummary = displayPaymentSummary;
	this.returnPaymentFlag = returnPaymentFlag;
}
var bp_cart_receipt_obj;
/* Creating a method for the above class */
bp_cart_receipt.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this; 

	makeAuthAjaxCall({
		url: uri + "private/billPay/cartReceipt_3_2_3/",
		requestObj: this.request,
		apiName: "BP_CART_RECEIPT",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				bp_cart_receipt_obj = new parse_bp_cart_receipt(responseJsonObj);

				handleBPCartReceiptOnSuccess(localObj.displayPaymentSummary, localObj.returnPaymentFlag);
			} catch (e) {
				handleApplicationError(startTime,"BP_CART_RECEIPT_3_2_3",req);
				console.log('Error ' + e + "\n" + e.stack);
			} finally {
				if(!localObj.displayPaymentSummary) {
					hideProgressBar(); /*To hide the progress bar */
				}
			}
		},
		/* Error response handler */ 
		onError: function (req, status, error) {
			/* To hide the progress bar */
			if(isInitMainPage){
				bCartReceipt = true;
			}
			hideProgressBar();
			$('#historyDisclaimerId').hide();
			try{
				var responseJsonObj = JSON.parse(req.responseText);
				bp_cart_receipt_obj = new parse_bp_cart_hist(responseJsonObj);

				var error_bp_cart_receipt = new handle_bp_cart_receipt(req, startTime,"BP_CART_RECEIPT_3_2_3");
				error_bp_cart_receipt.error();
				bCartReceipt = true;
			} catch(e) {
				console.log('Error ' + e + "\n" + e.stack);
				bCartReceipt = true;
				if(req.status != 502) {
					showGeneralErrorMsg("Error message.");
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   bp_cart_receipt_reprint
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the BP_CART_RECEIPT_REPRINT API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function bp_cart_receipt_reprint(request) {
	this.request = request;
}
var bp_cart_receipt_reprint_obj;
/* Creating a method for the above class */
bp_cart_receipt_reprint.prototype.call = function() {
};

/********************************************************************************************
' Name                 :   cm_get_payment_card
' Return type          :   None
' Input Parameter(s)   :   requestflagForCVV, cardPaymentBoxId, index, flagForAddCard, cardType
'		, cardServiceFlag
' Purpose              :   Creating a class to handle the CM_GET_PAYMENT_CARD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function cm_get_payment_card(request, flagForCVV, cardPaymentBoxId, index, flagForAddCard, cardType
		, cardServiceFlag) {
	this.request = request;
	this.flagForCVV = flagForCVV;
	this.cardPaymentBoxId = cardPaymentBoxId;
	this.index = index;
	this.flagForAddCard = flagForAddCard;
	this.cardType = cardType;
	this.cardServiceFlag = cardServiceFlag;
}
var cm_get_payment_card_obj;
/* Creating a method for the above class */
cm_get_payment_card.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + 'private/paymentCard/get',
		requestObj: this.request,
		apiName: "CM_GET_PAYMENT_CARD",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				cm_get_payment_card_obj = new parse_cm_get_payment_card(responseJsonObj);

				if(localObj.flagForCVV === callFrom_constant.MANAGE_CARD_FROM_MAINPAGE){
					getUserProfile(true, getUserProfileSection, false, null, null, null, localObj.flagForCVV);
					
				} else if (localObj.flagForCVV === callFrom_constant.MANAGE_CARD_DELTE_CALL || 
						localObj.flagForCVV === callFrom_constant.MANAGE_DELTE_CARD_SCHEDULE_CALL ||
						localObj.flagForCVV === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL){
					
					showDefaultPaymentCardsManage(callFrom_constant.MANAGE_CARD_FROM_MAINPAGE
							, localObj.flagForAddCard, localObj.cardType);
					
				} else {
					handleCmGetPaymentCardOnSuccess(localObj.flagForCVV, localObj.cardPaymentBoxId
							, localObj.index, localObj.cardServiceFlag);
				}
				
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime, "CM_GET_PAYMENT_CARD", req, e);
				hideProgressBar();
			} finally {
				/* To hide the progress bar */
				promoCodeForChek = $("#promoCodeDiscount3").val().trim();
				if( window.location.hash != "#profile"){
					if (!localObj.getPaymentGlobal) {
						hideProgressBar();
					}
				}
			}
		},
		onError: function (req, status, error) {
			hideProgressBar();
			try {
				var responseJsonObj = JSON.parse(req.responseText);
				cm_get_payment_card_obj = new parse_cm_get_payment_card(responseJsonObj);

				var error_cm_get_payment_card = new handle_cm_get_payment_card(req, startTime, "CM_GET_PAYMENT_CARD");
				error_cm_get_payment_card.error(); 
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   cm_add_payment_card
' Return type          :   None
' Input Parameter(s)   :   request, cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut
' Purpose              :   Creating a class to handle the CM_ADD_PAYMENT_CARD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function cm_add_payment_card(request, cardPaymentBoxId, manageCardCallForAddingCard, manageCardsCallForCheckOut) {
	this.request = request;
	this.cardPaymentBoxId = cardPaymentBoxId;
	this.manageCardCallForAddingCard=manageCardCallForAddingCard;
	this.manageCardsCallForCheckOut=manageCardsCallForCheckOut;
}
var cm_add_payment_card_obj;
/* Creating a method for the above class */
cm_add_payment_card.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;
	makeAuthAjaxCall({
		url: uri + 'private/paymentCard/add_3_2',
		requestObj: this.request,
		apiName: "CM_ADD_PAYMENT_CARD_3_2",
		onSuccess: function (data, status, req) {
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_add_payment_card_obj = new parse_cm_add_payment_card(responseJsonObject);

				handleCmAddPaymentCardOnSuccess(localObj.cardPaymentBoxId, localObj.manageCardCallForAddingCard
						, localObj.manageCardsCallForCheckOut);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"CM_ADD_PAYMENT_CARD_3_2",req,e);
			} finally {
				activateCheckoutPayButton();
			}
		},
		onError: function (req, status, error) {
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_add_payment_card_obj = new parse_cm_add_payment_card(responseJsonObject);

				hideProgressBar(); 
				activateCheckoutPayButton();
				setIntervalToCalculateServiceFeeChk();
				// Error Handling.
				var error_cm_add_payment_card = new handle_cm_add_payment_card(req, startTime,"CM_ADD_PAYMENT_CARD");
				error_cm_add_payment_card.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(e);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   cm_edit_payment_card
' Return type          :   None
' Input Parameter(s)   :   request, cardExpandBoxId, index, manageCardsCallForCheckOut
' Purpose              :   Creating a class to handle the CM_EDIT_PAYMENT_CARD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function cm_edit_payment_card(request, cardExpandBoxId, index, manageCardsCallForCheckOut) {
	this.request = request;
	this.cardExpandBoxId = cardExpandBoxId;
	this.index = index;
	this.manageCardsCallForCheckOut = manageCardsCallForCheckOut;
}
var cm_edit_payment_card_obj;
/* Creating a method for the above class */
cm_edit_payment_card.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;

	makeAuthAjaxCall({
		url : uri + 'private/paymentCard/edit_3_2',
		requestObj : this.request,
		apiName : "CM_EDIT_PAYMENT_CARD_3_2",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_edit_payment_card_obj = new parse_cm_edit_payment_card(responseJsonObject);
				handleEditPaymentCardsOnSuccess(localObj.cardExpandBoxId, localObj.index, localObj.manageCardsCallForCheckOut);

			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"CM_EDIT_PAYMENT_CARD_3_2",req,status,e);
				hideProgressBar();
			}
		},
		// Error response handler
		onError : function(req, status, error) {
			/* To hide the progress bar */
			hideProgressBar();
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_edit_payment_card_obj = new parse_cm_edit_payment_card(responseJsonObject);

				var error_cm_edit_payment_card = new handle_cm_edit_payment_card(req, startTime, "CM_EDIT_PAYMENT_CARD", localObj.cardExpandBoxId, localObj.index);
				error_cm_edit_payment_card.error();
				$("#editCardContainer").show();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   cm_delete_payment_card
' Return type          :   None
' Input Parameter(s)   :   request, index, cardExpandBoxId , manageCardsCallForChkOut, goBack
' Purpose              :   Creating a class to handle the CM_DELETE_PAYMENT_CARD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function cm_delete_payment_card(request, index, cardExpandBoxId , manageCardsCallForChkOut, goBack) {
	this.request = request;
	this.index = index;
	this.cardExpandBoxId = cardExpandBoxId;
	this.manageCardCall = manageCardsCallForChkOut;
	this.goBack = goBack;
}
var cm_delete_payment_card_obj;
/* Creating a method for the above class */
cm_delete_payment_card.prototype.call = function() {
	var startTime = new Date().getTime();
	var localObj = this;

	makeAuthAjaxCall({
		url : uri + 'private/paymentCard/delete',
		requestObj : this.request,
		apiName : "CM_DELETE_PAYMENT_CARD",
		onSuccess : function(data, status, req) {
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_delete_payment_card_obj = new parse_cm_delete_payment_card(responseJsonObject);

				handleCMDeletePaymentCardOnSuccess(localObj.cardExpandBoxId, localObj.index, localObj.manageCardCall, localObj.goBack);
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"CM_DELETE_PAYMENT_CARD",req,e);
			}
		},
		// Error response handler
		onError : function(req, status, error) {
			if(localObj.goBack != callFrom_constant.FROM_GO_BACK){
				hideProgressBar(); /* To hide the progress bar */
			}
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				cm_delete_payment_card_obj = new parse_cm_delete_payment_card(responseJsonObject);

				var error_cm_delete_payment_card = new handle_cm_delete_payment_card(req, startTime, "CM_DELETE_PAYMENT_CARD"
						, localObj.index, localObj.cardExpandBoxId, localObj.goBack);
				error_cm_delete_payment_card.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				} else {
					hideProgressBar();
				}
			}
		}
	});
};

/********************************************************************************************
' Name                 :   location_load
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Creating a class to handle the LOCATION_LOAD API call with following members
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function location_load(request) {
	this.request = request;
}
var location_load_obj;
/* Creating a method for the above class */
location_load.prototype.call = function() {
	var startTime = new Date().getTime();
	makePublicAjaxCall({
		url: uri + "public/locations/searchLoad",
		requestObj: this.request,
		apiName: "LOCATIONS_LOAD",
		onSuccess: function (data, status, req) {
			try {
				initialize();
				var responseJsonObject = JSON.parse(req.responseText);
				location_load_obj = new parse_location_load(responseJsonObject);
				
				handleLocationLoadOnSuccess();
				hideProgressBar(); /* To hide the progress bar */
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				handleApplicationError(startTime,"LOCATIONS_LOAD",req,e);
			}
		},
		onError: function (req, status, error) {
			hideProgressBar(); /* To hide the progress bar */
			try {
				var responseJsonObject = JSON.parse(req.responseText);
				$("#searchTextField").attr("disabled", false);
				location_load_obj = new parse_location_load(responseJsonObject);

				var error_location_load = new handle_location_load(req, startTime, "LOCATIONS_LOAD");
				error_location_load.error();
			} catch (e) {
				console.log('Error ' + e + "\n" + e.stack);
				if(req.status != 502) {
					showGeneralErrorMsg(req.responseText);
				}

			}
		}
	});
};
