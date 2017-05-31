var userMailId;
var oldUserName, newUserName;
var editEmailFlag = false;
var flagFirstName, flagLastName, flagAdd1, flagAdd2, flagCity, flagZip;
var flagEmail, flagReEmail, flagPhone, flagCurrPass, flagNewPass, flagSecAns;
var updateBtnInterval;

/********************************************************************************************
' Name                 :   loadEditProfilePage
' Return type          :   None
' Input Parameter(s)   :   callFromRefresh
' Purpose              :   This method is used to load Edit profile page on click of EDIT PROFILE button.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function loadEditProfilePage(callFromRefresh) {
	removeHomeScreenArea();
	/* If user refresh the page then call the USER_GET_PROFILE API */
	if(callFromRefresh === callFrom_constant.CALL_EDIT_PROFILE_REFRESH){
		getUserProfile(true, getUserProfileForUpdateProfile, false);
	}
	
	/* Show the home button on footer as selected. */
	if(callFromRefresh != callFrom_constant.CALL_EDIT_PROFILE_REFRESH){/* Check if the call is not from refresh then do it */
		getUserProfileForUpdateProfile();/* This method will */
	}

	/* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
	showScreenAndSetHeight('editProfileContainer', 'edit_profile_area');
	setExtraMarginForAndroid('editProfileBottomId');
}

/********************************************************************************************
' Name                 :   getUserProfile
' Return type          :   None
' Input Parameter(s)   :   showProgressBarBool, successResponseHandlerMethod, isAddEditBiller
' Purpose              :   This method is used to call the USER PROFILE API.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function getUserProfile(showProgressBarBool, successResponseHandlerMethod, isAddEditBiller) {
	if (showProgressBarBool) {
		$('#progbarId').show();
	}
	
	/* hold request parameters and values for request parameters */ 
	var request = {};
	request.userId = eval(getCookie("userId"));
	request.applicationId = applicationId;
	request.locale = getCookie("locale");

	var call_user_get_profile = new user_get_profile(request, successResponseHandlerMethod, isAddEditBiller);
	call_user_get_profile.call();
}

/********************************************************************************************
' Name                 :   getUserProfileForUpdateProfile
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method handle the success response of GET_PROFILE api and show the edit
'                          profile form to user with pre populate old data
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function getUserProfileForUpdateProfile() {

	if(user_get_profile_obj){
		var firstName = user_get_profile_obj.user.firstName;
		var lastName = user_get_profile_obj.user.lastName;
		checkEmailFeature();
		if (editEmailFlag) {
			$("#editProfile_Phone").insertAfter("#editProfile_ReEnterEmail");
		}
		/* Need to remove later on time. */ 
		clearOldData();
		oldUserName = user_get_profile_obj.user.username;
		$("#editProfileUsernameLabel").text(user_get_profile_obj.user.username);
		$("#editProfileAccountPRAN").text(getFormatedAccountNumber());
		$("#editProfileFirstName").val(firstName);
		$("#editProfileLastName").val(lastName);
		if (null != user_get_profile_obj.userAddress) {
			$("#editProfileAdd1").val(user_get_profile_obj.userAddress.address1);
			$("#editProfileAdd2").val(user_get_profile_obj.userAddress.address2);
			$("#editProfileCity").val(user_get_profile_obj.userAddress.city);
			$("#editProfileState").val(user_get_profile_obj.userAddress.state);
			$("#editProfileZip").val(user_get_profile_obj.userAddress.zip);
		}
		$("#editProfilePhone").val(getFormattedPhoneNo(user_get_profile_obj.user.phone));
		$("#editProfileEmail").val(user_get_profile_obj.user.email);
		$("#editProfileReEnterEmail").val(user_get_profile_obj.user.email);

		if (firstName == messages["createAccount.firstNameInput"]) {
			$("#editProfileFirstName").val("");
		}

		if (lastName == messages["createAccount.lastNameInput"]) {
			$("#editProfileLastName").val("");
		}

		/* Show the check box for marketing Opt in */
		createOptInMsgAorBSection("chkOptInEnhEditProf", "optInEhnChkEditProf", messages['createAccount.optInEnh']);

		$("#edit_profile_area").show();

		if(user_get_profile_obj.user.marketingOptIn){
			$('#chkOptInEnhEditProf').attr("checked", true);
		}
		if(user_get_profile_obj.user.contactPreference){
			if((user_get_profile_obj.user.contactPreference).trim() === "BOTH") {
				$("#editProfilePrefredComm").val("BOTH".trim());
			} else {
				$('#editProfilePrefredComm').val((user_get_profile_obj.user.contactPreference).trim());
			}
		}
		registerBlurForEditProfile();
		setIntervalForUpdateButton();
		$("#editProfileFirstName").focus();
	}
}

