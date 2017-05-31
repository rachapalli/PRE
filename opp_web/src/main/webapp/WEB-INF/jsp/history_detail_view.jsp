<div id="showDetailView" class="txt_inv">	
	<div>
		<div id="detailViewId" class="find_bill_bg">
			<div class="wid_flt50 z101 pos_relnw">	
				 <input type="button"
					value="<fmt:message key="detailView.backText" />"
					class="hist_summary_dtlback_btn mrgn_left10"
					onclick="backfromReceitpToSummury();" /> 
			</div>
			<div class="wid_flt100 pos_absolute z100">
				<h1>
					<div class="mobile_title_area z100">
						<fmt:message key="detailReceipt.title" />
					</div>
				</h1>
			</div>
		</div>

		<!-- <div class="pay_bill_txt">
			<h2>
				<fmt:message key="detailView.subTitle" />
			</h2>
		</div> -->

		<div id="mobDetailErrorMsgDiv" class="mob_error_msg txt_inv">
			<span class="failed_icon"></span><span id="mobDetailErrorMsg"></span>
		</div>
		<div id="detailViewAreaId" class="row_box main-holder-marg">
		<div id="inlineMsgId" class="rownew"></div>
			<div id="detailViewTableArea" class="width_area100"></div>
			<div id="createAccountDetailSection" class="txt_inv">
				<%@include file="detail_create_profile.jsp"%>
			</div>
			<div class="clear"></div>
	<!-- bottom buttons START -->
				<div class="extraBtnArea wid_flt100 txt_mid">
					<input type="button"
					value="<fmt:message key="detailView.backText" />"
					class="hist_summary_dtlback_btn"
					onclick="backfromReceitpToSummury();" /> 
				</div>				
	<!-- bottom buttons END -->
		</div>
	</div>
</div>