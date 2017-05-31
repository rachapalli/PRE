var tableRefrecnce;
var hlr = 0;
/* Reference to the currently highlighted row */
var print_pdf, save_pdf, email_pdf;
var  payHistFlagGlobal, billPayAccountIdSrch_Global;
var isRtr_Global, billerCorpAccIdSrch_Global, seeMoreBillBtnFlag_global=false;


/********************************************************************************************
 Name                 :   showRegFormBill
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   This method is used to show the create account section and pertaining
 button for guest user in Bill view page.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function showRegFormBill() {
    if (!$('#chkCreateAccBill').is(":checked")) {
        $("#chkCreateAccBill").prop('checked', true);
        $("#chkCreateAccIconBill").removeClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#chkCreateAccIconBill").addClass("add_bill_activ_chkbox_icon flt_lft");
        var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
        var arg1 = '</a>';
        var message = formatMessage(messages['checkout.termConditionHistory'], arg0, arg1);
        $("#billViewTermCond").html(message);
        $("#frmGuestCreateAccBill").show();
        $("#createAccountBoxErrDivBill").show();
        $("#btnContinueBill").show();
        
        /* Show the check box for marketing Opt in */
        createOptInMsgAorBSection("chkOptInEnhBillView", "optInEhnChkBillView", messages['createAccount.optInEnh']);
        fillDataFromUserGetProfileObject("emailIdBill", "confrmEmailIdBill", "mobileNoBill", "zipCodeBill");
        
        validateCreateProfileBill();

        /* To be called from fieldValidator.js*/
        addHeightClass('errorSepratorBill1');
        addHeightClass('errorSepratorBill2');
        addHeightClass('errorSepratorBill3');
        addHeightClass('errorSepratorBill4');
        addHeightClass('errorSepratorBill5');
        enableDisableSubmit('frmGuestCreateAccBill', 'btnContinueBill');
    } else {
        $("#chkCreateAccBill").prop('checked', false);
        $("#chkCreateAccIconBill").removeClass("add_bill_activ_chkbox_icon flt_lft");
        $("#chkCreateAccIconBill").addClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#frmGuestCreateAccBill").hide();
        $("#createAccountBoxErrDivBill").hide();
        $("#btnContinueBill").hide();

        /* To be called from fieldValidator.js*/
        removeHeightClass('errorSepratorBill1');
        removeHeightClass('errorSepratorBill2');
        removeHeightClass('errorSepratorBill3');
        removeHeightClass('errorSepratorBill4');
        removeHeightClass('errorSepratorBill5');
    }
}

/********************************************************************************************
 Name                 :   hideShowCreateAccountBill
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   This method is used for showing create account box on Bill view
 page for guest user.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function hideShowCreateAccountBill(verifyUserId) {
    var registerUser = parseBoolean(localStorage.getItem("registerUser"));
    if (registerUser === false) {
        $("#createAccountBillSection").show();

        /* To clear the create profile form data. */
        clearFormData('frmGuestCreateAccBill');
        setExtraMarginForAndroid('createAccountBoxBill');

        if (verifyUserId) {
            $('#createAccountBoxBill').show();
            /* To set the create profile area at initial state. */
            if ($('#chkCreateAccBill').is(":checked")) {
                showRegFormBill();
            }
        }
        /* To hide the error msg divs on page load. */
        hideErrorMsgDiv('frmGuestCreateAccBill', 'errorMainAreaBill1');
        return;
    }
    $("createAccountBillSection").remove();
}

/********************************************************************************************
 Name                 :   validateCreateProfileBill
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   This method is used for validating the create account field in
 Bill view page.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013  -   Ravi Raj
 *******************************************************************************************/
