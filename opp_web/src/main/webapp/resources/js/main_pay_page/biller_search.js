/********************************************************************************************
Name                 :   loadFindBill
Return type          :
Input Parameter(s)   :   clearScreen
Purpose              :   This method is used to load findBill area on click of Add action button.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function loadFindBill(clearScreen) {
    $("#addBil_billerName").text("");
    /* From now search button will always be enabled*/
    submitBtnEnableUI('searchBillerBtnId');
    if (clearScreen) {
        $("#searchtext").val("");
        $("#morePamentMsgArea").hide();
        $("#searchInfoText").hide();
        $("#resultSetArea").empty();
        $("#preciseMatchesArea").empty();
        $('#presiseSearchMsgId').text("");
        $('#SearchSuggestionMsgId').text("");
    }

    var windowsize = $(window).width();
    if (windowsize <= minimumWindowWidthForMobile) {
        var billerMsg = messages['biller.search_bill'].split("-");
        $("#find_bill_title").html(billerMsg[0]);
    }
    /* Disable the add button from button_event.js. */
    disableButton("add_bill_tag");
    
    /* Clear other screens, show the biller search screen and set the screen height. Method is defined in Utilities.js. */
    showScreenAndSetHeight('billerSearchInner', 'searchBillerSec');
    
    $("#searchtext").focus();

    /* Enable the add button from button_event.js. */
    enableButton("add_bill_tag");
}

/********************************************************************************************
Name                 :   moveToAddBiller
Return type          :	 Boolean
Input Parameter(s)   :   billerCorpId, programId
Purpose              :   User will navigate to add biller page.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function moveToAddBiller(billerCorpId, programId) {
    gaHandleSelectSearchedBill(billerCorpId);
    /* At the time of adding a biller there will be no billerCorpAcctId that's why the 3rd
     * parameter is set to "null" as String */
	navigateToAddEditBiller(billerCorpId, programId, "null", true, false, "", null);
    return false;
}

