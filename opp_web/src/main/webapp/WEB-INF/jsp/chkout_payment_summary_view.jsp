<div id="checkoutShowPaymentDetailView"
	class="inner_box_blnc_dtl txt_inv">

	<div class="search-info-inner flt_lft">
		<div id="chkPaymentReceiptId" class="find_bill_bg">
			<h1>
				<fmt:message key="checkout.lbl_payment_summary" />
			</h1>
		</div>
		<div id="chkoutPaymentRecepit" class="row_box">
			<div id="checkoutPaymentDetailView"></div>

			<div class="clear"></div>
			<div class="width_area80 mob_wid100">
				<input type="button" class="trans_hist_btn mrgn_pmt_sumbtn flt_lft"
					id="showAllHistOfPaymentReceipt"
					value='<fmt:message key='checkout.show_transactionhistory'/>'
					onclick='navigateToBillView(false);'>
				<div id="paymentSocialMedia"></div>
			</div>
			<div class="clear"></div>
			<!-- create profile receipt section start -->
			<%@ include file="/WEB-INF/jsp/chkout_paymentReceipt_createProf.jsp"%>
			<!-- create profile section end -->

		</div>

	</div>
	<div class="clear"></div>
</div>
