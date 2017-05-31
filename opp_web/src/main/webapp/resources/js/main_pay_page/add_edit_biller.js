var bpGetCorpAccountMap;
var userBillPayAccountId;
var userNickName;
var isGuestMsg = false;
var isAlertShown = false;
var billerCredElements;
var addBill = "";
var addEditBillerCountdown;

/***************************************************************************************************
 Name                 :   loadAddEditBill
 Return type          :   None
 Input Parameter(s)   :   programId, isAdd, isMsg, billPaymentId, nickName, msgType
 Purpose              :   To load the Add/Edit biller screen.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   16th June, 2013   -   Pradep Yadav
 ******************************************************************************************************/
function loadAddEditBill(billerCorpId, programId, billerCorpAcctId, isAdd, isMsg, msgType) {
    $('#searchtext').blur();
	$('#addBil_deliveryIcon').hide();
	$('#addBil_billerName').empty();
	enableSaveBillerButton();
    LAST_EDIT_BOX_ID = billerCorpId;
    addBill = isAdd;
    /* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
    setTimeout(function(){
        showScreenAndSetHeight('addEditBillerInner', 'add_edit_biller_area');
    }, 500);
    //showScreenAndSetHeight('addEditBillerInner', 'add_edit_biller_area');
    if(localStorage.getItem("registerUser")){
    	$("#createAccountBoxErrDiv").hide();
    }
    /* To clear the previous filled form data. */
    clearFields();

    setExtraMarginForAndroid('addBillerBtmBtn');
    $('#nickNameSec > label:first').attr('id', billerCorpId + '_' + programId + '_' + billerCorpAcctId);
    /* Resetting the bp_get_corp_account_obj to null so that it should not fill the data from its past call (refer Bug #4676). */
    bp_get_corp_account_obj = null;
    bpGetCorpAccountMap = new Object();
    if (addBill) {
        $("#addEditHeaderLbl").text(messages['addBill.addBillLabel']);
        userNickName = null;
        if (parseBoolean(localStorage.getItem("registerUser")) === false) {
            handleGetBillerCreds(billerCorpId, programId, isMsg);
            return;
        }
        $("#btnBack").show();
        getUserBillerProfile(billerCorpId, programId, isMsg);
    } else {
        $("#addEditHeaderLbl").text(messages['editBill.editBillLabel']);
        $("#btnBack").show();
        handleGetBPAccount(billerCorpAcctId, programId, isMsg);
    }
}

/****************************************************************************************
 Name                 :   clearFields
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   To clear all the previous data from fields.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   17th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function clearFields() {
    $('#billerFormData').hide();
    $('#addOrEditSaveBtnDiv').hide();
    $('#addBil_billerType').hide();
    $('#addBil_postingCategoryLanguage').hide();
    $('#addBil_instruction2').hide();
    $('#addBil_rightSection').hide();
    $('#billerUserData').hide();
    $('#postingCategoryLanguage').empty();
    $('#postingCategoryHelp').empty();
    $('#billerData').empty();
    $('#billerUserData').empty();
    $('#billerSecureElements').empty();
    $('#hintDetails').empty();
    removeErrorBorderClass("nickName");
    $('#nickName').val("");
    $('#nickName').focus();
    
    /* Clearing all the incentive images before loading the Add/Edit biller page.*/
    $("#incentiveImgId").attr("src", "");

    /* To clear the create profile form data. */
    clearFormData('frmGuestCreateAcc');

    /* To set the create profile area at initial state. */
    if ($('#chkCreateAcc').is(":checked")) {
        showRegForm();
    }
    /* To hide the error msg divs on page load. */
    hideErrorMsgDiv('frmGuestCreateAcc', 'errorMainArea1');
}

/********************************************************************************************
 Name                 :   getUserBillerProfile
 Return type          :
 Input Parameter(s)   :   billerCorpId, programId, isMsg
 Purpose              :   To get the User profile data from API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th March, 2013  -   Pradeep Yadav
 **********************************************************************************************/
function getUserBillerProfile(billerCorpId, programId, isMsg) {
    /* To show the progress bar */
    showProgressBar();

    // hold request parameters and values for request parameters
    var request = {};
    request.userId = eval(getCookie("userId"));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    
    var call_user_get_profile = new user_get_profile(request, null, true, billerCorpId, programId, isMsg);
    call_user_get_profile.call();
}

/********************************************************************************************
Name                 :   handleUserGetProfileOnSuccess
Return type          :	 None
Input Parameter(s)   :   user_get_profile_obj, billerCorpId, programId, isMsg
Purpose              :   To handle the response og USER_GET_PROFILE in case of success.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2014  -   Ravi Raj
**********************************************************************************************/
function handleUserGetProfileOnSuccess(user_get_profile_obj, billerCorpId, programId, isMsg) {
	/* Check first and last name against property file default name. */
    if (user_get_profile_obj.user.firstName == messages["createAccount.firstNameInput"]) {
    	user_get_profile_obj.user.firstName = "";
    }

    if (user_get_profile_obj.user.lastName == messages["createAccount.lastNameInput"]) {
    	user_get_profile_obj.user.lastName = "";
    }

    bpGetCorpAccountMap[11] = user_get_profile_obj.user.firstName;
    bpGetCorpAccountMap[13] = user_get_profile_obj.user.lastName;
    bpGetCorpAccountMap[9] = user_get_profile_obj.user.phone;
    bpGetCorpAccountMap[20] = user_get_profile_obj.user.email;
    bpGetCorpAccountMap[22] = user_get_profile_obj.user.phone;
    if (user_get_profile_obj.userAddress != null) {
    	bpGetCorpAccountMap[14] = user_get_profile_obj.userAddress.address1;
    	bpGetCorpAccountMap[15] = user_get_profile_obj.userAddress.address2;
    	bpGetCorpAccountMap[16] = user_get_profile_obj.userAddress.city;
    	bpGetCorpAccountMap[17] = user_get_profile_obj.userAddress.state;
    	bpGetCorpAccountMap[18] = user_get_profile_obj.userAddress.zip;
    }
    handleGetBillerCreds(billerCorpId, programId, isMsg);
}

/********************************************************************************************
Name                 :   handleGetBPAccount
Return type          :	 None
Input Parameter(s)   :   billerCorpId, programId, isMsg
Purpose              :   To get the biller profile prefilled data in case of edit profile from API.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   27th March, 2013  -   Pradeep Yadav
**********************************************************************************************/
function handleGetBPAccount(billerCorpId, programId, isMsg) {
   /* To show the progress bar */
   showProgressBar();

   /* Hold request parameters and values for request parameters */ 
   var request = new Object();
   request.userId = eval(getCookie("userId"));
   request.billerCorpAccountId = billerCorpId;
   request.applicationId = applicationId;
   request.locale = getCookie("locale");

   var call_bp_get_corp_account = new bp_get_corp_account(request, programId, isMsg);
   call_bp_get_corp_account.call();
}

/********************************************************************************************
Name                 :   handleBpGetCorpAccountOnSuccess
Return type          :	 None
Input Parameter(s)   :   programId, isMsg
Purpose              :   To get the biller profile pre filled data in case of edit profile from API.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   27th Apr, 2014  -   Ravi Raj
**********************************************************************************************/
function handleBpGetCorpAccountOnSuccess(programId, isMsg) {
	var acctCreds = bp_get_corp_account_obj.accountCredentials;
	for (var j = 0; j < acctCreds.length; j++) {
	   bpGetCorpAccountMap[acctCreds[j].elementId] = acctCreds[j].value;
	}
	userNickName = bp_get_corp_account_obj.nickname;
	handleGetBillerCreds(bp_get_corp_account_obj.billerCorpId, programId, isMsg);
}

