/**
 *
 */
var latlonfirst = "", zipcode = "";
var geocoder, map;
var infowindow = new google.maps.InfoWindow();
var marker, mc, markerCluster;
var places = [];
var markers = [];
var addrCount, count = 0;
var intervalTime;
var popup_content = [];
var locNew = "";
var mean = "";
var locationsString = [];
var locator_phonetxt_msg;
var INVALID_APPLICATION_ID = "INVALID_APPLICATION_ID";
var LOCATIONS_LOAD_COUNT = "LOCATIONS_LOAD_COUNT";
var LOCATIONS_LOAD_POSTAL_CODE = "LOCATIONS_LOAD_POSTAL_CODE";
var SYS_ERROR = "SYS_ERROR";
var bounds = new google.maps.LatLngBounds();
var intervalStatusCounter = 0;
var checkStatus;
var isLibraryInclude = false;
var lastWindowWidthMap = 0;
var lastWindowHeightMap = 0;
var INITAPITIMEOUT = 45000;
var resourceAppIdForLocator;
var applicationId = "";

$(document).ready(function() {
	/*
	 * Hiding the add money and locator tag on page load.
	 */
    $("#locator_tag").hide();
    $("#add_money_tag").hide();
    makeActiveTab("footerLocatorTab");
    
    // window
    $(document).click(function(event) {
    	if(isClickedOnMyAccountSection){
			// do nothing 
    		isClickedOnMyAccountSection = false;
	    } else if( $('.list_details').is(":visible") ){
			myAccount();
        } else if( $('#loginPageGorGuest').is(":visible") ){
        	showLoginAsPopupForGuest();
        }
    });
    mobileKeyboardFooterToggle();
});

/********************************************************************************************
' Name                 :   init_locator_page
' Return type          :   void
' Input Parameter(s)   :   _applicationId, messages, utmSource, utmCampaign
' Purpose              :   This method is used for initializing the locator call.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -  15th Sept, 2013         -   Ravi Raj
'*******************************************************************************************/
function init_locator_page(_applicationId, messages, utmSource, utmCampaign){
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		var ieVersion=new Number(RegExp.$1); // capture x.x portion and store as a number
		if(ieVersion < 8){
			$('#topLocatorHeadBg').hide();
            $('#locatorContainer').hide();
			/* To hide the progress bar */
            hideProgressBar();
			return;
		} 
	}
	applicationId = _applicationId;
	
	setUtmDataFromQueryStringToCookie(utmSource, utmCampaign);
	
	if (!checkForInitAppCall()) {
		var call_init_app = new init_app(null);
    	call_init_app.call();
    	
		 setIntervalForInitSuccessOnLocator();
	    }
	 else{
		 startLocatorCall(); 
	 }
	if (parseBoolean(localStorage.getItem("registerUser"))){
		$('#footerProfileTab').show();
		// We are hiding the account tab on locator page until further notice
		//$('#accountInfoId').show();
		$('#signUpGuestLocatorId').hide();
		hideRegisterSections();
	}else{
		$('#footerProfileTab').hide();
        // We are hiding the account tab on locator page until further notice
		//$('#accountInfoId').hide();
		$('#signUpGuestLocatorId').show();
		setMarketingFrameOfLoginSignUp();
	}
	footerForGuestAndRegister();
}

function hideRegisterSections() {
	$('#creditAvbl').hide();
	$('#rightPanelBillStatus').hide();
	$('#showAllHistBtn').hide();
}