function validateCreateProfileBill() {
    $('#emailIdBill').blur(function () {
    	this.value = this.value.toLowerCase();
        validateEmailInfo('emailIdBill', 'errorMainAreaBill1', 'invalidMsgBill1', messages['createAccount.invalidEmailMsg'],
                          'frmGuestCreateAccBill', 'btnContinueBill','paymentHistoryAreaId');
    });

    $('#confrmEmailIdBill').blur(function () {
    	this.value = this.value.toLowerCase();
        validateReenterEmail('emailIdBill', 'confrmEmailIdBill', 'errorMainAreaBill2', 'invalidMsgBill2',
                             messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestCreateAccBill', 'btnContinueBill','paymentHistoryAreaId');
    });

    $('#passwordBill').blur(function () {
        passwordMatchUserName('emailIdBill', 'passwordBill', 'errorMainAreaBill3', 'invalidMsgBill3',
                              messages['createAccount.invalidpasswordMsgSame'], 'frmGuestCreateAccBill', 'btnContinueBill', 'paymentHistoryAreaId');
    });

    $('#mobileNoBill').blur(function () {
        validatePhoneInfo('mobileNoBill', 'errorMainAreaBill4', 'invalidMsgBill4', messages['createAccount.invalidphoneMsg'],
                          'frmGuestCreateAccBill', 'btnContinueBill','paymentHistoryAreaId');
    });

    $('#zipCodeBill').blur(function () {
        validateZipcodeInfo('zipCodeBill', 'errorMainAreaBill5', 'invalidMsgBill5', messages['createAccount.invalidzipCodeMsg'],
                            'frmGuestCreateAccBill', 'btnContinueBill', 'paymentHistoryAreaId');
    });
    customKeypressValidator('mobileNoBill');
}

/********************************************************************************************
 Name                 :   loadPaymentHistoryTable
 Return type          :   None
 Input Parameter(s)   :   boolean flag, Long accountNickname
 Purpose              :   This method is check the window size and show button and call
 payment history method for BP_HIST API call.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   5th June, 2013  -   Ravi Raj
 *******************************************************************************************/
function loadPaymentHistoryTable(flag, billPayAccountIdSrch, isRtr, billerCorpAccIdSrch) {
	if(seeMoreBillBtnFlag_global && billPayAccountIdSrch){
		$('.wrapper_area').animate({"right": '-=270'});
		seeMoreBillBtnFlag_global = false;
	}
    var verifyUserId = eval(getCookie('userId'));
    hideShowCreateAccountBill(verifyUserId);
    $('#paymentHistoryTableArea').empty();
    $('#paymentScheduledTableArea').empty();
    /* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
    showScreenAndSetHeight('paymentHistoryInner', 'paymentHistoryAreaId');
    if (!verifyUserId) {
        $("#paymentHistoryTableArea").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");
        return;
    }
    /*
     * Disable the History button from button_event.js.
     */
    disableButton("pay_hist_tag");
    /* To show the progress bar */
    showProgressBar();
    
	/* Need to make the below 4 values to global to manage the Responsive Web Design.*/
	payHistFlagGlobal = flag;
	billPayAccountIdSrch_Global = billPayAccountIdSrch;
	isRtr_Global = isRtr;
	billerCorpAccIdSrch_Global = billerCorpAccIdSrch;
	
	/*-----------------------------------------------------------------------------------
	 * On Click of SeeMoreBills button we are invoking BP_SCHEDULED_PAYMENT_HIST and BP_HIST
	 * to create the history section.
	 *-----------------------------------------------------------------------------------*/
    invokeSchedulePayHist();
    invokeSubmittedPayHist();
}
/********************************************************************************************
Name                 :   handleScheduleAndSubmitHist
Return type          :   None
Input Parameter(s)   :   None
Purpose              :   This method is used for calling the BP_SCHEDULED_PAYMENT_HIST and 
BP_HIST API simultaneously. And show the data table of history for both full history and specific biller history.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   14th May, 2014   -   Ravi Raj
*******************************************************************************************/
function handleScheduleAndSubmitHistOnSuccess(callFrom){
	var windowWidth = $(window).width();
	/*
	 * To check for standard and mobile width areas.
	 */
	if (windowWidth > minimumWindowWidthForMobile) {
		/*To create the Scheduled Payment history area for standard width. need to modify*/
		if(bp_scheduled_payment_hist_obj.scheduledTransactions){
			createSchedulePaymentTable(payHistFlagGlobal, billerCorpAccIdSrch_Global, bp_scheduled_payment_hist_obj.scheduledTransactions, callFrom);/*underDevelopment need to verify*/			
		}

		/*To create the payment history area for standard width.*/
		if(bp_hist_obj.transactions){
			createPaymentHistoryTable(payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global, callFrom);			
		}
		return;
	}
	/*To create the Scheduled payment result area for mobile width.*/
	if(bp_scheduled_payment_hist_obj.scheduledTransactions){
		createScheduledTableMobile(payHistFlagGlobal, billerCorpAccIdSrch_Global, bp_scheduled_payment_hist_obj.scheduledTransactions, callFrom);
	}

	/*To create the payment history result area for mobile width.*/
	if(bp_hist_obj.transactions){
		createHistoryTableMobile(payHistFlagGlobal, billPayAccountIdSrch_Global, isRtr_Global, billerCorpAccIdSrch_Global, callFrom);
	}
}
/********************************************************************************************
Name                 :   invokeSchedulePayHist
Return type          :   None
Input Parameter(s)   :   boolean flag, Long billPayAccountId
Purpose              :   This method is used for calling the BP_SCHEDULED_PAYMENT_HIST API.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   14th May, 2014   -   Ravi Raj
*******************************************************************************************/
function invokeSchedulePayHist() {
	/* To show the progress bar */
	showProgressBar();
	/*-----------------------------------------------------------------------------------
	 * Making authenticated ajax API call for BP_SCHEDULED_PAYMENT_HIST.
	 *-----------------------------------------------------------------------------------*/
	var call_bp_scheduled_payment_hist = new bp_scheduled_payment_hist(
			getReadyRequestForScheduledHist(""),
			callFrom_constant.BILL_STATUS_CALL);
	call_bp_scheduled_payment_hist.call();
}
/********************************************************************************************
Name                 :   invokeSubmittedPayHist
Return type          :   None
Input Parameter(s)   :   boolean flag, Long billPayAccountId
Purpose              :   This method is used for calling the BP_SCHEDULED_PAYMENT_HIST and 
BP_HIST API.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   14th May, 2014   -   Ravi Raj
*******************************************************************************************/
function invokeSubmittedPayHist() {
	/* To show the progress bar */
	showProgressBar();
	/*-----------------------------------------------------------------------------------
	 * Making authenticated ajax API call for BP_HIST.
	 *-----------------------------------------------------------------------------------*/
	var call_bp_hist_obj = new bp_hist(getReadyRequestOfBpHist(),
			callFrom_constant.BILL_STATUS_CALL);
	call_bp_hist_obj.call();
}
/********************************************************************************************
 Name                 :   createPaymentHistoryTable
 Return type          :   None
 Input Parameter(s)   :   flag, billPayAccountIdSrch, isRtr, billerCorpAccIdSrch
 Purpose              :   This method is used for crating the data table on the basis of
 BP_HIST API response.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function createPaymentHistoryTable(flag, billPayAccountIdSrch, isRtr, billerCorpAccIdSrch, flagForHide, callFrom) {
	$('#paymentHistoryTableArea').show();
	var tablePaymentHistory = '<div class="submit_pmt_alertbox">' + messages['paymentHistory.alertSubmitMsg'] + '</div>'
		+ '<table id="paymentHistoryTable">'
		+ '<thead id="demo">'
		+ '<th width=15%>' + messages['paymentHistory.payment_status'] + '</th>'
		+ '<th width=20%>' + messages['paymentHistory.delivery_date'] + '</th>'
		+ '<th width=25%>' + messages['paymentHistory.nickname'] + '</th>'
		+ '<th width=15%>' + messages['paymentHistory.amount'] + '</th>'
		+ '<th width=15%>' + messages['paymentHistory.confirm_num'] + '</th>'
		+ '</thead>'
		+ '<tbody id="paymentHistoryTableRows">';
	var noBillerHistCount = 0;
	var programs="";
	/*----------------------------------------------------------------------------------------------
	 * Verifying the billPayAccountId with respect to its billerCorpAccountId coming from 
	 * BP_ACCOUNT_LITE response object and then showing all those billPayAccountId that are present in
	 * BP_HIST transactions object. 
	 * ---------------------------------------------------------------------------------------------*/
	if(/*isRtr &&*/ flag && !flag==="backToHistoryView"){/*Fix for Bug 4921*/
		if(bp_account_lite_obj.billerCorpAccounts){
			for(var index = 0;index < bp_account_lite_obj.billerCorpAccounts.length; index++){
				if(billerCorpAccIdSrch === bp_account_lite_obj.billerCorpAccounts[index].id){
					programs = bp_account_lite_obj.billerCorpAccounts[index].programs;
				}
			}
		}
		if(programs){
			for(var proIndex = 0; proIndex < programs.length; proIndex++){
				var billPayAccountIdFrmPrgmsArr = programs[proIndex].billPayAccountId;
				for(var histIndex = 0;histIndex < bp_hist_obj.transactions.length; histIndex++){
					var histBillPayAccountId = bp_hist_obj.transactions[histIndex].billPayAccountId;
					if(billPayAccountIdFrmPrgmsArr === histBillPayAccountId && billPayAccountIdFrmPrgmsArr != null
							&& histBillPayAccountId != null){
						tablePaymentHistory += createHistroyRow(bp_hist_obj.transactions[histIndex]);
					}else{
						noBillerHistCount += 1;
					}
				}
			}
		}
	}else{
		for (var index = 0; index < bp_hist_obj.transactions.length; index++) {
			if (flag === true && bp_hist_obj.transactions[index].billPayAccountId != billPayAccountIdSrch) {
				noBillerHistCount += 1;
				continue;
			}
			tablePaymentHistory += createHistroyRow(bp_hist_obj.transactions[index]);
		}
	}
	tablePaymentHistory += '</tbody> </table>';

	/*Show message if no history available for billers */
	if (noBillerHistCount === bp_hist_obj.transactions.length) {
		if(!$('#paymentScheduledTableArea').is(':visible')){
			$("#paymentHistoryTableArea").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");
		}
		/* To hide the progress bar */
		if(!flagForHide && callFrom != callFrom_constant.SIDE_BAR_CANCEL_CALL){
			hideProgressBar();		
		}
		return;
	}
	$('#paymentHistoryTableArea').html(tablePaymentHistory);
	$('.canceled_icon ').parent().parent().addClass('cursor_def_imp');

	/* Enable the History button from button_event.js. */
	enableButton("pay_hist_tag");
	/* To hide the progress bar */
	if(!flagForHide && callFrom != callFrom_constant.SIDE_BAR_CANCEL_CALL){
		hideProgressBar();		
	}

	tableRefrecnce = $("#paymentHistoryTable").dataTable({
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
                           { "bSortable": true, "aTargets": [ 0, 1, 2, 3, 4 ]}
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
	/* Open the detail receipt view when user clicks to any row. */ 
	$('#paymentHistoryTable tbody').delegate("tr", "click", function () {
		var cartId = parseInt(jQuery(this).find("td.Confirm").text());
		var billPayResponseMsg = "";
		var paymentStatus = "";
		var cartIdFlag = false;

		/*------------------------------------------------------------------------------------
		 * Enhanced the code as per Dolly 1.8 doc section 6.2.6.5 – Popup on Bill Status View
		 * -----------------------------------------------------------------------------------*/
		for (var index = 0; index < bp_hist_obj.transactions.length; index++) {
			if(bp_hist_obj.transactions[index].cartId === cartId || bp_hist_obj.transactions[index].id === cartId){
				paymentStatus = bp_hist_obj.transactions[index].status;
				if(cartId != bp_hist_obj.transactions[index].cartId){
					cartId = bp_hist_obj.transactions[index].id;
					cartIdFlag = true;
				}
				billPayResponseMsg = bp_hist_obj.transactions[index].billPayResponseMsg;
				break;
			}
		}
		/*Redirecting to the receipt view to those transactions that does have the receipt id in BP_HIST transaction object*/
		if (cartId != null /*&& paymentReasonCode != null && paymentReasonCode != ""*/ && !cartIdFlag) {
			navigateToReceiptView(cartId, false);
			return false;
		}else if(/*paymentReasonCode === null && paymentReasonCode != "" && */cartIdFlag &&
				billPayResponseMsg != "" && paymentStatus != payment_status_constant.SCHEDULED_CANCELLED && paymentStatus != null){
			/*Showing popup for those payments that are failed due to some technical reasons and not canceled by the user.*/
			schedulePayFailedPopup(billPayResponseMsg);
			return false;
		}
	});
}


/********************************************************************************************
 Name                 :   createHistroyRow
 Return type          :   String rowItem
 Input Parameter(s)   :   Object histTransactionRow
 Purpose              :   This method is used for crating the row on the basis of
 BP_HIST API response.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function createHistroyRow(histTransactionRow) {
    var rowItem = "";

    /*As per the status of payment s maid by user,add the history with color effect on the table */
    if (getStatus(histTransactionRow.status, histTransactionRow.projectedPostingDate) === messages['paymentHistory.Pending']) {
        rowItem = '<tr class="colortdPending">';
    }
    else if (getStatus(histTransactionRow.status, histTransactionRow.projectedPostingDate) === messages['paymentHistory.Delivered']) {
        rowItem = '<tr class="colortdDelivered">';
    }
    else if (getStatus(histTransactionRow.status, histTransactionRow.projectedPostingDate) === messages['paymentHistory.Failed']) {
        rowItem = '<tr class="colortdFailed">';
    }
    rowItem = rowItem
            + '<td class="Payment status">'
            + getImageWithPaymentStatus(histTransactionRow.status, histTransactionRow.projectedPostingDate,"", histTransactionRow.updateDate)
            + '</td>'
            + '<td class="Nickname">'
            + histTransactionRow.accountNickname
            + '</td>'
            + '<td class="Amount">' 
            + getFormatedNumber(histTransactionRow.amount, true)
            + '</td>'
            + '<td class="Confirm num" id="confNumId">';
    /*Condition that are mentioned in dolly 1.9 are overridden by the conditions provided in Bug #5025*/
    if (histTransactionRow.cartId != 0 && histTransactionRow.cartId != null &&
            histTransactionRow.cartId != undefined /*&& histTransactionRow.paymentReasonCode != null //Fix for Bug #5025*/) {
        rowItem += histTransactionRow.cartId;
    }else if( histTransactionRow.cartId === null){/*if cartId is null then placing the BP_HIST.transactions.id as reference id*/
    	rowItem += histTransactionRow.id;
    }

    rowItem += '</td></tr>';
    return rowItem;
}


/********************************************************************************************
 Name                 :   createHistoryTableMobile
 Return type          :   String rowItem
 Input Parameter(s)   :   boolean flag, Long billPayAccountIdSrch
 Purpose              :   This method is used for crating the table for mobile layout on the
 basis of BP_HIST API response.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function createHistoryTableMobile(flag, billPayAccountIdSrch, isRtr, billerCorpAccIdSrch, callFrom) {
	var mobilePatmentHistory = "<div class='submit_pmt_alertbox'> "+messages['paymentHistory.alertSubmitMsg']+"</div>";
	var noBillerHistCount = 0;
	var programs="";
	var sortedHistTrans = bp_hist_obj.transactions.sort(sortByRecentDate);
	/*----------------------------------------------------------------------------------------------
	 * Verifying the billPayAccountId with respect to its billerCorpAccountId coming from 
	 * BP_ACCOUNT_LITE response object and then showing all those billPayAccountId that are present in
	 * BP_HIST transactions object. 
	 * ---------------------------------------------------------------------------------------------*/
	if(/*isRtr &&*/ flag && !flag==="backToHistoryView"){/*Bug 4921*/
		if(bp_account_lite_obj.billerCorpAccounts){
			for(var index = 0;index < bp_account_lite_obj.billerCorpAccounts .length; index++){
				if(billerCorpAccIdSrch === bp_account_lite_obj.billerCorpAccounts[index].id){
					programs = bp_account_lite_obj.billerCorpAccounts[index].programs;
				}
			}
		}
		if(programs){
			for(var proIndex = 0; proIndex < programs.length; proIndex++){
				var billPayAccountIdFrmPrgmsArr = programs[proIndex].billPayAccountId;
				for(var histIndex = 0;histIndex < sortedHistTrans.length; histIndex++){
					var histBillPayAccountId = sortedHistTrans[histIndex].billPayAccountId;
					if(billPayAccountIdFrmPrgmsArr === histBillPayAccountId && billPayAccountIdFrmPrgmsArr != null
							&& histBillPayAccountId != null){
						mobilePatmentHistory += createHistroyRowMobile(sortedHistTrans[histIndex]);
					}else{
						noBillerHistCount += 1;
					}
				}
			}
		}
	}else{
		for (var index = 0; index < sortedHistTrans.length; index++) {
			if (flag === true && sortedHistTrans[index].billPayAccountId != billPayAccountIdSrch) {
				noBillerHistCount += 1;
				continue;
			}
			mobilePatmentHistory += createHistroyRowMobile(sortedHistTrans[index]);
		}
	}

	/*Show message if no history available for billers */
	if (noBillerHistCount === sortedHistTrans.length) {
		if(!$('#paymentScheduledTableArea').is(':visible')){
			$("#paymentHistoryTableArea").html("<h5>" + messages['paymentHistory.noHistoryMsg'] + "</h5>");			
		}
		/* To hide the progress bar */
		if(callFrom != callFrom_constant.SIDE_BAR_CANCEL_CALL) {
			hideProgressBar();
		}
		return;
	}

	$('#paymentHistoryTableArea').html(mobilePatmentHistory);

	for (var index = 0; index < sortedHistTrans.length; index++) {
		if (flag === true && sortedHistTrans[index].billPayAccountId != billPayAccountIdSrch) {
			noBillerHistCount += 1;
			continue;
		}

		$("#mobileTxRow_" + sortedHistTrans[index].id).click(function () {
			var elementId = $(this).attr("id");
			var divId = elementId.split('_')[1];
			for (var counter = 0; counter < sortedHistTrans.length; counter++) {
				if (flag === true && sortedHistTrans[counter].billPayAccountId != billPayAccountIdSrch) {
					noBillerHistCount += 1;
					continue;
				}
				if (sortedHistTrans[counter].id != divId) {
					$("#mobilePdf" + sortedHistTrans[counter].id).hide();
				}
			}
			$("#mobilePdf" + divId).toggle();
		});
	}
	/* To hide the progress bar */
	hideProgressBar();
}