/********************************************************************************************
' Name                 :   getFormatedAccountNumber
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to format the account number
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function getFormatedAccountNumber() {
	var rawAccountNumber = getCookie("userAccountNumber");
	var formatedAccountNumber = "";
	if (null != rawAccountNumber && undefined != rawAccountNumber) {
		for ( var strIndex = 0; strIndex < rawAccountNumber.length; strIndex++) {

			if (strIndex % 4 == 0) {
				// add Space
				formatedAccountNumber += " ";
			}
			formatedAccountNumber += rawAccountNumber[strIndex];
		}
	}
	return formatedAccountNumber;
}

/********************************************************************************************
' Name                 :   clearOldData
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Used to remove old data from the profile update form.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function clearOldData() {
	$("#editProfileUsernameLabel").text("");
	$("#editProfileAccountPRAN").text("");
	$("#editProfileFirstName").val("");
	$("#ep_errorFirstNameMsg").hide();
	$("#editProfileLastName").val("");
	$("#ep_errorLastNameMsg").hide();
	$("#editProfileAdd1").val("");
	$("#ep_errorAdd1Msg").hide();
	$("#editProfileAdd2").val("");
	$("#ep_errorAdd2Msg").hide();
	$("#editProfileCity").val("");
	$("#ep_errorCityMsg").hide();
	$("#editProfileZip").val("");
	$("#ep_errorZipMsg").hide();
	$("#editProfilePhone").val("");
	$("#ep_errorPhoneMsg").hide();
	$("#editProfileEmail").val("");
	$("#ep_errorEmailMsg").hide();
	$("#ep_errorEmailMsgMismatch").hide();
	$("#editProfileReEnterEmail").val("");
	$("#ep_errorEmailMsgReEnter").hide();
	$("#editProfileOldPassword").val("");
	$("#ep_errorOldPwdMsg").hide();
	$("#editProfileNewPassword").val("");
	$("#ep_errorNewPwdMsg").hide();
	$("#ep_errorNewPwdMsgMismatch").hide();
	$("#ep_errorNewPwdMsgReEnter").hide();
	$('#mob_ErrorMsgContainer').hide();
	$("#editProfileSecurityAnswer").val("");
	$("#ep_errorSecurityAnswer").hide();

	// Hide error message for mobile when page load.
	$(".mobErorMsgSpan").val("");
	$("#ep_errorZipMsg_mob").hide();
	$("#ep_errorFirstNameMsg_mob").hide();
	$("#ep_errorLastNameMsg_mob").hide();
	$("#ep_errorAdd2Msg_mob").hide();
	$("#ep_errorCityMsg_mob").hide();
	$("#ep_errorPhoneMsg_mob").hide();
	$("#ep_errorEmailMsg_mob").hide();
	$("#ep_errorEmailMsgMismatch_mob").hide();
	$("#editProfileReEnterEmail_mob").hide();
	$('#mob_ErrorMsgContainer_mob').hide();
	$("#ep_errorSecurityAnswer_mob").hide();
	$("#ep_errorAdd1Msg_mob").hide();

	// show change security ans and password btn
	$("#editProfileOldPassword").removeClass("error_red_border");
	$("#editProfileZip").removeClass("error_red_border");
	$("#editProfilePhone").removeClass("error_red_border");
	$("#editProfileEmail").removeClass("error_red_border");
	$("#editProfileReEnterEmail").removeClass("error_red_border");
	$("#editProfileOldPassword").removeClass("error_red_border");
	$("#editProfileNewPassword").removeClass("error_red_border");
}

/********************************************************************************************
' Name                 :   resetApiMessageToPropertyFileMsg
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Reset error message to property file message
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function resetApiMessageToPropertyFileMsg() {
	$("#ep_errorFirstNameMsg_span").text(messages['editProfile.errorMsg.firstName']);
	$("#ep_errorLastNameMsg_span").text(messages['editProfile.errorMsg.lastName']);
	$("#ep_errorAdd1Msg_span").text(messages['editProfile.errorMsg.add1']);
	$("#ep_errorAdd2Msg_span").text(messages['editProfile.errorMsg.add2']);
	$("#ep_errorCityMsg_span").text(messages['editProfile.errorMsg.city']);
	$("#ep_errorZipMsg_span").text(messages['editProfile.errorMsg.zip']);
	$("#ep_errorPhoneMsg_span").text(messages['editProfile.errorMsg.phone']);
	$("#ep_errorEmailMsg_span").text(messages['editProfile.errorMsg.email']);
	$("#ep_errorSecurityAnswer_span").text(messages['editProfile.errorMsg.securityAns']);
	$("#ep_errorNewPwdMsg_span").text(messages['editProfile.errorMsg.invalidNewpasswordMsg']);
	$("#ep_errorOldPwdMsg_span").text(messages['editProfile.errorMsg.invalidNewpasswordMsg']);
}

/********************************************************************************************
' Name                 :   setIntervalForUpdateButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Reset error message to property file message
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function setIntervalForUpdateButton() {
	customKeypressValidator('editProfilePhone');
	updateBtnInterval = setInterval(
			"enableDisableUpdate('edit_profile_area', 'editProfileUpdateBtn', 'editProfileUpdateBtnBtm')",
			500);
}

/********************************************************************************************
' Name                 :   enableDisableUpdate
' Return type          :   None
' Input Parameter(s)   :   frmElementDivId, updateBtnId, updateBtnIdBtm
' Purpose              :   Reset error message to property file message
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function enableDisableUpdate(frmElementDivId, updateBtnId, updateBtnIdBtm) {
	var regxObj = new Object();
	regxObj["editProfileZip"] = /^\d{5}$/;
	regxObj["editProfileEmail"] = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	regxObj["editProfileReEnterEmail"] = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
	regxObj["editProfilePhone"] = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	regxObj["editProfileFirstName"] = /^[A-Za-z0-9\- ]{0,50}$/;
	regxObj["editProfileLastName"] = /^[A-Za-z0-9\- ]{0,50}$/;
	regxObj["editProfileAdd1"] = /^[A-Za-z0-9 ]{0,50}$/;
	regxObj["editProfileAdd2"] = /^[A-Za-z0-9 ]{0,50}$/;
	regxObj["editProfileCity"] = /^[A-Za-z0-9 ]{0,50}$/;

	var buttonStatus = true;
	var $inputFields = $('#' + frmElementDivId + ' :input');
	$inputFields.each(function() {
		var regEx = regxObj[$(this).attr('id')];
		if($(this).hasClass('error_red_border')){
			buttonStatus = false;
		}
		if (regEx) {
			value = $(this).val();
			if (!regEx.test(value)) {
				buttonStatus = false;

			} else {
				if ($(this).attr('id') === "editProfileEmail") {
					if ($("#editProfileEmail").val() === $("#editProfileReEnterEmail").val()) {
						$('#ep_errorEmailMsgMismatch').hide();
					} else {
						buttonStatus = false;
					}
					if(!$("#editProfileEmail").hasClass('error_red_border')) {
						editProfileHideError("editProfileEmail", "ep_errorEmailMsg");
					}
				} else if ($(this).attr('id') === "editProfileReEnterEmail") {
					if ($("#editProfileEmail").val() === $("#editProfileReEnterEmail").val()) {
						$('#ep_errorEmailMsgMismatch').hide();
						$('#ep_errorEmailMsg').hide();
						$('#editProfileReEnterEmail').removeClass("error_red_border");
						$("#editProfileReEnterEmail").parent(0).find(".mob_error_msg").hide();
					} else {
						buttonStatus = false;
						$('#ep_errorEmailMsgReEnter').hide();
					}
				} else if ($(this).attr('id') === "editProfilePhone") {
					editProfileHideError("editProfilePhone", "ep_errorPhoneMsg");
				} else if ($(this).attr('id') === "editProfileZip") {
					editProfileHideError("editProfileZip", "ep_errorZipMsg");
				} else if ($(this).attr('id') === "editProfileFirstName") {
					editProfileHideError("editProfileFirstName", "ep_errorFirstNameMsg");
				} else if ($(this).attr('id') === "editProfileLastName") {
					editProfileHideError("editProfileLastName", "ep_errorLastNameMsg");
				} else if ($(this).attr('id') === "editProfileAdd1") {
					editProfileHideError("editProfileAdd1", "ep_errorAdd1Msg");
				} else if ($(this).attr('id') === "editProfileAdd2") {
					editProfileHideError("editProfileAdd2", "ep_errorAdd2Msg");
				} else if ($(this).attr('id') === "editProfileCity") {
					editProfileHideError("editProfileCity", "ep_errorCityMsg");
				}
			}
		}
	});
	if (buttonStatus) {
		updateBtnEnableUI(updateBtnId);
		updateBtnEnableUI(updateBtnIdBtm);
	} else {
		updateBtnDisableUI(updateBtnId);
		updateBtnDisableUI(updateBtnIdBtm);
	}
}

/********************************************************************************************
' Name                 :   showEmailMisMatchError
' Return type          :   Boolean
' Input Parameter(s)   :   emailElementId, reEnterElementId, misMatchErrorFieldId
' Purpose              :   Reset error message to property file message
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function showEmailMisMatchError(emailElementId, reEnterElementId, misMatchErrorFieldId) {
	if ($("#"+emailElementId).val() != $("#"+reEnterElementId).val()) {
		$("#"+reEnterElementId).addClass("error_red_border");
		/* put text error message into mobile error div*/
		$("#"+reEnterElementId).parent(0).find(".mob_error_msg .mobErorMsgSpan").text($('#ep_errorEmailMsgMismatch').children("span").text());
		$("#"+reEnterElementId).parent(0).find(".mob_error_msg").show();
		return false;
	} else {
		return true;
	}
}