/********************************************************************************************
 Name                 :   handleGetBillerCreds
 Return type          :	  None
 Input Parameter(s)   :   billerCorpId, programId, isMsg
 Purpose              :   To get the biller profile data in case of edit profile from API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th March, 2013  -   Pradeep Yadav
 **********************************************************************************************/
function handleGetBillerCreds(billerCorpId, programId, isMsg) {
    /* To show the progress bar */
    showProgressBar();

    /* Hold request parameters and values for request parameters */
	var request = {};
    request.billerCorpId = billerCorpId;
    if (programId && programId != "null") {
    	request.programId = programId;
	}
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    if (parseBoolean(localStorage.getItem("registerUser"))) {
        $('#guestUserMyAccountBox').remove();
        $("#accBoxMainDivId").removeClass("myAccountSection");
        $('#myAccountBox').show();
        $('#userName').text(getCookie("userName"));
    }
    
    var call_bp_biller_corp_creds = new bp_biller_corp_creds(request, isMsg);
    call_bp_biller_corp_creds.call();
}

/********************************************************************************************
Name                 :   handleBpBillerCorpCredsOnSuccess
Return type          :	 None
Input Parameter(s)   :   isMsg
Purpose              :   To handle error response of billerCredentials API.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function handleBpBillerCorpCredsOnSuccess(isMsg) {
	/* show the div */ 
    $('#billerFormData').show();
    $('#addOrEditSaveBtnDiv').show();
    $('#addBil_billerType').show();
    $('#addBil_postingCategoryLanguage').show();
    $('#addBil_instruction2').show();
    $('#addBil_rightSection').show(); 
    
    printBillerData();
    createTableNew();
    
    hideShowCreateAccountForGuestUser();
    if (isMsg) {
    	showGeneralErrorMsg(msgType);
    }
}

/********************************************************************************************
 Name                 :   printBillerData
 Return type          :	  None
 Input Parameter(s)   :   None
 Purpose              :   To show the biller name  and posting category languae on add/edit
 biller form.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   12th July, 2013   -   Karuna Mishra
 **********************************************************************************************/
function printBillerData() {
	$("#addBil_billerName").html(bp_biller_corp_creds_obj.name);
	$('#addBil_billerType').text(bp_biller_corp_creds_obj.industryCategory);
	var postingCategories = bp_biller_corp_creds_obj.postingCategories;
	var postingCatgry = "";
	for (var index = 0; index < postingCategories.length; index++) {
		if (postingCategories[index].id === 1|| postingCategories[index].id === 4) {
			postingCatgry = messages["postingCategoryDesc.1"];
			$("#addBil_deliveryIcon").show();
			postingCatgrylabel = postingCategories[index].label;
			IsExpress = true;
		} else if (postingCategories[index].id === 2|| postingCategories[index].id === 3) {
			/*postingCatgry1 = messages["postingCategoryDesc.2"];*/
			$("#addBil_deliveryIcon").hide();
			postingCatgrylabel1 = postingCategories[index].label;
		}
	}
	if(addBill){
		$("#addEditLabel").html(messages["addBill.addBillLabel"]);
	}else{
		$("#addEditLabel").html(messages["addBill.editBill"]);
	}
	$('#addBil_postingCategoryLanguage').text(postingCatgry);
	if($('#addBil_postingCategoryLanguage').html().length == 0){
		$('.add_bill_txt.pipe').hide();
	}else{
		$('.add_bill_txt.pipe').show();
	}
	if (userNickName === null) {
		userNickName = bp_biller_corp_creds_obj.name;
		var nickNameCounter = 1;
		userNickName = getUniqueNickname(userNickName, nickNameCounter, userNickName);
	}
	$('#nickName').val(userNickName);
	$('#nickName').focus();
}

/***************************************************************************************************
 Name                 :   createTableNew
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   To create the biller and persopnal info section atble data in a Object.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   16th June, 2013   -   Pradep Yadav
 ******************************************************************************************************/
function createTableNew() {
    billerCredElements = new Object();
    $.each(bp_biller_corp_creds_obj.billerCredentialElements.sort(sortByDisplayOrder), function (i, obj) {
        /* Creating an billerCredElements array that can be used later to get the properties sent
         * from API to validate the form data */
        var elementId = obj.id;
        billerCredElements[elementId] = new Object();
        billerCredElements[elementId].name = obj.name;
        billerCredElements[elementId].label = obj.label;
        billerCredElements[elementId].displayFlag = obj.displayFlag;
        billerCredElements[elementId].displayOrder = obj.displayOrder;
        billerCredElements[elementId].dualEntryFlag = obj.dualEntryFlag;
        billerCredElements[elementId].elementHint = obj.elementHint;
        billerCredElements[elementId].elementType = obj.elementType;
        billerCredElements[elementId].exprCharacters = obj.exprCharacters;
        billerCredElements[elementId].exprLength = obj.exprLength;
        billerCredElements[elementId].required = obj.required;
        billerCredElements[elementId].securedFlag = obj.securedFlag;

        /* Calling the method to create the biller and personal information section */
        createBillerAndPersonalInfoSec(bp_biller_corp_creds_obj.billerCredentialElements[i]);
    });
}

/***************************************************************************************************
Name                 :   sortByDisplayOrder
Return type          :   {Object}
Input Parameter(s)   :   obj1, obj2
Purpose              :   To create the sort the biller on the basis of display order.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   16th June, 2013   -   Pradep Yadav
******************************************************************************************************/
function sortByDisplayOrder(obj1, obj2) {
	return obj1.displayOrder < obj2.displayOrder ? -1 : (obj1.displayOrder > obj2.displayOrder ? 1 : 0); 
}

/********************************************************************************************
Name                 :   schedulePayFailedPopup
Return type          :   NA
Input Parameter(s)   :   billerInfoMsg
Purpose              :   This method will be called when the user want to get the reason 
for that particular payment by clicking on that item, only in case of scheduled_canceled payments. 
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   21st May, 2014   -   Ravi Raj
*******************************************************************************************/
function showProviderInfoPopup(billerInfoMsg){
	if(billerInfoMsg != null && billerInfoMsg){
		$('#providerInfoMsgId').text(billerInfoMsg);
		showAnimatedPopup('providerInfoContainerId', 'providerInfoPopupId');
	}
}

/***************************************************************************************************
 Name                 :   createBillerAndPersonalInfoSec
 Return type          :   None
 Input Parameter(s)   :   billerCredsElement
 Purpose              :   To create the biller and personal information section for add/edit biller.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   24th July, 2013   -   Pradep Yadav
 ******************************************************************************************************/
