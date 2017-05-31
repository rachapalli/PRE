<div id="locatorMapInner" class="inner_box_new">
	<div class="find_bill_bg" id="loadLocatorId">
		<h1>
			<div class="mobile_title_area">
				<fmt:message key="locator.title" />
			</div>
		</h1>

		<h2>
			<fmt:message key="locator.subTitle" />
		</h2>
	</div>
	<div class="locator_blue_hdng_area clear" id="mapViewOfLocatorMap">
		<span id="mapLeftTitle" class="map_view_heading"><fmt:message
				key="locator.mapViewText" />
		</span>
		<div class="locator_list_view_btn" onclick="showListOrMapView()">
			<span id="mapRightTitle"><fmt:message
					key="locator.listViewText" /> </span>
			<!-- <div class="history_srch_icon"></div> -->
		</div>
	</div>
	<div id="locator_area" class="row_box main-holder-marg">
	<div id="inlineMsgId" class="rownew"></div>
		<div id="locatorMapViewArea">
			<div id="locatorMapSearchArea" class="locatorsearch">
				<div id="locatorSubTitleArea" class="locator_heading_txt">
					<fmt:message key="locator.findLocationText" />
				</div>
				<div id="locatorSearchBox">
					<div class="pos_rel pos_rel_loc wid300">
						<input id="searchTextField" type="text"
							placeholder="<fmt:message key="locator.search_hint" />"
							class="locator_input" size="15" maxlength="5" align="right"
							onkeypress="return isNumberKey(event)">
							 <div class="locator_go_btn fa fa-check fa-2x" id="locatorGoBtn"
							onclick="getZipCode()"></div>
					</div>
				</div>
			</div>
			<div class="clear"></div>
			<div id="leftPanHeaderBg" class="pan_container">
				<div id="expandPan"></div>
				<div id="hidePan"></div>
			</div>

			<div class="pnl_area" id="panel">
				<div id=SearchLocationInfo></div>
			</div>
			<div id="outer_map_canvas" class="outer_map_main">
				<div id="map_canvas" class="locatormain"></div>
			</div>
		</div>
		<div id="listViewOfMap" class="txt_inv">
			<fmt:message key="locator.listViewMsg" />
		</div>

	</div>