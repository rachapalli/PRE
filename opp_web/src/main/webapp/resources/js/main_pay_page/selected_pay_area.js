/********************************************************************************************
' Name                 :   updateBillsPageSummary
' Return type          :   None
' Input Parameter(s)   :   billPageSummary
' Purpose              :   This method is used to update Main Payment Page (Bills) page summary section.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function updateBillsPageSummary(billPageSummary) {
	$('#paymentAmountTotal').text(getFormatedNumber(parseFloat(billPageSummary.paymentsTotal).toFixed(2), true));
	var feesApplied = calculateFeesApplied(); /* Calling method to calculate fee total */
	var paymentTotal = billPageSummary.paymentsTotal + feesApplied; /* Calculating payment total */
	var creditsApplied = calculateCreditsApplied(paymentTotal); /* Calling method to calculate credits total */
	var amountDue = paymentTotal - creditsApplied; /* Calling method to calculate amount due */
	/* Checking if payment total is 0 then no need to show anything */
	if(!billPageSummary.paymentsTotal || billPageSummary.paymentsTotal <= 0){
		creditsApplied = 0;
		feesApplied = 0;
		amountDue = 0;
	} 
	if(creditsApplied && creditsApplied > 0){ /* Checking for the creditsApplied should be more than 0*/
		$('#creditsAppliedTotal').text('-' + getFormatedNumber(parseFloat(creditsApplied).toFixed(2), true));
	} else {
		$('#creditsAppliedTotal').text(getFormatedNumber(parseFloat(creditsApplied).toFixed(2), true));
	}
	$('#feeAmountTotal').text(getFormatedNumber(parseFloat(feesApplied).toFixed(2), true));
	$('#mainPayAmountDueTotal').text(getFormatedNumber(parseFloat(amountDue).toFixed(2), true));
}

/********************************************************************************************
' Name                 :   calculateCreditsApplied
' Return type          :   {Integer}
' Input Parameter(s)   :   paymentTotal
' Purpose              :   This method is used to calculate credits applied from BP_GET_PENDING_TRANSACTION object.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function calculateCreditsApplied(paymentTotal) {
	var creditsApplied = 0;
	if(bp_get_pending_transaction_obj){
		/* Checking if BP_GET_PENDING_TRANSACTION object contains any credits data */
		if(bp_get_pending_transaction_obj.credits && bp_get_pending_transaction_obj.credits.length >0) {
			/* Iterating over credits array in BP_GET_PENDING_TRANSACTION object */
			for(var index in bp_get_pending_transaction_obj.credits) {
				/* Calculating if any remainingAmount exists then calculate it */
				if(bp_get_pending_transaction_obj.credits[index].remainingAmount){
					creditsApplied += bp_get_pending_transaction_obj.credits[index].remainingAmount;
				}
			}
		}
	}
	if(!paymentTotal) {
		return creditsApplied;
	}
	/* If creditsApplied is more than paymentTotal then only amount equal to payment total can be used as credits */
	return creditsApplied > paymentTotal ? paymentTotal : creditsApplied;
}

/********************************************************************************************
' Name                 :   calculateFeesApplied
' Return type          :   {Integer}
' Input Parameter(s)   :   None
' Purpose              :   This method is used to calculate fee applied from billsDup array 
							which store fee returned from BP_CALC_SUBMIT API.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function calculateFeesApplied() {
	var feeApplied = 0;
	if(billsDup && billsDup.length > 0) {
		for(var index in billsDup) {
			var amount = $('#' + index).val(); /* Reading the value if its a input box */
			if(!amount) { /* if its not a input box then reading the value from span for fixed billers */
				amount = $('#' + index).text();
			}
			if(amount && amount > 0) { /* Checking to calculate the feeApplied if entered amount is more than 0 */
				feeApplied += billsDup[index].fee;
			}
		}
	}
	return feeApplied;
}

