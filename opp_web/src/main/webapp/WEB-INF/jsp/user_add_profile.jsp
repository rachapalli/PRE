<div id="createAccount" class="create_account_container txt_inv width_area100">
	<div id="createProfileSec" class="find_bill_bg">
		<div class="wid_flt50 z101 pos_relnw">
			<input type="button"
				value="<fmt:message key="createAccount.backBtn"/>"
				class="signup_cancel_btn mob_btn_display mrgn_left10"
				onclick="loadLoginpage();" />
		</div>
		<div class="wid_flt100 pos_absolute z100">
			<h1>
				<div class="mobile_title_area">
					<fmt:message key="createAccount.title" />
				</div>
			</h1>
		</div>
		<div class="wid_flt50 txt_nwrght z101 pos_relnw">
			
				<!-- <span class="sv_submit_inactive_btn button_cls mrgn_rght10" id="createAccountBtn" onclick="callCreateAccountOrUpgradeUser();"><span><fmt:message key="createAccount.createAccount"/></span></span>-->
				 <span id="inactiveText"></span> 
			
			
			<input type="button" id="createAccountBtn"
				value="<fmt:message key="createAccount.createAccount"/>"
				class="sv_submit_inactive_btn mob_btn_display mrgn_rght10"
				onclick="callCreateAccountOrUpgradeUser();" />
		</div>
		<div class="signin_sub_txt pdng_top15 mob_txt_inv">
			<h2>
				<fmt:message key="createAccount.instructions" />
			</h2>
		</div>
	</div>

	<div id="createAccountForm" class="row_box main-holder-marg">
	<div id="inlineMsgId" class="rownew"></div>
		<div id="frmCreateAcc"
			class="signup_container_area mrgn_top10 mob_mrgn2">
			<div class="create_acc_field" id="createAccount_phone">
				<label><fmt:message key="createAccount.phonePrompt" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea3">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc3"></span>
				</div>
				<input type="tel" name="1" id="phonePrompt" maxlength="13" />
			</div>

			<div class="create_acc_field" id="createAccount_email">
				<label id="setUserDefinekeyMsg"><fmt:message
						key="createAccount.emailPrompt" /><span class="red-astrick">*</span>
				</label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea1">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc1"></span>
				</div>
				<input type="text" id="emailPrompt" name="2" />
			</div>

			<div class="create_acc_field" id="createAccount_reEnterEmail">
				<label><fmt:message key="createAccount.reEnterEmail" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea2">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc2"></span>
				</div>
				<input type="text" id="reEnterEmail" name="3" />
			</div>

			<div class="opt_in_txt">
				<div class="mrgn_rght flt_lft pdng_top3">
					<input type="checkbox" id="chkOptInEnhCrtProf" checked />
				</div>
				<div class="wid_flt90">
					<span id="optInEhnChkCrtProf"></span>
				</div>
			</div>

			<div class="create_acc_field">
				<label><fmt:message key="createAccount.zipCodePrompt" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea4">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc4"></span>
				</div>
				<input type="tel" name="4" id="zipCodePrompt" maxlength="5" pattern="\d*"
					onkeypress="return isNumberKey(event)" />
			</div>

			<div class="create_acc_field">
				<label><fmt:message key="createAccount.securityQuestion" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea5">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc5"></span>
				</div>
				<!-- Security question area with IE8 issue handling to show full Security question box on IE8-->
				<select id="securityQuestionforCreateAct"
					onmousedown="if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {this.style.position='absolute';this.style.width='auto'}"
					onblur="this.style.position='';this.style.width=''">
					<%-- <option  disabled class="txt_inv" 
						value="<fmt:message key="createAccount.securityQuestion1" />">
						<fmt:message key="createAccount.securityQuestion1" />
					</option> --%>
					<optgroup label=""></optgroup>
				</select>

			</div>

			<div class="create_acc_field">
				<label><fmt:message key="createAccount.securityAnswer" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea6">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc6"></span>
				</div>
				<input type="text" name="6" id="securityAnswerforCreateAct" />
			</div>

			<div class="create_acc_field" id="createAccount_userName">
				<label><fmt:message key="createAccount.username" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea8">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc8"></span>
				</div>
				<input type="text" name="7" id="username" maxlength="20" />

			</div>
			<div class="create_acc_field">
				<label><fmt:message key="createAccount.password" /><span
					class="red-astrick">*</span> </label>
				<div class="mob_error_msg txt_inv desk_wid_input" id="moberrorCrtAcctMainArea7">
					<span class="failed_icon"></span> <span id="mobinvalidMsgCreatAcc7"></span>
				</div>
				<input type="password" name="8" id="password" maxlength="20" />
			</div>

			<div class="create_acc_field">
				<div id="createAccountTermCondArea" class="click_here"></div>
			</div>
		</div>
		<div class="clear"></div>
		
		<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button"
							value="<fmt:message key="createAccount.backBtn"/>"
							class="signup_cancel_btn mob_btn_display"
							onclick="loadLoginpage();" />
							
					<input type="button" id="createAccountBtnBtm"
							value="<fmt:message key="createAccount.createAccount"/>"
							class="sv_submit_inactive_btn mob_btn_display"
							onclick="callCreateAccountOrUpgradeUser();" />
				</div>				
	<!-- bottom buttons END -->
	</div>
</div>