function createBillerAndPersonalInfoSec(billerCredsElement) {
    var PHONE_BOX = "PHONE_BOX";
    var DATE_BOX = "DATE_BOX";
    var inputType = "text";
    var elementId = billerCredsElement.id;
    var elementType = billerCredsElement.elementType;
    var isPersonalInfoSec = false;
    if (elementId === 9 || (elementId >= 11 && elementId <= 20) || (elementId >= 52 && elementId <= 58)) {
        isPersonalInfoSec = true;
    }
    
    var exprLength = billerCredsElement.exprLength.match(/([^}{]+)(?=})/g);
    var fieldMaxLength = parseInt((exprLength[0].split(','))[1]);

    if (PHONE_BOX === elementType) {
        propertyValue = getFormattedPhoneNo(getValueFromKey(elementId));
        fieldMaxLength = fieldMaxLength + 4; /* +4 for two '-' , one '(' and one ')'. */ 
    } else if (DATE_BOX === elementType) {
        propertyValue = getFormattedDate(getValueFromKey(elementId));
        fieldMaxLength = fieldMaxLength + 2; /* +2 for two seprators */
    } else {
        propertyValue = getValueFromKey(elementId); /* Get the property value */
    }

    /* If it is secure property add masking to behave as password property */
    var isSecuredCred = billerCredsElement.securedFlag;
    if (isSecuredCred) {
    	inputType = "password";
        if (!addBill && propertyValue) { /* If there is no property value just skip the condition then keep the field empty */
            propertyValue = "*******************************************".substring(0, fieldMaxLength);
        }
    } else if(billerCredsElement.exprCharacters === "[0-9]"){
    	inputType = "tel";
    }

    var requiredSymbol = "";
    if (billerCredsElement.required) {
        /* To show the required symbol as * after the field label */
        requiredSymbol = '<span class="red-astrick">*</span>';
    }
    /* Creating an error box to show the client side errors */
    var mobErrorDiv = '<div id="mobAddBillErrorMsgDiv'+elementId+'" class="mob_error_msg desk_wid_input">'
	    				+	'<span id="mobAddEditBillErrorIconDiv" class="failed_icon"></span>'
	    				+	'<div id="mobError">'
	    				+		'<span id="mobAddBillErrorMsg">Error occured.</span>'
	    				+	'</div>'
	    				+'</div>';

    var mobHintDiv = "";
    /* Checking that hint is available or not */
    if (billerCredsElement.elementHint) {
        /* Creating a hint div to show the hints in the field */
        mobHintDiv = '<div id="mobHintMsgMainDiv' + elementId + '" class="txt_inv add_blue_hint add_blue_mobile_hint">'
					+ '<span class="blue_error_icon"></span>'
					+ '<span id="mobHintMsg"></span>'
					+ '</div>';
    }
    var billerInfoBox = "";
    var isUserRegistered = parseBoolean(localStorage.getItem("registerUser"));
    /* If the user status in the user object is guest or null or undefined in any way
     *  we are not displaying user-name and password fields for selected billers. */
    if ((!isUserRegistered || isUserRegistered === undefined ||  isUserRegistered === null)
    		&& (elementId == 52 || elementId == 53)) {
    	billerInfoBox = "";
    	return;
    }
    /* Adding the incentive info icon only for the registered user*/
    var showIncentiveIcon = messages["billerRegistration.promoMessage.credentialId_" + billerCredsElement.id 
                                         + ".industryId_" + bp_biller_corp_creds_obj.industryId];
    	if(showIncentiveIcon) {
    		billerInfoBox += "<div id='billerIncentiveImgId' class='wid_area100 flt_lft'>"
    						+ "<img id='incentiveImgId' src='" + showIncentiveIcon +"' class='incentive_img' />"
    						+ "</div>";
    	}
 
 	/* Creating the biller box for personal info section */
    		 billerInfoBox += "<div class='create_acc_field'>"
		 					+ "<label id='frmRowArea" + elementId + "'>"
					        + getLabelForSecureElements(elementId, billerCredsElement)
					        + requiredSymbol;

    var showPromoUrlInfoIcon = messages["billerRegistration.promoUrl.credentialId_" + billerCredsElement.id];
    if(showPromoUrlInfoIcon) {
    	billerInfoBox += "<span class='fa fa-info-circle fa-lg cred_info_icon' onclick='showProviderInfoPopup(\""
    		+ showPromoUrlInfoIcon +"\")' id='billerHintIcon" + billerCredsElement.id + "'></span>";
    }
	billerInfoBox += "</label>"
		            + "<div id='frmInputRowArea" + elementId + "' class='wid_area100 flt_lft'>"
		            + mobHintDiv
		            + mobErrorDiv
		            + "<input type='" + inputType + "' class='flt_lft' id='element" + elementId + "' placeholder='"
		            + billerCredsElement.label + "' maxlength='" + fieldMaxLength + "' value='" + propertyValue + "'/>";
    if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
	    if (billerCredsElement.securedFlag) {
	    	billerInfoBox +=  "<input type='text' id='other" + elementId + "' class='new-textarea txt_inv' maxlength='" 
	    					+ fieldMaxLength + "' value='" + propertyValue + "'/>";	
	    }
    }
    /* Creating the biller box end section, making it separate because we have to deal with
     * two different designs for Personal Info section and Biller Info section */
    billerInfoBox += "</div>"
	            + "</div>"
	            + "<div class='clear'> </div>";

    /* Checking the elementId for personal information section to draw */
    if (isPersonalInfoSec) {
        /* Creating the biller box for personal info section */
        $("#billerUserData").append(billerInfoBox);
        $("#billerUserData").show();
    } else {
        /* Creating the biller box for personal info section with hint and error with in it */
        $("#billerData").append(billerInfoBox);
        $('#frmRowArea' + elementId).addClass("width_area20");
        $('#frmInputRowArea' + elementId).addClass("add_bill_bluemsg_frmarea");
    }

    $("#element" + elementId).focus(function () {
        if (billerCredsElement.elementHint) {
            $("#element" + elementId).addClass("blue_brdr");
            /* Set the hint text in error message box */
            $("#mobHintMsgMainDiv" + elementId + " #mobHintMsg").text(billerCredsElement.elementHint);
            $("#mobHintMsgMainDiv" + elementId).show();
            $("#mobAddBillErrorMsgDiv" + elementId).hide();
            /* Getting the value from field */
            var hintValue = $("#element" + elementId).val();
            /* Setting the same value in same field so that for mobile if hint is shown
             * the cursor should move back to field as per bug fixes. */
            $("#element" + elementId).val(hintValue);
        }
        /* Change input type of field from password to text */
        if (billerCredsElement.securedFlag) {
        	if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
				createInputForIE8Focus(elementId, billerCredsElement.elementHint);
			} else {
				$("#element" + elementId).get(0).type = 'text';
			}
            $("#element" + elementId).select();
        }
    });

    $("#element" + elementId).blur(function () {
        var formatMightBeNeededBlur = true;
        if (billerCredsElement.securedFlag) {
            var fieldValue = $("#element" + elementId).val();
            if (/^[\\*]*$/.test(fieldValue)) {
                formatMightBeNeededBlur = false;
            }
        }
        if (formatMightBeNeededBlur) {
            if (PHONE_BOX === elementType) {
                formatPhoneNo(this);
            } else if (DATE_BOX === elementType) {
                formatDate(this);
            }
        }
        /*$("#blueHint" + elementId).hide();*/
        var isErrorFound = validateBillerInputField(elementId);
        $("#element" + elementId).removeClass("blue_brdr");
        /* Remove Blue background and question mark icon classes  from error div in moblie */
        if (isErrorFound) {
        	$("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId).show();
        } else {
            /* Remove the old message from message span */
            $("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId + " #mobAddBillErrorMsg").empty();
            /* Hide the error box on blur from field */
            $("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId).hide();
        }
        if (billerCredsElement.elementHint) {
        	$("#mobHintMsgMainDiv" + elementId + " #mobHintMsg").empty();
            $("#mobHintMsgMainDiv" + elementId).hide();
        }
        /* Change input type of field from text to password. */
        if (billerCredsElement.securedFlag) {
			$("#element" + elementId).get(0).type = 'password';
        }
    });

    $("#element" + elementId).keypress(function (e) {
    	var regExLocal = '';
        /* Creating a regular expression with max length to validate data on keyPress */
       /* if(billerCredsElement.displayOrder == 14 && billerCredsElement.exprCharacters === '.'){
        	regExLocal = '[0-' + 9 + ']' + '{0,' + fieldMaxLength + '}';
    	} else {*/
        	regExLocal = billerCredsElement.exprCharacters + '{0,' + fieldMaxLength + '}';
        /*}*/
        /* Remove error border class on key press */
        removeErrorBorderClass(elementId);
        // hide error message on mobile
        $("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId).hide();
        $('#errAddbill' + elementId).hide();
        /* Hide the error box div */
        /* Getting the key code */
        var key = e.keyCode || e.charCode;
        /* Checking for the element type as PHONE BOX*/

        if (billerCredsElement.securedFlag) {
        	var fieldValue = $("#element" + elementId).val();
        	if(billerCredsElement.displayOrder == 14){
        		validateUserInput(this, e, regExLocal);
        		
        	} else if (/^[\\*]*$/.test(fieldValue)) {
                return true;
            }
        }

        if (PHONE_BOX === elementType) {
            /* Checking if Enter key is pressed then format the Phone Field */
            if (key === 13) {
                /* Format the field value to phone format */
                formatPhoneNo(this);
                return true;
            }
            /* Validating the field value for Phone field on key press */
            return isValidPhoneEntered(this, e, fieldMaxLength - 4);
        } else if (DATE_BOX === elementType) { /* Checking for the element type as DATE BOX*/
            /* Checking if Enter key is pressed then format the Date Field */
            if (key === 13) {
                /* Format the field value to date format */
                formatDate(this);
                return;
            }
            /* Validating the field value for Date field on key press */
            return isValidDateEntered(this, e, fieldMaxLength - 2);

        } else {
            /* Validating the field value for Date field on key press */
            return validateUserInput(this, e, regExLocal);
        }
    });
    /* Checking for the dual property of the biller if ture then create a dual field on UI */
    if (billerCredsElement.dualEntryFlag) {
        /* Creating a dual entry field same as original field */
        createDualEntryField(inputType, requiredSymbol, propertyValue, fieldMaxLength, isPersonalInfoSec,
                             billerCredsElement);
    }
    mobileKeyboardFooterToggle();
}

/***************************************************************************************************
Name                 :   getLabelForSecureElements
Return type          :   Label
Input Parameter(s)   :   elementId, billerCredsElement
Purpose              :   To get the label for the security elements.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   24th July, 2014   -   UmaMaheswara Rao
******************************************************************************************************/
function  getLabelForSecureElements(elementId, billerCredsElement) {
	var label = "";
	if ((elementId == 52 || elementId == 53) && addBill) {
		label = bp_biller_corp_creds_obj.name + removeServiceProviderFromLabel(billerCredsElement.label);
	} else if ((elementId == 52 || elementId == 53) && !addBill) {
		for (var index = 0 ; index < bp_account_lite_obj.billerCorpAccounts.length ; index++) {
			if (bp_account_lite_obj.billerCorpAccounts[index].id == bp_get_corp_account_obj.id) {
				label = bp_account_lite_obj.billerCorpAccounts[index].nickname + removeServiceProviderFromLabel(billerCredsElement.label);
			} 
		}
	} else {
		label = billerCredsElement.label;
	}
	return label;
}

/***************************************************************************************************
Name                 :   removeServiceProviderFromLabel
Return type          :   text
Input Parameter(s)   :   label
Purpose              :   To get the label for the security elements.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   24th July, 2014   -   UmaMaheswara Rao
******************************************************************************************************/
function removeServiceProviderFromLabel(label) {
	var position = label.lastIndexOf(" ");
	var text = label.substring(position);
	return text;
}

/***************************************************************************************************
 Name                 :   createDualEntryField
 Return type          :   None
 Input Parameter(s)   :   inputType, requiredSymbol, propertyValue, fieldMaxLength, isPersonalInfoSec,
                          billerCredsElement
 Purpose              :   To create the dual entry boxes for biller or personal information section.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   24th July, 2013   -   Pradep Yadav
 ******************************************************************************************************/
function createDualEntryField(inputType, requiredSymbol, propertyValue, fieldMaxLength, isPersonalInfoSec,
                              billerCredsElement) {
    var PHONE_BOX = "PHONE_BOX";
    var DATE_BOX = "DATE_BOX";
    var replicaName = 'replicaof' + billerCredsElement.id;
    var elementId = billerCredsElement.id;
    var elementType = billerCredsElement.elementType;
    /* Create error div row for mobile */
    var mobErrorDiv = '<div id="mobAddBillErrorMsgDiv'+replicaName+'" class="mob_error_msg">'
						+	'<span id="mobAddEditBillErrorIconDiv" class="failed_icon"></span>'
						+	'<span id="mobError" href="javascript:void(0)">'
						+		'<span id="mobAddBillErrorMsg">Error occured.</span>'
						+	'</span>'
						+'</div>';
    /* Create replica of current row for validation only */
    var replicaDiv = "<div class='mrgn_bottom create_acc_field'> "
            + "<div id='frmRepRowArea" + billerCredsElement.id + "' class='addbill-td txt_bold'>"
            + formatMessage(messages["addBill.reEnter"], billerCredsElement.label) + requiredSymbol
            + "</div>"
            + "<div id='frmRepInputRowArea" + billerCredsElement.id + "'>"
            + mobErrorDiv
            + "<input type='" + inputType + "' class='' placeholder='" + billerCredsElement.label
            + "' id='" + replicaName + "' maxlength='" + fieldMaxLength + "' value='" + propertyValue + "' />";
    if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
	    if (billerCredsElement.securedFlag) {
	    	replicaDiv += "<input type='text' class='new-textarea txt_inv'   id='other" + replicaName + "' maxlength='" + fieldMaxLength + "' value='" + propertyValue + "' />";	
	    }
	}
    replicaDiv += "</div>"
            + "</div>"
            + "<div class='clear'> </div>";

    /* Checking the elementId for personal information section to draw */
    if (isPersonalInfoSec) {
        $("#billerUserData").append(replicaDiv);
    } else {
        $("#billerData").append(replicaDiv);
    //    $('#frmRepRowArea' + billerCredsElement.id).addClass("width_area20");
        $('#frmRepInputRowArea' + billerCredsElement.id).addClass("add_bill_bluemsg_frmarea");
    }

    $("#" + replicaName).focus(function() {
		// Change input type of field from password to text.
		if (billerCredsElement.securedFlag) {
			if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
				createInputForIE8Focus(replicaName);
			} else {
				$("#" + replicaName).get(0).type = 'text';
			}
			 $("#" + replicaName).select();
		}
	}); 
    $("#" + replicaName).blur(function () {
        /* Checking for the type of field as PHONE_BOX */
        var formatMightBeNeeded = true;
        if (billerCredsElement.securedFlag) {
            var fieldValue = $("#" + replicaName).val();
            if (/^[\\*]*$/.test(fieldValue)) {
                formatMightBeNeeded = false;
            }
        }
        if (formatMightBeNeeded) {
            if (PHONE_BOX === elementType) {
                /* Format the field value to phone format on blur */
                formatPhoneNo(this);
            } else if (DATE_BOX === elementType) { /* Checking for the type of field as DATE_BOX */
                /* Format the field value to date format on blur */
                formatDate(this);
            }
        }
        /* Validating the dual field and sending the biller id */
        var isErrorFound = validateDualField(billerCredsElement.id);
        /* Remove Blue background and question mark icon classes from error div in moblie */
        $("#mobAddEditBillErrorIconDiv").removeClass("blue_error_icon").addClass("failed_icon");
        $("#mobAddBillErrorMsgDiv").removeClass("add_blue_hint").addClass("mob_error_msg");
        if (isErrorFound) {
        	$("#addEditBillerForm #mobAddBillErrorMsgDiv" + replicaName).show();
        } else {
            /* Remove the old message from message span */
            $("#addEditBillerForm #mobAddBillErrorMsgDiv" + replicaName + " #mobAddBillErrorMsg").empty();
            /* Hide the error box on blur from field */
            $("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId).hide();
        }
        /* Change input type of field from text to password.*/
		if (billerCredsElement.securedFlag) {
			$("#" + replicaName).get(0).type = 'password';
		}
    });

    $("#" + replicaName).keypress(function (e) {
        /* Creating a regular expression with max length to validate data on keyPress */
        var regExLocal = billerCredsElement.exprCharacters + '{0,' + fieldMaxLength + '}';
        /* Remove the red error border class */
        removeErrorBorderClass(replicaName);
        // hide mobile error message div
        $("#addEditBillerForm #mobAddBillErrorMsgDiv"+replicaName).hide();
        $('#errAddbillDual' + billerCredsElement.id).hide();
        /* Show the error box div */
        var key = e.keyCode || e.charCode;

        if (billerCredsElement.securedFlag) {
            var fieldValue = $("#" + replicaName).val();
            if (/^[\\*]*$/.test(fieldValue)) {
                return true;
            }
        }

        /* Checking for the type of field as PHONE_BOX */
        if (PHONE_BOX === elementType) {
            /* Checking for Enter key pree to format the phone no */
            if (key === 13) {
                /* Format the field value to phone format on blur */
                formatPhoneNo(this);
                return true;
            }
            /* Validating the field value for Phone field on key press */
            return isValidPhoneEntered(this, e, fieldMaxLength - 4);
        } else if (DATE_BOX === elementType) { /* Checking for the type of field as DATE_BOX */
            /* Checking for Enter key pree to format the phone no */
            if (key === 13) {
                /* Format the field value to date format on blur */
                formatDate(this);
                return true;
            }
            /* Validating the field value for Date field on key press */
            return isValidDateEntered(this, e, fieldMaxLength - 2);
        } else {
            /* Validating the field value for rest of the fields on key press */
            return validateUserInput(this, e, regExLocal);
        }
    });
}

/********************************************************************************************
Name                 :   createInputForIE8Focus
Return type          :	 None
Input Parameter(s)   :   oldInputField, elementHint
Purpose              :   To create an input field with type text for IE 8.
History Header       :   Version   -   Date              	-   Developer Name
Added By             :   1.0       -   17th Sep, 2013   	-   Karuna Mishra
**********************************************************************************************/
function createInputForIE8Focus(oldInputField, elementHint){
    var otherElement = 'other' + oldInputField;
    $("#element" + oldInputField).hide();
    $("#" + otherElement).show();
    var oldValue = $("#element" + oldInputField).val();
    $("#" + otherElement).val(oldValue);
    $("#other" + oldInputField).focus();
	    
    $("#other" + oldInputField).focus(function() {
		if (elementHint) {
			$("#" + otherElement).addClass("blue_brdr");
			$("#blueHint" + oldInputField).show();
			$('#errAddbill' + oldInputField).hide();
		}
		if (oldInputField.substring) {
			var newId = oldInputField.replace(/replicaof/g, '');
			if ($('#errAddbillDual' + newId).is(":visible")) {
				$("#other" + oldInputField).addClass("error_red_border");
			} else {
				$("#other" + oldInputField).removeClass("error_red_border");
			}
		}
	});
    
    $("#" + otherElement).blur(function() {
    	createInputForIE8Blur(oldInputField, elementHint);
	});
}

/********************************************************************************************
Name                 :   createInputForIE8Blur
Return type          :	 None
Input Parameter(s)   :   oldInputField
Purpose              :   To create an input field with type password for IE 8.
History Header       :   Version   -   Date              	-   Developer Name
Added By             :   1.0       -   19th Sep, 2013   	-   Karuna Mishra
**********************************************************************************************/
function createInputForIE8Blur(oldInputField){
    var otherElement = 'other' + oldInputField;
    var oldValue = $("#" + otherElement).val();
    $("#element" + oldInputField).show();
    $("#" + otherElement).hide();
    $("#element" + oldInputField).val(oldValue);
    $("#element" + oldInputField).blur();
}

/********************************************************************************************
Name                 :   showErrorOnMobile
Return type          :	 None
Input Parameter(s)   :   errorDivId
Purpose              :   To show the respective error div on mobile.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th Aug, 2013   -   Pradeep Yadav
**********************************************************************************************/
function showErrorOnMobile(errorDivId) {
	if ($(".error_red_border").is(":visible")) {
        $('#' + errorDivId).show();
    }
} 

/********************************************************************************************
 Name                 :   validateBillerInputField
 Return type          :	  None
 Input Parameter(s)   :   elementId
 Purpose              :   To validate the form fields of biller and personal information section.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function validateBillerInputField(elementId) {
    if (elementId) {
        /* Getting the field value */
        var fieldValue = $('#element' + elementId).val().trim();
        if (fieldValue) {
            /* Validate the field with corresponding regular expression */
            var isMatchRegEx = validateFieldRegEx(elementId, fieldValue);
            /* Checking if validate with Regular expression */
            if (isMatchRegEx) {
                var elementObj = billerCredElements[elementId];
                /* Check for dual entry flag if true then validate the field for dual entry */
                if (elementObj.dualEntryFlag) {
                    validateDualField(elementId);
                }
                removeErrorBorderClass(elementId);
                /* Remove the error border class */
                $('#errAddbill' + elementId).hide();
                /* Hide the error box div */
            } else {
                applyErrorClass(elementId);
                /* Apply the error border class */
                /* Getting the object from stored API response */
                var elementObject = billerCredElements[elementId];
                /* Splitting and creating the array to find minlenght from expression */
                var exprLength = elementObject.exprLength.match(/([^}{]+)(?=})/g);
                /* Finding the min-length from array */
                var fieldMinLength = parseInt((exprLength[0].split(','))[0]);
                /* Creating a message to be shown when error occurs */
                var message = "";
                var elementObj = billerCredElements[elementId];
                if(elementObj.elementType === "DATE_BOX") {
                	message = messages['addBill.dateBoxMsg'];
                } else {
                	message = formatMessage(messages['addEditBiller.alert.validationMsg'], elementObject.label, fieldMinLength);
                }
                /* Setting the error message text in mobile error msg div above the input field */
                $("#addEditBillerForm #mobAddBillErrorMsgDiv" + elementId + " #mobAddBillErrorMsg").text(message);
                /* Show the error box div for standard width */
                //$('#' + errorDivParentId).show();
                return true;
            }
        } else {
        	/* Remove the error border class */
            removeErrorBorderClass(elementId);
            /* Hide the error box div */
            $('#errAddbill' + elementId).hide();
        }
        return false;
    }
}

