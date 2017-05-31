/********************************************************************************************
 ' Name                 :   validateAddBillGuestCreateProfile
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This function used for validating the UI fields of create profile.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   18th june,2013       -   Karuna Mishra
 '*******************************************************************************************/
function validateAddBillGuestCreateProfile() {
    $('#emailId').blur(function () {
    	this.value = this.value.toLowerCase();
    	validateEmailInfo('emailId', 'errorMainArea1', 'invalidMsg1', messages['createAccount.invalidEmailMsg'], 'frmGuestCreateAcc',
                          'btnContinue','add_edit_biller_area', 'btnContinueBtm');
    });

    $('#confrmEmailId').blur(function () {
    	this.value = this.value.toLowerCase();
        validateReenterEmail('emailId', 'confrmEmailId', 'errorMainArea2', 'invalidMsg2', messages['createAccount.invalidreEnterEmailMsg'],
                             'frmGuestCreateAcc', 'btnContinue','add_edit_biller_area', 'btnContinueBtm');
    });

    $('#password').blur(function () {
        passwordMatchUserName('emailId', 'password', 'errorMainArea3', 'invalidMsg3', messages['createAccount.invalidpasswordMsgSame'],
                              'frmGuestCreateAcc', 'btnContinue','add_edit_biller_area', 'btnContinueBtm');
    });

    $('#mobileNo').blur(function () {
        validatePhoneInfo('mobileNo', 'errorMainArea4', 'invalidMsg4', messages['createAccount.invalidphoneMsg'], 'frmGuestCreateAcc',
                          'btnContinue','add_edit_biller_area', 'btnContinueBtm');
    });

    $('#zipCode').blur(function () {
        validateZipcodeInfo('zipCode', 'errorMainArea5', 'invalidMsg5', messages['createAccount.invalidzipCodeMsg'], 'frmGuestCreateAcc',
                            'btnContinue','add_edit_biller_area', 'btnContinueBtm');
    });

    customKeypressValidator('mobileNo');
}

/********************************************************************************************
 ' Name                 :   upgradeGuestUserToRegistered
 ' Return type          :   None
 ' Input Parameter(s)   :   fromCheckOutPage, parentDivId
 ' Purpose              :   Function is used for calling UPGRADE_GUEST_USER Api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th May,2013       -   Karuna Mishra
 '*******************************************************************************************/
function upgradeGuestUserToRegistered(fromCheckOutPage, parentDivId) {
    /* To show the progress bar */
    showProgressBar();
    /* hold request parameters and values for request parameters */
    var request = {};
    request.applicationId = applicationId;
    request.userId = getCookie('userId');
    request.locale = getCookie("locale");
    request.timeZone = calculate_time_zone();
    
    var $checkboxFields = $('#' + parentDivId + ' input[type=checkbox]');
    $checkboxFields.each(function() {
		if($(this).is(":checked")) {
			request.marketingOptIn  = "true";
		} else {
			request.marketingOptIn  = "false";
		}
	});
    
    var $inputFields = $('#' + parentDivId + ' :input');
    var count = 0;
    $inputFields.each(function () {
        if (fromCheckOutPage === 6) {
            switch (count) {
                case 0:
                    request.username = $(this).val();
                    request.email = $(this).val();
                    break;
                case 2:
                    request.mobilePhone = $(this).val();
                    break;
                case 4:
                    request.zip = $(this).val();
                    break;
                case 5:
                    request.newSecurityQuestion = $(this).val();
                    break;
                case 6:
                    request.newSecurityAnswer = $(this).val();
                    break;
                case 7:
                    request.password = $(this).val();
                    break;
            }
        } else if(fromCheckOutPage === 14){
            switch (count) {
                case 1:
                    request.username = $(this).val();
                    request.email = $(this).val();
                    break;
                case 3:
                    request.password = $(this).val();
                    break;
                case 4:
                    request.mobilePhone = $(this).val();
                    break;
                case 6:
                	request.zip = $(this).val();
                    break;
            }
        } else {
        	switch (count) {
	        	case 0:
	        		request.username = $(this).val();
	                request.email = $(this).val();
	                break;
	        	case 2:
	        		request.password = $(this).val();
	                break;
	        	case 3:
	        		request.mobilePhone = $(this).val();
	                break;
	        	case 5:
	        		request.zip = $(this).val();
	                break;
        	}
        }
        count++;
	});
    // do when user come from sign up page
    var tempSequrityQuestion = null, tempSecurityAnswer = null;
    if (fromCheckOutPage === 6) {
        // store security Question and Answer as api not using it NOW. for next api call.
        tempSequrityQuestion = request.newSecurityQuestion;
        tempSecurityAnswer = request.newSecurityAnswer;
        // remove security Question and Answer as api not using it NOW
        delete request.newSecurityQuestion;
        delete request.newSecurityAnswer;
    }
    var call_upgrade_guest_user = new upgrade_guest_user(request, fromCheckOutPage, tempSequrityQuestion, tempSecurityAnswer);
	call_upgrade_guest_user.call();
}