function editProfileHideError(elementId, errorFieldId) {
	$('#' + errorFieldId).hide();
	$('#' + elementId).removeClass("error_red_border");
	$("#" + elementId).parent(0).find(".mob_error_msg").hide();
}

function updateBtnEnableUI(updateBtnId) {
	$('#' + updateBtnId).removeClass('sv_submit_inactive_btn');
	$('#' + updateBtnId).addClass('sv_submit_active_btn');
	enableButton(updateBtnId);
}

function updateBtnDisableUI(updateBtnId) {
	$('#' + updateBtnId).removeClass('sv_submit_active_btn');
	$('#' + updateBtnId).removeClass('bg_green');
	$('#' + updateBtnId).addClass('sv_submit_inactive_btn');
	disableButton(updateBtnId);
}

function registerBlurForEditProfile() {
	$("#editProfileFirstName").blur(function() {
		var blurRegEx = /^[A-Za-z0-9\- ]{0,50}$/;
		return profileGenricValidator(blurRegEx, $(this).val().trim(),"ep_errorFirstNameMsg", null, "editProfileFirstName");

	});
	$("#editProfileLastName").blur(function() {
		var blurRegEx = /^[A-Za-z0-9\- ]{0,50}$/;
		return profileGenricValidator(blurRegEx, $(this).val().trim(),
				"ep_errorLastNameMsg", null, "editProfileLastName");
	});
	$("#editProfileAdd1").blur(function() {
		var blurRegEx = /^[A-Za-z0-9 ]{0,50}$/;
		return profileGenricValidator(blurRegEx, $(this).val().trim(),
				"ep_errorAdd1Msg", null, "editProfileAdd1");
	});
	$("#editProfileAdd2").blur(function() {
		var blurRegEx = /^[A-Za-z0-9 ]{0,50}$/;
		return profileGenricValidator(blurRegEx, $(this).val().trim(),
				"ep_errorAdd2Msg", null, "editProfileAdd2");
	});
	$("#editProfileCity").blur(function() {
		var blurRegEx = /^[A-Za-z0-9 ]{0,50}$/;
		return profileGenricValidator(blurRegEx, $(this).val().trim(),
				"ep_errorCityMsg", null, "editProfileCity");
	});
	$("#editProfilePhone").blur(function() {
		if($("#editProfilePhone").val().length == 0){
			editProfileHideError("editProfilePhone","ep_errorPhoneMsg");
		} else {
			profileValidatePhone("#editProfilePhone", 'editProfilePhone');
			formatPhoneNo(this);
		}
	});
	$("#editProfileZip").blur(function() {
		if($("#editProfileZip").val().length == 0){
			editProfileHideError("editProfileZip","ep_errorZipMsg");
		} else {
			profileValidateZip("#editProfileZip", 'editProfileZip');
		}
	});
	$("#editProfileEmail").blur(function() {
		this.value = this.value.toLowerCase();
		if($("#editProfileEmail").val().length == 0){
			editProfileHideError("editProfileEmail","ep_errorEmailMsg");
		} else {
			showEmailMisMatchError("editProfileEmail","editProfileReEnterEmail","ep_errorEmailMsgMismatch");
			var blurRegEx = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
			profileGenricValidator(blurRegEx, $(this).val().trim(),"ep_errorEmailMsg", null, 'editProfileEmail');
		}
	});
	$("#editProfileReEnterEmail").blur(function() {
		this.value = this.value.toLowerCase();
		if($("#editProfileReEnterEmail").val().length == 0){
			editProfileHideError("editProfileReEnterEmail","ep_errorEmailMsgReEnter");
		} else {
			if(showEmailMisMatchError("editProfileEmail","editProfileReEnterEmail","ep_errorEmailMsgMismatch")){
				var blurRegEx = /^[a-zA-Z0-9][a-zA-Z0-9\_\.\+\-]*[a-zA-Z0-9]\@[a-zA-Z0-9][a-zA-Z0-9\.\-]*\.[a-zA-z]{2,6}/;
				profileGenricValidator(blurRegEx, $(this).val().trim(),"ep_errorEmailMsgReEnter", null,'editProfileReEnterEmail');
			}
		}
	});	
}