/********************************************************************************************
Name                 :   searchApiCall
Return type          :	 None
Input Parameter(s)   :   None
Purpose              :   call the api after 500 ms delay of last keypress.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function searchApiCall() {
    delay(function () {
        //create a table structure to show filter data.
        var searchValue = $("#searchtext").val();
        if (searchValue.trim().length < 3) {
            $("#morePamentMsgArea").hide();
            $("#searchInfoText").hide();
            $("#resultSetArea").empty();
            $("#preciseMatchesArea").empty();
            $('#presiseSearchMsgId').text("");
            $('#SearchSuggestionMsgId').text("");
            return;
        }
        var searchCriteria = document.getElementById("searchtext").value;
        $("#searchLoadingImg").addClass("mySearchLoading");

        if (parseBoolean(localStorage.getItem("registerUser"))) {
            $('#guestUserMyAccountBox').remove();
            $("#accBoxMainDivId").removeClass("myAccountSection");
            $('#myAccountBox').show();
            $('#userName').text(getCookie("userName"));
        }
        //make a request parameter for ajax request.
        var request = {};
        request.searchCriteria = searchCriteria;
        request.applicationId = applicationId;
        request.locale = getCookie("locale");
        request.externalMerchantId = null;
        request.fuzzySearchVariant = parseInt(localStorage.getItem("fuzzySearchVariant"));

        var call_bp_biller_corp_search = new bp_biller_corp_search(request);
        call_bp_biller_corp_search.call();
    }, 500);
}

/********************************************************************************************
Name                 :   handleBpBillerCorpSearchOnSuccess
Return type          :	 None
Input Parameter(s)   :   req, startTime
Purpose              :   To handle error response of billerCredentials API.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function handleBpBillerCorpSearchOnSuccess() {
	$("#searchLoadingImg").removeClass("mySearchLoading");
    // if user reset input before response commit reset data
    if ($("#searchtext").val().trim().length < 3) {
        $("#morePamentMsgArea").hide();
        $("#searchInfoText").hide();
        $("#resultSetArea").empty();
        $("#preciseMatchesArea").empty();
        $('#presiseSearchMsgId').text("");
        $('#SearchSuggestionMsgId').text("");
        return;
    }
    
	var windowWidth = $(window).width();
    if (windowWidth < minimumWindowWidthForMobile) {
    	newSearchDesignForMobile();
        return;
    }
    newSearchDesignForStandard();
}

/********************************************************************************************
Name                 :   resetField
Return type          :	 None
Input Parameter(s)   :   defaultText
Purpose              :   set the search biller screen title to specified text.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function resetField(defaultText) {
    $("#searchtext").val("");
    $("#searchtext").focus();
    $("#morePamentMsgArea").hide();
    $("#searchInfoText").hide();
    $("#resultSetArea").empty();
    $("#preciseMatchesArea").empty();
    $('#presiseSearchMsgId').text("");
    $('#SearchSuggestionMsgId').text("");
    $("#searchLoadingImg").removeClass("mySearchLoading");
    bp_biller_corp_search_obj = null;
}

/********************************************************************************************
Name                 :   searchResultStandardArea
Return type          :	 None
Input Parameter(s)   :   None
Purpose              :   To create the search result area for standard width.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function searchResultStandardArea() {

    $("#morePamentMsgArea").hide();
    var rowItemsMobile = "";
    var countOfBillerRow = 0;
	var postingCatgrylabel, postingCatgrylabel1, postingCatgry, postingCatgry1;
	
	if(bp_biller_corp_search_obj.billerCorpSearchResults && bp_biller_corp_search_obj.billerCorpSearchResults.length > 0) {
		$('#errorInSearch').hide();
		$('#SearchSuggestionMsgId').text(messages['biller.searchSuggestionMsg']);
	    $.each($.map(bp_biller_corp_search_obj.billerCorpSearchResults, function (item) {
	    	var index = 0;
            var IsExpress = false;
			for (index; index < item.postingCategories.length; index++) {
				if (item.postingCategories[index].id === 1
						|| item.postingCategories[index].id === 4) {
					postingCatgry = messages["postingCategoryDesc.1"];
					postingCatgrylabel = item.postingCategories[index].label;
					IsExpress = true;
				} else if (item.postingCategories[index].id === 2
						|| item.postingCategories[index].id === 3) {
					postingCatgry1 = messages["postingCategoryDesc.2"];
					postingCatgrylabel1 = item.postingCategories[index].label;
				}
			}
			
	        rowItemsMobile += "<div class='tbl_srch_bg cursor_pntr' id='"+ countOfBillerRow + "rowIdOfBillerSearch' onclick=\"moveToAddBiller('" + item.billerCorpId + "','" + item.programId + "')\">"
			                + "<div class='tbl_srch_item_lft'>"
			                + "<div class='pmt_hist_nm_heading flt_lft'>"
			                + item.billerName
			                + "</div>";
	        countOfBillerRow++;
	        
	        /* Checking if searchHint is not null then show tool tip below image. */
	        if (IsExpress) {
	        	rowItemsMobile += '<div class=fa fa-bolt fa-lg express_icon'
								+ 'title="' + messages["postingCategoryDesc.1"] + '" >'
								+ '</div>';
			}
			var rowSpeedDesc;
	
			if (IsExpress) {
				rowSpeedDesc = item.industryName 
							+ " | " 
							+ postingCatgry
							+ "<span class='fa fa-bolt fa-lg express_icon'></span>";
				IsExpress = false;
			} else {
				rowSpeedDesc = item.industryName;
			}
			var searchHintOfBillers;
			if(item.searchHints){
				for (var searchHintIndex = 0; searchHintIndex < item.searchHints.length; searchHintIndex++) {
					searchHintOfBillers = item.searchHints.join(" | ");
				}
			}
			rowItemsMobile += "<div class='clear'></div>";
				if (searchHintOfBillers) {
					rowItemsMobile += ' <div class="search_bill_hint" >' + searchHintOfBillers
									+ ' </div>';
				}
			rowItemsMobile += "</div>" 
							+ "<div class='tbl_srch_item_rght mob_txt_inv'>"
							+ "<div class='pmt_hist_dttxt'>"
							+ rowSpeedDesc
							+ "</div></div></div>"
							+ "<div class='clear'></div>";
	    }));
	}
	
    $('#resultSetArea').html(rowItemsMobile);
    
    if (bp_biller_corp_search_obj.errorCode === bp_biller_corp_search_constant.BP_BILLER_SEARCH_MORE_RESULTS) {
    	$("#morePamentMsgArea").text(bp_biller_corp_search_obj.errorMessage);
        $("#morePamentMsgArea").show();
    } else {
        $("#morePamentMsgArea").hide();
    }
}