/******************************************************************************************
 Name                 :   enableSaveBillerButton
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   To check and enable and disable the submit button.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   17th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function enableSaveBillerButton() {
    /* To check the status of fields at 500 ms interval and if Ok enable the Submit button*/
    addEditBillerCountdown = setInterval("checkRequiredFieldsStatus();", 500);
}

/******************************************************************************************
 Name                 :   checkRequiredFieldsStatus
 Return type          :	  None
 Input Parameter(s)   :	  None
 Purpose              :   To load all required properties using equired css and iterate one by one
 to see all requried property if all required property filled by user enable submit button elese disable it
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   01th June, 2013   -   Pradep Yadav
 *******************************************************************************************/
function checkRequiredFieldsStatus() {
	var optionalFieldCount = 0;
	var isAllOptional = isAllFieldsOptional();
	/* Check for registerd user.*/
	var registeredUser = parseBoolean(localStorage.getItem("registerUser"));
	/* Load all required properties using equired css iterate one by one and check after trim length > 0 or
	 * minlength if all requried > 0 enable submit button elese disable it. */
	var enableSubmitButton = true;
	/* Getting the input fields within the div */
	var $requiredFields = $('#addEditBillerForm :input');
	/* Iterating through the list of input fields */
	$requiredFields.each(function () {
		/* Getting the value of input field */
		var inputVal = $(this).val().trim();
		/* Getting the id of input field */
		var inputId = $(this).attr('id');
		/* Removing the 'replica' text from field id for dual fields to get the billerCredsElement.id */
		inputId = inputId.replace(/replicaof/g, '');
		inputId = inputId.replace(/other/g, '');
        inputId = inputId.replace("element", '');
		/* Checking if the field is not the 'nickName' */
		if (inputId !== 'nickName') {
			/* Getting the required status value from stored API response */
			var isRequired = billerCredElements[inputId].required;
			/* Checking to validate the required fields. they should be fileld and validated with regex. */
			if(isRequired && (!inputVal || !validateFieldRegEx(inputId, inputVal))){
				enableSubmitButton = false;
				return;
			} /* Checking to validate the optional field if there is any value then it should validate with regex */
			else if(!isRequired && inputVal && !validateFieldRegEx(inputId, inputVal)) {
				enableSubmitButton = false;
				return;
			} else if(isAllOptional) { /* Checking if all the biller fields are optional */
				if(optionalFieldCount === 0){
					enableSubmitButton = false;
					if(inputVal){ /* Enabling if any of the optional field contains some data*/
						optionalFieldCount++;
						enableSubmitButton = true;
					}
				}
			} else { /* Checking for dual entry field */
				var elementObj = billerCredElements[inputId];
				/* Checking for the dual entry field flag from stored API response */
				if (elementObj.dualEntryFlag) {
					/* Checking if field has a value then match the value in Main field and Dual field */
					if (inputVal && !matchDualFieldValue(inputId)) {
						enableSubmitButton = false;
					}
				}
			}
		}
	});
	/* Checking if user is registered or create account check box is not checked */
	if (registeredUser || !$('#chkCreateAcc').is(":checked")) {
		/* Checking for the variable status if true then enable the submit button and change the class */
		if (enableSubmitButton) {
			activateAddBillPageSaveButton();
			return;
		}
	} else { /* Otherwise if user is not registered and create account check box is checked perform the below code */
		if (enableSubmitButton) { /* Checking if Biller and Personal info fields are filled */
			if (checkCreateAccountSec()) { /* Checking for create account section fields if valdated then enable the submit button */
				activateAddBillPageSaveButton();
			} else {
				enableSubmitButton = false;
			}
		}
	}
	/* Check for disable the button either for Guest create profile is shown or not. */
	if (!enableSubmitButton) {
		deActivateAddBillPageSaveButton();
	}
}