/********************************************************************************************
' Name                 :   createBpAddVerifyRequest
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to create BP_ADD_VERIFY_CART_ITEM API request.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function createBpAddVerifyRequest() {
	/* To show the progress bar */
	showProgressBar();
	var bills = new Array();
	for(var index=0, count=0; index < billerCorpAcctIdArray.length; index++) {
		/* Getting the amount from each biller amount box */
		var amount = $('#' + billerCorpAcctIdArray[index]).val();
		/* if its not a input box then reading the value from span for fixed billers */
		if(!amount) {
			amount = $('#' + billerCorpAcctIdArray[index]).text();
		}
		amount = amount ? parseFloat(amount) : 0;
		var isCheckBoxMarked = $('#' + billerCorpAcctIdArray[index] + 'checkBox').hasClass('checked_mark_icon');
		/* Checking if any amount is entered into biller boxes as well as checkbox is marked because 
		 * it might be possible some has previously selected the amount and date but before clicking the 
		 * Next button he removed the date. In that case checkbox will be unmark and we don't need to include
		 * it in request. */
		if(amount > 0 && isCheckBoxMarked) {
			var billerCorpAccountId = billerCorpAcctIdArray[index];
			bills[count] = new Object();
			bills[count].billerCorpAccountId = billerCorpAccountId;
			bills[count].programId = checkForRTRBillers(billerCorpAccountId, amount);
			bills[count].amount = amount;
			bills[count].requestedPostingDate = billsDup[billerCorpAccountId].requestedPostingDate;
			count++;
		}
	}
	if(bp_get_pending_transaction_obj){
		/* Checking if bp_get_pending_transaction response contains any pending transaction */
		if(bp_get_pending_transaction_obj.pendingTransactions 
				&& bp_get_pending_transaction_obj.pendingTransactions.length > 0) {
			/* Iterating through the pendingTransaction array */
			for(var index=0; index < bp_get_pending_transaction_obj.pendingTransactions.length; index++) {
				var pendingTransactions = bp_get_pending_transaction_obj.pendingTransactions[index];
				var isExists = false;
				/* Iterating through the bills array to check whether the pendingTransaction exists in bills array */
				for(var count=0; count < bills.length; count++) {
					var bill = bills[count];
					isExists = transactionExistsInBills(pendingTransactions, bill);
					/* Checking if pendingTransaction exists in bills array then we can't send it again to API otherwise
					 * API will return duplicate payment error so just delete is from bills array request element */
					if(isExists) {
						bills.splice(count, 1); /* Deleting the element from bills array */
						break;
					}
				}
				/* Checking if after iterating pendingTransaction object now doesn't exists in bills array then
				 * add this pending Transaction with 0 amount, so that it will be deleted from API */
				if(!isExists) {
					/* Checking if billerCorpAccountId of bills[] exists in pendingTransaction it means the bill
					 * has been updated and not to add any new bill with 0 amount */
					if(!checkBillerCorpAccountIdExistsInBills(bills, pendingTransactions.billerCorpAccountId)) {
						var length = bills.length;
						bills[length] = new Object();
						bills[length].billerCorpAccountId = pendingTransactions.billerCorpAccountId;
						bills[length].programId = pendingTransactions.programId;
						bills[length].requestedPostingDate = pendingTransactions.requestedPostDate;
						/* Setting amount to 0 so that API will delete this transaction */
						bills[length].amount = 0;
					}
				}
	 		}
		}
	}
	/* Checking if bills array doesn't contain any data then no need to call BP_ADD_VEFIRY_CART_ITEM. 
	 * It can only be possible if user didn't made any change in any bill payment what we got from 
	 * BP_GET_PENDING_TRANSACTION API. */
	if(bills && bills.length > 0) {
		addVerifyCartItem(bills);
	} else { /* If bills array doesn't exists or blank then call only BP_GET_PENDING_TRANSACTION API and move to checkout page */
		getPendingTransactions(navigateToCheckout);
	}
}

