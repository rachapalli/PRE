/********************************************************************************************
Name                 :   handleBPSchedulePaymentHist
Return type          :   None
Input Parameter(s)   :   String paymentGroupId
Purpose              :   To call the BP_SCHEDULED_PAYMENT_HIST api. 
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function handleBPSchedulePaymentHist(paymentGroupId, removeFlag){
	/* To show the progress bar */
	showProgressBar();

	var request = {};
	/*Holding the request parameters to be send to BP_SCHEDULED_PAYMENT_HIST */
	request.userId = getCookie("userId");
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	if (paymentGroupId && paymentGroupId!="") {
		request.paymentGroupId = paymentGroupId;
	}
	var call_bp_scheduled_payment_hist = new bp_scheduled_payment_hist(request, callFrom_constant.SIDE_BAR_CALL, removeFlag);
	call_bp_scheduled_payment_hist.call();
}

/********************************************************************************************
Name                 :   handleBPSchedulePaymentHistOnSuccess
Return type          :   None
Input Parameter(s)   :   String callFrom
Purpose              :   This method will handle those actions that has to be performed 
on success of BP_SCHEDULED_PAYMENT_HIST.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function handleBPSchedulePaymentHistOnSuccess(callFrom){
	switch (callFrom) {
	case callFrom_constant.SIDE_BAR_CALL: {
		populateScheduledPayArea();
		break;
	}
	case callFrom_constant.BILL_STATUS_CALL: {
		/*on click of SEEMOREBILLS button on SIDEBAR*/
		handleScheduleAndSubmitHistOnSuccess();
		break;
	}
	case callFrom_constant.SIDE_BAR_CANCEL_CALL: {
		populateScheduledPayArea();
		/*on click of SEEMOREBILLS button on SIDEBAR*/
		handleScheduleAndSubmitHistOnSuccess(callFrom);
		break;
	}
	case callFrom_constant.BILL_STATUS_MOB_CANCEL_CALL: {
		createScheduledTableMobile(payHistFlagGlobal,
				billerCorpAccIdSrch_Global,
				bp_scheduled_payment_hist_obj.scheduledTransactions);
		populateScheduledPayArea();
		break;
	}
	case callFrom_constant.BILL_STATUS_CANCEL_CALL: {
		createSchedulePaymentTable(payHistFlagGlobal,
				billerCorpAccIdSrch_Global,
				bp_scheduled_payment_hist_obj.scheduledTransactions);
		populateScheduledPayArea();
		break;
	}
	}
}

/********************************************************************************************
Name                 :   handleBPCancelSchedulePaymentHist
Return type          :   None
Input Parameter(s)   :   int cartItemId, String callFrom
Purpose              :   To call the BP_CANCEL_SCHEDULED_PAYMENT_HIST api.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function handleBPCancelSchedulePaymentHist(cartItemId, callFrom){
	var request = {};
	/* To show the progress bar */
	showProgressBar();
	request.userId = getCookie("userId");
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.cartItemId = cartItemId;
	
	$('#'+cartItemId+"_"+callFrom).attr('id', 'cancelBtnId');

	var call_bp_cancel_scheduled_payment = new bp_cancel_scheduled_payment(request, callFrom);
	call_bp_cancel_scheduled_payment.call();
}

/********************************************************************************************
Name                 :   handleBPCancelSchedulePaymentHistOnSuccess
Return type          :   None
Input Parameter(s)   :   String callFrom
Purpose              :   This method will handle those actions that has to be performed 
on success of BP_CANCEL_SCHEDULED_PAYMENT_HIST.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function handleBPCancelSchedulePaymentHistOnSuccess(callFrom){
	var scheduleRequest = getReadyRequestForScheduledHist();
	var histRequest = getReadyRequestOfBpHist();
	if(callFrom) {
		var call_bp_scheduled_payment_hist = new bp_scheduled_payment_hist(scheduleRequest, callFrom);
		call_bp_scheduled_payment_hist.call();
		
		var call_bp_hist = new bp_hist(histRequest, callFrom);
		call_bp_hist.call();
				
		/* Storing the biller boxes data into tempBillArray so that is can be populated later after BP_ACCOUNT_LITE API call */
		setTempBillArray(); 
		getBillerAccounts();
		setIntervalOnChkSideCancel();
	} 
	closeCancelPopup();
	if (callFrom === callFrom_constant.SIDE_BAR_CANCEL_CALL) {
		showSideBarAlerts('sideBarAlertSuccessId', 'sideBarAlertSuccessTxtId', messages['cancelScheduled.successMsg']);		
		restartTimerForSlideDown();
	} else {
		showGeneralSuccessMsg(messages['cancelScheduled.successMsg']);
	}
}

