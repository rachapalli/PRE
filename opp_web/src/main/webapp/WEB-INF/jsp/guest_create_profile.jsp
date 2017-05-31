<div class="clear"></div>
<div class="chkout_guest_profile_nwarea bg_blue_box txt_inv guest_chkout_wid" id="createAccountBox">
	<div class="mrgn_area1" id="showGuesCreatAcctArea">
		<div id="chkCreateAccIcon"
			class="fa fa-check fa-2x add_bill_inactiv_chkbox_icon flt_lft" onclick="showRegForm();"></div>
		<input type="checkbox" id="chkCreateAcc" class="txt_inv" />
		<h1 id="createProfileH1" class="black_col">
			<fmt:message key="addBill.guest_createAcc_h1" />
		</h1>
		<h2 id="createProfileH2">
			<fmt:message key="addBill.guest_createAcc_h2" />
		</h2>
	</div>

	<div class="clear"></div>
	<div id="frmGuestCreateAcc" class="chkout_create_profile_sec_a txt_inv">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv desk_wid_input_guest" id="moberrorMainArea1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsg1"></span>
			</div>
			<input type="text" name="emailfield" id="emailId"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />
			
		</div>
		<div class="checkout_gstpro_field">
			<label for="Confirm Email" class="flt_none"><fmt:message
					key="createAccountGuest.reEnterEmail" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv desk_wid_input_guest" id="moberrorMainArea2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsg2"></span>
			</div>
			<input type="text" name="confirmemailfield" id="confrmEmailId"
				placeholder='<fmt:message key="createAccountGuest.placeholder.reEnterEmail" />' />
			
		</div>

		<div class="checkout_gstpro_field">
			<label for="Create Password" class="flt_none"><fmt:message
					key="createAccountGuest.password" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv desk_wid_input_guest" id="moberrorMainArea3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsg3"></span>
			</div> 
			<input type="password" name="passwordfield" id="password"
				placeholder='<fmt:message key="createAccountGuest.placeholder.password" />' />
			
		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv desk_wid_input_guest" id="moberrorMainArea4">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsg4"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNo"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />
			
		</div>
		 <div class="opt_in_txt">
				<div class="wid_flt5"><input type="checkbox" id="chkOptInEnhAddBill" checked/></div>
				<div class="wid_flt90"><span id="optInEhnChkAddBill"></span></div>
		</div>
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv desk_wid_input_guest" id="moberrorMainArea5">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsg5"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCode" maxlength="5"
				onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />
			
		</div>
		<div class="add_info_terms_condarea">
			<div id="addEditBillTermsArea" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
</div>

<!-- <div id="createAccountBoxErrDiv" class="chkout_guest_profile_nwarea_a mob_txt_inv">
	
	<div id="errorSeprator1">
		<div id="errorMainArea1" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg1"></span>
		</div>	
	</div>
	
	<div id="errorSeprator2">		
		<div id="errorMainArea2" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg2"></span>
		</div>
	</div>	
	
	<div id="errorSeprator3">		
		<div id="errorMainArea3" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg3"></span>
		</div>
	</div>	
	
	<div id="errorSeprator4">
		<div id="errorMainArea4" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg4"></span>
		</div>
	</div>	
	
	<div id="errorSeprator89" class="hght72">
		<div id="errorMainArea89" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg89"></span>
		</div>
	</div>	
	
	<div id="errorSeprator5">	
		<div id="errorMainArea5" class="error_main_area txt_inv">
			<div class="tooltiptail"></div>
			<span class="error_msg_display create_acc_errormsg" id="invalidMsg5"></span>
		</div>
	</div>	
</div> -->

 <div id="addBillerBtmBtn" class="add_bill_btnmrgn_area"></div>
