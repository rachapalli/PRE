
/********************************************************************************************
' Name                 :   handleGetLatestBPHistory
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   To call the BP_HIST API and showing the latest payment boxes.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014	 -   Ravi Raj
'*******************************************************************************************/
function handleGetLatestBPHistory(removeFlag) {
    /* To show the progress bar */
    showProgressBar();
    var request = {};
    var endDate = "";
    var startRow = "";
    var daysBack = localStorage.getItem("maxBillPayHistoryDaysBack");
    var today = new Date();
    var past = new Date();
    past.setDate(today.getDate() - daysBack);
    request.userId = getCookie("userId");
    request.count = localStorage.getItem("count");
    request.startRow = startRow;
    request.startDate = past.valueOf();
    request.endDate = endDate;
    request.applicationId = applicationId;
    request.locale = getCookie("locale");

    var call_bp_hist = new bp_hist(request, callFrom_constant.SIDE_BAR_CALL, removeFlag);
    call_bp_hist.call();
}

/********************************************************************************************
' Name                 :   handleBpHistOnSuccess
' Return type          :   none
' Input Parameter(s)   :   callFor
' Purpose              :   This method is used for handling BP_HIST success 
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014	 -   Ravi Raj
'*******************************************************************************************/
function handleBpHistOnSuccess(callFor){
	if (callFor === callFrom_constant.SIDE_BAR_CALL || callFor === callFrom_constant.SIDE_BAR_CANCEL_CALL){
		populateSubmittedPaymentBoxes(bp_hist_obj.transactions);
		createPaymentHistoryTable(payHistFlagGlobal, billPayAccountIdSrch_Global, bp_hist_obj.transactions, isRtr_Global, true);
		
	} else if (callFor === callFrom_constant.BILL_STATUS_MOB_CANCEL_CALL){
		createHistoryTableMobile(payHistFlagGlobal, billPayAccountIdSrch_Global,isRtr_Global, billerCorpAccIdSrch_Global);
		
	} else if (callFor === callFrom_constant.BILL_STATUS_CANCEL_CALL){
		createPaymentHistoryTable(payHistFlagGlobal, billPayAccountIdSrch_Global, bp_hist_obj.transactions, isRtr_Global);
		populateSubmittedPaymentBoxes(bp_hist_obj.transactions);
		
	} else if (callFor === callFrom_constant.BILL_STATUS_CALL){
		handleScheduleAndSubmitHistOnSuccess();
	}
}

/********************************************************************************************
' Name                 :   populateSubmittedPaymentBoxes
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method populates the submitted payment boxes on the side-bar 
							of main payment page
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014	 -   Ravi Raj
'*******************************************************************************************/
function populateSubmittedPaymentBoxes(transactionDetail){
	showNoPaymentSideNote();

	$('#slide-wrap').show();
	var submittedHistoryBoxes = '';
	var xDaysInMillis = constant.ONE_DAY_IN_MILIS * localStorage.getItem("maxTranHistoryDaysBack");
	var sortedArray = transactionDetail.sort(sortByRecentDate);
	var noPaymentFlag = false;
	$.each(sortedArray, function (i, rowsetBList){
		if(isPaymentXDaysOlder(transactionDetail[i], xDaysInMillis)&& transactionDetail[i].status) {
			/*Passing values in to fillBpHistInfoInUI after Iterating.*/
			submittedHistoryBoxes += fillBpHistInfoInUI(rowsetBList.status,
														rowsetBList.accountNickname,
														rowsetBList.amount,
														i,
														rowsetBList.projectedPostingDate,
														rowsetBList.cartId,
														rowsetBList.updateDate,
														rowsetBList.expressFlag,
														rowsetBList.billPayResponseMsg);
			noPaymentFlag = true;
    	}
	});
	/* When payments are x days older then no payment appears at the side bar so need to show the side note*/
	if(!noPaymentFlag){
		if(bp_scheduled_payment_hist_obj){
			if (bp_scheduled_payment_hist_obj.scheduledTransactions.length == 0) {
				$('#inner-wrap').empty();
				/* To check the guest user and show the message to either login or create your account. */
				if (parseBoolean(localStorage.getItem("registerUser"))) {
					$('#no_payment_hist').text(formatMessage(
							messages['billStatusHistory.noBillsMessage'], localStorage.getItem("maxTranHistoryDaysBack")));
					$('#no_payment_hist').show();
				}
				$('#slide-wrap').hide();
				return;
			} else {
				$('#no_payment_hist').hide();
			}
		}
	}
	$('#inner-wrap').html(submittedHistoryBoxes);
	fixLatestPaymentAreaContentBox();
	calcHeightAndUpdateBills();
}

