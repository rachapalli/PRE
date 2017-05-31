/* This file is used to get the book  marks and related informastion */
var oldPaymentReceiptRequest;
var oldPaymentReceiptCartItems;
var billerHistoryArray = [];
var lastWindowWidth = 0;
var lastWindowHeight = 0;
var hashChangedCalled = true;

var bookmarks = function(){
	return {
		sethash:function(){
			/* arguments object is a local variable available within all functions. 
			 * It contains all parameters by their number: arguments[0], arguments[1] etc.*/
			var hash = arguments[0];
			var functions = arguments[1];
			var args = Array.prototype.slice.call(arguments, 2);
			window.location.href = hash;
			if(null != functions){
				/*functions(arguments);*/
				return functions.apply(this, args);
			}
		}
	};
}();

$(window).on('hashchange', function() {
	/* To hide the Footer link pop-up message on back button click. */
	if($('#footer_popup_outer').is(':visible') && "#moreinfo" !== window.location.hash){ 
		closeFooterPopup();
		return;
	}
	/* To hide the My Account drop down box on back button click. */
	if($('.list_details').is(":visible")){
		myAccount();
	} 
	if($('#loginPageGorGuest').is(":visible") ){
    	showLoginAsPopupForGuest();
    }
	if($('#showInlineSuccessMessageDiv').is(":visible") && "#success" !== window.location.hash
			&& "#error" !== window.location.hash){
		closeInlineSuccessMessage('successBackDrop');
		return;
    }
	if($('#showInlineErrorMessageDiv').is(":visible") && "#error" !== window.location.hash
			&& "#success" !== window.location.hash){
		closeInlineErrorMessage('errorBackDrop');
		if($('#pay_bill_sec').is(":visible") && LAST_EDIT_BOX_ID && !/android|iPhone|iPad|iPod/i.test(navigator.userAgent) ){ 
			$('#' + LAST_EDIT_BOX_ID).focus();
		}
		return;
    }
	if(!hashChangedCalled) {
		navigateToPageOnBrowserBack(window.location.hash);
		return;
	}
	hashChangedCalled = false;
});

/********************************************************************************************
' Name                 :   loadRelatedHashPage
' Return type          :   None
' Input Parameter(s)   :   pageHash, billerCorpId
' Purpose              :   This method is used to load the respective page on load. It will 
'						   be called only once when page starts loading.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   26 August 2013 -   Ravi Raj
'*******************************************************************************************/
function loadRelatedHashPage(pageHash, billerCorpId) {
	"#searchBiller" === pageHash ? navigateToBillerSearch(!1) :
	"#addBiller" === pageHash ? navigateToAddEditBiller(billerCorpId, null, null, true , false, null) :
	"#receipt" === pageHash ? navigateToSummaryView() : 
	"#editProfile" === pageHash ? navigateToEditProfile(callFrom_constant.CALL_EDIT_PROFILE_REFRESH) : 
	"#profile" === pageHash ? navigateToProfile() : 
	"#profileSecurity" === pageHash ? navigateToProfileSecurity(callFrom_constant.CALL_SECURITY_PROFILE_REFRESH) : 
	"#balanceDetails" === pageHash ? navigateToBalanceDetails() : 
	"#addMoney" === pageHash ? navigateToAddMoney() : 
	"#more" === pageHash ? navigateToMore() : navigateToHome();
}

/*******************************************************************************
 * ' Name 				: navigateToHome
 * ' Return type 		: None
 * ' Input Parameter(s) : None 
 * ' Purpose			: This method is used to navigate to home screen. 
 * ' History Header 	: 	Version 	- 		Date		 - 	Developer Name
 * ' Added By 			: 1.0 			- 	08 Apr 2014 	 - 	Ravi Raj '
 ******************************************************************************/
function navigateToHome() {
	clearIntervalTimers();
	var pathName = $(location).attr('pathname');
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	var fundingSourceTypes_JsonType="";
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMainPage(pathName);
		}
	}else if ($('#addPaymentCardForm').is(':visible')) {
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if (isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMainPage(pathName);
		}
	} else if ($('#edit_profile_area').is(':visible')){
		if (isEditProfileFieldsChanged()) {
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMainPage(pathName);
		}
	} else if ($('#edit_profile_security_area').is(':visible')) {
		if (isUserSecurityFieldsChanged()) {
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMainPage(pathName);
		}
	} else{
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToMainPage(pathName);
	}	    /*mainPaymentPageResize();*/
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToMainPage(pathName);
	});
}

/*******************************************************************************
 * ' Name 				: moveToMainPage
 * ' Return type 		: None
 * ' Input Parameter(s) : pathName 
 * ' Purpose			: This method is used to navigate to home screen. 
 * ' History Header 	: 	Version 	- 		Date		 - 	Developer Name
 * ' Added By 			: 1.0 			- 	08 Apr 2014 	 - 	Ravi Raj '
 ******************************************************************************/