/********************************************************************************************
' Name                 :   startLocatorCall
' Return type          :   void
' Input Parameter(s)   :   None
' Purpose              :   This method is used for initializing the variable from resource 
                           file data and removing the home screen area.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -  15th Feb, 2013         -   Ravi Raj
'*******************************************************************************************/
function startLocatorCall(){
	showProgressBar();
    try{
    	apiTimeOutVal = JSON.parse(localStorage.getItem("apiTimeOuts"));
        initAppFeatureName = JSON.parse(localStorage.getItem("featureNames"));
        footerUrlName = JSON.parse(localStorage.getItem("footerURls"));
    } catch(err) {
    	
    }
    lastWindowWidthMap = $(window).width();
	lastWindowHeightMap = $(window).height();
	setCookie("isLocatorLoaded", true);
	showHideButtons();
	$('#userName').text(getCookie("userName"));
	loadLocatorMap(false);
	if(initAppFeatureName["CHECKOUT"]) {
		 showBalanceInformation();
	} else {
		$("#mainPageBalanceLabel").text(messages["main_pay.acc_info_bal"]);
		var windowWidth = $(window).width();
		if (windowWidth <= minimumWindowWidthForMobile) {
			$('#acct_lbl').text(messages['main_pay.show_mob_balance']);
		}
		showBalanceInformation();
		enableButton("refrsh_btn");
	}
	setSectionHeigthForLocator();
}

/********************************************************************************************
' Name                 :   showBalanceInformation
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to show the account information of user.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   12 August 2013 -   Ravi Raj
'*******************************************************************************************/
function showBalanceInformation(){
	var accountBalance= getCookie("accountBalance");
	 if(accountBalance){
		 $('#bpCreditLabel').show();
        $("#accountBal").text(getFormatedNumber(accountBalance, true)); 
	 }else{
		 $('#bpCreditLabel').hide(); 
	 }	
}

/********************************************************************************************
 ' Name                 :   searchEnterKeyHandler
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   To make the return key working for search box.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  16th Feb, 2013     -   Pradeep Yadav
 '*******************************************************************************************/
function searchEnterKeyHandler() {
    $("#searchTextField").keypress(function (e) {
        var pressedKeyCode = e.keyCode || e.charCode;
        if (pressedKeyCode == 13 && $("#searchTextField").attr("disabled") != "disabled") {
            $("#searchTextField").attr("disabled", "disabled");
            getZipCode();
        }
    });
}

/********************************************************************************************
 ' Name                 :   loadLocatorMap
 ' Return type          :   void
 ' Input Parameter(s)   :   fromMainPayPage
 ' Purpose              :   This method is use for getting current location lat and lan.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  8th May, 2013      -   Ravi Raj
 '*******************************************************************************************/
function loadLocatorMap(fromMainPayPage) {
    searchEnterKeyHandler();

    $("#searchTextField").removeClass("error_red_border");
    $("#searchTextField").removeClass("blue_brdr");
    $("#searchTextField").val("");
    $('#locatorMapInner').show();

    var windowWidth = $(window).width();
    if(windowWidth <= minimumWindowWidthForMobile) {
    	changeSectionHeight('locator_area', 'mapViewOfLocatorMap');
    } else {
    	$('#listViewOfMap').hide();
    }

    /* To show the progress bar */
    showProgressBar();

    if (navigator.geolocation) {
        checkGeoLocationStatus();
    } else {
    	showGeneralErrorMsg(messages['locator.geolocationMsg'], 'searchTextField');
        initialize();
        /* To hide the progress bar */
        hideProgressBar();
    }
}

/********************************************************************************************
 ' Name                 :   checkGeoLocationStatus
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used for get the current location using geolocation.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  1st June, 2013      -   Ravi Raj
 '*******************************************************************************************/
function checkGeoLocationStatus() {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
    intervalStatusCounter = setInterval(clearIntervalForUser, parseInt(messages['locator.waitTimeForShareLocation']));
}

/********************************************************************************************
 ' Name                 :   clearIntervalForUser
 ' Return type          :   Void
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used for clear the interval time when user close the
 browser pop up for share current location.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  1st June, 2013      -   Ravi Raj
 '*******************************************************************************************/
function clearIntervalForUser() {
    if (intervalStatusCounter > 0) {
        clearInterval(intervalStatusCounter);
        initialize();
        /* To hide the progress bar */
        hideProgressBar();
        /*No inline message required for zip-code in Edouard*/
        /*showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);*/
        $("#searchTextField").addClass("blue_brdr");
        $("#searchTextField").focus();
        return;
    }
    return;
}