function hideSpinnerChkOutSideBar() {
	if(chkFlagForHist && chkScheduleHist && chkAccounts && $('#chkoutPaymentSec').is(":visible")){
		hideProgressBar();
		chkFlagForHist = false;
		chkScheduleHist = false;
		chkAccounts = false;
		clearIntervalApp(intervalForchkCancel);/* Clearing timer */
		intervalForchkCancel = '';
	} else if(chkFlagForHist && chkAccounts && $('#MainHolder').is(":visible")){
		chkFlagForHist = false;
		chkScheduleHist = false;
		chkAccounts = false;
		clearIntervalApp(intervalForchkCancel);/* Clearing timer */
		intervalForchkCancel = '';
	}
}

var intervalForchkCancel;
function setIntervalOnChkSideCancel() {
	/* checkReceiptApiStatus will call every 500 frequency */
   intervalForchkCancel = setInterval("hideSpinnerChkOutSideBar()", 500);
}
/********************************************************************************************
Name                 :   populateScheduledPayArea
Return type          :   None
Input Parameter(s)   :   Object scheduledTransactions
Purpose              :   This method is used To populate the Scheduled payment section on the sidebar
from BP_SCHEDULED_PAYMENT_HIST API response.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function populateScheduledPayArea(){
	var scheduledBillBoxes="";
	/* Show the side note for registered user if no transactions are available.*/
	showNoPaymentSideNote();
	$.each(bp_scheduled_payment_hist_obj.scheduledTransactions.sort(sortByDeliveryDate), function (i, rowsetBList){
		scheduledBillBoxes += fillInfoInScheduledBillBoxes(rowsetBList.id,
				rowsetBList.accountNickname,
				getFormatedNumber(rowsetBList.amount,  true),
				convertToDatemmddyyForHistory(new Date(convertTimeToPST(rowsetBList.requestedPostDate))),
				i);
	});
	$('#inner_sch').html(scheduledBillBoxes);
	calcHeightAndUpdateBills();
}

/********************************************************************************************
' Name                 :   fillInfoInScheduledBillBoxes
' Return type          :   {scheduledBillBox}
' Input Parameter(s)   :   paymentCardId, accountNickname, amount, requestedPostDate, index 
' Purpose              :   To fill the scheduled Info into scheduledBillBox,
							from BP_SCHEDULED_PAYMENT_HIST api for scheduled paymants.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   02 May 2014 	 -   Ravi Raj
'*******************************************************************************************/
function fillInfoInScheduledBillBoxes(paymentCardId, accountNickname, amount, requestedPostDate, index){
	var scheduledBillBox="";
	
	scheduledBillBox = "<div class='bill_status_box' id='bill_status_box"+index+"'>"
							+"<div class='width_area89 in_lineBlock'>"
							+"<div class='wid_area100 txt_bold bill_status_biller'>"+ accountNickname +"</div>"
							+"<div class='wid_area100'>"
							+"<span class='mob_block'>" 
							+ formatMessage(messages['scheduledPay.scheduledMsg'], amount, requestedPostDate)
							+ "</span>"
							+"</div></div>"
							+"<div class='width_area11 in_lineBlock rght-align'>"
							+"<div id='cancelSchedule"+ paymentCardId +"" 
							+"' class='fa fa-times fa-3x cursor_pntr' onClick = 'cancelScheduledPayments("+ paymentCardId +",\""+callFrom_constant.SIDE_BAR_CANCEL_CALL+"\")' />"
							+"</div>"
							+"</div>"
							+"<div class='clear'></div>";
	return scheduledBillBox;
}

