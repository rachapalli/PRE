<div class='popupContainer' id="idOfDeleteDebitCardPopUpError"></div>
<div class='cred_popup' id="idOfDeleteDebitCardPopUpErrorContainer">
	<span class='popup_text' id='headingScheduledPayments'>
	</span>
	<div class="popup_details" >
		<span id='paymentThisCard'></span>
		<ul id="showScheduledBillerForCard" class="popup_ul_mrgn">

		</ul>
	</div>
	<span class="popup_details" id='deletethisDebitCard'> </span> <input type='button' class='bg_black login_submit_btn popup_btn'
		id='dontDeleteDebitCard'
		onclick='closeAnimatedPopup("idOfDeleteDebitCardPopUpError", "idOfDeleteDebitCardPopUpErrorContainer");'/>
<!-- 	<h1 class="mrgn_top">
		<fmt:message key="main_pay.popup.or" />
	</h1> -->
	<input type='button' class='login_submit_btn popup_btn'
		id='deleteDebitCard' name=''
		onclick='handlingScheduledCardDelete(this.name);'
		value='<fmt:message key="checkout.debit.delete_scheduled_card_delete_label" />' />
</div>