/********************************************************************************************
' Name                 :   sortByRecentDate
' Return type          :   {object satisfying sorting conditions}
' Input Parameter(s)   :   Any two objects from the unsorted array.
' Purpose              :   This will sort the items according to the recent dates.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   29 Aug 2014 	 -   Ravi Raj
'*******************************************************************************************/
function sortByRecentDate(transaction1, transaction2){
	var transaction1Date = 0;
	var transaction2Date = 0;
		/* Using projectedPostingDate for sorting in case of paid and pending status for transaction1*/
		if (transaction1.status === payment_status_constant.PAID || transaction1.status === payment_status_constant.PENDING){
			transaction1Date = transaction1.projectedPostingDate ? transaction1.projectedPostingDate : transaction1.updateDate;
		} else {
			transaction1Date = transaction1.updateDate ? transaction1.updateDate : transaction1.createDate;
		}
		/* Using projectedPostingDate for sorting in case of paid and pending status for transaction2*/
		if (transaction2.status === payment_status_constant.PAID || transaction2.status === payment_status_constant.PENDING){
			transaction2Date = transaction2.projectedPostingDate ? transaction2.projectedPostingDate : transaction2.updateDate;
		} else {
			transaction2Date = transaction2.updateDate ? transaction2.updateDate : transaction2.createDate;
		}
	return ((transaction1Date > transaction2Date) ? -1 : ((transaction1Date < transaction2Date) ? 1 : 0));
}

/********************************************************************************************
' Name                 :   isPaymentXDaysOlder
' Return type          :   {boolean}
' Input Parameter(s)   :   transactionDetailItem
' Purpose              :   To identify, if the posting date is within X days from current date.
							else discard those from side-bar.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   17 May 2014 	 -   Ravi Raj
'*******************************************************************************************/
function isPaymentXDaysOlder(transactionDetailItem, xDaysInMillis){
	/* get current date */ 
	var todayDateInMillis = new Date().getTime();
	/* get current date - x days */ 
	var pastXDaysDateInMillis = new Date();
	/* store past x days history records */
	pastXDaysDateInMillis = (todayDateInMillis - xDaysInMillis);
	var paymentDate = transactionDetailItem.projectedPostingDate;
	if(paymentDate === null){
		paymentDate = transactionDetailItem.updateDate;
	}
	if(paymentDate > pastXDaysDateInMillis){
		return true;
	}
	return false;
}