function moveToMainPage(pathName) {
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#home';
		return;
	}
	hashChangedCalled = true;
	makeActiveTab('footerHomeTab');
	bookmarks.sethash("#home", loadHomeScreenArea);
}
/********************************************************************************************
' Name                 :   navigateToBillerSearch
' Return type          :   None
' Input Parameter(s)   :   boolean clearScreen
' Purpose              :   This method is used to navigate to biller search screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   08 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToBillerSearch(clearScreen) {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	hashChangedCalled = true;
	makeActiveTab('footerHomeTab');
	bookmarks.sethash('#searchBiller', loadFindBill, clearScreen);
}

/********************************************************************************************
' Name                 :   navigateToAddEditBiller
' Return type          :   None
' Input Parameter(s)   :   String billerCorpId, String programId, boolean isAdd, 
'							boolean isMsg, String nickName, String msgType
' Purpose              :   This method is used to navigate to add/edit biller screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   08 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToAddEditBiller(billerCorpId, programId, billerCorpAcctId, isAdd, isMsg, msgType) {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	makeActiveTab('footerHomeTab');
	bookmarks.sethash('#addBiller', loadAddEditBill, billerCorpId, programId, billerCorpAcctId, isAdd, isMsg, msgType);
    mainPaymentPageResize();
}

/********************************************************************************************
' Name                 :   navigateToAuxiliaryBiller
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate to auxiliary biller screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   08 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToAuxiliaryBiller(addBill) {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	makeActiveTab('footerHomeTab');
	bookmarks.sethash('#auxiliaryAddEditBiller', showRemitBillersList, addBill);
}

/********************************************************************************************
' Name                 :   navigateToCheckout
' Return type          :   None
' Input Parameter(s)   :   double creditsAppliedAmount, double subTotalAmount
' Purpose              :   This method is used to navigate to Checkout screen to complete 
'							the payment transaction.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   08 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToCheckout() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	hashChangedCalled = true;
	makeActiveTab('footerHomeTab');
	bookmarks.sethash("#checkout", loadCheckoutScreen);
    mainPaymentPageResize();
}

/********************************************************************************************
' Name                 :   navigateToBillView
' Return type          :   None
' Input Parameter(s)   :   boolean flag, String accountNickname
' Purpose              :   This method is used to navigate to bill view screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToBillView(flag, billPayAccountId, rtr, billerCorpAccId) {
	
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	makeActiveTab();
	var fundingSourceTypes_JsonType="";
	/*Clearing promo code box if navigated to another page with errors*/
	clearPromoCodeBox();
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* If the user clicked on history button in particular biller box */
			if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
				seeMoreBillBtnFlag_global = true;
			}
			if(flag){
				if(!billPayAccountId && !billerCorpAccId){
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
				}else {
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
				}
			} else { /* To show the entire bill view history */
				hashChangedCalled = true;
				bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
			}
		}
	} else if ($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			/* If the user clicked on history button in particular biller box */
			if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
				seeMoreBillBtnFlag_global = true;
			}
			if(flag){
				if(!billPayAccountId && !billerCorpAccId){
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
				}else {
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
				}
			} else { /* To show the entire bill view history */
				hashChangedCalled = true;
				bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
			}
		}
	} else if($('#edit_profile_area').is(':visible')){
		if(isEditProfileFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* If the user clicked on history button in particular biller box */
			if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
				seeMoreBillBtnFlag_global = true;
			}
			if(flag){
				if(!billPayAccountId && !billerCorpAccId){
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
				}else {
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
				}
			} else { /* To show the entire bill view history */
				hashChangedCalled = true;
				bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
			}
		}
	} else if($('#edit_profile_security_area').is(':visible')){
		if(isUserSecurityFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* If the user clicked on history button in particular biller box */
			if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
				seeMoreBillBtnFlag_global = true;
			}
			if(flag){
				if(!billPayAccountId && !billerCorpAccId){
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
				}else {
					bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
				}
			} else { /* To show the entire bill view history */
				hashChangedCalled = true;
				bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
			}
		}
	} else{
		/* If the user clicked on history button in particular biller box */
		if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
			seeMoreBillBtnFlag_global = true;
		}
		if(flag){
			if(!billPayAccountId && !billerCorpAccId){
				bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
			}else {
				bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
			}
		} else { /* To show the entire bill view history */
			hashChangedCalled = true;
			bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
		}
	}
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		/* If the user clicked on history button in particular biller box */
		if(!($(window).width()> minimumWindowWidthForMobile) && billPayAccountId === "seeMoreBillsClick"){/*using billPayAccountId as a flag here when click on see more btn from sidebar*/
			seeMoreBillBtnFlag_global = true;
		}
		if(flag){
			if(!billPayAccountId && !billerCorpAccId){
				bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global);
			}else {
				bookmarks.sethash('#billerHistory',loadPaymentHistoryTable, flag, billPayAccountId, rtr, billerCorpAccId);			
			}
		} else { /* To show the entire bill view history */
			hashChangedCalled = true;
			bookmarks.sethash('#history', loadPaymentHistoryTable, flag, billPayAccountId, rtr);
		}
	});
}

