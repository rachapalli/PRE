
/********************************************************************************************
' Name                 :   createConfirmationPopupResponse
' Return type          :   void
' Input Parameter(s)   :   responseJsonObj, bp_scheduled_payment_hist_obj
' Purpose              :   This method is called on success of payment after checking status .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createConfirmationPopupResponse(flag) {
	$('#mainContainerForConfirmation').empty();
	$("#mainContainerForErrorConfirmation").empty();
	if (bp_cart_receipt_obj) { /* null check BP_CART_RECEIPT response object*/
		if (bp_scheduled_payment_hist_obj) { /* null check BP_SCHEDULE_PAYMENT_HIST response object*/
			if (bp_scheduled_payment_hist_obj.scheduledTransactions 
					&& bp_scheduled_payment_hist_obj.scheduledTransactions.length > 0) {
				/* If BP_SCHEDULE_PAYMENT_HIST exists then merge required data with BP_CART_RECEIPT*/
				bp_cart_receipt_obj.scheduledTransactions = bp_scheduled_payment_hist_obj.scheduledTransactions;
				bp_cart_receipt_obj.paymentCards = bp_scheduled_payment_hist_obj.paymentCards;
				/*for(var index in bp_cart_receipt_obj.fundingSources){
					if(bp_cart_receipt_obj.fundingSources[index].type === jsonTypeConstant.PROMOCREDIT){
						bp_cart_receipt_obj.promoCodes = bp_cart_receipt_obj.fundingSources[index];
						break;
					}else{
						bp_cart_receipt_obj.promoCodes = null;
					}
				}*/
				bp_cart_receipt_obj.promoCodes = bp_scheduled_payment_hist_obj.promoCodes;
			}
		}
		/* BP_CART_RECEIPT response exists then transactions must be exists*/
		if (bp_cart_receipt_obj.submittedBills && bp_cart_receipt_obj.submittedBills.length > 0) {
			confirmationSummaryPopup(bp_cart_receipt_obj, flag); /* Passing merged API data and making design for confirmation*/
			return;
		}
	} else {
		/* BP_CART_RECEIPT response does't contain anything then assign BP_SCHEDULE_PAYMENT_HIST to bp_cart_receipt_obj */ 
		bp_cart_receipt_obj = bp_scheduled_payment_hist_obj;
		/* Check for the scheduled transactions */
		if(bp_cart_receipt_obj.scheduledTransactions && bp_cart_receipt_obj.scheduledTransactions.length > 0){
			confirmationSummaryPopup(bp_cart_receipt_obj, flag); /* Passing merged API data and making design for confirmation*/
			if(bp_scheduled_payment_hist_obj){
				bp_cart_receipt_obj = null;
			}
			return;
		}
	}
}