/********************************************************************************************
 ' Name                 :   calculateFrameHeight
 ' Return type          :   void
 ' Input Parameter(s)   :   fromMainPayPage
 ' Purpose              :   To calculate the frame height..
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  8th May, 2013      -   Ravi Raj
 '*******************************************************************************************/
function calculateFrameHeight(fromMainPayPage) {
    var windowHeight = $(window).height();
    /*
     * outerHeight() returns the height including padding / borders to get the margins also use
     * outerHeight(true)
     */
    var h1Height = 0;
    var headerHeight = 0;
    if (fromMainPayPage) {
        headerHeight = $(".head-sec").outerHeight(true);
    } else {
        headerHeight = $(".header_login").outerHeight(true);
    }
    var searchArea = $(".locatorsearch").outerHeight(true);
    var bodyHeight = windowHeight - (headerHeight + searchArea);
    h1Height = $("#loadLocatorId").outerHeight(true);

    var frameHeight = bodyHeight - h1Height;
    return frameHeight;
}

/********************************************************************************************
 ' Name                 :   showPosition
 ' Return type          :   String
 ' Input Parameter(s)   :   position
 ' Purpose              :   To calculate the frame height.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  8th May, 2013      -   Ravi Raj
 '*******************************************************************************************/
function showPosition(position) {
    clearInterval(intervalStatusCounter);
    intervalStatusCounter = 0;
    /* To show the progress bar */
    showProgressBar();
    latlonfirst = position.coords.latitude + "," + position.coords.longitude;
    codeLatLng();
    return latlonfirst;
}

/********************************************************************************************
 ' Name                 :   showError
 ' Return type          :   void
 ' Input Parameter(s)   :   error
 ' Purpose              :   This method is use for error handling of geolocation API.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   18th Feb, 2013    -   Ravi Raj
 '*******************************************************************************************/
function showError(error) {
    clearInterval(intervalStatusCounter);
    intervalStatusCounter = 0;
    initialize();
    /* To hide the progress bar */
    hideProgressBar();

    switch (error.code) {
        case error.PERMISSION_DENIED:
            /* To hide the progress bar */
            hideProgressBar();
            /*No inline message required for zip-code in Edouard*/
            /*showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);*/
            $("#searchTextField").addClass("blue_brdr");
            $("#searchTextField").focus();
            break;
        case error.POSITION_UNAVAILABLE:
            /* To hide the progress bar */
            hideProgressBar();
            /*No inline message required for zip-code in Edouard*/
            /*showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);*/
            $("#searchTextField").addClass("blue_brdr");
            $("#searchTextField").focus();
            break;
        case error.TIMEOUT:
            /* To hide the progress bar */
            hideProgressBar();
            showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);
            $("#searchTextField").addClass("blue_brdr");
            $("#searchTextField").focus();
            break;
        case error.UNKNOWN_ERROR:
            /* To hide the progress bar */
            hideProgressBar();
            showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);
            $("#searchTextField").addClass("blue_brdr");
            $("#searchTextField").focus();
            break;
    }

    return;
}

/********************************************************************************************
 ' Name                 :   codeLatLng
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for calculating zip code from lat and lang.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  20th Feb, 2013     -   Ravi Raj
 '*******************************************************************************************/
function codeLatLng() {
    var latlngStr = latlonfirst.split(',', 2);
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1]);
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
	    panControl: true,
	    panControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    },
	    zoomControl: true,
	    zoomControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    },
	    streetViewControl: true,
	    streetViewControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    }
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    geocoder.geocode({
                         'latLng': latlng
                     }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $.each(results[1].address_components, function (componentIndex, componentValue) {
                    if ($.inArray("postal_code", componentValue.types) != -1) {
                        zipcode = componentValue.long_name;
                        getZipcodeFromGeolocation(zipcode);
                    }
                });
                if (!zipcode) {
                    initialize();
                    $('#progbarId').hide();
                    $("#searchTextField").attr("disabled", false);
                    showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);
                    $("#searchTextField").addClass("blue_brdr");
                    $("#searchTextField").focus();
                    return;
                }
            } else {
                /* To hide the progress bar */
                hideProgressBar();
            }
        }
    });
}

