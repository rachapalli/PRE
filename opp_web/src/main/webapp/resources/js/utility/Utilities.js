/* Development URL */
var DOLLAR_SYMBOL = "$";
var isClickedOnMyAccountSection = false;
var uri = '/financialServicesApi/api/';
var minimumWindowWidthForMobile = 800;
var resetPswd = "";
var timerIntervalSuccMsg, timerIntervalErrMsg;
var currentHashSuccess, currentHashError;
var apiTimeOutVal = new Object();
var userInfoObject = null;
var timeForSlide = 60000;
var timeOutForErrorSlide, timeOutForSucessSlide;
/**
 *
 *  Base64 encode / decode
 */
var ERROR_CODE_401 = 401;
var ERROR_CODE_403 = 403;
var ERROR_CODE_500 = 500;
var swipeCount = 0;
var Base64 = {
    /* private property */ 
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* public method for encoding */ 
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }
        return output;
    },

    /* public method for decoding */ 
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = Base64._utf8_decode(output);
        return output;
    },

    /* private method for UTF-8 encoding */ 
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    /* private method for UTF-8 decoding */ 
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

/* This works for the browsers those don't support trim() function */
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

/* This works for the browsers those don't support indexOf property e.g. in ie.ver < 9 */
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) {
            i = 0;
        }
        if (i < 0) {
            i += this.length;
        }
        if (i < 0) {
            i = 0;
        }
        for (var n = this.length; i < n; i++) {
            if (i in this && this[i] === find) {
                return i;
            }
        }
        return -1;
    };
}

/**
 * To create a timer that will be called after fix time interval.
 */
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

/**
 * used to set user basic authentication data(User name and Session Token) into
 * request header after convert into base 64 String
 *
 * @param xhr
 */
/********************************************************************************************
' Name                 :   setHeader
' Return type          :   None
' Input Parameter(s)   :   xhr
' Purpose              :   Used to set user basic authentication data(User name and Session Token)
' into request header after convert into base 64 String
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   7th Nov,2013       -   Karuna Mishra
'*******************************************************************************************/
function setHeader(xhr) {
    if (getCookie('sessionToken') != "") {
        var encodedData = Base64.encode(getCookie('userName') + ":" + getCookie('sessionToken'));
        xhr.setRequestHeader("Authorization", "Basic " + encodedData);
    } else {
        moveToLoginOnSessionTimeOut();
    }
}

/********************************************************************************************
 ' Name                 :   setSessionCookie
 ' Return type          :   none
 ' Input Parameter(s)   :   name, value, expTime
 ' Purpose              :   Function is used to set session token value into cookie.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   7th Nov,2013       -   Karuna Mishra
 '*******************************************************************************************/
function setSessionCookie(c_name, value, expTime) {
    var date = new Date();
    date.setTime(date.getTime() + expTime);
    var c_value = encodeURI(value)
            + ((expTime == null) ? "" : "; expires=" + date.toGMTString());
    document.cookie = c_name + "=" + c_value;
}

/********************************************************************************************
 ' Name                 :   getCookie
 ' Return type          :   String
 ' Input Parameter(s)   :   c_name
 ' Purpose              :   Function is used to get the variable from the cookie..
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   9th Jan,2013       -   Karuna Mishra
 '*******************************************************************************************/
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return decodeURI(y);
        }
    }
    return '';
}

/********************************************************************************************
 ' Name                 :   deleteAllCookies
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used to delete the all cookies when user clicks on SignOut button.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   9th Jan,2013       -   Karuna Mishra
 '*******************************************************************************************/
function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = (eqPos > -1 ? cookie.substr(0, eqPos) : cookie);
        var nameOfCookie = $.trim(name);
        if (nameOfCookie !== "locale" && nameOfCookie !== "localeIndex" && nameOfCookie !== "userNameForRememberMe" &&
                nameOfCookie !== "needHelp") {
            document.cookie = nameOfCookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}

/********************************************************************************************
 ' Name                 :   deleteUserIdCookie
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for delete the userId cookie on the load of login page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th May,2013      -   Karuna Mishra
 '*******************************************************************************************/
function deleteUserIdCookie() {
    setCookie("userId", "");
}

/********************************************************************************************
 ' Name                 :   setCookieForNeedhelpNotification
 ' Return type          :   None
 ' Input Parameter(s)   :   popUpId
 ' Purpose              :   Function is used for set the cookie for need help notification in main payment page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   21st August,2014      -   Karuna Mishra
 '*******************************************************************************************/
function setCookieForNeedhelpNotification(popUpId) {
    setCookie("needHelp", true, 365);
    closeInlinePopup(popUpId);
}

/********************************************************************************************
 ' Name                 :   handleError
 ' Return type          :   None
 ' Input Parameter(s)   :   request, startTime, apiName
 ' Purpose              :   Function is used for handling the server error.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   23rd Feb,2013      -   Karuna Mishra
 '*******************************************************************************************/
function handleError(request, startTime, apiName) {
    if (request.status == ERROR_CODE_401) {
        location.href = 'home.jsp';
        /* To hide the progress bar */
        hideProgressBar();
        return;
    } else if (request.status == ERROR_CODE_500) {
        handleApplicationError(startTime, apiName, request);
        /* To hide the progress bar */
        hideProgressBar();
        return;
    }
}

var countOfCallingRepotErrorApi = 0;
/********************************************************************************************
 ' Name                 :   handleApplicationError
 ' Return type          :   None
 ' Input Parameter(s)   :   startTime, url, req, e, statusofApi
 ' Purpose              :   Function is used for handling the application error.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   23rd Feb,2013      -   Karuna Mishra
 '*******************************************************************************************/
function handleApplicationError(startTime, url, req, e, statusofApi) {
    /* To show the progress bar */
    showProgressBar();
    var today = new Date();
    var endTime = today.getTime();
    var request = {};
    var userId = getCookie('userId');
    if (userId !== "") {
        request.userId = parseInt(userId);
    }
    request.exception = e;
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.url = url;
    request.startUrlTime = startTime;
    request.endUrlTime = endTime;
    request.errorMessage = "Status :" + req.status + " Status Response :" + req.statusText + " Exception :" + e;
    gaReportError(getClientIp(), request.errorMessage, request.exception);
    $.ajax({
               url: uri + 'public/system/reportError',
               type: 'POST',
               contentType: 'application/json; charset=utf-8',
               /* request data */ 
               data: JSON.stringify(request),
               /* request data type */ 
               dataType: 'json',
               timeout: 30000,
               cache: false,
               success: function (data, status, req) {
                   hideProgressBar();
                   if (countOfCallingRepotErrorApi === 0) {
                       countOfCallingRepotErrorApi++;
                   }
               },
               error: function (req, status, error) {
                   hideProgressBar();
                   if (countOfCallingRepotErrorApi === 0) {
                       countOfCallingRepotErrorApi++;
                   }
               },
               statusCode: {
                   401: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   },
                   403: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   },
                   503: function () {
                       location.href = 'home.jsp';
                       /* To hide the progress bar */
                       hideProgressBar();
                   }
               }
           });
}

/********************************************************************************************
 ' Name                 :   disableButton
 ' Return type          :   None
 ' Input Parameter(s)   :   buttonId
 ' Purpose              :   Disable the button on clicked/enter  event.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   4th March,2013      -   Pradeep Yadav
 '*******************************************************************************************/
function disableButton(buttonId) {
    $('#' + buttonId).attr("disabled", true);
}

/********************************************************************************************
 ' Name                 :   enableButton
 ' Return type          :   None
 ' Input Parameter(s)   :   buttonId
 ' Purpose              :   Enable the button on clicked/enter  event.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   4th March,2013      -   Pradeep Yadav
 '*******************************************************************************************/
function enableButton(buttonId) {
    $('#' + buttonId).attr("disabled", false);
}

/********************************************************************************************
 ' Name                 :   calculate_time_zone
 ' Return type          :   Sting(timeZone)
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for calculation the time zone of user.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   8th Jan,2013      -   Karuna Mishra
 '*******************************************************************************************/
function calculate_time_zone() {
    var rightNow = new Date();
    var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  /* jan 1st */ 
    var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); /* june 1st */ 
    var temp = jan1.toGMTString();
    var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
    temp = june1.toGMTString();
    var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
    var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
    var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
    if (std_time_offset != daylight_time_offset) {
    	var hemisphere = std_time_offset - daylight_time_offset;
        if (hemisphere >= 0) {
            std_time_offset = daylight_time_offset;
        }
    }
    return timeZone = "GMT" + (convert(std_time_offset));
}


/********************************************************************************************
 ' Name                 :   convert
 ' Return type          :   String
 ' Input Parameter(s)   :   Value(Time)
 ' Purpose              :   Function is used for calculation of time zone..
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   8th Jan,2013   -   Karuna Mishra
 '*******************************************************************************************/
function convert(value) {
    var hours = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var mins = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var display_hours = hours;
    /* handle GMT case (00:00) */ 
    if (hours == 0) {
        display_hours = "00";
    } else if (hours > 0) {
        /* add a plus sign and perhaps an extra 0 */ 
        display_hours = (hours < 10) ? "+0" + hours : "+" + hours;
    } else {
        /* add an extra 0 if needed */ 
        display_hours = (hours > -10) ? "-0" + Math.abs(hours) : hours;
    }

    mins = (mins < 10) ? "0" + mins : mins;
    return display_hours + mins;
}

/********************************************************************************************
 ' Name                 :   isNumberKey
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   evt
 ' Purpose              :   Function is used for checking the input value is numeric.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th March, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) || charCode == 99) {
        return false;
    }
    return true;
}

/********************************************************************************************
 ' Name                 :   isValidAmount
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   currentElement, evt
 ' Purpose              :   Function is used for validating the amount format on key press.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   11th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function isValidAmountEntered(currentElement, evt) {
    /* Getting the char code for pressed key event */
    var charCode = evt.charCode;
    /* if browser version is IE-8 */ 
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
        charCode = evt.keyCode;
    }
    /* Checking for CTRL+C key event */
    if (isCtrlKeyPressed(evt, charCode)) {
        return true;
    } else if (isSpecialKeyPressed(charCode)) {
        return true;
    } else if (charCode > 31 && charCode != 46 &&
            (charCode < 48 || charCode > 57)) { /* Validating for only numeric values should be entered */
        return false;
    }
    var txtAmountVal = $(currentElement).val().trim();
    /* Checking variable should not be null, undefined or blank */
    if (txtAmountVal) {
        /* To get the current cursor position with in the text */
        var inputIndex = $(currentElement).caret().start;
        /* To create the new amount string combining curent amount and new char pressed at cursor position */
        txtAmountVal = insertCharAt(txtAmountVal, inputIndex, String.fromCharCode(charCode));
        /* Regular expression to validate the amount field */
        var pattern = /^\d{0,4}(\.(\d{1,2})?)?$/;
        /* Validating the new combined amount with regular expression */
        if (pattern.test(txtAmountVal)) {
            return true;
        } else if (getSelectedArea()) { /* Checking if the complete or partial text is selected in input field */
            return true;
        }
        return false;
    }
    return true;
}