/**
 * Genric method validate property values against specified regular expression.
 * @param regEx
 * @param feildValue
 * @param errorFeildId
 * @param event
 * @returns {Boolean}
 */
function profileGenricValidator(regEx, fieldValue, errorFieldId, event, elementId) {
	var flag = false;
	if (regEx.test(fieldValue)) {
		$('#' + errorFieldId).hide();
		$('#' + elementId).removeClass("error_red_border");
		$("#" + elementId).parent(0).find(".mob_error_msg").hide();
		flag = true;
	} else {
		resetApiMessageToPropertyFileMsg();
		$('#' + elementId).addClass("error_red_border");
		$("#" + elementId).parent(0).find(".mob_error_msg").show();
	}
	return flag;
}

/********************************************************************************************
' Name                 :   profileValidateOnSubmit
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for validate the form and if no validation error 
'						   found call the USER_UPD_PROFILE API.  
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function profileValidateOnSubmit() {
	var fname = true;
	var lname = true;
	var add1 = true;
	var add2 = true;
	var city = true;
	var state = true;
	if ($("#editProfileFirstName").val().trim().length > 0) {
		fname = profileValidateFirstName("#editProfileFirstName");
	}

	if ($("#editProfileLastName").val().trim().length > 0) {
		lname = profileValidateLastName("#editProfileLastName");
	}

	var zip = profileValidateZip("#editProfileZip", 'editProfileZip');
	var phone = profileValidatePhone("#editProfilePhone", 'editProfilePhone');

	var email = validateDoualEnterFeilds("#editProfileEmail",
			"#editProfileReEnterEmail", "#ep_errorEmailMsg");
	
	/* Call Api Section if the below get satisfied */ 
	if (fname == true && lname == true && add1 == true && add2 == true && city == true && state == true && zip == true && phone == true && email == true) {
		/* call API to update te profile information */ 
		updateUserProfile();
	} else {
		/* this part only work in mobile to show error messages. */ 
		$("#ep_errorSecurityAnswer_span").text(messages['editProfile.errorMsg.securityAns']);
		$("#mob_ErrorMsgContainer").show();
		if (!fname) {
			$("#mob_ErrorMsgHolder").text(
					$("#ep_errorFirstNameMsg_span").text());
		} else if (!lname) {
			$("#mob_ErrorMsgHolder").text(
					$("#ep_errorLastNameMsg_span").text());
		} else if (!add1) {
			$("#mob_ErrorMsgHolder")
			.text($("#ep_errorAdd1Msg_span").text());
		} else if (!add2) {
			$("#mob_ErrorMsgHolder")
			.text($("#ep_errorAdd2Msg_span").text());
		} else if (!city) {
			$("#mob_ErrorMsgHolder")
			.text($("#ep_errorCityMsg_span").text());
		} else if (!state) {
			$("#mob_ErrorMsgHolder").text("Show State Error Message");
		} else if (!zip) {
			$("#mob_ErrorMsgHolder").text($("#ep_errorZipMsg_span").text());
		} else if (!phone) {
			$("#mob_ErrorMsgHolder").text(
					$("#ep_errorPhoneMsg_span").text());
		} else if (!email) {
			$("#mob_ErrorMsgHolder").text(
					$("#ep_errorEmailMsg_span").text());
		} 
	}
}

