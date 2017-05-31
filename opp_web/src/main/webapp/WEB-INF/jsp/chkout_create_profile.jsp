<div class="chkout_guest_profile_nwarea chkout_profile_width bg_yellow_box txt_inv" id="createAccountBoxChkOut">
	<div class="mrgn_area1" id="showGuesCreatAcctAreaChkOut">
		<h1 id="createProfileH1ChkOut" class="black_col">
			<fmt:message key="checkout.createAcc_h1" />
		</h1>
		<h2 id="createProfileH2ChkOut">
			<fmt:message key="checkout.createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestCreateAccChkOut" class="chkout_create_profile_sec_a">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="lbl_width_area flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaChkOut1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgChkOut1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
		</div>
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="lbl_width_area flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaChkOut2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgChkOut2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="lbl_width_area flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaChkOut3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgChkOut3"></span>
			</div>
			<input type="password" name="passwordfield" id="passwordChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="lbl_width_area flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaChkOut4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgChkOut4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhCreatProf" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkCreatProf"></span></div>
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="lbl_width_area flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaChkOut5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgChkOut5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodeChkOut" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
		</div>
		<!-- <div class="checkout_gstpro_field">
			<label for="Discount &amp; Promo Code" class="lbl_width_area flt_none"><fmt:message
					key="checkout.heading_txt" />
			</label>
			<input type="text" name="promoCode" id="promoCodeDiscount2" placeholder="Enter Code">			
		</div> -->
		<div class="add_info_terms_condarea">
			<div id="chkoutCreateProfTermsCondAre" class="add_info_terms_condtxt">
			</div>
		</div>
		
		<div id="createAccChkCancelBTn" class="chkout_discount_promobtnarea">
	    	<input type="button" class="sv_submit_inactive_btn promo_btnwid mob_wid50 flt_rght" id="createAccChkRegisterBtn"
			value="<fmt:message key='checkout.Register.button'/>" onclick="upgradeGuestUserToRegistered(1, 'frmGuestCreateAccChkOut');" disabled="disabled"/>
		</div>
		
	</div>
</div>
