<div id="pay_bill_sec" class="pay_bill_container">
	<div class="find_bill_bg" id="payBillId">
		<div class="wid_flt50 z101 pos_relnw">
			<input type="button" id="addBillBtnId"
				value="<fmt:message key="main_pay.mob_addBillLabel"/>"
				class="mob_btn_display bg_lightblue mrgn_left10"
				onclick="navigateToBillerSearch(true)" />
		</div>
		<div class="wid_flt100 pos_absolute z100">
			<h1>
				<div class="mobile_title_area z100">
					<fmt:message key="main_pay.pay_bill_title" />
				</div>
			</h1>
		</div>
		<div class="wid_flt50 txt_nwrght z101 pos_relnw">
			<input type="button" id="nextBtnOfMainPage"
				value="<fmt:message key="main_pay.mob_nextBtnLabel"/>"
				class="mob_btn_display sv_submit_inactive_btn mrgn_rght10"
				onclick="btnVerifyClick()" disabled="disabled" />
		</div>
	</div>

	
		<div id="mainHolderOuter" class="row_box main-holder-marg">
		<div id="mainHolderInner" class="wid_flt100">
		<div id="inlineMsgId" class="rownew"></div>
				<!-- Include general_error_alert.jsp  -->
				<%@include file="/WEB-INF/jsp/general_alerts/general_error_alert.jsp"%>
				<!-- End of general_error_alert.jsp -->

				<!-- Include general_submit_alert.jsp  -->
				<%@include file="/WEB-INF/jsp/general_alerts/general_submit_alert.jsp"%>
				<!-- End of general_submit_alert.jsp -->

				<!-- Include general_success_alert.jsp  -->
				<%@include file="/WEB-INF/jsp/general_alerts/general_success_alert.jsp"%>
				<!-- End of general_success_alert.jsp -->
				
				<!-- Include inline_error_message.jsp  -->
				<%-- <%@include file="/WEB-INF/jsp/inline_error_message.jsp"%> --%>
				<!-- End of inline_error_message.jsp -->
				
				<!-- Include inline_success_message.jsp  -->
				<%-- <%@include file="/WEB-INF/jsp/inline_success_message.jsp"%> --%>
				<!-- End of inline_success_message.jsp -->
				
				<!-- getting started message -->
				<div class="general_success pos_login_rel" id="helpNotification" >
					<div class="submit_text cursor_pntr fnt_wtn helpNotificationFont" id="helpNotificationText" onclick="showNeedHelpUrl()"><fmt:message key="gettingStartedMessage" /></div>
					<div class="fa fa-times fa-2x" id="helpNotificationCancel" onclick="setCookieForNeedhelpNotification('helpNotification')"></div>
					<div class="clear"></div>
				</div>
				<!-- END getting started message -->
				
				<!-- Add Biller Button to show when there is no biller added -->
				<div id="btnFindBillDiv" class="nw_bill_area"
					onclick="navigateToBillerSearch(true)">
					<div class="add_billnw_btn" id="btnFindBill">
						<div class="add_bill_btntxt" id="add_bill_tag">
							<div class="add_nwbill_txtarea">
								<span class="plus_txt_icon"></span>
								<fmt:message key="main_pay.addBillLabel" />
							</div>
						</div>
					</div>
				</div>
				
				<div id="MainHolder"></div>

				<!-- Include selected_payment_area.jsp for Selected_Payment_Area Section -->
				<%@include file="/WEB-INF/jsp/selected_payment_area.jsp"%>
				<!-- End of Selected_Payment_Area Section -->
				
				<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					
						<input type="button" id="addBillBtnIdBtm"
							value="<fmt:message key="main_pay.mob_addBillLabel"/>"
							class="mob_btn_display bg_lightblue"
							onclick="navigateToBillerSearch(true)" />
					
					
						<input type="button" id="nextBtnOfMainPageBtm"
							value="<fmt:message key="main_pay.mob_nextBtnLabel"/>"
							class="mob_btn_display sv_submit_inactive_btn"
							onclick="btnVerifyClick()" disabled="disabled" />
					
				</div>				
				<!-- bottom buttons END -->
			</div>
		</div>
</div>