/******************************************************************************************
Name                 :   isAllFieldsOptional
Return type          :	 Boolean
Input Parameter(s)   :	 None
Purpose              :   To check whether the filed is optional or mandatory.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   01th June, 2013   -   Pradep Yadav
*******************************************************************************************/
function isAllFieldsOptional() {
	for(var index in billerCredElements) {
		if(billerCredElements[index].required) {
			return false;
		}
	}
	return true;
}

/********************************************************************************************
 Name                 :   checkCreateAccountSec
 Return type          :	  validated
 Input Parameter(s)   :   elementId
 Purpose              :   To validate the form fields of biller and personal information section.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function checkCreateAccountSec(elementId) {
	var validated = true;
	var emailRegEx = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	var passwordRegEx = /^(?=\S+$).{4,20}/;
	var phoneRegEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	var zipRegEx = /^\d{5}$/;
	var $requiredFields = $('input[type="text"],input[type="password"],input[type="tel"]','#frmGuestCreateAcc');
	/* Iterating through the list of input fields */
	$requiredFields.each(function () {
		/* Getting the value of input field */
		var inputVal = $(this).val().trim();
		var elementId = $(this).attr('id');
		if (!emailRegEx.test(inputVal) && elementId === 'emailId') {
			validated = false;
		}
		if (!emailRegEx.test(inputVal)&& elementId === 'confrmEmailId') {
			validated = false;
		}
		if (!passwordRegEx.test(inputVal)&& elementId === 'password') {
			validated = false;
		}
		if (!phoneRegEx.test(inputVal)&& elementId === 'mobileNo') {
			validated = false;
		}
		if (!zipRegEx.test(inputVal)&& elementId === 'zipCode') {
			validated = false;
		}
		if (!inputVal || $(this).hasClass('error_red_border')) {
			validated = false;
		}
	});
	return validated;
}

