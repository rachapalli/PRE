<div id="addEditBillerAuxiliaryContainer" class="inner_box_new">
	<div class="add-edit-biller-container">
		<div id="auxiliaryPageId" class="find_bill_bg">
			<div class="wid_flt50 z101 pos_relnw">
				<input type="button" class="mob_btn_display bg_black mrgn_left10" 
				value="<fmt:message key="addBill.backEdit" />" onclick="backToAddOrEditBillPage()" /> 
			</div>
			<div class="wid_flt100 pos_absolute z100">
				<h1>
					<div id="auxiliaryBillerHeaderLbl" class="mobile_title_area">
					<fmt:message key="addBill.addBillLabel" />
				</div>
				</h1>
			</div>
			<div class="wid_flt50 txt_nwrght z101 pos_relnw">
					<input type="button" class="mob_btn_display sv_submit_inactive_btn mrgn_rght10" id="btnSaveAuxiliaryList" 
					value="<fmt:message key="addBill.saveBill" />"	onclick="submitSelectedBillerRemitanceZip();" />
			</div>			
		</div>
				
		<div id="mobilAuxListScrolableSection" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
		<!-- <div class="pay_connect_area"> -->
		<!-- Message Section Start -->
		<div id="auxiliaryBillerListMessageArea" class="pay_connect_info">
			<fmt:message key="auxList.message" />			
		</div>
		<!-- Message Section End -->	

			<!-- Dynamic Address List Start  -->
		<!-- Back and Save Button Area Start -->
			<div id="auxListBackBtn" class="auxuliary_btnmrgn_area">
				<div class="vesta_wd100 flt_none mrgn_center mob_width_area95">
					<input type="button" class="help_find_btn " onclick="showHelpMeFindMine();" value="<fmt:message key="auxList.helpMeTxtBtn" />">
				</div>
			</div>
			<!-- Back and Save Button Area End -->
			<div id="auxiliaryBillerListMainarea" class="aux_maincontainer">
			<div id="auxiliaryBillerListArea" class="payconnect_data_area"> </div>
			</div>	
			<!-- Dynamic Address List End -->

			<div class="clear"></div>

			<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button" class="mob_btn_display bg_black" 
						value="<fmt:message key="addBill.backEdit" />" onclick="backToAddOrEditBillPage()" />
					
					<input type="button" class="mob_btn_display sv_submit_inactive_btn" id="btnSaveAuxiliaryListBtm" 
						value="<fmt:message key="addBill.saveBill" />"	onclick="submitSelectedBillerRemitanceZip();" />
					
				</div>				
			<!-- bottom buttons END -->


		<!-- </div> -->
		<div class="clear"></div>
	</div>
	</div>
</div>