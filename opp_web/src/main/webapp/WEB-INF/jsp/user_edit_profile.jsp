<div id="editProfileContainer" class="create_account_container txt_inv">
	<div class="find_bill_bg" id="editProfileId">
		<div class="wid_flt50 z101 pos_relnw">
			<input type="button" value="<fmt:message key="editProfile.backBtn"/>"
				class="mob_btn_display paybill_nxtbtn bg_black mrgn_left10" onclick="navigateToProfile('#editProfile');" />
		</div>

		<div class="wid_flt100 pos_absolute z100">
			<h1>
				<div class="mobile_title_area z100">
					<fmt:message key="editProfile.title" />
				</div>
			</h1>
		</div>

		<div class="wid_flt50 txt_nwrght z101 pos_relnw">
			<input type="button" id="editProfileUpdateBtn" value="<fmt:message key="editProfile.saveBtn"/>"
				class="mob_btn_display bg_green mrgn_rght10" onclick="profileValidateOnSubmit();" />
		</div>
		<div class="edit_profile_subtxt pdng_top15">
			<h2 class="mob_mrgn_left3">
				<fmt:message key="editProfile.instructions" />
			</h2>
		</div>
	</div>
	
	<div class="clear"></div>
	<form action="" method="POST" data-form="validate">
		<div id="edit_profile_area" class="row_box main-holder-marg">
			<div id="inlineMsgId" class="rownew"></div>
			<!-- Account Information Section End -->
			<div class="clear"></div>
			<div class="edit_profile_section_lft">
				<!-- First Name -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.firstName" /> </label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorFirstNameMsg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan">
							<fmt:message  key="editProfile.errorMsg.firstName" />
						</span>
					</div>
					<input type="text" id="editProfileFirstName" />
				</div>

				<!-- Last Name -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.lastName" /></label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorLastNameMsg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan">
							<fmt:message  key="editProfile.errorMsg.lastName" />
						</span>
					</div>
					<input type="text" id="editProfileLastName" />
				</div>

				<!-- Address 1  -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.address1" /></label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorAdd1Msg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan">
							<fmt:message key="editProfile.errorMsg.add1" />
						</span>
					</div>
					<input type="text" id="editProfileAdd1" />
				</div>

				<!-- Address 2  -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.address2" /></label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorAdd2Msg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan">
							<fmt:message key="editProfile.errorMsg.add2" />
						</span>
					</div>
					<input type="text" id="editProfileAdd2" />
				</div>

				<!-- City -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.city" /></label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorCityMsg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan">
							<fmt:message key="editProfile.errorMsg.city" />
						</span>
					</div>
					<input type="text" id="editProfileCity" />
				</div>

				<!-- State -->
				<div class="edit_profile_field">
					<label><fmt:message key="editProfile.state" /></label>
					<div class="mob_error_msg desk_wid_input txt_inv">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan"></span>
					</div>
					<!-- State Drop-down Start -->
					<fmt:message key="editProfile.state.code.counter" var="loopEndPoint" />
					<select id="editProfileState">
                        <option value="">
                            <fmt:message key="editProfile.state.codeOption.0" />
                        </option>
						<c:forEach var="i" begin="1" end="${loopEndPoint }">
							<option value="<fmt:message key="editProfile.state.codeValue.${i}" />">
								<fmt:message key="editProfile.state.codeOption.${i}" />
							</option>
						</c:forEach>
					</select>
					<!-- State Drop-down End -->
					<div class="txt_inv error_main_area" id="ep_errorStateMsg">
						<div class="tooltiptail"></div>
					</div>
				</div>

				<!-- ZIP -->
				<div class="edit_profile_field">
					<label>
						<fmt:message key="editProfile.zip" />
						<span class="red-astrick">*</span>
					</label>
					<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorZipMsg_mob">
						<span class="failed_icon"></span>
						<span class="mobErorMsgSpan" id="ep_errorZipMsg_span"></span>
					</div>
					<input type="tel" id="editProfileZip" maxlength="5" onkeypress="return isNumberKey(event)" />
				</div>
			</div>
			<div class="edit_profile_section_rght">
				<!-- Edit Profile Section End -->

				<!-- Start Div Move Data Right Section of page -->
				<div id="editProfileMoveToRight">
					<div class="edit_profile_field">
						<label>
							<fmt:message key="editProfile.email" />
								<span class="red-astrick">*</span>
						</label>
						<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorEmailMsg_mob">
							<span class="failed_icon"></span>
							<span class="mobErorMsgSpan" id="ep_errorEmailMsg_span"></span>
						</div>
						<input type="email" id="editProfileEmail" />
					</div>

					<div class="edit_profile_field" id="editProfile_ReEnterEmail">
						<label>
							<fmt:message key="editProfile.reEnterEmail" />
							<span class="red-astrick">*</span>
						</label>
						<div class="mob_error_msg desk_wid_input txt_inv" id="editProfileReEnterEmail_mob">
							<span class="failed_icon"></span>
							<span class="mobErorMsgSpan"></span>
						</div>
						<input type="email" id="editProfileReEnterEmail" />
						<div class="txt_inv error_main_area" id="ep_errorEmailMsgReEnter">
							<div class="tooltiptail"></div>
							<span class="error_msg_display create_acc_errormsg">
								<fmt:message key="editProfile.errorMsg.reEnterEmail" />
							</span>
						</div>
						<div class="txt_inv error_main_area" id="ep_errorEmailMsgMismatch">
							<div class="tooltiptail"></div>
							<span class="error_msg_display create_acc_errormsg">
								 <fmt:message key="editProfile.errorMsg.emailMismatch" />
							</span>
						</div>
					</div>
					<div class="edit_profile_field" id="editProfile_Phone">
						<label>
							<fmt:message key="editProfile.phone" />
							<span class="red-astrick">*</span>
						</label>
						<div class="mob_error_msg desk_wid_input txt_inv" id="ep_errorPhoneMsg_mob">
							<span class="failed_icon"></span>
							<span id="ep_errorPhoneMsg_span" class="mobErorMsgSpan"></span>
						</div>
						<input type="tel" id="editProfilePhone" maxlength="14" />
					</div>
					<div class="edit_profile_field">
						<label>
							<fmt:message key="editProfile.contactPref" />
							 <span class="red-astrick">*</span>
						</label>
						<fmt:message key="editProfile.contactPref.counter" var="loopStartPoint" />
						<select id="editProfilePrefredComm">
							<c:forEach var="i" begin="0" end="${loopStartPoint }">
								<option value='<fmt:message key="editProfile.contactPref.option.value.${i}" />'>
									<fmt:message key="editProfile.contactPref.option.${i}" />
								</option>
							</c:forEach>
						</select>
					</div>
					
					<div class="opt_in_txt">
						<div class="mrgn_rght flt_lft pdng_top3">
							<input type="checkbox" id="chkOptInEnhEditProf" />
						</div>
						<div class="wid_flt90">
							<span id="optInEhnChkEditProf"></span>
						</div>
						<div id='editProfileBottomId'></div>
					</div>
				</div>
			</div>
			<!-- End Div Move Data Right Section of page -->
			<div class="clear"></div>
			
			<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button" value="<fmt:message key="editProfile.backBtn"/>"
						class="mob_btn_display paybill_nxtbtn bg_black" onclick="navigateToProfile('#editProfile');" />
					
					<input type="button" id="editProfileUpdateBtnBtm" value="<fmt:message key="editProfile.saveBtn"/>"
						class="mob_btn_display bg_green" onclick="profileValidateOnSubmit();" />
					
				</div>				
			<!-- bottom buttons END -->
		</div>
	</form>
</div>