/********************************************************************************************
 Name                 :   createHistroyRowMobile
 Return type          :   String dateLabelMobile
 Input Parameter(s)   :   Object historyRowDataMobile
 Purpose              :   This method is used for crating the row for mobile layout on the basis of
 BP_HIST API response.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function createHistroyRowMobile(historyRowDataMobile) {
    var dateLabelMobile = "";
    var paymentStatusMobile = getStatusForMobile(historyRowDataMobile.status, historyRowDataMobile.projectedPostingDate);

    if (historyRowDataMobile.status === payment_status_constant.PENDING || historyRowDataMobile.status === payment_status_constant.PAID) {
    	if (historyRowDataMobile.projectedPostingDate){
    		dateLabelMobile = convertToDatemmddyyForHistory(convertTimeToPST(historyRowDataMobile.projectedPostingDate));
    	}
    } else if (historyRowDataMobile.status != payment_status_constant.PENDING && historyRowDataMobile.status != payment_status_constant.PAID){ 
    	dateLabelMobile = convertToDatemmddyyForHistory(convertTimeToPST(historyRowDataMobile.updateDate));
    }
    var mobileHistoryRow = "<div class='tbl_pmt_hist_bg cursor_def cursor_def_imp' id='mobileTxRow'>";
    if(historyRowDataMobile.cartId != null){
    	/*Redirecting to the receipt view to those transactions that does have the receipt id in BP_HIST transaction object*/
        mobileHistoryRow = "<div class='tbl_pmt_hist_bg cursor_def' id='mobileTxRow_" 
        					+ historyRowDataMobile.id + "' onclick=\"navigateToReceiptView('" 
        					+ historyRowDataMobile.cartId+ "',false)\">";
    }else if(historyRowDataMobile.billPayResponseMsg && historyRowDataMobile.cartId === null && 
    		historyRowDataMobile.status != payment_status_constant.SCHEDULED_CANCELLED){
    	/*Showing popup for those payments that are failed due to some technical reasons and not canceled by the user.*/
    	mobileHistoryRow = "<div class='tbl_pmt_hist_bg cursor_def' id='mobileTxRow_" 
    						+ historyRowDataMobile.id + "' onclick=\"schedulePayFailedPopup('" 
    						+ historyRowDataMobile.billPayResponseMsg + "')\">";
    }
    mobileHistoryRow += "<div class='pmt_hist_status' >"
			            + getStatusImageForMobile(historyRowDataMobile.status, historyRowDataMobile.projectedPostingDate)
			            + "</div>"
			            + "<div class='pmt_hist_service_prov'>"
			            + "<div class='pmt_hist_nm_heading mob_max_100'>"
			            + historyRowDataMobile.accountNickname
			            + "</div>"
			            + "<div class='pmt_hist_dttxt'>"
			            + paymentStatusMobile
			            + dateLabelMobile
			            + "</div>";
    if(historyRowDataMobile.cartId != null && historyRowDataMobile.cartId != undefined 
    		&& historyRowDataMobile.cartId !=0 /*&& historyRowDataMobile.paymentReasonCode != null ////Fix for Bug #5025*/){
    	mobileHistoryRow += "<div class='pmt_hist_dttxt'>"
			    		+ getPaymentReceiptNoForMobile(historyRowDataMobile.cartId)
			    		+ "</div>";
    /*} else if(historyRowDataMobile.paymentReasonCode === null){ //Fix for Bug #5025*/
    } else if(historyRowDataMobile.cartId === null){
    	mobileHistoryRow += "<div class='pmt_hist_dttxt'>"
			    		+ getSchedulePaymentRefNoForMobile(historyRowDataMobile.id)
			    		+ "</div>";
    }
    mobileHistoryRow += "</div>"
			            + "<div class='pmt_hist_amount_area'>"
			            + getFormatedNumber((historyRowDataMobile.amount + historyRowDataMobile.fee), true)
			            + "</div>"
			            + "</div>"
			            + "<div class='clear'></div>";
    return mobileHistoryRow;
}