/********************************************************************************************
' Name                 :   confirmationSummaryPopup
' Return type          :   void
' Input Parameter(s)   :   responseJsonObj
' Purpose              :   This method is called to initialize fee and amount .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function confirmationSummaryPopup(responseJsonObj, flag) {
	var confirmationViewTransction = new Object();
	var submittedBills = responseJsonObj.submittedBills;
	var scheduledTransactions = responseJsonObj.scheduledTransactions;
	for (var index in submittedBills) {
		if($.isNumeric(index)){
			/* Checking if confirmationViewTransction contains the object with confirmationViewTransction or not. 
			 * If not exists then create a new object and initialize its fields */
			if (!confirmationViewTransction['transactionInfo']) {
				confirmationViewTransction['transactionInfo'] = new Object();
				confirmationViewTransction['transactionInfo'].billAmount = 0;
				confirmationViewTransction['transactionInfo'].fees = 0;
				confirmationViewTransction['transactionInfo'].serviceFee = 0;
				confirmationViewTransction['transactionInfo'].subTotal = 0;
				confirmationViewTransction['transactionInfo'].totalPaid = 0;
			}
			/* Checking if transaction is not rejected means PAID, PENDING or RETURNED, calculate the payment amount */
			if (checkForPaidStatus(submittedBills[index].status)) {
				confirmationViewTransction['transactionInfo'].billAmount	+= submittedBills[index].amount;
				confirmationViewTransction['transactionInfo'].fees			+= submittedBills[index].fee;
				confirmationViewTransction['transactionInfo'].serviceFee	+= submittedBills[index].serviceFee;
				confirmationViewTransction['transactionInfo'].subTotal		+= submittedBills[index].amount 
																			+ submittedBills[index].fee;
				confirmationViewTransction['transactionInfo'].totalPaid		+= submittedBills[index].amount 
																			+ submittedBills[index].fee
																			+ submittedBills[index].serviceFee;
			}
		}
	}

	for (var index in scheduledTransactions) {
		if(bp_submit_payment_group_obj.paymentGroupId === scheduledTransactions[index].paymentGroupId){
			if($.isNumeric(index)){
				/*Checking if confirmationViewTransction contains the object with confirmationViewTransction or not. 
				 * If not exists then create a new object and initialize its fields */
				if (!confirmationViewTransction['ScheduleInfo']) {
					confirmationViewTransction['ScheduleInfo'] = new Object();
					confirmationViewTransction['ScheduleInfo'].billAmount = 0;
					confirmationViewTransction['ScheduleInfo'].fees = 0;
					confirmationViewTransction['ScheduleInfo'].serviceFee = 0;
					confirmationViewTransction['ScheduleInfo'].subTotal = 0;
					confirmationViewTransction['ScheduleInfo'].totalPaid = 0;
				} 
				confirmationViewTransction['ScheduleInfo'].billAmount += scheduledTransactions[index].amount;
				confirmationViewTransction['ScheduleInfo'].fees += scheduledTransactions[index].fee;
				confirmationViewTransction['ScheduleInfo'].serviceFee += scheduledTransactions[index].serviceFee;
				confirmationViewTransction['ScheduleInfo'].subTotal += scheduledTransactions[index].amount + scheduledTransactions[index].fee;
				confirmationViewTransction['ScheduleInfo'].totalPaid += scheduledTransactions[index].amount 
																	 + scheduledTransactions[index].fee
																	 + scheduledTransactions[index].serviceFee;
			}
		}
	}

	/* Calling this method for showing detail summary view on confirmation page. */
	confirmationPopupView(responseJsonObj, confirmationViewTransction, flag);
}


