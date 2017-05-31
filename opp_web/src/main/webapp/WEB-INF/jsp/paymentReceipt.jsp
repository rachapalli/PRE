<!-- <div id="paymentReceiptOuter" class="backdrop"></div> -->
<div id="paymentReceiptInner" class="inner_box_new">
	<!-- <div id="paymentReceipt_close_button" class="close"></div> -->
	<div class="submit_payment_container">
		<div class="find_bill_bg" id="paymentReceiptId">
			<h1>
				<fmt:message key="paymentReceipt.title" />
			</h1>
		</div>

		<div id="pay_rcpt_section" class="row_box">
			<div id="receipt_header2" class="pay_bill_txt pymnt_rcpt_bgarea">
				<div class="pymnt_rcpt_bgarea1">
					<h2 id="receipt_h2" class="receipt_subheadtxt">
						<fmt:message key="paymentConfirmation.scheduled_pay" />
					</h2>
				</div>
			</div>

			<div id="userinfo" class="account_info_conf_rec_container">
				<h1>
					<div align='left' class="account_info_img"></div>
					<fmt:message key="main_pay.acc_info_title" />
				</h1>

				<div class="acc_id_confirm_txt">
					<span class="txt_hglt"> <label><fmt:message
								key="main_pay.acc_info_userName" /> </label> </span><label id="userNamePmt"
						class="dynamiclab"></label>
				</div>
				<div class="acc_id_confirm_txt">
					<span class="txt_hglt"> <label><fmt:message
								key="main_pay.acc_info_user" /> </label></span><label id="userAccountNumberPmt"
						class="dynamiclab"></label> 
				</div>
			</div>

			<div id="paymentReceiptTableArea" class="paymnt-pad"></div>

			<div id="pymnt_section_receipt" class="pymnt_section_submit"></div>

			<div class="payment_total">
				<div class="payment_total_inner">

					<label class="conf_payment_total"><fmt:message
							key="paymentConfirmation.payTotalLabel" /> </label> <label
						class="conf_payment_total_res" id="pmt_total_value_rcpt"></label>

					<div class="clearfloat"></div>
					<label class="conf_payment_total" for="fee_total_val_receipt"><fmt:message
							key="paymentConfirmation.feeTotalLabel" /> </label> <label
						class="conf_payment_total_res" id="fee_total_value_rcpt"></label>

					<div class="clearfloat"></div>
					<label class="conf_payment_total"><strong><fmt:message
								key="paymentConfirmation.grandTotalLabel" /> </strong> </label> <label
						class="conf_payment_total_res" id="grand_total_value_rcpt"></label>

				</div>
			</div>

			<div class="paymnt-btns">
					<div class="pmt_rcpt_btn_sec">
						<div class="mob_txt_inv"><fmt:message key="paymentReceipt.print" /></div>
						<input class="paymnt_receipt_print_btn" type="button" id="print_pdf_rcpt" name="print_pdf" />
					</div>
					
					<div class="pmt_rcpt_btn_sec">
						<div><fmt:message key="paymentReceipt.save" /></div>
						<input class="paymnt_receipt_save_btn" type="button" id="save_pdf_rcpt" name="save_pdf" />
					</div>
					
					<div class="pmt_rcpt_btn_sec">
						<div><fmt:message key="paymentReceipt.email" /></div>
						<input class="paymnt_receipt_email_btn" type="button" id="email_pdf_rcpt" name="email_pdf" />
					</div>
			</div>

			<div class="clearfloat"></div>
			<div class="paymnt-receipt-title">
				<fmt:message key="paymentReceipt.billDisclaimer" />
			</div>
		</div>
	</div>
</div>