/********************************************************************************************
' Name                 :   checkForRTRBillers
' Return type          :   {String}
' Input Parameter(s)   :   billerCorpAccountId, amount
' Purpose              :   This method is used to check for RTR billers and get their 
							programId that will be sent in BP_ADD_VERIFY_CART_ITEM API request.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15th May, 2014     -   Ravi Raj
'*******************************************************************************************/
function checkForRTRBillers(billerCorpAccountId, amount) {
	if(billsDup && billsDup.length > 0){
		var programId = billsDup[billerCorpAccountId].programId;
		 for(var index = 0; index < bp_account_lite_obj.billerCorpAccounts.length; index++){
			 if(billerCorpAccountId === bp_account_lite_obj.billerCorpAccounts[index].id){
				 if(bp_account_lite_obj.billerCorpAccounts[index].rtr) {
					 var programsArray = bp_account_lite_obj.billerCorpAccounts[index].programs;
					 if(programsArray && programsArray.length > 0) {
						 for(var progIndex in programsArray) {
							 if(amount >= programsArray[progIndex].minAmount && amount <= programsArray[progIndex].maxAmount) {
								 programId = programsArray[progIndex].id;
								 return programId;
							 }
						 }
					 }
				 }
			 }
		 }
		 return programId;
	}
	return null;
}

function transactionExistsInBills(pendingTransactions, bill) {
	/*Checking if all the fields form pendingTransactions meet with particular bill then return true */
	if(pendingTransactions.billerCorpAccountId === bill.billerCorpAccountId
			&& pendingTransactions.requestedPostDate === bill.requestedPostingDate
			&& pendingTransactions.programId === bill.programId
			&& pendingTransactions.amount === bill.amount) {
		return true;
	}
	return false;
}

function checkBillerCorpAccountIdExistsInBills(bills, billerCorpAccountId) {
	for(var index in bills) {
		if(bills[index].billerCorpAccountId === billerCorpAccountId) {
			return true;
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   changeMonthInCalender
' Return type          :   None
' Input Parameter(s)   :   calenderId, currentObj
' Purpose              :   This method is used to update the month at top of calendar. The currentObj 
' 							will only be sent for Android 4.0 devices.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15 Jul, 2014    -   Mohit Arya
'*******************************************************************************************/
function changeMonthInCalender(calenderId, currentObj) {
	$('#' + calenderId + ' > ul > li').each(function() {
		if($(this).offset().left <= $('#' + calenderId).offset().left + 5) {
			var idForDate = $(this).children().first().attr('id');
			if(idForDate) {
				var dateObj = convertToDatemmddyy(idForDate * 1);
				$('#' + calenderId).parent().find(".monthDisplay").text(dateObj.month + ', ' + dateObj.year);
			}
		}
	});
	$('#' + calenderId + ' > ul > li.date_separation').each(function() {
		var fixedMonthSecLeft = $('#' + calenderId).parent().find(".monthDisplay").offset().left;
		var scrollMonthSecLeft = $(this).offset().left; 
		if(scrollMonthSecLeft <= fixedMonthSecLeft) {
			$(this).next().find('.nextscrollDate').hide();
		}else {
			$(this).next().find('.nextscrollDate').show();
		}
	});
	scrollArrow(calenderId, currentObj);
}

/********************************************************************************************
' Name                 :   scrollArrow
' Return type          :   None
' Input Parameter(s)   :   index
' Purpose              :   This method is used to show the left or right arrow when user is at 
							the start of calendar or end of calendar.
' History Header       :   Version   -   Date              	-   Developer Name
' Added By             :   1.0       -   15 June, 2014    -   Mohit Arya
'*******************************************************************************************/
function scrollArrow(calenderId, currentObj){
	var scrollLeftValue = $('#'+ calenderId).scrollLeft();
	if(currentObj) {
		/* IScroll doesn't support scrollLest it supports this.x */
		scrollLeftValue = currentObj.x * -1; /* Only for Android 4.0 */
	}
	var calenderDivWidth = $('#' + calenderId).outerWidth(true);
	var ulWidth = $('#' + calenderId + ' ul').outerWidth(true);
	var lastScrollValue = ulWidth - calenderDivWidth; 
	var index = calenderId.replace('calender', '');
	if(scrollLeftValue === 0){
		$('#leftCalender' + index).hide();
		$('#rightCalender' + index).show();
	} else if(scrollLeftValue >= lastScrollValue - 5) {
		$('#leftCalender' + index).show();
		$('#rightCalender' + index).hide();
	} else if(scrollLeftValue > 0 && scrollLeftValue < lastScrollValue) {
		$('#rightCalender' + index).hide();
		$('#leftCalender' + index).hide();
	}
}