/********************************************************************************************
' Name                 :   confirmationPopupView
' Return type          :   void
' Input Parameter(s)   :   responseJsonObj, confirmationViewTransction
' Purpose              :   This method is called to design the confirmation pop ups on click of View details button .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function confirmationPopupView(responseJsonObj, confirmationViewTransction, flag) {
	var submittedBills = responseJsonObj.submittedBills;
	var fundingSources = responseJsonObj.fundingSources ? responseJsonObj.fundingSources : responseJsonObj.paymentCards;
	var scheduledTransactions = responseJsonObj.scheduledTransactions;
	var paymentCards = responseJsonObj.paymentCards;
	var promoCodes = responseJsonObj.promoCodes;
	var confirmationPaymentRows = "";
	var confirmationPaymentRowsForFailed = "";
	var paymentAppliedInfo = new Object();
	paymentAppliedInfo.totalBillAmount = 0;
	paymentAppliedInfo.totalPaymentApplied = 0;
	paymentAppliedInfo.amountDue = 0;
	paymentAppliedInfo.amountDueTotal = 0;
	paymentAppliedInfo.creditAmount = 0;
	paymentAppliedInfo.promoAmount = 0;
	paymentAppliedInfo.serviceFee = 0;
	var detailConfirmation = ""; 
	var detailConfirmationForFailure = "";
	var includedAllPaymentRows = "";
	var includedAllPaymentRowsForFailure = "";
	var paymentSuccessful = false;
	var serviceFeePercent = calculateServiceFeePercent(fundingSources);
	if(submittedBills && submittedBills.length > 0){
		submittedBills.sort(sortByDeliverydate);
		for(var index=0; index < submittedBills.length; index++){/* Iterating submittedBills for projectedDate and posting category Label */
			if (checkForPaidStatus(submittedBills[index].status)) { 
				paymentSuccessful = true;
				confirmationPaymentRows += createSecForAllSubmittedPayments(index, submittedBills[index], paymentAppliedInfo);
			} else {
				/* Create section for Failed payments and don't include due amount and credits and dates as well */
				confirmationPaymentRowsForFailed += createSecForAllFailedPayments(index, submittedBills[index]);
			}
		}
	}
	
	if(scheduledTransactions && scheduledTransactions.length > 0){
		scheduledTransactions.sort(sortByDeliverydateForSchedule);
		for(var index in scheduledTransactions){
			if(bp_submit_payment_group_obj.paymentGroupId === scheduledTransactions[index].paymentGroupId){
				paymentSuccessful = true;
				/* Create section for all submitted payments */
				confirmationPaymentRows += createSecForAllSubmittedPayments(index, scheduledTransactions[index], paymentAppliedInfo);
				for (var cardIndex in paymentCards) {
					if (!serviceFeePercent) {
						if (scheduledTransactions[index].paymentCardId === paymentCards[cardIndex].id) {
							if (paymentCards[cardIndex].fundingPartnerFeeConfig.cardBrand 
									&& paymentCards[cardIndex].fundingPartnerFeeConfig.tenderType) {
								serviceFeePercent = paymentCards[cardIndex].fundingPartnerFeeConfig.serviceFeePercent;
								break;
							}
						}
					}
				}
			}
		}
	}
	
	if(confirmationPaymentRows){ /* Null check for cobnfirmationPaymentRows */
    	includedAllPaymentRows += confirmationPaymentRows;
    							
    }
	if(confirmationPaymentRowsForFailed){
		includedAllPaymentRowsForFailure += confirmationPaymentRowsForFailed;
	}
    detailConfirmation += includedAllPaymentRows;
    detailConfirmationForFailure += includedAllPaymentRowsForFailure;
    /* Adding amount and fee section */
    var secForAmountFee = createSecForAmountFee(confirmationViewTransction, paymentSuccessful, fundingSources, paymentAppliedInfo, serviceFeePercent);
    if(secForAmountFee){
    	detailConfirmation += secForAmountFee;
    }
    /* Adding Credits and PROMO section */
    var secForPromoCredit = createSecForCreditsAndPromo(fundingSources , paymentSuccessful, paymentAppliedInfo, promoCodes);
    if(secForPromoCredit){
    	detailConfirmation += secForPromoCredit;
    }
    
   	paymentAppliedInfo.totalPaymentApplied = paymentAppliedInfo.totalBillAmount 
   											- (paymentAppliedInfo.promoAmount 
										   	+ paymentAppliedInfo.creditAmount);	
    
   	paymentAppliedInfo.amountDueTotal = paymentAppliedInfo.amountDue 
   									  - (paymentAppliedInfo.promoAmount 
   									  + paymentAppliedInfo.creditAmount);	
	
    var secForDue = createSecForAmountDue(paymentAppliedInfo, paymentSuccessful);
    /* Adding amount and Due section */
    if(secForDue){
    	detailConfirmation += createSecForAmountDue(paymentAppliedInfo, paymentSuccessful);
    }
    
    /* Final structure is appended to mainContainerForConfirmation id */
    if(detailConfirmation && flag){
    	$('#mainContainerForConfirmation').append(detailConfirmation);
    	showAnimatedPopup('popupNoErrorId','credPopupNoErrorId');
    }
	/*$('#mainContainerForConfirmation').append(detailConfirmation);*/
    if(detailConfirmationForFailure && !flag){
    	$('#mainContainerForErrorConfirmation').append(detailConfirmationForFailure);
    	showAnimatedPopup('popupErrorId','credPopupErrorId');
    }
}