/********************************************************************************************
' Name                 :   navigateToSummaryView
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate to summary receipt(Receipt) screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToSummaryView() {
	clearIntervalTimers();
	var pathName = $(location).attr('pathname');
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	var fundingSourceTypes_JsonType="";
	/*Clearing promo code box if navigated to another page with errors*/
	clearPromoCodeBox();
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToReceiptPage(pathName);
		}
	}else if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToReceiptPage(pathName);
		}
	} else if($('#edit_profile_area').is(':visible')){
		if(isEditProfileFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToReceiptPage(pathName);
		}
	} else if($('#edit_profile_security_area').is(':visible')){
		if(isUserSecurityFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToReceiptPage(pathName);
		}
	} else{
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToReceiptPage(pathName);
	}
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToReceiptPage(pathName);
	});
}

function moveToReceiptPage(pathName) {
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#receipt';
		return;
	}
	hashChangedCalled = true;
	makeActiveTab('footerReceiptTab');
	bookmarks.sethash("#receipt", summaryReceiptViewForUser);
}

/********************************************************************************************
' Name                 :   navigateToReceiptView
' Return type          :   None
' Input Parameter(s)   :   cartId, showPaymentSummary, flag
' Purpose              :   This method is used to navigate to home screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToReceiptView(cartId, showPaymentSummary, flag) {
	clearIntervalTimers();
	/*Storing the value of current hash*/
	storeHashForBack = window.location.hash;
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	makeActiveTab('footerReceiptTab');
	bookmarks.sethash("#detail", detailReceiptViewForUser, cartId, showPaymentSummary, flag);
}

/********************************************************************************************
' Name                 :   navigateToEditProfile
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate to edit profile screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToEditProfile(callFromRefresh) {
	var pathName = $(location).attr('pathname');
	removeMessageFromDivId();
	/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#editProfile';
		return;
	}
	makeActiveTab('footerProfileTab');
	bookmarks.sethash("#editProfile", loadEditProfilePage, callFromRefresh);
}

function navigateToProfile(hash) {
	clearIntervalTimers();
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	/*Clearing promo code box if navigated to another page with errors*/
	clearPromoCodeBox();
	var pathName = $(location).attr('pathname');
	var fundingSourceTypes_JsonType="";
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToProfilePage(pathName, hash);
		}
	} else if ($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			moveToProfilePage(pathName, hash);
		}
	} else if($('#edit_profile_area').is(':visible')){
		if(isEditProfileFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToProfilePage(pathName, hash);
		}
	} else if($('#edit_profile_security_area').is(':visible')){
		if(isUserSecurityFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToProfilePage(pathName, hash);
		}
	} else{
		moveToProfilePage(pathName, hash);
	}
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		moveToProfilePage(pathName, hash);
	});
	
}

function moveToProfilePage(pathName, hash) {
	$('#addPaymentCardForm').remove();
	/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#profile';
		return;
	}
	if(hash === "#profileSecurity"){
		clearInterval(securitySaveBtnInterval);
	} else if(hash === "#editProfile"){
		clearInterval(updateBtnInterval);
	}
	makeActiveTab('footerProfileTab');
	bookmarks.sethash("#profile", loadProfilePage);
}

function navigateToProfileSecurity(callFromRefresh) {
	removeMessageFromDivId();
	var pathName = $(location).attr('pathname');
	/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#profileSecurity';
		return;
	}
	makeActiveTab('footerProfileTab');
	bookmarks.sethash("#profileSecurity", hideOrShowSecurityDetails, callFromRefresh);
}

function navigateToManageCards(manageCardsCallForCheckOut) {
	clearIntervalTimers();
	removeMessageFromDivId();
	var pathName = $(location).attr('pathname');
	/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
	if(pathName.indexOf('locator.jsp') !== -1) {
		/* Moving to main_payment_page with #home for home(pay your bill) page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#manageCards';
		return;
	} 
	makeActiveTab('footerProfileTab');
	bookmarks.sethash("#manageCards", showDefaultPaymentCardsManage, manageCardsCallForCheckOut);
}

/********************************************************************************************
' Name                 :   navigateToLocator
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate to locator screen.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   10 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToLocator() {
	clearIntervalTimers();
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	var fundingSourceTypes_JsonType="";
	/*Clearing promo code box if navigated to another page with errors*/
	clearPromoCodeBox();
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToLocatorPage();
		}
	}else if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			moveToLocatorPage();
		}
	}else if($('#edit_profile_area').is(':visible')){
		if(isEditProfileFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToLocatorPage();
		}
	} else if($('#edit_profile_security_area').is(':visible')){
		if(isUserSecurityFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			moveToLocatorPage();
		}
	} else{
		moveToLocatorPage();
	}
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		moveToLocatorPage();
	});
}

function moveToLocatorPage() {
	hashChangedCalled = true;
	makeActiveTab('footerLocatorTab');
	location.href = 'locator.jsp?resourceAppId=' + applicationId + '#locator';
}
/********************************************************************************************
' Name                 :   navigateToMore
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to navigate to more screen in mobile width only.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   10 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToMore() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	var pathName = $(location).attr('pathname');
	var fundingSourceTypes_JsonType="";
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMorePage(pathName);
		}
	}else if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMorePage(pathName);
		}
	}else if($('#edit_profile_area').is(':visible')){
		if(isEditProfileFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMorePage(pathName);
		}
	} else if($('#edit_profile_security_area').is(':visible')){
		if(isUserSecurityFieldsChanged()){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
			moveToMorePage(pathName);
		}
	} else{
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToMorePage(pathName);
	}	    /*mainPaymentPageResize();*/
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page */
		moveToMorePage(pathName);
	});
}

