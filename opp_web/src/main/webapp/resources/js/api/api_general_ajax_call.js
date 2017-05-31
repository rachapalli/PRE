/**
 * This file is used to contain the web service method for public and private api calls
 * used by various methods within the application.
 */
/* This array contains programId, requestedPostingDate, fee coming from either 
 * getPendingTransaction or calcSubmitDate API */
var billsDup = new Array();
var tempBillArray = new Array();

/********************************************************************************************
 ' Name                 :   makeAuthAjaxCall
 ' Return type          :   none
 ' Input Parameter(s)   :   authCall
 ' Purpose              :   Common ajax module that all authenticated/private API calls.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   2 August 2013       -   Jason Vincent
 '*******************************************************************************************/
function makeAuthAjaxCall(authCall) {
    var url = authCall.url;
    var requestObj = authCall.requestObj;
    var apiName = authCall.apiName;
    var onSuccess = authCall.onSuccess;
    var onError = authCall.onError;
    var timeout;
    if (!url) {
        console.log('url was null to makeAuthAjaxCall');
        return;
    }
    if (!requestObj) {
        console.log('requestObj was null to makeAuthAjaxCall');
        return;
    }
    if (!apiName) {
        console.log('apiName was null to makeAuthAjaxCall');
        return;
    } else {
        timeout = eval(apiTimeOutVal[apiName]);
        if (!timeout) {
            console.log('makeAuthAjaxCall: no timeout found for apiName='
                                + apiName);
            timeout = 30000;
        }
    }
    if (!onSuccess) {
        console.log('onSuccess function was null to makeAuthAjaxCall');
        return;
    }
    if (!onError) {
        console.log('onError function was null to makeAuthAjaxCall');
        return;
    }

    if (checkSessionTimeOutAndCookie()) {
        return;
    }
    console.log(apiName + " session token: " + getCookie("sessionToken"));

    $.ajax({
               url: url,
               type: 'POST',
               contentType: 'application/json; charset=utf-8',
               data: JSON.stringify(requestObj),
               dataType: 'json',
               timeout: timeout,
               cache: false,
               success: function (data, status, req) {
                   storeSessionTokenAndLastTime(req, apiName, status);
                   try {
                       onSuccess(data, status, req);
                   } catch (e) {
                       console.log('Error apiName = ' + apiName + ", " + e);
                       throw e;
                   }
               },
               error: function (req, status, error) {
                   if (req.status == ERROR_CODE_401 || req.status == ERROR_CODE_403) {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   } else {
                       storeSessionTokenAndLastTime(req, apiName, status);
                       onError(req, status, error);
                   }
               },
               /* Set user basic authentication data into request header */
               beforeSend: setHeader,
               statusCode: {
                   401: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   },
                   403: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   }
               }
           });
}

/*******************************************************************************
 ' Name                 :     makePublicAjaxCall
 ' Return type          :     none
 ' Input Parameter(s)   :     authCall
 ' Purpose              :     Common ajax module that all public API calls.
 ' History Header       :     Version     -     Date             -     Developer Name
 ' Added By             :     1.0         -     2 August 2013     -    Jason Vincent
 ******************************************************************************/
function makePublicAjaxCall(publicCall) {
    var url = publicCall.url;
    var requestObj = publicCall.requestObj;
    var apiName = publicCall.apiName;
    var onSuccess = publicCall.onSuccess;
    var onError = publicCall.onError;
    var timeout;
    if (!url) {
        console.log('url was null to makePublicAjaxCall');
        return;
    }
    if (!requestObj) {
        console.log('requestObj was null to makePublicAjaxCall');
        return;
    }
    if (!apiName) {
        console.log('apiName was null to makePublicAjaxCall');
        return;
    } else {
        timeout = eval(apiTimeOutVal[apiName]);
        if (!timeout) {
            console.log('makePublicAjaxCall: no timeout found for apiName='
                                + apiName);
            timeout = 30000;
        }
    }
    if (!onSuccess) {
        console.log('onSuccess function was null to makePublicAjaxCall');
        return;
    }
    if (!onError) {
        console.log('onError function was null to makePublicAjaxCall');
        return;
    }

    $.ajax({
               url: url,
               type: 'POST',
               contentType: 'application/json; charset=utf-8',
               data: JSON.stringify(requestObj),
               dataType: 'json',
               timeout: timeout,
               cache: false,
               success: function (data, status, req) {
                   storeSessionTokenAndLastTime(req, apiName, status);
                   try {
                       onSuccess(data, status, req);
                   } catch (e) {
                       console.log('Error apiName = ' + apiName + ", " + e);
                       throw e;
                   }
               },
               error: function (req, status, error) {
                   storeSessionTokenAndLastTime(req, apiName, status);
                   onError(req, status, error);
               },
               statusCode: {
                   401: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   },
                   403: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   }
               }
           });
}

