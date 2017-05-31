<div id="sel_pay_container" class="sel_payment_container bg_lightblue txt_inv">
	<span class="summaryText"><fmt:message key="checkout.lbl_review_bills" /></span> 
	<span id="detailArrowupId" class="detailArrowup fa fa-caret-up" onclick="amountDueExpand('sel_pay_container','amountDueArrow')"></span>
	<div class="clear"></div>

	<div class="totalbox_container">
		<span id="paymentAmountTotalSelPay">
			<!-- Payments Total Section -->
			<div class="totalpay_txt_head">
				<label>
					<fmt:message key="main_pay.paytotLabel" />
				</label>
			</div>
			<div class="total_payment_price">
				<label id="paymentAmountTotal" class="dynamiclab">
					<fmt:message key="main_pay.fees" />
				</label>
			</div>
			<!-- End Payments Total Section -->
			
			<!-- Fees Applied Section -->
			<div id="feeAmountTotalHead" class="totalpay_txt_head">
				<label>
					<fmt:message key="main_pay.feestotLabel" />
				</label>
				<span class="fa fa-bolt fa-lg express_icon_history"></span>
			</div>
			<div class="total_payment_price">
				<label id="feeAmountTotal" class="dynamiclab">
					<fmt:message key="main_pay.fees" />
				</label>
			</div>
			<!-- End Fees Applied Section -->
			
			<!-- Credits Applied Section -->
			<div id="creditsAppliedHead" class="totalpay_txt_head">
				<label>
					<fmt:message key="main_pay.popup.creditsApplied" />
				</label>
			</div>
			<div class="total_payment_price">
				<label id="creditsAppliedTotal" class="dynamiclab">
					<fmt:message key="main_pay.fees" />
				</label>
			</div>
			<!-- End Credits Applied Section -->
		</span>
	</div>
</div>
<hr class="def_hr" />
<div id="mainpaymentTotalLabel" class="wid_flt100 bg_lightblue mrgn_bottom5 txt_inv">
       <div class="textBar">
        <div class="totalpay_txt_head totalpay_mrgn fnt_wt dueText">
        	<label>
        		<fmt:message key="main_pay.confirm_amountDue" />
        	</label>
        </div>
       </div>
        <div class="labelBar fnt_wt amountDue">
        	<div id="amountDueArrow" class="detailArrowdown fa fa-caret-down" onclick="amountDueExpand('sel_pay_container','amountDueArrow' )"></div>
        	<label id="mainPayAmountDueTotal" class="dynamiclab">
        		<fmt:message key="main_pay.fees" />
        	</label>
        </div>
</div>
