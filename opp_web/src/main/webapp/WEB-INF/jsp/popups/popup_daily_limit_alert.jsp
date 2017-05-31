<div id="dailyAlertPopUp" class='popupContainer'></div>
<div class='cred_popup' id="dailyAlertPopUpInnerDiv">
	<span id="dailyLimitHeading" class='popup_text'><fmt:message key="main_pay.popup.bp_velocity" /></span>
	<span class="popup_details">
        <div id="velocityLimitMessage"></div>
	</span>
	<span class="popup_details">
		<fmt:message key="main_pay.popup.paymentExceed" />
	</span>
	 <input type='button' id="dailyAlertLimitPopEdit" class='login_submit_btn popup_btn'
		value="<fmt:message key="main_pay.popup.enter_cvv" />" onClick="loadHomeScreenArea();" />
</div>