/*********************************************************************************************************
 ' Name                 :    	 storeSessionTokenAndLastTime
 ' Return type          :   	 None
 ' Input Parameter(s)   :        req, apiName, status
 ' Purpose              :        To store and update the session token, last time and apiLoginSessionTimeOut
 ' History Header       :        Version   -   Date          -   Developer Name
 ' Added By             :        1.0       -   06 Sep 2013   -   Karuna Mishra
 '**********************************************************************************************************/
function storeSessionTokenAndLastTime(req, apiName, status) {
    var startTime = new Date().getTime();
    var sessionToken = "";
    try {
        var responseJsonObj = JSON.parse(req.responseText);
        sessionToken = responseJsonObj.sessionToken;

        if (sessionToken && sessionToken.length > 10) {
            var time = new Date().getTime();
            var configuredApiTimeoutMs = localStorage.getItem("loginSessionTimeoutMs");
            if (null == configuredApiTimeoutMs || configuredApiTimeoutMs.length < 5) {
                configuredApiTimeoutMs = 1800000; //30 min default.
            }
            var apiLoginSessionTimeOutTime = time + (configuredApiTimeoutMs * 1);
            setSessionCookie("sessionToken", sessionToken, configuredApiTimeoutMs - 20000);
            setCookie("apiLoginSessionTimeOutTime", apiLoginSessionTimeOutTime);
        }
    } catch (e) {
        hideProgressBar();
        console.log('Error in storing session token = ' + apiName + ", " + e);
        handleApplicationError(startTime, apiName, req, e, status);
    }
}

/*********************************************************************************************************
 ' Name                 :       storeCookieInSession
 ' Return type          :       None
 ' Input Parameter(s)   :       cookieMap
 ' Purpose              :       To parse the values from map and call method to store into session cookies.
 ' History Header       :       Version   -   Date          -   Developer Name
 ' Added By             :       1.0       -   03 May 2014   -   Ravi Raj
 '**********************************************************************************************************/
function storeCookieInSession(cookieMap) {
    for (var key in cookieMap) {
        var value = cookieMap[key];
        setCookie(key, value);
    }
}

/*********************************************************************************************************
 ' Name                 :       storeInLocalStorage
 ' Return type          :       None
 ' Input Parameter(s)   :       cookieMap
 ' Purpose              :       To parse the values from map and call method to store into session cookies.
 ' History Header       :       Version   -   Date          -   Developer Name
 ' Added By             :       1.0       -   14 May 2014   -   Jason Vincent
 '**********************************************************************************************************/
function storeInLocalStorage(dataMap) {
    for (var key in dataMap) {
        var value = dataMap[key];
        localStorage.setItem(key, value);
    }
}

/*********************************************************************************************************
 ' Name                 :       setCookie
 ' Return type          :       None
 ' Input Parameter(s)   :       c_name, value, exdays
 ' Purpose              :       To set the values into session cookies.
 ' History Header       :       Version   -   Date          -   Developer Name
 ' Added By             :       1.0       -   06 Sep 2013   -   Karuna Mishra
 '**********************************************************************************************************/
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = encodeURI(value)
            + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

/*********************************************************************************************************
 ' Name                 :       createMapForInitAppFeatures
 ' Return type          :       initAppMap
 ' Input Parameter(s)   :       init_app_obj
 ' Purpose              :       To create a map for INIT_APP configurations those will be stored in to cookies.
 ' History Header       :       Version   -   Date          -   Developer Name
 ' Added By             :       1.0       -   03 May 2014   -   Ravi Raj
 '**********************************************************************************************************/
