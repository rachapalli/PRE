var latest_transaction_count = 0;
/* Date map to store data into key and value pare  */
var dateMap = new Object();
var nickNamesExistsArray;
var updatedCredentialsArray = new Array();
var paymentReadyArray = new Array();
var bp_hist_Transaction = "";
/* store billpayAccountId and fee for that billpayAccountId */ 

var LAST_EDIT_BOX_ID;
var selectedBillpayAccoutIdArray = new Array();
var msgType = "";
var bpCredError = false;
var isDeletedClicked = false;
var isHistoryClicked = false;
var billerCorpAcctIdArray;
var isExpressFlagArr;

/* To hide Add New Biller Button when there is biller exists. */
function hideAddBillerButton() {
    $('#addBillerBtn').hide();
}

/********************************************************************************************
' Name                 :   getBillerAccounts
' Return type          :   None
' Input Parameter(s)   :   removeFlag
' Purpose              :   This method is used to call Accounts_lite API for Getting List Of Biller Added in User Account.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function getBillerAccounts(removeFlag) {
    var request = {};
    /* hold request parameters and values for request parameters */ 
    request.userId = eval(getCookie('userId'));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    bpCredError = false;
    
    var call_bp_account_lite = new bp_account_lite(request, removeFlag);
    call_bp_account_lite.call();
}

/********************************************************************************************
' Name                 :   handleBpAccountLiteOnSuccess
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to design the Main payment page using AccountS_lite API response .
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function handleBpAccountLiteOnSuccess() {
	$('#MainHolder').empty(); /* Clearing Main payment page for re design*/
	nickNamesExistsArray = new Array();
	if(bp_account_lite_obj){ /* Null check for AccountS_lite API response */
		 if (bp_account_lite_obj.billPayAccounts.length === 0) { /* In case AccountsLIte API is empty  */
			/* Showing the JSP page Add Bill button when no biller boxes are there. */
			$('#btnFindBillDiv').show();
			$('#mainpaymentTotalLabel').hide();
			$('#sel_pay_container').hide();
			if($("#footerReceiptTab").hasClass("mob_footer_inactivebtn") && 
					$("#footerProfileTab").hasClass("mob_footer_inactivebtn")) {
				showGeneralSuccessMsg(messages['biller.noBillerSavedMsg']);
			}
			bGetCart = true;
			return;
		 } else {
			$('#mainpaymentTotalLabel').show();
		 }
	}
   
    /* To show the progress bar */
    showProgressBar();
    /* call the method to create biller boxes  */
    createBillPayemtnBoxes();
}

/********************************************************************************************
' Name                 :   createBillPayemtnBoxes
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   To create the bill payment boxes when API call is made as well as when window resize event executes
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function createBillPayemtnBoxes() {
	billerCorpAcctIdArray = new Array();
	isExpressFlagArr = new Array();
    /* pass sorted array by provider sortByNickName. */ 
    $.each(bp_account_lite_obj.billerCorpAccounts.sort(sortByNickName), function (i, rowsetBList) {
    	if(rowsetBList.id) {
    		isExpressFlagArr[i] = rowsetBList.billDates.expressFlag;
	        createSavedBillers(	rowsetBList.id,    /* Passing values in to createSavedBillers after Iterating. */ 
				        		rowsetBList.billerCorpId,			
				        		rowsetBList.nickname,
	        					rowsetBList.recentFailed,
	        					rowsetBList.recentFailedDate,
	        					rowsetBList.recentReturn,
	        					rowsetBList.recentReturnDate,
	        					rowsetBList.recentAccountUpdateDate,
	        					rowsetBList.rtr,
	        					rowsetBList.scheduledCartItems,
	        					rowsetBList.availableForPayments,
	        					i + 20, 
	        					i);
	        billerCorpAcctIdArray[i] = rowsetBList.id;
    	}
    });
    /* Hiding the JSP page Add Bill button and making new button after biller boxes at end. */
    $('#btnFindBillDiv').hide();
    
    /* check if user has entered some amount previously and after that add new biller. */ 
    if (!$("#noPaymentDiv").is(":visible") && $("#btnVerifyBill").is(":visible")) {
    	bGetCart = true;
        /* put previously added amount into biller boxes. */ 
        $("#pay_list_section #childDiv").each(function (index) {
            var paymentAmount = removeDollerSign($(this).find("#paymentAmount").text());/* Remove Dollar symbol from amount */
            var billPaymentId = $(this).find("#billPaymentId").val();
            $("#" + billPaymentId).val(paymentAmount);/* Place amount in to In put Box */
            $("#" + billPaymentId + 'payBtn').hide();
    		$("#" + billPaymentId + 'checkBox').show();
        });
    } else if (initAppFeatureName["CHECKOUT"]) {
        /* if checkout flag is true call get cart API. */
    	try{
    		fillBillPaymentBoxes();
    	} catch (e) {
    		 console.log('Error ' + e + "\n" + e.stack);
        }
    }
  //  $('#' + billerCorpAcctIdArray[0]).focus();
    
    if ($('#chkoutPaymentSec').is(":visible")) {
        /* To show the progress bar */
        showProgressBar();
        chkAccounts = true;
    } else {
        if (isInitMainPage) {
            bAccount = true;
        } else { /* To hide the progress bar */
            hideProgressBar();
        }
    }
    if(!timerEnableNextButton){
    	runTimerEnableNextButton();/* Calling timer after creating billers to enable next button based on selected date and amount*/
    }
    /* Calling the below method to set the data into biller boxes if something stored into tempBillArray */
    setDataFromTempBillArray();
    mainAreaIScroll();
}

var timerEnableNextButton;
/********************************************************************************************
' Name                 :   runTimerEnableNextButton
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   Function is used run timer for the enabling next button on main payment page 
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function runTimerEnableNextButton() {
	timerEnableNextButton = setInterval('checkToEnableNextButton()', 500);/* Run every 500 milliseconds */
}

/********************************************************************************************
' Name                 :   btnVerifyClick
' Return type          :   None
' Input Parameter(s)   :   manageCardsCallForCheckOut
' Purpose              :   Function is used to run on click of next button
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function btnVerifyClick(manageCardsCallForCheckOut){
	/* if checkout flag is true */
	if (initAppFeatureName["CHECKOUT"]) {
		if(timerEnableNextButton || manageCardsCallForCheckOut === callFrom_constant.MANAGE_CARD_CHECKOUT_CALL) {
			createBpAddVerifyRequest();/* Call add verify cart item API */
		}
        return;
    }
}

/********************************************************************************************
' Name                 :   sortByNickName
' Return type          :   None
' Input Parameter(s)   :   a, b
' Purpose              :   Function is used to sort the nick name as per the alphabetical order
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function sortByNickName(a, b) {
    var cnt = 0, tem;
    a = String(a.nickname).toLowerCase();
    b = String(b.nickname).toLowerCase();
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

/********************************************************************************************
' Name                 :   createSavedBillers
' Return type          :   None
' Input Parameter(s)   :   billerCorpAccounts_id, billerCorpId, nickName, recentFailed, recentFailedDate,
'                          recentReturn, recentReturnDate, recentAccountUpdateDate, rtr, scheduledCartItems, 
'						   availableForPayments, tabIndex, index
' Purpose              :   Function is used to create the Pay bill area on the main payment page.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function createSavedBillers(billerCorpAccounts_id, billerCorpId, nickName, recentFailed, recentFailedDate,
                            recentReturn, recentReturnDate, recentAccountUpdateDate,
                            rtr, scheduledCartItems, availableForPayments, tabIndex, index) {
    var billPayId = null, programId = null, lastPaymentAmount = 0, lastPaymentDate = null, registrationStatus = null;
    var billerShutOff = false;
    /* Split the array with id billCorpId to get the attributes to validate. */
    if (bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id]) {
    	billerCorpAcctId = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].billerCorpAcctId;
		expectedPostingDate = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].expectedPostingDate;
		billPayId = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].id;
		lastPaymentItemId = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].lastPaymentItemId;
		lastPaymentAmount = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].lastPaymentAmount;
		lastPaymentDate = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].lastPaymentDate;
		programId = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].programId;
		registrationStatus = bp_account_lite_obj.billPayAccounts_Map[billerCorpAccounts_id].registrationStatus;
    }

	/* Checking that lastPaymentDate should not be null, undefined, empty or blank */
	if (lastPaymentDate) {
		lastPaymentDate = convertToDateddmmFormat(parseInt(lastPaymentDate));
	}

	/* Checking that accountValidateArray should not be null, undefined, empty or blank */
	if (nickName) {
		nickNamesExistsArray.push(nickName.toLowerCase());
	}
	var rowParent = '<div id="rowParent' + index
					+ '" class="defpay_info_parent_container"></div>'
					+ '<div class="clear"></div>';
		$('#MainHolder').append(rowParent);
    /* Checking if programId, nickName and billPaymentId does not exists create Add Biller button */
    if (!nickName && !billCorpId) {
        createAddBillerButton(index);
    } else if (isAlertStateBoxCreation(recentAccountUpdateDate, recentReturnDate, registrationStatus, recentReturn, availableForPayments)) {
    	alert_message2 = messages['main_pay_alertState_billerCreds_msg'];
        if (registrationStatus === "FAILURE") {
        	/* provide error message for registration status FAILURE*/
        	alert_message2 = messages['main_pay_alertState_billerCreds_msg'];
            msgType = messages['main_pay_alertState_billerCreds_slideMsg'];
        } else if(registrationStatus === "TIMEOUT") {
        	/* provide error message for registration status TIMEOUT*/
        	alert_message2 = messages['main_pay_alertState_billerCreds_msg'];
            msgType =  messages['main_pay_alertState_billerCreds_slideMsg'];
        } else if((parseBoolean(recentReturn) === true)){
        	/* payment was returned from the service provider due to inaccurate*/
        	alert_message2 = messages['main_pay_alertState_billerCreds_msg'];
            msgType =  messages['main_pay_alertState_failed_payments'];
        } else if((parseBoolean(availableForPayments) === false)){
        	/* payment was returned from the service provider due to inaccurate*/
        	alert_message2 = messages['addEditBiller.alertMsgNew'];
        	msgType =  messages['main_pay_alertState_failed_payments'];
        	billerShutOff = true;
        } else {
        	/* payment was returned from the service provider due to inaccurate*/
            alert_message2 = messages['main_pay_alertState_billerCreds_msg'];
            msgType = messages['main_pay_alertState_failed_payments'];
        }
        createAlertState(billerCorpAccounts_id, programId, billerCorpId, nickName, index, msgType, billerShutOff, registrationStatus);
    } else {
	    if (nickName && billerCorpAccounts_id) {
	        createStandardState(billerCorpAccounts_id, programId, billerCorpId, nickName, rtr, scheduledCartItems, tabIndex, 
	        					index, lastPaymentAmount, lastPaymentDate, billPayId);
	        $('#btnFindBillDiv').hide();/* Hide nick name when user have nick name  */
	    }
    }
}

