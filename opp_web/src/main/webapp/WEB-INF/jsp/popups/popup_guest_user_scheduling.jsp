<div id='schedulePayGuestPopUpId' class='popupContainer txt_inv'></div>
<div id="guestSchedPayPopup" class='cred_popup txt_inv'>
	<span class='popup_text'> <fmt:message
			key="guestUser.popup.schedule.title" /> </span> <span class="popup_details">
		<fmt:message key="guestUser.popup.scheduleDetail1" /> </span> <span
		class="popup_details"> <fmt:message
			key="guestUser.popup.scheduleDetail2" /> </span> <span
		class="popup_details"> <fmt:message
			key="guestUser.popup.scheduleDetail3" /> </span> 
	<input type='button' id = 'contAsGuestBtnId'
		class='bg_black login_submit_btn popup_btn'
		value="<fmt:message key="login.continueAsGuest" />" onclick="guestSchedulePayPopupContinueBtn()"/>
	<!-- <h1 class="mrgn_top">
		<fmt:message key="main_pay.popup.or" />
	</h1> -->
	<input type='button' id = 'contAsGuestRegisterBtnId' class='login_submit_btn popup_btn'
		value="<fmt:message key="checkout.Register.button" />" onclick="checkForCreateAccountSection()" />
</div>