/********************************************************************************************
 Name                 :   validateFieldRegEx
 Return type          :   Boolean
 Input Parameter(s)   :   elementId, fieldValue
 Purpose              :   To validate the form fields of biller and personal information section
 against the regular expressions sent by API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function validateFieldRegEx(elementId, fieldValue) {
    var elementObj = billerCredElements[elementId];
    /* Creating the regular expression */
    var regExpr = new RegExp("^" + elementObj.exprCharacters + elementObj.exprLength + "$");
    if (!addBill) {
        var isSecure = billerCredElements[elementId].securedFlag;
        if (isSecure) {
            var asterisk = new RegExp("^[\\*]*$");
            if (asterisk.test(fieldValue)) {
                return true;
            }

            if (fieldValue === getValueFromKey(parseInt(elementId))) {
                return true;
            }
        }
    }
    /* Checking for PHONE and DATE box type and getting only number from the input field */
    if (elementObj.elementType === "PHONE_BOX" || elementObj.elementType === "DATE_BOX") {
    	if(elementObj.elementType === "DATE_BOX"){
    		var regexOfDateBox = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    		 if(!regexOfDateBox.test(fieldValue)){
    			 return regexOfDateBox.test(fieldValue); 
    		 }
    	}
    	 fieldValue = getNumberFromString(fieldValue);
    }
    return regExpr.test(fieldValue);
}

/********************************************************************************************
 Name                 :   validateDualField
 Return type          :	  Boolean
 Input Parameter(s)   :   elementId
 Purpose              :   To validate the dual/replica form fields of biller and personal
 information section against the regular expressions sent by API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function validateDualField(elementId) {
    var dualFieldId = 'replicaof' + elementId;
    var replicaFieldValue = $('#' + dualFieldId).val().trim();
    /* Checkng if the replica field have the value in it */
    if (replicaFieldValue) {
        /* Checking if the dual field matched with original field */
        if (matchDualFieldValue(elementId)) {
            removeErrorBorderClass(dualFieldId);
            /* Remove the error border class */
            $('#errAddbillDual' + elementId).hide();
            /* Hide the error box div */
        } else {
            applyErrorClass(dualFieldId);
            /* Apply the error border class */
           // $('#errAddbillDual' + elementId).show();
            /* Show the error box div */
            var placeholder = $('#element' + elementId).attr('placeholder');
            /* Creating a message to be shown when error occurs */
            var message = formatMessage(messages['addEditBiller.alert.validationReenterMsg'], placeholder);
            var errorDivParentId = 'errAddbillDual' + elementId;
            // show error message for mobile above the input field.
            $("#addEditBillerForm #mobAddBillErrorMsgDiv" + dualFieldId + " #mobAddBillErrorMsg").text(message);
            /* Show the error box div */
            $('#' + errorDivParentId).show();
            return true;
        }
    } else {
        removeErrorBorderClass(dualFieldId);
        /* Remove the error border class */
        $('#errAddbillDual' + elementId).hide();
        $('#mobAddBillErrorMsgDiv' + dualFieldId).hide();
        /* Hide the error box div */
    }
    return false;
}