/********************************************************************************************
' Name                 :   isAlertStateBox
' Return type          :   Boolean
' Input Parameter(s)   :   recentAccountUpdateDate, recentReturnDate, registrationStatus, recentReturn, availableForPayments
' Purpose              :   This method is used to check whether to create alert state box 
'						   or standard state box.
' History Header       :   Version   -   Date                   -   Developer Name 
' Added By             :   1.0       -   07th September, 2013   -   Ravi Raj
'*******************************************************************************************/
function isAlertStateBoxCreation(recentAccountUpdateDate, recentReturnDate, registrationStatus, recentReturn, availableForPayments) {
	if(recentReturnDate && recentAccountUpdateDate > recentReturnDate) {
		return false;
	} else if((recentReturnDate && recentReturnDate > recentAccountUpdateDate) 
			/* Checking for the conditions if any one of them is satisfied them biller will get alert state */
								|| registrationStatus === "FAILURE"
								|| registrationStatus === "TIMEOUT" 
								|| parseBoolean(recentReturn) === true 
								|| parseBoolean(availableForPayments) === false) {
		return true;
	}
	return false;
}

/********************************************************************************************
' Name                 :   sortByMinAmount
' Return type          :   Boolean
' Input Parameter(s)   :   program1, program2
' Purpose              :   This method is used to sort minAmout from the programs array.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function sortByMinAmount(program1, program2){
	/* Check the condition to stop sorting open range programs and sort remaining programs  */
	if(program1.rtrOpenRange === false && program2.rtrOpenRange === false){
	  var prog1MinAmount = program1.minAmount;
	  var prog2MinAmount = program2.minAmount; 
	  return ((prog1MinAmount < prog2MinAmount) ? -1 : ((prog1MinAmount > prog2MinAmount) ? 1 : 0));
	}
}

/********************************************************************************************
' Name                 :   sortByOpenRange
' Return type          :   Boolean
' Input Parameter(s)   :   program1, program2
' Purpose              :   This method is used to sort OpenRange and keeping False on top of the index in the array.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function sortByOpenRange(program1, program2){
	/* Check the condition to stop sorting open range programs and sort remaining programs  */
	  var prog1MinAmount = program1.rtrOpenRange;
	  var prog2MinAmount = program2.rtrOpenRange; 
	  return ((prog1MinAmount < prog2MinAmount) ? -1 : ((prog1MinAmount > prog2MinAmount) ? 1 : 0));
}