function moveToMorePage(pathName) {
	if(pathName.indexOf('main_payment_page.jsp') === -1) {
		/* Moving to main_payment_page with #more for more page */
		location.href = 'main_payment_page.jsp?resourceAppId=' + applicationId + '#more';
		return;
	}
	set_section_height();
	/* Change mobile footer selection area */
	removeHomeScreenArea();
	hashChangedCalled = true;
	makeActiveTab("footerMoreTab");
	$("#mobileMoreContainer").show();
}
/********************************************************************************************
' Name                 :   navigateToErrorSlideDown
' Return type          :   None
' Input Parameter(s)   :   String activeTabid
' Purpose              :   This method is used to navigate to error slide down.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToErrorSlideDown(errorBackDropId, message, elementId) {
	bookmarks.sethash("#error", showErrorSlideDown, errorBackDropId, message, elementId);
}

/********************************************************************************************
' Name                 :   navigateToSuccessSlideDown
' Return type          :   None
' Input Parameter(s)   :   String activeTabid
' Purpose              :   This method is used to navigate to success slide down.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function navigateToSuccessSlideDown(successBackDropId, message, str) {
	bookmarks.sethash("#success", showSuccessSlideDown, successBackDropId, message, str);
}

/********************************************************************************************
' Name                 :   makeActiveTab
' Return type          :   None
' Input Parameter(s)   :   String activeTabid
' Purpose              :   This method is used to make the parameter tab id as selected 
'							and others as unselected.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   09 Apr 2014 	-   Ravi Raj
'*******************************************************************************************/
function makeActiveTab(activeTabid){
	$('#footer_div span').each(function(){
		var tabSpanId = $(this).attr('id');
		/* Get the id of the span within the footer */
		if(tabSpanId) {
			/* Make the selected active tab as active */
			if(tabSpanId === activeTabid) {
				$("#" + activeTabid).removeClass("mob_footer_inactivebtn").addClass("mob_footer_activebtn");
			} else {
				/* Checking if previously inactive class is there then remove it. */
				if($("#" + tabSpanId).hasClass( "mob_footer_inactivebtn")) {
					$("#" + tabSpanId).removeClass("mob_footer_inactivebtn");
				}
				/* Make other tab as inactive */
				$("#" + tabSpanId).removeClass("mob_footer_activebtn").addClass("mob_footer_inactivebtn");
			}
		}
	});
}

/********************************************************************************************
' Name                 :   showFAQUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Privacy Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showFAQUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo', showFooterPopup, messages['schedule_card_faq']);	
	return false;
}

/********************************************************************************************
' Name                 :   showPrivacyUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Privacy Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showPrivacyUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo', showFooterPopup, footerUrlName["FooterPrivacyUrl"]);
	return false;
}

/********************************************************************************************
' Name                 :   showHelpUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Help Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showHelpUrl(isHashValue) {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	if(isHashValue && isHashValue !== undefined){
		bookmarks.sethash('#moreinfo', showFooterPopup, footerUrlName["FooterHelpUrl"] + messages['anchor.paymentMethods']);
	}else{
		bookmarks.sethash('#moreinfo', showFooterPopup, footerUrlName["FooterHelpUrl"]);
	}
	return false;
}

/********************************************************************************************
' Name                 :   showTermsUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Terms Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showTermsUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo',showFooterPopup, footerUrlName["FooterTermsUrl"]);
	return false;
}

/********************************************************************************************
' Name                 :   showNeedHelpUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Terms Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showNeedHelpUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo',showFooterPopup, messages['gettingStartedUrl']);
	return false;
}

/********************************************************************************************
' Name                 :   showContactUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Contact Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showContactUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	$('.wrapper_area').css('z-index','inherit');
	bookmarks.sethash('#moreinfo',showFooterPopup, footerUrlName["FooterContactUrl"]);
	return false;
}

/********************************************************************************************
' Name                 :   showFeedBackUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Feedback Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   6 September 2013   -   Karuna Mishra
'*******************************************************************************************/
function showFeedBackUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	var userId = getCookie("userId");
	var registerUser = parseBoolean(localStorage.getItem("registerUser"));
	var isGuest = true;
	var email ="";
	var phone = "";
	if(registerUser && user_get_profile_obj){
		isGuest = false;
		email = user_get_profile_obj.user.email;
		phone = user_get_profile_obj.user.phone;
	}
	var url = footerUrlName["FooterFeedBackUrl"] + "?userID=" + userId + "&isGuest=" + isGuest + "&email=" + email + "&phone=" + phone;
	bookmarks.sethash('#moreinfo',showFooterPopup, url); 
	return false;
}

