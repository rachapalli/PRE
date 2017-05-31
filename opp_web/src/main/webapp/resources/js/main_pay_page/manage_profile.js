var securitySaveBtnInterval;

/********************************************************************************************
' Name                 :   loadProfilePage
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to load profile page and calling USER_PROFILE API.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function loadProfilePage() {
	if ($('#editcardCredPopUp').is(':visible')) {
		closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
	}
	removeHomeScreenArea();
	$('#row_box main-holder-marg').hide();
	/* Calling USER_PROFILE API on click of profile button  */
	handleGetPaymentCardsForProfile(callFrom_constant.MANAGE_CARD_FROM_MAINPAGE);
	/* Calling calculate section height then show the container */
	showScreenAndSetHeight('profileContainer', 'profile_area');
}

/********************************************************************************************
' Name                 :   handleGetPaymentCardsForProfile
' Return type          :   None
' Input Parameter(s)   :   profileConstantForChk
' Purpose              :   This method is used to call get payments card API.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   30 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function handleGetPaymentCardsForProfile(profileConstantForChk, flagForAddCard,cardType){
	showProgressBar();
	/* Following code is used for create request object for API call. */
	var request = {};
    request.locale = getCookie("locale");
    request.applicationId =applicationId.toString();
    request.userId = getCookie('userId');
    /* API call for get payment cards on profile section */
    var call_cm_get_payment_card = new cm_get_payment_card(request, profileConstantForChk, null, null, flagForAddCard, cardType);
    call_cm_get_payment_card.call();
}