/********************************************************************************************
 ' Name                 :   isValidPhoneEntered
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   currentElement, evt
 ' Purpose              :   Function is used for validating the US phone no format on key press.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   15th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function isValidPhoneEntered(currentElement, evt, maxLength) {
    if (!maxLength) {
        maxLength = 10;
    }
    /* Getting the char code for pressed key event */
    var charCode = evt.charCode;
    /* if browser version is IE-8 */ 
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
        charCode = evt.keyCode;
    }
    var txtPhoneVal = $(currentElement).val().trim();
    /* To get the current cursor position with in the text */
    var inputIndex = $(currentElement).caret().start;
    /* To create the new amount string combining curent amount and new char pressed at cursor position */
    txtPhoneVal = insertCharAt(txtPhoneVal, inputIndex, String.fromCharCode(charCode));
    /* Checking variable should not be null, undefined or blank */
    if (txtPhoneVal) {
        if (charCode === 40 && txtPhoneVal.match(/\(/g).length == 1) { /* Validating to allow only one ( on input */
            return true;
        } else if (charCode === 41 &&
                txtPhoneVal.match(/\)/g).length == 1) { /* Validating to allow only one ) on input */
            return true;
        } else if (charCode === 45 &&
                txtPhoneVal.match(/-/g).length <= 2) { /* Validating to allow only two - on input */
            return true;
        } else if (isCtrlKeyPressed(evt, charCode)) { /* Validating for CTRL+C/X/V key event for firefox */
            return true;
        } else if (isSpecialKeyPressed(charCode)) { /* Validating for Left/Right arrow, Delete key event for firefox */
            return true;
        } else if (charCode > 31 &&
                (charCode < 48 || charCode > 57)) { /* Validating for only numeric values should be entered */
            return false;
        } else {
            var phoneNo = txtPhoneVal.replace(/\W+/g, '');
            /* Removing all characters as (, ) and - to validate the */
            if (phoneNo.length <= maxLength) {
                return true;
            } else if (getSelectedArea()) { /* Checking if the complete or partial text is selected in input field */
                return true;
            }
            return false;
        }
    }
}

/********************************************************************************************
 ' Name                 :   isValidDateEntered
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   currentElement, evt
 ' Purpose              :   Function is used for validating the US phone no format on key press.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   15th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function isValidDateEntered(currentElement, evt, maxLength) {
    if (!maxLength) {
        maxLength = 8;
    }

    /* Getting the char code for pressed key event */
    var charCode = evt.charCode;
    /* if browser version is IE-8 */ 
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
        charCode = evt.keyCode;
    }
    var txtDateVal = $(currentElement).val().trim();
    /* To get the current cursor position with in the text */
    var inputIndex = $(currentElement).caret().start;
    /* To create the new amount string combining curent amount and new char pressed at cursor position */
    txtDateVal = insertCharAt(txtDateVal, inputIndex, String.fromCharCode(charCode));
    /* Checking variable should not be null, undefined or blank */
    if (txtDateVal) {
        if (charCode === 47 && txtDateVal.match(/\//g).length <= 2) { /* Validating to allow only one ( on input */
            if (txtDateVal.indexOf('-') === -1) {
                return true;
            }
            return false;
        } else if (charCode === 45 &&
                txtDateVal.match(/-/g).length <= 2) { /* Validating to allow only two - on input */
            if (txtDateVal.indexOf('/') === -1) {
                return true;
            }
            return false;
        } else if (isCtrlKeyPressed(evt, charCode)) { /* Validating for CTRL+C/X/V key event for firefox */
            return true;
        } else if (isSpecialKeyPressed(charCode)) { /* Validating for Left/Right arrow, Delete key event for firefox */
            return true;
        } else if (charCode > 31 &&
                (charCode < 48 || charCode > 57)) { /* Validating for only numeric values should be entered */
            return false;
        } else {
            var date = txtDateVal.replace(/\W+/g, '');
            /* Removing all characters as (, ) and - to validate the */
            if (date.length <= maxLength) {
                return true;
            } else if (getSelectedArea()) { /* Checking if the complete or partial text is selected in input field */
                return true;
            }
            return false;
        }
    }
}

/********************************************************************************************
 ' Name                 :   isValidCardNoEntered
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   currentElement, evt
 ' Purpose              :   Function is used for validating the card no format on key press.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28th Oct, 2013    -   Karuna Mishra
 '*******************************************************************************************/
function isValidCardNoEntered(currentElement, evt, maxLength) {
	 if (!maxLength) {
	       maxLength = 16;
	   }
	   /* Getting the char code for pressed key event */
	   var charCode = evt.charCode;
	   /* if browser version is IE-8 */ 
	   if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
		   charCode = evt.keyCode;
	   }
	   var txtCardVal = $(currentElement).val().trim();
	   /* To get the current cursor position with in the text */
	   var inputIndex = $(currentElement).caret().start;
	   /* To create the new amount string combining curent amount and new char pressed at cursor position */
	   txtCardVal = insertCharAt(txtCardVal, inputIndex, String.fromCharCode(charCode));
	   /* Checking variable should not be null, undefined or blank */
	   if (txtCardVal) {
	       if (charCode === 45 && txtCardVal.match(/-/g).length <= 3) { /* Validating to allow only two - on input */
	           return true;
	       } else if (charCode === 32 && txtCardVal.match(/s/g).length <= 3) { /* Validating to allow only two - on input */
	           return true;
	       } else if (isCtrlKeyPressed(evt, charCode)) { /* Validating for CTRL+C/X/V key event for firefox */
	           return true;
	       } else if (isSpecialKeyPressed(charCode)) { /* Validating for Left/Right arrow, Delete key event for firefox */
	           return true;
	       } else if (charCode > 31 && (charCode < 48 || charCode > 57)) { /* Validating for only numeric values should be entered */
	           return false;
	       } else {
	           var cardNo = txtCardVal.replace(/\W+/g, '');
	           /* Removing all characters as (, ) and - to validate the */
	           if (cardNo.length <= maxLength) {
	               return true;
	           } else if (getSelectedArea()) { /* Checking if the complete or partial text is selected in input field */
	               return true;
	           }
	           return false;
	       }
	   }
}

/********************************************************************************************
 ' Name                 :   formatPhoneNo
 ' Return type          :
 ' Input Parameter(s)   :   currentElement
 ' Purpose              :   Function is used for formatting the US phone no on blur and set the value.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   15th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function formatPhoneNo(currentElement) {
    var fieldValue = $(currentElement).val();
    if (fieldValue) { /* Checking that fieldValue should not be nudefined, null or blank */
        fieldValue = fieldValue.replace(/\W+/g, '');
        /* Removing the extra char symbols the fieldValue should not be blank */
        fieldValue = getFormattedPhoneNo(fieldValue);
    }
    $(currentElement).val(fieldValue);
}

/********************************************************************************************
 ' Name                 :   formatDate
 ' Return type          :
 ' Input Parameter(s)   :   currentElement
 ' Purpose              :   Function is used for formatting the Date on blur and set the value.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   15th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function formatDate(currentElement) {
    var fieldValue = $(currentElement).val();
    if (fieldValue) { /* Checking that fieldValue should not be undefined, null or blank */
        fieldValue = fieldValue.replace(/\W+/g, '');
        /* Removing the extra char symbols from the value */
        fieldValue = getFormattedDate(fieldValue);
    }
    $(currentElement).val(fieldValue);
}

/********************************************************************************************
 ' Name                 :   getFormattedPhoneNo
 ' Return type          :
 ' Input Parameter(s)   :   fieldValue
 ' Purpose              :   Function is used for formatting the US phone no and return it.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   16th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function getFormattedPhoneNo(fieldValue) {
    if (fieldValue) { /* Checking that fieldValue should not be blank */
        var start = fieldValue.substring(0, 3);
        /* Getting the first 3 digits of phone no value */
        var mid = fieldValue.substring(3, 6);
        /* Getting the next 3 digits of phone no value */
        var end = fieldValue.substring(6);
        /* Getting the remaining digits of phone no value */
        fieldValue = start + '-' + mid + '-' + end;
        /* Formatting the value as US Phone No */
    }
    return fieldValue;
}

/********************************************************************************************
 ' Name                 :   getFormattedPhoneNo
 ' Return type          :
 ' Input Parameter(s)   :   fieldValue
 ' Purpose              :   Function is used for formatting the Date and return it.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   16th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function getFormattedDate(fieldValue) {
    if (fieldValue) { /* Checking that fieldValue should not be blank */
        var start = fieldValue.substring(0, 2);
        /* Getting the first 2 digits of date value */
        var mid = fieldValue.substring(2, 4);
        /* Getting the next 2 digits of date value */
        var end = fieldValue.substring(4);
        /* Getting the remaining digits of date value */
        fieldValue = start + '/' + mid + '/' + end;
        /* Formatting the value as Date format */
    }
    return fieldValue;
}

/********************************************************************************************
 ' Name                 :   getSelectedArea
 ' Return type          :   Boolean
 ' Input Parameter(s)   :
 ' Purpose              :   Function is used to get the selected text and return true if
 '                            there is any text selected..
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   11th July, 2013   -   Karuna Mishra
 '*******************************************************************************************/
