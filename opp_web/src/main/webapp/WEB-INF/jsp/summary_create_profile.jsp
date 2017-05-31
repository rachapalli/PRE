<div class="clear"></div>
<div id="createAccountBoxSummary" class="chkout_guest_profile_nwarea chkout_profile_width bg_yellow hist_acc_mrgn bg_blue_box txt_inv">
	<div id="showGuesCreatAcctAreaSummary" class="mrgn_area1" >
		<div id="chkCreateAccIconSummary"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegFormSummary();"></div>
		<input type="checkbox" id="chkCreateAccSummary" class="txt_inv" />
		<h1 id="createProfileSummaryH1" class="black_col">
			<fmt:message key="summaryView.crtAcc_h1" />
		</h1>
		<h2 id="createProfileSummaryH2">
			<fmt:message key="addBill.guest_createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestCreateAccSummary" class="chkout_create_profile_sec_a bg_remove txt_inv">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaSummary1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgSummary1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdSummary"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
		</div>
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaSummary2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgSummary2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdSummary"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaSummary3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgSummary3"></span>
			</div>
			<input type="password" name="passwordfield" id="passwordSummary"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaSummary4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgSummary4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoSummary"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhSummary" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkSummary"></span></div>
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaSummary5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgSummary5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodeSummary" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
		</div>
		<div class="add_info_terms_condarea">
			<div id="summaryViewTermCond" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
	<div id="summaryViewCreateProfBtnArea" class="hist_sbmt_btn mrgn_btm5">
	<span class="margin0">
		 <input type="button" class="sv_submit_inactive_btn mob_min_wid288 txt_inv mrgn_none" id="btnContinueSummary"
			value='<fmt:message key='summaryView.crtAccSubmit'/>' onclick="upgradeGuestUserToRegistered(3, 'frmGuestCreateAccSummary');" disabled="disabled">
			</span>
	</div>
</div>

<!-- <div id="createAccountBoxErrDivSummary" class="chkout_guest_profile_nwarea_a mob_txt_inv">
	
	<div id="errorSepratorSummary1">
		<div id="errorMainAreaSummary1" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary1"></span>
		</div>	
	</div>
	
	<div id="errorSepratorSummary2">		
		<div id="errorMainAreaSummary2" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary2"></span>
		</div>
	</div>	
	
	<div id="errorSepratorSummary3">		
		<div id="errorMainAreaSummary3" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary3"></span>
		</div>
	</div>	
	
	<div id="errorSepratorSummary4">
		<div id="errorMainAreaSummary4" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary4"></span>
		</div>
	</div>
	
	<div id="errorSepratorSummary49" class="hght72">
		<div id="errorMainAreaSummary49" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary49"></span>
		</div>
	</div>	
	
	<div id="errorSepratorSummary5">	
		<div id="errorMainAreaSummary5" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgSummary5"></span>
		</div>
	</div>	
</div> -->
