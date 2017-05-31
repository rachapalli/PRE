<div id="idOfDebitCardPopUpErrorNew" class='popupContainer'></div>
<div class='cred_popup' id="mainContainIdNew">
	<span class='popup_text' id='checkOutDebitCardErrorHeadingNew'>
		<fmt:message key="checkout.debit.errorHeading" />
	</span>
	<div class="popup_details" id='checkOutDebitCardErrorHeadingContentNew'>
		<fmt:message key="checkout.debit.errorContent" />
	</div>

	<input type='button' class='bg_black login_submit_btn popup_btn'
		id='differentDebitcardNew'
		value='<fmt:message key="checkout.debit.differentDebitcard" />'
		onClick='useSameOrDifferentdebitCard(this)' />
	<!-- <h1 class="mrgn_top">
		<fmt:message key="main_pay.popup.or" />
	</h1> -->
	<input type='button' class='login_submit_btn popup_btn'
		id='sameDebitcardNew'
		value='<fmt:message key="checkout.debit.sameCard" />'
		onClick='useSameOrDifferentdebitCard(this)' />
</div>