/********************************************************************************************
' Name                 :   sortByOpenRange
' Return type          :   None 
' Input Parameter(s)   :   billerCorpAccounts_id, programId, billerCorpId, nickName, rtr, scheduledCartItems, tabIndex,
'						   index, lastPaymentAmount, lastPaymentDate, billPayId
' Purpose              :   To create the standard state box with hover effects for additional buttons
'						   like delete, edit and history.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function createStandardState(billerCorpAccounts_id, programId, billerCorpId, nickName, rtr, scheduledCartItems, tabIndex,
							index, lastPaymentAmount, lastPaymentDate, billPayId) {
    var newBox, billDates, numDaysToDisplay, startPostingDatePst;
    var minAmount = 0, maxAmount = 0, programIdOfBillerCop, dollarLabel;
	var programs, rtrDenominationLabel, rtrOpenRange, firstProgramId='';
	
	/* Getting Nick name section for the biller to design*/
	newBox = getNickNameSecForBiller(billerCorpAccounts_id, nickName, index);
	var rtrFlag = true;
	programs = bp_account_lite_obj.billerCorpAccounts[index].programs;
	/* programs array null check  */
	if(programs){
		newBox += unCheckedMarkIcon(billerCorpAccounts_id);/* Getting UnChecked mark icon for the biller*/
		programs.sort(sortByOpenRange);/* programs array  storing data using openRange attribute  */
		programs.sort(sortByMinAmount);/* programs array sorting data using minAmount attribute */
		/* programs array iterating and storing data for every programs index  */
		for ( var programIndex = 0; programIndex < programs.length; programIndex++) {
			if(programIndex === 0){/*Save the first index value of RTR and non RTR Billers, and pass to selectDateInCalender()*/
				firstProgramId = programs[programIndex].id;
			}
			programIdOfBillerCop = programs[programIndex].id;
			minAmount = programs[programIndex].minAmount;
			maxAmount = programs[programIndex].maxAmount;
			rtrDenominationLabel = programs[programIndex].rtrDenominationLabel;
			rtrOpenRange = programs[programIndex].rtrOpenRange;
			var wholeDollar =  messages['main_pay.rtr.openRange']
								+ " ("
								+ DOLLAR_SYMBOL
								+ parseInt(minAmount)
								+ "-"
								+ DOLLAR_SYMBOL
								+ parseInt(maxAmount)
								+ ")";
			
			/* Angular bracket (>) for commonBox will be closed downward */
            var typeAttribute = "type=\"tel\""; //'tel' type will bring up the numeric keypad
            if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
                typeAttribute = "type=\"text\"";
            }
            /* Get common input box for the billers */
            var commonBox = commonInPutBoxFoeBillers(typeAttribute, billerCorpAccounts_id, tabIndex, nickName, minAmount, maxAmount);
			if(rtr === true && programs.length > 1){
				 dollarLabel = '<label for="textfield" class="font_style" id="rtrProgramId">$</label>';
			} else {
				 dollarLabel = '<label for="textfield" class="font_style" id="' + firstProgramId + '">$</label>';	
			}
            mobileKeyboardFooterToggle();
			
			if(programs.length === 1) { /* programs array length equals to 1 then go inside */
				if(rtr === true) { /* rtr attribute comes as true then go inside */
					if(rtrOpenRange === true) { /* rtrOpenRange comes as true create text box as normal biller */
						newBox += commonBox + '>' /* Angular bracket (>) is, to close the input field left opened in commonBox */
								+ dollarLabel; 
					} else { /* rtrOpenRange comes as false then in this case create fixed biller */
						newBox += '<span id="' + billerCorpAccounts_id + '" class="font_style mrgn_lft">' + parseInt(minAmount).toFixed(2) + '</span>'
								+ dollarLabel;
					}
				} else {/* if rtr is false then create text box  */
					newBox += commonBox 
							+ '>'  /* Angular bracket (>) is, to close the input field left opened in common box */
							+ dollarLabel;
				}
			} else if(programs.length > 1) { /* Programs array length more than 1 then go inside */
				if(rtr === true) { /* rtr attribute comes as true then go inside */
					if(rtrFlag) { /* rtrFlag initialized as true and made it false inside to restrict the  2nd time execution */
						newBox += getSectionForRtrDropDown(index, commonBox, dollarLabel);
					 if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
						 newBox += '<select id="rtrId' + index + '"><option></option>';
					 } else {
						 newBox	+= '<ul id="rtrId">';
					 }
						rtrFlag = false;
					}
					if(rtrOpenRange === false) { /* Checks for rtrOpenRange in case of false minAmount going to be as list id */
						/* minAmount will be used to display in text box */ 
						 newBox += getSpecificInfoRtrOpenRangeFalse(minAmount, maxAmount, programIdOfBillerCop, rtrDenominationLabel);
						
					} else { /* If rtrOpenRange is True we have different id and label to show */
						 newBox += getSpecificinfoRtrOpenRangeTrue(minAmount, maxAmount, programIdOfBillerCop, wholeDollar);
					}
				} else { /* if rtr is false then create text box and break the loop in case of multiple programs array */
					newBox += commonBox 
							+ '>'  /* Angular bracket (>) is, to close the input field left opened in common box */
							+ dollarLabel;
					break;
				}
			}			
		}
	}
	
	if(rtr === true && programs.length > 1) { /* if rtr is true and programs length more than 1 then close the ul and div */
		if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
			newBox += '</select></div>';
		} else {
			newBox += '</ul></div>';	
		}
	}
	
	/* get billDates from billerCorpAccount as per the index */
	billDates = bp_account_lite_obj.billerCorpAccounts[index].billDates;
	/* get data from billDates and store in to variables  */
	numDaysToDisplay = billDates.numDaysToDisplay;
	startPostingDatePst = convertToDatemmddyy(billDates.startPostingDate * 1);
	
	newBox += "</div></div>"
			+ "<div id='" + billerCorpAccounts_id + "pnl' class='z_index2_rel hover-pnl clear txt_inv'>";
	if (lastPaymentAmount) {
        newBox += lastPaidAmount(billerCorpAccounts_id);
    } else {
        newBox += lastPaidAmount(billerCorpAccounts_id);
    }
	newBox += calendarSectionDesign(billerCorpAccounts_id, index, startPostingDatePst);
	/* Getting dateArray iterating and making date boxes  */
	var startPostingDate = new Date(billDates.startPostingDate * 1);
	for(var dateIndex = 0; dateIndex < numDaysToDisplay; dateIndex++) {
		var startPostingDatePstInMili = startPostingDate.getTime();
		var date = startPostingDate.getDate();
		var day = dayOfWeekAsInteger(startPostingDate.getDay());
		var nextMonthHeader = "";
		if(date === 1 && dateIndex != 0) { /* To add a separator line with 1st date. */
			newBox += "<li class='date_separation'><span id='" + startPostingDatePstInMili + "'></span></li>";
			var nextMonthDate = convertToDatemmddyy(startPostingDatePstInMili);
			nextMonthHeader = "<span class='nextscrollDate'>" + nextMonthDate.month + ", " + nextMonthDate.year + "</span>"; 
		}
		newBox += designDateBoxesInCalendar(billerCorpAccounts_id, dateIndex, firstProgramId, nextMonthHeader, startPostingDatePstInMili, day, date);
		startPostingDate = convertPostingPstFutureDate(startPostingDatePstInMili);
	}
	/*--------------------------------------------------------------------------------------
	 * In this design structure we are using three buttons i.e. deleteBiller, editBiller
	 * and billerHistory on click of each button we are calling three different methods
	 * i.e. deleteConfirm(),navigateToAddEditBiller(), and navigateToBillView()respectively.
	 * -------------------------------------------------------------------------------------*/
    newBox += designDeleteEditHistoryBtns(billerCorpAccounts_id, billerCorpId, programId, billPayId, rtr);
    
    $('#rowParent' + index).append(newBox);
    setCalenderWidth('calender' + index);
    /* Check for the mobile versions(IPHONE, IPOD, IPAD and ANDROID versions */
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
    	$('#rtrDropId' + index + ' select').change(function(){
        	var currentId = $(this).children(":selected").attr("id");/*$(this).attr('id');*/
        	if(currentId){/* If there is no Current id then go to Else */
        		if(currentId.split('_')[0] === "rangeId"){
            		/* On click of drop down list based on the id text box making as editable drop down */
            		$('#' + billerCorpAccounts_id).val('');
            		$('#' + billerCorpAccounts_id).focus();
            		/* Remove the attribute disabled and made it enabled adding border to amount box */
            		$("#" + billerCorpAccounts_id).removeAttr("disabled").addClass('border_rg_show');
                    $( "#"+ billerCorpAccounts_id).attr("max",$("#"+currentId).attr("max"));
                    $( "#"+ billerCorpAccounts_id).attr("min",$("#"+currentId).attr("min"));
            	} else {
                    $( "#"+ billerCorpAccounts_id).removeClass('border_rg_show');
            		$( "#"+ billerCorpAccounts_id).focusout();
            		/* On click of drop down list based on the id minAmount setting in to in put box */
            		var selectedVal = currentId.split('_')[0];
            		var ProgramId = currentId.split('_')[1];
            		var selectedValue = selectedVal.replace(/[^0-9]/gi, '');
            	/*	$("#rtrProgramId").attr('id', ""); */    		
            		$("#rtrProgramId").attr('id', ProgramId);
            		/* Make input box as disabled bcz fixed values are not editable */
            		$("#" + billerCorpAccounts_id).prop("disabled", true);   
            		/* Selected value fixed as float value */
            		$("#" + billerCorpAccounts_id).val(parseInt(selectedValue).toFixed(2));
            		$('#' + billerCorpAccounts_id).removeClass("error_red_border");
            		$("#" + billerCorpAccounts_id + 'payBtn').hide();
        			$("#" + billerCorpAccounts_id + 'checkBox').show();
        			$("#" + billerCorpAccounts_id + 'checkBox').attr("checked", true);
                    $( "#"+ billerCorpAccounts_id).attr("max",$("#"+currentId).attr("max"));
                    $( "#"+ billerCorpAccounts_id).attr("min",$("#"+currentId).attr("min"));
            	}	
        	} else {
        		/* Clear the amount which is selected previously */
        		$('#' + billerCorpAccounts_id).val('');
        		/* In mobile width if user selects Empty option then place holder should apppear */
        		$('#' + billerCorpAccounts_id).attr('placeholder','0.00');
        	}
        	
        	/* On click of drop down list pick the id and slide up the drop down box  */
        	$('#rtrDropId' + index + '> ul').slideUp();
        	return false;
        });
    } else {/* This else block will work in case of browser(ALL) */
    	 $('#rtrDropId' + index + '> ul > li').click(function(){
    	    	var currentId = $(this).attr('id');
    	    		if(currentId.split('_')[0] === "rangeId"){
    	        		/* On click of drop down list based on the id text box making as editable drop down */
    	        		$( "#"+ billerCorpAccounts_id).prop("disabled", false).val("").addClass('border_rg_show');
    	        		$( "#"+ billerCorpAccounts_id).focus();/* Setting focus to the */
    	                $( "#"+ billerCorpAccounts_id).attr("max",$("#"+currentId).attr("max"));
    	                $( "#"+ billerCorpAccounts_id).attr("min",$("#"+currentId).attr("min"));
    	        	} else {
    	                $( "#"+ billerCorpAccounts_id).removeClass('border_rg_show');
    	        		$( "#"+ billerCorpAccounts_id).focusout();
    	        		/* On click of drop down list based on the id minAmount setting in to in put box */
    	        		var selectedVal = currentId.split('_')[0];
    	        		var ProgramId = currentId.split('_')[1];
    	        		var selectedValue = selectedVal.replace(/[^0-9]/gi, '');
    	        		$("#rtrProgramId").attr('id', ProgramId);
    	        		/* Make input box as disabled bcz fixed values are not editable */
    	        		$("#" + billerCorpAccounts_id).prop("disabled", true);
    	        		/* Selected value fixed as float value */
    	        		$("#" + billerCorpAccounts_id).val(parseInt(selectedValue).toFixed(2));
    	        		$('#' + billerCorpAccounts_id).removeClass("error_red_border");
    	        		$("#" + billerCorpAccounts_id + 'payBtn').hide();
    	    			$("#" + billerCorpAccounts_id + 'checkBox').show();
    	    			$("#" + billerCorpAccounts_id + 'checkBox').attr("checked", true);
    	                $( "#"+ billerCorpAccounts_id).attr("max",$("#"+currentId).attr("max"));
    	                $( "#"+ billerCorpAccounts_id).attr("min",$("#"+currentId).attr("min"));
    	        	}
    	        	/* On click of drop down list pick the id and slide up the drop down box  */
    	        	$('#rtrDropId' + index + '> ul').slideUp();
    	        	return false;
    	  });
    }
    	
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
    	   $('select#rtrId' + index).click(function() {
    	    	for(var count = 0; count < billerCorpAcctIdArray.length; count++) {
    	    		if($('#rtrDropId' + count) && count !== index) {
    	    			if($('#rtrDropId' + count + ' > select').is(':visible')) {
    	    				//$('#rtrDropId' + count + ' > select').slideToggle();
    	    			}
    	    		}
    	    	}
    	    	/* On click of drop down box slide up and slide up the drop down box  */
    	    	$('#rtrDropId' + count + ' > select').slideToggle();
    	    	refreshScrollForBillers();
    	    	$('.defpay_bg_heading').css('z-index', 1);

    	        var rtrid = $('#rtrDropdown' + index).siblings('.pay_bill_inp').attr('id');
    	        for (var count = 0; count < billerCorpAcctIdArray.length; count++) {
    	            if (rtrid != billerCorpAcctIdArray[count]) {
    	                $("#" + billerCorpAcctIdArray[count] + "pnl").hide();
    	            }
    	        }
    	        if ($("#" + billerCorpAccounts_id + "pnl").is(":hidden")) {
    	            $("#" + billerCorpAccounts_id + "pnl").slideDown();
    	        }
    	    	if($('.defpay_info_container').children().find(".pay_bill_dropdown")){
    	    		var getContainerId = $(this).parents().find(".defpay_info_container").attr('id');
    	    		var getContainerCalenderId = $(this).parents().find('.hover-pnl').attr('id');
    	    		$('#' + getContainerId).find('.defpay_bg_heading').css('z-index', 109);
    	    		$('#' + getContainerCalenderId).removeClass('z_index2_rel').addClass('z_index1_rel');
    	    	}
    	    	return false;
    	    });
    } else {
    	 $('#rtrDropdown' + index).click(function() {
    	    	for(var count = 0; count < billerCorpAcctIdArray.length; count++) {
    	    		if($('#rtrDropId' + count) && count !== index) {
    	    			if($('#rtrDropId' + count + ' > ul').is(':visible')) {
    	    				$('#rtrDropId' + count + ' > ul').slideToggle();
    	    			}
    	    		}
    	    	}
    	    	/* On click of drop down box slide up and slide up the drop down box  */
    	    	$('#rtrDropId' + index + '> ul').slideToggle();
    	    	refreshScrollForBillers();
    	    	$('.defpay_bg_heading').css('z-index', 1);
    	        hidePayBillDropBox(billerCorpAccounts_id, this, billerCorpId, firstProgramId);
    	    	if($('.defpay_info_container').children().find(".pay_bill_dropdown")){
    	    		var getContainerId = $(this).parents().find(".defpay_info_container").attr('id');
    	    		var getContainerCalenderId = $(this).parents().find('.hover-pnl').attr('id');
    	    		$('#' + getContainerId).find('.defpay_bg_heading').css('z-index', 109);
    	    		$('#' + getContainerCalenderId).removeClass('z_index2_rel').addClass('z_index1_rel');
    	    	}
    	    	return false;
    	    });
    }
   
    $('#rtrDropdown' + index).next('.pay_bill_inp').addClass('rtr_textbox');
    
    $("#" + billerCorpAccounts_id).focus(function () {
    	/*Get the value for the field */
    	var value = Number($('#' + billerCorpAccounts_id).val());
    	if(window.location.hash !== '#error') {
        	LAST_EDIT_BOX_ID = $(this).attr("id");
        }
    	/*Check for the value should not be null */
    	if(eval($('#' + billerCorpAccounts_id).val()) != null){
    		 /*Check for the value if less than minAmount or more than maxAmount, clear the field.
    		 This changes is done for bug id 4238 */
    		var minAmountFocus = $('#' + billerCorpAccounts_id).attr("min");
    		var maxAmountFocus = $('#' + billerCorpAccounts_id).attr("max");
            if (!isAmountInRange(value,minAmountFocus,maxAmountFocus)) {
    			$(this).val('');
    		} else if(validateWholeDolalAmount(billerCorpAccounts_id, value)){
    			$(this).val('');
    		}
    	}
    });
    
    $('body').click(function(e) {
        if( !$(e.target).hasClass('pay_bill_inp') ){
            $('#rtrDropId' + index + '> ul').hide();
        }
    });
    
    $("#" + billerCorpAccounts_id).blur(function () {
        var value = Number($('#' + billerCorpAccounts_id).val());
        var message="";
        if(value === 0){
        	$('#' + billerCorpAccounts_id).val("");
        	$('#' + billerCorpAccounts_id).removeClass("error_red_border");
        }
		if (value > 0 && eval($('#' + billerCorpAccounts_id).val()) != null) {
			if(validateWholeDolalAmount(billerCorpAccounts_id, value)){
                var minAmountWhole = $('#' + billerCorpAccounts_id).attr("min");
              	var maxAmountWhole = $('#' + billerCorpAccounts_id).attr("max");

                message = formatMessage(messages["paymentAmount.alert.amountNotWholeDollar"], minAmountWhole, maxAmountWhole);
					removeMessageFromDivId();
					showGeneralErrorMsg(message, billerCorpAccounts_id);
                return;
			} else {
                var minAmountRtr = $('#' + billerCorpAccounts_id).attr("min");
              	var maxAmountRtr = $('#' + billerCorpAccounts_id).attr("max");
                if (!isAmountInRange(value,minAmountRtr, maxAmountRtr)) {
	                 message = formatMessage(messages['paymentAmount.alert.amountBetween'], getFormatedNumber(minAmountRtr, true), 
	                		 getFormatedNumber(maxAmountRtr, true));
	                	 removeMessageFromDivId();
	                	 showGeneralErrorMsg(message, billerCorpAccounts_id);
	                 return;
	             }
			}
	        $(this).val(displayDefaultDecimalNumber($(this).val()));
	    }
    });

    $("#" + billerCorpAccounts_id).keypress(function (evt) {
    	/* loop to find which biller is expanded if any of biller is expanded collapse on key press  */
    	for(var count = 0; count < billerCorpAcctIdArray.length; count++) {
   			if($('#' + billerCorpAcctIdArray[count] + 'pnl').is(':visible')) {
   				/* collapse if the expanded billler is not a user target to enter the amount */
   				if(billerCorpAccounts_id != billerCorpAcctIdArray[count]) {
   					/* Collapse the biller boxes once above condition matches */
   					$('#' + billerCorpAcctIdArray[count] + 'pnl').slideUp();
   				}
    		}
    	}

    	/* Check for the biller boxes to check in put box contains red border on not */
    	if($('#' + billerCorpAccounts_id).hasClass("error_red_border")){
    		/* Remove red border for the biller in put boxes */
    		$('#' + billerCorpAccounts_id).removeClass("error_red_border");
    	}
    	
    	/* Check for the biller box is hidden or visible which ever user targeted to enter amount */
    	if($("#" + billerCorpAccounts_id + "pnl").is(":hidden")){
    		/* Expand the biller box on key press */
    		hidePayBillDropBox(billerCorpAccounts_id, event, billerCorpId, firstProgramId);
    	}
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 13) {
            $(this).val(displayDefaultDecimalNumber($(this).val()));
            LAST_EDIT_BOX_ID = $(this).attr("id");
            return;
        }
        return isValidAmountEntered($(this), evt);
    });

    $("#" + billerCorpAccounts_id + "standard_state").click(function (event) {
    	for(var count = 0; count < billerCorpAcctIdArray.length; count++) {
   			if($('#rtrDropId' + count + ' > ul').is(':visible')) {
   				$('#rtrDropId' + count + ' > ul').slideToggle();
   				return;
    		}
    	}
    	hidePayBillDropBox(billerCorpAccounts_id, event.target, billerCorpId, firstProgramId);
    });
    
    if ((navigator.userAgent).match(/Android 2/i)) {
    	$('#calender' + index).horizontalScroll();
    }
    $('#calender' + index).scroll(function() {
    	changeMonthInCalender('calender' + index, null);
	});
    initMainHeight = $('#mainHolderInner').outerHeight();
}

