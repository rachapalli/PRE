	<div id='deleteCardOnManagesCard' class='popupContainer'></div>
	<div id='manageCardCredPopUp' class='cred_popup'>
		<div>
			<span class='popup_text'><fmt:message key="profile.deleteCard.confrmTitle" />
			</span>
			<input id='dontDelete' type='button'class='bg_black login_submit_btn popup_btn'
				onclick="closeAnimatedPopup('deleteCardOnManagesCard', 'manageCardCredPopUp')"
				 value='<fmt:message key="profile.deleteCard.noLabel"/>' />
			
			<input id='deleteCardBtn' type='button' class='login_submit_btn popup_btn mrgn_top'
				value='<fmt:message key="profile.deleteCard.yesLabel" />' />
		</div>
	</div>