/********************************************************************************************
' Name                 :   validateSecurityFormOnSave
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to validate the security question form 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function validateSecurityFormOnSave(){
	var passwd = true;
	var securityAns = true;
	var newPasswd = $("#editProfileNewPassword").val().trim();
	var oldPasswd = $("#editProfileOldPassword").val().trim();

	if (oldPasswd.length == 0) {
		$("#ep_errorOldPwdMsg").hide();
	}
	if (newPasswd.length == 0) {
		$("#ep_errorNewPwdMsg").hide();
		$("#ep_errorNewPwdMsgMismatch").hide();
	}

	if (newPasswd.length > 0 || oldPasswd.length > 0) {
		var oldPasswordValidationResponse = profileValidateUserPassword("#editProfileOldPassword", "ep_errorOldPwdMsg");
		var newPasswordValidationResponse = profileValidateUserPassword("#editProfileNewPassword", "ep_errorNewPwdMsg");

		if (oldPasswordValidationResponse && newPasswordValidationResponse) {
			passwd = true;
		} else {
			passwd = false;
		}
	}

	if (oldPasswd.length == 0 && newPasswd.length > 0) {
		passwd = validateDoualEnterFeilds("#editProfileOldPassword", "#editProfileNewPassword", "#ep_errorOldPwdMsg");
	}

	var securityQuestionIndex = $('#editProfileSecurityQuestionList :selected').index();
	var securityAnswer = $("#editProfileSecurityAnswer").val().trim();
	if(!$('#showSecurityDetailsBtn').is(':visible')) {
		if (securityAnswer.length > 0) {
			securityAns = validateSecurityDetails(securityQuestionIndex, securityAnswer.length);
		}
	}

	if (passwd == true && securityAns == true) {
		updateUserProfileSecurity();
	} else {
		$("#ep_errorSecurityAnswer_span").text(messages['editProfile.errorMsg.securityAns']);
		$("#mob_ErrorMsgContainer").show();
		if (!passwd) {
			$("#mob_ErrorMsgHolder").text("Show Password Error Message ");
		} else if (!securityAns) {
			$("#mob_ErrorMsgHolder").text($("#ep_errorSecurityAnswer_span").text());
		}
	}
}

/**
 * validate first name
 *
 * @param selectedElementId
 */