function getSelectedArea() {
    var userSelection = null;
    if (document.activeElement) {
        var txtField = document.activeElement;
        if (txtField.selectionStart !== undefined && txtField.selectionEnd !== undefined) {
            userSelection = txtField.value.substring(txtField.selectionStart, txtField.selectionEnd).toString();
        }
    } else if (window.getSelection) {
        userSelection = window.getSelection().toString();
    } else if (document.getSelection) { /* All browsers, except IE before version 9 */
        userSelection = document.getSelection().toString();
    }
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
        if (document.selection) { /* IE below version 9 */
            userSelection = document.selection.createRange().text;
        }
    }
    if (userSelection && userSelection.length > 0) {
        return true;
    }
    return false;
}

/********************************************************************************************
 ' Name                 :   deleteAllCookies
 ' Return type          :   String
 ' Input Parameter(s)   :   srcString, index, srcNeedToAdd
 ' Purpose              :   Function is used to get new string by add new charactor or String at specified index.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th June,2013       -   Pradeep Yadav
 '*******************************************************************************************/
function insertCharAt(srcString, index, srcNeedToAdd) {
    return srcString.substr(0, index) + srcNeedToAdd + srcString.substr(index);
}

/********************************************************************************************
 ' Name                 :   isCtrlKeyPressed
 ' Return type          :   boolean
 ' Input Parameter(s)   :   evt, charCode
 ' Purpose              :   Function is used to validate the CTRL key and its combination.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th June,2013       -   Rai Raj
 '*******************************************************************************************/
function isCtrlKeyPressed(evt, charCode) {
    /* 97 -> CTRL + A 99 -> CTRL + C  * 116 -> F5  * 118 -> CTRL + V  * 120 -> CTRL + X	* 121 -> CTRL + Y 	* 122 -> CTRL + Z */
    return evt.ctrlKey &&
            (charCode === 97 || charCode === 99 || charCode === 116 || charCode === 118 || charCode === 120
                    || charCode === 121 || charCode === 122);
}

/********************************************************************************************
 ' Name                 :   isSpecialKeyPressed
 ' Return type          :   boolean
 ' Input Parameter(s)   :   charCode
 ' Purpose              :   Function is used to validate the special keys like Home, End, Left/Right
 arrow, F5 etc.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   24th June,2013       -   Ravi raj
 '*******************************************************************************************/
function isSpecialKeyPressed(charCode) {
    return (charCode === 0 );
}

/********************************************************************************************
 ' Name                 :   showInlineErrorMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   errorBackDropId, message, elementId
 ' Purpose              :   Function is used for showing the failed api response.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   23rd Feb, 2013       -   Karuna Mishra
 '*******************************************************************************************/
var elementId1 = "";
function showInlineErrorMessage(errorBackDropId, message, elementId) {
    if (message && message.indexOf("SyntaxError: Unexpected token") === -1) {
        message = message.replace(/'/g, "single_quote");
        if (!timerIntervalErrMsg) {
            timerIntervalErrMsg = setInterval("changeHashForErrorMessage('" + errorBackDropId + "', '" +
            					  message + "', '" + elementId + "')", 10);
        }
        setTimeout(function () {
            restartTimerForSlideDown();
        }, 2000);
    }
}

/********************************************************************************************
 ' Name                 :   changeHashForErrorMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   errorBackDropId, message, elementId
 ' Purpose              :   Function is used for showing the failed api response.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   03rd Sep, 2013       -   Ravi Raj
 '*******************************************************************************************/
function changeHashForErrorMessage(errorBackDropId, message, elementId) {
    currentHashError = window.location.hash;
    navigateToErrorSlideDown(errorBackDropId, message, elementId);
    return false;
}

/********************************************************************************************
' Name                 :   showErrorSlideDown
' Return type          :   None
' Input Parameter(s)   :   errorBackDropId, message, elementId
' Purpose              :   Function is used for showing the failed api response as slide donw.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   26th Aug,2013       -   Karuna Mishra
'*******************************************************************************************/
var errorMessageClose = false;
function showErrorSlideDown(errorBackDropId, message, elementId) {
    message = message.replace(/single_quote/g, "'");
    if (message) {
        elementId1 = elementId;
        $('#inlineMessageDiv').html(message);
        $(window.parent).scrollTop(0);
        $('#' + errorBackDropId).show();
        $('#showInlineErrorMessageDiv').show();
    }
	clearIntervalApp(timerIntervalErrMsg);
	errorMessageClose = true;
   	if(elementId1 === "emailPrompt" || !elementId1){
   		focusOnErrorField();
   	} else {
	   	var delayTime = 100;
	    delay(function () {
	    		focusOnErrorField();
	    }, delayTime);
   	}
	timerIntervalErrMsg = null;
}

/********************************************************************************************
 ' Name                 :   closeInlineErrorMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for closing the inline error popup message.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   22nd Feb,2013       -   Karuna Mishra
 '*******************************************************************************************/
function closeInlineErrorMessage(errorBackDropId) {
	hashChangedCalled = true;
	$('#inlineMessageDiv').text("");
    closeInlinePopup(errorBackDropId);
   	$('#showInlineErrorMessageDiv').hide();
   	$('#inlineMsgId').empty();
   	window.location.hash = currentHashError;
   	clearTimeout(timeOutForErrorSlide);
   	timeOutForErrorSlide = null;
}

function focusOnErrorField() {
    if (elementId1 && errorMessageClose) {
        $('#' + elementId1).addClass("error_red_border");
        $('#' + elementId1).focus();
    }
    elementId1 = "";
}

/********************************************************************************************
 ' Name                 :   showInlineSuccessMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   successBackDropId, message, str
 ' Purpose              :   Function is used for showing the success api response.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   23rd Feb,2013       -   Karuna Mishra
 '*******************************************************************************************/
function showInlineSuccessMessage(successBackDropId, message, str) {
    if (!str) {
        str = messages['inLine.message.successMessage'];
    }
    message = message.replace(/'/g, "single_quote");
    str = str.replace(/'/g, "single_quote");
    if (!timerIntervalSuccMsg) {
        timerIntervalSuccMsg = setInterval("changeHashForSuccessMessage('" + successBackDropId + "', '" +
        					   message + "', '" + str + "')", 10);
    }
    setTimeout(function () {
        restartTimerForSlideDown();
    }, 2000);
}

/********************************************************************************************
 ' Name                 :   changeHashForSuccessMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   successBackDropId, message, str
 ' Purpose              :   Function is used for showing the success api response.
 ' History Header       :   Version   -   Date                 -   Developer Name
 ' Added By             :   1.0       -   03rd Sep,2013       -   Ravi Raj
 '*******************************************************************************************/
function changeHashForSuccessMessage(successBackDropId, message, str) {
    if (!currentHashSuccess) {
        currentHashSuccess = window.location.hash;
    }
    navigateToSuccessSlideDown(successBackDropId, message, str);
    return false;
}

/********************************************************************************************
 ' Name                 :   showInlineSuccessMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   successBackDropId, message, str
 ' Purpose              :   Function is used for showing the success api response.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   26th Aug,2013       -   Karuna Mishra
 '*******************************************************************************************/
function showSuccessSlideDown(successBackDropId, message, str) {
	message = message.replace(/single_quote/g,"'");
	str = str.replace(/single_quote/g,"'");
	if(message){
		$('#successMsgHed').text(str);
	    $('#inlineSuccessMessageDiv').text(message);
	    $('#' + successBackDropId).show();
	    $('#showInlineSuccessMessageDiv').show();
	    $(window.parent).scrollTop(0);
	}
	clearIntervalApp(timerIntervalSuccMsg);
	timerIntervalSuccMsg = null;
}

/********************************************************************************************
 ' Name                 :   closeInlineSuccessMessage
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for closing the inline success popup message.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   22nd Feb,2013       -   Karuna Mishra
 '*******************************************************************************************/
function closeInlineSuccessMessage(successBackDropId) {
    hashChangedCalled = true;
    $('#inlineSuccessMessageDiv').text("");
    $('#showInlineSuccessMessageDiv').hide();
    closeInlinePopup(successBackDropId);
    clearTimeout(timeOutForSucessSlide);
	timeOutForSucessSlide = null;
    window.location.hash = currentHashSuccess;
}

/********************************************************************************************
 ' Name                 :   closeInlinePopup
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used for closing the inline popup message.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   22nd June,2013       -   Karuna Mishra
 '*******************************************************************************************/
function closeInlinePopup(backDropId) {
	if($('#' + backDropId).is(":visible")){
			$('#' + backDropId).hide();
		 if(resetPswd){
    		handleAuthenticate();
	    }
	}
}

/********************************************************************************************
 ' Name                 :   removeErrorBorderClass
 ' Return type          :   None
 ' Input Parameter(s)   :   Element ID
 ' Purpose              :   Function is used for applying red broder class if input field's client side validation failed.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   27th Feb,2013       -   Karuna Mishra
 '*******************************************************************************************/
function removeErrorBorderClass(elementId) {
    if (elementId) {
        if ($('#' + elementId).val()) {
            $('#' + elementId).removeClass("error_red_border");
        } else {
            $('#element' + elementId).removeClass("error_red_border");
            $('#' + elementId).removeClass("error_red_border");
        }
    }
}

/********************************************************************************************
 ' Name                 :   applyErrorClass
 ' Return type          :   None
 ' Input Parameter(s)   :   Element ID
 ' Purpose              :    Function is used for applying red broder class if input field's client side validation failed.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  27th Feb,2013       -   Karuna Mishra
 '*******************************************************************************************/
function applyErrorClass(elementId) {
    if (elementId) {
        if ($('#' + elementId).val()) {
            $('#' + elementId).addClass("error_red_border");
        } else {
            $('#element' + elementId).addClass("error_red_border");
        }
    }
}

/********************************************************************************************
 ' Name                 :   checkEmailForGuestUser
 ' Return type          :   String(messageToFormat)
 ' Input Parameter(s)   :   messageToFormat,arg0,arg1,arg2,arg3,arg4,arg5
 ' Purpose              :   Function is used for passing resource bundle data to JS files.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   4th June, 2013    -   Jason Vincent
 '*******************************************************************************************/
function formatMessage(messageToFormat, arg0, arg1, arg2, arg3, arg4, arg5) {
    if (null != arg0) {
        while (messageToFormat.indexOf("{0}") >= 0) {
            messageToFormat = messageToFormat.replace("{0}", arg0);
        }
    }
    if (null != arg1) {
        while (messageToFormat.indexOf("{1}") >= 0) {
            messageToFormat = messageToFormat.replace("{1}", arg1);
        }
    }
    if (null != arg2) {
        while (messageToFormat.indexOf("{2}") >= 0) {
            messageToFormat = messageToFormat.replace("{2}", arg2);
        }
    }
    if (null != arg3) {
        while (messageToFormat.indexOf("{3}") >= 0) {
            messageToFormat = messageToFormat.replace("{3}", arg3);
        }
    }
    if (null != arg4) {
        while (messageToFormat.indexOf("{4}") >= 0) {
            messageToFormat = messageToFormat.replace("{4}", arg4);
        }
    }
    if (null != arg5) {
        while (messageToFormat.indexOf("{5}") >= 0) {
            messageToFormat = messageToFormat.replace("{5}", arg5);
        }
    }
    return messageToFormat;
}

/********************************************************************************************
 ' Name                 :   parseBoolean
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   string
 ' Purpose              :   This method is used for parsing the string value in boolean value.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   18th May,2013       -   Karuna Mishra
 '*******************************************************************************************/
function parseBoolean(string) {
    switch (String(string).toLowerCase()) {
        case "true":
        case "1":
        case "yes":
        case "y":
            return true;
        case "false":
        case "0":
        case "no":
        case "n":
            return false;
        default:
            /* you could throw an error, but 'undefined' seems a more logical reply */
            return undefined;
    }
}

/********************************************************************************************
 Name                 :   getValueFromKey
 Return type          :   String
 Input Parameter(s)   :   key
 Purpose              :   To Get value from map based on the key.
 History Header       :   Version   -   Date               -   Developer Name
 Added By             :   1.0       -   02th April, 2013   -   Pradeep Yadav
 **********************************************************************************************/
function getValueFromKey(key) {
    return bpGetCorpAccountMap[key] ? bpGetCorpAccountMap[key] : '';
}

/********************************************************************************************
 ' Name                 :   forwardGuestToCreateAccountPage
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   Function is used for open Sign Up page on the click of sign up
 button on main payment page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   5th June, 2013    -   Ravi Raj
 '*******************************************************************************************/
function forwardGuestToCreateAccountPage() {
	var fundingSourceTypes_JsonType = "";
	if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			var userId = getCookie('userId');
			if(userId) {
				location.href = "create_profile.jsp?resourceAppId=" + applicationId + "&userId=" + userId;
			} else {
				location.href = "create_profile.jsp?resourceAppId=" + applicationId;
			}
			return;
		}
	}else{
		var userId = getCookie('userId');
		if(userId) {
			location.href = "create_profile.jsp?resourceAppId=" + applicationId + "&userId=" + userId;
		} else {
			location.href = "create_profile.jsp?resourceAppId=" + applicationId;
		}
		return;
	}	    /*mainPaymentPageResize();*/
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		var userId = getCookie('userId');
		if(userId) {
			location.href = "create_profile.jsp?resourceAppId=" + applicationId + "&userId=" + userId;
		} else {
			location.href = "create_profile.jsp?resourceAppId=" + applicationId;
		}
		return;
	});
}