/********************************************************************************************
' Name                 :   getSectionForRtrDropDown
' Return type          :   rtrDropDownSec 
' Input Parameter(s)   :   index, commonBox, dollarLabel
' Purpose              :   This method is used to design UI for rtr drop down list.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function getSectionForRtrDropDown(index, commonBox, dollarLabel) {
	var rtrDropDownSec = '<div id="rtrDropdown' + index + '" class="pay_bill_dropdown fa fa-caret-down"></div>'
						+ commonBox 
						+ ' disabled>'  /* Angular bracket (>) is, to close the input field left opened in commonbox */
						+ dollarLabel 
						+ '<div id="rtrDropId' + index + '" class="rtrDropList">';
	return rtrDropDownSec;
}

/********************************************************************************************
' Name                 :   getNickNameSecForBiller
' Return type          :   nickNameSec 
' Input Parameter(s)   :   billerCorpAccounts_id, nickName, index
' Purpose              :   This method is for getting and design nick name section for the biller boxes.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function getNickNameSecForBiller(billerCorpAccounts_id, nickName, index) {
	var nickNameSec = '<div id="' + billerCorpAccounts_id + 'standard_state" class="defpay_info_container">'
					+ '<div id="billerNick' + billerCorpAccounts_id + '" class="default_paytxt_heading">'
					+ '<span class="biller_name_adjust">' + nickName + '</span>'
					+ '</div>'
					+ '<div class="defpay_bg_heading">'
					+ '<div class="defpay_bg_heading_content" id="content' + index + '">';
	return nickNameSec;
}

/********************************************************************************************
' Name                 :   unCheckedMarkIcon
' Return type          :   uncheckedMarkICon 
' Input Parameter(s)   :   billerCorpAccounts_id
' Purpose              :   To create the standard state box with un checked icon
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function unCheckedMarkIcon(billerCorpAccounts_id) {
	var uncheckedMarkICon = "<div class='pay_mrgn'>"
						  + "<div class='fa fa-check fa-2x unchecked_mark_icon' id='" + billerCorpAccounts_id
						  + "checkBox' onclick='billerCheckboxClick(event)'></div>"
						  + "</div>";
	return uncheckedMarkICon;
}

/********************************************************************************************
' Name                 :   commonInPutBoxFoeBillers
' Return type          :   commonBox 
' Input Parameter(s)   :   typeAttribute, billerCorpAccounts_id, tabIndex, nickName, minAmount, maxAmount
' Purpose              :   To create the common in put box for the biller boxes on the main payment page
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function commonInPutBoxFoeBillers(typeAttribute, billerCorpAccounts_id, tabIndex, nickName, minAmount, maxAmount) {
	var commonBox = '<input pattern="\\d+(\\.\\d*)?" '+typeAttribute+' id="' + billerCorpAccounts_id + '" class="pay_bill_inp" tabindex="'
				  + tabIndex + '" size="5" maxlength="7" placeholder="0.00" name="' 
				  + nickName + '" min="' + minAmount + '" max="' + maxAmount + '"';
	return commonBox;
}

/********************************************************************************************
' Name                 :   getSpecificInfoRtrOpenRangeFalse
' Return type          :   optionOrLi 
' Input Parameter(s)   :   minAmount, maxAmount, programIdOfBillerCop, rtrDenominationLabel
' Purpose              :   Method is used to get specific information for Android and IOS(option) dekstop(li).
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function getSpecificInfoRtrOpenRangeFalse(minAmount, maxAmount, programIdOfBillerCop, rtrDenominationLabel) {
	var optionOrLi = '';
	 if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
		 optionOrLi += '<option min="'+minAmount+'" max="'+maxAmount+'" id="' + minAmount + "_" + programIdOfBillerCop + '">' 
					+ 	rtrDenominationLabel
					+ '</option>';
	 } else {
		 optionOrLi +=  '<li min="'+minAmount+'" max="'+maxAmount+'" id="' + minAmount + "_" + programIdOfBillerCop + '">' 
					+ 	rtrDenominationLabel
					+ '</li>'; 
	 }
	 return optionOrLi;
}

/********************************************************************************************
' Name                 :   getSpecificinfoRtrOpenRangeTrue
' Return type          :   optionOrLi 
' Input Parameter(s)   :   minAmount, maxAmount, programIdOfBillerCop, wholeDollar
' Purpose              :   This method is used to get browser specific section for mobile(option) and desktop(li) as well.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function getSpecificinfoRtrOpenRangeTrue(minAmount, maxAmount, programIdOfBillerCop, wholeDollar) {
	var optionOrLi = '';
	if(/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent).match(/Android/i)) {
		optionOrLi += '<option min="'+minAmount+'" max="'+maxAmount+'" id="rangeId_'+programIdOfBillerCop+'">'
			       + wholeDollar
			       + '</option>';
	} else {
		optionOrLi += '<li min="'+minAmount+'" max="'+maxAmount+'" id="rangeId_'+programIdOfBillerCop+'">'
				   + wholeDollar
				   + '</li>';
	}
	return optionOrLi;
}

/********************************************************************************************
' Name                 :   lastPaidAmount
' Return type          :   lastPaidAmountSec 
' Input Parameter(s)   :   billerCorpAccounts_id
' Purpose              :   To create Select due date on the biller boxes.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function lastPaidAmount(billerCorpAccounts_id) {
	var lastPaidAmountSec = "<div class='onclick_block_area'> <div id='" + billerCorpAccounts_id 
						  + "lastPmt_section' class='defpay_pd_txt fnt_wt color696969'>"
						  + messages["main_pay.bill_pay_billerBox"]
    					  + "</div></div>"
						  + "<div class='clear'></div>" ;
	return lastPaidAmountSec;
}

/********************************************************************************************
' Name                 :   calendarSectionDesign
' Return type          :   calendarSec 
' Input Parameter(s)   :   billerCorpAccounts_id, index, startPostingDatePst
' Purpose              :   This method is used to design the left and right sections of the calendar area.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function calendarSectionDesign(billerCorpAccounts_id, index, startPostingDatePst) {
	var calendarSec = "<div id='calenderBarSec" + billerCorpAccounts_id + "' class='calenderBar'>"
					+ "<span id='leftCalender" + index + "' class='leftCalender'>"
					+ "</span>" 
					+ "<span id='rightCalender" + index + "' class='rightCalender'>" 
					+ "</span>"
					+ "<div id='monthSec" + billerCorpAccounts_id + "' class='monthDisplay'>" + startPostingDatePst.month + ", " + startPostingDatePst.year + "</div>"
					+ "<div id='calender" + index + "' class='daysDisplay'>"
					+ "<ul id='scroll" + index + "'>";
	return calendarSec;
}

/********************************************************************************************
' Name                 :   designDateBoxesInCalendar
' Return type          :   dateBox 
' Input Parameter(s)   :   billerCorpAccounts_id, dateIndex, firstProgramId, nextMonthHeader,
'						   startPostingDatePstInMili, day, date
' Purpose              :   This method is used to design date boxes on the calendar area on biller boxes.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function designDateBoxesInCalendar(billerCorpAccounts_id, dateIndex, firstProgramId, nextMonthHeader, startPostingDatePstInMili, day, date) {
	 var dateBox = "<li id='scheduleDateBox" + billerCorpAccounts_id + "_" + dateIndex + "' onclick='selectDateInCalender(event, this, " 
 				+ billerCorpAccounts_id + ", \"" + firstProgramId + "\")'>"
 				+	nextMonthHeader
 				+	"<span id='" + startPostingDatePstInMili + "' class='currenday'>" 
 				+ 		day
 				+ 	"</span>" 
 				+	"<span class='date'>"
 				+ 		date 
 				+ 	"</span>"
 				+ "</li>";
	 return dateBox;
}

/********************************************************************************************
' Name                 :   designDeleteEditHistoryBtns
' Return type          :   buttonSec 
' Input Parameter(s)   :   billerCorpAccounts_id, billerCorpId, programId, billPayId, rtr
' Purpose              :   To create the standard state box with hover effects for additional buttons
'						   like delete, edit and history.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function designDeleteEditHistoryBtns(billerCorpAccounts_id, billerCorpId, programId, billPayId, rtr) {
	var buttonSec = "</ul>"
				  + "</div>"
			      + "</div>"
			      + "<div class='wid_flt100 border_boxes'>"
			      + "<div class='cal_datetxt_hd' id='chargeDateBox" + billerCorpAccounts_id + "' ></div>"
			      + "<div class='cal_credit_info' id='chargeMessageBox" + billerCorpAccounts_id + "' ></div>"
			      + "<div class='cal_datetxt_hd red_txt mrgn_bottom10' id='chargeFeeBox" + billerCorpAccounts_id + "' >"
			      + "</div>"
			      + "</div>"
				  + "<div class='pdng cal_bar_mrgn'>"
		          + "<div class='delete_icon tooltip' id='deleteIcon" + billerCorpAccounts_id + "' title='" + messages['editBill.deleteButtonMsg'] + "' align='right' " 
		          + "onClick='deleteConfirm(" + billerCorpAccounts_id + ")'><i class='fa fa-trash-o fa-lg'></i></div>"
		          + "<div class='edit_icon tooltip' id='editIcon" + billerCorpAccounts_id + "' title='" + messages['editBill.editButtonMsg'] + "'" 
		          + " onClick='navigateToAddEditBiller(\"" + billerCorpId + "\", \"" + programId +"\" , " + billerCorpAccounts_id + ", false, false, null)'><i class='fa fa-pencil fa-lg'></i></div>"
		          + "<div class='history_icon tooltip' id='historyIcon" + billerCorpAccounts_id + "' title='" + messages['editBill.historyButtonMsg'] + "' "
				  + "onClick='navigateToBillView(" + true + "," + billPayId +","+rtr+","+billerCorpAccounts_id+")'><i class='fa fa-clock-o fa-lg'></i></div>"
				  + "</div>"
		          + "</div>"
		          + "</div>"
		          + "</div>"
		          + "</div>";
	return buttonSec;
}

/********************************************************************************************
' Name                 :   isAmountInRange
' Return type          :   min or max 
' Input Parameter(s)   :   amount, min, max
' Purpose              :   To check the amount range whether amount is below min amount or more than max amount.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function isAmountInRange(amount, min, max) {
    return amount >= min && amount <=max;
}

/********************************************************************************************
' Name                 :   billerCheckboxClick
' Return type          :   None 
' Input Parameter(s)   :   event
' Purpose              :   Method is used on click of in put box check mark field should empty and focus it.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function billerCheckboxClick(e){
    var t = $(e.target);
    $(t).closest('.pay_mrgn').siblings('.pay_bill_inp').val('').focus();
    $(t).closest('.defpay_info_container').find('li.bg_green').trigger('click');
}

/********************************************************************************************
' Name                 :   createAlertState
' Return type          :   buttonSec 
' Input Parameter(s)   :   billerCorpAccounts_id, programId, billerCorpId, nickName, index, msgType, billerShutOff, registrationStatus
' Purpose              :   To create the alert state box using the accounts_Lite API response 
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function createAlertState(billerCorpAccounts_id, programId, billerCorpId, nickName, index, msgType, billerShutOff, registrationStatus) {
    /* Get the month name in format of Char.coming form button_event.js. */
    var alertBox;
    var instructionMsg;
    var editIconBtn = 	"<div class='defpayattalert_icons'>"
    					+ "<div class='edit_icon tooltip flt_rght' title='" + messages['editBill.editButtonMsg'] 
						+ "' onClick='navigateToAddEditBiller(\"" + billerCorpId + "\", \"" + programId + "\", " + billerCorpAccounts_id 
						+ ", false, true, \"" + msgType + "\")'>" 
						+ "<i class='fa fa-pencil fa-lg'></i></div>";
    if(registrationStatus ==="TIMEOUT"){
    	instructionMsg = "<div class='defpayattalert_txt_bottom'>"
    					+ messages["main_pay.alert_msg_new"] 
    					+ "</div>";
    } else {
    	instructionMsg = "<div class='defpayattalert_txt_bottom'>" 
    					+ messages["main_pay.alert_msg_new"] 
    					+ "</div>";
    }
    alertBox = "<div id='" + billerCorpAccounts_id + "alert_state' class='defpay_info_attalertcontainer'>"
				    + "<div>"
				    + "<div class='default_paytxt_heading mrgn_top10'>"
				    + "<label id='" + nickName + "'>"
				    + nickName
				    + "</label>"
				    + "</div>"
				    + "<div class='defpayattalert_txt_hd'>" /* This will work only in mobile width*/
				    + "</div>"
				    + "</div>"
				    + "<div class='defpayattalert_incomp_txt'>"
				    + "<div class='fnt_wt'>" + alert_message2 + "</div>";
    if(!billerShutOff){
    	 alertBox += instructionMsg
    	 			+ editIconBtn;
    }
    alertBox += "<div class='delete_icon tooltip flt_rght' title='" + messages['editBill.deleteButtonMsg'] 
		    		+ "' align='right' onClick='deleteConfirm(" + billerCorpAccounts_id + ")'><i class='fa fa-trash-o fa-lg'></i>";
    if(!billerShutOff){
    	alertBox = alertBox 
    			+ "</div>";
    }
		    		
    alertBox += "</div>"
				    + "</div>"
				    + "</div>"
				    + "<div class='hover-pnl clear' style='display: none' id='"
				    + billerCorpAccounts_id
				    + "pnl'>"
				    + "<div class='pdng cal_bar_mrgn'>"
				    + "</div>"
				    + "</div>"
				    + "</div>";
    $('#rowParent' + index).append(alertBox);
}