/********************************************************************************************
 Name                 :   matchDualFieldValue
 Return type          :   boolean
 Input Parameter(s)   :   elementId
 Purpose              :   To validate the dual/replica form fields of biller and personal
 information section against the regular expressions sent by API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   30th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function matchDualFieldValue(elementId) {
    var dualFieldId = 'replicaof' + elementId;
    var mainFieldValue = $('#element' + elementId).val().trim();
    var replicaFieldValue = $('#' + dualFieldId).val().trim();
    /* Checkng if the replica field have the value in it */
    if (replicaFieldValue) {
    	/* Removing all characters as (, ) and - to validate the */
        mainFieldValue = mainFieldValue.replace(/\W+/g, '');
        /* Removing all characters as (, ) and - to validate the */
        replicaFieldValue = replicaFieldValue.replace(/\W+/g, '');
        /* Checking if the dual field matched with original field */
        if (mainFieldValue === replicaFieldValue) {
            return true;
        }
    }
    return false;
}

/********************************************************************************************
 Name                 :   validateUserInput
 Return type          :	  Boolean
 Input Parameter(s)   :   currentElement, evt, regEx
 Purpose              :   To validate user input for form fields of biller and personal
 information section against the regular expressions sent by API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   26th July, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function validateUserInput(currentElement, evt, regEx) {
    /* Getting the char code for pressed key event */
    var charCode = evt.charCode;
    var regExpr = new RegExp("^" + regEx + "$");
    // if browser version is IE-8
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
    	charCode = evt.keyCode;
    }
    var txtBoxVal = $(currentElement).val().trim();
    /* To get the current cursor position with in the text */
    var inputIndex = $(currentElement).caret().start;
    /* To create the new amount string combining curent amount and new char pressed at cursor position */
    txtBoxVal = insertCharAt(txtBoxVal, inputIndex, String.fromCharCode(charCode));
    if (txtBoxVal) {
        if (isCtrlKeyPressed(evt, charCode)) { /* Validating for CTRL+C/X/V key event for firefox */
            return true;
        } else if (isSpecialKeyPressed(charCode)) { /* Validating for Left/Right arrow, Delete key event for firefox */
            return true;
        } else if (getSelectedArea() && regExpr.test(txtBoxVal)) { /* Checking if the complete or partial text is selected in input field */
            return true;
        } else {
            return regExpr.test(txtBoxVal);
        }
    }
}

/******************************************************************************************
 Name                 :   backToHomeFromEditBill
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   To get back to Home screen in case of Edit Biller.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   17th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function backToHomeFromEditBill() {
    /* If came from search biller then addBill will be true and on back will move to search biller*/
    if (addBill) {
    	navigateToBillerSearch(false);
    } else {
    	navigateToHome();
    }
    clearIntervalApp(addEditBillerCountdown);
}

/********************************************************************************************
 Name                 :   handleSaveCreds
 Return type          :	  None
 Input Parameter(s)   :   None
 Purpose              :   To save(Add) or update(Edit) Biller Account to the API.
 History Header       :   Version   -   Date              -   Developer Name
 Added By             :   1.0       -   27th March, 2013  -   Pradeep Yadav
 **********************************************************************************************/
function handleSaveCreds() {
    /* To show the progress bar */
    showProgressBar();
    var billerCorpId = null, programId = null, billerCorpAccountId = null;
    var strNick = "" + $('#nickName').val();
    var nickname = strNick.replace(/[\<\>\;\&\/]/g, '').trim();
    var nickNameLabelId = $('#nickNameSec > label:first').attr('id');
    if(nickNameLabelId) {
	    billerCorpId = nickNameLabelId.split('_')[0];
	    programId = nickNameLabelId.split('_')[1] === 'null' ? null : nickNameLabelId.split('_')[1];
	    billerCorpAccountId = nickNameLabelId.split('_')[2] === 'null' ? null : nickNameLabelId.split('_')[2];
    }
    var request = new Object();
    request.userId = eval(getCookie('userId'));
    request.billerCorpId = billerCorpId ;
    if(programId) {
    	request.programId = programId;
    }
    if(billerCorpAccountId) {
    	request.billerCorpAccountId = billerCorpAccountId;
    }
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.nickname = nickname;
    request.accountCredentials = new Array();
    var credCount = 0;
    for (var billerCredsId in billerCredElements) {
        var elementObj = billerCredElements[billerCredsId];
        var inputElementValue = replaceUnUsedChar("element" + billerCredsId);/*adding element for bug 4932 
        which is disturbed by bug 4944 now fixed*/
        if (inputElementValue) {
        	request.accountCredentials[credCount] = new Object();
            request.accountCredentials[credCount].elementId = billerCredsId;
            /*  Checking for PHONE and DATE box type and getting only number from the input field */
            if (elementObj.elementType === "PHONE_BOX" || elementObj.elementType === "DATE_BOX") {
                if (elementObj.securedFlag) {
                    if (!/^[\\*]*$/.test(inputElementValue)) {
                        inputElementValue = getNumberFromString(inputElementValue);
                    }
                } else {
                    inputElementValue = getNumberFromString(inputElementValue);
                }
            }
            billerCredsId == 21 ? request.accountCredentials[credCount].value = inputElementValue.toUpperCase() 
            		: request.accountCredentials[credCount].value = inputElementValue;
            credCount++;
        } else {
        	if(bpGetCorpAccountMap[billerCredsId]){
        		request.accountCredentials[credCount] = new Object();
                request.accountCredentials[credCount].elementId = billerCredsId;
                billerCredsId == 21 ? request.accountCredentials[credCount].value = inputElementValue.toUpperCase() 
                		: request.accountCredentials[credCount].value = inputElementValue;
        		credCount++;
        	}
        }
    }
    var call_bp_save_biller_corp_acct_creds = new bp_save_biller_corp_acct_creds(request);
    call_bp_save_biller_corp_acct_creds.call();
}

/********************************************************************************************
Name                 :   handleBpSaveBillerCorpAcctCredsOnSuccess
Return type          :	 None
Input Parameter(s)   :   None
Purpose              :   To handle the success response of BP_SAVE_BILLER_CORP_ACCT_CREDS API.
History Header       :   Version   	-   Date              		-   Developer Name
Added By             :   1.0       	-	27th Apr, 2014  		-   Ravi Raj
**********************************************************************************************/
function handleBpSaveBillerCorpAcctCredsOnSuccess() {
	/* Storing the biller boxes data into tempBillArray so that is can be populated later after BP_ACCOUNT_LITE API call */
	setTempBillArray(); 
	if (isGuestMsg) {
		gettingInfoOfBillerAcc();
		$('#myAccountBox').show();
        $('#guestUserMyAccountBox').hide();
        isGuestMsg = false;
		showGeneralSuccessMsg(messages['addEditBiller.GuestUserBillerSaved'],
                                 messages['inLine.message.successMessage']);
    } else {
    	/* Checking for scheduled biller edited and updated credentials it will raise pop up */
    	if(bp_save_biller_corp_acct_creds_obj.scheduled === true){
    		successfulCredUpdatePopup();	
    		gettingInfoOfBillerAcc();
    	} else {
    		gettingInfoOfBillerAcc();
    		showGeneralSuccessMsg(messages['addEditBiller.alert.billerSaved'],
    		  messages['inLine.message.successMessage']);
    	}
    }
}

