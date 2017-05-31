<div id='cvvFill' class='popupContainer'></div>
<div class='cred_popup cred_popup_overflow' id='mainContainIdNewPop'>
	<div class='wid_flt100'>
		<span class='popup_text wid_flt90' id='enterCvvHeadings'>
			<fmt:message key="main_pay.popup.enter_cvvFill" />
		</span>
		<div class="alert_close" onclick="closeCVVPopup()"></div>
	</div>
	<input type="text" id='cvvValue' class='input_cvv input_cvv_mrgn10'
		autofocus="true" maxlength="4" 	onkeyup="return validateCVVFormat(event)"></input>
	<input type='button' id='cvvSubmitButton' onClick='callSubmitCartAfterCVV();'
		class='input_cvv sv_submit_inactive_btn popup_btn popup_btn_imp'
		value="<fmt:message key="main_pay.popup.submit" />" disabled="disabled" />
</div>