
<div id="paymentReceiptCreateAccBox" class="chkout_guest_profile_nwarea chkout_profile_width bg_blue_box txt_inv">
	<div id="showGuesPaymentReceiptCreateAcc" class="mrgn_area1" >
		<div id="paymentReceiptCreateAccIcon"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegFormPaymentReceiptCreateAcc();"></div>
		<input type="checkbox" id="paymentReceiptCreateAcc" class="txt_inv" />
		<h1 id="paymentReceiptCreateAccH1" class="black_col">
			<fmt:message key="summaryView.crtAcc_h1" />
		</h1>
		<h2 id="paymentReceiptCreateAccH2">
			<fmt:message key="addBill.guest_createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestPaymentReceiptCreateAcc" class="chkout_create_profile_sec_a bg_remove txt_inv">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaPaymentReceiptCreateAcc1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPaymentReceiptCreateAcc1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdPaymentReceiptCreateAcc"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaPaymentReceiptCreateAcc2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPaymentReceiptCreateAcc2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdPaymentReceiptCreateAcc"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaPaymentReceiptCreateAcc3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPaymentReceiptCreateAcc3"></span>
			</div>
			<input type="password" name="passwordfield" id="passwordPaymentReceiptCreateAcc"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaPaymentReceiptCreateAcc4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPaymentReceiptCreateAcc4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoPaymentReceiptCreateAcc"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhPayRcpt" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkPayRcpt"></span></div>
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaPaymentReceiptCreateAcc5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgPaymentReceiptCreateAcc5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodePaymentReceiptCreateAcc" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
			
		</div>
		
		<div class="add_info_terms_condarea">
			<div id="paymentReceiptCreateAccViewTermCond" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
	<div class="add_bill_btnmrgn_area flt_rght">
		<span>
			 <input type="button" class="sv_submit_inactive_btn txt_inv" id="btnContinuePaymentReceiptCreateAcc"
				value='<fmt:message key='summaryView.crtAccSubmit'/>' onclick="upgradeGuestUserToRegistered(9, 'frmGuestPaymentReceiptCreateAcc');" disabled="disabled">
		</span>
	</div>
</div>

<div id="paymentReceiptCreateAccBoxErrDiv" class="chkout_guest_profile_nwarea_a mob_txt_inv">
	
	<div id="errorSepratorPaymentReceiptCreateAcc1">
		<div id="errorMainAreaPaymentReceiptCreateAcc1" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc1"></span>
		</div>	
	</div>
	
	<div id="errorSepratorPaymentReceiptCreateAcc2">		
		<div id="errorMainAreaPaymentReceiptCreateAcc2" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc2"></span>
		</div>
	</div>	
	
	<div id="errorSepratorPaymentReceiptCreateAcc3">		
		<div id="errorMainAreaPaymentReceiptCreateAcc3" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc3"></span>
		</div>
	</div>	
	
	<div id="errorSepratorPaymentReceiptCreateAcc4">
		<div id="errorMainAreaPaymentReceiptCreateAcc4" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc4"></span>
		</div>
	</div>	
	
	<div id="errorSepratorPaymentReceiptCreateAcc49" class="hght72">
		<div id="errorMainAreaPaymentReceiptCreateAcc49" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc49"></span>
		</div>
	</div>	
	
	<div id="errorSepratorPaymentReceiptCreateAcc5">	
		<div id="errorMainAreaPaymentReceiptCreateAcc5" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgPaymentReceiptCreateAcc5"></span>
		</div>
	</div>	
</div>