function createMapForInitAppFeatures(init_app_obj) {
    /* Creating a single map/array for footer URLs */
    var footerURl = new Object();
    footerURl["FooterPricingUrl"] = init_app_obj.pricingUrl;
    footerURl["FooterTermsUrl"] = init_app_obj.currentTermsUrl;
    footerURl["FooterContactUrl"] = init_app_obj.contactInfoUrl;
    footerURl["FooterFeedBackUrl"] = init_app_obj.feedbackUrl;
    footerURl["FooterPrivacyUrl"] = init_app_obj.privacyUrl;
    footerURl["FooterHelpUrl"] = init_app_obj.helpUrl;

    var initAppMap = new Object();
    initAppMap["userMoreInformation"] = init_app_obj.moreInfoUrl;
    initAppMap["billRemitZipUrl"] = init_app_obj.billRemitZipUrl;
    initAppMap["loginSessionTimeoutMs"] = init_app_obj.loginSessionTimeoutMs;
    initAppMap["init_app_currentterms_id"] = init_app_obj.init_app_currentterms_id;
    initAppMap["BillerPostingCategoryHelpUrl"] = init_app_obj.billPostingTimeUrl;
    initAppMap["billPayFeePerBill"] = init_app_obj.billPayFeePerBill;
    initAppMap["daysBack"] = init_app_obj.maxBillPayHistoryDayRange;
    initAppMap["count"] = init_app_obj.maxBillPayHistoryRecords;
    initAppMap["securityQuestionArr"] = init_app_obj.securityQuestionArr;
    initAppMap["cartStatusPingFrequencyMs"] = init_app_obj.cartStatusPingFrequencyMs;
    initAppMap["chkoutEnabled"] = init_app_obj.featureName["CHECKOUT"];
    initAppMap["locatorEnabled"] = init_app_obj.featureName["LOCATOR"];
    initAppMap["registerUser"] = false;
    initAppMap["vestaTokenizationURL"] = init_app_obj.vestaTokenizationURL;
    initAppMap["vestaTokenizationUsername"] = init_app_obj.vestaTokenizationUsername;
    initAppMap["maxBillPayHistoryDaysBack"] = init_app_obj.maxBillPayHistoryDaysBack;
    initAppMap["maxTranHistoryDaysBack"] = init_app_obj.maxTranHistoryDaysBack;
    initAppMap["fuzzySearchVariant"] = init_app_obj.fuzzySearchVariant;
    initAppMap["maxUserRegisteredCards"] = init_app_obj.maxUserRegisteredCards;

    if (footerURl) {
        initAppMap["footerURls"] = JSON.stringify(footerURl);
    }
    if (init_app_obj.apiTimeOuts) {
        initAppMap["apiTimeOuts"] = JSON.stringify(init_app_obj.apiTimeOuts);
    }
    if (init_app_obj.featureName) {
        initAppMap["featureNames"] = JSON.stringify(init_app_obj.featureName);
    }
    if (init_app_obj.fundingSourceTypes) {
        var newFundingSourceTypes = [];
        for (var i in init_app_obj.fundingSourceTypes) {
            var fundingSource = init_app_obj.fundingSourceTypes[i];
                newFundingSourceTypes.push(fundingSource);
        }
        initAppMap["fundingSourceTypes"] = JSON.stringify(newFundingSourceTypes);
    }
    if (init_app_obj.mediaName) {
        initAppMap["mediaNames"] = JSON.stringify(init_app_obj.mediaName);
    }

    return initAppMap;
}

/*********************************************************************************************************
 ' Name                 :     createMapForUserAuth
 ' Return type          :    initAppMap
 ' Input Parameter(s)   :       user_auth_obj
 ' Purpose              :       To create a map for USER_AUTH configurations those will be stored in to cookies.
 ' History Header       :       Version   -   Date          -   Developer Name
 ' Added By             :       1.0       -   03 May 2014   -   Ravi Raj
 '**********************************************************************************************************/
function createMapForUserAuth() {
    var userAuthMap = new Object();
    userAuthMap["userId"] = user_auth_obj.userId;
    userAuthMap["userName"] = user_auth_obj.userName;
    userAuthMap["termId"] = user_auth_obj.termId;
    if (user_auth_obj.mobileWallet) {
        userAuthMap["walletId"] = user_auth_obj.mobileWalletId;
        userAuthMap["userAccountNumber"] = user_auth_obj.mobileWalletAccountNum;
    } else {
        userAuthMap["walletId"] = "";
        userAuthMap["userAccountNumber"] = "";
    }

    return userAuthMap;
}

/********************************************************************************************
 ' Name                 :   checkForInitAppCall
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Function is used for storing data into cookie retrieved from INIT_APP Api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   26th August,2013     -   Karuna Mishra
 '*******************************************************************************************/
function checkForInitAppCall() {
    if (localStorage.getItem("loginSessionTimeoutMs") && localStorage.getItem("init_app_currentterms_id") &&
            localStorage.getItem("count")) {
        return true;
    }
    return false;
}

