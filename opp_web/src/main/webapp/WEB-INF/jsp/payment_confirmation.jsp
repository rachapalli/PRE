<div id="paymentConfirmInner" class="inner_box_new">
	<div class="submit_payment_container">
		<div class="find_bill_bg" id="paymentConfirmationId">
			<h1 id="confirm_h1">
				<fmt:message key="paymentConfirmation.title" />
			</h1>
		</div>
		<div id="pmt_cnfrm_area" class="row_box">
			<div id="confirm_header2" class="pay_bill_txt pos_login_rel confirm_receipt_txt">
				<h2 id="confirm_h2" class="receipt_subheadtxt">
					<fmt:message key="paymentConfirmation.scheduled_pay" />
				</h2>
				<div></div>
			</div>

			<div class="account_info_conf_rec_container">
				<h1>
					<div align='left' class="account_info_img"></div>
					<fmt:message key="main_pay.acc_info_title" />
				</h1>

				<div class="acc_id_confirm_txt">
					<span class="txt_hglt"> <label><fmt:message
								key="main_pay.acc_info_userName" /> </label> </span> <label id="userNameCnf"></label>
				</div>
				<div class="acc_id_confirm_txt">
					<span class="txt_hglt"> <label><fmt:message
								key="main_pay.acc_info_user" /> </label> </span> <label id="userAccountNumberCnf"></label>
				</div>

			</div>


			<div id="pymnt_section_submit" class="pymnt_section_submit"></div>
			
			
			<!-- Radio Button DIV Start -->
			<div id="mobileRadioOptions" class="payment_option txt_inv" >
				<div class="pmt_opt_mrgn">
					<label>
					<input type="radio" name="paymentModeRadio" checked="checked" >
					<fmt:message key="mobile.paymentConfirm.radio.fromCash" />
					</label>
				</div>
				
				<div class="pmt_opt_mrgn">
					<label>
						<input type="radio" name="paymentModeRadio">
						<fmt:message key="mobile.paymentConfirm.radio.fromCard" />
						<div class="pmt_opt2_mrgn">
						<fmt:message key="mobile.paymentConfirm.radio.fromCard.userInfo" />
						</div>
					</label>
				</div>
			</div>
			<!-- Radio Button DIV End -->
			
			

			<div class="payment_total">
				<div class="payment_total_inner">
					<label class="conf_payment_total"><fmt:message
							key="paymentConfirmation.payTotalLabel" /> </label> <label
						class="conf_payment_total_res" id="pmt_total_value"></label>

					<div class="clearfloat"></div>
					<label class="conf_payment_total" for="fee_total_val"><fmt:message
							key="paymentConfirmation.feeTotalLabel" /> </label> <label
						class="conf_payment_total_res" id="fee_total_value"></label>

					<div class="clearfloat"></div>
					<label class="conf_payment_total"><strong><fmt:message
								key="paymentConfirmation.grandTotalLabel" /> </strong> </label> <label
						class="conf_payment_total_res" id="grand_total_value"></label>

				</div>

			</div>

			<div class="payment_button_area">
				<p id="edit_payment_p">
					<input type="button" class="grey_default_btn" id="btnEditPayment"
						value='<fmt:message key="paymentConfirmation.editpayment" />'>
				</p>
				<div class="clearfloat"></div>
				<div id="submit_payment_div" class="pos_rel">
					<input type="button" class="green_default_btn"
						id="btnConfirmPayment"
						value='<fmt:message key="paymentConfirmation.confirmpayment" />'
						onclick='handlePayBills()'>
				</div>
				<div class="clearfloat"></div>
				<div id="show_payment_div" class="pos_rel txt_inv">
					<input type="button" class="grey_default_btn"
						id="btnConfirmShowAllPayment"
						value='<fmt:message key="latestPayment.show_payment" />'
						onclick='navigateToBillView(false);'>
				</div>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</div>