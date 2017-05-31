var ERROR_CODE_401 = 401;
var ERROR_CODE_500 = 500;
var VALIDATED = "VALIDATED";
var UNVALIDATED = "UNVALIDATED";
var NOTVALIDATED = "NOT_VALIDATED";
var applicationId = "";
var monthInChar = "";
var day = "";
var year = "";
var monthInNum = "";

var selectPayAreaLayout;
var isMainPaymentPageNeedToRefresh = false;
var portraitScreenHeight, landscapeScreenHeight;
var bAccount = false;
var bGetUserProfile = false;
var bCartHist = false;
var bGetCart = false;
var bpSchedPay = false;
var bCartReceipt = false;
var apiSuccessCountDown;
var isInitMainPage = false;
var lastPromoCode = "";
var timeOutForSucess,timeOutForError;
var timeForTimer = 60000;

$(document).ready(function () {
    /* Hiding the add money and locator tag on page load. */
	var user = parseBoolean(localStorage.getItem("registerUser"));
	 if(!user){
		 $("#activityIcon").addClass('mob_tab_inv');
	 }
    /*  work for iPhone, iPad, iPod.*/
    if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
        $("#mainPageContainer").click(function (event) {
            if (isClickedOnMyAccountSection) {
                isClickedOnMyAccountSection = false;
            } else if ($('.list_details').is(":visible")) {
                myAccount();
            } else if ($('#loginPageGorGuest').is(":visible")) {
                showLoginAsPopupForGuest();
            }
        });
    } else {
        $(document).click(function (event) {
            if (isClickedOnMyAccountSection) {
                isClickedOnMyAccountSection = false;
            } else if ($('.list_details').is(":visible")) {
                myAccount();
            } else if ($('#loginPageGorGuest').is(":visible")) {
                showLoginAsPopupForGuest();
            }
        });
    }
    
    $("#f input").filter(":text").keydown(function (event) {
        if (event.keyCode == 13) {
            $(this).nextAll().eq(0).click();
        }
    });
    
    $('#popupErrorId').click(function(){
    	closeAnimatedPopup('popupErrorId', 'credPopupErrorId');
    	restartTimerForPopUp();
    });

    $('#popupNoErrorId').click(function(){
    	closeAnimatedPopup('popupNoErrorId', 'credPopupNoErrorId');
    	restartTimerForPopUp();
    });
    
    $('#mainIdForBillFailed').click(function(){
    	closeAnimatedPopup('mainIdForBillFailed', 'forAnimated');
    });

    mobileKeyboardFooterToggle();

});

/**
 * Used for reading properties files data and assign it to local variables.
 * @param messages
 */
function init_messages(_applicationId, messages, billerCorpId, utmSource, utmCampaign) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        var ieVersion = new Number(RegExp.$1); // capture x.x portion and store as a number
        if (ieVersion < 8) {
            $('#topMainHeadBg').hide();
            $('#mainPageContainer').hide();
            /* To hide the progress bar */
            hideProgressBar();
            return;
        }
    }
    applicationId = _applicationId;
    disableTouchOnPopContainer();
    $("#locator_tag").hide();
    $("#add_money_tag").hide();
	setUtmDataFromQueryStringToCookie(utmSource, utmCampaign);
    
    lastWindowWidth = $(window).width();
    lastWindowHeight = $(window).height();

    if (!checkForInitAppCall()) {
    	var call_init_app = new init_app(null);
    	call_init_app.call();
        
        window.location.hash = "#searchBiller";
        setIntervalForInitSuccess(billerCorpId);
    } else {
        mainPageFunction(billerCorpId);
    }
    footerForGuestAndRegister();
    var needHelp = getCookie("needHelp");
    if(needHelp){
    	$('#helpNotification').hide();
    }
}

/********************************************************************************************
 ' Name                 :   mainPageFunction
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   TO set the cookie after init api call.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
 '*******************************************************************************************/