/********************************************************************************************
' Name                 :   getUserProfileSection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to populate the left hand side data in profile page.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function getUserProfileSection() {
	var debitAndCreditFlag = new Object();
	debitAndCreditFlag.debitFlag = true;
	debitAndCreditFlag.creditFlag = true;
	var debitCreditCounterObj = new Object();
	debitCreditCounterObj.counterForDebit = 0;
	debitCreditCounterObj.counterForCrebit = 0;
	$('#noCardsOnFile').empty();
	var fundingSourceTypes = JSON.parse(localStorage.getItem("fundingSourceTypes"));
	designProfileLeftSideUserInfo();
	
	/* This code segment is used to draw the row for card on the basis of funding source. */
	for ( var fundingSourceTypesIndex in fundingSourceTypes) {
		var cardsSec = '';
		var creditCardSec = '';
		var cardIcon = '';
		var cardNotEligibleForSchedule = '';

		/* Getting single fundingSourceTypeObj from fundingSourceTypes array */
		var fundingSourceTypeObj = fundingSourceTypes[fundingSourceTypesIndex];
		var fundingSourceTypes_TenderType = fundingSourceTypeObj.tenderType; /* Getting tenderType for fundingSource as came in INIT_APP API */
		
		/* This code segment is checks for card and draw the card row on checkout page and show the default card section. */
		if (fundingSourceTypes_TenderType && fundingSourceTypes_TenderType.toUpperCase() 
											=== tenderTypeConstant.DEBIT && debitAndCreditFlag.debitFlag) {
			/* If INIT_APP response have any Tender type with DEBIT then make a design */
			if (cm_get_payment_card_obj) {/* If there is get payment card API response then proceed in to condition  */
				if (cm_get_payment_card_obj.paymentCards.length > 0 && cm_get_payment_card_obj.paymentCards) {
					/* if get payment card API response contains cards then proceed in side condition */
					for ( var index in cm_get_payment_card_obj.paymentCards) {
						if(cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.DEBIT){
							/* Below block is for Vista and master card icon on profile section*/
							cardIcon = getCardBrandForCard(cm_get_payment_card_obj.paymentCards[index].cardBrand);
							serviceFee = showServiceFeePercent(cm_get_payment_card_obj.paymentCards[index]);
							cardNotEligibleForSchedule = getCardEligibility(cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus);
							cardsSec += designCardSectionForDisplay(cardIcon, cardNotEligibleForSchedule, 
										cm_get_payment_card_obj.paymentCards[index].cardLastFour, serviceFee);
							$('#noCardsOnFile').text('');
							debitCreditCounterObj.counterForDebit++;
						} else if (!debitCreditCounterObj.counterForDebit){
							$('#noCardsOnFile').removeClass('mrgn_top_neg8');
							$('#noCardsOnFile').text(messages['profile.dontHaveCards']);/* if there is no cards then show no cards on file message */
						}
					}
					if (debitCreditCounterObj.counterForDebit) {
						$('#noCardsOnFile').addClass('mrgn_top_neg8');
						$('#noCardsOnFile').append(cardsSec);/* Append the cards structure to DEBIT Card section */
					}
				} else {
					$('#noCardsOnFile').removeClass('mrgn_top_neg8');
					$('#noCardsOnFile').text(messages['profile.dontHaveCards']);/* if there is no cards then show no cards on file message */
				}
			}
			debitAndCreditFlag.debitFlag = false;
		} else if (fundingSourceTypes_TenderType && fundingSourceTypes_TenderType.toUpperCase() 
													=== tenderTypeConstant.CREDIT && debitAndCreditFlag.creditFlag){
			/* If INIT_APP response have any Tender type with CREDIT then make a design */
			if (cm_get_payment_card_obj) {/* If there is get payment card API response then proceed in to condition  */
				if (cm_get_payment_card_obj.paymentCards.length > 0 && cm_get_payment_card_obj.paymentCards) {
					/* if get payment card API response contains cards then proceed in side condition */
					for ( var index in cm_get_payment_card_obj.paymentCards) {
						if(cm_get_payment_card_obj.paymentCards[index].cardType === tenderTypeConstant.CREDIT){
							cardIcon = getCardBrandForCard(cm_get_payment_card_obj.paymentCards[index].cardBrand);
							serviceFee = showServiceFeePercent(cm_get_payment_card_obj.paymentCards[index]);
							cardNotEligibleForSchedule = getCardEligibility(cm_get_payment_card_obj.paymentCards[index].cvvRequiredStatus);
							creditCardSec += designCardSectionForDisplay(cardIcon, cardNotEligibleForSchedule, 
											cm_get_payment_card_obj.paymentCards[index].cardLastFour, serviceFee);
							$('#creditProfileSection').show();
							$('#noCardsOnFileCredit').text('');
							debitCreditCounterObj.counterForCrebit++;
						} else if (!debitCreditCounterObj.counterForCrebit) {
							$('#noCardsOnFileCredit').removeClass('mrgn_top_neg8');
							$('#noCardsOnFileCredit').text(messages['profile.dontHaveCards']);/* if there is no cards then show no cards on file message */
							$('#creditProfileSection').show();
						}
					}
					if (debitCreditCounterObj.counterForCrebit) {
						$('#noCardsOnFileCredit').addClass('mrgn_top_neg8');
						$('#noCardsOnFileCredit').append(creditCardSec);/* Append the cards structure to CREDIT Card section */
					}
				} else {
					$('#noCardsOnFileCredit').removeClass('mrgn_top_neg8');
					$('#noCardsOnFileCredit').text(messages['profile.dontHaveCards']);/* if there is no cards then show no cards on file message */
					$('#creditProfileSection').show();
				}
			}
			debitAndCreditFlag.creditFlag = false;
		}
	}
	$("#profile_area").show();
}

/********************************************************************************************
' Name                 :   showServiceFeePercent
' Return type          :   serviceFeeSec
' Input Parameter(s)   :   paymentCards
' Purpose              :   This method is used to calculate serviceFeePercent and returning designed section.
' History Header       :   Version   -   Date          		 -   Developer Name
' Added By             :   1.0       -   23 December 2014 	 -   UmaMaheswara Rao
'*******************************************************************************************/
function showServiceFeePercent(paymentCards) {
	var serviceFeePercent = 0;
	var serviceFeeSec = '';
	if (paymentCards.fundingPartnerFeeConfig) {
		if (paymentCards.fundingPartnerFeeConfig.serviceFeePercent > 0) {
			serviceFeePercent =  paymentCards.fundingPartnerFeeConfig.serviceFeePercent;
		}
	}
	if (serviceFeePercent > 0) {
		serviceFeeSec += '<span id="serviceFeeForProfile" class="service_fee">'
					  + formatMessage(messages['detailView.serviceFee'], serviceFeePercent)
					  + '</span>';
	} else {
		serviceFeeSec += '<span id="serviceFeeForProfile" class="service_fee">'
					  + messages['manageProfile.serviceFee']
					  + '</span>';
	}
	return serviceFeeSec;
}

