<div id="editProfileSecurityContainer" class="create_account_container txt_inv">
	<div class="find_bill_bg" id="editProfileSecurityId">
		<div class="wid_flt50 z101 pos_relnw">
			<input type="button" value="<fmt:message key="editProfile.backBtn"/>"
				class="mob_btn_display paybill_nxtbtn bg_black mrgn_left10" onclick="navigateToProfile('#profileSecurity');" />
		</div>

		<div class="wid_flt100 pos_absolute z100">
			<h1>
				<div class="mobile_title_area z100">
					<fmt:message key="editProfile.title" />
				</div>
			</h1>
		</div>

		<div class="wid_flt50 txt_nwrght z101 pos_relnw">
			<input type="button" id="editProfileSecurityUpdateBtn" value="<fmt:message key="editProfile.saveBtn"/>"
				class="mob_btn_display mrgn_rght10" onclick="validateSecurityFormOnSave();" />
		</div>
	</div>

	<div class="clear"></div>
	<form action="" method="POST" data-form="validate">

		<div id="edit_profile_security_area" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
		<div class="clear"></div>
		<div class="edit_profile_section_lft">
		<!-- Start Security Deatils Section -->
		<div id="securityDetailsSection">
			<!-- Security Password Area Start -->
			<div class="edit_profile_field">
				<label><fmt:message key="editProfile.currentPassword" /></label>
				<div id="ep_errorOldPwdMsg" class="mob_error_msg desk_wid_input txt_inv">
					<span class="mobErorMsgSpan" id="ep_errorOldPwdMsg_span"> 
						<fmt:message key="editProfile.errorMsg.invalidpasswordMsg" /> 
					</span>
				</div>
				<input type="password" id="editProfileOldPassword" />
			</div>
		
			<div class="edit_profile_field">
				<label><fmt:message key="editProfile.newPassword" /></label>
				<div id="ep_errorNewPwdMsg" class="mob_error_msg desk_wid_input txt_inv">
					<span class="mobErorMsgSpan" id="ep_errorNewPwdMsg_span"> 
						<fmt:message key="editProfile.errorMsg.invalidNewpasswordMsg" />
					</span>
				</div>
				<input type="password" id="editProfileNewPassword" />
			</div>
		
			<!-- Security Question and Answer Area Start -->
			<div class="edit_profile_field">
				<label><fmt:message key="editProfile.securityQuestion" /></label>
				<!-- Security question with IE8 issue handling to show full Security question box on IE8-->
				<select id="editProfileSecurityQuestionList"
					onmousedown="if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {this.style.position='absolute';this.style.width='auto'}"
					onblur="this.style.position='';this.style.width=''">
					<optgroup label=""></optgroup>
				</select>
			</div>
		
			<div class="edit_profile_field">
				<label><fmt:message key="editProfile.securityAnswer" /></label>
				<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorSecurityAnswer">
					<span class="failed_icon"></span> 
					<span class="mobErorMsgSpan" id="ep_errorSecurityAnswer_span">
						<fmt:message key="editProfile.errorMsg.securityAns" />
					</span>
				</div>
				<input type="text" id="editProfileSecurityAnswer" />
				<div id="editProfileSecureBottomId"></div>
			</div>
			<!-- Security Question and Answer Area End -->
		</div>
		
		</div>
		<!-- End Security Details Section -->
		
		<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button" value="<fmt:message key="editProfile.backBtn"/>"
						class="mob_btn_display paybill_nxtbtn bg_black" onclick="navigateToProfile('#profileSecurity');" />
					
					<input type="button" id="editProfileSecurityUpdateBtnBtm" value="<fmt:message key="editProfile.saveBtn"/>"
						class="mob_btn_display" onclick="validateSecurityFormOnSave();" />
					
				</div>				
		<!-- bottom buttons END -->
		</div>
	</form>
</div>