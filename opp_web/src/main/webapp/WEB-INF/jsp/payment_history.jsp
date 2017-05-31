<!-- <div id="paymentHistoryOuter" class="backdrop"></div> -->
<div id="child_div_hist">
	<div id="paymentHistoryInner" class="inner_box_new">
		<!-- <div id="paymentHistory_close_button" class="close"></div> -->

		<div class="find_bill_bg wid_flt100" id="paymentHistoryId">
			<h1>
				<div class="mobile_title_area">
					<fmt:message key="paymentHistory.title" />
				</div>
			</h1>
			<!-- <div class="wid_flt60 mob_wid100">
				<div class="pay_bill_txt">
					<h2>
						<fmt:message key="billView.subtitle" />
					</h2>
				</div>
			</div> 
			<div class="wid_flt40">
				<input type="button" class="summary_receipt_view_btn flt_rght"
					value="<fmt:message key="paymentHistory.receiptViewText" />"
					id="receiptViewBtn" onclick="navigateToSummaryView()">
			</div> -->
		</div>


		<div class="clear"></div>

		<div id="mobBillErrorMsgDiv" class="mob_error_msg txt_inv">
			<span class="failed_icon"></span><span id="mobBillErrorMsg"></span>
		</div>

		<div id="paymentHistoryAreaId" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
			<div class="bill_view_desg_area">

				<div class="clear"></div>
				<div id="paymentScheduledTableArea"></div>
				<div id="paymentHistoryTableArea"></div>
			</div>
			<div id="createAccountBillSection" class="txt_inv">
				<%@include file="billView_create_profile.jsp"%>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>