/********************************************************************************************
' Name                 :   showPricingUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the footer Pricing Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showPricingUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo',showFooterPopup, footerUrlName["FooterPricingUrl"]);
	return false;
}

/********************************************************************************************
' Name                 :   showMoreInfoUrl
' Return type          :
' Input Parameter(s)   :
' Purpose              :   To show the More Info Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showMoreInfoUrl() {
	removeMessageFromDivId();
	removeSuccessOrFailureStrip();
	bookmarks.sethash('#moreinfo', showFooterPopup, localStorage.getItem("userMoreInformation"));
	return false;
}

/********************************************************************************************
' Name                 :   showHelpMeFindMine
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To show the help me find for user.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   7th Nov, 2013   -   Ravi Raj
'*******************************************************************************************/
function showHelpMeFindMine() {
	bookmarks.sethash('#moreinfo', showFooterPopup, localStorage.getItem("billRemitZipUrl"));
	return false;
}

/********************************************************************************************
' Name                 :   showBillerFeedBackUrl
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To show the biller feedback Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showBillerFeedBackUrl() {
	showFooterPopup(messages['biller.findMyBiller']);
	return false;
}

/********************************************************************************************
' Name                 :   showContactUrl
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To show the footer Contact Url as pop-up by changing the hash.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   12 August 2013   -   Karuna Mishra
'*******************************************************************************************/
function showMrktOptInUrl() {
	showFooterPopup(messages['createAccount.marktngOptInUrl']);
	return false;
}

/********************************************************************************************
' Name                 :   showReceiptDisclosureUrl
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To show receipt disclosure URL by clicking on the link.
' History Header       :   Version   -   Date          -   Developer Name
' Added By             :   1.0       -   21 November 2014   -   Mohit Arya
'*******************************************************************************************/
function showReceiptDisclosureUrl() {
	showFooterPopup(messages['paymentReceipt.disclosureURL']);
	return false;
}

/********************************************************************************************
 ' Name                 :   showFooterPopup
 ' Return type          :   None
 ' Input Parameter(s)   :   Url
 ' Purpose              :   Function is used to show a pop-up on footer or other link clicks.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   31st July 2013      -   Tapan Srivastava
 '*******************************************************************************************/
function showFooterPopup(Url) {
	var iframe = document.createElement('iframe');
	iframe.frameBorder = 1;
	/*iframe.scrolling = "auto";*/
	iframe.setAttribute("id", 'footer_popup_frame');
	iframe.setAttribute("src", Url);
	iframe.setAttribute("class", 'iframe_box_area');
	if (iframe) {
		$("#footer_popup_div").append(iframe);
	}
	var iPhone5 = /(iPhone|iPad)/i.test(navigator.userAgent);
	if(iPhone5) {
		$('#footer_popup_div').addClass('popup_iphone5');
		$('#footer_popup_last').niceScroll({touchbehavior:false, horizrailenabled:false, cursorcolor:"#989898",
			cursoropacitymax:0.7, cursorwidth:6, background:"#ccc", autohidemode:false});
	} else if((navigator.userAgent).match(/Android 2/i)) {
		$('#footer_popup_inner').addClass('popup_android');
		$('#footer_popup_frame').addClass('android_iframe_box_area');
	}
	$('#footer_popup_outer').show();
	$('#footer_popup_inner').show().animate({top:'50%'}, 500);
	$('#footer_popup_frame').attr('src', Url);

	/*Fix for the Bug 4729,  popup position for android devices  */
	if(navigator.userAgent.match(/Android/i)) {
		setTimeout(function() {
			var popupHeightcalc = $('#footer_popup_inner').outerHeight();
			var popupWidthcalc = $('#footer_popup_inner').outerWidth();
			$('#footer_popup_inner').css({'margin-top' : (-popupHeightcalc/2), 'margin-left' : (-popupWidthcalc/2)});
			$('#footer_popup_inner').css({'transform': 'none', '-webkit-transform' : 'none'});
			$('#footer_popup_frame> html> body').oneFingerScroll();
		}, 1000);
	}
	/* To stop scrolling background when any popup appears for design area */
	stopBackgroundScroll();
}

/********************************************************************************************
 ' Name                 :   closeFooterPopup
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used to close a pop-up on close button click.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   31st July,2013      -   Tapan Srivastava
 '*******************************************************************************************/
function closeFooterPopup(parentId, popupId) {
	$('.wrapper_area').css('z-index','2');
	$('#' + popupId).animate({top:'-50%'},1000);/* closing pop up using animated functionality */ 
	setTimeout(function(){$('#'+parentId).hide();
		$('#' + popupId).hide();
	}, 800);
	/* Popup position for android devices */
	if( (navigator.userAgent).match(/Android/i) ) {
		var popupWidthcalc = $('#' + popupId).outerWidth();
		$('#' + popupId).css({'margin-left' : (-popupWidthcalc/2)});
		$('#' + popupId).css({'transform': 'none', '-webkit-transform' : 'none'});
	}
	$('#footer_popup_frame').remove();
	startBackgroundScroll();
}