function profileValidateFirstName(selectedElementId) {
	var blurRegEx = /^[A-Za-z0-9\- ]{0,50}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorFirstNameMsg", null);
}

/**
 * validate last name
 *
 * @param selectedElementId
 */
function profileValidateLastName(selectedElementId) {
	var blurRegEx = /^[A-Za-z0-9\- ]{0,50}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorLastNameMsg", null);
}

/**
 * validate address 1 for user input
 *
 * @param selectedElementId
 */
function profileValidateAddress1(selectedElementId) {
	var blurRegEx = /^[A-Za-z0-9 ]{4,50}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorAdd1Msg", null);
}

/**
 * validate address 2 input
 *
 * @param selectedElementId
 */
function profileValidateAddress2(selectedElementId) {
	var blurRegEx = /^[A-Za-z0-9 ]{4,50}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorAdd2Msg", null);
}

/**
 * validate City
 *
 * @param selectedElementId
 */
function profileValidateCity(selectedElementId) {
	var blurRegEx = /^[A-Za-z0-9 ]{4,50}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorCityMsg", null);
}

/**
 * validate ZIP code
 *
 * @param selectedElementId
 */
function profileValidateZip(selectedElementId, elementId) {
	var blurRegEx = /^\d{5}$/;
	return profileGenricValidator(blurRegEx, $(selectedElementId).val().trim(),
			"ep_errorZipMsg", null, elementId);
}

/**
 * validate phone number
 *
 * @param selectedElementId
 */
function profileValidatePhone(selectedElementId, elementId) {
	var blurRegEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	var phoneNo = $(selectedElementId).val();
	phoneNo = phoneNo.replace(/[(\)\-]/g, '');
	return profileGenricValidator(blurRegEx, phoneNo, "ep_errorPhoneMsg", null, elementId);
}

/**
 * validate the password
 *
 * @param selectedElementId
 */
function profileValidateUserPassword(selectedElementId, errorMsgDivId) {
	var blurRegEx = /^(?=\S+$).{4,20}/;
	if ($(selectedElementId).val().trim().length > 0) {
		return profileGenricValidator(blurRegEx, $(selectedElementId).val()
				.trim(), errorMsgDivId, null);
	}
	return true;
}

/**
 * validate the user input for state
 *
 * @param selectedElementIndex
 * @returns {Boolean}
 */
function profileValidateState(selectedElementIndex) {
	if (selectedElementIndex == 0) {
		$("#ep_errorStateMsg").show();
		return false;
	}
	$("#ep_errorStateMsg").hide();
	return true;
}

/**
 * This method is used to get the security questions from the cookies stored by
 * INIT_APP api call response.
 */