/*******************************************************************************
' Name 					: getZipcodeFromGeolocation 
' Return type 			: void 
' Input Parameter(s) 	: zipcode 
' Purpose 				: This is method is use for show whole USA in map, if 
'						  zip code is not found. 
' History Header 		: 	Version 	- Date 				- 	Developer Name 
' Added By 	  			: 	1.0 		- 20th May, 2013 	- 	Ravi Raj 
'******************************************************************************/
function getZipcodeFromGeolocation(zipcode) {
    if (zipcode === undefined || zipcode === "") {
        initialize();
        /* To hide the progress bar */
        hideProgressBar();
        $("#searchTextField").attr("disabled", false);
        showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);
        $("#searchTextField").addClass("blue_brdr");
        $("#searchTextField").focus();
    } else {
    	getLocationInformation(); 
    }
}

/*******************************************************************************
 ' Name 				: initialize 
 ' Return type 			: void 
 ' Input Parameter(s) 	: none 
 ' Purpose 				: This is method is use for show whole USA in map, if 
 '						  zip code is not found. 
 ' History Header 		: 	Version 	- Date 				- 	Developer Name 
 ' Added By 	  		: 	1.0 		- 20th Feb, 2013 	- 	Ravi Raj 
 '******************************************************************************/
function initialize() {
    geocoder = new google.maps.Geocoder();

    var latlng = new google.maps.LatLng(38.68551, -96.503906);
    var mapOptions = {
        zoom: 4,
        center: latlng,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
	    panControl: true,
	    panControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    },
	    zoomControl: true,
	    zoomControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    },
	    streetViewControl: true,
	    streetViewControlOptions: {
	        position: google.maps.ControlPosition.RIGHT_TOP
	    }
    };
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
}

/********************************************************************************************
 ' Name                 :   getLocationInformation
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is use for calling LOCATIONS_LOAD API and show the map
 on the basis of response object.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  26th Feb, 2013     -   Ravi Raj
 '*******************************************************************************************/
function getLocationInformation() {
    var request = {};
    request.applicationId = applicationId;
    request.postalCode = zipcode;
    request.resultCount = parseInt(messages['locator.resultCount']);
    request.locale = getCookie("locale");

    var call_location_load = new location_load(request);
    call_location_load.call();
}

function handleLocationLoadOnSuccess() {
	closeInlineErrorMessage('errorBackDrop');
	initialize();
	createLocationPinPopup();
	$("#searchTextField").attr("disabled", false);
}