/********************************************************************************************
' Name                 :   sortByDeliveryDate
' Return type          :   {object satisfying sorting conditions}
' Input Parameter(s)   :   Any two objects from the unsorted array.
' Purpose              :   To sort the scheduled payment list according to delivery date.
' History Header       :   Version   -   Date            -   Developer Name
' Added By             :   1.0       -   07 May 2014 	 -   Ravi Raj
'*******************************************************************************************/
function sortByDeliveryDate(a, b){
	if (a.requestedPostDate > b.requestedPostDate) {
		return -1;
	} else if (a.requestedPostDate < b.requestedPostDate) {
		return 1;
	}
}

/********************************************************************************************
Name                 :   cancelScheduledPayments
Return type          :   boolean
Input Parameter(s)   :   Object scheduledTransactions
Purpose              :   This Method called on click of cancel button on scheduled biller 
box to cancel the scheduled bills.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   10th May, 2014   -   Ravi Raj
*******************************************************************************************/
function cancelScheduledPayments(paymentCardId, callFrom){
	showAnimatedPopup('cancelSchedContainerId', 'cancelSchedulePayPopup');
	$("#cancelBtnId").attr('id', paymentCardId +"_"+ callFrom);
}

/********************************************************************************************
Name                 :   cancel
Return type          :   None
Input Parameter(s)   :   btnId
Purpose              :   This method invoke the cancel schedule payment api.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function cancel(btnId){
	var paymentCardId = btnId.id.split("_")[0];
	var callFrom = btnId.id.split("_")[1];
	/*Sliding the side bar screen to bill screen when cancelled. Bug id 4724*/
	/*if(callFrom === callFrom_constant.SIDE_BAR_CANCEL_CALL){
		$('.wrapper_area').animate({"right": '-=270'});		
	}*/
	handleBPCancelSchedulePaymentHist(paymentCardId ,callFrom );
}

/********************************************************************************************
Name                 :   closeCancelPopup
Return type          :   None
Input Parameter(s)   :   btnId
Purpose              :   This method will hide the popup, called from popup jsp.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function closeCancelPopup(){
	closeAnimatedPopup('cancelSchedContainerId','cancelSchedulePayPopup');
}

/********************************************************************************************
Name                 :   getReadyRequestForScheduledHist
Return type          :   request
Input Parameter(s)   :   paymentGroupId
Purpose              :   This method will create a ready request for BP_SCHEDULED_PAYMENT_HIST API.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th April, 2014   -   Ravi Raj
*******************************************************************************************/
function getReadyRequestForScheduledHist(paymentGroupId){
	/* To show the progress bar */
	showProgressBar();
	var request = {};
	/*Holding the request parameters to be send to BP_SCHEDULED_PAYMENT_HIST */
	request.userId = getCookie("userId");
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	if (paymentGroupId && paymentGroupId!="") {
		request.paymentGroupId = paymentGroupId;
	}
	return request;
}

