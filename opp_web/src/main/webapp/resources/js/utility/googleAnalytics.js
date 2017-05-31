{
    //on load of this script, this will send the cookie data if it is set.
    //allows for event to be queued prior to a page navigation.
    var gaValue = ("" + localStorage.getItem("pushQueue")).trim();
    localStorage.setItem("pushQueue", "");
    sendPush();
    var searchCount = 0;
}


function queuePush(data) {
    var dataString = JSON.stringify(data);
    gaValue = Base64.encode(dataString);
    localStorage.setItem("pushQueue", gaValue);
    sendPush();
}


function sendPush() {
    if (null != gaValue && "" != gaValue && "null" != gaValue) {
        var decoded = Base64.decode(gaValue);
        var data = JSON.parse(decoded);
        data.callback = function () {
            pushCallback();
        };
        dataLayer.push(data);
    }
}

function pushCallback() {
    localStorage.setItem("pushQueue", "");
    gaValue = "";
}


function gaHandleSignup(applicationId, userId, isGuestUser) {
    var data = {};
    data.applicationId = applicationId;
    data.event = "registration";
    data.registrationType = "SignUp";
    data.userId = userId;
    data.isGuestUser = isGuestUser;
    queuePush(data);
}

function gaHandleUpgrade(applicationId, userId) {
    var data = {};
    data.applicationId = applicationId;
    data.event = "registration";
    data.registrationType = "Upgrade";
    data.userId = userId;
    data.isGuestUser = false;
    queuePush(data);
}
function gaHandleSearch(searchString) {
    searchCount++;
    var data = {};
    data.event = "search";
    data.searchString = searchString;
    data.searchCount = searchCount;
    queuePush(data);
}

function gaHandleSelectSearchedBill(billerCorpId) {
    var data = {};
    data.event = "billerSelected";
    data.billerCorpId = billerCorpId;
    data.searchCount = searchCount;
    searchCount = 0;
    queuePush(data);
}

function gaBillerSetup(userId, billerCorpId, success) {
    var data = {};
    data.event = "billerSetup";
    data.userId = userId;
    data.billerCorpId = billerCorpId;
    data.billerSetupSuccess = success;
    data.searchCount = 0;
    searchCount = 0;
    queuePush(data);
}

function gaLogin(userId, clientIp) {
    var data = {};
    data.event = "authenticate";
    data.clientIp = clientIp;
    data.userId = userId;
    data.successful = true;
    data.isGuestUser = false;
    searchCount = 0;
    data.searchCount = 0;
    queuePush(data);
}

function gaLoginFailed(clientIp) {
    var data = {};
    data.event = "authenticate";
    data.clientIp = clientIp;
    data.userId = "";
    data.successful = false;
    data.isGuestUser = false;
    searchCount = 0;
    data.searchCount = 0;
    queuePush(data);
}

function gaSubmitPaymentGroup(userId, promoCode) {
    var data = {};
    data.event = "submitPaymentGroup";
    data.userId = userId;
    data.promoCode = promoCode;
    queuePush(data);
}

function gaFinishedPaymentGroup(userId, paymentGroupId, paymentGroupStatus) {
    var data = {};
    data.event = "finishedPaymentGroup";
    data.userId = userId;
    data.paymentGroupId = paymentGroupId;
    data.paymentGroupStatus = paymentGroupStatus;
    queuePush(data);
}

function gaReportError(clientIp, errorReport, exception) {
    var data = {};
    data.event = "reportClientError";
    data.clientIp = clientIp;
    data.errorReport = errorReport;
    data.exception = exception;
}
