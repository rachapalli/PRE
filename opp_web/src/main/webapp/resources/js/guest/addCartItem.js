var addverifyCartItemResponse;

/********************************************************************************************
' Name                 :   addVerifyCartItem
' Return type          :   none
' Input Parameter(s)   :   bills (java script array)
' Purpose              :   This method is used to call BP_ADD_VERIFY_CART_ITEM to add billers into cart.
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   14 April 2014   -   Ravi Raj
'*******************************************************************************************/
function addVerifyCartItem(bills) {
	/* To show the progress bar */
	showProgressBar();
	/* Holding Request Data */ 
	var request = new Object();
	request.userId = eval(getCookie('userId'));
	request.applicationId = applicationId;
	request.locale = getCookie("locale");
	request.bills = bills;

	var call_bp_add_verify_cart_item = new bp_add_verify_cart_item(request);
    call_bp_add_verify_cart_item.call();
}

/********************************************************************************************
' Name                 :   handleBpAddVerifyOnSuccess
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to handle the response of BP_ADD_VERIFY_CART_ITEM API.
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   18 April 2014   -   Ravi Raj
'*******************************************************************************************/
function handleBpAddVerifyOnSuccess() {
	try  {
		clearInterval(timerEnableNextButton);
		timerEnableNextButton = null;
		if(showCredentialErrorPopup() || !$('#pay_bill_sec').is(":visible")){
			hideProgressBar(); /* To hide the progress bar */
			return;
		}
		getPendingTransactions(navigateToCheckout);
	} catch (e) {
		console.log('Error ' + e + "\n" + e.stack);
	}
}

/********************************************************************************************
' Name                 :   showCredentialErrorPopup
' Return type          :   {Boolean}
' Input Parameter(s)   :   None
' Purpose              :   This method is used to show credential error popup in case of 
							BP_ADD_VERIFY_CART_ITEM API has vaildatedPayment array and 
							contains outcome other than success. 
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   18 April 2014   -   Ravi Raj
'*******************************************************************************************/	
function showCredentialErrorPopup(){
	if(bp_add_verify_cart_item_obj) {
		if(bp_add_verify_cart_item_obj.validatedPayments && bp_add_verify_cart_item_obj.validatedPayments.length > 0) {
			for(var index = 0; index < bp_add_verify_cart_item_obj.validatedPayments.length; index++){
				/* Iterate the ValidatedPayments to get the outCome value if it is not success the launch the Credential Error pop-up.*/
				var outCome = bp_add_verify_cart_item_obj.validatedPayments[index].outcome;/* As of now hard coding for testing*/
				if(outCome != "SUCCESS"){
					getPendingTransactions();
					$('#credentialPopid').text(messages["main_pay.cred.popup"]);
					showAnimatedPopup('credentialErrorPopUpId', 'credErrorPopId');
					return true; /* returning for checking condition where the method is called*/
				}
			}
		}
	}
	return false; 
}

/********************************************************************************************
' Name                 :   showDailyLimitPopup
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This will be invoked when BP_ADD_VERIFY_CART_ITEM API will have 
							error code as BP_VELOCITY. It serves the purpose of showing 
							the alert to user when he crosses his daily payment limit.
' History Header       :   Version   -   Date            -   Developer Name 
' Added By             :   1.0       -   18 April 2014   -   Ravi Raj
'*******************************************************************************************/
function showDailyLimitPopup() {
    //Set the error message and show the popup
    $('#velocityLimitMessage').text(bp_add_verify_cart_item_obj.errorMessage);

    showAnimatedPopup('dailyAlertPopUp', 'dailyAlertPopUpInnerDiv');
}