function mainPageFunction(billerCorpId) {
	try {
		apiTimeOutVal = JSON.parse(localStorage.getItem("apiTimeOuts"));
		initAppFeatureName = JSON.parse(localStorage.getItem("featureNames"));
		footerUrlName = JSON.parse(localStorage.getItem("footerURls"));
	} catch (err) {
	}
	var pageHash = window.location.hash;
	loadRelatedHashPage(pageHash, billerCorpId);
	startSessionTimeoutTimer();
	init_main_page_simple();
	if (parseBoolean(localStorage.getItem("registerUser"))) {
		$("#accountInfoId").show();
		$("#footerEditProfile").show();
		$("#footerProfileTab").show();
	} else {
		$("#accountInfoId").hide();
		$("#signUpGuestId").show();
		setMarketingFrameOfLoginSignUp();
	}
	showHideButtons();
    mobileKeyboardFooterToggle();
}

/*******************************************************************************
 * ' Name : init_main_page_simple ' Return type : ' Input Parameter(s) : '
 * Purpose : Function is used to call main payment page api's if user id is
 * available. ' History Header : Version - Date - Developer Name ' Added By :
 * 1.0 - 17th June, 2013 - Karuna Mishra '
 ******************************************************************************/
function init_main_page_simple() {
    var userId = getCookie("userId");
    if (userId) {
        if (getCookie("sessionToken") === "null" || localStorage.getItem("apiTimeOuts") === "" ||
                localStorage.getItem("loginSessionTimeoutMs") === "") {
            moveToLoginPage();
            return;
        }
        isInitMainPage = true;
        /* Clear old values for all 5 API call objects */
        clearAllApiObjects();
        
        /* To show the progress bar */
        showProgressBar();
        setIntervalOnLoadOfHomePage();

        $('#userName').text(getCookie("userName"));
        var pageHash = window.location.hash;
        /* Used for getting biller info from add_edit_biller.js. */
        if(pageHash === '#home' || parseBoolean(localStorage.getItem("registerUser"))){
        	$("#accountInfoId").show();
            /*Disabling payment buttons*/
        	deActivateMainPaymentPageNextButton();
        	getBillerAccounts();	

            /* Used for loading the Latest payment history section from latest_payment.js
             * or cartHistory.js based on checkout flag status. */
            /* Check for Checkout feature and if enabled call Cart History. */
            if (initAppFeatureName["CHECKOUT"]) {
            	/* To check the guest user and show the message to either login or create your account. */

            	var paymentGroupId = ""; /*declaring temp variable need to be changed*/
                handleBPSchedulePaymentHist(paymentGroupId);
                handleGetLatestBPHistory();
            } else {
                handleGetLatestBPHistory();
                bpSchedPay = true;
            }
        } else {
            bAccount = true;
            bCartHist = true;
            bpSchedPay = true;
        }
        if (initAppFeatureName["CHECKOUT"]) {
        	getPendingTransactions();
        } else {
        	bGetCart = true;
        }
        if (pageHash !== '#editProfile' && pageHash !== '#profileSecurity') {
            /* Used to get the user's email id from user_profile.js.
             * false : do not show progress bar
             * null : no method need to call on success response.
             */
            getUserProfile(false, null, false);
        }

    } else {
        /* To hide the progress bar */
        hideProgressBar();
        /*$('#no_payment_hist').text(messages['latestPayment.guestUserMessage']);*/
        $('#no_payment_hist').text(formatMessage(
				messages['billStatusHistory.noBillsMessage'], localStorage.getItem("maxTranHistoryDaysBack")));
		$('#no_payment_hist').show();
    }
    set_section_height();
}


/********************************************************************************************
 ' Name                 :   showWelcomeMsgForBillerSearch
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   To move to search biller page abnd showing the appropriate message
 in slide down.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   03 Sep 2013   -   Ravi Raj
 '*******************************************************************************************/
function showWelcomeMsgForBillerSearch() {
    var userId = getCookie('userId');
    var isSignedUp = getCookie('isSignedUp');
    var message2 = "";
    if (!userId) {
        message2 = messages['guestUser.titleName'];
    } else if (isSignedUp) {
        message2 = messages['biller.noBillerSavedMsg.line1'];
        setCookie('isSignedUp', '');
    }
    if (message2) {
    	showGeneralSuccessMsg(messages['guestUser.successLoginMsg'], message2);
    }
}