/********************************************************************************************
' Name                 :   checkToEnableNextButton
' Return type          :   none 
' Input Parameter(s)   :   none
' Purpose              :   To enable next button and to add green color to date boxes using timer
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function checkToEnableNextButton() {
	if(billerCorpAcctIdArray && billerCorpAcctIdArray.length > 0) {
		var flag = false;
		var billPageSummary = new Object();
		billPageSummary.paymentsTotal = 0;
		for(var index=0; index < billerCorpAcctIdArray.length; index++) {
			var selectedCalenderId = $('#calender' + index).find('.bg_green').attr('id');
			/* Reading the value if its a input box */
			var filledAmountBoxVal = $('#' + billerCorpAcctIdArray[index]).val();
			/* if its not a input box then reading the value from span for fixed billers */
			if(!filledAmountBoxVal) {
				filledAmountBoxVal = $('#' + billerCorpAcctIdArray[index]).text();
				/* For fixed biller if date is not selected then make the amount as blank */
				if(!selectedCalenderId) {
					filledAmountBoxVal = 0;
				}
			}
			var checkBoxId = $('#' + billerCorpAcctIdArray[index] + 'checkBox');
			if(selectedCalenderId && filledAmountBoxVal && filledAmountBoxVal > 0){
				flag = true;
				/* Amount entered and date selected the remove the existing class and adding new class  */
				checkBoxId.removeClass("unchecked_mark_icon").addClass("checked_mark_icon");
				billPageSummary.paymentsTotal += filledAmountBoxVal * 1;
			} else {
				if(checkBoxId.hasClass('checked_mark_icon')){
					/* Amount entered and date selected the remove the existing class and adding new class */
					checkBoxId.removeClass("checked_mark_icon").addClass("unchecked_mark_icon");
				}
			}
		}
		updateBillsPageSummary(billPageSummary);
		
		/* Enable the Next button amount and date both are entered */
		if(flag){
			$("#nextBtnOfMainPage").addClass("bg_green");
			$("#nextBtnOfMainPageBtm").addClass("bg_green");
			activateMainPaymentPageNextButton();
		} else { /* Disable the Next button*/
			$("#nextBtnOfMainPage").removeClass("bg_green");
			$("#nextBtnOfMainPageBtm").removeClass("bg_green");
			deActivateMainPaymentPageNextButton();
		}
	}
}