/********************************************************************************************
' Name                 :   createLocationPinPopup
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used for generating the infowindow content.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -  26th Feb, 2013     -   Ravi Raj
'*******************************************************************************************/
function createLocationPinPopup() {
    var searchedLocations = "";
    var searchedLocations2 = "";
    
    if (location_load_obj.locations.length === 0) {
        hideProgressBar(); /* To hide the progress bar */
        showGeneralErrorMsg(messages['locator.location.message'], 'searchTextField');
        $("#searchTextField").attr("disabled", false);
        $("#searchTextField").focus();
    } else {
        $("#searchTextField").removeClass("error_red_border");
        $("#searchTextField").removeClass("blue_brdr");
        for (var index in location_load_obj.locations) {
        	var locations = location_load_obj.locations[index];
            locationsString[index] = locations.address + "," + locations.city + "," + locations.state + " " + locations.zip;
            if (!locations.phone) {
                locator_phonetxt_msg = "";
            }
            else {
                locator_phonetxt_msg = messages['locator.phone'];
            }
            var locatorImagePath = formatMessage(messages['locator.imageurl'], 'map_default_img.png');
            var locator_txt = locations.agentType;
            if (locations.agentType === locationsAgenyTypeConstant.RELOADIT || locations.agentType === locationsAgenyTypeConstant.BHNOPN) {
            	locatorImagePath = formatMessage(messages['locator.imageurl'], 'bh_loadnetwork.gif');
            	locator_txt = messages['locator.reloadItText'];
            } else if (locations.agentType === locationsAgenyTypeConstant.PRECASH1XP) {
            	locatorImagePath = formatMessage(messages['locator.imageurl'], 'pc_loadnetwork.gif');
            	locator_txt = messages['locator.precashXpText'];
            } else if(locations.agentType === locationsAgenyTypeConstant.PRECASHIC1XP){
            	locatorImagePath = formatMessage(messages['locator.imageurl'], 'vanilla_icon.png');
            	locator_txt = messages['locator.inCommText'];
            } 
            locatorAgentType = "<div class='map_popup_heading'>" 
            				+ 		locator_txt
            				+ 	"</div>"
            				+	"<div class='map-area-rightsec'>" 
            				+		"<img src='" + locatorImagePath + "'/>" 
            				+ 	"</div>";
            locatorAgentTypeForSearchLocation = "<div class='locator_panel_heading'> " 
            									+ 	locator_txt 
            									+ " </div>";
            //Content for info window.
            popup_content[index] = "<div id='infoArea' class='map-area'>" + locatorAgentType + "<div class='map_add_info'>" +
                    "<span class='map_main_heading'>" + locations.name + "</span>" +
                    "<br>" + locations.address + "<br>" + locations.city + "," +
                    locations.state + " " + locations.zip + "<br>" + locator_phonetxt_msg + " " +
                    "<a href=" + messages['locator.phonLinkText'] + locations.phone + ">" +
                    formatLocatorPhoneNumber(locations.phone) + "</a></div>" +
                    "</div>";
            // div display into left pan.
            searchedLocations += "<div class='locator_lft_pnl_area'>"
                    			+	"<div class='locator_listpnl' id='openLocatorPopup" + index + "'>"
                    			+ 		locatorAgentTypeForSearchLocation
                    			+ 		"<div>" 
                    			+ 			locations.name + "," + locations.address + "," + locations.city 
                    			+		"</div>"
                    			+ 		"<div>" 
                    			+ 			locations.state + "," + locations.zip 
                    			+ 		"</div>"
                    			+ 		"<div>" 
                    			+ 			locator_phonetxt_msg 
                    			+ 			"<a href=" + messages['locator.phonLinkText'] + locations.phone + ">" + formatLocatorPhoneNumber(locations.phone) + "</a>"
                    			+ 		"</div>"
                    			+ 	"</div>"
                    			+ "</div>";
            searchedLocations2 += "<div class='locator_lft_pnl_area'>"
                    			+ 	"<div class='locator_listpnl' id='openLocatorPopup2" + index + "'>"
                    			+ 		locatorAgentTypeForSearchLocation
                    			+ 		"<div>" 
                    			+ 			locations.name + "," + locations.address + "," + locations.city
                    			+ 		"</div>"
                    			+ 		"<div>" 
                    			+ 			locations.state + "," + locations.zip 
                    			+ 		"</div>"
                    			+ 		"<div>" 
                    			+ 			locator_phonetxt_msg 
                    			+ 			"<a href=" + messages['locator.phonLinkText'] + locations.phone + ">" + formatLocatorPhoneNumber(locations.phone) + "</a>"
                    			+		"</div>"
                    			+ 	"</div>"
                    			+ "</div>";
            locNew = popup_content[index];
        }
        createMapLeftWidow(searchedLocations, searchedLocations2);
        try {
            checkStatus = false;
            for (var locationIndex in location_load_obj.locations) {
            	var locations = location_load_obj.locations[locationIndex];
            	if(locations.latitude && locations.longitude) {
            		var point = new google.maps.LatLng(locations.latitude, locations.longitude);
            		setAddressToMap(locationIndex, point);
            	} else {
            		setTimeout(createCallback(locationIndex), 10); //there is no reason to delay.
            	}
            	if((navigator.userAgent).match(/Android 2/i)) {
                	$('#infoArea').oneFingerScroll();
                }
            }
        } catch (err) {
            hideProgressBar(); /* To hide the progress bar */
            showGeneralSuccessMsg(messages['locator.zipCode.message'], messages['locator.zipCode.errorTitle']);
            $("#searchTextField").addClass("blue_brdr");
            $("#searchTextField").focus();
            $("#searchTextField").attr("disabled", false);
            console.log("Error: " + err + "\n" + err.stack);
        }
    }
}