/********************************************************************************************
' Name                 :   sortByDeliverydate
' Return type          :   sorted date
' Input Parameter(s)   :   transactions1, confirmationViewTransction
' Purpose              :   This method is called to sort the delivery date for transaction.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   27th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function sortByDeliverydate(transactions1, transactions2){
	  var transOnePstDate = transactions1.projectedPostingDate;
	  var transTwoPstDate = transactions2.projectedPostingDate; 
	  return ((transOnePstDate < transTwoPstDate) ? -1 : ((transOnePstDate > transTwoPstDate) ? 1 : 0));
}

/********************************************************************************************
' Name                 :   confirmationPopupView
' Return type          :   date
' Input Parameter(s)   :   transactions1, transactions2
' Purpose              :   This method is called to sort the delivery date for scheduled transactions.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   27th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function sortByDeliverydateForSchedule(transactions1, transactions2){
	  var transOnePstDate = transactions1.requestedPostDate;
	  var transTwoPstDate = transactions2.requestedPostDate; 
	  return ((transOnePstDate < transTwoPstDate) ? -1 : ((transOnePstDate > transTwoPstDate) ? 1 : 0));
}

/********************************************************************************************
' Name                 :   createSecForAllSubmittedPayments
' Return type          :   confirmSectionForFee
' Input Parameter(s)   :   index, submittedBills, paymentAppliedInfo
' Purpose              :   This method is to create section for biller and delivery time .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecForAllSubmittedPayments(index, submittedBills, paymentAppliedInfo) {
	/* Section for biller nick name and amount */
	var scheduledSubmitDate = '';
	var projectedDate = '';
	var nickName = submittedBills.accountNickName ? submittedBills.accountNickName : submittedBills.billerName;
	if(submittedBills.scheduledSubmitDate){
		scheduledSubmitDate =  convertToDateddmmFormat(convertTimeToPST(submittedBills.scheduledSubmitDate));
	}
	if(submittedBills.projectedPostingDate){
		projectedDate = convertToDateddmmFormat(convertTimeToPST(submittedBills.projectedPostingDate));
	}
	var date = convertToDateddmmFormat(convertTimeToPST(new Date().getTime()));
	var secForSuccessfulPayments = '<div class="wid_flt100">' 
								+    '<div class="wid_flt100 mrgn_top10">'
		        				+ 		'<div class="wid_flt60 biller_compress_summary" id="nickName_success_conf' + index + '">'
		        				+ 			nickName
		        				+ 		'</div>'
		        				+ 		'<div class="wid_flt40 txt_nwrght" id="amount_success_conf' + index + '">'
		        				+ 			getFormatedNumber(submittedBills.amount, true)
		        				+ 		'</div>'
								+	'</div>';
	/* Display fee with biller processing speed if not 0 */
	if(submittedBills.fee > 0) {
		secForSuccessfulPayments += '<div class="wid_flt60 confirmation_detailnoBtm">'
								+ 		messages['main_pay.confirm.expressFee']
								+ '<span class="fa fa-bolt fa-lg express_icon_history"></span>'
								+ 	'</div>'
								+ 	'<div class="wid_flt30 txt_nwrght">'
								+ 		getFormatedNumber(submittedBills.fee, true)
								+ 	'</div>';
	}
	/* Checking if the respective project posting date is available or not */
	if(projectedDate) {
		if(isSameDay(projectedDate, date)){ /* Checking respective project posting date and current date is same are not */
			secForSuccessfulPayments += '<div>'
										+ 		'<div class="wid_flt70 confirmation_detailnoBtm">' 
										+ 			messages['main_pay.confirm_deliverToday'] 
										+ 		'</div>'
										+		'<div class="wid_flt70 confirmation_detailnoBtm">'
										+ 			messages['main_pay.confirm.charge_label']
										+		'</div>'
										+ '</div>'
										+ '</div>';
			paymentAppliedInfo.totalBillAmount += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;
			paymentAppliedInfo.amountDue += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;
		} else { /* Checking respective project posting date is greater than current date */
			var convertedDate = convertToDatemmddyy(convertTimeToPST(submittedBills.projectedPostingDate));
			secForSuccessfulPayments += '<div class="">'
										+ 		'<div class="wid_flt70 confirmation_detailnoBtm">' 
										+ 			formatMessage(messages['main_pay.popup.deliver_by'], convertedDate.month, convertedDate.day, convertedDate.year)
										+ 		'</div>'
										+		'<div class="wid_flt70 confirmation_detailnoBtm">'
										+ 			messages['main_pay.confirm.charge_label']
										+		'</div>'
										+ '</div>';
			paymentAppliedInfo.amountDue += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;/* Adding fee and amount to paymentAppliedInfo.amountDue */
			paymentAppliedInfo.totalBillAmount += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;
		}
		
	}
	if(scheduledSubmitDate){ 
		if(isSameDay(scheduledSubmitDate, date)){
			var convertedDate = convertToDatemmddyy(convertTimeToPST(submittedBills.requestedPostDate));
			secForSuccessfulPayments += '<div>'
									+		'<div class="wid_flt70 confirmation_detailnoBtm">'
									+ 			formatMessage(messages['main_pay.popup.deliver_by'], convertedDate.month, convertedDate.day, convertedDate.year)
									+		'</div>'
									+		'<div class="wid_flt70 confirmation_detailnoBtm">'
									+ 			messages['main_pay.confirm.charge_label']
									+		'</div>'
									+ '</div>'
									+ '</div>';
			paymentAppliedInfo.amountDue += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee; 
			paymentAppliedInfo.totalBillAmount += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;
		} else {
			var requestedPostDate = convertToDatemmddyy(convertTimeToPST(submittedBills.requestedPostDate));
			var scheduledSubmitDate = convertToDatemmddyy(convertTimeToPST(submittedBills.scheduledSubmitDate));
			secForSuccessfulPayments += '<div class="">'
									+		'<div class="wid_flt70 confirmation_detailnoBtm">'
									+ 			formatMessage(messages['main_pay.popup.deliver_by'], requestedPostDate.month, requestedPostDate.day, requestedPostDate.year)
									+		'</div>'
									+ 		'<div class="wid_flt70 confirmation_detailnoBtm">' 
									+ 			formatMessage(messages['main_pay.popup.charge'], scheduledSubmitDate.month, scheduledSubmitDate.day, scheduledSubmitDate.year)
									+ 		'</div>'
									+ '</div>';
			paymentAppliedInfo.amountDue += submittedBills.fee + submittedBills.amount + submittedBills.serviceFee;
		}
	}
	return secForSuccessfulPayments;
}

