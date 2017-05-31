<div id="login_area_jsp" class="row_box main-holder-marg">
<div id="inlineMsgId" class="rownew"></div>
	<div class="login_frm_container">

		<%
			if (Boolean.valueOf(request.getParameter("timeOut"))) {
		%>
		<div id="sessionTimeOut" class="session_timeout_msg">
			<fmt:message key="login.sessionTimeOutMessage" />
		</div>
		<%
			} else {
		%>
		<div id="sessionTimeOut" class="txt_inv"></div>
		<%
			}
		%>

		<div id="LoginErrorEmailMsg" class="txt_inv red_txt err_msg_login"></div>
		<div id="LoginErrorMsgOfApi" class="txt_inv red_txt err_msg_login"></div>
		<div class="login_field" id="userNameAsUser">
			<!-- <label id="lblUserName"></label> -->
			<input type="text" class="input" id="login_txt" required />
		</div>

		<div id="LoginErrorMsg" class="txt_inv red_txt err_msg_login"></div>
		<div class="login_field">
			<!-- <label><fmt:message key="login.password" /></label> -->
			<input type="password" class="input" id="password_txt"
				placeholder='<fmt:message key="login.password_input" />' required maxlength="20" />
		</div>

		<div class="login_chkbox">
			<input type="checkbox" class="mrgn_rght" id="rememberMe"
				checked="checked" />
			<fmt:message key="login.remember" />
		</div>

		<div class="login_pnl_btnmrgn">
			<button class="pure-button login_submit_btn" id="login_frm"
				name="login_frm" onClick="validateLoginPage(${resourceAppId});">
				<div class="fa fa-lock fa-lg img_vertical_algndef"
					onClick="validateLoginPage(${resourceAppId});">&nbsp;</div>
				<fmt:message key="login.button" />
			</button>
		</div>

		<div class="login_forgot_txt" id="forgetPwdLink">
			<a href="javascript:void(0)" id="loginForgetPwdLink"
				onclick="showForgotPasswordArea();"> <fmt:message
					key="login.forgotpwd" /> </a>
		</div>

		<!--  Forget Password Area-->
		<div id="forgetPwdOuter" class="login_forgot_length">
			<div id="LogingetPwd" class="txt_inv flt_lft">
				<div class="lgn_inp_center_area flt_lft">
					<div id="wrong_username"
						class="txt_inv red_txt err_msg_login txt_nwlft pdng_none"></div>
					<label id="lblUserNameForgt" class="lgn_lbl_wid"> <fmt:message
							key="forgetPassword.tip.label_user" /> </label> <input type="text"
						class="lgn_input_wid" id="login_name"
						placeholder='<fmt:message key="login.user_input" />' /> <input
						type="button" id="access_ques" class="pure-button btn_pdng_style"
						name="access_ques"
						value='<fmt:message key="forgetPassword.submit"/>'
						onClick="getSecurityQues()" />
				</div>
			</div>

			<!--  Security Question Area-->
			<div id="securityQuestionArea" class="txt_inv width_area100">
				<div class="lgn_inp_center_area flt_lft">
					<div id="securityQuestionErrorMessage"
						class="txt_inv red_txt err_msg_login txt_nwlft pdng_none"></div>
					<label class="lgn_lbl_wid" id="securityQuestion">&nbsp;</label> <input
						class="lgn_input_wid" type="text" id="securityAnswer"
						maxlength="50"
						placeholder='<fmt:message key="forgetPassword.security.ans" />' />
					<input type="button" id="sendSecurityAnswer"
						class="pure-button btn_pdng_style"
						value='<fmt:message key="forgetPassword.validateAns" />'
						onclick="sendTempPasswordRequest(${resourceAppId});" />
				</div>

			</div>
			<!-- Force reset pwd area -->

			<div id="forcedPwd" class="txt_inv mrgn_top">
				<div class="err_msg_login red_txt">
					<fmt:message key="forgetPassword.forget_password" />
				</div>

				<div class="lgn_inp_center_area">
					<div class="mrgn_field">
						<label class="reset_pass_lbl"> <fmt:message
								key="forgetPassword.newPwd" /> </label>
						<div class="clear"></div>
						<input type="password" id="new_pwd"
							class="input disp_block widCalc92" maxlength="20" />
					</div>
				</div>

				<div class="lgn_inp_center_area">
					<div class="mrgn_field">
						<label class="reset_pass_lbl"><fmt:message
								key="forgetPassword.Re_entr_newPwd" /> </label>
						<div class="clear"></div>
						<input type="password" id="re_new_pwd"
							class="input disp_block widCalc92" maxlength="20" />
					</div>
				</div>


				<div id="wrong_resetpwd" class="txt_inv err_msg_login red_txt"></div>
				<div class="login_pnl_btnmrgn">
					<input type="button" id="reset_pwd"
						class="pure-button lgn_btn_forgetpass" name="reset_pwd"
						value='<fmt:message key="forgetPassword.resetPwd" />'
						onClick="sendResetPasswordRequest(${resourceAppId});" />
				</div>
			</div>
		</div>
	</div>
	<hr class="login_hr_divider" />
	<div id="createProfileArea" class="txt_inv txt_mid mrgn_top10 imp_inline">
		<form id="frmCreateProfile"
			onsubmit="return loadCreateAccountPageFromLogin(${resourceAppId})"
			method="POST" data-form="validate" class="get_start_area">
			<input type="hidden" name="login" value="true" /> <input
				type="submit" id="signUpButtonOnlogin"
				class="pure-button login_getstart_btn"
				value='<fmt:message key="login.getstart" />' />
		</form>
	</div>

	<div class="get_start_area txt_mid">
		<input type="button" id="guestUser"
			class="pure-button continue_guest_btn txt_inv imp_inline"
			value='<fmt:message key="login.continueAsGuest" />'
			onClick="handleCreateGuestUser();" />
	</div>

	<div class="social_store">
		<div class="wid_area100">
			<div class="wid92 algn_center txt_mid">
				<a id="googlePlayIcon" target="_blank" class="gle_play_area in_line"
					href='<fmt:message key="google_play_url"/>'><img
					alt="Get it on Google Play"
					src='<fmt:message key="google_img_url"/>' /> </a> <a id="appStoreIcon"
					target="_blank" class="app_store_area in_line" href='<fmt:message key="app_store_url"/>'><img
					alt="Download on the App Store"
					src='resources/images/app_store_img.svg'/>
				</a>
			</div>
		</div>
	</div>

	<div id="loginSpacer" class="login_spacer"></div>
</div>
