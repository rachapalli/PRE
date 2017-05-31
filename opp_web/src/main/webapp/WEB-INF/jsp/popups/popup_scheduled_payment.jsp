<div class='popupContainer' id="scheduledPayId"></div>
<div class='cred_popup' id="credPopUpId">
	<span class='popup_text'> <fmt:message
			key="main_pay.popup.scheduledPayment" />
	</span> <input type='button' class='bg_black login_submit_btn popup_btn'
		id="clearNewEntry" onclick="clearEntriesForScheduled(this)"
		value="<fmt:message key='main_pay.popup.clear_new_entry' />" />
<!-- 	<h1 class="mrgn_top">
		<fmt:message key="main_pay.popup.or" />
	</h1> -->
	<input type='button' class='login_submit_btn popup_btn'
		id="continueClear"
		onclick="closeAnimatedPopup('scheduledPayId', 'credPopUpId')"
		value="<fmt:message key="main_pay.popup.continue" />" />
</div>