/********************************************************************************************
Name                 :   searchResultMobileArea
Return type          :
Input Parameter(s)   :   data, response
Purpose              :   To create the search result area for moblie width.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function searchResultMobileArea() {
    $("#morePamentMsgArea").hide();
    var rowItemsMobile = "";
    var countOfBillerRow = 0;
	var postingCatgrylabel, postingCatgrylabel1, postingCatgry, postingCatgry1;
	
	if(bp_biller_corp_search_obj.billerCorpSearchResults && bp_biller_corp_search_obj.billerCorpSearchResults.length > 0) {
		$('#errorInSearch').hide();
		$('#SearchSuggestionMsgId').text(messages['biller.searchSuggestionMsg']);
	    $.each($.map(bp_biller_corp_search_obj.billerCorpSearchResults, function (item) {
	    	var index = 0;
            var IsExpress = false;
			for (index; index < item.postingCategories.length; index++) {
				if (item.postingCategories[index].id === 1
						|| item.postingCategories[index].id === 4) {
					postingCatgry = messages["postingCategoryDesc.1"];
					postingCatgrylabel = item.postingCategories[index].label;
					IsExpress = true;
				} else if (item.postingCategories[index].id === 2
						|| item.postingCategories[index].id === 3) {
					postingCatgry1 = messages["postingCategoryDesc.2"];
					postingCatgrylabel1 = item.postingCategories[index].label;
				}
			}
			
	        rowItemsMobile = rowItemsMobile
			                + "<div class='tbl_srch_bg cursor_pntr' id='"+ countOfBillerRow + "rowIdOfBillerSearch' onclick=\"moveToAddBiller('" + item.billerCorpId + "','" + item.programId + "')\">"
			                + "<div class='tbl_srch_item_lft'>"
			                /*+ "<div class='pmt_hist_nm_heading flt_lft'>"*//*Suggestions will not be in bold as per Edouard*/
			                + item.billerName
			                + "</div>";
	        countOfBillerRow++;
	        
	        /* Checking if searchHint is not null then show tool tip below image. */
	        if (IsExpress) {
	        	rowItemsMobile = rowItemsMobile 
	        					+ '<div class=fa fa-bolt fa-lg express_icon'
								+ 'title="' + messages["postingCategoryDesc.1"] + '" >'
								+ '</div>';
			}
			var rowSpeedDesc;
	
			if (IsExpress) {
				rowSpeedDesc = item.industryName 
							+ " | " 
							+ postingCatgry
							+ "<span class='fa fa-bolt fa-lg express_icon'></span>";
				IsExpress = false;
			} else {
				rowSpeedDesc = item.industryName;
			}
	
			rowItemsMobile += "<div class='clear'></div>"
							+ "<div class='pmt_hist_dttxt'>"
							+ rowSpeedDesc
							+ "</div>";
			var searchHintOfBillers;
			if(item.searchHints){
				for (var searchHintIndex = 0; searchHintIndex < item.searchHints.length; searchHintIndex++) {
					searchHintOfBillers = item.searchHints.join(" | ");
				}
			}
				
			if (searchHintOfBillers) {
				rowItemsMobile = rowItemsMobile
						+ ' <div class="search_bill_hint" >' + searchHintOfBillers
						+ ' </div>';
			}
			rowItemsMobile += "</div>" 
							+ "<div class='tbl_srch_item_rght mob_txt_inv'>"
							+ "<div class='mini_arrow'></div>" 
							+ "</div></div>"
			                + "<div class='clear'></div>";
	    }));
	}	
    $('#resultSetArea').html(rowItemsMobile);
    
    if (bp_biller_corp_search_obj.errorCode === bp_biller_corp_search_constant.BP_BILLER_SEARCH_MORE_RESULTS) {
    	$("#morePamentMsgArea").text(bp_biller_corp_search_obj.errorMessage);
        $("#morePamentMsgArea").show();
    } else {
        $("#morePamentMsgArea").hide();
    }
}
/********************************************************************************************
Name                 :   newSearchDesignForStandard
Return type          :
Input Parameter(s)   :   
Purpose              :   Making the two design section in a single jsp structure for searching.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function newSearchDesignForStandard(){
	presiseSearchResultArea();
    searchResultStandardArea();
}

/********************************************************************************************
Name                 :   presiseSearchResultArea
Return type          :
Input Parameter(s)   :   data, response
Purpose              :   To create the search result area for moblie width.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function presiseSearchResultArea(){
    $("#morePamentMsgArea").hide();
    var rowItemsMobile = "";
    var countOfBillerRow = 0;
	var postingCatgrylabel, postingCatgrylabel1, postingCatgry, postingCatgry1;

	/*hiding the suggestion message if no result available*/
	if(bp_biller_corp_search_obj.billerCorpSearchResults.length === 0){
		$('#SearchSuggestionMsgId').text("");
	}
	if(bp_biller_corp_search_obj.preciseMatches && bp_biller_corp_search_obj.preciseMatches.length > 0) {
		$('#errorInSearch').hide();
		$('#presiseSearchMsgId').text(messages['biller.searchPreciseMatchMsg']);
		$.each(bp_biller_corp_search_obj.preciseMatches.sort(sortSearchByBillerName), function (item, rowsetBList) {
//	    $.each($.map(bp_biller_corp_search_obj.preciseMatches, function (item) {
	    	var index = 0;
            var IsExpress = false;
			for (index; index < rowsetBList.postingCategories.length; index++) {
				if (rowsetBList.postingCategories[index].id === 1
						|| rowsetBList.postingCategories[index].id === 4) {
					postingCatgry = messages["postingCategoryDesc.1"];
					postingCatgrylabel = rowsetBList.postingCategories[index].label;
					IsExpress = true;
				} else if (rowsetBList.postingCategories[index].id === 2
						|| rowsetBList.postingCategories[index].id === 3) {
					postingCatgry1 = messages["postingCategoryDesc.2"];
					postingCatgrylabel1 = rowsetBList.postingCategories[index].label;
				}
			}
	        rowItemsMobile += "<div class='tbl_srch_bg cursor_pntr' id='"+ countOfBillerRow + "rowIdOfBillerSearch' onclick=\"moveToAddBiller('" + rowsetBList.billerCorpId + "','" + rowsetBList.programId + "')\">"
			                + "<div class='tbl_srch_item_lft'>"
			                + "<div class='pmt_hist_nm_heading flt_lft'>"
			                + matcheBillerNameInBold(rowsetBList.billerName)
			                + "</div>";
	        countOfBillerRow++;
	        
	        /* Checking if searchHint is not null then show tool tip below image. */
	        if (IsExpress) {
	        	rowItemsMobile += '<div class=fa fa-bolt fa-lg express_icon'
								+ 'title="' + messages["postingCategoryDesc.1"] + '" >'
								+ '</div>';
			}
			var rowSpeedDesc;
	
			if (IsExpress) {
				rowSpeedDesc = rowsetBList.industryName 
							+ " | " 
							+ postingCatgry
							+ "<span class='fa fa-bolt fa-lg express_icon'></span>";
				IsExpress = false;
			} else {
				rowSpeedDesc = rowsetBList.industryName;
			}
			var searchHintOfBillers;
			if(rowsetBList.searchHints){
				for (var searchHintIndex = 0; searchHintIndex < rowsetBList.searchHints.length; searchHintIndex++) {
					searchHintOfBillers = rowsetBList.searchHints.join(" | ");
				}
			}
			rowItemsMobile += "<div class='clear'></div>";
				if (searchHintOfBillers) {
					rowItemsMobile += ' <div class="search_bill_hint" >' + searchHintOfBillers
									+ ' </div>';
				}
			rowItemsMobile += "</div>" 
							+ "<div class='tbl_srch_item_rght mob_txt_inv'>"
							+ "<div class='pmt_hist_dttxt'>"
							+ rowSpeedDesc
							+ "</div></div></div>"
							+ "<div class='clear'></div>";
	    });
	} else {
		if($("#searchtext").val() && $("#searchtext").val() != ""){
			$('#presiseSearchMsgId').text(messages['biller.search.noPreciseMatchMsg']+"\u201C"+$("#searchtext").val()+"\u201D");			
		}
	}
	
    $('#preciseMatchesArea').html(rowItemsMobile);
}