/********************************************************************************************
' Name                 :   createSecForAmountFee
' Return type          :   confirmSectionForFee
' Input Parameter(s)   :   confirmationViewTransction, paymentSuccessful, fundingSources, paymentAppliedInfo
' Purpose              :   This method is to create section for Fee and Amount .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecForAmountFee(confirmationViewTransction, paymentSuccessful, fundingSources, paymentAppliedInfo, serviceFeePercent) {
	var confirmSectionForFee = "";
	var billAmount = 0;
	var fee = 0;
	var serviceFee = 0;
	var billFeeTotal = 0;
	if(confirmationViewTransction.transactionInfo){ /* null check for transaction info object*/
		/* Null check and Make sure that billAmount > 0 then calculate billAmount and store in to variable*/
		if(confirmationViewTransction.transactionInfo.billAmount 
				|| (paymentSuccessful && confirmationViewTransction.transactionInfo.billAmount === 0)){
			billAmount += parseFloat(confirmationViewTransction.transactionInfo.billAmount * 1);
		}
		/* Null check and Make sure that Fee > 0 then calculate Fee and store in to variable*/
		if(confirmationViewTransction.transactionInfo.fees 
				|| (!paymentSuccessful && confirmationViewTransction.transactionInfo.fees === 0)){
			fee += parseFloat(confirmationViewTransction.transactionInfo.fees * 1);
		}
		
		if(confirmationViewTransction.transactionInfo.serviceFee 
				|| (!paymentSuccessful && confirmationViewTransction.transactionInfo.serviceFee === 0)){
			serviceFee += parseFloat(confirmationViewTransction.transactionInfo.serviceFee * 1);
		}
		
		if(confirmationViewTransction.transactionInfo.totalPaid 
				|| (!paymentSuccessful && confirmationViewTransction.transactionInfo.totalPaid === 0)){
			billFeeTotal += parseFloat(confirmationViewTransction.transactionInfo.totalPaid * 1);
		}
	}
	
	if(confirmationViewTransction.ScheduleInfo){/* Null check for ScheduleInfo Object*/
		/* Null check and Make sure that billAmount > 0 then calculate billAmount and store in to variable*/
		if(confirmationViewTransction.ScheduleInfo.billAmount 
				|| (paymentSuccessful && confirmationViewTransction.ScheduleInfo.billAmount === 0)){
			billAmount += parseFloat(confirmationViewTransction.ScheduleInfo.billAmount * 1);
		}
		/* Null check and Make sure that Fee > 0 then calculate Fee and store in to variable*/
		if(confirmationViewTransction.ScheduleInfo.fees 
				|| (!paymentSuccessful && confirmationViewTransction.ScheduleInfo.fees === 0)){
			fee += parseFloat(confirmationViewTransction.ScheduleInfo.fees * 1);
		}
		
		if(confirmationViewTransction.ScheduleInfo.serviceFee 
				|| (!paymentSuccessful && confirmationViewTransction.ScheduleInfo.serviceFee === 0)){
			serviceFee += parseFloat(confirmationViewTransction.ScheduleInfo.serviceFee * 1);
		}
		
		if(confirmationViewTransction.ScheduleInfo.totalPaid 
				|| (!paymentSuccessful && confirmationViewTransction.ScheduleInfo.totalPaid === 0)){
			billFeeTotal += parseFloat(confirmationViewTransction.ScheduleInfo.totalPaid * 1);
		}
	}
	
	if(billAmount && billAmount > 0){ /* Checking for null and amount existence*/
		confirmSectionForFee += '<div>'
							+ '<div class="wid_flt100 mrgn_top10" >'
				    		+ 	'<div class="wid_flt50" >'
				            + 		messages['detailView.billAmount']
				            + 	'</div>'
				            + 	'<div class="wid_flt50 txt_nwrght">'
				            + 		getFormatedNumber(billAmount, true)
				            + 	'</div>'
				            + '</div>';
	}
	
	if(fee && fee > 0){/* Checking for null and amount existence*/
		confirmSectionForFee += '<div class="wid_flt60">'
							+ 	messages['main_pay.confirm.fees_label']
							+ '</div>'
							+ '<div class="wid_flt40 txt_nwrght">'
							+ 	getFormatedNumber(fee, true)
							+ '</div>'
							+ '</div>';
	}
	if(!fee && !billAmount) { /* All the above conditions Fails then Close the div's which is unclosed*/
		confirmSectionForFee += '</div></div>';
	}
	
	if(serviceFee && serviceFee > 0 && serviceFeePercent > 0){/* Checking for null and amount existence*/
		confirmSectionForFee += '<div class="wid_flt60">'
							+ 	formatMessage(messages['receipt.serviceFee'], serviceFeePercent)
							+ '</div>'
							+ '<div class="wid_flt40 txt_nwrght">'
							+ 	getFormatedNumber(serviceFee, true)
							+ '</div>'
							+ '</div>';
	}
	
	if(billFeeTotal && billFeeTotal > 0){/* Checking for null and amount existence*/
		confirmSectionForFee += '<div class="wid_flt60 fnt_wt">'
							+ 	messages['detailView.billFeeTotal']
							+ '</div>'
							+ '<div class="wid_flt40 txt_nwrght fnt_wt">'
							+ 	getFormatedNumber(billFeeTotal, true)
							+ '</div>'
							+ '</div>';
	}
	
	return confirmSectionForFee;
}