/********************************************************************************************
' Name                 :   fillBpHistInfoInUI
' Return type          :   {___statusBoxObj0}
' Input Parameter(s)   :   statusIcon, accountNickname, amount, delivery_date_lbl, 
							boxIndex, projectedPostingDateConverted
' Purpose              :   To fill the biller Info as per the coming status 
							from BP_HIST api for submitted paymants.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014 	 -   Ravi Raj
'*******************************************************************************************/
function fillBpHistInfoInUI(status, accountNickname, amount, boxIndex, projectedPostingDate, cartId, upateDate, isExpressFlag, billPayResponseMsg){
	var statusIcon = '',projectedPostingDateConverted = '';
    var delivery_date_lbl = '';

	if (status === payment_status_constant.PAID && (new Date().getTime()) >= projectedPostingDate){
		statusIcon = "fa fa-check fa-2x delivered_img_pos";
        projectedPostingDateConverted = convertToDatemmddyyForHistory(convertTimeToPST(projectedPostingDate));
		delivery_date_lbl = formatMessage(messages['latestPayment.delivery'],
				DOLLAR_SYMBOL + displayDefaultDecimalNumber(amount), projectedPostingDateConverted);

	}else if(status === payment_status_constant.PENDING || (status === payment_status_constant.PAID &&
			new Date().getTime() < projectedPostingDate)){
		statusIcon = "fa fa-spinner fa-2x pending_img_pos";
        projectedPostingDateConverted = convertToDatemmddyyForHistory(convertTimeToPST(projectedPostingDate));
		delivery_date_lbl = formatMessage(messages['latestPayment.pendingFor'],
				DOLLAR_SYMBOL + displayDefaultDecimalNumber(amount), projectedPostingDateConverted);
		
    } else if (status === payment_status_constant.SCHEDULED_CANCELLED) {
        statusIcon = "fa fa-ban fa-lg cancel_img_pos cursor_def_imp";
        projectedPostingDateConverted = convertToDatemmddyyForHistory(convertTimeToPST(upateDate));
		delivery_date_lbl = formatMessage(messages['latestPayment.canceledOnLabel'],
				DOLLAR_SYMBOL + displayDefaultDecimalNumber(amount), projectedPostingDateConverted);
        
    }else if (status === payment_status_constant.RETURNED) {
        statusIcon = "fa fa-mail-reply fa-lg failed_img_pos";
        projectedPostingDateConverted = convertToDatemmddyyForHistory(convertTimeToPST(upateDate));
		delivery_date_lbl = formatMessage(messages['latestPayment.failedReturn'],
				DOLLAR_SYMBOL + displayDefaultDecimalNumber(amount), projectedPostingDateConverted);
		
    }else{
		statusIcon = "fa fa-exclamation fa-lg failed_img_pos";
        projectedPostingDateConverted = convertToDatemmddyyForHistory(convertTimeToPST(upateDate));
		delivery_date_lbl = formatMessage(messages['latestPayment.failedLabel'],
				DOLLAR_SYMBOL + displayDefaultDecimalNumber(amount), projectedPostingDateConverted);
	}

    var statusBoxObj = new Object();
	var statusDiv = "<div class='payment_pending_container cursor_def_imp' id='paymentBoxWidthId" + boxIndex + "'>";
    var newHtml = '';
    var billerNameDiv = "";
    if(cartId != null){
    	/* Redirecting to the receipt view to those transactions that does have the receipt id in BP_HIST transaction object*/
    	statusDiv = "<div class='payment_pending_container' id='paymentBoxWidthId" + boxIndex + "' onclick=\"navigateToReceiptView('" 
        					+ cartId+ "',false)\">";
    }else if(billPayResponseMsg && cartId === null && 
    		status != payment_status_constant.SCHEDULED_CANCELLED){
    	/* Showing pop up for those payments that are failed due to some technical reasons and not canceled by the user.*/
    	statusDiv = "<div class='payment_pending_container' id='paymentBoxWidthId" + boxIndex + "' onclick=\"schedulePayFailedPopup('" 
    						+ billPayResponseMsg + "')\">";
    }
    statusDiv += "<i class='" + statusIcon + "'></i>"; 
	statusBoxObj.statusDiv = statusDiv;
	billerNameDiv = "<div class='payment_pending_headingtxt'>"
					+ "<span class='sdbar_text'>"
					+ accountNickname
					+ "</span>";
	if(isExpressFlag){
		billerNameDiv += "<span class='fa fa-bolt expressview_bill_status'></span>";	
	}
	billerNameDiv  += "</div>"
					+ "<div class='defpay_pd_txt_rght'>"
					+ delivery_date_lbl
					+ "</div>";
			
		statusBoxObj.billerNameDiv = billerNameDiv;
		newHtml = statusBoxObj.statusDiv;
		newHtml = newHtml + statusBoxObj.billerNameDiv;
		/*newHtml = newHtml + statusBoxObj.postDate;*/
		newHtml = newHtml + "</div>" + "<div class='clear'></div>";
	return newHtml;
}

