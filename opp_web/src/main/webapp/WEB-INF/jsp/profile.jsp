<div id="profileContainer" class="create_account_container txt_inv">
	<div class="find_bill_bg" id="profileId">
	
	<!--Below back button removed as per the requirement  -->
	
		<%-- <div class="wid_flt50 z101 pos_relnw">
			<input type="button" value="<fmt:message key="editProfile.backBtn"/>"
				class="mob_btn_display paybill_nxtbtn bg_black mrgn_left10" onclick="navigateToHome();" />
		</div> --%>

		<div class="wid_flt100 z100">
			<h1>
				<div class="mobile_title_area z100">
					<fmt:message key="profile.title" />
				</div>
			</h1>
		</div>
	</div>

	<div class="clear"></div>
		<div id="profile_area" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
			<!-- Edit Profile Section Start -->
			
			<div class="clear"></div>

			<div class="edit_profile_section_rght flt_rght width40">
				<!-- Edit Profile Section End -->

				<!-- Change Password or Security Question Button -->
				<input type="button" id="" class="change_pass_btn flt_rght desk_300" onclick="navigateToEditProfile()"
					value="<fmt:message key="editProfile.title"/>" />

				<!-- Change Password or Security Question Button -->
				<input type="button" id="" class="change_pass_btn flt_rght desk_300" onclick="navigateToManageCards('callFromMainPage')"
					value="<fmt:message key="editProfile.managecard"/>" />

				<!-- Change Password or Security Question Button -->
				<input type="button" id="" class="change_pass_btn flt_rght desk_300" onclick="navigateToProfileSecurity()"
					value="<fmt:message key="editProfile.securityDetailsButton"/>"  />						
			</div>

			<div class="edit_profile_section_lft width60">
				<!-- User Name -->
				<div class="profile_field">
					<label><fmt:message key="editProfile.usernameLabel" /></label>
					<span id="profileUserName"></span>
				</div>

				<!-- Email -->
				<div class="profile_field">
					<label> <fmt:message key="editProfile.email" /></label>
					<span id="profileEmail"></span>
				</div>

				<!-- Mobile Phone  -->
				<div class="profile_field">
					<label> <fmt:message key="editProfile.phone" />	</label>
					<span id="profilePhone"></span>
				</div>

				<!-- Zip  -->
				<div class="profile_field">
					<label> <fmt:message key="editProfile.zip" /></label>
					<span id="profileZip"></span>
				</div>

				<!-- Preferred Communications Method -->
				<div class="profile_field">
					<label> <fmt:message key="editProfile.contactPref" /></label>
					<span id="profileCommunication" class="mob_blk"></span>
				</div>

				<div class="profile_field txt_inv" id="profileFirstNameMain">
					<label> <fmt:message key="editProfile.firstName" /></label>
					<span id="profileFirstName"></span>
				</div>
				
				<div class="profile_field txt_inv" id="profileLastNameMain">
					<label> <fmt:message key="editProfile.lastName" /></label>
					<span id="profileLastName"></span>
				</div>
				
				<div class="profile_field txt_inv" id="profileAddress1Main">
					<label> <fmt:message key="editProfile.address1" /></label>
					<span id="profileAddress1"></span>
				</div>
				
				<div class="profile_field txt_inv" id="profileAddress2Main">
					<label> <fmt:message key="editProfile.address2" /></label>
					<span id="profileAddress2"></span>
				</div>
				
				<div class="profile_field txt_inv" id="profileCityMain">
					<label> <fmt:message key="editProfile.city" /></label>
					<span id="profileCity"></span>
				</div>
				
				<div class="profile_field txt_inv" id="profileStateMain">
					<label> <fmt:message key="editProfile.state" /></label>
					<span id="profileState"></span>
				</div>

				

				<hr class="profile_hr wid_area100">

				<!-- Card(s) on File -->
				<div class="profile_field width_area100 flt_lft">
					<div class="profile_card_area fnt_wt width_area42 mob_wid100" id="cardsTextForProfile">
						<fmt:message key="manageCard.debitTitle" />
					</div>
					<div class="mob_mrgn_top5"></div>
					<div class="profile_card_area width_area58 mob_wid100 mrgn_top_neg8 noCard" id="noCardsOnFile">
						<div class="clear"></div>
						<div class="mob_mrgn_top5"></div>
					</div>
				</div>
				
				<div class="profile_field width_area100 flt_lft txt_inv" id="creditProfileSection">
					<div class="profile_card_area fnt_wt width_area42 mob_wid100" id="">
						<fmt:message key="manageCard.creditTitle" />
					</div>
					<div class="mob_mrgn_top5"></div>
					<div class="profile_card_area width_area58 mob_wid100 mrgn_top_neg8 noCard" id="noCardsOnFileCredit">
						<div class="clear"></div>
						<div class="mob_mrgn_top5"></div>
					</div>
				</div>
			</div>		

		</div>
</div>