/********************************************************************************************
' Name                 :   hideOrShowSecurityDetails
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for display user security popup and hide the button
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function hideOrShowSecurityDetails(callFromRefresh) {
	/* If user get profile object not exists and user refresh the page then call USER_GET_PROFILE API */
	if(!user_get_profile_obj && callFromRefresh === callFrom_constant.CALL_SECURITY_PROFILE_REFRESH){
		getUserProfile(true, securityQestionFormDesign, false);
	} else {
		securityQestionFormDesign();
	}
}

/********************************************************************************************
' Name                 :   hideOrShowSecurityDetails
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for display user security popup and hide the button
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   6 AUG 2014 	-   Ravi Raj
'*******************************************************************************************/
function securityQestionFormDesign() {
	$("#profileContainer").hide();
	$("#editProfileContainer").hide();
	/* Need to remove later on time. */ 
	clearOldData();
	showScreenAndSetHeight('editProfileSecurityContainer', 'edit_profile_security_area');
	$('#edit_profile_security_area').show();
	setExtraMarginForAndroid('editProfileSecureBottomId');/* Create extra space for Android device to pop up key board */
	/*Disabling the save button before loading the form*/
	submitBtnDisableUI('editProfileSecurityUpdateBtn');
	submitBtnDisableUI('editProfileSecurityUpdateBtnBtm');
	if(user_get_profile_obj){/* Null check for user get profile object */
		getSecurityQuestions();
	}
	registerBlurForEditProfileSecurity();
	setIntervalForSecurityUpdateButton();
	$("#editProfileOldPassword").focus();
}