/********************************************************************************************
' Name                 :   fixLatestPaymentAreaContentBox
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To adjust the no of latest payment boxes as per screen size for Standard width.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014 	 -   Ravi Raj
'*******************************************************************************************/
function fixLatestPaymentAreaContentBox() {
    var marginLeft = 2;
    if (null != document.getElementById("latest_payment_area") &&
            null != document.getElementById("paymentBoxWidthId0")) {
        var showNumberOfBoxes = parseInt((document.getElementById("latest_payment_area").offsetWidth - 7) /
                                                 (document.getElementById("paymentBoxWidthId0").offsetWidth +
                                                         marginLeft));
        for (var index = 0; index < latest_transaction_count; index++) {
            if (index < showNumberOfBoxes) {
                $("#paymentBoxWidthId" + index).show();
                continue;
            }
            $("#paymentBoxWidthId" + index).hide();
        }
    }
}

/********************************************************************************************
' Name                 :   convertToDateForddmmFormat
' Return type          :   month, day
' Input Parameter(s)   :   deliveryDate
' Purpose              :   This method is used to display MMM/DD format.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st APR, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function convertToDateForddmmFormat(deliveryDate) {
	  if (deliveryDate != null) {
	    	var months = ['Jan','Feb','Mar','Apr','May',
	    	              'Jun','Jul','Aug','Sep',
	    	              'Oct','Nov','Dec'];
	        var currentTime = new Date(deliveryDate);
	        var month = months[currentTime.getMonth()];
	        var day = currentTime.getDate();
	        if (day < 10) {
	            day = "0" + day;
	        }
	        return (month + " " + day);
	    }
}

/********************************************************************************************
' Name                 :   getReadyRequestOfBpHist
' Return type          :   request
' Input Parameter(s)   :   none
' Purpose              :   Creating a request parameter for BP_Hist.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   14Aug APR, 2014     -   Ravi Raj
'*******************************************************************************************/
function getReadyRequestOfBpHist(){
	    /* To show the progress bar */
	    showProgressBar();
	    var request = {};
	    var endDate = "";
	    var startRow = "";
	    /* we are getting maxBillPayHistoryDaysBack from the localStorage which is coming from INIT_APP  */
	    var daysBack = localStorage.getItem("maxBillPayHistoryDaysBack");
	    var today = new Date();
	    var past = new Date();
	    past.setDate(today.getDate() - daysBack);/* get the bills for the last 30 days(daysBack) */
	    startDate = past.valueOf();
	    request.userId = getCookie("userId");
	    request.count = localStorage.getItem("count");
	    request.startRow = startRow;
	    request.startDate = startDate;
	    request.endDate = endDate;
	    request.applicationId = applicationId;
	    request.locale = getCookie("locale");

	    return request;
}

/********************************************************************************************
' Name                 :   showSideBarAlerts
' Return type          :   none
' Input Parameter(s)   :   id, textId, txtMsg
' Purpose              :   Displaying sidebar alerts for failure and success notification.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   14th Aug, 2014    -   Ravi Raj
'*******************************************************************************************/
function showSideBarAlerts(id, textId, txtMsg){
	$('#' + textId).empty();/* Make empty to reset the text div */
	$('#' + textId).text(txtMsg);/* Resetting text to the side bar pop up */
	$('#' + id).show(); /* Show the side bar pop up */
}

/********************************************************************************************
' Name                 :   showNoPaymentSideNote
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Displaying the side note for registered user if there is no transactions done.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   13th Sept, 2014   -   Ravi Raj
'*******************************************************************************************/
function showNoPaymentSideNote(){
	if(bp_hist_obj && bp_scheduled_payment_hist_obj){
		if (bp_hist_obj.transactions.length == 0 && bp_scheduled_payment_hist_obj.scheduledTransactions.length == 0) {
			$('#inner-wrap').empty();
			/* To check the guest user and show the message to either login or create your account. */
			if (parseBoolean(localStorage.getItem("registerUser"))) {
				$('#no_payment_hist').text(formatMessage(
						messages['billStatusHistory.noBillsMessage'], localStorage.getItem("maxTranHistoryDaysBack")));
				$('#no_payment_hist').show();
			}
			$('#slide-wrap').hide();
			return;
		} else {
			$('#no_payment_hist').hide();
		}
	}
}