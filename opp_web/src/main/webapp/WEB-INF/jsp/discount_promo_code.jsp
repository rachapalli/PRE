<div class="clear"></div>
<div id="discountAndPromoCodeReg" class="discount_promo_headingtxt fnt_wt txt_inv"><fmt:message key="checkout.heading_txt" /></div>
<div class="chkout_guest_profile_promoarea bg_blue_box txt_inv guest_chkout_wid" id="promoCodeBox">	
	<div id="showGuesPromoCodeArea">
		<div id="chkPromoCodeIcon"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegFormOFPromoCode();"></div>
		<input type="checkbox" id="chkPromoCode" class="txt_inv" />
		<h1 id="promoCodeH1" class="chktgst_discount_promohead">
			<fmt:message key="checkout.promocode_h1" />
		</h1>		
	</div>

	<div class="clear"></div>
	<div id="frmGuestPromoCodeRes" class="chkout_create_profile_sec_a register_promo txt_inv">
		 <div class="checkout_gstpro_field wid_area100">
			<label for="Discount & Promo Code" class="flt_none min_wid100"><fmt:message
					key="checkout.heading_txt" />
			</label>
			<input type="text" name="promoCode" id="promoCodeDiscount1"
				placeholder='<fmt:message key="checkoutGuest.placeholder.discountpromo" />' />			
		</div> 
		<div class="checkout_gstpro_field wid_area100">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorPromoCode1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPromoCode1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdPromoCode"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
			
		</div>
		<div class="checkout_gstpro_field wid_area100">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorPromoCode2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPromoCode2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdPromoCode"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
			
		</div>

		<div class="checkout_gstpro_field wid_area100">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorPromoCode3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPromoCode3"></span>
			</div> 
			<input type="password" name="passwordfield" id="passwordPromoCode"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
			
		</div>

		<div class="checkout_gstpro_field wid_area100">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorPromoCode4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPromoCode4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoPromoCode"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
			
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhCreatProfPromo" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkCreatProfPromo"></span></div>
		</div>
		 
		<div class="checkout_gstpro_field wid_area100">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorPromoCode5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPromoCode5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodePromoCode" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
			
		</div>
		<div class="add_info_terms_condarea">
			<div id="checkoutDiscountPromoTermsCond" class="add_info_terms_condtxt">
			</div>
		</div>
		<div id="checkoutPromoBtmBtn" class="chkout_discount_promobtnarea">
		<input type="button" class="back_btn promo_btnwid flt_lft"
			value='<fmt:message key='checkout.cancel.button'/>' id="btnCancelPromoCode"
			onclick="showRegFormOFPromoCode()">
	
	    <input type="button" class="sv_submit_inactive_btn promo_btnwid mob_wid50 flt_rght" id="btnRegisterPromoCode"
			value="<fmt:message key='checkout.Register.button'/>" onclick="upgradeGuestUserToRegistered(14, 'frmGuestPromoCodeRes');" disabled="disabled">
	</div>
	</div>
</div>