/********************************************************************************************
 ' Name                 :   checkBooleanValueOfApiVariable
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   Clear the interval.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
 '*******************************************************************************************/
function checkBooleanValueOfApiVariable() {
    if (bAccount && bGetUserProfile && bCartHist &&  bGetCart && bpSchedPay) {
        clearIntervalApp(apiSuccessCountDown);
        hideProgressBar();
        isInitMainPage = false;
        apiSuccessCountDown = "";
        calcHeightAndUpdateBills();
    }
}

/********************************************************************************************
 ' Name                 :   setIntervalOnLoadOfHomePage
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   To start a timer on home page to check the init api.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   16 Aug 2013   -   Karuna Mishra
 '*******************************************************************************************/
function setIntervalOnLoadOfHomePage() {
    apiSuccessCountDown = setInterval("checkBooleanValueOfApiVariable();", 500);
}

/********************************************************************************************
 ' Name                 :   setIntervalForInitSuccess
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   To start a timer on home page to check the init api success.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   16 Aug 2013   -   Karuna Mishra
 '*******************************************************************************************/
function setIntervalForInitSuccess(billerCorpId) {
    apiSuccessCountDownOfInit = setInterval("checkBooleanValueOfInitSuccess(" + billerCorpId + ")", 500);
}

/********************************************************************************************
 ' Name                 :   checkBooleanValueOfInitSuccess
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   Clear the interval.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
 '*******************************************************************************************/
function checkBooleanValueOfInitSuccess(billerCorpId) {
    if (isInitAppCalledSuccess) {
        mainPageFunction();
        clearIntervalApp(apiSuccessCountDownOfInit);
        if(billerCorpId){
        	navigateToAddEditBiller(billerCorpId, null, null, true, false, null);
        }
    }
}

/**
 * To load the Home Screen Area on click of Home Action button and 
 * hiding the others screens regardless of which one was opened previously.
 */
function loadHomeScreenArea() {
	closeAnimatedPopup('dailyAlertPopUp', 'dailyAlertPopUpInnerDiv');
	/*Clearing promo code box if navigated to another page with errors*/
	clearPromoCodeBox();
    /* reload page when payment history page is displayed and user press home button. */ 
    if ($('#paymentReceiptInner').is(":visible") || $('#checkoutShowPaymentDetailView').is(":visible") ||
            isMainPaymentPageNeedToRefresh) {
        isMainPaymentPageNeedToRefresh = false;
        $('#paymentReceiptInner').hide();
        document.location.reload(true);
        return;
    }
    removeHomeScreenArea();
    $('#pay_bill_sec').show();
    $('#amountBarOfMainPage').show();
    requestFocus();	
    if(!timerEnableNextButton){
    	runTimerEnableNextButton();
    }
}

/**
 * To get the date as Calander format.
 * @param deliveryDate
 */
function getCalender(deliveryDate) {
    if (deliveryDate) {
        var tokens = deliveryDate.split("/");
        monthInNum = parseInt(tokens[0]);
        day = Number(tokens[1]);
        year = parseInt(tokens[2]);
    }
}

/**
 * To get the month in char from the date.
 * @param monthInNum
 * @returns {String}
 */
function getMonthName(monthInNum) {
    var str = new Array();
    str = messages['payYourBill.monthNames'].split(",");

    switch (monthInNum) {
        case 1:
            return str[0];
        case 2:
            return str[1];
        case 3:
            return str[2];
        case 4:
            return str[3];
        case 5:
            return str[4];
        case 6:
            return str[5];
        case 7:
            return str[6];
        case 8:
            return str[7];
        case 9:
            return str[8];
        case 10:
            return str[9];
        case 11:
            return str[10];
        case 12:
            return str[11];
    }
}

/**
 * For checking the input payment for billers.
 */
function inputAmtOfBillers(id) {
    $(id).each(function (i) {
        var paymentAmount = removeDollerSign($(this).find("#paymentAmount").text());
        var billPaymentId = $(this).find("#billPaymentId").val();
        $("#" + billPaymentId).val(paymentAmount);
    });
}