/********************************************************************************************
' Name                 :   hidePopUpOnClickOfButton
' Return type          :   void
' Input Parameter(s)   :   none
' Purpose              :   This method is used for removing pop up container.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   29th APR, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function hidePopUpOnClickOfButton() {
	$('#credentialErrorPopUpId').hide();
}

/********************************************************************************************
' Name                 :   hideSheduleFailPopup
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to hide Schedule Fail popup.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   29th May, 2014    -   Ravi Raj
'*******************************************************************************************/

function hideSheduleFailPopup() {
	$('#scheduledPayFailedPopup').animate({top:'-50%'},1000);/* closing pop up using animated functionality */ 
	setTimeout(function(){
		$('#schedFailId').hide();
		$('#scheduledPayFailedPopup').hide();
	}, 800);
	
	/* popup position for android devices */
	if( (navigator.userAgent).match(/Android/i) ) {
		var popupWidthcalc = $('#' + popupId).outerWidth();
        $('#scheduledPayFailedPopup').css({'margin-left' : (-popupWidthcalc/2)});
        $('#scheduledPayFailedPopup').css({'transform': 'none', '-webkit-transform' : 'none'});
	}
}

function hideCredErrorPopup() {
	showProgressBar(); /* To show the progress bar */
	$('#credErrorPopId').animate({top:'-50%'},1000);/* closing pop up using animated functionality */
	$('#credErrorPopId').hide();
	$('#credentialErrorPopUpId').hide();
	setTimeout(function(){		
		/* Storing the biller boxes data into tempBillArray so that it can be populated later after BP_ACCOUNT_LITE API call */
		setTempBillArray(); 
		navigateToHome();
		getBillerAccounts();
	}, 800);
	/* popup position for android devices */
	if( (navigator.userAgent).match(/Android/i) ) {
		var popupWidthcalc = $('#' + popupId).outerWidth();
		$('#credentialErrorPopUpId').css({'margin-left' : (-popupWidthcalc/2)});
		$('#credentialErrorPopUpId').css({'transform': 'none', '-webkit-transform' : 'none'});
	}
}

/********************************************************************************************
' Name                 :   set_section_height
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Function is used to calculate the section height of window.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   7th May,2014   	 -   Ravi Raj
'*******************************************************************************************/
function set_section_height() {
	calcHeightAndUpdateBills();
	swipeCount = 0;  /* re-initializing, needed fow swipe funcitinality */
	/*mobileSwipe();*/
    /* Hide the home button on mobile width screen. */
    if ($('#pay_bill_sec').is(":visible")) {
        $('#amountBarOfMainPage').show();
    } 
    var frameHeight = getContainerHeight();
    /* Main payment page area section */
    $("#mainHolderOuter").css("height", frameHeight);
    /* Search biller area section */
    $("#searchBillerSec").css("height", frameHeight);
    /* Edit profile area section */
    $("#profile_area").css("height", frameHeight);
    /* Edit profile area section */
    $("#edit_profile_area").css("height", frameHeight);
    /* Add/Edit biller area section */
    $("#add_edit_biller_area").css("height", frameHeight);
    /* Manage card area section */
    $("#manage_card_area").css("height", frameHeight);
    /* Payment confirmation section for SV users */
    $("#pmt_cnfrm_area").css("height", frameHeight);
    /* Checkout section */
    $("#chkoutPaymentSec").css("height", frameHeight);
    /* Summary receipt section */
    $("#summaryViewAreaId").css("height", frameHeight);
    /* Detail receipt section */
	$("#detailViewAreaId").css("height", frameHeight);
    /* Bill view area section */
    $("#paymentHistoryAreaId").css("height", frameHeight);
    /* Checkout payment receipt section */
    $("#chkoutPaymentRecepit").css("height", frameHeight);
    /* Mobile more section*/
    $("#mobilMoreInner").css("height", frameHeight);
    /* Mobile Auxiliary Biller List Section */
    $("#mobilAuxListScrolableSection").css("height", frameHeight);

    /* Add money area section when Add money feature is ON */
    $("#add_money_area").css("height", frameHeight);
    /* Add money success area section when Add money feature is ON */
    $("#add_money_success_area").css("height", frameHeight);
    /* Balance detail section shown after Add money */
    $("#balanceDetail_area").css("height", frameHeight);
    
    customScrollForAndroidVersion2();

    if (window.orientation === 0 || window.orientation === 180) {
        potraitScreenHeight = $(window).height();
        landscapeScreenHeight = $(window).width();
    }
    else {
        portraitScreenHeight = $(window).width();
        landscapeScreenHeight = $(window).height();
    }
    if ($("#locatorMapInner").is(":visible")) {
        var searchArea = $(".locatorsearch").outerHeight(true);
        var mapFrameHeight = frameHeight - searchArea;
        $("#map_canvas").css("height", mapFrameHeight);
    }
}

/********************************************************************************************
 ' Name                 :   getContainerHeight
 ' Return type          :
 ' Input Parameter(s)   :   frameHeight, errorMsgDivId
 ' Purpose              :   To get the main frame size for screen to be drawn.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28 June 2013    -   Karuna Mishra
 '*******************************************************************************************/
