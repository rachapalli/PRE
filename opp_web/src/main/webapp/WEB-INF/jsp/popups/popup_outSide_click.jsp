	<div class='popupContainer' id='editCardOnManagesCard'></div>
	<div id='editcardCredPopUp' class='cred_popup'>
		<div>
			<span class='popup_text'><fmt:message key="profile.onClick.backBtn" />
			</span>
			<input id='dontClearOnClick' type='button' class='bg_black login_submit_btn popup_btn'
				onclick="closeAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp')"
				 value='<fmt:message key="profile.editCard.continue.button"/>' />
			
			<input id='clearOnClickBtn' type='button' class='login_submit_btn popup_btn mrgn_top'
				value='<fmt:message key="profile.editCard.clearChanges.button" />' />
		</div>
	</div>