/********************************************************************************************
 ' Name                 :   createCallback
 ' Return type          :   Function
 ' Input Parameter(s)   :   int locationIndex
 ' Purpose              :   This callback method for locator.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  4th May, 2013      -   Pradeep Yadav
 '*******************************************************************************************/
function createCallback(locationIndex) {
    return function () {
        geocodeAddress(locationIndex);
    };
}

/********************************************************************************************
 ' Name                 :   geocodeAddress
 ' Return type          :   void
 ' Input Parameter(s)   :   Number addrCount
 ' Purpose              :   This method is use for showing pin on address, which comes from
 API response
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  22th Feb, 2013     -   Ravi Raj
 '*******************************************************************************************/
function geocodeAddress(addrCount) {
    geocoder.geocode({'address': locationsString[addrCount]},
	     function (results, status) {
	         if (status == google.maps.GeocoderStatus.OK) {
	             checkStatus = true;
	             places[addrCount] = results[0].geometry.location;
	             map.setCenter(results[0].geometry.location);
	             addPlace(addrCount);
	         } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                 console.log("OVER_QUERY_LIMIT geocode reached, pausing a little: index of address=" + addrCount);
	             setTimeout(function () {
	                 geocodeAddress(addrCount);
	             }, 400);
	         } else if (!checkStatus) {
	        	 showGeneralErrorMsg(messages['locator.geocodeStatus'] + ' ' + status);
	         }
	     });

    if (addrCount === (location_load_obj.locations.length - 1)) {
        /* To hide the progress bar */
        hideProgressBar();
        $("#searchTextField").attr("disabled", false);
    }
}

function setAddressToMap(addrCount, pointObj){
	places[addrCount] = pointObj;
    map.setCenter(places[addrCount]);
    addPlace(addrCount);
    
    if (addrCount === (location_load_obj.locations.length - 1)) {
        /* To hide the progress bar */
        hideProgressBar();
        $("#searchTextField").attr("disabled", false);
    }
} 
/********************************************************************************************
 ' Name                 :   addPlace
 ' Return type          :   void
 ' Input Parameter(s)   :   Number addrCount
 ' Purpose              :   This method is used for dropping the pins in different color with
 infowindow on map.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  22th Feb, 2013     -   Ravi Raj
 '*******************************************************************************************/
function addPlace(addrCount) {
    var pinColor = "";
    var agentType = location_load_obj.locations[addrCount].agentType;
    if (agentType == "GREENDOT") {
        pinColor = "00ff00";
    }
    else if (agentType == "MONEYGRAM") {
        pinColor = "FE7569";
    }
    else if (agentType == "READYLINK") {
        pinColor = "FFFF00";
    }
    else if (agentType == "RELOADIT") {
        pinColor = "5F6062";
    }
    else if (agentType == "WESTERN UNION") {
        pinColor = "CC00FF";
    }
    else if (agentType == "BHNOPN") {
        pinColor = "5F6062";
    } 
    else if (agentType == "PRECASHIC1XP") {
        pinColor = "00B187";
    }
    else if(agentType == "PRECASH1XP"){
    	 pinColor = "00adee";
    }
    else {
        pinColor = "558CFF";
    }
    
    var pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                                               new google.maps.Size(21, 34),
                                               new google.maps.Point(0, 0),
                                               new google.maps.Point(10, 34));
    // Adding the markers
    marker = new google.maps.Marker({position: places[addrCount], animation: google.maps.Animation.DROP, map: map, icon: pinImage});
    markers[addrCount] = marker;
    $("#openLocatorPopup" + addrCount).click(function () {
        if (!infowindow) {
            infowindow = new google.maps.InfoWindow();
        }
        map.setCenter(markers[addrCount].getPosition());
        infowindow.close();
        infowindow.setContent(popup_content[addrCount]);
        infowindow.open(map, markers[addrCount]);
    });
    
    $("#openLocatorPopup2" + addrCount).click(function () {
        var windowWidth = $(window).width();
        if (windowWidth <= minimumWindowWidthForMobile) {
            showListOrMapView();
        }
        if (!infowindow) {
            infowindow = new google.maps.InfoWindow();
        }
        map.setCenter(markers[addrCount].getPosition());
        infowindow.close();
        infowindow.setContent(popup_content[addrCount]);
        infowindow.open(map, markers[addrCount]);
    });

    google.maps.event.addDomListener(map, 'idle', function () {
        calculateCenter();
    });
    // change center for mobile width on window resize.
    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(center);
    });

    google.maps.event.addListener(marker, 'click', function () {
        // Check to see if we already have an InfoWindow
        if (!infowindow) {
            infowindow = new google.maps.InfoWindow();
        }
        infowindow.close();
        //infowindow.opened = false;
        // Setting the content of the InfoWindow
        infowindow.setContent(popup_content[addrCount]);
        //infowindow.setOptions({maxWidth:100});
        // Tying the InfoWindow to the marker 
        infowindow.open(map, this);
    });
    // markers.push(marker);
    // Extending the bounds object with each LatLng 
    bounds.extend(places[addrCount]);

    // Adjusting the map to new bounding box 
    map.fitBounds(bounds);
    //markerCluster = new MarkerClusterer(map, markers);
}