/********************************************************************************************
Name                 :   schedulePayFailedPopup
Return type          :   NA
Input Parameter(s)   :   String billPayResponseMsg
Purpose              :   This method will be called when the user want to get the reason 
for that particular payment by clicking on that item, only in case of scheduled_canceled payments. 
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   21st May, 2014   -   Ravi Raj
*******************************************************************************************/
function schedulePayFailedPopup(billPayResponseMsg){
	if(billPayResponseMsg != null && billPayResponseMsg){
		$('#failResponseMsgId').text(billPayResponseMsg);
		showAnimatedPopup('schedFailId', 'scheduledPayFailedPopup');
	}
}

/********************************************************************************************
 Name                 :   getPaymentRefNoForMobile
 Return type          :   String
 Input Parameter(s)   :   Long cartId
 Purpose              :   To get the payment ref no text for mobile width.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function getPaymentReceiptNoForMobile(cartId) {
    if (cartId != 0 && cartId != null && cartId != undefined) {
        return messages['paymentHistory.confirm_num'] + " " + cartId;
    }
    return "";
}

/********************************************************************************************
Name                 :   getSchedulePaymentRefNoForMobile
Return type          :   String
Input Parameter(s)   :   Long scheduleRefId
Purpose              :   To get the payment ref no text for mobile width.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   12th May, 2014  -   Ravi Raj
*******************************************************************************************/
function getSchedulePaymentRefNoForMobile(scheduleRefId) {
    if (scheduleRefId != 0 && scheduleRefId != null && scheduleRefId != undefined) {
        return messages['paymentHistory.ref'] + " " + scheduleRefId;
    }
    return "";
}