/********************************************************************************************
 ' Name                 :   moveToLoginPage
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   Function is used to redirect to home page.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   21st June, 2013    -   Karuna Mishra
 '*******************************************************************************************/
function moveToLoginPage() {
	location.href = 'home.jsp?resourceAppId=' + applicationId;
/*	var fundingSourceTypes_JsonType = "";
	if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			location.href = 'home.jsp?resourceAppId=' + applicationId;
		}
	}else{
		location.href = 'home.jsp?resourceAppId=' + applicationId;
	}	    mainPaymentPageResize();
	$('#clearOnClickBtn').unbind( "click" );
	$('#clearOnClickBtn').click(function(event){
		location.href = 'home.jsp?resourceAppId=' + applicationId;
	});*/
}

/********************************************************************************************
 ' Name                 :   moveToLoginOnSessionTimeOut
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   Function is used to redirect to home page on Session time out.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th June, 2013    -   Karuna Mishra
 '*******************************************************************************************/
function moveToLoginOnSessionTimeOut() {
    deleteAllCookies();
    location.href = 'home.jsp?resourceAppId=' + applicationId + "&" + "timeOut=True";
}

/********************************************************************************************
 ' Name                 :   changeSectionHeight
 ' Return type          :
 ' Input Parameter(s)   :   errorDivId
 ' Purpose              :   To change the screen height when inline error message comes up.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   27 June 2013    -   Karuna Mishra
 '*******************************************************************************************/
function changeSectionHeight(rowBoxDivId, errorDivId) {
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
        if ($(".error_red_border").is(":visible")) {
            $('#' + errorDivId).show();
        }

        /* Change section height as it might be possible that an error is shown in div */
        if (!(navigator.userAgent).match(/Android/i)) {
            var frameHeight = getContainerHeight();
            $('#' + rowBoxDivId).css("height", getFrameHeightWithErrorForMobile(frameHeight, errorDivId));
        }
    }
}

/********************************************************************************************
 ' Name                 :   getFrameHeightWithErrorForMobile
 ' Return type          :
 ' Input Parameter(s)   :   frameHeight, errorMsgDivId
 ' Purpose              :   To get the frame size for screen to be drawn when error msg is shown or hide.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28 June 2013    -   Karuna Mishra
 '*******************************************************************************************/
function getFrameHeightWithErrorForMobile(frameHeight, errorMsgDivId) {
    if ($('#' + errorMsgDivId).is(":visible")) {
        var errMobDivSec = $('#' + errorMsgDivId).outerHeight(true);
        return (frameHeight - errMobDivSec);
    }
    return frameHeight;
}

/********************************************************************************************
 ' Name                 :   showProgressBar
 ' Return type          :
 ' Input Parameter(s)   :
 ' Purpose              :   To show the progress bar.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28 June 2013    -   Ravi Raj
 '*******************************************************************************************/
function showProgressBar() {
    if (!$('#progbarId').is(":visible")) {
        $('#progbarId').show();
    }
}

/********************************************************************************************
 ' Name                 :   hideProgressBar
 ' Return type          :
 ' Input Parameter(s)   :
 ' Purpose              :   To hide the progress bar.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28 June 2013    -   Ravi Raj
 '*******************************************************************************************/
function hideProgressBar() {
    if ($('#progbarId').is(":visible")) {
        $('#progbarId').hide();
    }
}


/**
 * Utility method to get the round number with or without $ (DOLLAR) symbol.
 * @param unformatedNumber
 * @param add_DOLLAR_SYMBOL
 * @returns round and formated number
 * @author pradeepy
 */
function getFormatedNumber(unformatedNumber, add_DOLLAR_SYMBOL) {
    unformatedNumber += ""; /*  convert number into String to check dollar symbol */
    if (unformatedNumber === "") {
        return 0;
    }
    if (add_DOLLAR_SYMBOL) {
        return DOLLAR_SYMBOL +
                displayDefaultDecimalNumber(Math.round((parseFloat(removeDollerSign(unformatedNumber)) ) *
                                                               Math.pow(10, 2)) / Math.pow(10, 2).toFixed(2));
    }
    return Math.round((parseFloat(removeDollerSign(unformatedNumber)) ) * Math.pow(10, 2)) / Math.pow(10, 2).toFixed(2);
}

/********************************************************************************************
 ' Name                 :   formatLocatorPhoneNumber
 ' Return type          :   String
 ' Input Parameter(s)   :   String fieldValue
 ' Purpose              :   This method is used to show to formatted phone number in infowindow
 map section.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -  12th June, 2013    -   Ravi Raj
 '*******************************************************************************************/
function formatLocatorPhoneNumber(fieldValue) {
    if (fieldValue) {
        var start = fieldValue.substring(0, 3);
        var mid = fieldValue.substring(3, 6);
        var end = fieldValue.substring(6);
        return start + '-' + mid + '-' + end;
    }
    return fieldValue;
}

/**
 * Get numbers between 0-9 from given string and string of numbers
 * @param phoneNumber
 * @returns {String}
 */
function getNumberFromString(userInputString) {
    if (userInputString) {
        /* Removing the extra char symbols the fieldValue should not be blank */
        userInputString = userInputString.replace(/\W+/g, '');
    }
    return userInputString;
}

/********************************************************************************************
 ' Name                 :   printSaveEmailPDF
 ' Return type          :   none
 ' Input Parameter(s)   :   cartId, cartCreatedDate, pdfAction, billpayAccountId
 ' Purpose              :   This method is used to Print, Save or Email PDF.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   18 July 2013   -   pradeepy
 '*******************************************************************************************/
function printSaveEmailPDF(cartId, cartCreatedDate, pdfAction, billpayAccountId) {
    var userId = eval(getCookie("userId"));
    var locale = getCookie("locale");
    var cartDate = cartCreatedDate;
    var pdfValueSeprator = "|";

    var url = window.location.href.split('/');
    var apiBaseUrl = url[0] + '//' + url[2];

    var requestQueyString = userId + pdfValueSeprator + applicationId + pdfValueSeprator + locale + pdfValueSeprator +
            cartId + pdfValueSeprator + cartDate + pdfValueSeprator + apiBaseUrl;
    var encodedRequestQueyString = Base64.encode(requestQueyString);

    var pdfServletURL = (document.URL.substr(0, document.URL.indexOf("/", document.URL.indexOf("/", document.URL.indexOf("//") + 
    					2) + 1))) + "/paymentReceiptPdf";

    /* Email related code starts */ 
    if ("EMAIL" === pdfAction) {
        var finalContent = "\n" + messages['paymentReceipt.urlPdf'] + " \n";

        if (billpayAccountId) {
            encodedRequestQueyString += "&billpayAccountId=" + billpayAccountId;
        }
        var completeURL = pdfServletURL + "?apiEncodedRequest=" + encodedRequestQueyString;
        finalContent += messages['paymentReceipt.receiptMsg'] + "  " + completeURL + " \n ";
        finalContent += " \n \n " + messages['paymentReceipt.footerText'] + " \n ";
        window.location.href = "mailto:" + user_get_profile_obj.user.email + "?subject=" + messages['paymentReceipt.pmtrcpt'] +
        					   "&body=" + encodeURIComponent(finalContent);
        return;
    }
    /* End Email related Code */ 
    if (pdfAction && encodedRequestQueyString) {
        var inputs = '<input type="hidden" name="pdfAction" value="' + pdfAction + '" />';
        if (billpayAccountId) {
            inputs += '<input type="hidden" name="billpayAccountId" value="' + billpayAccountId + '" />';
        }
        inputs += '<input type="hidden" name="apiEncodedRequest" value="' + encodedRequestQueyString + '" />';

        jQuery('<form action="' + pdfServletURL + '" method="post" target="_blank">' + inputs +
                       			'</form>').appendTo('body').submit().remove();
        return false;
    }
}

