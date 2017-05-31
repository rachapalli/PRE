<div class='popupContainer' id="idOfDebitCardPopUpError"></div>
<div class='cred_popup' id="mainContainId">
	<span class='popup_text' id='checkOutDebitCardErrorHeading'> <fmt:message
			key="main.pay.popup.bills.paidEarly" />
	</span>
	<div class="popup_details" id='checkOutDebitCardErrorHeadingContent'>
		<fmt:message
			key="main_pay.popup.cash.paymentMethodProcessedImmediately" />
	</div>
	<span class="popup_details" id='checkOutDebitCardErrorHeadingContent1'>
		<fmt:message key="main_pay.popup.bills.dateSelectedCardPay" />
	</span> <input type='button' class='bg_black login_submit_btn popup_btn'
		id='differentDebitcard'
		value="<fmt:message key="main_pay.popup.useCard" />"
		onClick='expandCardSection()' />
<!-- 	<h1 class="mrgn_top">
		<fmt:message key="main_pay.popup.or" />
	</h1> -->
	<input type='button' class='login_submit_btn popup_btn'
		id='continueWithCash'
		value="<fmt:message key="main_pay.popup.continueCash" />"
		onClick='showCashFundingSource()' />
</div>