/********************************************************************************************
' Name                 :   setCalenderWidth
' Return type          :   None 
' Input Parameter(s)   :   calenderId
' Purpose              :   This method is used for setting width for the calander.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function setCalenderWidth(calenderId) {
	var totalLi = $('#' + calenderId + '>ul li').size();
	var liWidth = $('#' + calenderId + '>ul li').outerWidth(true);
	var totalSep = $('#' + calenderId + '>ul li.date_separation').size();
	var liSepWidth = $('#' + calenderId + '>ul li.date_separation').outerWidth(true);
	var totalWidth = ((totalLi - totalSep) * liWidth) + (totalSep * liSepWidth);
	$('#' + calenderId + ">ul").width(totalWidth);
}

/********************************************************************************************
' Name                 :   dayOfWeekAsInteger
' Return type          :   Day 
' Input Parameter(s)   :   day
' Purpose              :   To find the day according to index in a week.
'						   like delete, edit and history.
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function dayOfWeekAsInteger(day) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

/********************************************************************************************
' Name                 :   convertPostingPstFutureDate
' Return type          :   Date 
' Input Parameter(s)   :   startPostingDatePstInMili
' Purpose              :   To convert milli seconds in to PST 
' History Header       :   Version   -   Date             -   Developer Name 
' Added By             :   1.0       -   12th May, 2014   -   UmaMaheswaraRao
'*******************************************************************************************/
function convertPostingPstFutureDate(startPostingDatePstInMili) {
	return new Date(startPostingDatePstInMili + (24*60*60*1000));
}