/********************************************************************************************
' Name                 :   setTempBillArray
' Return type          :   None
' Input Parameter(s)   :   
' Purpose              :   Function is used for storing data into temp array when 
							BP_ACCOUNT_LITE is called again in same user session. So that 
							we can refill the data after API call.
' History Header       :   Version   -   Date              		-   Developer Name
' Added By             :   1.0       -   06th June, 2014     	-   Raviraj
'*******************************************************************************************/
function setTempBillArray() {
	/* Checking for billerCorpAcctIdArray if exists then create tempBillArray */
	if(billerCorpAcctIdArray && billerCorpAcctIdArray.length > 0) {
		tempBillArray = new Array();
		for(var index in billerCorpAcctIdArray) {
			/* Getting the billerCorpAccountId from billerCorpAcctIdArray */
			var billerCorpAccountId = billerCorpAcctIdArray[index];
			/* Getting the amount from each biller amount box */
			var amount = $('#' + billerCorpAccountId).val();
			/* if its not a input box then reading the value from span for fixed billers */
			if(!amount) {
				amount = $('#' + billerCorpAccountId).text();
			}
			var programId = null;
			var requestedPostingDate = null;
			var fee = null;
			var calcSubmitDate = null;
			/* Checking if billsDup array exists means BP_CALC_SUBMIT is called atleast once */
			if(billsDup && billsDup[billerCorpAccountId]) {
				if(billsDup[billerCorpAccountId].programId) { /* Checking for programId */
					programId = billsDup[billerCorpAccountId].programId; 
				}
				if(billsDup[billerCorpAccountId].requestedPostingDate) { /* Checking for requestedPostingDate */
					requestedPostingDate = billsDup[billerCorpAccountId].requestedPostingDate; 
				}
				if(billsDup[billerCorpAccountId].calcSubmitDate) { /* Checking for calcSubmitDate */
					calcSubmitDate = billsDup[billerCorpAccountId].calcSubmitDate; 
				}
				if(billsDup[billerCorpAccountId].fee) { /* Checking for fee */
					fee = billsDup[billerCorpAccountId].fee; 
				}
			}
			/* Checking if any of the condition exists then create object in tempBillArray */
			if(amount || programId || requestedPostingDate || fee) {
				tempBillArray[billerCorpAccountId] = new Object();
				tempBillArray[billerCorpAccountId].amount = amount ? amount * 1 : 0;
				tempBillArray[billerCorpAccountId].programId = programId ? programId : '';
				tempBillArray[billerCorpAccountId].requestedPostingDate = requestedPostingDate ? requestedPostingDate * 1 : 0;
				tempBillArray[billerCorpAccountId].calcSubmitDate = calcSubmitDate ? calcSubmitDate * 1 : 0;
				tempBillArray[billerCorpAccountId].fee = fee ? fee * 1 : 0; 
			}
		}
	}
}

/********************************************************************************************
' Name                 :   setDataFromTempBillArray
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for refill the data from tempBillArray after 
							BP_ACCOUNT_LITE API call in same user session.
' History Header       :   Version   -   Date              		-   Developer Name
' Added By             :   1.0       -   06th June, 2014     	-   Raviraj
'*******************************************************************************************/
function setDataFromTempBillArray() {
	/* Iterating through th tempBillArray to set data into biller boxes */
	for(var index in tempBillArray) {
		/* Creating a pendingTransaction object and setting data into it */
		var pendingTransaction = new Object;
		pendingTransaction.billerCorpAccountId = index;
		pendingTransaction.amount = tempBillArray[index].amount;
		pendingTransaction.requestedPostDate = tempBillArray[index].requestedPostingDate;
		pendingTransaction.scheduledSubmitDate = tempBillArray[index].calcSubmitDate;
		pendingTransaction.fee = tempBillArray[index].fee;
		/* Calling method to set the data into biller boxes */
		setBillPaymentBoxes(pendingTransaction);
	}
	/* Resetting the tempBillArray once it has been called from success response of BP_ACCOUNT_LITE response */
	tempBillArray = null;
}

/********************************************************************************************
' Name                 :   clearAllApiObjects
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to clear API  object on refresh.
' History Header       :   Version   -   Date              		-   Developer Name
' Added By             :   1.0       -   06th May, 2014     	-   Raviraj
'*******************************************************************************************/
function clearAllApiObjects() {
	bp_get_pending_transaction_obj = null;
	bp_account_lite_obj = null;
	bp_hist_obj = null;
	bp_scheduled_payment_hist_obj = null;
	user_get_profile_obj = null;
}

