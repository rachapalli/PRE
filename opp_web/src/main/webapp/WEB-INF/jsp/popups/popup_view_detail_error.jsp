<div id="popupErrorId" class='popupContainer'></div>
<div class='cred_popup cred_popup_overflow background_transparent' id="credPopupErrorId">
	<div class="cred_popup_diff" id="confirmationErrorPopupId">
		<div class='popup_text width_area100'>
			<fmt:message key="main_pay.popup.unSubmittedBill" />
		</div>
		<div
			class='popup_text popup_text_inside txt_normal wid_flt100 mrgn_top0'
			id="mainContainerForErrorConfirmation"></div>
		<div class='popup_text popup_text_inside fnt_wt wid_flt100'></div>
		<span class="popup_details wid_flt100" id="customerContactId"
		onclick="showContactUrl()"> <fmt:message
			key="main.pay.popup.view.error" /> <a href="javascript:void(0)">
			<fmt:message key="main.pay.popup.link" />
		</a>
		</span>
			
	</div>
	<div class="alert_close alert_close_diff" id="errorCloseBtnId"
				onclick="closeAnimatedPopup('popupErrorId', 'credPopupErrorId')">
	</div>
</div>