/********************************************************************************************
' Name                 :   setIntervalForSecurityUpdateButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Validation code start for user profile security updates.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function setIntervalForSecurityUpdateButton() {
	securitySaveBtnInterval = setInterval("enableDisableSecuritySaveBtn('edit_profile_security_area', " +
											"'editProfileSecurityUpdateBtn',  " +
											"'editProfileSecurityUpdateBtnBtm')", 500);
}

/********************************************************************************************
' Name                 :   enableDisableSecuritySaveBtn
' Return type          :   None
' Input Parameter(s)   :   frmElementDivId, updateBtnId
' Purpose              :   This method is used for enable and disable security page save button.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function enableDisableSecuritySaveBtn(frmElementDivId, updateBtnId, updateBtnIdBtm){
	var regxObj = new Object();
	regxObj["editProfileOldPassword"] = /^(?=\S+$).{4,20}/;
	regxObj["editProfileNewPassword"] = /^(?=\S+$).{4,20}/;
	var buttonStatus = true;
	var inputFields = $('#' + frmElementDivId + ' :input');
	inputFields.each(function() {
		var regEx = regxObj[$(this).attr('id')];
		if ($(this).hasClass('error_red_border')) {
			buttonStatus = false;
		}
		if (regEx) {
			value = $(this).val();
			if (!regEx.test(value)) {
				if ($(this).attr('id') === "editProfileOldPassword" || $(this).attr('id') === "editProfileNewPassword") {
					if (value.length != 0) {
						buttonStatus = false;
					}
				}
			} else {
				if ($(this).attr('id') === "editProfileNewPassword") {
					editProfileHideError("editProfileNewPassword", "ep_errorNewPwdMsg");
				} else if ($(this).attr('id') === "editProfileOldPassword") {
					editProfileHideError("editProfileOldPassword", "ep_errorOldPwdMsg");
				}
			}
		}
	});
	if ($('#editProfileSecurityQuestionList').find('option:selected').val() && $("#editProfileSecurityAnswer").val().trim().length == 0) {
		buttonStatus = false;
		var inputFields = $('#' + frmElementDivId + ' :input');
		inputFields.each(function() {
			var regEx = regxObj[$(this).attr('id')];
			if ($(this).hasClass('error_red_border')) {
				buttonStatus = false;
			}
			if (regEx) {
				value = $(this).val();
				if (!regEx.test(value)) {
					if ($(this).attr('id') === "editProfileOldPassword" || $(this).attr('id') === "editProfileNewPassword") {
						if (value.length != 0) {
							buttonStatus = false;
						}
					}
				} else {
					if ($(this).attr('id') === "editProfileNewPassword") {
						editProfileHideError("editProfileNewPassword", "ep_errorNewPwdMsg");
					} else if ($(this).attr('id') === "editProfileOldPassword") {
						editProfileHideError("editProfileOldPassword", "ep_errorOldPwdMsg");
					}
					if (($("#editProfileOldPassword").val().length > 3)
							|| ($("#editProfileNewPassword").val().length > 3)) {
						buttonStatus = true;
					}
				}
			}
		});
	} else if($("#editProfileSecurityAnswer").val().trim().length > 0){
		$('#editProfileSecurityAnswer').removeClass("error_red_border");
		$("#ep_errorSecurityAnswer").hide();
	}
	if ((($("#editProfileOldPassword").val().length > 0) && ($("#editProfileNewPassword").val().length < 4))
			|| ($("#editProfileNewPassword").val().length > 0 && $("#editProfileOldPassword").val().length < 4)) {
		buttonStatus = false;
	}
	if (buttonStatus) {
		updateBtnEnableUI(updateBtnId);
		updateBtnEnableUI(updateBtnIdBtm);
	} else {
		updateBtnDisableUI(updateBtnId);
		updateBtnDisableUI(updateBtnIdBtm);
	}
}

/********************************************************************************************
' Name                 :   registerBlurForEditProfileSecurity
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to register blur event on security question form.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function registerBlurForEditProfileSecurity(){
	$("#editProfileOldPassword").keypress(function(e) {
		if (e.which == 96 || e.which == 59) {
			e.preventDefault();
		}
	});
	$("#editProfileOldPassword").blur(function() {
			var blurRegEx = /^(?=\S+$).{4,20}/;
			if ($(this).val().trim().length > 0) {
				profileGenricValidator(blurRegEx, $(this).val().trim(), "ep_errorOldPwdMsg", null, 'editProfileOldPassword');
			} else if ($(this).val().length == 0 && $("#editProfileNewPassword").val().length > 0) {
				$("#ep_errorOldPwdMsg").show();
			} else {
				$("#ep_errorNewPwdMsgReEnter").hide();
				$("#ep_errorNewPwdMsg").hide();
				$("#ep_errorOldPwdMsg").hide();
				$("#editProfileOldPassword").removeClass("error_red_border");
				$("#editProfileNewPassword").removeClass("error_red_border");
			}
	});
	$("#editProfileNewPassword").keypress(function(e) {
		if (e.which == 96 || e.which == 59) {
			e.preventDefault();
		}
	});
	$("#editProfileNewPassword").blur(function() {
			var blurRegEx = /^(?=\S+$).{4,20}/;
			if ($(this).val().trim().length > 0) {
				profileGenricValidator(blurRegEx, $(this).val().trim(), "ep_errorNewPwdMsg", null, 'editProfileNewPassword');
			} else if ($(this).val().length == 0 && $("#editProfileOldPassword").val().length > 0) {
				$("#ep_errorNewPwdMsg").show();
				$("#ep_errorNewPwdMsgMismatch").hide();
			} else {
				$("#ep_errorNewPwdMsgReEnter").hide();
				$("#ep_errorNewPwdMsg").hide();
				$("#ep_errorOldPwdMsg").hide();
				$("#editProfileNewPassword").remoeClass("error_red_border");
				$("#editProfileOldPassword").removeClass("error_red_border");
			}
			if ($('#ep_errorNewPwdMsgMismatch').is(":visible")) {
				$("#editProfileNewPassword").addClass("error_red_border");
			}
		});
	$("#editProfileSecurityAnswer").blur(function() {
			if ($("#editProfileSecurityAnswer").val().trim().length == 0 && $('#editProfileSecurityQuestionList')
					.find('option:selected').val() != user_get_profile_obj.user.securityQuestion) {
				$('#editProfileSecurityAnswer').addClass("error_red_border");
				/* put text error message into mobile error div */ 
				$("#editProfileSecurityAnswer").parent(0).find(".mob_error_msg .mobErorMsgSpan")
					.text($("#ep_errorSecurityAnswer").children("span").text());
				$("#editProfileSecurityAnswer").parent(0).find(".mob_error_msg").show();
			} else if ($("#editProfileSecurityAnswer").val().trim().length > 0) {
				$('#editProfileSecurityAnswer').removeClass("error_red_border");
				$("#ep_errorSecurityAnswer").hide();
			}
	});
}

