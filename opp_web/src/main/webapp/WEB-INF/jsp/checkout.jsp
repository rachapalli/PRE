<div class="txt_inv" id="checkoutContainer">
	<div id="chkPaymentId" class="find_bill_bg">
		<div class="wid_flt50 z101 pos_relnw">
			<input type="button" id="backOnCheckOutPage"
				value="<fmt:message key="checkout.back"/>"
				class="mob_btn_display bg_black mrgn_left10"
				onclick="navigateToHome();" />
		</div>
		<div class="wid_flt100 pos_absolute z100">
			<h1>
				<div class="mobile_title_area z100" id="checkoutHeaderTitle">
					<fmt:message key="checkout.header_title" />
				</div>
			</h1>
		</div>
		<div class="wid_flt50 txt_nwrght z101 pos_relnw">

			<input type="button" id="btnContinueChkOut"
				value="<fmt:message key="checkout.lbl_submit_payment"/>"
				class="mob_btn_display sv_submit_inactive_btn mrgn_rght10"
				onclick="callGuestOrAccCreationOrLogged();" disabled="disabled" />
		</div>

	</div>

	<!-- Show Pin and Amount validation Error Message On mobile  End -->

	<div id="chkoutAddInfoMobErrorMsgDiv" class="mob_error_msg txt_inv">
		<span class="failed_icon"></span><span id="mobErrorMsg"></span>
	</div>

	<div id="chkoutPaymentSec" class="row_box main-holder-marg">
	<div id="inlineMsgId" class="rownew"></div>
		<%@ include file="/WEB-INF/jsp/chkout_cash_or_card.jsp"%>

		<!-- additional information section start -->
		<%@ include file="/WEB-INF/jsp/chkout_additional_info.jsp"%>
		<!-- additional information section end -->

		<!-- create profile section start -->
		<%@ include file="/WEB-INF/jsp/chkout_create_profile.jsp"%>
		<!-- create profile section end -->

		<!-- create profile section start -->
		<%@ include file="/WEB-INF/jsp/discount_promo_code.jsp"%>
		<!-- create profile section end -->				

		<!-- Summary Section Start -->
		<div class="clear"></div>
		<div id="checkoutCreditsCoverAllAmountDue" class="gift_card mrgn_bottom0 txt_inv"><fmt:message key="checkout.lbl_credits_cover_all_amount"/></div>
		<div class="submit_payment_nwarea">
			<div id="promoCodeSection" class="discount_promoarea txt_inv">
				<div id="promoCodeSectionLabel" tabindex="-1"
					class="fnt_wt promoCodeSectionLabel wid_flt90 capital_first">
					<fmt:message key="checkout.promocodeLabel" />
				</div>
				<div id="errorPromoCodeRes" class="error_msg_display2 txt_inv">
					<i class="fa fa-exclamation-triangle mrgn_rght5 fa-x"></i>
					<span id="invalidMsgPromoCodeRes"></span>
				</div>
				<div class="clear"></div>

				<input type="text" id="promoCodeDiscount3"
					placeholder="<fmt:message key="promocode.placeholder" />"
					maxLength="20" class="input_style promo-input" /> <input
					type="button" id="checkoutApply"
					class="apply_btn sv_submit_active_btn promo-apply-btn"
					value="<fmt:message key="checkout.promocodeApply" />"
					onclick="promoCodeApplyBtnDisable()" />
			</div>
			<div class="clear"></div>


			<!-- Dynamic Data Section -->
			<div class="review_bill_tbl">
				<div class="txt_nwrght" id="summaryViewForCheckout"></div>
				<!-- Payment Total Section -->
				<div class="clear"></div>
				<div class="billtotal_sep" id="summuryPromoCode"></div>
				<div class="billtotal_sep1 txt_inv" id="checkoutPromoCodeAmount"></div>

			</div>
		</div>
		<!-- Summary Section End -->

		<div class="clear"></div>
		<div id="chkOutMoreAmtCreateProf"
			class="chkout_btnmrgn_area mob_wid98 chkout_btnmrgn_top"></div>
		<div class="clear"></div>
	
		<!-- Pay button bottom -->	
		<div class='txt_nwmiddle mrgn_bottom10'>
			<input type="button" id="btnBigContinueChkOut" value="Pay" class="pay_btm mob_btn_display mrgn_rght10 sv_submit_inactive_btn" 
			onclick="callGuestOrAccCreationOrLogged();" disabled="disabled">
		</div>
		
		<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid txt_inv">
					<input type="button" id="backOnCheckOutPageBtm"
							value="<fmt:message key="checkout.back"/>"
							class="mob_btn_display bg_black"
							onclick="navigateToHome();" />
					
					<input type="button" id="btnContinueChkOutBtm"
							value="<fmt:message key="checkout.lbl_submit_payment"/>"
							class="mob_btn_display sv_submit_inactive_btn"
							onclick="callGuestOrAccCreationOrLogged();" disabled="disabled" />
					
				</div>				
		<!-- bottom buttons END -->
	</div>
	<div class="clear"></div>
	

</div>