/********************************************************************************************
 ' Name                 :   deleteCookieForGuestUser
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   Delete cookie when guest user is login.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   20 July 2013   -   Karuna Mishra
 '*******************************************************************************************/
function deleteCookieForGuestUser() {
    setCookie("sessionToken", "");
    setCookie("userId", "");
    setCookie('userName', "");
    localStorage.setItem("registerUser", "");
    setCookie("isLocatorLoaded", "");
    setCookie("isCreateProfileLoaded", "");
    setCookie('isUserChangeLanguageLogin', "");
}

/********************************************************************************************
 ' Name                 :   clearIntervalApp
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   Clear the interval.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   2 August 2013   -   Karuna Mishra
 '*******************************************************************************************/
function clearIntervalApp(countDown) {
    clearInterval(countDown);
}

/********************************************************************************************
 ' Name                 :   replaceUnUsedChar
 ' Return type          :   strFieldName
 ' Input Parameter(s)   :   strFieldName
 ' Purpose              :   Remove the specified special character from the input fields.
 ' History Header       :   Version   -   Date          -   Developer Name
 ' Added By             :   1.0       -   8 August 2013   -   Karuna Mishra
 '*******************************************************************************************/
function replaceUnUsedChar(strFieldName) {
    var fieldValue = '';
    if (strFieldName && $('#' + strFieldName).val()) {
        fieldValue = $('#' + strFieldName).val().trim();
    }
    if (fieldValue) {
        if (strFieldName === "21") {
            fieldValue = fieldValue.replace(/[\s\<\>\;\&\/]/g, '');
        } else {
            fieldValue = fieldValue.replace(/[\<\>\;\&\/]/g, '');
        }
    }
    return fieldValue;
}

/********************************************************************************************
 ' Name                 :   showHideButtons
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for show or hide the buttons in Main Payment
 '                            Page based on features enabled from INIT_APP API.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   18th, June 2013    -   Karuna Mishra
 '*******************************************************************************************/
function showHideButtons() {
    $("#mobileRadioOptions").hide();
    if (!initAppFeatureName["CHECKOUT"]) {
        $("#userIcon").removeClass("acc_img_icon").addClass("refresh_btn").show();
        if (initAppFeatureName["LOAD_WALLET_BLACKHAWK"]) {
            $("#add_money_tag").show();
            /*$("#mobMoreAddMonyLink").show();*/
        }
        if (initAppFeatureName["ACCOUNT_REGISTRATION"]) {
            $("#showBalanceDetail").show();
        }
    }
    else {
        $("#userIcon").removeClass("refresh_btn").addClass("acc_img_icon").show();
    }

    if (initAppFeatureName["ACCOUNT_REGISTRATION"]) {
        $("#profile_tag").show();
    }

    if (initAppFeatureName["LOCATOR"]) {
        /* show locator footer on mobile. */ 
        $("#locator_tag").show();
    } else {
        /* change css */ 
        $(".wd_mob_foot").each(function () {
            $(this).removeClass("wd_mob_foot").addClass("wd_mob_foot1");
        });
    }

    if (parseBoolean(localStorage.getItem("registerUser"))) {
        $('#myAccountBox').show();
        $('#guestUserMyAccountBox').hide();
    } else {
        $('#guestUserMyAccountBox').show();
        $('#slide-wrap').hide();
    }
}

/********************************************************************************************
 ' Name                 :   setExtraMarginForAndroid
 ' Return type          :   void
 ' Input Parameter(s)   :   elementId
 ' Purpose              :   This method is used to add extra space at bottom for android only.
 ' History Header       :   Version   -   Date               -   Developer Name
 ' Added By             :   1.0       -   5th September, 2013  -   Ravi Raj
 '*******************************************************************************************/
function setExtraMarginForAndroid(elementId) {
    if ((navigator.userAgent).match(/Android/i)) {
        var footerHeight = $(".footer").outerHeight(true);
        var newMargin = footerHeight * 5;
        $('#' + elementId).attr('style', 'margin-bottom: ' + newMargin + 'px !important');
    }
}

/********************************************************************************************
 ' Name                 :   languageDropDownForIE8
 ' Return type          :   void
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used for change language for IE-8 browser.
 ' History Header       :   Version   -   Date               -   Developer Name
 ' Added By             :   1.0       -   27th, August 2013  -   Pradeep Yadav
 '*******************************************************************************************/
function languageDropDownForIE8() {
    if (navigator.appVersion.match(/MSIE [\d.]+/) == "MSIE 8.0") {
        $(".picker").click(function (b) {
            b.preventDefault();
            var b = $(this), a = null;
            if ("handheld" === window.getComputedStyle(b.get(0),
                                                       ":after").getPropertyValue("content")) {
                return !1;
            }
            b.hover(function () {
                clearTimeout(a);
            }, function () {
                var b = $(this);
                a = setTimeout(function () {
                    b.removeClass("open");
                }, 500);
            });
            b.toggleClass("open");
        });
    }
}

/********************************************************************************************
 ' Purpose              :   This method is used if getComputedStyle method is not supported by the browser.
 ' History Header       :   Version   -   Date               -   Developer Name
 ' Added By             :   1.0       -   27th, August 2013  -   Pradeep Yadav
 '*******************************************************************************************/
if (!window.getComputedStyle) {
    window.getComputedStyle = function (el, pseudo) {
        this.el = el;
        this.getPropertyValue = function (prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') {
                prop = 'styleFloat';
            }
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
    };
}

/**
 * Remove the dolor sign from the amount.
 * @param dataString
 */
function removeDollerSign(dataString) {
    if (dataString.indexOf('$') != -1) {
        return dataString.split('$')[1];
    }
    return dataString;
}

/**
 * To show the default decimal value for amount paid by the user.
 * @param inputAmount
 */
function displayDefaultDecimalNumber(inputAmount) {
    var strData = "" + inputAmount;
    if (strData.indexOf('.') != -1) {
        var decimalNUmber = strData.split('.')[1];
        if (decimalNUmber.length != null && decimalNUmber.length === 1) {
            return amount = inputAmount + "0";
        } else if (decimalNUmber.length != null && decimalNUmber.length > 1) {
            return amount = inputAmount;
        } else {
            return amount = inputAmount + "00";
        }
    } else {
        return amount = inputAmount + ".00";
    }
}

/**
 * On click of SignOut button,Redirect the page to Login page.
 */