/********************************************************************************************
Name                 :   newSearchDesignForMobile
Return type          :
Input Parameter(s)   :   
Purpose              :   Making the two design section in a single jsp structure for searching in mobile.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function newSearchDesignForMobile(){
	presiseSearchResultAreaMobile();
	searchResultMobileArea();
}

/********************************************************************************************
Name                 :   presiseSearchResultAreaMobile
Return type          :
Input Parameter(s)   :   
Purpose              :   To create the search result area for moblie width.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function presiseSearchResultAreaMobile(){

    $("#morePamentMsgArea").hide();
    var rowItemsMobile = "";
    var countOfBillerRow = 0;
	var postingCatgrylabel, postingCatgrylabel1, postingCatgry, postingCatgry1;

	/*hiding the suggestion message if no result available*/
	if(bp_biller_corp_search_obj.billerCorpSearchResults.length === 0){
		$('#SearchSuggestionMsgId').text("");
	}
	if(bp_biller_corp_search_obj.preciseMatches && bp_biller_corp_search_obj.preciseMatches.length > 0) {
		$('#errorInSearch').hide();
		$('#presiseSearchMsgId').text(messages['biller.searchPreciseMatchMsg']);
		 $.each(bp_biller_corp_search_obj.preciseMatches.sort(sortSearchByBillerName), function (item, rowsetBList) {
	    	var index = 0;
            var IsExpress = false;
			for (index; index < rowsetBList.postingCategories.length; index++) {
				if (rowsetBList.postingCategories[index].id === 1
						|| rowsetBList.postingCategories[index].id === 4) {
					postingCatgry = messages["postingCategoryDesc.1"];
					postingCatgrylabel = rowsetBList.postingCategories[index].label;
					IsExpress = true;
				} else if (rowsetBList.postingCategories[index].id === 2
						|| rowsetBList.postingCategories[index].id === 3) {
					postingCatgry1 = messages["postingCategoryDesc.2"];
					postingCatgrylabel1 = rowsetBList.postingCategories[index].label;
				}
			}
			
	        rowItemsMobile = rowItemsMobile
			                + "<div class='tbl_srch_bg cursor_pntr' id='"+ countOfBillerRow + "rowIdOfBillerSearch' onclick=\"moveToAddBiller('" + rowsetBList.billerCorpId + "','" + rowsetBList.programId + "')\">"
			                + "<div class='tbl_srch_item_lft'>"
			                /*+ "<div class='pmt_hist_nm_heading flt_lft'>"*/
			                + "<div class='flt_lft'>"
			                + matcheBillerNameInBold(rowsetBList.billerName)
			                + "</div>";
	        countOfBillerRow++;
	        
	        /* Checking if searchHint is not null then show tool tip below image. */
	        if (IsExpress) {
	        	rowItemsMobile = rowItemsMobile 
	        					+ '<div class=fa fa-bolt fa-lg express_icon'
								+ 'title="' + messages["postingCategoryDesc.1"] + '" >'
								+ '</div>';
			}
			var rowSpeedDesc;
	
			if (IsExpress) {
				rowSpeedDesc = rowsetBList.industryName 
							+ " | " 
							+ postingCatgry
							+ "<span class='fa fa-bolt fa-lg express_icon'></span>";
				IsExpress = false;
			} else {
				rowSpeedDesc = rowsetBList.industryName;
			}
	
			rowItemsMobile += "<div class='clear'></div>"
							+ "<div class='pmt_hist_dttxt'>"
							+ rowSpeedDesc
							+ "</div>"
							+ "</div>" 
							+ "<div class='tbl_srch_item_rght mob_txt_inv'>"
							+ "<div class='mini_arrow'></div>" 
							+ "</div>";
	
			var searchHintOfBillers;
			if(rowsetBList.searchHints){
				for (var searchHintIndex = 0; searchHintIndex < rowsetBList.searchHints.length; searchHintIndex++) {
					searchHintOfBillers = rowsetBList.searchHints.join(" | ");
				}
			}
				
			if (searchHintOfBillers) {
				rowItemsMobile = rowItemsMobile
						+ ' <div class="search_bill_hint" >' + searchHintOfBillers
						+ ' </div>';
			}
	        rowItemsMobile = rowItemsMobile + "</div>"
			                + "<div class='clear'></div>";
	        
	    });
	} else {
		if($("#searchtext").val() && $("#searchtext").val() != ""){
			$('#presiseSearchMsgId').text(messages['biller.search.noPreciseMatchMsg']+"\u201C"+$("#searchtext").val()+"\u201D");			
		}		
	}
	
    $('#preciseMatchesArea').html(rowItemsMobile);
}

