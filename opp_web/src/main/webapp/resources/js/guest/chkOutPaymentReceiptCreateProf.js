var detailReceiptsubmitBtn;

/********************************************************************************************
 Name                 :   showRegFormDetail
 Return type          :   None
 Input Parameter(s)   :   None
 Purpose              :   This method is used to show the create account section and button
 pertaining create account for guest user in detail receipt view page.
 History Header       :   Version   -   Date             -   Developer Name
 Added By             :   1.0       -   19th June, 2013   -   Karuna mishra
 *******************************************************************************************/
function showRegFormPaymentReceiptCreateAcc() {
    if (!$('#paymentReceiptCreateAcc').is(":checked")) {
        $("#paymentReceiptCreateAcc").prop('checked', true);
        $("#paymentReceiptCreateAccIcon").removeClass("add_bill_inactiv_chkbox_icon flt_lft");
        $("#paymentReceiptCreateAccIcon").addClass("add_bill_activ_chkbox_icon flt_lft");
        var arg0 = '<a href="javascript:void(0)" class="blue_link" onclick="showTermsUrl()">';
        var arg1 = '</a>';
        var message = formatMessage(messages['checkout.termConditionHistory'], arg0, arg1);
        $("#paymentReceiptCreateAccViewTermCond").html(message);
        $("#frmGuestPaymentReceiptCreateAcc").show();
        $("#btnContinuePaymentReceiptCreateAcc").show();
        $("#paymentReceiptCreateAccBoxErrDiv").show();
        
        /* Show the check box for marketing Opt in */
        createOptInMsgAorBSection("chkOptInEnhPayRcpt", "optInEhnChkPayRcpt", messages['createAccount.optInEnh']);
        fillDataFromUserGetProfileObject("emailIdPaymentReceiptCreateAcc", "confrmEmailIdPaymentReceiptCreateAcc", "mobileNoPaymentReceiptCreateAcc", 
        		"zipCodePaymentReceiptCreateAcc");
        
        validateCreateProfilepaymentReceiptCreateAcc();

        /* To be called from fieldValidator.js*/
        addHeightClass('errorSepratorPaymentReceiptCreateAcc1');
        addHeightClass('errorSepratorPaymentReceiptCreateAcc2');
        addHeightClass('errorSepratorPaymentReceiptCreateAcc3');
        addHeightClass('errorSepratorPaymentReceiptCreateAcc4');
        addHeightClass('errorSepratorPaymentReceiptCreateAcc5');
        enableDetailReceiptSubmitBtn();
    } else {
    	clearIntervalApp(detailReceiptsubmitBtn);
        $("#paymentReceiptCreateAcc").prop('checked', false);
        $("#paymentReceiptCreateAccIcon").removeClass(
                "add_bill_activ_chkbox_icon flt_lft");
        $("#paymentReceiptCreateAccIcon").addClass(
                "add_bill_inactiv_chkbox_icon flt_lft");
        $("#frmGuestPaymentReceiptCreateAcc").hide();
        $("#btnContinuePaymentReceiptCreateAcc").hide();
        $("#paymentReceiptCreateAccBoxErrDiv").hide();
        
        /* To be called from fieldValidator.js*/
        removeHeightClass('errorSepratorPaymentReceiptCreateAcc1');
        removeHeightClass('errorSepratorPaymentReceiptCreateAcc2');
        removeHeightClass('errorSepratorPaymentReceiptCreateAcc3');
        removeHeightClass('errorSepratorPaymentReceiptCreateAcc4');
        removeHeightClass('errorSepratorPaymentReceiptCreateAcc5');
    }
}

/********************************************************************************************
Name                 :   validateCreateProfileDetail
Return type          :   None
Input Parameter(s)   :   None
Purpose              :   This method is used for validating the create account field in
Detail view page.
History Header       :   Version   -   Date             -   Developer Name
Added By             :   1.0       -   19th June, 2013   -   Karuna mishra
*******************************************************************************************/
function validateCreateProfilepaymentReceiptCreateAcc() {
   $('#emailIdPaymentReceiptCreateAcc').blur(function () {
	   this.value = this.value.toLowerCase();
       validateEmailInfo('emailIdPaymentReceiptCreateAcc', 'errorMainAreaPaymentReceiptCreateAcc1', 'invalidMsgPaymentReceiptCreateAcc1', messages['createAccount.invalidEmailMsg'],
                         'frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc','chkoutPaymentRecepit');
   });

   $('#confrmEmailIdPaymentReceiptCreateAcc').blur(function () {
	   this.value = this.value.toLowerCase();
       validateReenterEmail('emailIdPaymentReceiptCreateAcc', 'confrmEmailIdPaymentReceiptCreateAcc', 'errorMainAreaPaymentReceiptCreateAcc2', 'invalidMsgPaymentReceiptCreateAcc2',
                            messages['createAccount.invalidreEnterEmailMsg'], 'frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc', 'chkoutPaymentRecepit');
   });

   $('#passwordPaymentReceiptCreateAcc').blur(function () {
       passwordMatchUserName('emailIdPaymentReceiptCreateAcc', 'passwordPaymentReceiptCreateAcc', 'errorMainAreaPaymentReceiptCreateAcc3', 'invalidMsgPaymentReceiptCreateAcc3',
                             messages['createAccount.invalidpasswordMsgSame'], 'frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc','chkoutPaymentRecepit');
   });

   $('#mobileNoPaymentReceiptCreateAcc').blur(function () {
       validatePhoneInfo('mobileNoPaymentReceiptCreateAcc', 'errorMainAreaPaymentReceiptCreateAcc4', 'invalidMsgPaymentReceiptCreateAcc4', messages['createAccount.invalidphoneMsg'],
                         'frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc','chkoutPaymentRecepit');
   });

   $('#zipCodePaymentReceiptCreateAcc').blur(function () {
       validateZipcodeInfo('zipCodePaymentReceiptCreateAcc', 'errorMainAreaPaymentReceiptCreateAcc5', 'invalidMsgPaymentReceiptCreateAcc5', messages['createAccount.invalidzipCodeMsg'],
                           'frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc', 'chkoutPaymentRecepit');
   });
   customKeypressValidator('mobileNoPaymentReceiptCreateAcc');
}

function enableDetailReceiptSubmitBtn() {
	/* To check the status of fields at 500 ms interval and if Ok enable the Submit button*/
	detailReceiptsubmitBtn = setInterval("enableDisableSubmit('frmGuestPaymentReceiptCreateAcc', 'btnContinuePaymentReceiptCreateAcc')", 500);
}