function getSecurityQuestions() {
	$("#editProfileSecurityQuestionList").find('option').remove();
	var securityQuestionArr = localStorage.getItem("securityQuestionArr");
	var securityQuestions = securityQuestionArr.split(",");
	var flag = true;
	var selectBox = document.getElementById('editProfileSecurityQuestionList');
	for ( var index = 0; index < securityQuestions.length; index++) {
		var option = document.createElement('option');
		if (flag && user_get_profile_obj.user.securityQuestion /*&& user_get_profile_obj.user.securityQuestion == securityQuestions[index]*/) {
			option.innerHTML = user_get_profile_obj.user.securityQuestion;
			option.setAttribute("selected", "selected");
			option.value = user_get_profile_obj.user.securityQuestion;
			flag = false;
			selectBox.appendChild(option);
		} else{
			option.innerHTML = securityQuestions[index];
			option.value = securityQuestions[index];
			if(option.value != user_get_profile_obj.user.securityQuestion){
				selectBox.appendChild(option);
			}
		}

	}
}

/**
 * This method is used to validate entry field and re-enter field and show error
 * messages.
 *
 * @param mainFeildId
 * @param reEnteryFeildId
 * @param errorMessageDivId
 * @returns {Boolean}
 */
function validateDoualEnterFeilds(mainFeildId, reEnteryFeildId,
		errorMessageDivId) {
	var mainFeildValue = $(mainFeildId).val().trim();
	var reEnteryFeildValue = $(reEnteryFeildId).val().trim();
	if (mainFeildValue == "") {
		// please Enter Email.
		$(errorMessageDivId).show();
		$(mainFeildId).addClass("error_red_border");
		return false;
	} else if (reEnteryFeildValue == "") {
		// Please enter value in ReEnter email.
		$(errorMessageDivId + "ReEnter").show();
		$(reEnteryFeildId).addClass("error_red_border");
		return false;
	} else if (mainFeildValue != reEnteryFeildValue) {
		// Value mistmatch
		$(errorMessageDivId + "Mismatch").show();
		$(mainFeildId).addClass("error_red_border");
		return false;
	}
	$(errorMessageDivId).hide();
	$(errorMessageDivId + "ReEnter").hide();
	$(errorMessageDivId + "Mismatch").hide();
	$(mainFeildId).removeClass("error_red_border");
	return true;
}

/**
 * This method is used to test the security questions and answer are filled or
 * not.
 *
 * @param securityQuestionIndex
 * @param securityAnswerLength
 * @returns {Boolean}
 */
function validateSecurityDetails(securityQuestionIndex, securityAnswerLength) {
	if (securityAnswerLength > 0) {
		$("#ep_errorSecurityAnswer").hide();
		return true;
	}
	$("#ep_errorSecurityAnswer_span").text(messages['editProfile.errorMsg.securityAns']);
	$("#ep_errorSecurityAnswer").show();
	return false;
}

/**
 * This method is used to call the USER_UPD_PROFILE API
 */
function updateUserProfile() {
	/* To show the progress bar */
	showProgressBar();

	 /*hold request parameters and values for request parameters*/
	var fname, lname;
	 /*if user doesn't enter first name put default first name*/
	if ($("#editProfileFirstName").val().trim().length == 0) {
		fname = messages["createAccount.firstNameInput"];
	} else {
		fname = $("#editProfileFirstName").val().trim();
	}
	 /*if user doesn't enter last name put default last name*/
	if ($("#editProfileLastName").val().trim().length == 0) {
		lname = messages["createAccount.lastNameInput"];
	} else {
		lname = $("#editProfileLastName").val().trim();
	}
	newUserName = $("#editProfileEmail").val().trim();
	var request = {};
	request.userId = eval(getCookie("userId"));
	request.mobilePhone = $("#editProfilePhone").val().trim();
	request.firstName = fname;
	request.lastName = lname;
	request.email = $("#editProfileEmail").val().trim();
	request.contactPreference = $("#editProfilePrefredComm").val().trim();
	request.timeZone = calculate_time_zone();
	request.address1 = replaceUnUsedChar('editProfileAdd1');
	request.address2 = replaceUnUsedChar('editProfileAdd2');
	request.city = replaceUnUsedChar('editProfileCity');

	request.state = $("#editProfileState").val().trim();
	request.zip = $("#editProfileZip").val();
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.mobileCarrierId = 5;
	if( $('#chkOptInEnhEditProf').is(":checked")){
		request.marketingOptIn  = "true";
	} else {
		request.marketingOptIn  = "false";
	}
	
	var call_user_upd_profile = new user_upd_profile(request, callFrom_constant.EDIT_PROFILE_SAVE_BTN_CALL);
	call_user_upd_profile.call();
}