/********************************************************************************************
 Name                 :   getImageWithPaymentStatus
 Return type          :   String
 Input Parameter(s)   :   Sting status, Date projectedPostingDate
 Purpose              :   To get the payment status image with the payment status text.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function getImageWithPaymentStatus(status, projectedPostingDate, idToCancel, updateDate) {
	var statusIconWithDate = "";
	if ((status === payment_status_constant.PENDING) || (status === payment_status_constant.PAID 
			&& (new Date().getTime() < projectedPostingDate))) {
		statusIconWithDate = "<div class='fa fa-spinner fa-2x pending_icon'></div>"
							+ messages['latestPayment.pending']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(projectedPostingDate));
		
	} else if (status === payment_status_constant.PAID && (new Date().getTime()) >= projectedPostingDate) {
		statusIconWithDate = "<div class='fa fa-check fa-2x delivered_icon'></div>"
							+ messages['latestPayment.delivered']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(projectedPostingDate));
		
	} else if (status === payment_status_constant.SCHEDULED || status === payment_status_constant.SCHEDULED_PENDING ||
			status === payment_status_constant.SCHEDULED_PROCESSING) {
		var callFrom = callFrom_constant.BILL_STATUS_CANCEL_CALL;
		statusIconWithDate = "<div class='fa fa-times fa-2x scheduled_icon' onClick = 'cancelScheduledPayments("+ idToCancel +",\""+callFrom+"\")'></div>"
							+ messages['paymentHistory.schedulePendMsg']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(projectedPostingDate));
		
	}else if (status === payment_status_constant.RETURNED) {
		statusIconWithDate = "<div class='fa fa-mail-reply fa-2x failed_icon'></div>"
							+ messages['paymentHistory.returned']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(updateDate));
				        
    } else if (status === payment_status_constant.SCHEDULED_CANCELLED) {
		statusIconWithDate = "<div id='cancelIconId' class='fa fa-ban fa-2x canceled_icon cursor_def_imp'></div>" 
							+ messages['billStatus.cancelledLabel']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(updateDate));
		
	} else { 
		statusIconWithDate = "<div class='fa fa-exclamation fa-2x failed_icon'></div>"
							+ messages['latestPayment.failed']
							+ "</td><td class='Delivery date' id='deliveryDateId'>"
							+ convertToDatemmddyyForHistory(convertTimeToPST(updateDate));
	}
	return statusIconWithDate;
}

/********************************************************************************************
 Name                 :   getStatusImageForMobile
 Return type          :   String
 Input Parameter(s)   :   Sting status, Date projectedPostingDate
 Purpose              :   To get the image for status for Mobile width layout.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function getStatusImageForMobile(status, projectedPostingDate, cartItemId) {
    if ((status === payment_status_constant.PENDING) || (status === payment_status_constant.PAID && 
    		(new Date().getTime() < projectedPostingDate))) {
        return "<div class='pending_icon_big fa fa-spinner fa-2x'></div>";
        
    } else if (status === payment_status_constant.PAID && (new Date().getTime()) >= projectedPostingDate) {
        return "<div class='delivered_icon_big fa fa-check fa-2x'></div>";
        
    } else if (status === payment_status_constant.SCHEDULED || status === payment_status_constant.SCHEDULED_PENDING ||
			status === payment_status_constant.SCHEDULED_PROCESSING) {
    	var callFrom = callFrom_constant.BILL_STATUS_MOB_CANCEL_CALL;
        return "<div class='schedule_pend_icon_big fa fa-times fa-2x' onClick = 'cancelScheduledPayments("+ cartItemId +",\""+callFrom+"\")'></div>";
        
    } else if (status === payment_status_constant.RETURNED) {
        return "<div class='failed_icon_big fa fa-mail-reply fa-lg fa-2x'></div>";
        
    }else if (status === payment_status_constant.SCHEDULED_CANCELLED) {
		return "<div class='canceled_icon_big fa fa-ban fa-2x cursor_def_imp'></div>";
		
	} else {
        return "<div class='failed_icon_big fa fa-exclamation fa-2x'></div>";
    }
}

/********************************************************************************************
 Name                 :   getStatus
 Return type          :   String
 Input Parameter(s)   :   Sting status, Date projectedPostingDate
 Purpose              :   To get the status for Standard width layout.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function getStatus(status, projectedPostingDate) {
    if ((status === payment_status_constant.PENDING) || (status === payment_status_constant.PAID &&
    		(new Date().getTime() < projectedPostingDate))) {
        return messages['latestPayment.pending'];
    } else if (status === payment_status_constant.PAID && (new Date().getTime()) >= projectedPostingDate) {
        return messages['latestPayment.delivered'];
    } else {
        return messages['latestPayment.failed'];
    }
}

/********************************************************************************************
 Name                 :   getStatusForMobile
 Return type          :   String
 Input Parameter(s)   :   Sting status, Date projectedPostingDate
 Purpose              :   To get the status for Mobile width layout.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function getStatusForMobile(status, projectedPostingDate) {
    if ((status === payment_status_constant.PENDING) || (status === payment_status_constant.PAID &&
    		(new Date().getTime() < projectedPostingDate))) {
        return messages['paymentHistory.pendingmsg'] + " ";
        
    } else if (status === payment_status_constant.PAID && (new Date().getTime()) >= projectedPostingDate) {
        return messages['paymentHistory.deliveredMsg'] + " ";
        
    } else if (status === payment_status_constant.SCHEDULED_CANCELLED) {
        return messages['billStatus.cancelledLabelMob']+ " ";
        
    }else if (status === payment_status_constant.RETURNED) {        
        return messages['billStatus.returnOnLabel']+ " ";
        
    } else if (status === payment_status_constant.SCHEDULED || status === payment_status_constant.SCHEDULED_PENDING || 
    		status === payment_status_constant.SCHEDULED_PROCESSING) {
        return messages['paymentHistory.schedulePendMsg'] + " ";
        
    } else {
    	return messages['billView.failedLabel'] + " ";
    }
}

/********************************************************************************************
 Name                 :   createDateFormat
 Return type          :   String
 Input Parameter(s)   :   Date timeInMillis
 Purpose              :   To get the date in (month day, year) format. (ex Jan 31, 2012).
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   6th June, 2013   -   Ravi Raj
 *******************************************************************************************/