/********************************************************************************************
' Name                 :   updateUserProfileSecurity
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for updating security question for security form.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 June 2014 	-   Ravi Raj
'*******************************************************************************************/
function updateUserProfileSecurity(){
	/* To show the progress bar */
	showProgressBar();
	var request = {};
	request.userId = eval(getCookie("userId"));
	request.mobilePhone = user_get_profile_obj.user.phone;
	request.firstName = user_get_profile_obj.user.firstName;
	request.lastName = user_get_profile_obj.user.lastName;
	request.email = user_get_profile_obj.user.email;
	request.contactPreference = user_get_profile_obj.user.contactPreference;
	request.currentPassword = $("#editProfileOldPassword").val();
	request.newPassword = $("#editProfileNewPassword").val();
	if ($('#editProfileSecurityQuestionList').find('option:selected').val() == user_get_profile_obj.user.securityQuestion) {
		request.newSecurityQuestion = "";
		if ($("#editProfileSecurityAnswer").val().trim()) {
			request.newSecurityAnswer = $("#editProfileSecurityAnswer").val().trim();
		} else {
			request.newSecurityAnswer = "";
		}
	} else {
		request.newSecurityQuestion = $("select#editProfileSecurityQuestionList").val();
		request.newSecurityAnswer = $("#editProfileSecurityAnswer").val().trim();
	}
	request.timeZone = calculate_time_zone();
	user_get_profile_obj.userAddress.address1 ? request.address1 = user_get_profile_obj.userAddress.address1 : request.address1 = '';
	user_get_profile_obj.userAddress.address2 ? request.address2 = user_get_profile_obj.userAddress.address2 : request.address2 = '';
	user_get_profile_obj.userAddress.city ? request.city = user_get_profile_obj.userAddress.city : request.city = '';
	user_get_profile_obj.userAddress.state ? request.state = user_get_profile_obj.userAddress.state : request.state  = '';
	request.zip = user_get_profile_obj.userAddress.zip;
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.mobileCarrierId = 5;
	$('#chkOptInEnhEditProf').is(":checked") ? request.marketingOptIn = "true" : request.marketingOptIn = "false";
	var call_user_upd_profile = new user_upd_profile(request, callFrom_constant.SECURITY_SAVE_BTN_CALL);
	call_user_upd_profile.call();
}

/********************************************************************************************
' Name                 :   isUserSecurityFieldsChanged
' Return type          :   boolean
' Input Parameter(s)   :   None
' Purpose              :   This will check , if any changes is done on profile security form. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   27 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function isUserSecurityFieldsChanged(){
	return "" != $("#editProfileOldPassword").val() 
		   || "" != $("#editProfileNewPassword").val() 
		   || "" != $("#editProfileSecurityAnswer").val() 
		   || $("#editProfileSecurityQuestionList option:selected").text() != user_get_profile_obj.user.securityQuestion ? !0 : !1;
	
}

/********************************************************************************************
' Name                 :   getCardBrandForCard
' Return type          :   cardIcon
' Input Parameter(s)   :   cardBrand
' Purpose              :   This method is used to get the card brand for the profile section. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   1st Sep 2014 	-   UmaMaheswara Rao
'*******************************************************************************************/
function getCardBrandForCard(cardBrand) {
	var cardIcon = '';
	return cardBrand === "VS" ? cardIcon = '<div class="visa_card_icon bg_size_visa_card" id=""></div>' :/* Checking for Visa type */
		   cardBrand === "MC" ? cardIcon = '<div class="master_card_icon bg_size_master_card" id=""></div>' :/* Checking for Master type */
	       cardBrand === "DS" ? cardIcon = '<div class="discover_card_icon bg_size_master_card" id=""></div>' : cardIcon;/* Checking for Discover type */
}