/********************************************************************************************
' Name                 :   handleUpgradeGuestUserOnSuccess
' Return type          :   None
' Input Parameter(s)   :   request, fromCheckOutPage, tempSequrityQuestion, tempSecurityAnswer
' Purpose              :   Function is used for handling success response of UPGRADE_GUEST_USER API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function handleUpgradeGuestUserOnSuccess(request, fromCheckOutPage, tempSequrityQuestion, tempSecurityAnswer) {
    setCookie("userId", upgrade_guest_user_obj.user_id);
    setCookie('userName', upgrade_guest_user_obj.username);
    localStorage.setItem("registerUser", true);
    $('#signUpGuestId').hide();
    $('#accountInfoId').show();
    /* To check the guest user and show the message to either login or create your account. */
    if(!bp_hist_obj && !bp_scheduled_payment_hist_obj){
    	if (parseBoolean(localStorage.getItem("registerUser"))) {
    		$('#no_payment_hist').text(formatMessage(
    				messages['billStatusHistory.noBillsMessage'], localStorage.getItem("maxTranHistoryDaysBack")));
    		$('#no_payment_hist').show();
    	}    	
    }
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
    	$("#activityIcon").removeClass('mob_tab_inv');
 	    $('#activityIcon').show();
 	}
    $("#footerEditProfile").show();
    $("#footerProfileTab").show();
    footerForGuestAndRegister();
    /* Checking if we are coming from Create Account page then fromCheckOutPage should be 6 */
    if(fromCheckOutPage === 14){
 	   fillPromoToRegPromoArea();
 	   registerEventsForPromoCode();
 	   if(submitBtnCreateProfCountdown) {
 		   clearIntervalApp(submitBtnCreateProfCountdown);
 	   }
 	   if(submitBtnAddInfoCountdown) {
 		   clearIntervalApp(submitBtnAddInfoCountdown);
 	   }
 	   	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
		if($("#" + visiblePromoCodeInputId).val()){
		 	  handleBpVerifyPromoCode(true);
		}
    } else if (fromCheckOutPage === 1){
 	   fillPromoToRegPromoArea();
 	   registerEventsForPromoCode();
 	   clearFormField("createAccountBoxChkOut");
 	   if(checkToEnablePayFromGuestToRegister()) {
 		   activateCheckoutPayButton();
 	   }
    } else if (fromCheckOutPage === 6) {
        delete request.username;
        delete request.password;

        // add user security Question and Answers
        request.newSecurityQuestion = tempSequrityQuestion;
        request.newSecurityAnswer = tempSecurityAnswer;
        request.userId = eval(getCookie("userId"));
        // send default First and Last Name
        request.firstName = messages["createAccount.firstNameInput"];
        request.lastName = messages["createAccount.lastNameInput"];
        request.contactPreference = "BOTH";
        request.currentPassword = "";
        request.newPassword = "";
        request.currentPassword = "";
        request.address1 = "";
        request.address2 = "";
        request.city = "";
        request.state = "";
        request.mobileCarrierId = 5;
        /* Call update profile in synchronous call and wait for success response */
        updateUserProfileWithSecurityQuestion(request);
        return;
    }
    $('#myAccountBox').show();
    $("#accBoxMainDivId").removeClass("myAccountSection");
    $('#guestUserMyAccountBox').hide();
    hideCreateProfileSectionOnRegister();
    $('#userName').text(getCookie("userName"));
    createSaveCardCheckBox();
    switch (fromCheckOutPage) {
        case 1:
            break;
        case 2:
            isGuestMsg = true;
            handleSaveCreds();
            break;
        case 6:
            location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId;
            break;
        case 14:
            break;
        default:
        	navigateToHome();
        showGeneralSuccessMsg(messages['createAccountGuest.accountCreatedSuccessfully']);
            break;
    }
}