/********************************************************************************************
' Name                 :   createSecForCreditsAndPromo
' Return type          :   confirmSectionForCreditAndPromo
' Input Parameter(s)   :   fundingSources, paymentSuccessful, paymentAppliedInfo, promoCodes
' Purpose              :   This method is to create section for Credits and Promo code.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecForCreditsAndPromo(fundingSources, paymentSuccessful, paymentAppliedInfo, promoCodes) {
	var confirmSectionForCreditAndPromo = "";
	var promoAmount = 0;
	if(paymentSuccessful){
	if(fundingSources && fundingSources.length !== 0) {
		 for (var index = 0; index < fundingSources.length; index++) {
			 if(fundingSources[index].type === "Credit"){
				confirmSectionForCreditAndPromo +='<div class="wid_flt50 fnt_itc">'
												 + 		messages['main_pay.confirm.credits_applied']
												 +  '</div>'
												 +  '<div class="wid_flt50 fnt_itc txt_nwrght">'
												 + 	'<span class="content_minus"></span>'	
												 +      getFormatedNumber(fundingSources[index].amount, true)
												 +  '</div>';	
		 		paymentAppliedInfo.creditAmount  += fundingSources[index].amount; /* Added creditsTotal to promoCreditAmount variable for calculating amount paid */
			 } else if (fundingSources[index].type === "PromoCredit") {
				confirmSectionForCreditAndPromo +='<div class="wid_flt60 fnt_itc">'
												 + 		messages['main_pay.confirm.promoApplied']
												 +  '</div>'
												 +  '<div class="wid_flt40 txt_nwrght fnt_itc">'
												 + 		"-"
												 +      getFormatedNumber(fundingSources[index].amount, true)
												 +  '</div>';
				paymentAppliedInfo.promoAmount  += fundingSources[index].amount; /* Added creditsTotal to amount variable for calculating amount paid */
			 }
		 }
	 }
	if(promoCodes){
		for(var index=0; index < promoCodes.length; index++){
			if(promoCodes[index].paymentGroupId === bp_submit_payment_group_obj.paymentGroupId){
				promoAmount += promoCodes[index].amount; /* Adding all credits and stored on to variable */
			}
		}	
		if(promoAmount > 0){
			confirmSectionForCreditAndPromo +='<div class="wid_flt60 fnt_itc">'
											 + 		messages['main_pay.confirm.promoApplied']
											 +  '</div>'
											 +  '<div class="wid_flt40 txt_nwrght fnt_itc">'
											 + 		"-"
											 +      getFormatedNumber(promoAmount, true)
											 +  '</div>';
		 paymentAppliedInfo.promoAmount += promoAmount;
		}
	}
	return confirmSectionForCreditAndPromo;
	}
}

