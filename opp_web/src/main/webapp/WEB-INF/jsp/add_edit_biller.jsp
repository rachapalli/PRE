<div id="addEditBillerInner" class="inner_box_new">
	<div class="add-edit-biller-container">
		<div class="find_bill_bg" id="addEditBillerId">
			<div class="wid_flt50 z101 pos_relnw">
				<input type="button"
					class="blue_backbtn mob_btn_display mrgn_left10"
					value='<fmt:message key='addBill.backEdit'/>' id="btnBack"
					onclick="backToHomeFromEditBill()" />
			</div>
			<div class="wid_flt100 pos_absolute z100">
				<h1>
					<div class="mobile_title_area z100" id="addEditLabel"></div>
				</h1>
			</div>
			<div class="wid_flt50 txt_nwrght z101 pos_relnw">
				<input type="button"
					class="mob_btn_display sv_submit_inactive_btn mrgn_rght10"
					id="btnContinue" value='<fmt:message key='addBill.saveBill'/>'
					onclick='callGuestOrAccCreationOrIW();' disabled="disabled" />
			</div>
		</div>

		<div class="pay_bill_txt txt_inv">
			<h2>
				<label id="postingCategoryLanguage" class="float-left mrgn_rght"></label>
				<label id="postingCategoryHelp" class="float-left"></label>
			</h2>
		</div>

		<div id="add_edit_biller_area" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
			<div id="addEditBillerForm" class="add_edit_left_section">
				<div class="add_bill_mrgn">
					<div id="addBil_billerName" class="add_bill_heading"></div>
					<div class="clear"></div>
					<label id="addBil_billerType" class="add_bill_txt"></label>
                    <label class="add_bill_txt pipe">|</label>
                    <label id="addBil_postingCategoryLanguage" class="add_bill_txt"></label>
                    <div id="addBil_deliveryIcon" class="fa fa-bolt fa-lg express_icon txt_inv"></div>
				</div>
				<div id="billerFormData" class="add_biller_nicknamesec">
					<div id="nickNameSec" class="create_acc_field">
						<label><fmt:message key="addBill.nickName" /><span
							class="red-astrick">*</span> </label> <input type="text" id="nickName"
							maxlength="128" minlength="1"
							placeholder='<fmt:message key="addBill.nickName" />' />
					</div>
				</div>
				<div id="billerData" class="mob_mrgn2 clear"></div>

				<div class="width_area100">
					<div id="billerUserData" class="add_edit_user_data txt_inv"></div>
				</div>
			</div>
			<%@include file="guest_create_profile.jsp"%>
			
			<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button"
							class="blue_backbtn mob_btn_display mrgn_left10"
							value='<fmt:message key='addBill.backEdit'/>' id="btnBackBtm"
							onclick="backToHomeFromEditBill()" />
					
					<input type="button"
							class="mob_btn_display sv_submit_inactive_btn mrgn_rght10"
							id="btnContinueBtm" value='<fmt:message key='addBill.saveBill'/>'
							onclick='callGuestOrAccCreationOrIW();' disabled="disabled" />
					
				</div>				
			<!-- bottom buttons END -->
		</div>
		<div class="clear"></div>
	</div>
</div>