function getContainerHeight() {
    if( /Android/i.test(navigator.userAgent) ) {
		$('input').blur();
	}
   
    var windowHeight = $(window).height();
    /*
     * outerHeight() returns the height including padding / borders to get the margins also use
     * outerHeight(true)
     */
    var h1Height = 0;
    var footerHeight = 0;
    var headerHeight = 0;
    /* Get the height for header section witnin Main Payment page. */
    headerHeight = $(".head-sec").outerHeight(true);

    /* Get the height for header section within Login or Sign up page. */
    if($(".head-sec-login").is(":visible")){
    	headerHeight = $(".head-sec-login").outerHeight(true);
    }
    /* Get the height for footer section if footer is visible like in Sign up footer is not visible so 
     * it will not be calculated for that page. */
    if($(".footer").is(":visible")) {
    	footerHeight = $(".footer").outerHeight(true);
    }

    /*
     * This code is use for get the id of div and with the help of id calculating outerHeight.
     */
    var $inputcls = $(".find_bill_bg");
    $inputcls.each(function () {
        var findBillBgId = $(this).attr("id");
        if (findBillBgId === "createProfileSec" || findBillBgId === "payBillId" ||
                findBillBgId === "searchBillId" || findBillBgId === "editProfileId" ||
                findBillBgId === "addMoneyId" || findBillBgId === "addMoneySuccessId" ||
                findBillBgId === "addEditBillerId" || findBillBgId === "paymentConfirmationId" ||
                findBillBgId === "loadLocatorId" || findBillBgId === "balanceDetailId" ||
                findBillBgId === "chkPaymentId" || findBillBgId === "summaryViewid" ||
                findBillBgId === "detailViewId" || findBillBgId === "paymentHistoryId" ||
                findBillBgId === "chkPaymentReceiptId" || findBillBgId === "paymentReceiptId" ||
                findBillBgId === "moreSecId" || findBillBgId === "auxiliaryPageId" || 
                findBillBgId === "manageCardId" || findBillBgId === "profileId" ||
                findBillBgId === "editProfileSecurityId") {
            var div_ht = $("#" + findBillBgId).outerHeight(true);
            if (div_ht > 0 && $("#" + findBillBgId).is(':visible')) {
                h1Height = div_ht;
            }
        }
    });
    var frameHeight = windowHeight - (headerHeight + h1Height + footerHeight);
    return frameHeight;
}

/********************************************************************************************
' Name                 :   customScrollForAndroidVersion2
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Function is used to allow scrolling on Android browsers.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   7th May,2014   	 -   Ravi Raj
'*******************************************************************************************/
function customScrollForAndroidVersion2() {
    if ((navigator.userAgent).match(/Android 2/i)) {
        $('#mainHolderOuter').oneFingerScroll();
        $("#searchBillerSec").oneFingerScroll();
        $("#profile_area").oneFingerScroll();
        $("#edit_profile_area").oneFingerScroll();
        $("#add_money_area").oneFingerScroll();
        $("#add_money_success_area").oneFingerScroll();
        $("#add_edit_biller_area").oneFingerScroll();
        $("#manage_card_area").oneFingerScroll();
        $("#pmt_cnfrm_area").oneFingerScroll();
        $("#balanceDetail_area").oneFingerScroll();
        $("#chkoutPaymentSec").oneFingerScroll();
        $("#summaryViewAreaId").oneFingerScroll();
        $("#detailViewAreaId").oneFingerScroll();
        $("#paymentHistoryAreaId").oneFingerScroll();
        $("#chkoutPaymentRecepit").oneFingerScroll();
        $("#mobilMoreInner").oneFingerScroll();
        $("#mobilAuxListScrolableSection").oneFingerScroll();
        $(".cred_popup").oneFingerScroll();
    }
}

/********************************************************************************************
' Name                 :   schedulePayFailedPopupContainer
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to genrate unique id.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   26th Sep, 2013   	 -   Ravi Raj
'*******************************************************************************************/
function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
	});
	return uuid;
}

function navigateToPageOnBrowserBack(pageHash) {
	/* Page hash is matcheed to corresponding String then call respective methods */
	"#home" === pageHash ? navigateToHome() :
	"#searchBiller" === pageHash ? navigateToBillerSearch(!1) : 
	"#addBiller" === pageHash ? (removeHomeScreenArea(), $("#addEditBillerInner").show()) : 
	"#checkout" === pageHash ? navigateToCheckout() : 
	"#receipt" === pageHash ? navigateToSummaryView() : 
	"#history" === pageHash ? navigateToBillView(!1) : 
	"#more" === pageHash && navigateToMore();
	hashChangedCalled = !1; /* Setting False to boolean variable */
}

$(window).resize(function () {
	var pathName = $(location).attr('pathname');
	/* Checking for if user clicked home tab in locator page then s/he should move to home.jsp */
	if(pathName.indexOf('home.jsp') != -1) {
		loginResize();
	}
	/* Checking for if user clicked home tab in locator page then s/he should move to create_profile.jsp */
	else if(pathName.indexOf('create_profile.jsp') != -1) {
		createProfileResize();
	} 
	/* Checking for if user clicked home tab in locator page then s/he should move to main_payment_page.jsp */
	else if(pathName.indexOf('main_payment_page.jsp') != -1) {
		refreshScrollForBillers();
		mainPaymentPageResize();
	} 
	setManageCrdButtonsHtml();
	addCardTitle();
});

