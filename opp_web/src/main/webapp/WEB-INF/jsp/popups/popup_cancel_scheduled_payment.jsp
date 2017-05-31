<div id='cancelSchedContainerId' class='popupContainer'></div>
<div id='cancelSchedulePayPopup' class='cred_popup'>
	<div>
		<span class='popup_text'>
			<fmt:message key="main_pay.popup.confrmCanclTitle" />
		</span>
		<input id='dontCancelPay' type='button' class='bg_black login_submit_btn popup_btn' 
		onclick='closeCancelPopup()' value='<fmt:message key="main_pay.popup.dontCanclBtn"/>' />
		<input id='cancelBtnId' type='button' class='login_submit_btn popup_btn'
		value='<fmt:message key="main_pay.popup.yesBtn" />' onclick='cancel(this)' />
	</div>
</div>
