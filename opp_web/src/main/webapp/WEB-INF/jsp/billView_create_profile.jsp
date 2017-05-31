<div class="clear"></div>
<div id="createAccountBoxBill" class="chkout_guest_profile_nwarea chkout_profile_width bg_yellow hist_acc_mrgn txt_inv">
	<div id="showGuesCreatAcctAreaBill" class="mrgn_area1" >
		<div id="chkCreateAccIconBill"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegFormBill();"></div>
		<input type="checkbox" id="chkCreateAccBill" class="txt_inv" />
		<h1 id="createProfileBillH1" class="black_col">
			<fmt:message key="summaryView.crtAcc_h1" />
		</h1>
		<h2 id="createProfileBillH2">
			<fmt:message key="addBill.guest_createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestCreateAccBill" class="chkout_create_profile_sec_a bg_remove txt_inv">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaBill1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgBill1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdBill"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaBill2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgBill2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailIdBill"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaBill3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgBill3"></span>
			</div>
			<input type="password" name="passwordfield" id="passwordBill"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaBill4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgBill4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoBill"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
		</div>
		
		<div class="opt_in_txt">
			<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhBillView" checked/></div>
			<div class="wid_flt90"><span id="optInEhnChkBillView"></span></div>
		</div>

		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv" id="moberrorMainAreaBill5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgBill5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodeBill" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
		</div>
		<div class="add_info_terms_condarea">
			<div id="billViewTermCond" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
	<div id="billViewCreateProfBtnArea" class="add_bill_btnmrgn_area hist_sbmt_btn">
	
		 <input type="button" class="sv_submit_inactive_btn txt_inv" id="btnContinueBill"
			value='<fmt:message key='summaryView.crtAccSubmit'/>' onclick="upgradeGuestUserToRegistered(5, 'frmGuestCreateAccBill');" disabled="disabled">
	   
	</div>
</div>

<!-- <div id="createAccountBoxErrDivBill" class="chkout_guest_profile_nwarea_a mob_txt_inv">
	
	<div id="errorSepratorBill1">
		<div id="errorMainAreaBill1" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill1"></span>
		</div>	
	</div>
	
	<div id="errorSepratorBill2">		
		<div id="errorMainAreaBill2" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill2"></span>
		</div>
	</div>	
	
	<div id="errorSepratorBill3">		
		<div id="errorMainAreaBill3" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill3"></span>
		</div>
	</div>	
	
	<div id="errorSepratorBill4">
		<div id="errorMainAreaBill4" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill4"></span>
		</div>
	</div>	
	
	<div id="errorSepratorBill49" class="hght72">
		<div id="errorMainAreaBill49" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill49"></span>
		</div>
	</div>	
	
	<div id="errorSepratorBill5">	
		<div id="errorMainAreaBill5" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsgBill5"></span>
		</div>
	</div>	
</div> -->
