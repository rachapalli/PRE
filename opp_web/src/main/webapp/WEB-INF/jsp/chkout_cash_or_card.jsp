<div class="clear"></div>

<!-- New Structure  Start-->

<div id="mainPaymentOptionsContainer">
	<div class="general_sel_pay pos_login_rel" id="">
		<div class="submit_text fnt_wtn box_border min_wid100">
		<span class="flt_lft general_sel_pay_bill"><fmt:message key="checkout.billAndServiceFee" /></span>
		<span class="flt_lft general_sel_pay_amount" id="billAndFeeId"></span>
		<a href="#sel_pay_container1" class="general_sel_pay_link" >
			<span id="seeMoreId" onClick="seeMoreDetails()"><fmt:message key="checkout.seeeMoreDetails" /></span>
		</a>
		</div>
	</div>
	<div id="cardPaymentOptionsContainer"></div>

	<div id="cashDataMainContainer" class="txt_inv">
		<div id='cashSectionForPayment' onclick="expandCashSection();"
			class="new_carduser_btn ">
			<div id="cashButtonImageArea" class="fa fa-check fa-2x card_icon"></div>
			<div id="cashPaymentText" class="new_user_cardtxt">
				<fmt:message key="checkout.lbl_cash" />
			</div>
			<div id="feeChargesForCash" class="card_fee"></div>
		</div>
		<div class="clear"></div>
		<div id="completeItemsContainer"
			class="complete_cashitem_cont brdr_none txt_inv">
			<div id="historyFundingSources"></div>

			<div class="clear"></div>
			<div id="cashSummaryTotalArea" class="vesta_summary_totalarea">
				<div class="vesta_wd40 vesta_mrgntop8 fnt_wt">
					<fmt:message key="checkout.lbl_total_amount_added" />
				</div>
				<div id="cashSummaryTotalAmount"
					class="vesta_wd40 vesta_mrgntop8 txt_nwrght fnt_wt">0.00</div>
				<div id="editCashSummaryTotal" class="vesta_wd13 edit_icon flt_rght txt_inv"><i class="fa fa-pencil fa-lg mrgn_top10" onclick="openCashSummaryForEditAmount();"></i></div>
			</div>

			<div class="clear"></div>
			<div id="cashPaymnetInfoMessage" class="vesta_note_txt txt_inv">
				<fmt:message key="checkout.msg_cash_enough_payment" />
				<a href="javascript:void(0);" class="txt_underline"
					onclick="showMoreInfoUrl();"> <fmt:message
						key="checkout.link_more_information_text" /> </a>
			</div>
			<div class="cash_info_txt" id="cashInfoTxt">
				<fmt:message key="checkout.cash_helpText" />
			</div>
			<input type="button" class="pure-button cash_packbtn" id="helpCash"
				value="<fmt:message key="checkout.cash_addInfoBtn" />"
				onclick="showHelpUrl('+<fmt:message key="checkout.cash_addInfoBtn" />+')">

			<div id="optionsListContainer"
				class="styled-select txt_inv width_area100"
				onclick="slideCashSelect()">
				<div id="newSelectOption" class="txt_inv width_area100">
					<div id="newSelectOptionText" class="select-txt">
						<fmt:message key="checkout.lbl_select_type" />
					</div>
					<div id="newSelectOptionArrIcon" class="vesta_select_arrow">&nbsp;</div>
				</div>
				<div class="clear"></div>
				<ul id="opsList" class="txt_inv">
				</ul>
			</div>

			<!-- PIN Entry - Evolve -->
			<div id="cashPaymentOptionBox1" class="cash_infobox txt_inv">
				<div class="cash_img_slot">
					<img id="cashSelectedFundingSourceImage" src="">
				</div>

				<!-- Cash Load-Error Messages -->
				<div class="chkout_blueerr_box" id="blueBoxCnt1">
					<span id="blueBoxMsgDiv1"> <fmt:message
							key="checkout.cash_error.message" /> </span>
				</div>
				<!-- Cash Load-Error Messages end here -->
				<div class="clear"></div>

				<!-- Mobile Error Message div Start -->
				<div id="mobCash_pinAndAmount_errorMsgContainer"
					class="mob_error_msg">
					<span class="failed_icon"></span> <span id="mobCashErrorMessage"></span>
				</div>
				<!-- Mobile Error Message div End -->

				<div id="pinSectionPreCash" class="cash_user_area">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_pin" />
					</div>
					<div id="pinOuterSection" class="flt_lft mob_mrgn_area1">
						<input id="pinOfCashEvolve1" type="tel"
							value="<fmt:message key="checkout.Precash.FirstBox" />"
							readonly="readonly" class="cash_input_def"
							onkeypress='return isNumberKey(event);' /> <input
							id="pinOfCashEvolve2" type="tel" size="4" maxlength="4"
							placeholder="0000" class="cash_input_def"
							onkeypress='return isNumberKey(event)'
							onblur="onBlurPinOrAmountValidation('pinOfCashEvolve2', 'amountOfCashEvolve' ,'blueBoxCnt1','blueBoxMsgDiv1','pinOuterSection');" />
						<input id="pinOfCashEvolve3" type="tel" size="4" maxlength="4"
							placeholder="0000" class="cash_input_def"
							onkeypress='return isNumberKey(event)'
							onblur="onBlurPinOrAmountValidation('pinOfCashEvolve3', 'amountOfCashEvolve' ,'blueBoxCnt1','blueBoxMsgDiv1','pinOuterSection');" />
						<input id="pinOfCashEvolve4" type="tel" size="4" maxlength="4"
							placeholder="0000" class="cash_input_def"
							onkeypress='return isNumberKey(event)'
							onblur="onBlurPinOrAmountValidation('pinOfCashEvolve4', 'amountOfCashEvolve' ,'blueBoxCnt1','blueBoxMsgDiv1','pinOuterSection');" />
					</div>
				</div>
				<div class="cash_user_area" id="cashSectionEvolve">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_amount" />
					</div>
					<div class="dollar_txt">$</div>
					<input id="amountOfCashEvolve" type="text" pattern="\\d+(\\.\\d*)?" placeholder="0.00"
						class="cash_input_def buck_amount_box"
						onkeypress="return isValidAmountEntered(this,event)"
						onblur="onBlurPinOrAmountValidation('pinOfCashEvolve1', 'amountOfCashEvolve' ,'blueBoxCnt1','blueBoxMsgDiv1','pinOuterSection');" />
				</div>
				<div class="clear"></div>
				<!-- <div class="payconnect_redinfotxt ">
					<fmt:message key="checkout.instructional_message_for_pinAndAmount" />
				</div> -->
				<div class="vesta_wd45 mob_vesta_wd90 pdng10">
					<div class="evolve_help_img">&nbsp;</div>
				</div>
				<div class="vesta_wd45 mob_vesta_wd95 flt_rght evolve_help_txt">
					<fmt:message key="checkout.help_message" />
				</div>
				<div class="vesta_btn_area">
					<input type="button" onclick="backFromSelectedFundingSource('1');"
						value="Back" class="add_pmtcash_backbtn flt_lft" /> <input
						type="button" id="saveBtnOfEvolve"
						onclick="saveSelectedFundingSource('pinSectionPreCash','amountOfCashEvolve', 'cashPaymentOptionBox1')"
						value="Save" class="add_pmtcash_backbtn flt_rght bg_grey1" disabled="disabled"/>
				</div>
			</div>

			<!-- PIN Entry - Reloadit -->

			<div id="cashPaymentOptionBox2" class="cash_infobox txt_inv">
				<div class="cash_img_slot">
					<img id="cashSelectedFundingSourceImage" src="">
				</div>

				<!-- Cash Load-Error Messages -->
				<div class="chkout_blueerr_box" id="blueBoxCnt2">
					<span class="blue_boxarea90" id="blueBoxMsgDiv2"> <fmt:message
							key="checkout.cash_error.message" /> </span>
				</div>
				<!-- Cash Load-Error Messages end here -->
				<div class="clear"></div>

				<!-- Mobile Error Message div Start -->
				<div id="mobCash_pinAndAmount_errorMsgContainer"
					class="mob_error_msg">
					<span class="failed_icon"></span> <span id="mobCashErrorMessage"></span>
				</div>
				<!-- Mobile Error Message div End -->

				<div class="cash_user_area" id="pinSectionBlackhawk">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_pack.number" />
					</div>
					<input id="pinOfCashREloadit" type="tel"
						class="cash_input_def reloadit_pack_width" size="10"
						maxlength="10" placeholder="0000000000"
						onkeypress='return isNumberKey(event);'
						onblur="onBlurPinOrAmountValidation('pinOfCashREloadit', 'amountOfCashReloadit' ,'blueBoxCnt2','blueBoxMsgDiv2');" />
				</div>
				<div class="cash_user_area">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_pack.amount" />
					</div>
					<div class="dollar_txt">$</div>
					<input id="amountOfCashReloadit" type="text" pattern="\\d+(\\.\\d*)?"  placeholder="0.00"
						class="cash_input_def reloadit_pack_width"
						onblur="onBlurPinOrAmountValidation('pinOfCashREloadit', 'amountOfCashReloadit' ,'blueBoxCnt2','blueBoxMsgDiv2');"
						onkeypress="return isValidAmountEntered(this,event);" />
				</div>
				<div class="clear"></div>
				<!-- <div class="payconnect_redinfotxt ">
					<fmt:message key="checkout.instructional_message_for_pinAndAmount" />
				</div> -->
				<div class="vesta_wd45 mob_vesta_wd90 pdng10">
					<div id="reloaditImg"
						class="<fmt:message key="checkout.reloadItCashImage" />">&nbsp;</div>
				</div>
				<div class="vesta_wd45 mob_vesta_wd95 flt_rght evolve_help_txt">
					<fmt:message key="checkout.reloadit.help_message" />
				</div>
				<div class="vesta_btn_area">
					<input type="button" onclick="backFromSelectedFundingSource('2');"
						value="Back" class="add_pmtcash_backbtn flt_lft" /> <input
						type="button" id="saveBtnOfRelodit"
						onclick="saveSelectedFundingSource('pinSectionBlackhawk', 'amountOfCashReloadit', 'cashPaymentOptionBox2')"
						value="Save" class="add_pmtcash_backbtn flt_rght bg_grey1" disabled="disabled"/>
				</div>
			</div>

			<!-- PIN Entry - Vanilla Reload -->

			<div id="cashPaymentOptionBox3" class="cash_infobox txt_inv">
				<div class="cash_img_slot">
					<img id="cashSelectedFundingSourceImage" src="">
				</div>

				<!-- Cash Load-Error Messages -->
				<div class="chkout_blueerr_box" id="blueBoxCnt3">
					<span id="blueBoxMsgDiv3"> <fmt:message
							key="checkout.cash_error.message" /> </span>
				</div>
				<!-- Cash Load-Error Messages end here -->
				<div class="clear"></div>

				<!-- Mobile Error Message div Start-->
				<div id="mobCash_pinAndAmount_errorMsgContainer"
					class="mob_error_msg">
					<span class="failed_icon"></span> <span id="mobCashErrorMessage"></span>
				</div>
				<!-- Mobile Error Message div End-->

				<div class="cash_user_area" id="pinSectionInComm">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_reload.number" />
					</div>
					<div id="pinOuterSectionOfVanilla" class="flt_lft mob_mrgn_area1">
						<input id="pinOfCashVanilla1" type="text" size="3" maxlength="3"
							placeholder="000" onkeypress='return isNumberKey(event)'
							class="extend_cash_input_def"
							onblur="onBlurPinOrAmountValidation('pinOfCashVanilla1', 'amountOfCashVanilla' ,'blueBoxCnt3','blueBoxMsgDiv3','pinOuterSectionOfVanilla');" />
						<input id="pinOfCashVanilla2" type="text" size="3" maxlength="3"
							placeholder="000" onkeypress='return isNumberKey(event)'
							class="extend_cash_input_def"
							onblur="onBlurPinOrAmountValidation('pinOfCashVanilla2', 'amountOfCashVanilla' ,'blueBoxCnt3','blueBoxMsgDiv3','pinOuterSectionOfVanilla');" />

						<input id="pinOfCashVanilla3" type="text" size="4" maxlength="4"
							placeholder="0000" class="extend_cash_input_def3"
							onkeypress='return isNumberKey(event)'
							onblur="onBlurPinOrAmountValidation('pinOfCashVanilla3', 'amountOfCashVanilla' ,'blueBoxCnt3','blueBoxMsgDiv3','pinOuterSectionOfVanilla');" />
					</div>
				</div>
				<div class="cash_user_area">
					<div class="cash_label_def">
						<fmt:message key="checkout.lbl_enter_vanilla.amount" />
					</div>
					$ <input id="amountOfCashVanilla" type="text" placeholder="0.00"
						class="cash_input_def reloadit_pack_width"
						onkeypress="return isValidAmountEntered(this,event);"
						onblur="onBlurPinOrAmountValidation('pinOfCashVanilla1', 'amountOfCashVanilla' ,'blueBoxCnt3','blueBoxMsgDiv3','pinOuterSectionOfVanilla');" />
				</div>
				<div class="clear"></div>
				<!-- <div class="payconnect_redinfotxt ">
					<fmt:message key="checkout.instructional_message_for_pinAndAmount" />
				</div> -->
				<div class="vesta_wd45 mob_vesta_wd90 pdng10">
					<div class="vanilla_help_img">&nbsp;</div>
				</div>
				<div class="vesta_wd45 mob_vesta_wd95 flt_rght evolve_help_txt">
					<fmt:message key="checkout.vanilla.help_message" />
				</div>
				<div class="vesta_btn_area">
					<input type="button" onclick="backFromSelectedFundingSource('3');"
						value="Back" class="add_pmtcash_backbtn flt_lft" /> <input
						type="button" id="saveBtnOfVanilla"
						onclick="saveSelectedFundingSource('pinSectionInComm', 'amountOfCashVanilla', 'cashPaymentOptionBox3');"
						value="Save" class="add_pmtcash_backbtn flt_rght bg_grey1" disabled="disabled"/>
				</div>
			</div>

		</div>
	</div>
	<div class="clear"></div>

</div>