function loadIndexPage() {
	if(intervalForServiceFee){
		clearIntervalApp(intervalForServiceFee);
	}
	var fundingSourceTypes_JsonType="";
	if($('#editCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("editCardForm");
		if(isEditCardFieldsChanged(fundingSourceTypes_JsonType)){
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		} else {
			disableButton("sign_out_tag");

			/* On the signOut button delete the all cookies except locale and localeindex. */
			deleteAllCookies();
			moveToLoginPage();
			enableButton("sign_out_tag");
		}
	}else if($('#addPaymentCardForm').is(':visible')){
			fundingSourceTypes_JsonType = getFundingSource("addPaymentCardForm");
		if(isValueInAddCardFormFields("addCardForm" + fundingSourceTypes_JsonType)) { 
			showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
		}else {
			disableButton("sign_out_tag");

            /* On the signOut button delete the all cookies except locale and localeindex. */
            deleteAllCookies();
            moveToLoginPage();
            enableButton("sign_out_tag");
        }
    } else if ($('#edit_profile_area').is(':visible')) {
        if (isEditProfileFieldsChanged()) {
            showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
        } else {
            disableButton("sign_out_tag");

            /* On the signOut button delete the all cookies except locale and localeindex. */
            deleteAllCookies();
            moveToLoginPage();
            enableButton("sign_out_tag");
        }
    } else if ($('#edit_profile_security_area').is(':visible')) {
        if (isUserSecurityFieldsChanged()) {
            showAnimatedPopup('editCardOnManagesCard', 'editcardCredPopUp');
        } else {
            disableButton("sign_out_tag");

            /* On the signOut button delete the all cookies except locale and localeindex. */
            deleteAllCookies();
            moveToLoginPage();
            enableButton("sign_out_tag");
        }
    } else {
        disableButton("sign_out_tag");

        /* On the signOut button delete the all cookies except locale and localeindex. */
        deleteAllCookies();
        moveToLoginPage();
        enableButton("sign_out_tag");
    }
    /*mainPaymentPageResize();*/
    $('#clearOnClickBtn').unbind("click");
    $('#clearOnClickBtn').click(function (event) {
        disableButton("sign_out_tag");

        /* On the signOut button delete the all cookies except locale and localeindex. */
        deleteAllCookies();
        moveToLoginPage();
        enableButton("sign_out_tag");
    });
}

/********************************************************************************************
 ' Name                 :   isSessionTimedOut
 ' Return type          :
 ' Input Parameter(s)   :
 ' Purpose              :   Tests for a timeout, returns true if the session did expire.
 ' History Header       :   Version   -   Date            -   Developer Name
 ' Added By             :   1.0       -   16 Sep 2013    -   Karuna Mishra
 '*******************************************************************************************/
function isSessionTimedOut() {
    var apiLoginSessionTimeOutTime = getCookie("apiLoginSessionTimeOutTime") * 1;
    if (!apiLoginSessionTimeOutTime || apiLoginSessionTimeOutTime <= 0) {
        return false; /* if this value isn't set, then the user isn't logged in. */ 
    }
    var time = new Date().getTime();
    var isTimedOut = apiLoginSessionTimeOutTime - 20000 <= time;
    return isTimedOut;
}

/********************************************************************************************
 ' Name                 :   startSessionTimeoutTimer
 ' Return type          :
 ' Input Parameter(s)   :
 ' Purpose              :   Tests for a timeout, returns true if the session did expire,
 '                            and then redirect to login is requested..
 ' History Header       :   Version   -   Date            -   Developer Name
 ' Added By             :   1.0       -   16 Sep 2013    -   Karuna Mishra
 '*******************************************************************************************/
function startSessionTimeoutTimer() {
    var isTimedOut = isSessionTimedOut();
    /* if session is not less than 0 */
    if (isTimedOut) {
        setCookie("apiLoginSessionTimeOutTime", "");
        moveToLoginOnSessionTimeOut();
        return false;
    } else {
        /* call the function again after 1 second delay */
        window.setTimeout("startSessionTimeoutTimer()", 1000);
        return true;
    }
}

/********************************************************************************************
 ' Name                 :   checkSessionTimeOutAndCookie
 ' Return type          :   true if the session was timed-out and requested to move to login.
 ' Input Parameter(s)   :
 ' Purpose              :   Function is used for handling the api session timeout.
 ' History Header       :   Version   -   Date                -   Developer Name
 ' Added By             :   1.0       -   28 June 2013    -   Karuna Mishra
 '*******************************************************************************************/
function checkSessionTimeOutAndCookie() {
    var isTimedOut = isSessionTimedOut();
    if (isTimedOut) {
        moveToLoginOnSessionTimeOut();
        return true;
    }
    return false;
}

/********************************************************************************************
 ' Name                 :   langSelection
 ' Return type          :   None
 ' Input Parameter(s)   :   locale,selectedIndex
 ' Purpose              :   Select the language of page using select locale option.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   17th Nov,2012      -   Karuna Mishra
 '*******************************************************************************************/
function langSelection(locale, selectedIndex) {
    setCookie('locale', locale, 365);
    setCookie('localeIndex', selectedIndex, 365);

    var pathName = $(location).attr('pathname');
    if (pathName.indexOf('create_profile.jsp') !== -1) {
        /* create JS object and Store Data into Object. */ 
        var propertyFilledByUser = new Object();

        if (createAccountFlag) {
            propertyFilledByUser.userName = $('#emailPrompt').val();
        } else {
            propertyFilledByUser.userName = $('#username').val();
        }
        propertyFilledByUser.password = $('#password').val();
        propertyFilledByUser.reEnterPassword = $('#passwordReEentry').val();
        propertyFilledByUser.zip = $('#zipCodePrompt').val();
        propertyFilledByUser.email = $('#emailPrompt').val();
        propertyFilledByUser.reEnterEmail = $('#reEnterEmail').val();
        propertyFilledByUser.mobilePhone = $('#phonePrompt').val();
        propertyFilledByUser.answer = $('#securityAnswerforCreateAct').val();
        propertyFilledByUser.chkBoxStatus = $('#chkAcceptTermsCreate').is(':checked');
        propertyFilledByUser.securityQuestion = $('#securityQuestionforCreateAct :selected').index();

        /* Convert object into String and Encode into Base64 String. */ 
        localStorage.setItem("createProfileFormData", Base64.encode(JSON.stringify(propertyFilledByUser)));
        setCookie("isUserChangeLanguageCreateProfile", "true");
        localStorage.setItem("loginSessionTimeoutMs", "");
        localStorage.setItem("init_app_currentterms_id", "");
        localStorage.setItem("count", "");
        location.href = 'create_profile.jsp?resourceAppId=' + applicationId;
    } else {
        setCookie('isUserChangeLanguageLogin', true);

        /* create JS object and Store Data into Object. */ 
        var propertyFilledByUser = new Object();
        propertyFilledByUser.userName = $('#login_txt').val();

        /* Convert object into String and Encode into Base64 String. */ 
        localStorage.setItem("loginFormData", Base64.encode(JSON.stringify(propertyFilledByUser)));

        moveToLoginPage();
    }
}

/*******************************************************************************************
 ' Name                 :   createOptInMsgAorBSection
 ' Return type          :   None
 ' Input Parameter(s)   :   chkboxId, spanId, optInMarketingMsg
 ' Purpose              :   Function is used to create the marketing option section area.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th Feb, 2014       -   Umamaheswara Rao
 '*******************************************************************************************/
function createOptInMsgAorBSection(chkboxId, spanId, optInMarketingMsg) {
    /* Show the check box for marketing Opt in */
    var argOfOpt0 = '<a href="javascript:void(0)" onclick="showMrktOptInUrl(true)">';
    var argOfOpt1 = '</a>';
    var message = formatMessage(optInMarketingMsg, argOfOpt0, argOfOpt1);
    $('#' + spanId).html(message);
    if (user_get_profile_obj && user_get_profile_obj.marketingOptIn === true) {
        $('#' + chkboxId).prop('checked', true);
    }
}

/*******************************************************************************************
 ' Name                 :   fillDataFromUserGetProfileObject
 ' Return type          :   None
 ' Input Parameter(s)   :   emailFieldId, reEmailFieldId, mobileFieldId, zipcodeFieldId
 ' Purpose              :   Function is used to pre fill the data from user info object to fields.
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   10th Feb, 2014       -   Umamaheswara Rao
 '*******************************************************************************************/
function fillDataFromUserGetProfileObject(emailFieldId, reEmailFieldId, mobileFieldId, zipcodeFieldId) {
    if (user_get_profile_obj) {
        $('#' + emailFieldId).val(user_get_profile_obj.email);
        $('#' + reEmailFieldId).val(user_get_profile_obj.email);
        $('#' + mobileFieldId).val(user_get_profile_obj.phone);
        $('#' + zipcodeFieldId).val(user_get_profile_obj.zip);
    }
}

/*******************************************************************************************
 ' Name                 :   loadCreateAccountPageFromLogin
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   Function is used to load the create account page when user click
 on the sign up button from login page.
 ' History Header       :   Version   -   Date              -   Developer Name
 '*******************************************************************************************/
function loadCreateAccountPageFromLogin(appId) {
    deleteUserIdCookie();
    location.href = "create_profile.jsp?resourceAppId=" + appId;
    return false;
}

/**
 * For Scrolling (Need to do some work to improve scrolling etc.)
 */
jQuery.fn.oneFingerScroll = function () {
    var scrollStartPos = 0;
    $(this).bind('touchstart', function (event) {
        /* jQuery clones events, but only with a limited number of properties for perf reasons. Need the original event to get 'touches' */ 
        var e = event.originalEvent;
        scrollStartPos = $(this).scrollTop() + e.touches[0].pageY;
    });
    $(this).bind('touchmove', function (event) {
        var e = event.originalEvent;
        $(this).scrollTop(scrollStartPos - e.touches[0].pageY);
        e.preventDefault();
    });
    return this;
};

jQuery.fn.horizontalScroll = function () {
    var scrollStartLeft = 0;
    $(this).bind('touchstart', function (event) {
        /* jQuery clones events, but only with a limited number of properties for perf reasons. Need the original event to get 'touches' */ 
        var e = event.originalEvent;
        scrollStartLeft = $(this).scrollLeft() + e.touches[0].pageX;
    });
    $(this).bind('touchmove', function (event) {
        var e = event.originalEvent;
        $(this).scrollLeft(scrollStartLeft - e.touches[0].pageX);
        e.preventDefault();
    });
    return this;
};

function createSocialMediaSec() {
    var socialMediaSec = "";
    var windowsize = $(window).width();
    if (windowsize <= minimumWindowWidthForMobile) {
        socialMediaSec = '<div class="mob_fbalgn">'
                		 + $("#fb_mobile").html() ? $("#fb_mobile").html() : ''
                		 + '</div>';
    } else {
        socialMediaSec = '<div class="flt_rght">'
                         + $("#fb_social").html() ? $("#fb_social").html() : ''
                         + '</div>';
    }
    return socialMediaSec;
}

function setUtmDataFromQueryStringToCookie(utmSource, utmCampaign) {
    if (utmSource) {
        setCookie("utmSource", utmSource);
    }
    if (utmCampaign) {
        setCookie("utmCampaign", utmCampaign);
    }
}

/********************************************************************************************
 ' Name                 :   showScreenAndSetHeight
 ' Return type          :   None
 ' Input Parameter(s)   :   String mainContainerId, String subContainerId
 ' Purpose              :   This method is used to show the evry page main screen and to set
 '                            the calculted height to the container section of that page.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   07 Apr 2014    -   Ravi Raj
 '*******************************************************************************************/
function showScreenAndSetHeight(mainContainerId, subContainerId) {
    removeHomeScreenArea();
    /* Chekcing if the page main container id presents then show the page */
    if (mainContainerId) {
        $('#' + mainContainerId).show();
    }
    if (subContainerId) {
        /* Setting the height to container section of the page */
        $('#' + subContainerId).css("height", getContainerHeight());
    }
}

/********************************************************************************************
 ' Name                 :   removeHomeScreenArea
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used to remove or hide all the pages from screen.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   07 July 2013    -   Ravi Raj
 '*******************************************************************************************/
function removeHomeScreenArea() {
    $('#loginContainerDiv').hide();
    $('#pay_bill_sec').hide();
    $('#billerSearchInner').hide();
    $('#addEditBillerInner').hide();
    $("#addEditBillerAuxiliaryContainer").hide();
    $('#checkoutContainer').hide();
    $('#checkoutShowPaymentDetailView').hide();
    $('#editProfileContainer').hide();
    $('#profileContainer').hide();
    $('#editProfileSecurityContainer').hide();
    $('#manageCardsMainContainer').hide();
    $('#paymentHistoryInner').hide();
    $('#showSummaryView').hide();
    $('#showDetailView').hide();
    $('#mobileMoreContainer').hide();
    /* Hide the social media section whenever screens are removed from main_payment_page */
    $("#fb_social").hide();
    $("#fb_mobile").hide();
    removeVisiblePopUp();
}

/********************************************************************************************
 ' Name                 :   removeVisiblePopUp
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used to remove visible pop up.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   07 July 2013    -   Ravi Raj
 '*******************************************************************************************/
function removeVisiblePopUp() {
    if ($('.cred_popup').is(':visible') && $('.popupContainer').is(':visible')) {
        var containerID = "";
        var popUpId = "";
        $(".cred_popup:visible").each(function () {
            containerID = $(this).attr('id');
        });
        $(".popupContainer:visible").each(function () {
            popUpId = $(this).attr('id');
        });
        closeAnimatedPopup(popUpId, containerID);
    }
}

/********************************************************************************************
' Name                 :   setMarketingFrameOfLoginSignUp
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to set the marketing frame.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   07 July 2013    -   Ravi Raj
'*******************************************************************************************/
function setMarketingFrameOfLoginSignUp() {
    var url = messages['createAccount.image.desktop'];
    var windowWidth = $(window).width();
    if (windowWidth <= minimumWindowWidthForMobile) {
        url = messages['createAccount.image.mobile'];
    }
    $('#signUpImageLogin').attr('src', url);
}

/********************************************************************************************
 ' Name                 :   myAccountSwiping
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used to swipe on click of activity button.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   20 July 2014    -   Mohit Arya
 '****************************************************************************************** */
function myAccountSwiping(evt) {
    if ($('.wrapper_area').hasClass("lft0")) {
        $('.wrapper_area').addClass('lftAuto').removeClass('lft0').css('right', '0');
    } else {
        $('.wrapper_area').addClass('lft0');
    }
    if ($('.wrapper_area').css("right") == "270px") {
        $('.wrapper_area').animate({"right": '-=270'});
        /* $('#accountInfoId').removeClass('blockImp'); */ 
        swipeCount = 0;
    } else {
        $('.wrapper_area').removeClass("lft0").addClass('lftAuto').animate({"right": '+=270'});
        $('#accountInfoId').addClass('blockImp');
        swipeCount = 1;
    }
    calcHeightAndUpdateBills();
    evt.preventDefault();
}

/********************************************************************************************
 ' Name                 :   mobileSwipe
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method is used to swipe page in mobile.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   20 July 2014    -   Mohit Arya
 '****************************************************************************************** */
function mobileSwipe() {
    $.browser.device =
            (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()) );
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    $(document).swipe({
                          swipeLeft: function (event, direction, distance, duration, fingerCount) {

                              if (($('#activityIcon').is(":visible") && $.browser.device &&
                                      ($('.container').outerWidth(true) < 1024 && duration > 150 && distance > 75 ))) {
                                  if (swipeCount === 0) {
                                      myAccountSwiping(event);
                                      swipeCount = 1;
                                  }
                              } else {
                                  /* evt.preventDefault(); */
                              }
                          },
                          swipeRight: function (event, direction, distance, duration, fingerCount) {
                              if (($('#activityIcon').is(":visible") && $.browser.device &&
                                      ($('.container').outerWidth(true) < 1024 && duration > 150 && distance > 75 ))) {
                                  if (swipeCount === 1) {
                                      myAccountSwiping(event);
                                      swipeCount = 0;
                                  }
                              } else {
                                  /* evt.preventDefault(); */
                              }
                          },
                          click: function (event, target) {
                              if (iOS) {
                                  $(target).click();
                              }
                          }
                      });

}