/********************************************************************************************
Name                 :   handleBpSaveBillerCorpAcctCredsOnSuccess
Return type          :	 None
Input Parameter(s)   :   None
Purpose              :   To handle the success response of BP_SAVE_BILLER_CORP_ACCT_CREDS API.
History Header       :   Version   	-   Date              		-   Developer Name
Added By             :   1.0       	-	27th Apr, 2014  		-   Ravi Raj
**********************************************************************************************/
function gettingInfoOfBillerAcc() {
    LAST_EDIT_BOX_ID = bp_save_biller_corp_acct_creds_obj.billerCorpAccountId;
    
    /* Used for getting the information of biller accout coming from  pay_your_bill_area.js */
    getBillerAccounts();
    /* Used for laoding the home page coming from button_event.js. */
    var currentUrl = window.location.href; /* whatever your current location href is */ 
    var newUrl = currentUrl.replace(/#addBiller/, '#home');
    if (window.history.replaceState != undefined) {
        window.history.replaceState({}, currentUrl, newUrl);
    } else {
        window.location.href = newUrl;
    }
    loadHomeScreenArea();
}

/*******************************************************************************
Name 				: 	getUniqueNickname 
Return type 		:	None
Input Parameter(s) 	: 	billerNickName, counter, mainName 
Purpose 			: 	To get the new nickname by appanding pluse (1) with 
						nickname. 
History Header 		: 	Version 	- 	Date 				- 	Developer Name 
Added By 			: 	1.0 		-	03th April, 2013 	- 	Pradeep Yadav
 ******************************************************************************/
function getUniqueNickname(billerNickName, counter, mainName) {
    var orignalName = billerNickName;
    var billerNickNm = billerNickName.replace(/[\<\>\;\&\/]/g, '');
    if (nickNamesExistsArray != undefined) {
        if (nickNamesExistsArray.indexOf(billerNickNm.toLowerCase()) != -1) {
            // add (+1) into biller nick name
            billerNickName = mainName + " (" + ++counter + ")";
            orignalName = getUniqueNickname(billerNickName, counter, mainName);
        }
    }
    return orignalName;
}

/********************************************************************************************
Name                 :   hideShowCreateAccountForGuestUser
Return type          :   None
Input Parameter(s)   :   None
Purpose              :   This method is used for showing create account box on Add/Edit 
						 biller page for guest user.
History Header       :   Version   -   Date              	-   Developer Name
Added By             :   1.0       -   18th May,2013       	-   Karuna Mishra
*******************************************************************************************/
function hideShowCreateAccountForGuestUser() {
    var registerUser = parseBoolean(localStorage.getItem("registerUser"));
    var enabled = initAppFeatureName["GUEST_USER"];
    if ((enabled === true && registerUser === false)) {
        $("#guestUserMyAccountBox").show();
        /* Show the check box for marketing Opt in */
        createOptInMsgAorBSection("chkOptInEnhAddBill", "optInEhnChkAddBill", messages['createAccount.optInEnh']);
        
        $("#createAccountBox").show();
        return;
    }
    $("#createAccountBox").remove();
}

/********************************************************************************************
 Name                 :   showRegForm
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   Function is used to show the create account form for guest user.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   12th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function showRegForm() {
    if (!$('#chkCreateAcc').is(":checked")) {
        var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
        var arg1 = '</a>';
        message = formatMessage(messages['checkout.guestUserAddBillTermCond'], arg0, arg1);
        $("#chkCreateAcc").prop('checked', true);
        $("#chkCreateAccIcon").removeClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#chkCreateAccIcon").addClass("add_bill_activ_chkbox_icon flt_lft");
        $("#frmGuestCreateAcc").show();
        $("#createAccountBoxErrDiv").show();
        $("#btnContinue").val(messages['addBill.saveBill']);
        $("#btnContinueBtm").val(messages['addBill.saveBill']);
        $("#addEditBillTermsArea").html(message);

        /* To be called from create_acc_guest.js*/
        validateAddBillGuestCreateProfile();
        enableDisableSubmit('frmGuestCreateAcc', 'btnContinue', 'btnContinueBtm');
    } else {
        $("#chkCreateAcc").prop('checked', false);
        $("#chkCreateAccIcon").removeClass("add_bill_activ_chkbox_icon flt_lft");
        $("#chkCreateAccIcon").addClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#frmGuestCreateAcc").hide();
        $("#createAccountBoxErrDiv").hide();
        $("#mobAddBillErrorMsgDiv").hide();
        $("#btnContinue").val(messages['addBill.saveBill']);
        $("#btnContinueBtm").val(messages['addBill.saveBill']);
    }
}

/********************************************************************************************
 Name                 :   callGuestOrAccCreation
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   Function is used to call Guest or Account creation methods depending on checked value.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   12th June, 2013   -   Karuna Mishra
 *******************************************************************************************/
function callGuestOrAccCreationOrIW() {
    var registerUser = parseBoolean(localStorage.getItem("registerUser"));
    if (registerUser) {
        handleSaveCreds();
    } else if (!$('#chkCreateAcc').is(":checked")) {
        createGuestAccounOrContinue(true);
    } else {
        if (getCookie("userId")) {
            upgradeGuestUserToRegistered(2, 'frmGuestCreateAcc');
        } else {
            handleGuestUser(false);
        }
    }
}

/********************************************************************************************
 ' Name                 :   createGuestAccounOrContinue
 ' Return type          :   None
 ' Input Parameter(s)   :   isContFlag
 ' Purpose              :   function is used for calling the user_guest api and savadata function on the click of continue button.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   8th May,2013       -   Karuna Mishra
 '*******************************************************************************************/
function createGuestAccounOrContinue(isContFlag) {
    if (getCookie("userId")) {
        handleSaveCreds();
    } else {
        handleGuestUser(isContFlag);
    }
}

/********************************************************************************************
 ' Name                 :   hanldeErrorOfGuestuser
 ' Return type          :   None
 ' Input Parameter(s)   :   isContFlag
 ' Purpose              :   Function is used for calling the USER_GUEST Api.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May,2013       -   Karuna Mishra
 '*******************************************************************************************/
function handleGuestUser(isContFlag) {
    /* To show the progress bar */
    showProgressBar();

    // hold request parameters and values for request parameters
    var utmSource = getCookie("utmSource");
    var utmCampaign = getCookie("utmCampaign");
    var request = {};
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.timeZone = calculate_time_zone();
    if(utmSource) {
    	request.utmSource = utmSource;
    }
    if(utmCampaign) {
    	request.utmCampaign = getCookie("utmCampaign");
    }
    
    var call_user_guest = new user_guest(request, isContFlag);
    call_user_guest.call();
}

/********************************************************************************************
' Name                 :   handleUserGuestOnSuccess
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used for handle the response of USER_GUEST Api.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th May,2013     -   Karuna Mishra
'*******************************************************************************************/
function handleUserGuestOnSuccess(isContFlag) {
	setCookie("userId", user_guest_obj.userId);
    setCookie('userName', user_guest_obj.username);
    /* Store Account ID of guest user, to display on Edit Profile Page. */
    setCookie("walletId", user_guest_obj.walletId);
    setCookie("userAccountNumber", user_guest_obj.accountNum);
    if (isContFlag) {
        handleSaveCreds();
    } else {
        upgradeGuestUserToRegistered(2, 'frmGuestCreateAcc');
    }
}

/********************************************************************************************
' Name                 :   successfulCredUpdatePopup
' Return type          :   None
' Input Parameter(s)   :   req
' Purpose              :   Function is used to show the popup of credentail update.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   24th May,2013     -   Karuna Mishra
'*******************************************************************************************/
function successfulCredUpdatePopup(){
	var	newHtml 	= "<div class=''>"
    				+ messages['main_pay.cred_update']
					+ " "
    				+ bp_get_corp_account_obj.nickname
    				+ "</div>";
	$('#showSuccessConfirmation').empty();
	$('#successCredentialId').show(); /* show pop up using main div id*/
	$('#showSuccessConfirmation').append(newHtml); /* append the html content in to pop up*/
}