function userEditProfileUpdateOnSuccess(securitySaveBtnCall){
	if (user_upd_profile_obj.user) {
		userInfoObject = {};
		userInfoObject = user_upd_profile_obj.user;
		if (user_upd_profile_obj.userAddress && user_upd_profile_obj.userAddress.zip) {
			userInfoObject.zip = user_upd_profile_obj.userAddress.zip;
		} else {
			userInfoObject.zip = null;
		}
	}
	$('#edit_profile_area').hide();
	$('#edit_profile_security_area').hide();
	navigateToProfile("#profile");
	if (!parseBoolean(initAppFeatureName["EMAIL_IS_USERNAME"])) {
		showGeneralSuccessMsg(messages['editProfile.successMsg.profileUpdated']);
	} else {
		if (newUserName && !securitySaveBtnCall) {
			setCookie("userName", newUserName);
			$('#userName').text(getCookie("userName"));
			userMailId = newUserName;
			showGeneralSuccessMsg(messages['editProfile.successMsg.profileUpdated'] + " " + newUserName);
		} else if (securitySaveBtnCall === callFrom_constant.SECURITY_SAVE_BTN_CALL) {
			showGeneralSuccessMsg(messages['editProfile.successMsg.profileUpdated']);
		}
	}
}

/********************************************************************************************
' Name                 :   checkEmailFeature
' Return type          :   boolean
' Input Parameter(s)   :   None
' Purpose              :   Check EMAIL_IS_USERNAME feature is on or off. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function checkEmailFeature() {
	var enabled = initAppFeatureName["EMAIL_IS_USERNAME"];
	if (enabled === true) {
		editEmailFlag = true;
		return;
	}
	editEmailFlag = false;
}

/********************************************************************************************
' Name                 :   allowTabout
' Return type          :   boolean
' Input Parameter(s)   :   None
' Purpose              :   This will allow tab key to tab out. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function allowTabout(kaycode) {
	if (kaycode === 8 || kaycode === 46 || kaycode === 37 || kaycode === 39
			|| kaycode === 9 || kaycode === 35 || kaycode === 36) {
		return true;
	}
	return false;
}

/********************************************************************************************
' Name                 :   isEditProfileFieldsChanged
' Return type          :   boolean
' Input Parameter(s)   :   None
' Purpose              :   This will check , if any changes is done on edit profile form. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function isEditProfileFieldsChanged(){
	var usrFNam = user_get_profile_obj.user.firstName;
	if(null === usrFNam || usrFNam === constant.DEFAULT){
		usrFNam = "";
	}
	var usrLNam = user_get_profile_obj.user.lastName;
	if(null === usrLNam || usrLNam === constant.DEFAULT){
		usrLNam = "";
	}
	var usrAdd1 = user_get_profile_obj.userAddress.address1;
	if(null === usrAdd1){
		usrAdd1 = "";
	}
	var usrAdd2 = user_get_profile_obj.userAddress.address2;
	if(null === usrAdd2){
		usrAdd2 = "";
	}
	var usrCity = user_get_profile_obj.userAddress.city;
	if(null === usrCity){
		usrCity = "";
	}
	var usrState = user_get_profile_obj.userAddress.state;
	if(null === usrState){
		usrState = "";
	}
	if($("#editProfileFirstName").val() != usrFNam){
		return true;
	} else if($("#editProfileLastName").val() != usrLNam){
		return true;
	} else if($("#editProfileAdd1").val() != usrAdd1){
		return true;
	} else if($("#editProfileAdd2").val() != usrAdd2){
		return true;
	} else if($("#editProfileCity").val() != usrCity){
		return true;
	} else if($("#editProfileState option:selected").val() != usrState){
		return true;
	} else if($("#editProfileZip").val() != user_get_profile_obj.userAddress.zip){
		return true;
	} else if($("#editProfileEmail").val() != user_get_profile_obj.user.email){
		return true;
	} else if($("#editProfileReEnterEmail").val() != user_get_profile_obj.user.email){
		return true;
	} else if($("#editProfilePhone").val().replace(/[\s\-]/g, '') != user_get_profile_obj.user.phone){
		return true;
	} else if($("#editProfilePrefredComm option:selected" ).val() != user_get_profile_obj.user.contactPreference){
		return true;
	} else if($('#chkOptInEnhEditProf').is(":checked")!= user_get_profile_obj.user.marketingOptIn){
		return true;
	}
	return false;
}