/********************************************************************************************
' Name                 :   hidePayBillDropBox
' Return type          :   none
' Input Parameter(s)   :   billerCorpAccounts_id, target, billerCorpId, firstProgramId
' Purpose              :   This method is used to hide the open the clicked Pay_Your_Bill box
'							drop down and hide other drop down if any opened. Similarly 
'							if any already opned box is clicked then it should close.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   14 Nov 2013   -   Ravi Raj
'*******************************************************************************************/
function hidePayBillDropBox(billerCorpAccounts_id, target, billerCorpId, firstProgramId) {
    var excludedTarget = false;
    if ($(target).hasClass('pay_bill_inp') 
    		|| $(target).hasClass('checked_mark_icon') 
    		|| $(target).hasClass('unchecked_mark_icon') 
    		|| $(target).hasClass('leftCalender') 
    		|| $(target).hasClass('rightCalender')
    		|| $(target).hasClass('pay_bill_dropdown')){
        excludedTarget = true;
    }
    if($(target).hasClass('rtr_textbox') && $(target).attr('disabled')){
        $("#" + billerCorpAccounts_id + "standard_state").find('.pay_bill_dropdown').trigger("click");
    }
    for (var index = 0; index < billerCorpAcctIdArray.length; index++) {
        if (billerCorpAccounts_id != billerCorpAcctIdArray[index]) {
        	$("#" + billerCorpAcctIdArray[index] + "pnl").hide();
        }
    }
    if ($("#" + billerCorpAccounts_id + "pnl").is(":visible") && !excludedTarget) {
		$("#" + billerCorpAccounts_id + "pnl").slideUp();/* hide() was used earlier instead of slideUp*/
	} else {
		$("#" + billerCorpAccounts_id + "pnl").slideDown();/* show() was used earlier instead of slideDown*/
		var calenderId = $("#" + billerCorpAccounts_id + "pnl").closest('div').find('.daysDisplay').attr('id');
		calendarIScroll(calenderId);
		if(!$('#calenderBarSec' + billerCorpAccounts_id + ' ul li').hasClass('bg_green')){
			selectDateInCalender(null, $('#scheduleDateBox' + billerCorpAccounts_id + "_" + constant.FIRST_DATEINDEX), billerCorpAccounts_id, firstProgramId);	
		}
	}
	refreshScrollForBillers();
}

/********************************************************************************************
' Name                 :   selectDateInCalender
' Return type          :   none
' Input Parameter(s)   :   Object liDateObject
' Purpose              :   This method is used to select the clicked date as green(selected)
'							and other as normal(unselected) but if user clicks on previously 
'							selected date then it should turn into green(selected) to 
'							normal(unselected).
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   14 Apr 2014   -   Karuna mishra
'*******************************************************************************************/
function selectDateInCalender(event, liDateObject, billerCorpId, programId) {
	var currentCalenderDateId = $(liDateObject).attr('id');
	var parentDivId = $(liDateObject).closest('div').attr('id');
	$('#' + parentDivId + ' > ul > li').each(function() {
		var dateBoxId = $(this).attr('id');
		if (currentCalenderDateId !== dateBoxId) {
			$("#" + dateBoxId).removeClass("bg_green");
		}
	});
	/* Checking if previously selected class is there then remove it. */
	if ($("#" + currentCalenderDateId).hasClass("bg_green")) {
		$("#" + currentCalenderDateId).removeClass("bg_green");
		/* Remove the element from billsDup array as well */
		if(billsDup && billsDup.length > 0) {
			delete billsDup[billerCorpId];
		}
		$("#chargeDateBox" + billerCorpId).hide();
		$("#chargeMessageBox" + billerCorpId).hide();
		$("#chargeFeeBox" + billerCorpId).hide();
	} else {
		/* Getting the pstDate in miliseconds from currently selected date */
		var pstDate = $("#" + currentCalenderDateId + ' > .currenday').attr('id');
		/* Checking if all three prameters are present then making an API call to BP_CALC_SUBMIT */
		if(pstDate && programId && billerCorpId) {
			getCalcSubmitDate(pstDate, programId, billerCorpId, liDateObject);
		}
	}
	if(event){
		event.stopPropagation();
	}
	return false;
}


/******************************************************************************************
Name                 :   getCalcSubmitDate
Return type          :   dateArray
Input Parameter(s)   :   todayDate, days
Purpose              :   To get the day, date, month and year.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   12th April, 2014   -   UmaMaheswaraRao
*******************************************************************************************/
function getCalcSubmitDate(postingDatePst, programId, billerCorpId, liDateObject) {
    var request = {};
    request.userId = eval(getCookie('userId'));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.postingDate = postingDatePst;
    request.programId = programId;
    showProgressBar();
    
    var call_bp_calc_submit_date = new bp_calc_submit_date(request, billerCorpId, liDateObject);
    call_bp_calc_submit_date.call();
}

/********************************************************************************************
' Name                 :   handleBpCalcSumbitDateOnSuccess
' Return type          :   None
' Input Parameter(s)   :   billerCorpId, liDateObject
' Purpose              :   This method is called on success of BP_CALC_SUBMIT
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function handleBpCalcSumbitDateOnSuccess(billerCorpId, liDateObject){
	var currentCalenderDateId = $(liDateObject).attr('id');
	var convertedDate = convertToDatemmddyy(bp_calc_submit_date_obj.calcSubmitDate);
	var currentDate = new Date();
	var showCalcSubmitDate = convertedDate.month + " " + convertedDate.day;
	if (isSameDay(currentDate, bp_calc_submit_date_obj.calcSubmitDate)) {
		$("#chargeDateBox" + billerCorpId).text(messages['main_pay_chargeTodayMessage']);
	} else {
		$("#chargeDateBox" + billerCorpId).text(formatMessage(messages['main_pay_chargeDateMessage'], showCalcSubmitDate));
	}
	
	if(bp_get_pending_transaction_obj){
		if(bp_get_pending_transaction_obj.balance && bp_get_pending_transaction_obj.balance > 0 
				&& parseBoolean(localStorage.getItem("registerUser"))){
			$("#chargeMessageBox" + billerCorpId).text(messages['main_pay_chargeMessage']);
		}
	}
	
	if(navigator.userAgent.match(/Android 4/i)) {
		$("#chargeDateBox" + billerCorpId).show('slow');
		$("#chargeMessageBox" + billerCorpId).show('slow');
	} else {
		$("#chargeDateBox" + billerCorpId).show();
		$("#chargeMessageBox" + billerCorpId).show();
	}
	
	if (bp_calc_submit_date_obj.fee && bp_calc_submit_date_obj.fee > 0
			&& bp_calc_submit_date_obj.expressFlag) {
		var expressSign = '<div title="Express">'
						+ formatMessage(messages['main_pay_chargeFeeMessage'], getFormatedNumber(parseFloat(bp_calc_submit_date_obj.fee).toFixed(2), true))
						+ '<i class="fa fa-bolt fa-lg colorffdd00"></i></div>';
		$("#chargeFeeBox" + billerCorpId).html(expressSign);
		$("#chargeFeeBox" + billerCorpId).show();
	} else {
		$("#chargeFeeBox" + billerCorpId).hide();
		$("#chargeFeeBox" + billerCorpId).text('');
	}
	validateForScheduledPaymentPopUp(billerCorpId);
	if(clearAllDateBoxes(liDateObject)){
		$('#' + currentCalenderDateId).addClass("bg_green");
	}
	var requestedPostingDate = $('#' + currentCalenderDateId + ' > .currenday').attr('id');
	var amount = $('#' + billerCorpId).val();
	createBillsArrForBpAddVerifyRequest(billerCorpId, amount, requestedPostingDate * 1);
}

/********************************************************************************************
' Name                 :   clearAllDateBoxes
' Return type          :   Boolean
' Input Parameter(s)   :   liDateObject
' Purpose              :   This method is used to clear the  in put boxes.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function clearAllDateBoxes(liDateObject) {
	var parentDivId = $(liDateObject).closest('div').attr('id');
	$('#' + parentDivId + ' > ul > li').each(function() {
		var dateBoxId = $(this).attr('id');
		/* Checking if previously selected class is there then remove it. */
		if ($("#" + dateBoxId).hasClass("bg_green")) {
			$("#" + dateBoxId).removeClass("bg_green");
		}
	});
	return true;
}

/********************************************************************************************
' Name                 :   createBillsArrForBpAddVerifyRequest
' Return type          :   Boolean
' Input Parameter(s)   :   liDateObject
' Purpose              :   This method is used to create the request for Add verify cart.
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   12th May, 2014    -   UmaMaheswaraRao
'*******************************************************************************************/
function createBillsArrForBpAddVerifyRequest(billerCorpAccountId, amount, requestedPostingDate) {
	if(billsDup[billerCorpAccountId]) {
		billsDup[billerCorpAccountId].programId = bp_calc_submit_date_obj.programId;
		billsDup[billerCorpAccountId].requestedPostingDate = requestedPostingDate;
		billsDup[billerCorpAccountId].calcSubmitDate = bp_calc_submit_date_obj.calcSubmitDate;
		billsDup[billerCorpAccountId].fee = bp_calc_submit_date_obj.fee ? bp_calc_submit_date_obj.fee * 1 : 0;
		return;
	}
	billsDup[billerCorpAccountId] = new Object();
	billsDup[billerCorpAccountId].programId = bp_calc_submit_date_obj.programId;
	billsDup[billerCorpAccountId].requestedPostingDate = requestedPostingDate;
	billsDup[billerCorpAccountId].calcSubmitDate = bp_calc_submit_date_obj.calcSubmitDate;
	billsDup[billerCorpAccountId].fee = bp_calc_submit_date_obj.fee ? bp_calc_submit_date_obj.fee * 1 : 0;
}