/**
 * To put focus to the last edited box.
 */
function requestFocus() {
    if(!/android|iPhone|iPad|iPod/i.test(navigator.userAgent) && LAST_EDIT_BOX_ID){
        $('#' + LAST_EDIT_BOX_ID).focus();
    }
}

function mainPaymentPageResize() {
    var currentWindowWidth = $(window).width();
    if (!(navigator.userAgent).match(/Android/i) || lastWindowWidth != currentWindowWidth) {
        clearTimeout(this.id);
        this.id = setTimeout(doneResizing, 500);
        lastWindowWidth = currentWindowWidth;
    }
}

/********************************************************************************************
 ' Name                 :   doneResizing
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for resizing the window contents.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   07th, August 2013    -   Ravi Raj
 '*******************************************************************************************/
function doneResizing() {
    set_section_height();
    $('.wrapper_area').addClass('lft0').removeClass('lftAuto');
    /*Setting height for confirmation popup , for close button container*/
    setHeightForCloseBtnPopup();
    /* To re-design the bill payment boxes area on window resize event for mobile width. */
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
        var pageHash = window.location.hash;
        if (pageHash === "#payment_receipt") {
            $('#fb_confir_standard').hide();
            $('#fb_confir_mobile').show();
        } else if (pageHash === "#detail") {
            $('#fb_detail_standard').hide();
            $('#fb_detail_mobile').show();
            $('#fb_return_standard').hide();
            $('#fb_return_mobile').show();
        } else if (pageHash === "#detailReceipt") {
            $('#fb_return_standard').hide();
            $('#fb_return_mobile').show();
        }
        if (parseBoolean(localStorage.getItem("registerUser"))) {
        	if(!$('#activityIcon').is(':visible')){
        		$('#activityIcon').show();
        	}
        }
        /* Only to execute when Find Your Bill is visible on Screen */
        if ($('#billerSearchInner').is(":visible")) {
            /* To create the find your bill result area for mobile width. */
            $('#resultSetArea').empty();
            if (bp_biller_corp_search_obj) {
            	if($("#searchtext").val() === ""){
            		bp_biller_corp_search_obj = null;
            	}
            	newSearchDesignForMobile();
            }
        }
        /* Only to execute when History - Bill View is visible on Screen */
        if ($('#paymentHistoryInner').is(":visible")) {
            /* To create the payment history result area for mobile width. */
            $('#paymentHistoryTableArea').empty();
            if(bp_hist_obj.transactions){
            	createHistoryTableMobile(payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
            }
            if(bp_scheduled_payment_hist_obj.scheduledTransactions){
            	createScheduledTableMobile(payHistFlagGlobal, billerCorpAccIdSrch_Global, bp_scheduled_payment_hist_obj.scheduledTransactions);
            }
        }
        /* Only to execute when History - Summary View is visible on Screen. */
        if ($('#showSummaryView').is(":visible")) {
            /* To create the History - Summary View for Mobile layout. */
            $('#summaryViewTableArea').empty();
            summaryReceiptViewForMobile(cartInfoGlobal, summaryViewGlobalObj, creditsArrayGlobal);
        }
        /* Only to execute when Confirm Receipt is visible on Screen */
        if ($('#paymentConfirmInner').is(":visible")) {
            /* To create the payment history result area for mobile width. */
            $('#pymnt_section_submit').empty();
            createReadyToSubmitArea();
        }
        return;
    }
    /*if ($('#pay_bill_sec').is(":visible")) {*/
    var pageHash = window.location.hash;
    if (pageHash === "#payment_receipt") {
        $('#fb_confir_mobile').hide();
        $('#fb_confir_standard').show();
    } else if (pageHash === "#detail") {
        $('#fb_detail_mobile').hide();
        $('#fb_return_mobile').hide();
        $('#fb_detail_standard').show();
        $('#fb_return_standard').show();
    } else if (pageHash === "#detailReceipt") {
        $('#fb_return_mobile').hide();
        $('#fb_detail_standard').show();
    }
    if (parseBoolean(localStorage.getItem("registerUser"))) {
    	if($('#activityIcon').is(':visible')){
    		$('#activityIcon').hide();
    	}
    }
    /* Only to execute when Find Your Bill is visible on Screen */
    if ($('#billerSearchInner').is(":visible")) {
        $('#preciseMatchesArea').empty();
        $('#resultSetArea').empty();
        if (bp_biller_corp_search_obj) {
        	if($("#searchtext").val() === ""){
        		bp_biller_corp_search_obj = null;
        	}
        	newSearchDesignForStandard();
        }
    }
    /* Only to execute when Payment History/Bill View is visible on Screen */
    if ($('#paymentHistoryInner').is(":visible")) {
        /* To create the payment history result area for Standard width. */
        $('#paymentHistoryTableArea').empty();
        if (bp_hist_obj.transactions) {
            createPaymentHistoryTable(payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global);
        }
        if(bp_scheduled_payment_hist_obj.scheduledTransactions){
        	createSchedulePaymentTable(payHistFlagGlobal, billerCorpAccIdSrch_Global, bp_scheduled_payment_hist_obj.scheduledTransactions);
        }//underDevelopment need to verify
    }
    /* Only to execute when Payment Receipt is visible on Screen */
    if ($('#paymentReceiptInner').is(":visible")) {
        /* To create the payment history result area for Standard width. */
        $('#pymnt_section_submit').empty();
        if (cartItemsGlobal) {
            loadPaymentReceiptTable(cartItemsGlobal);
        }
    }
    /* Only to execute when Summary View is visible on Screen */
    if ($('#showSummaryView').is(":visible")) {
        /* To create the History - Summary View for Standard width. */
        $('#summaryViewTableArea').empty();

        if (summaryViewGlobalObj && cartInfoGlobal) {
            createPaymentHistoryTableForSummary(cartInfoGlobal, summaryViewGlobalObj, creditsArrayGlobal);
        }
    }
}