/********************************************************************************************
' Name                 :   createSecForAmountDue
' Return type          :   secForFailedfulPayments
' Input Parameter(s)   :   paymentAppliedInfo, paymentSuccessful
' Purpose              :   This method is to create section for Amount Due.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecForAmountDue(paymentAppliedInfo, paymentSuccessful) { /* Section for amount Due and Today Paid amount */
	if(paymentSuccessful){ /* chekc for paymentSuccessful if it is true then show due amount and charge today amount */
	var secForAmountDue = '<div class="wid_flt100 mrgn_top10 txt_bold">' 
		  				+   '<div class="wid_flt60">'
						+ 		messages['main_pay.confirm_amountDue']
						+	'</div>'
						+	'<div class="wid_flt40 txt_nwrght">'
						+		getFormatedNumber(paymentAppliedInfo.amountDueTotal > 0 ? paymentAppliedInfo.amountDueTotal : 0, true)
						+	'</div>'
						+ 	'<div class="wid_flt70">'
						+ 		messages['main_pay.confirm_chargedToday']
						+	'</div>'
						+	'<div class="wid_flt30 txt_nwrght">'
						+		getFormatedNumber(paymentAppliedInfo.totalPaymentApplied > 0 ? paymentAppliedInfo.totalPaymentApplied : 0, true)
						+	'</div>'
						+	'</div>';
	return secForAmountDue;
	}
}

/********************************************************************************************
' Name                 :   createSecForAllFailedPayments
' Return type          :   secForFailedfulPayments
' Input Parameter(s)   :   index, submittedBills
' Purpose              :   This method is to create section for Failed payments.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   16th May, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function createSecForAllFailedPayments(index, submittedBills) {
	var secForFailedfulPayments = "";
	if(!checkForPaidStatus(submittedBills.status)){
		/* Only for Failed payments in case of paymentResponseCode != "00" */
			secForFailedfulPayments += '<div class="wid_flt100">' 
									+    '<div class="wid_flt100 mrgn_top10">'
									+ 		'<div class="wid_flt50 biller_compress_summary" id="nickName_success_conf' + index + '">'
									+ 			submittedBills.accountNickName
									+ 		'</div>'
									+ 		'<div class="wid_flt50 txt_nwrght" id="amount_success_conf' + index + '">'
									+ 			getFormatedNumber(submittedBills.amount, true)
									+ 		'</div>'
									+	'</div>';
		if (submittedBills.fee > 0) { 		/* chekc for fee if is more than o then display */
				secForFailedfulPayments += '<div class="wid_flt60 confirmation_detailnoBtm">'
										+ 		messages['main_pay.confirm.expressFee']
										+ '<span class="fa fa-bolt fa-lg express_icon_history"></span>'
										+ 	'</div>'
										+ 	'<div class="wid_flt30 txt_nwrght">'
										+ 		getFormatedNumber(submittedBills.fee, true)
										+ 	'</div>';
		}
		
		if (submittedBills.billPayResponseMsg) { /* chekc for errorMessage if it contains then display the reason why it is Failed */
				secForFailedfulPayments += '<div class="wid_flt70 confirmation_detailnoBtm">'
										+ 		submittedBills.billPayResponseMsg
										+ 	'</div>';
		}
	}
	return secForFailedfulPayments;
}
