<div class="clear"></div>
<div id="createAccountBoxDetail" class="chkout_guest_profile_nwarea chkout_profile_width bg_yellow hist_acc_mrgn">
	<div id="showGuesCreatAcctAreaDetail" class="mrgn_area1" >
		<div id="chkCreateAccIconDetail"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegFormDetail();"></div>
		<input type="checkbox" id="chkCreateAccDetail" class="txt_inv" />
		<h1 id="createProfileDetailH1" class="black_col">
			<fmt:message key="summaryView.crtAcc_h1" />
		</h1>
		<h2 id="createProfileDetailH2">
			<fmt:message key="addBill.guest_createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestCreateAccDetail" class="chkout_create_profile_sec_a bg_remove txt_inv">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaDetail1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgDetail1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdDetail"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaDetail2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgDetail2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdDetail"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaDetail3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgDetail3"></span>
			</div>
			<input type="password" name="passwordfield" id="passwordDetail"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaDetail4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgDetail4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoDetail"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhDetail" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkDetail"></span></div>
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaDetail5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgDetail5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodeDetail" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
		</div>
		<div class="add_info_terms_condarea">
			<div id="detailViewTermCond" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
	<div id="detailViewCreateProfBtnArea" class="add_bill_btnmrgn_area hist_sbmt_btn">
		<span class="pos_rel mob_mrgn0">
			 <input type="button" class="sv_submit_inactive_btn  mob_min_wid288 txt_inv" id="btnContinueDetail"
				value='<fmt:message key='summaryView.crtAccSubmit'/>' onclick="upgradeGuestUserToRegistered(4, 'frmGuestCreateAccDetail');" disabled="disabled">
		</span>
	</div>
</div>

<div id="createAccountBoxErrDivDetail" class="chkout_guest_profile_nwarea_a mob_txt_inv">
	
	<div id="errorSepratorDetail1">
		<div id="errorMainAreaDetail1" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail1"></span>
		</div>	
	</div>
	
	<div id="errorSepratorDetail2">		
		<div id="errorMainAreaDetail2" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail2"></span>
		</div>
	</div>	
	
	<div id="errorSepratorDetail3">		
		<div id="errorMainAreaDetail3" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail3"></span>
		</div>
	</div>	
	
	<div id="errorSepratorDetail4">
		<div id="errorMainAreaDetail4" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail4"></span>
		</div>
	</div>	
	
	<div id="errorSepratorDetail49" class="hght72">
		<div id="errorMainAreaDetail49" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail49"></span>
		</div>
	</div>	
	
	<div id="errorSepratorDetail5">	
		<div id="errorMainAreaDetail5" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgDetail5"></span>
		</div>
	</div>	
</div>