function createDateFormat(timeInMillis) {
    if (timeInMillis != null) {
        /*var months = new Array();
        months = messages['payYourBill.monthNames'].split(",");*/
        var currentTime = new Date(timeInMillis);
        var month = /*months[*/currentTime.getMonth()/*]*/;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        return (month + "/" + day + "/" + year);
    }
    return "";
}

/********************************************************************************************
 Name                 :   getDataForRow
 Return type          :   String
 Input Parameter(s)   :   Long printBtnid
 Purpose              :   Callback method for row click to hide or show the "Print, Save and
 Email" buttons.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   13th March, 2013   -   Pradeep Yadav
 *******************************************************************************************/
function getDataForRow(printBtnid) {
    var billerObj = new Object();
    var $currentRow = $("#" + printBtnid).closest('tr');
    billerObj.nickName = $currentRow.find(".Nickname").text();
    billerObj.amount = $currentRow.find(".Amount").text();
    billerObj.amountFee = $currentRow.find("#txFeeId").text();
    billerObj.confNumber = $currentRow.find("#confNumId").text();

    $currentRow.find("#deliveryDateId").find("span").remove();

    billerObj.deliveryDate = $currentRow.find("#deliveryDateId").text();
    billerObj.paymentDate = $currentRow.find("#paymentDateId").text();
    var queryStringForURL = "nickName=" + billerObj.nickName
            + "&amount=" + billerObj.amount
            + "&amountFee=" + billerObj.amountFee
            + "&confNumber=" + billerObj.confNumber
            + "&deliveryDate=" + billerObj.deliveryDate
            + "&paymentDate=" + billerObj.paymentDate;
    return queryStringForURL;
}

