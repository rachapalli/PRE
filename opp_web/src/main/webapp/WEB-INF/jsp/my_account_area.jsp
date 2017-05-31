<div class="acc_box_section">
	<div class="my_account_area_abv">
		<div class="account_img_area">
			<i class="mob_profile_icon fa fa-check-square-o"></i>
		</div>
		<div class="acc_heading_txt fnt_wt flt_lft">
			<fmt:message key="main_pay.my_account" />
		</div>
		<input type="button" id=""
			value="<fmt:message key="main_pay.signoutLabel" />"
			class="mob_btn_display account_box_btn bg_lightblue flt_rght"
			onclick="loadIndexPage()" />
		<div class="clear"></div>
	</div>
	<div id="creditAvbl" class="brdr_credit txt_inv">
			<div class="avl_credits">
				<fmt:message key="main_pay.credits_msg" />
			</div>
			<div class="avl_credit_price"></div>
	</div>
	<div class="clear"></div>
	<div id="rightPanelBillStatus" class="my_account_area_blw">
		<div class="bill_status_txthd">
			<fmt:message key="main_pay.bill_status" />
		</div>
		<!-- Include general_submit_alert.jsp  -->
				<%@include
					file="/WEB-INF/jsp/general_alerts/general_sidebar_success_alert.jsp"%>
		<!-- End of general_submit_alert.jsp -->
		<!-- Include general_submit_alert.jsp  -->
				<%@include
					file="/WEB-INF/jsp/general_alerts/general_sidebar_filure_alert.jsp"%>
		<!-- End of general_submit_alert.jsp -->
		<div class="latest_pay_txt wid_flt90">
			<span id="no_payment_hist" class="txt_inv"> </span>
		</div>
		<div id="outer_sch" class="wid_flt100">
			<div id="inner_sch"></div>
		</div>

		<div id="slide-wrap">
			<div id="inner-wrap"></div>
		</div>
		<div class="clear"></div>

	</div>
	<input type="button" id="showAllHistBtn"
		value="<fmt:message key="main_pay.seeMorebills" />"
		class="mob_btn_display account_box_morebtn flt_rght"
		onclick="navigateToBillView(false,'seeMoreBillsClick');" />
</div>