/********************************************************************************************
' Name                 :   validateForScheduledPaymentPopUp
' Return type          :   false
' Input Parameter(s)   :   billerCorpAccounts_id
' Purpose              :   This method is used to validate schedule pop up to display depend on condition.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   25th May, 2014   -   UmaMaheswara Rao
'*******************************************************************************************/
function validateForScheduledPaymentPopUp(billerCorpAccounts_id){
	 for(var index = 0; index < bp_account_lite_obj.billerCorpAccounts.length; index++){
		 if(billerCorpAccounts_id === bp_account_lite_obj.billerCorpAccounts[index].id){
			 var scheduledCartItems = bp_account_lite_obj.billerCorpAccounts[index].scheduledCartItems;	 
			 if(scheduledCartItems && scheduledCartItems.length > 0){
				 $("#clearNewEntry").attr("id", "clearNewEntry_" + billerCorpAccounts_id);
				 showAnimatedPopup('scheduledPayId', 'credPopUpId');
				 return false;
			 }
		 }
	 }
 }

/********************************************************************************************
' Name                 :   expandAlertBoxForStandard
' Return type          :   none
' Input Parameter(s)   :   none
' Purpose              :   This method is used to expand the alert box message section and 
'						   hide action button on resize from mobile to standard.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   07th Septemebr, 2013   -   Ravi Raj
'*******************************************************************************************/
function expandAlertBoxForStandard() {
	if(billerCorpAcctIdArray){
		for (var index = 0; index < billerCorpAcctIdArray.length; index++) {
			$("#" + billerCorpAcctIdArray[index] + "pnl").hide();
			$("#" + billerCorpAcctIdArray[index] + "mob_alert_msg").show();
	    }
	}
}

/**
 * To get the KeyBorad value to validate the pay bill text box.
 * @param keyCode
 * @param shiftKey
 * @returns {Boolean}
 */
function getKeyCodeValue(keyCode, shiftKey) {
    shiftKey = shiftKey || false;
    if (shiftKey === true) {
        if ((keyCode >= 48 && keyCode <= 57) || keyCode === 189) {
            return true;
        }
    }
    return false;
}

/**
 * To show an alert pop-up when user deletes a biller.
 * @param billPayAccountId
 */
function deleteConfirm(billCorpAcctId) {
    isDeletedClicked = true;
    if (confirm(messages['addEditBiller.alert.deleteBiller'])) {
        removeBiller(billCorpAcctId);
    }
}

/********************************************************************************************
' Name                 :   callBillerHistory
' Return type          :   none
' Input Parameter(s)   :   Int billPayAccountId
' Purpose              :   This method is used for call the biller history method.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   30th August, 2013   -   Ravi Raj
'*******************************************************************************************/
function callBillerHistory(billCorpAcctId){
	isHistoryClicked = true;
	navigateToBillView(true, billCorpAcctId);
}

/********************************************************************************************
' Name                 :   removeBiller
' Return type          :   none
' Input Parameter(s)   :   billerCorpAccountId
' Purpose              :   This method is used to call remove biller API.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   30th August, 2013   -   Ravi Raj
'*******************************************************************************************/
function removeBiller(billerCorpAccountId) {
    /* To show the progress bar */
    showProgressBar();

    /* hold request parameters and values for request parameters */ 
    var request = {};
    request.userId = eval(getCookie('userId'));
    request.applicationId = applicationId;
    request.locale = getCookie("locale");
    request.billerCorpAccountId = billerCorpAccountId;
    var call_bp_remove_biller_corp_account = new bp_remove_biller_corp_account(request);
    call_bp_remove_biller_corp_account.call(); /* Calling remove biller API  */
}

/**
 * Replace selected text with new pressed key text and return updated string.
 * @param selectedElementId
 * @param pressedKeyVale
 * @param selectedElementValue
 */
function allowedOperationOnSelectedText(selectedElementId, pressedKeyVale, selectedElementValue) {
    var result = selectedElementValue.replace(getSelectedText(), "");
    if (result == "") {
        result = pressedKeyVale;
    }
    return result;
}

/**
 *  find selected text on the screen and return selected text.
 */
function getSelectedText() {
    var userSelection, ta;
    if (window.getSelection && document.activeElement) {
        if (document.activeElement.nodeName == "TEXTAREA" ||
                (document.activeElement.nodeName == "INPUT" &&
                        document.activeElement.getAttribute("type").toLowerCase() == "text")) {
            ta = document.activeElement;
            userSelection = ta.value.substring(ta.selectionStart, ta.selectionEnd);
        } else {
            userSelection = window.getSelection();
        }
        return userSelection.toString();
    } else {
        /* all browsers, except IE before version 9 */ 
        if (document.getSelection) {
            userSelection = document.getSelection();
            return userSelection.toString();
        }
        /* IE below version 9 */ 
        else if (document.selection) {
            userSelection = document.selection.createRange();
            return userSelection.text;
        }
    }
}

/********************************************************************************************
' Name                 :   clearEntriesForScheduled
' Return type          :   none
' Input Parameter(s)   :   obj
' Purpose              :   This method is used to clear the entires in case of guest user.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   26th May, 2014   -   UmaMaheswara Rao
'*******************************************************************************************/
function clearEntriesForScheduled(obj) {
	var billerCorpAccounts_id = (obj.id.split('_')[1])*1;
	if(billerCorpAccounts_id){
		for(var index = 0; index < billerCorpAcctIdArray.length; index++) {
			if(billerCorpAccounts_id === billerCorpAcctIdArray[index]){
				closeAnimatedPopup('scheduledPayId', 'credPopUpId');
				var checkBoxId = $('#' + billerCorpAcctIdArray[index] + 'checkBox');
				var filledAmountBoxVal = $('#' + billerCorpAcctIdArray[index]).val('');
				if(!filledAmountBoxVal) {
					filledAmountBoxVal = $('#' + billerCorpAcctIdArray[index]).text('');
					if(!selectedCalenderId) {
						filledAmountBoxVal = '';
					}
				}
				if(checkBoxId.hasClass("checked_mark_icon")){
					checkBoxId.addClass("checked_mark_icon").removeClass("unchecked_mark_icon");
				}
				$('#calender' + index + '> ul > li').removeClass("bg_green");
				/*Fix for the Bug 4691*/
				/*Clearing the fee related info from biller box*/
				$("#chargeDateBox" + billerCorpAcctIdArray[index]).text('');
				$('#chargeFeeBox' + billerCorpAcctIdArray[index]).text('');
				$("#chargeMessageBox" + billerCorpAcctIdArray[index]).text('');
				/*ReAssigning the default id to the input button so that it can be easily tracked for other biller clear event*/
				$("#clearNewEntry_" + billerCorpAcctIdArray[index]).attr("id", "clearNewEntry");
			}
		}
	}
}

/********************************************************************************************
' Name                 :   validateWholeDolalAmount
' Return type          :   return true or false
' Input Parameter(s)   :   billerCorpAccounts_id, value
' Purpose              :   This method is used to check whole dollar amount in case of RTR open Range true.
' History Header       :   Version   -   Date          -   Developer Name 
' Added By             :   1.0       -   27th May, 2014   -   UmaMaheswara Rao
'*******************************************************************************************/
function validateWholeDolalAmount(billerCorpAccounts_id , value) {
	var programs = "";
	if(bp_account_lite_obj){
		if(bp_account_lite_obj.billerCorpAccounts && bp_account_lite_obj.billerCorpAccounts.length > 0){
			for(var index in bp_account_lite_obj.billerCorpAccounts){
				if(billerCorpAccounts_id === bp_account_lite_obj.billerCorpAccounts[index].id){
					programs = bp_account_lite_obj.billerCorpAccounts[index].programs;	
					for(var proIndex in programs){
						if(programs[proIndex].wholeDollar){
							if(value % 1 != 0){
								return true;
							}
						}
					}
				}
			}
		}
	}
	return false;
}

/********************************************************************************************
' Name                 :   calendarIScroll
' Return type          :   None
' Input Parameter(s)   :   None
' Purpose              :   This method is used to implement IScroll for Android 4.0 devices in calender area.
' History Header       :   Version   -   Date          		-   Developer Name 
' Added By             :   1.0       -   15 Jul, 2014   	-   Mohit Arya3
'*******************************************************************************************/
function calendarIScroll(calenderId){
	if(navigator.userAgent.match(/Android 4.0/i)) {
		var calenderISCroll = new IScroll('#' + calenderId, {
			snap: false,
			bounce: false,
			momentum: true,
			probeType: 2,
			scrollX: true
		});
		calenderISCroll.on('scrollEnd', function() {
			changeMonthInCalender(calenderId, this);
		});
	}
}