/********************************************************************************************
' Name                 :   updateCardUiIfApiFails
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used to update the Card list section UI either 
							BP_SUBMIT_PAYMENT_GROUP or BP_CHECK_CART_STATUS_FAILS APIfails.
' History Header       :   Version   -   Date              		-   Developer Name
' Added By             :   1.0       -   12 June, 2014     		-   Karuna Mishra
'*******************************************************************************************/
function updateCardUiIfApiFails() {
	if($('#addPaymentCardForm').is(':visible')) {
		var visibleJsonType = '';
		for(var arrayIndex in cardOptionJsonTypes) {
			if ($("#panel" + cardOptionJsonTypes[arrayIndex]).is(":visible")) {
				visibleJsonType = cardOptionJsonTypes[arrayIndex];
				break;
			}
		}
		handleGetPaymentCards(visibleJsonType, null);
	}
}

/********************************************************************************************
' Name                 :   calcHeightAndUpdateBills
' Return type          :   void
' Input Parameter(s)   :   none
' Purpose              :   This method is used to calculate height of my acount section and update 
						   bills using that calculatd height.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   5th, May 2014     -   Uma Maheswara Rao	
'*******************************************************************************************/
function calcHeightAndUpdateBills() {
	$('.bill_status_box').show();
	var pageHeight = $(window).outerHeight(true)-52;
	var myAccountAbvHeight = $('.my_account_area_abv').outerHeight(true);
	var creditHeight = 0;
	var credit_val = getFormatedNumber($("#creditAvbl .avl_credit_price").text(), false);
	if(credit_val > 0){
		creditHeight = $('.brdr_credit').outerHeight(true);
	}
	else{
		creditHeight = 0;
	}
	$('.my_account_area_blw').css('max-height',(pageHeight - myAccountAbvHeight - creditHeight)+'px');
	if((bp_scheduled_payment_hist_obj && bp_scheduled_payment_hist_obj.scheduledTransactions 
			&& bp_scheduled_payment_hist_obj.scheduledTransactions.length > 0) || (bp_hist_obj && bp_hist_obj.transactions 
					&& bp_hist_obj.transactions.length > 0)) {
		var outerSchHeight = 0;
		var billStatusHeight = 0;
		var totalVisibleBillBoxes = 0;
		var latestPayAreaHeight = 0;
		var billStatusBoxHeight = 0;
		var heightOfPendingContainer = 1;
		$('.bill_status_box').show();
		$('.payment_pending_container').show();

		billStatusHeight = $('.bill_status_txthd').outerHeight(true);
		outerSchHeight = $('#outer_sch').outerHeight(true);
		latestPayAreaHeight = $('.latest_pay_txt').outerHeight(true);
		showAllHistBtnHeight = $('#showAllHistBtn').outerHeight(true);

		heightOfPendingContainer = $('.payment_pending_container').outerHeight(true);

		var remainigBillStatusHeight = (pageHeight - ( myAccountAbvHeight + creditHeight + billStatusHeight + latestPayAreaHeight + showAllHistBtnHeight ));
		if($('.bill_status_box').is(':visible')){
			billStatusBoxHeight = $('.bill_status_box').outerHeight(true);		
		}
		else{
			billStatusBoxHeight = 1;
		}
		var numberofBillStatus = $('#inner_sch>.bill_status_box').length;
		var billStatusContainerHeight = numberofBillStatus * billStatusBoxHeight;
		if(remainigBillStatusHeight < billStatusContainerHeight){
			totalVisibleBillBoxes = Math.floor(((remainigBillStatusHeight)/billStatusBoxHeight)-1) ;
			if(totalVisibleBillBoxes > -1){
				var showBillContainer = $('#bill_status_box' + (totalVisibleBillBoxes));
				showBillContainer.nextAll().hide();
			} else {
				$('.bill_status_box').hide();
			}
		}
		else{
			totalVisibleBillBoxes = Math.floor(((billStatusContainerHeight)/billStatusBoxHeight)-1) ;
			if(totalVisibleBillBoxes > -1){
				var showBillContainer = $('#bill_status_box' + (totalVisibleBillBoxes));
				showBillContainer.nextAll().hide();
			} else {
				$('.bill_status_box').hide();
			}
		}
		$('#inner_sch').height((totalVisibleBillBoxes)*(billStatusBoxHeight));

		var remainingHeight = (pageHeight - ( myAccountAbvHeight + billStatusHeight + outerSchHeight + latestPayAreaHeight + showAllHistBtnHeight + creditHeight));
		pendingBoxView = Math.floor(((remainingHeight)/heightOfPendingContainer)-1) ;
		if(pendingBoxView > -1){
			var showPendingContainer = $('#paymentBoxWidthId' + pendingBoxView);
			showPendingContainer.nextAll().hide();
		} else {
			$('.payment_pending_container').hide();
		}
	}
}