/********************************************************************************************
 Name                 :   getBillerNickName_EMail
 Return type          :   String
 Input Parameter(s)   :   Long emailBtnid
 Purpose              :   Send email attachment pdf request to paymentReceipt servlet.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   13th March, 2013   -   Pradeep Yadav
 *******************************************************************************************/
function getBillerNickName_EMail(emailBtnid) {
    var $currentRow = $("#" + emailBtnid).closest('tr');
    return $currentRow.find(".Nickname").text();
}

/********************************************************************************************
 Name                 :   getContextRoot
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   function function get the path of paymentReceipt servlet
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   13th March, 2013   -   Pradeep Yadav
 *******************************************************************************************/
function getContextRoot() {
    var base = document.URL;
    var contextPath = base.substr(0, base.indexOf("/", base.indexOf("/", base.indexOf("//") + 2) + 1));
    return contextPath + "/paymentReceiptPdf";
}

/********************************************************************************************
 Name                 :   pdfGenerator
 Return type          :   Boolean
 Input Parameter(s)   :   String url, Object data
 Purpose              :   send data to specified URL by creating dynamic form.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   13th March, 2013   -   Pradeep Yadav
 *******************************************************************************************/
function pdfGenerator(url, data) {
    //url and data options required
    if (url && data) {
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        //send request
        jQuery('<form action="' + url + '" method="post" target="_blank">' + inputs +
                       '</form>').appendTo('body').submit().remove();
        return false;
    }
}
