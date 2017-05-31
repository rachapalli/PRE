<header class="head-sec">
	<div class="logo_area">
		<div class="logo_icon" onclick="navigateToHome();"></div>
	</div>
	<nav class="nav">
		<i id="activityIcon" class="mob_profile_icon_mobile fa fa-check-square-o flt_rght mrgn_top6 disp_show_hide tab_mrgn_top" onclick="myAccountSwiping(event);"></i>
		<!-- <div id="accBoxMainDivId" class="account_details_area">
			<div id="accBoxDivId" class="account_field flt_lft">
				<div class="my_acc_top_bg">
					<span id="myAccountBox" class="acc_box_mrgn txt_inv" onclick="myAccount()">
						<div class="nav_lnk1">
							<fmt:message key="main_pay.my_account" />
						</div>
						<div class="drop_img_icon nav_lnk1"></div>
					</span>
				</div>
			</div>
			
		</div> -->
		<!--  Guest User signup and login buttons -->	
		<div id="guestUserMyAccountBox" class="guest_user_mrgnarea txt_inv">
				<ul class="guest_user_area">
					<div class="mob_btn_rght">
						<li class="sign_up_header_btn">
							<div class="mob_white_txt" id="signUpBtn"
								onclick="forwardGuestToCreateAccountPage()">
								<fmt:message key="createAccount.createAccount" />
							</div>
						</li>
						<li class="login_header_btn">
							<div class="txt_bold" onclick="moveToLoginPage()">
								<fmt:message key="login.button" />
								<div class="fa fa-lock small_lock_icon"></div>
							</div>
						</li>
					</div>
				</ul>
			</div>
			
		<!--  my account popup window Start-->		
		<!-- <div class="list_details">
			<div class="acc_img_icon nav_lnk1">&nbsp;</div>
			<div class="nav_lnk1">
				<fmt:message key="main_pay.my_account" />
			</div>
			<div class="drop_img_icon nav_lnk1">&nbsp;</div>
			<div class="acc_default_txt" id="userName"></div>
			<a href="#balanceDetails">
				<div id="showBalanceDetail" class="show_bal_detail txt_inv">
					<fmt:message key="accountInfo.balanceDetail" />
				</div>
			</a> <a href="#profile">
				<div class="list_btn" id="profile_tag">
					<fmt:message key="main_pay.profileLabel" />
				</div>
			</a> <a href="javascript:void(0)" id="signout_click_txt"
				onclick="loadIndexPage()">
				<div class="list_btn" id="sign_out_tag">
					<fmt:message key="main_pay.signoutLabel" />
				</div>
			</a>
		</div> -->
		<!--  my account popup window End-->
	</nav>
	<!-- Added on 27 August 2013 (display credits below my account section)  -->
	<!-- <div id="bpCreditLabel" class="acc_bal_amt green_txt txt_inv">
		<label id="mainPageBalanceLabel"><fmt:message
				key="checkout.lbl_credits" /> </label> <label id="accountBal"
			class="dynamiclab"></label>
	</div> -->
	<!-- <div class="acc_icon headaccount"></div> -->
</header>