/********************************************************************************************
' Name                 :   amountDueExpand
' Return type          :   None
' Input Parameter(s)   :   containerID, arrowID
' Purpose              :   This method is used to expand the amount due section of sumamry.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function amountDueExpand(containerID, arrowID) {
    $('#' + containerID).slideToggle('slow', function () {
        if ($('#' + containerID).is(':visible')) {
            $('#' + arrowID).hide();
            return;
        }
        $('#' + arrowID).show();
    });
    refreshScrollForBillers();
}

/********************************************************************************************
' Name                 :   amountDueExpandForSummarySection
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to Expand and collapse of summary check out.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function amountDueExpandForSummarySection() {
	$('#sel_pay_container1').slideToggle('slow', function() {
		if($('#sel_pay_container1').is(':visible')) {
			$('#idOfAmountChargeToday').show();
			$('#newCreditsApplied').show();
			$('#amountAdded').show();
			$('#amountDueArrow1').hide();
			updateNewCreditsArea();
			return;
		}
		$('#idOfAmountChargeToday').hide();
		$("#newCreditsApplied").hide();
		$('#amountDueArrow1').show();
		$('#newCreditsApplied').hide();
		$('#amountAdded').hide();
	});
}

/********************************************************************************************
' Name                 :   seeMoreDetails
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used bring up show more details on to page.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function seeMoreDetails(){
	if(!$('#sel_pay_container1').is(':visible')) {
		$('#sel_pay_container1').slideDown('slow', function() {
				$('#idOfAmountChargeToday').show();
				$('#newCreditsApplied').show();
				$('#amountAdded').show();
				$('#amountDueArrow1').hide();
				updateNewCreditsArea();
				return;
		});
	}
}

/********************************************************************************************
' Name                 :   mobileKeyboardFooterToggle
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to toggle the key board in mobile.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function mobileKeyboardFooterToggle() {
    if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
        $('html').addClass('ipad ios7');
    }

    /* hide footer on mobile when inputs are focused */ 
    var is_keyboard = false;
    var initial_screen_size = window.innerHeight;
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.addEventListener("resize", function () {
            is_keyboard = (window.innerHeight < initial_screen_size);
            is_phone = (screen.height < 400);
            updateForKeyboard();
        }, false);
    }

    function updateForKeyboard() {
        if (is_keyboard || is_phone) {
            $(".footer").hide();
        } else {
            $(".footer").show();
        }
    }

    /* hide html footer for iOS wrapper */ 
    var standalone = window.navigator.standalone,
            userAgent = window.navigator.userAgent.toLowerCase(),
            safari = /safari|firefox|chrome|opera|msie|windows/.test(userAgent);
    if (!standalone && !safari) {
        $(".footer").css('visibility', 'hidden');
    }
}

/********************************************************************************************
 ' Name                 :   validatePinLunhForAddCardForm
 ' Return type          :   Boolean
 ' Input Parameter(s)   :   Pin
 ' Purpose              :   This method is used to validate the Pin number as per the Mod!0 check.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
 '****************************************************************************************** */
function validatePinLunhForAddCardForm(pin) {
	var doubled = [];
	var regex = /^\d{16}$/;
	if(regex.test(pin)){
		for ( var i = pin.length - 2; i >= 0; i = i - 2) {
			doubled.push(2 * pin[i]);
		}
		var total = 0;
		for ( var i = ((pin.length % 2) == 0 ? 1 : 0); i < pin.length; i = i + 2) {
			total += parseInt(pin[i]);
		}
		for ( var i = 0; i < doubled.length; i++) {
			var num = doubled[i];
			var digit;
			while (num != 0) {
				digit = num % 10;
				num = parseInt(num / 10);
				total += digit;
			}
		}
		return total % 10 == 0 ? !0 : !1;
	} else {
		return !1;
	}
}

/********************************************************************************************
 ' Name                 :   convertTimeToPST
 ' Return type          :   miliseconds
 ' Input Parameter(s)   :   miliseconds
 ' Purpose              :   This method will calculate the difference in Time Zones.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
 '****************************************************************************************** */
function convertTimeToPST(miliseconds) {
    var utcAndPstDifferecne = -420 * 60000;
    /* in milliseconds */
    /* Getting the time difference between current time zone and UTC time zone */
    var utcAndCurrentDifference = new Date().getTimezoneOffset() * 60000;
    /* in milliseconds */
    var differenceBetweenTwo = utcAndPstDifferecne + utcAndCurrentDifference;
    return miliseconds + differenceBetweenTwo;
}

/********************************************************************************************
' Name                 :   convertToDateddmmFormat
' Return type          :   month, day, year
' Input Parameter(s)   :   deliveryDate
' Purpose              :   This method is used to display MM/DD/YYYY format.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   1st APR, 2014    -   Umamaheswara Rao
'*******************************************************************************************/
function convertToDateddmmFormat(deliveryDate) {
    if (deliveryDate != null) {
        var currentTime = new Date(deliveryDate);
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        return (month + "/" + day+"/"+year);
    }
}

/********************************************************************************************
' Name                 :   convertToDate
' Return type          :   month and date
' Input Parameter(s)   :   miliseconds
' Purpose              :   This method will calculate month and date using milli seconds.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function convertToDate(deliveryDate) {
	if (deliveryDate != null) {
    	var months = ['Jan','Feb','Mar','Apr','May',
    	              'Jun','Jul','Aug','Sep',
    	              'Oct','Nov','Dec'];
        var currentTime = new Date(deliveryDate);
        var month = months[currentTime.getMonth()];
        var day = currentTime.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return (month + " " + day);
    }
}

/********************************************************************************************
' Name                 :   isSameDay
' Return type          :   month and date
' Input Parameter(s)   :   aDate, bDate
' Purpose              :   This method will check the day is same or not.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
'****************************************************************************************** */
function isSameDay(aDate, bDate) {
    var aDateObj = new Date(aDate);
    var bDateObj = new Date(bDate);

    if (aDateObj.getFullYear() < 1980) {
        throw new DOMException("improper usage of isSameDay - pass in full date object for example: new Date() NOT new Date().getDate()");
    }


    if (bDateObj.getFullYear() < 1980) {
        throw new DOMException("improper usage of isSameDay - pass in full date object for example: new Date() NOT new Date().getDate()");
    }

    return aDateObj.getFullYear() == bDateObj.getFullYear() &&
            aDateObj.getMonth() == bDateObj.getMonth() &&
            aDateObj.getDate() == bDateObj.getDate();
}

/********************************************************************************************
 ' Name                 :   convertToDatemmddyy
 ' Return type          :   convertedDate
 ' Input Parameter(s)   :   deliveryDate
 ' Purpose              :   This will convert the date from milisec to object format.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   07 Apr 2014    -   Ravi Raj
 '*******************************************************************************************/
function convertToDatemmddyy(deliveryDate) {
    var convertedDate = new Object();
    if (deliveryDate != null) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                      'Jun', 'Jul', 'Aug', 'Sep',
                      'Oct', 'Nov', 'Dec'];
        var currentTime = new Date(deliveryDate);
        convertedDate.month = months[currentTime.getMonth()];
        convertedDate.year = currentTime.getFullYear();
        convertedDate.day = currentTime.getDate();
        if (convertedDate.day < 10) {
            convertedDate.day = "0" + convertedDate.day;
        }
    }
    return convertedDate;
}

/********************************************************************************************
 ' Name                 :   convertToDatemmddyyForHistory
 ' Return type          :   None
 ' Input Parameter(s)   :   deliveryDate
 ' Purpose              :   This will convert the date from milisec to mmm dd, yyyy format.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   07 Apr 2014    -   Ravi Raj
 '*******************************************************************************************/
function convertToDatemmddyyForHistory(deliveryDate) {
    if (deliveryDate != null) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
                      'Jun', 'Jul', 'Aug', 'Sep',
                      'Oct', 'Nov', 'Dec'];
        var currentTime = new Date(deliveryDate);
        var month = months[currentTime.getMonth()];
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        if (day < 10) {
            day = "0" + day;
        }
        return (month + " " + day + ", " + year);
    }
}