var intervalForServiceFee;
var submitBtnCreateProfCountdown;
var submitBtnCreateProfDetailCountdown;
/********************************************************************************************
' Name                 :   clearIntervalTimers
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to clear timer when navigating to other page.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   29th Dec, 2014   	 -   Mohit Arya
'*******************************************************************************************/
function clearIntervalTimers() {
	if(intervalForServiceFee) {
		clearIntervalApp(intervalForServiceFee);
		intervalForServiceFee = '';
	}
	if(submitBtnCreateProfCountdown){
		clearIntervalApp(submitBtnCreateProfCountdown);
		submitBtnCreateProfCountdown = '';
	}
	if(submitBtnCreateProfDetailCountdown){
		clearIntervalApp(submitBtnCreateProfDetailCountdown);
		submitBtnCreateProfDetailCountdown = '';
	}
}

function footerForGuestAndRegister() {
	if(!parseBoolean(localStorage.getItem("registerUser"))){/*Made check for guest user */
		/*Iterating for child div id then setting CSS class for that perticular id*/
		$('#footer_div').children().each(function() {
			/* Checking div id contains footer and exclude "footerProfileTab" then remove CSS class*/
			if($(this).attr('id').indexOf['footer'] != -1 && $(this).attr('id') != 'footerProfileTab'){
				$(this).addClass('wd_mob_foot_guest');
			}
		});
	} else if(parseBoolean(localStorage.getItem("registerUser"))){/*Made check for register user */
		/*Iterating for child div id then setting CSS class for that perticular id*/
		$('#footer_div').children().each(function() {
			/* Checking div id contains footer and exclude "footerProfileTab" then remove CSS class*/
			if($(this).attr('id').indexOf['footer'] != -1 && $(this).attr('id') != 'footerProfileTab'){
				$(this).removeClass('wd_mob_foot_guest');
			}
		});
	}
}

/********************************************************************************************
' Name                 :   disableTouchOnPopContainer
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Function is used to disable the touch on black background popupContainer class on mobile devices.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   2 July, 2014   	 -   Mohit Arya
'*******************************************************************************************/
function disableTouchOnPopContainer() {
	if ('ontouchstart' in document.documentElement) {
		/* To stop scrolling background when any popup appears */
		$('.popupContainer').bind('touchstart', function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
    	/* To stop scrolling background when footer popup appears */
    	$('.overlay').bind('touchstart', function(event) {
    		event.preventDefault();
    		event.stopPropagation();
    	});
    }
}

/********************************************************************************************
' Name                 :   mainAreaIScroll
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to implement IScroll for Android 4.0 devices in main pay area section.
' History Header       :   Version   -   Date          		-   Developer Name 
' Added By             :   1.0       -   15 Jul, 2014   	-   Mohit Arya3
'*******************************************************************************************/
var mainScroll;
function mainAreaIScroll() {
	if(navigator.userAgent.match(/Android 4.0/i)) {
		mainScroll = new IScroll('#mainHolderOuter', {
			bounce: false,
			momentum: false,
			checkDOMChanges: false	
		});
	}
}

/********************************************************************************************
' Name                 :   refreshScrollForBillers
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to refresh IScroll for Android 4.0 devices in main pay area section.
' History Header       :   Version   -   Date          		-   Developer Name 
' Added By             :   1.0       -   15 Jul, 2014   	-   Mohit Arya3
'*******************************************************************************************/
function refreshScrollForBillers() {
	if(mainScroll) {
		setTimeout(function() {
			mainScroll.refresh(); 
		}, 1000);
	}
}

/********************************************************************************************
' Name                 :   stopBackgroundScroll
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Function is used to disable the touchmove on background sections when popup comes on screen.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   2 July, 2014   	 -   Mohit Arya
'*******************************************************************************************/
function stopBackgroundScroll() {
	if ('ontouchmove' in document.documentElement) {
		/* To stop scrolling background when any popup appears for design area */
		$('.row_box').bind('touchmove', function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
	}
}

/********************************************************************************************
' Name                 :   startBackgroundScroll
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Function is used to enable the touchmove on background sections when popup goes off screen.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   2 July, 2014   	 -   Mohit Arya
'*******************************************************************************************/
function startBackgroundScroll() {
	/* To start scrolling background when popup off from screen */
	$('.row_box').unbind('touchmove');
	refreshScrollForBillers();
}

/********************************************************************************************
' Name                 :   clearPromoCodeBox
' Return type          :   None
' Input Parameter(s)   :   none
' Purpose              :   Clearing the promo code box.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   2 July, 2014   	 -   Mohit Arya
'*******************************************************************************************/
function clearPromoCodeBox(){
	if($('#promoCodeDiscount3').hasClass('error_red_border')){
		$('#errorPromoCodeRes').hide();
		$('#promoCodeDiscount3').removeClass('error_red_border');
	}
	$('#promoCodeDiscount3').val("");
}
