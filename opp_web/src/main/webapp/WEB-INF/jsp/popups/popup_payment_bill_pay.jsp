<div id='paymentBillPayId' class='popupContainer'></div>
<div id='paymentBillPayPopup' class='cred_popup'>
      <div>
         <span class='popup_text fnt_wtn fnt16_cntr' id='chkOutServiceFeeId'></span>
         <span class='popup_text fnt_wtn mrgn_card fnt16_cntr' id='chkOutUseDebitId'></span>
         
         <input id='dontCancelPay' type='button' class='bg_black login_submit_btn popup_btn'
		 value="<fmt:message key="checkout.goBackUseDebit"/>" onclick='deletePaymentCardOngoBack()'/>
		 
	     <input id='cancelBtnId' type='button' class='login_submit_btn popup_btn'
         value="<fmt:message key="checkout.continueToPayment"/>" onclick='onClickServiceFeeChkPopUp()' />
      </div>
</div>