/********************************************************************************************
Name                 :   createScheduledTableMobile
Return type          :   String rowItem
Input Parameter(s)   :   boolean flag, Long accountNickname, Object bp_schedule_Transaction
Purpose              :   This method is used for crating the table for mobile layout on the
basis of BP_SCHEDULED_PAYMENT_HIST API response.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   12th May, 2014   -   Ravi Raj
*******************************************************************************************/
function createScheduledTableMobile(flag, billerCorpAccIdSrch, bp_schedule_Transaction, callFrom) {
	$('#paymentScheduledTableArea').show();
	var mobilePaymentSchedule = "<div class='schedule_pmt_alertbox'>"+ messages['paymentHistory.alertSchedulMsg']
								+"<br>"+ messages['paymentHistory.alertSchedulCancelMsg']
								+"</div>";
	var sortedTransArray = bp_schedule_Transaction.sort(sortByDeliveryDate);
	var noBillerScheCount = 0;
	for (var index = 0; index < sortedTransArray.length; index++) {
			if (flag === true && sortedTransArray[index].billerCorpAccountId != billerCorpAccIdSrch) {
				noBillerScheCount += 1;
				continue;
			}
			mobilePaymentSchedule += createScheduledRowMobile(sortedTransArray[index]);
	}
	/*Show message if no scheduled paymants available for billers */
	if (noBillerScheCount === sortedTransArray.length) {
		$("#paymentScheduledTableArea").hide();
		/* To hide the progress bar */
		if (callFrom != callFrom_constant.SIDE_BAR_CANCEL_CALL) {
			hideProgressBar();
		}
		
		return;
	}

	$('#paymentScheduledTableArea').html(mobilePaymentSchedule);

	for (var index = 0; index < sortedTransArray.length; index++) {
		if (flag === true && sortedTransArray[index].billerCorpAccountId != billerCorpAccIdSrch) {
			noBillerScheCount += 1;
			continue;
		}

		$("#mobileTxRow_" + sortedTransArray[index].id).click(function () {
			var elementId = $(this).attr("id");
			var divId = elementId.split('_')[1];
			for (var counter = 0; counter < sortedTransArray.length; counter++) {
				if (flag === true && sortedTransArray[counter].billerCorpAccountId != billerCorpAccIdSrch) {
					noBillerScheCount += 1;
					continue;
				}
				if (sortedTransArray[counter].id != divId) {
					$("#mobilePdf" + sortedTransArray[counter].id).hide();
				}
			}
			$("#mobilePdf" + divId).toggle();
		});
	}
	/* To hide the progress bar */
	hideProgressBar();
}
/********************************************************************************************
Name                 :   createScheduledRowMobile
Return type          :   String mobileScheduleRow
Input Parameter(s)   :   Object historyRowDataMobile
Purpose              :   This method is used for crating the row for mobile layout on the basis of
BP_HIST API response.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   12th May, 2014   -   Ravi Raj
*******************************************************************************************/
function createScheduledRowMobile(scheduledRowDataMobile) {
    var dateLabelMobile = "";
    var chrgDateLabelMobile = "";
    var paymentStatusMobile = getStatusForMobile(scheduledRowDataMobile.status,
    		scheduledRowDataMobile.requestedPostDate);

    if (scheduledRowDataMobile.requestedPostDate != undefined) {
            dateLabelMobile = convertToDatemmddyyForHistory(convertTimeToPST(scheduledRowDataMobile.requestedPostDate));
        	chrgDateLabelMobile = convertToDatemmddyyForHistory(convertTimeToPST(scheduledRowDataMobile.scheduledSubmitDate));
        }
    var mobileScheduleRow = "<div class='tbl_pmt_hist_bg cursor_def' id='mobileTxRow_" + scheduledRowDataMobile.id + "'\">"
            + "<div class='pmt_hist_status' >"
            + getStatusImageForMobile(scheduledRowDataMobile.status, scheduledRowDataMobile.requestedPostDate, scheduledRowDataMobile.id)
            + "</div>"
            + "<div class='pmt_hist_service_prov'>"
            + "<div class='pmt_hist_nm_heading mob_max_100'>"
            + scheduledRowDataMobile.accountNickname
            + "</div>"
            + "<div class='pmt_hist_dttxt'>"
            + paymentStatusMobile +"for "
            + dateLabelMobile
            + "</div>"
            + "<div class='pmt_hist_dttxt'>"
            + messages['paymentHistory.scheduleChargeDateMsg']
            + chrgDateLabelMobile
            + "</div>"
            + "<div class='pmt_hist_dttxt'>"
            + getSchedulePaymentRefNoForMobile(scheduledRowDataMobile.id)
            + "</div>"
            + "</div>"
            + "<div class='pmt_hist_amount_area'>"
            + getFormatedNumber(scheduledRowDataMobile.amount, true)
            + "</div>"
            + "</div>"
            + "<div class='clear'></div>";
    return mobileScheduleRow;
}

