<div class="additional_info_box bg_yellow_box txt_inv guest_chkout_wid" id="additional_info_box">
	<h1 class="black_col">
		<fmt:message key="checkout.addInfo_h1" />
	</h1>
	<h2>
		<fmt:message key="checkout.addInfo_h2" />
	</h2>

	<!-- Storing the default value for First and Last name to send in api as required params and hiding the fields -->
	<input id="chkFirstName" type="hidden" 
		value='<fmt:message key="createAccount.firstNameInput" />' /> <input
		id="chkLastName" type="hidden" 
		value='<fmt:message key="createAccount.lastNameInput" />' />
	<!-- End Hiding fields -->

	<div id="frmGuestAddInfoChkOut" class="additional_info_sec_a">
		<div class="checkout_gstpro_field">
			<label for="Enter Email" class="flt_none"><fmt:message
					key="createAccountGuest.email" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaAddInfoChkOut1">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgAddInfoChkOut1"></span>
			</div>
			<input type="text" name="emailfield" id="emailIdAddInfoChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.email" />' />

		</div>

		<div class="checkout_gstpro_field">
			<label for="Enter Mobile phone" class="flt_none"><fmt:message
					key="createAccountGuest.mobile" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaAddInfoChkOut2">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgAddInfoChkOut2"></span>
			</div>
			<input type="tel" name="mobilefield" id="mobileNoAddInfoChkOut"
				placeholder='<fmt:message key="createAccountGuest.placeholder.mobile" />' />

		</div>
		<div class="opt_in_txt">
				<div class="wid_flt5 mob_wid10"><input type="checkbox" id="chkOptInEnhAddInfo" checked/></div>
				<div class="wid_flt90"><span id="optInEhnChkAddInfo"></span></div>
		</div>
		
		<div class="checkout_gstpro_field">
			<label for="Zip Code" class="flt_none"><fmt:message
					key="createAccountGuest.zip" /><span class="red-astrick">*</span>
			</label>
			<div class="mob_error_msg txt_inv wid_error97" id="moberrorMainAreaAddInfoChkOut3">
				<span class="failed_icon"></span>
				<span id="mobinvalidMsgAddInfoChkOut3"></span>
			</div>
			<input type="tel" name="zipcodefield" id="zipCodeAddInfoChkOut"
				maxlength="5" onkeypress="return isNumberKey(event)"
				placeholder='<fmt:message key="createAccountGuest.placeholder.zip" />' />

		</div>

		<div class="add_info_terms_condarea">
			<div id="addInfoTermsCondAre" class="add_info_terms_condtxt">
			</div>
		</div>
	</div>
</div>