/********************************************************************************************
 ' Name                 :   setHeightForCloseBtnPopup
 ' Return type          :   None
 ' Input Parameter(s)   :   None
 ' Purpose              :   This method will set the height for the comfirmation popup that has scrollbar.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   20 July 2014    -   Mohit Arya
 '****************************************************************************************** */
function setHeightForCloseBtnPopup() {
    /*getting the current page height*/
    var pageHeight = $(window).outerHeight(true);
    $('#confirmationPopupId').css('max-height', (pageHeight * (65 / 100)));
    /* less than cred_popup max height */
    $('#confirmationErrorPopupId').css('max-height', (pageHeight * (65 / 100)));
    /* less than cred_popup max height */
}

/********************************************************************************************
 ' Name                 :   restartTimerForSlideDown
 ' Return type          :   none
 ' Input Parameter(s)   :   none
 ' Purpose              :   This method is used to restart the timer for General Slide downs.
 ' History Header       :   Version   -   Date           -   Developer Name
 ' Added By             :   1.0       -   25 Aug 2014    -   UmaMaheswara Rao
 '****************************************************************************************** */
function restartTimerForSlideDown() {
	if($('#showInlineSuccessMessageDiv').is(":visible")) {
		timeOutForSucessSlide = setTimeout(function() { /*calls click event after a certain time */
		closeInlineSuccessMessage('successBackDrop');
		$('#inlineMsgId').empty();
		clearTimeout(timeOutForSucessSlide);
		}, timeForSlide);
	}
		
	if($('#showInlineErrorMessageDiv').is(":visible")) {
		timeOutForErrorSlide = setTimeout(function() { /* calls click event after a certain time */
		closeInlineErrorMessage('errorBackDrop');
		$('#inlineMsgId').empty();
		clearTimeout(timeOutForErrorSlide);
		}, timeForSlide);
	}
	
	if($('#generalSuccessNotificationForAddCard').is(":visible")) {
		timeOutForSucessSlide = setTimeout(function() { /* calls click event after a certain time */
		disolvePopup('generalSuccessNotificationForAddCard');
		clearTimeout(timeOutForSucessSlide);
		}, timeForSlide);
	}
	
	if($('#generalErrorNotificationForAddCard').is(":visible")) {
		timeOutForErrorSlide = setTimeout(function() { /* calls click event after a certain time */
		disolvePopup('generalErrorNotificationForAddCard');
		clearTimeout(timeOutForErrorSlide);
		}, timeForSlide);
	}
	
	if($('#sideBarAlertFailureId').is(":visible")) {
		timeOutForSucessSlide = setTimeout(function() { /*calls click event after a certain time */
		disolvePopup('sideBarAlertFailureId');
		clearTimeout(timeOutForSucessSlide);
		}, timeForSlide);
	}
	
	if($('#sideBarAlertSuccessId').is(":visible")) {
		timeOutForSucessSlide = setTimeout(function() { /*calls click event after a certain time */
		disolvePopup('sideBarAlertSuccessId');
		clearTimeout(timeOutForSucessSlide);
		}, timeForSlide);
	}
}

/********************************************************************************************
' Name                 :   showGeneralErrorMsg
' Return type          :   none
' Input Parameter(s)   :   message, elementId
' Purpose              :   This method is used to add Error msg structure to scrollable area.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   5th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function showGeneralErrorMsg(message, elementId) {
	removeMessageFromDivId();
	var structure = getInlineErrorMsg();/* Get the Error message structure */
	getVisibleParentDivId(structure);
	showInlineErrorMessage('errorBackDrop', message, elementId);
}

/********************************************************************************************
' Name                 :   getInlineErrorMsg
' Return type          :   inlineMsg
' Input Parameter(s)   :   none
' Purpose              :   This method is used to create structure for the error msg section.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   5th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function getInlineErrorMsg() {
	var inlineMsg = '<div id="errorBackDrop" class=""></div>'
				  + '<div id="showInlineErrorMessageDiv" class="general_error txt_inv">'
				  + '<div id="inlineMessageDiv" class="submit_text cursor_pntr"></div>'
				  + '<div id="closeInlineMessage" class="general_error_close" onclick="closeInlineErrorMessage(\'errorBackDrop\')"><i class="fa fa-times fa-2x"></i></div>'
				  + '<div class="clear"></div>'
				  + '</div>';
	
	return inlineMsg;
}

/********************************************************************************************
' Name                 :   showGeneralSuccessMsg
' Return type          :   None
' Input Parameter(s)   :   message, elementId
' Purpose              :   This method is used to add success msg in to scrollable area.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   5th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function showGeneralSuccessMsg(message, elementId) {
	removeMessageFromDivId();
	var structure = getInlineSuccessMsg();/* Get the Success message structure */
	getVisibleParentDivId(structure);
	showInlineSuccessMessage('errorBackDrop', message, elementId);
}

/********************************************************************************************
' Name                 :   getInlineSuccessMsg
' Return type          :   inlineMsg
' Input Parameter(s)   :   none
' Purpose              :   This method is used to create success msg and added to srcollable area.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   5th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function getInlineSuccessMsg() {
	var inlineMsg = '<div id="successBackDrop" class=""></div>'
				  + '<div id="showInlineSuccessMessageDiv" class="general_submit txt_inv">'
				  + '<div id="inlineSuccessMessageDiv" class="submit_text cursor_pntr"></div>'
				  + '<div id="closeInlineSuccessMessage" class="general_submit_close" onclick="closeInlineSuccessMessage(\'successBackDrop\')"><i class="fa fa-times fa-2x"></i></div>'
				  + '<div class="clear"></div>'
				  + '</div>';
	return inlineMsg;
}

/********************************************************************************************
' Name                 :   getVisibleParentDivId
' Return type          :   None
' Input Parameter(s)   :   structure
' Purpose              :   This method is used to add success msg in to scrollable area.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   10th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function getVisibleParentDivId(structure){
	$("#add_edit_biller_area").is(":visible") ? $("#add_edit_biller_area #inlineMsgId").html(structure) :
	$("#mobilAuxListScrolableSection").is(":visible") ? $("#mobilAuxListScrolableSection #inlineMsgId").html(structure) : 
	$("#detailViewAreaId").is(":visible") ? $("#detailViewAreaId #inlineMsgId").html(structure) :
	$("#summaryViewAreaId").is(":visible") ? $("#summaryViewAreaId #inlineMsgId").html(structure) : 
	$("#locator_area").is(":visible") ? $("#locator_area #inlineMsgId").html(structure) : 
	$("#login_area_jsp").is(":visible") ? $("#login_area_jsp #inlineMsgId").html(structure) : 
	$("#manage_card_area").is(":visible") ? $("#manage_card_area #inlineMsgId").html(structure) : 
	$("#mainHolderOuter").is(":visible") ? $("#mainHolderOuter #inlineMsgId").html(structure) :
	$("#paymentHistoryAreaId").is(":visible") ? $("#paymentHistoryAreaId #inlineMsgId").html(structure) : 
	$("#profile_area").is(":visible") ? $("#profile_area #inlineMsgId").html(structure) :
	$("#createAccountForm").is(":visible") ? $("#createAccountForm #inlineMsgId").html(structure) : 
	$("#edit_profile_security_area").is(":visible") ? $("#edit_profile_security_area #inlineMsgId").html(structure) : 
	$("#edit_profile_area").is(":visible") ? $("#edit_profile_area #inlineMsgId").html(structure) : 
	$("#searchBillerSec").is(":visible") ? $("#searchBillerSec #inlineMsgId").html(structure) :
	$("#chkoutPaymentSec").is(":visible") && $("#chkoutPaymentSec #inlineMsgId").html(structure);
}

/********************************************************************************************
' Name                 :   removeMessageFromDivId
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to remove the Error / Success message form the corresponding DIV.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   24th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function removeMessageFromDivId(){
	$("#add_edit_biller_area").is(":visible") ? $("#add_edit_biller_area #inlineMsgId").empty() :
	$("#mobilAuxListScrolableSection").is(":visible") ? $("#mobilAuxListScrolableSection #inlineMsgId").empty() : 
	$("#detailViewAreaId").is(":visible") ? $("#detailViewAreaId #inlineMsgId").empty() :
	$("#summaryViewAreaId").is(":visible") ? $("#summaryViewAreaId #inlineMsgId").empty() : 
	$("#locator_area").is(":visible") ? $("#locator_area #inlineMsgId").empty() : 
	$("#login_area_jsp").is(":visible") ? $("#login_area_jsp #inlineMsgId").empty() : 
	$("#manage_card_area").is(":visible") ? $("#manage_card_area #inlineMsgId").empty() : 
	$("#mainHolderOuter").is(":visible") ? $("#mainHolderOuter #inlineMsgId").empty() :
	$("#paymentHistoryAreaId").is(":visible") ? $("#paymentHistoryAreaId #inlineMsgId").empty() : 
	$("#profile_area").is(":visible") ? $("#profile_area #inlineMsgId").empty() :
	$("#createAccountForm").is(":visible") ? $("#createAccountForm #inlineMsgId").empty() : 
	$("#edit_profile_security_area").is(":visible") ? $("#edit_profile_security_area #inlineMsgId").empty() : 
	$("#edit_profile_area").is(":visible") ? $("#edit_profile_area #inlineMsgId").empty() : 
	$("#searchBillerSec").is(":visible") ? $("#searchBillerSec #inlineMsgId").empty() :
	$("#chkoutPaymentSec").is(":visible") && $("#chkoutPaymentSec #inlineMsgId").empty();
}


/********************************************************************************************
' Name                 :   removeSuccessOrFailureStrip
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to remove the Success/ Failure strip form the corresponding DIV.
' History Header       :   Version   -   Date           -   Developer Name
' Added By             :   1.0       -   24th Sep 2014 	-   UmaMaheswara Rao
'****************************************************************************************** */
function removeSuccessOrFailureStrip() {
	if ($('#submittReceipt').is(':visible')) {
		$('#submittReceipt').hide();
	} else if ($('#errorReceipt').is(':visible')) {
		$('#errorReceipt').hide();
	} else if($('#successCredentialId').is(":visible")){
		$('#successCredentialId').hide();
	}
}