/********************************************************************************************
' Name                 :   designCardSectionForDisplay
' Return type          :   cardSec
' Input Parameter(s)   :   cardIcon, cardNotEligibleForSchedule, lastFour
' Purpose              :   This method is used to design card section for the profile. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   1st Sep 2014 	-   UmaMaheswara Rao
'*******************************************************************************************/
function designCardSectionForDisplay(cardIcon, cardNotEligibleForSchedule, lastFour, serviceFee) {
	var cardSec = '<div class="wid_flt100">'	 
				+  cardIcon /* Including type of card icon to the cards on file section */
				+ '<span id="cardEndingForProfile" class="card_mrgn">'
				+ formatMessage(messages['profile.cardLastFourDigit'], lastFour) /* Formatting card last four digits */
				+ '</span>'
				+ serviceFee
				+ cardNotEligibleForSchedule /* Adding In eligible message to the design if there is any */
				+ '</div>';
	return  cardSec;
}

/********************************************************************************************
' Name                 :   getCardEligibility
' Return type          :   cardNotEligibleForSchedule
' Input Parameter(s)   :   cvvRequiredStatus
' Purpose              :   This method is used to get the card eligibility for the payment Schedule. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   1st Sep 2014 	-   UmaMaheswara Rao
'*******************************************************************************************/
function getCardEligibility(cvvRequiredStatus) {
	var cardNotEligibleForSchedule = '<div class="card_info card_info_mrgn" id="cardNotEligibleForSchedule">'+messages['profile.cardNotEligibleForSchedule']
									 +'<span onclick="showFAQUrl()">'+ messages['profile.faq'] +'</span></div>';
	/* If cvvRequired status === "REQUIRED" then treat it that card as in eligible for schedule and display the message */
	return cvvRequiredStatus === cvvRequiredStatusConstant.REQUIRED ? cardNotEligibleForSchedule : '';
}

/********************************************************************************************
' Name                 :   designProfileLeftSideUserInfo
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to design left hand side user information on profile page. 
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   1st Sep 2014 	-   UmaMaheswara Rao
'*******************************************************************************************/
function designProfileLeftSideUserInfo() {
	if (user_get_profile_obj) {/* Populate the data for the left hand side section of profile page */
		$('#profileUserName').text(user_get_profile_obj.user.username);
		$('#profileEmail').text(user_get_profile_obj.user.email);
		$('#profilePhone').text(getFormattedPhoneNo(user_get_profile_obj.user.phone));	
		$('#profileZip').text(user_get_profile_obj.userAddress.zip);	
		if (user_get_profile_obj.user.contactPreference) {/* This ternary condition will check for the contact preference then display that */
			$('#profileCommunication').text(user_get_profile_obj.user.contactPreference === "BOTH" ? "SMS-EMAIL"
											: user_get_profile_obj.user.contactPreference);	
		}
		
		if (user_get_profile_obj.user.firstName) {
			user_get_profile_obj.user.firstName != "Default" ? ($('#profileFirstName').text(user_get_profile_obj.user.firstName), 
												   $('#profileFirstNameMain').show()) : $('#profileFirstNameMain').hide();
		}
		
		if (user_get_profile_obj.user.lastName) {
			user_get_profile_obj.user.lastName != "Default" ? ($('#profileLastName').text(user_get_profile_obj.user.lastName),
													 $('#profileLastNameMain').show()) : $('#profileLastNameMain').hide();
		}
		
		user_get_profile_obj.userAddress.address1 ? ($('#profileAddress1').text(user_get_profile_obj.userAddress.address1), 
													$('#profileAddress1Main').show()) : $('#profileAddress1Main').hide();
		
		user_get_profile_obj.userAddress.address2 ? ($('#profileAddress2').text(user_get_profile_obj.userAddress.address2),
													$('#profileAddress2Main').show()) : $('#profileAddress2Main').hide();
		
		user_get_profile_obj.userAddress.address2 ? ($('#profileAddress2').text(user_get_profile_obj.userAddress.address2) ,
													$('#profileAddress2Main').show()) : $('#profileAddress2Main').hide();
		
		user_get_profile_obj.userAddress.city ? ($('#profileCity').text(user_get_profile_obj.userAddress.city),
												$('#profileCityMain').show()) : $('#profileCityMain').hide();
		
		if (user_get_profile_obj.userAddress.state) {
			for(var index = 1; index <= messages['editProfile.state.code.counter']; index++){
				if(messages['editProfile.state.codeValue' + '.' + index] === user_get_profile_obj.userAddress.state){
					$('#profileState').text(messages['editProfile.state.codeOption' + '.' + index]);
				}
			}
			$('#profileStateMain').show();
		} else {
			$('#profileStateMain').hide();
		}
	}
}
