<div id="addMoneyInner" class="txt_inv">
<div class="add_money_container">
		<div id="addMoneyId" class="find_bill_bg">
			<h1><div class="mobile_title_area"><fmt:message key="addMoney.reloadPakTitle" /></div></h1>
		</div>
		<div id="addMoneyinstruction" class="pay_bill_txt">
			<h2><fmt:message key="addMoney.instruction" /></h2>
		</div>
	<div id="add_money_area" class="row_box">
	
		<div class="add_money_section_rght">
			<h1><fmt:message key="addMoneySuccess.ReloadItTitle" /></h1>
			<h2><fmt:message key="addMoney.ReloadItInstruction" /></h2>
			<div class="add_money_framebox" id="addMonyIframeContainer" title="<fmt:message key='addMoney.visualContextAreaUrl' />" >
			</div>
		</div>
	
		<div id="frmAddMoney" class="add_money_section_lft">
			<div class="create_acc_field">
				<label>
					<fmt:message key="addMoney.reloadPakNo" /><span class="red-astrick">*</span>
				</label>
				<input type="text" id="reloadPackNumber" class="new-textarea" maxlength="10" minlength="1" onkeypress="return isNumberKey(event)"/>
				<div class="error_main_area">
				<div id="tooltipaddtail1" class="tooltiptail txt_inv"></div>
				<span class="error_msg_display create_acc_errormsg txt_inv" id="invalidAddMsg1"></span>
				</div>
			</div>
			
			<div class="create_acc_field">	
				<label>
					<fmt:message key="addMoney.reloadPackAmt" /><span class="red-astrick">*</span>
				</label>
				<input type="text" id="reloadAmountpak" class="new-textarea" maxlength="7" />
				<div class="error_main_area">
				<div id="tooltipaddtail2" class="tooltiptail txt_inv"></div>
				<span class="error_msg_display create_acc_errormsg txt_inv" id="invalidAddMsg2"></span>
				</div>
			</div>
			
			<div class="add_money_btnsec">
				<input type="button" class="create_prof_grey_btn add_mny_fltlft" onclick="loadHomeScreenArea();" 
				value="<fmt:message key="createAccount.cancelBtn"/>" />
				<input id="addAmountBtn" type="button" class="create_prof_green_btn"  onclick="validateInputField();" 
				value="<fmt:message key="addMoney.addAmtBal"/>" />
			</div>
			<div class="clear"></div>
			<div class="disclaimer_add_money">
				<div><b><fmt:message key="addMoney.disclaimer"/></b></div>
				<fmt:message key="addMoney.disclaimerArea"/>
			</div>
		</div>	
	</div>
	<div class="clear"></div>
</div>
</div>