var center;

/********************************************************************************************
 ' Name                 :   calculateCenter
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   calculate MAP center point
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  9th May, 2013      -   Pradeep yadav
 '*******************************************************************************************/
function calculateCenter() {
    center = map.getCenter();
}

/********************************************************************************************
 ' Name                 :   getZipCode
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   Get zip code from user and call getLocationInformation() method
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  10th March, 2013      -   Ravi Raj
 '*******************************************************************************************/
function getZipCode() {
	$("#SearchLocationInfo").empty();
    var searchTextFieldVal = $('#searchTextField').val();
    if (!searchTextFieldVal || searchTextFieldVal.length != 5) {
        $("#searchTextField").attr("disabled", false);
        showGeneralErrorMsg(messages['locator.zipCodeError'], 'searchTextField');
        $("#searchTextField").focus();
        return false;
    }
    else {
        zipcode = searchTextFieldVal;
        showProgressBar(); /* To show the progress bar */
        getLocationInformation();
    }
}

/********************************************************************************************
 ' Name                 :   createMapLeftWidow
 ' Return type          :   void
 ' Input Parameter(s)   :   String searchedPins
 ' Purpose              :   add locations Div into the left pan.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  10th March, 2013   -   Pradeep Yadav
 '*******************************************************************************************/
function createMapLeftWidow(searchedPins, searchedPins2) {
    $("#SearchLocationInfo").html(searchedPins);
    $("#listViewOfMap").html(searchedPins2);
    $("#panel").toggle();
    $("#panel").toggle();
}

/********************************************************************************************
 ' Name                 :   showListOrMapView
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used to show the list view and map view of locator
 in mobile width layout.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  4th July, 2013    -   Ravi Raj
 '*******************************************************************************************/
function showListOrMapView() {
    var leftTitle = $('#mapLeftTitle').text();
    if (leftTitle === messages['locator.mapViewText']) {
        $('#mapLeftTitle').text(messages['locator.listViewText']);
        $('#mapRightTitle').text(messages['locator.mapViewText']);
        $('#locatorMapViewArea').hide();
        $('#listViewOfMap').show();
        var listText = $('#listViewOfMap').text();
        if (listText === "") {
            $('#listViewOfMap').html("<h5>" + messages['locator.listViewMsg'] + "</h5>");
        }
    } else {
        $('#mapLeftTitle').text(messages['locator.mapViewText']);
        $('#mapRightTitle').text(messages['locator.listViewText']);
        $('#listViewOfMap').hide();
        $('#locatorMapViewArea').show();
    }
}
/**
 * Window resize for resize of locator map area.
 */