/********************************************************************************************
 ' Name                 :   backfromReceitpToSummury
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for back to the detail receipt view to summary
 receipt view.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   27th, Dec 2013    -   Karuna Mishra
 '*******************************************************************************************/
function backfromReceitpToSummury() {
    if (storeHashForBack === "#history" || storeHashForBack === "#billerHistory") {
    	navigateToBillView("backToHistoryView");
    } else {
    	 bookmarks.sethash("#receipt", null);
    }
}

/********************************************************************************************
 ' Name                 :   backToSummaryView
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for back to the detail receipt view to summary
 							receipt view.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   5th, June 2013    -   Ravi Raj
 '*******************************************************************************************/
function backToSummaryView() {
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
        removeHomeScreenArea();
        $('#summaryViewTableArea').empty();
        summaryReceiptViewForMobile(cartInfoGlobal, summaryViewGlobalObj, creditsArrayGlobal);
    } else {
        removeHomeScreenArea();
        $('#summaryViewTableArea').empty();
        if (summaryViewGlobalObj && cartInfoGlobal) {
            createPaymentHistoryTableForSummary(cartInfoGlobal, summaryViewGlobalObj, creditsArrayGlobal);
        }
    }
}

/********************************************************************************************
' Name                 :   runTimerForPopUp
' Return type          :   void
' Input Parameter(s)   :   none
' Purpose              :   This method is used for show pop up and run timer for 15 or 30 seconds
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   5th, June 2013    -   UmaMaheswara rao
'*******************************************************************************************/
function restartTimerForPopUp(){
	if($('#submittReceipt').is(":visible") && $('#errorReceipt').is(":visible")) {
		timeForTimer = timeForTimer * 2;
		timeOutForSucess =	setTimeout(function() {   /* calls click event after a certain time */
			disolvePopup('submittReceipt');
		}, timeForTimer);
		timeOutForError =	setTimeout(function() {   /* calls click event after a certain time */
			disolvePopup('errorReceipt');
		}, timeForTimer);
	}
	if($('#submittReceipt').is(":visible") && $('#errorReceipt').is(":hidden")){
		timeOutForSucess =	setTimeout(function() {   /* calls click event after a certain time */
			disolvePopup('submittReceipt');
		}, timeForTimer);
	}
	if($('#submittReceipt').is(":hidden") && $('#errorReceipt').is(":visible")){
		timeOutForError =	setTimeout(function() {   /* calls click event after a certain time */
			disolvePopup('errorReceipt');
		}, timeForTimer);
	}
	if($('#successCredentialId').is(":visible")){
		timeOutForError =	setTimeout(function() {   /* calls click event after a certain time */
			disolvePopup('successCredentialId');
		}, timeForTimer);
	}
	
}