/********************************************************************************************
Name                 :   matcheBillerNameInBold
Return type          :
Input Parameter(s)   :   
Purpose              :   Highlights the exact matched words in biller name.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function matcheBillerNameInBold(billerName){
	if($("#searchtext").val().split(" ").length > 0){
		var billerInitials="";
		var searchText = $("#searchtext").val().split(" ");
		for(var index = 0; index < searchText.length; index++){
			billerInitials += searchText[index].replace(searchText[index].charAt(0),  searchText[index].charAt(0).toUpperCase())+" ";
		}
		billerInitials = billerInitials.slice(0, - 1);
	}
	var newBillerName = billerName.replace(billerInitials,  "<span class=\'fnt_wt\'>"+billerInitials+"</span>");
	return newBillerName;
}

/********************************************************************************************
Name                 :   sortSearchByBillerName
Return type          :
Input Parameter(s)   :   a, b
Purpose              :   sorting the exact results coming from search API on the basis of billername.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   26th March, 2013  -   Ravi Raj
**********************************************************************************************/
function sortSearchByBillerName(a, b){

	var cnt = 0, tem;
	a = String(a.billerName).toLowerCase();
	b = String(b.billerName).toLowerCase();
	if (a === b) {
		return 0;
	}
	if (/\d/.test(a) || /\d/.test(b)) {
		var Rx = /^\d+(\.\d+)?/;
		while (a.charAt(cnt) === b.charAt(cnt) && !Rx.test(a.substring(cnt))) {
			cnt++;
		}
		a = a.substring(cnt);
		b = b.substring(cnt);
		if (Rx.test(a) || Rx.test(b)) {
			if (!Rx.test(a)) {
				return a ? 1 : -1;
			}
			if (!Rx.test(b)) {
				return b ? -1 : 1;
			}
			tem = parseFloat(a) - parseFloat(b);
			if (tem != 0) {
				return tem;
			}
			a = a.replace(Rx, '');
			b = b.replace(Rx, '');
		}
	}
	if (a === b) {
		return 0;
	}
	return a > b ? 1 : -1;
}
/*Making search API call on hitting the enter key, after adding some search words on search box*/
$('#searchtext').live('keypress',function(e){
    if(e.which == 13){
    	searchApiCall();
    }
});