/********************************************************************************************
Name                 :   createSchedulePaymentTable
Return type          :   None
Input Parameter(s)   :   flag, billerCorpAccIdSrch, bp_schedule_Transaction
Purpose              :   This method is used for crating the data table on the basis of
BP_SCHEDULED_PAYMENT_HIST API response.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th May, 2014   -   Ravi Raj
*******************************************************************************************/
function createSchedulePaymentTable(flag, billerCorpAccIdSrch, bp_schedule_Transaction, callFrom) {
	$('#paymentScheduledTableArea').show();
	var tablePaymentSchedHistory = '<div class="schedule_pmt_alertbox">'+ messages['paymentHistory.alertSchedulMsg']
							+ '<br>'+ messages['paymentHistory.alertSchedulCancelMsg'] + '</div>'
							+ '<table id="paymentScheduledTable">'
							+ '<thead id="demoSchedule">'
							+ '<th width=15%>' + messages['paymentHistory.payment_status'] + '</th>'
							+ '<th width=20%>' + messages['paymentHistory.delivery_date'] + '</th>'
							+ '<th width=25%>' + messages['paymentHistory.nickname'] + '</th>'
							+ '<th width=15%>' + messages['paymentHistory.amount'] + '</th>'
							+ '<th width=15%>' + messages['paymentHistory.refNumber'] + '</th>'
							+ '</thead>'
							+ '<tbody id="paymentScheduleTableRows">';
	var noBillerScheCount = 0;
	
		for (var index = 0; index < bp_schedule_Transaction.length; index++) {
			if (flag === true && bp_schedule_Transaction[index].billerCorpAccountId != billerCorpAccIdSrch) {
				noBillerScheCount += 1;
				continue;
			}
			tablePaymentSchedHistory += createScheduleHistroyRow(bp_schedule_Transaction[index]);
		}
		tablePaymentSchedHistory += '</tbody> </table>';

	/*Show message if no history available for billers */
	if (noBillerScheCount === bp_schedule_Transaction.length) {
		$("#paymentScheduledTableArea").hide();
		/* To hide the progress bar */
		if(callFrom != callFrom_constant.SIDE_BAR_CANCEL_CALL) {
			hideProgressBar();
		}
		return;
	}
	$('#paymentScheduledTableArea').html(tablePaymentSchedHistory);

	/* Enable the History button from button_event.js. */
	enableButton("pay_hist_tag");
	/* To hide the progress bar */
	//hideProgressBar();

	tableRefrecnce = $("#paymentScheduledTable").dataTable({
		"bFilter": false,//used to disable search
		"bLengthChange": false,
		"bPaginate": false,
		"bScrollCollapse": true,
		//used to display row count as 25 in table
		"iDisplayLength": 10,
		"aLengthMenu": [
		                [25, 50, 100, -1],
		                [25, 50, 100, "All"]
		                ],
		                // No initial sorting
		                "aaSorting": [
		                              [1, 'desc']
		                              ],
		                              "aoColumnDefs": [
		                                               { "sType": "currency", "aTargets": [ 3 ] },
		                                               {
		                                            	   "bSortable": true,
		                                            	   "aTargets": [ 0, 2, 3, 4 ]
		                                               },
		                                               {"bSortable": true, "aTargets":[ 1 ]}
		                                               ],
		                                               "fnDrawCallback": function () {
		                                            	   if (Math.ceil((this.fnSettings().fnRecordsDisplay()) /
		                                            			   this.fnSettings()._iDisplayLength) >
		                                            	   1) {
		                                            		   $('.dataTables_length').hide();
		                                            	   } else {
		                                            		   $('.dataTables_length').css("display", "none");
		                                            	   }
		                                               }
	});
}

/********************************************************************************************
Name                 :   createScheduleHistroyRow
Return type          :   String rowItem
Input Parameter(s)   :   Object histTransactionRow
Purpose              :   This method is used for crating the row on the basis of
BP_HIST API response.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   29th May, 2014   -   Ravi Raj
*******************************************************************************************/
function createScheduleHistroyRow(scheduleTransactionRow) {
   var rowItem = "";
   rowItem += '<tr class="colortdDelivered">'
           + '<td class="Payment status">'
           + getImageWithPaymentStatus(scheduleTransactionRow.status, scheduleTransactionRow.requestedPostDate, scheduleTransactionRow.id)
          /* + '</td>'
           + '<td class="Delivery date" id="deliveryDateId">'
           + convertToDatemmddyyForHistory(scheduleTransactionRow.requestedPostDate)*/
           + '</td>'
           + '<td class="Nickname">'
           + scheduleTransactionRow.accountNickname
           + '</td>'
           + '<td class="Amount">' 
           + getFormatedNumber(scheduleTransactionRow.amount, true)
           + '</td>'
           + '<td class="Confirm num" id="confNumId">'
           + scheduleTransactionRow.id
           + '</td></tr>';
   return rowItem;
}