/********************************************************************************************
' Name                 :   createSaveCardCheckBox
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for create checkbox in add card form.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function createSaveCardCheckBox() {
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	var addCardForm = "";
	var fundingSourceTypes_JsonType='';
	/* This code segment is used to draw the row for card on the basis of funding source. */
	for(var fundingSourceTypesIndex in fundingSourceTypes) {
		var fundingSourceTypeObj = fundingSourceTypes[fundingSourceTypesIndex];
		var fundingSourceTypes_TenderType = fundingSourceTypeObj.tenderType; /* Getting tenderType for fundingSource as came in INIT_APP API */
		if(fundingSourceTypes_TenderType 
				&& fundingSourceTypes_TenderType.toUpperCase() !== tenderTypeConstant.CASH
				&& fundingSourceTypes_TenderType.toUpperCase() !== tenderTypeConstant.PROMO){
			if(getVisibleAddCardFormFundingSource()){
				fundingSourceTypes_JsonType = getVisibleAddCardFormFundingSource();
			}else{
				fundingSourceTypes_JsonType = fundingSourceTypeObj.tenderType; /* Getting jsonType for fundingSource as came in INIT_APP API */
			}
			addCardForm = "<div class='card_field_sep sv_card_later width_area40'>"
				+ 		"<input type='checkbox' name='checkbox' id='saveCardCheckBox" + fundingSourceTypes_JsonType + "' class='txt_inv' checked/>"
				+ 		"<span id='valCardCheckBox" + fundingSourceTypes_JsonType + "' class='card_icon fa fa-check fa-2x checked_mark_icon checked_def_img' onclick='changeOneTimeFlagClass(\"" + fundingSourceTypes_JsonType + "\")'></span>"
				+ 			messages['addPaymentCardForm.saveCardTxt'] 
			+ "</div>";
			$(addCardForm).insertAfter( ".card_field_sep:last" ); 
			return;
		}
	}
}

/********************************************************************************************
' Name                 :   updateUserProfileWithSecurityQuestion
' Return type          :   None
' Input Parameter(s)   :   request
' Purpose              :   Function is used for handling success response of UPGRADE_GUEST_USER API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function updateUserProfileWithSecurityQuestion(request) {
    makeAuthAjaxCall({
	     url: uri + "private/user/updateProfile",
	     requestObj: request,
	     apiName: "USER_UPD_PROFILE",
	     onSuccess: function (data, status, req) {
	         try {
	             location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId;
	         } catch (e) {
	        	 console.log('Error ' + e + "\n" + e.stack);
	        	 handleApplicationError(startTime,apiName,"USER_UPD_PROFILE",req,e);
	         } finally {
	             /* To hide the progress bar */
	             hideProgressBar();
	         }
	     },
	     onError: function (req, status, e) {
	    	 console.log('Error ' + e + "\n" + e.stack);
	         /* To hide the progress bar */
	         hideProgressBar();
	         var responseJsonObj = JSON.parse(req.responseText);
	         showGeneralErrorMsg(responseJsonObj.errorMessage);
	     }
	 });
}

/********************************************************************************************
' Name                 :   updateUserProfileCheckout
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for calling UPGRADE_USER_PROFILE API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function updateUserProfileCheckout() {
    showProgressBar(); /* To show the progress bar */
    var request = {}; /* Hold request parameters and values for request parameters */
    request.userId = eval(getCookie("userId"));
    request.mobilePhone = $("#mobileNoAddInfoChkOut").val().trim();
    request.firstName = $('#chkFirstName').val().trim();
    request.lastName = $('#chkLastName').val().trim();
    request.email = $("#emailIdAddInfoChkOut").val().trim();
    request.contactPreference = "BOTH";
    request.currentPassword = "";
    request.newPassword = "";
    request.newSecurityQuestion = "";
    request.newSecurityAnswer = "";
    request.timeZone = calculate_time_zone();
    request.address1 = "";
    request.address2 = "";
    request.city = "";
    request.state = "";
    request.zip = $("#zipCodeAddInfoChkOut").val();
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.mobileCarrierId = "";
    if($('#chkOptInEnhAddInfo').is(":checked")) {
      	 request.marketingOptIn  = "true";
    }else{
      	request.marketingOptIn  = "false";
    }
	var call_user_upd_profile = new user_upd_profile(request, callFrom_constant.GUEST_USER_ON_CHECKOUT_CALL);
	call_user_upd_profile.call();
}