/********************************************************************************************
' Name                 :   closePopUpOnClick
' Return type          :   void
' Input Parameter(s)   :   closeBtn
' Purpose              :   This method is used to close the pop up on click of close btn
' History Header       :   Version   -   Date             	 -   Developer Name
' Added By             :   1.0       -   24, May 2014   	 -   UmaMaheswara Rao
'*******************************************************************************************/
function closePopUpOnClick(closeBtn) {
	if (closeBtn ==="generalSubmitBtnId") {
		disolvePopup('submittReceipt');
	} else if (closeBtn ==="generalErrorBtnId") {
		disolvePopup('errorReceipt');
	} else if(closeBtn ==="successForCredUpdate"){
		disolvePopup('successCredentialId');
	} else if(closeBtn ==="sideSuccessCloseId"){
		disolvePopup('sideBarAlertSuccessId');
	} else if(closeBtn ==="sideErrorCloseId"){
		disolvePopup('sideBarAlertFailureId');
	}
}

function disolvePopup(popupIdToDisolve) {
	clearTimeout(timeOutForSucess);
	clearTimeout(timeOutForError);
	clearTimeout(timeOutForErrorSlide);
	clearTimeout(timeOutForSucessSlide);
	$("#" + popupIdToDisolve).fadeOut("slow");
}

function showAnimatedPopup(parentId, popupId) {
	$('#' + parentId).show();
	$('#' + popupId).show().animate({top:'50%'},1000);
	if(popupId === "credPopupNoErrorId"){
		setHeightForCloseBtnPopup();
	}
	clearTimeout(timeOutForError);
	clearTimeout(timeOutForSucess);
	/*Fix for the Bug 4729,  popup position for android devices  */
	if(navigator.userAgent.match(/Android/i)) {
		var popupHeightcalc = $('#' + popupId).outerHeight();
		var popupWidthcalc = $('#' + popupId).outerWidth();
		$('#' + popupId).css({'margin-top' : (-popupHeightcalc/2), 'margin-left' : (-popupWidthcalc/2)});
		$('#' + popupId).css({'transform': 'none', '-webkit-transform' : 'none'});
		if(navigator.userAgent.match(/Android 4.0/i) && navigator.userAgent.match(/Chrome/i)) {
			$('#' + popupId).css('left', '50%');
		}
	}
	/* To stop scrolling background when any popup appears for design area */
	stopBackgroundScroll();
}

/********************************************************************************************
' Name                 :   closeAnimatedPopup
' Return type          :   void
' Input Parameter(s)   :   closeBtn
' Purpose              :   This method is used to close the pop up using animation
' History Header       :   Version   -   Date             	 -   Developer Name
' Added By             :   1.0       -   29, May 2014   	 -   UmaMaheswara Rao
'*******************************************************************************************/
function closeAnimatedPopup(parentId, popupId) {
	$('.wrapper_area').css('z-index','2');
	$('#' + popupId).animate({top:'-50%'},1000);/* closing pop up using animated functionality */ 
	setTimeout(function(){
		$('#' + parentId).hide();
		$('#' + popupId).hide();
        $('#popupErrorId').hide();
	}, 800);

	/* popup position for android devices */
	if( (navigator.userAgent).match(/Android/i) ) {
		var popupWidthcalc = $('#' + popupId).outerWidth();
		$('#' + popupId).css({'margin-left' : (-popupWidthcalc/2)});
		$('#' + popupId).css({'transform': 'none', '-webkit-transform' : 'none'});
	}
	restartTimerForPopUp();/* runnign time when ever user closes the confirmation summary pop up */
	startBackgroundScroll();
}

