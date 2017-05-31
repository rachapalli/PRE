<!-- Biller Search Area for Add Bill -->
<div id="billerSearchInner" class="inner_box_new">
	<!-- <div id="close_button" class="close"></div> -->
	<section class="search-margin" class="mrgn_top">
	<div class="find_bill_bg" id="searchBillId">
		<h1>
			<div id="find_bill_title" class="mobile_title_area wid_area100">
				<fmt:message key="biller.search_bill" />
			</div>
		</h1>
		<h2 class="mob_txt_inv pad_txt_inv">
			<div class="mrgn-1"><fmt:message key="biller.searchbill" /></div>
		</h2>
	</div>
	<div id="searchBillerSec" class="row_box main-holder-marg srchBillerTab">	
	<div id="inlineMsgId" class="rownew"></div>	
			<div class="srch_provider_mrgn">
				<fmt:message key="biller.searchprovidername" />
			</div>
			<div class="pos_rel search_biller_area">
				<%-- <input type="button" id="resetBtnSrch" class="srch_provider_reset"
					onclick="resetField('<fmt:message key="biller.search_bill" />');" /> --%>
								
				<div id="searchLoadingImg"></div>
				
				<input type="text" class="search_biller_inputbox" id="searchtext" <%-- placeholder="<fmt:message key="biller.search_hint" />" --%> />
				
				<input type="button" class="mob_btn_display hgt34 sv_submit_inactive_btn search_button_add" id="searchBillerBtnId" value="<fmt:message key="searchBtn" />" onclick="searchApiCall();"/>	
			</div>
			<div class="search_biller_area1">
				<div class="search_biller_deftxt search_lnk cursor_pntr fnt_wt" onclick="showBillerFeedBackUrl()">
					<div id="billerFeedbackText" class="srch_txt_rht"><fmt:message key="biller.feedback_text"/></div>
				</div>
			</div>		
		<div class="clear"></div>
		<div id="searchresultSetAreaId">
			<div id="presiseSearchMsgId" class="srch_provider_mrgn mrgn_top"></div>
				<div id="preciseMatchesArea"></div>
			<div id="SearchSuggestionMsgId" class="srch_provider_mrgn mrgn_top"></div>
				<div id="resultSetArea"></div>
		</div>
		<div class="search_message" style="display: none"
			id="morePamentMsgArea">
			<!-- <fmt:message key="biller.sort_message" /> -->
		</div>
	</div>
	</section>
</div>
<!--! end of Biller Search Area for Add Bill -->