/********************************************************************************************
' Name                 :   handleUserUpdProfileOnSuccess
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for handling success response of UPGRADE_USER_PROFILE API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function handleUserUpdProfileOnSuccess(){
	if(user_upd_profile_obj.user) {
		userInfoObject = new Object();
		userInfoObject = user_upd_profile_obj.user;
		if (user_upd_profile_obj.userAddress && user_upd_profile_obj.userAddress.zip) {
			userInfoObject.zip = user_upd_profile_obj.userAddress.zip;
		} else {
			userInfoObject.zip = null;
		}
		setCookie('userName', user_upd_profile_obj.user.username);
		callAddCardOrSubmitCard();
	}
}

/********************************************************************************************
' Name                 :   fillPromoToRegPromoArea
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for fill the Promo code Registration form in 
							case of Guest User.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function fillPromoToRegPromoArea(){
	var visiblePromoCodeInputId = getVisiblePromoCodeBoxId();
	if($("#" + visiblePromoCodeInputId).val()){
		$("#promoCodeDiscount3").val($("#" + visiblePromoCodeInputId).val());
	}
	$("#promoCodeSection").show();
	$("#discountAndPromoCodeReg").hide();
	$("#promoCodeBox").hide();
}

/********************************************************************************************
' Name                 :   hideCreateProfileSectionOnRegister
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for hide Create Profile section once user converts 
							from Guest to Registered.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   28th May,2013      -   Karuna Mishra
'*******************************************************************************************/
function hideCreateProfileSectionOnRegister() {
    $("#createAccountBoxChkOut").hide();
    clearIntervalApp(chkRegisterBtnCount);
    $("#createAccountBoxBill").hide();
    $("#createAccountBoxSummary").hide();
    clearIntervalApp(submitBtnCreateProfCountdown);
    $("#createAccountBoxDetail").hide();
    clearIntervalApp(submitBtnCreateProfDetailCountdown);
    $("#additional_info_box").hide();
    $("#createAccountBox").hide();
    $("#paymentReceiptCreateAccBox").hide();

    $("#createAccountBoxErrDivBill").hide();
    $("#createAccountBoxErrDivDetail").hide();
    $("#createAccountBoxErrDivSummary").hide();
    $("#createAccountBoxErrDiv").hide();
    $("#paymentReceiptCreateAccBoxErrDiv").hide();
}


/********************************************************************************************
' Name                 :   promoCodeApplyBtnDisable
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Not to call API until there is any promo code apply.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   11th Mar,2014      -   Ravi Raj
'*******************************************************************************************/
function promoCodeApplyBtnDisable(){
	var promoCodeValue = $("#promoCodeDiscount3").val().trim();
	if(promoCodeValue && promoCodeValue.length > 0){
		handleBpVerifyPromoCode(true);
	}
}

/********************************************************************************************
' Name                 :   checkToEnablePayFromGuestToRegister
' Return type          :   Boolean
' Input Parameter(s)   :   None
' Purpose              :   Enable the pay button form the guest user page.
' History Header       :   Version   -   Date               -   Developer Name
' Added By             :   1.0       -   11th Mar,2014      -   Ravi Raj
'*******************************************************************************************/
function checkToEnablePayFromGuestToRegister() {
	if($('#cashButtonImageArea').hasClass('vesta_delivered_icon')) {
		/* Getting total added amount in CASH section */
		var totalAddedAmount = getFormatedNumber($('#cashSummaryTotalAmount').text(), false);
		/* Reading Amount Due again because in case of Promo removed it will add up by promo amount again */
		var amountDue = getFormatedNumber($('#amountDueTotal').text(), false);
		if(totalAddedAmount >= amountDue) {
			return true;
		}
	} else if ($('#cardButtonImageAreaDEBIT').hasClass('vesta_delivered_icon') ||
			$('#cardButtonImageAreaCREDIT').hasClass('vesta_delivered_icon')) {
		if($('#listOfPaymentCardDEBIT').is('visible') || $('#listOfPaymentCardCREDIT').is('visible')) {
			return true;
		}
	}
	return false;
}