$(window).resize(function () {
	var currentWindowWidth = $(window).width();
	if(!(navigator.userAgent).match(/Android/i) || lastWindowWidthMap != currentWindowWidth) {
		clearTimeout(this.id);
	    this.id = setTimeout(setSectionHeigthForLocator, 500);
	    lastWindowWidthMap = currentWindowWidth;
	}
	
	/* ++++ resizing window ++++ */
	$('.wrapper_area').addClass('lft0').removeClass('lftAuto');
});

/********************************************************************************************
' Name                 :   setSectionHeigthForLocator
' Return type          :   Void
' Input Parameter(s)   :   None
' Purpose              :   This method is used for calculating the height of locator map area.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -  23rd June, 2013      -   Ravi Raj
'*******************************************************************************************/
function setSectionHeigthForLocator(){
	var frameHeight = getContainerHeight() - $('#mapViewOfLocatorMap').outerHeight(true);
	var mapHeight = frameHeight - $('#locatorMapSearchArea').outerHeight(true);
	/* Locator area section*/
	$("#locator_area").css("height", frameHeight);
	$("#outer_map_canvas").css("height", mapHeight);
	/**
	 * Only to execute when Locator Map is visible on Screen
	 */
	if ($('#locatorMapInner').is(":visible")) {
		/*
		 * To create the Show Balance Details area for Standard width.  
		 */
		$('#listViewOfMap').hide();
		$('#locatorMapViewArea').show();
	}
	if (parseBoolean(localStorage.getItem("registerUser"))) {
		var windowWidth = $(window).width();
		if (windowWidth <= minimumWindowWidthForMobile) {
			if(!$('#activityIcon').is(':visible')){
				// We are hiding the activity sidebar on locator until further notice
				//$('#activityIcon').show();
			}
		} else {
			if($('#activityIcon').is(':visible')){
                // We are hiding the activity sidebar on locator until further notice
				//$('#activityIcon').hide();
			}
		}
	}
	customScrollForAndroidVersion2ForListView();
}

/********************************************************************************************
' Name                 :   setMapHeightInMobile
' Return type          :   Integer finalMapHeight
' Input Parameter(s)   :   Integer frameHeightOfMap
' Purpose              :   This method is used for calculating the height of google map area.
' History Header       :   Version   -   Date              -   Developer Name 
' Added By             :   1.0       -  23rd June, 2013      -   Ravi Raj
'*******************************************************************************************/
function setMapHeightInMobile(frameHeightOfMap){
	var mapSubTitleHeight=$("#locatorSubTitleArea").outerHeight(true);
	var mapSearchBoxHeight=$("#locatorSearchBox").outerHeight(true);
	var finalMapHeight= frameHeightOfMap - (mapSubTitleHeight + mapSearchBoxHeight + 6);
	return finalMapHeight;
}
/********************************************************************************************
' Name                 :   setIntervalForInitSuccessOnLocator
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Clear the interval.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
'*******************************************************************************************/
function setIntervalForInitSuccessOnLocator(){
	apiSuccessCountDownOfInitOnLocator = setInterval("checkBooleanValueOfInitSuccessOnLocator();", 500);
}

/********************************************************************************************
' Name                 :   checkBooleanValueOfInitSuccessOnLocator
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   Clear the interval.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   2 July 2013   -   Karuna Mishra
'*******************************************************************************************/
function checkBooleanValueOfInitSuccessOnLocator(){
	if(isInitAppCalledSuccess){
		startLocatorCall();
		clearIntervalApp(apiSuccessCountDownOfInitOnLocator);
	}
}

/**
 * to allow scrolling on android browsers. 
 */
function customScrollForAndroidVersion2ForListView(){
	if( (navigator.userAgent).match(/Android 2/i) ) {
		$('#locator_area').oneFingerScroll();
	}
}

function setAddressToMap(addrCount, pointObj){
	places[addrCount] = pointObj;
    map.setCenter(places[addrCount]);
    addPlace(addrCount);
    
    if (addrCount === (location_load_obj.locations.length - 1)) {
        /* To hide the progress bar */
        hideProgressBar();
        $("#searchTextField").attr("disabled", false);
    }
}   	  	
