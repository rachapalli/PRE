var newBillpayAccountId = "";

/********************************************************************************************
Name                 :   showRemitBillersList
Return type          :	 none
Input Parameter(s)   :   errorResponseJsonObj, isNewBiller
Purpose              :   To show the billers list.
History Header       :   Version   -   Date              -   Developer Name
Added By             :   1.0       -   19th September, 2013  -   Pradeep Yadav
**********************************************************************************************/
function showRemitBillersList(isNewBiller){
	newBillpayAccountId = ""; // get from the api response.
	newBillpayAccountId = bp_save_biller_corp_acct_creds_obj.billPayAccountId;
	var billerListString = "";
	if (isNewBiller) {
		 $("#auxiliaryBillerHeaderLbl").text(messages['addBill.addBillLabel']);
	} else {
		 $("#auxiliaryBillerHeaderLbl").text(messages['editBill.editBillLabel']);
	}
	
	deActivateAuxilaryPageSaveButton();
	disableMobileBtn("mobBtnSaveAuxiliaryList"); 
	
	/* Get sorted the array based on the remit zip code. */
	var sortedRemitZipArray = createZipCodeArray();
	for (var index = 0; index < sortedRemitZipArray.length; index++) {
		var entry = sortedRemitZipArray[index];
		var zipOnly = entry[0];
		var formatedBillerDetails = entry[1];
		var name = formatedBillerDetails.name;
		var address = formatedBillerDetails.address;
		var address2 = formatedBillerDetails.address2;
		var remitBillerId = formatedBillerDetails.remitBillerId;
		var programId = formatedBillerDetails.programId;
		
		billerListString += '<div class="payconnect_area" name="addressBox" id="mainAddressBoxId_' + index + '">'
				        	+	'<div class="payconnect_data">'
				        	+ 		'<div id="boxBillerName_' + index + '">'+ name+'</div>'
				        	+ 		'<div class="mob_aux_fltlft" id="boxBillerAdd_' + index + '">' + address+'</div>'
				        	+		'<div id="boxBillerZip_' + index + '">'+ address2 + " " + zipOnly +'</div>'
					        + 	'</div>'		        
					        +	'<input type="checkbox" class="txt_inv" name="' + programId + '" value="' + remitBillerId 
					        + 		'" disabled="true" >'
					        +'</div>';
	}	
	
	$("#auxiliaryBillerListArea").empty();
	$("#auxiliaryBillerListArea").append(billerListString);
	removeHomeScreenArea();
	$("#addEditBillerAuxiliaryContainer").show();
	
	$('div [name=addressBox]').click(function (){
		// store current check box status after find this element is selected or not
		var currentChkboxStatus = $(this).find('input[type="checkbox"]').attr("checked");
		// de-select all already selected box expect current one 
		$("#auxiliaryBillerListArea").find('input[type="checkbox"]').each(function(){
			$(this).attr("checked",false);
			$(this).parent().removeClass("aux_lightgreen_col");
		});
		// if not undefined de-select current row check box
		if(currentChkboxStatus){
			$(this).find('input[type="checkbox"]').attr("checked",false);
			// make the submit button color as gray and disable the submit button.
			deActivateAuxilaryPageSaveButton();
			disableMobileBtn("mobBtnSaveAuxiliaryList"); // Change Css 
			$(this).removeClass("aux_lightgreen_col");
		}else{
			$(this).find('input[type="checkbox"]').attr("checked",true);
			// change background color
			$(this).addClass("aux_lightgreen_col");
			// enable submit button
			activateAuxilaryPageSaveButton();
			enableMobileBtn('mobBtnSaveAuxiliaryList'); // Change Css 
		}
	});
}

/********************************************************************************************
Name                 :   disableMobileBtn
Return type          :	 none
Input Parameter(s)   :   mobBtnId
Purpose              :   To disable save button for mobile width.
History Header       :   Version   -   Date                  -   Developer Name
Added By             :   1.0       -   18th September, 2013  -   Pradeep Yadav
**********************************************************************************************/
function disableMobileBtn(mobBtnId){
	$('#' + mobBtnId).removeClass('payconnect_active_btn');
	$('#' + mobBtnId).addClass('payconnect_inactive_btn');
	disableButton(mobBtnId);
}

/********************************************************************************************
Name                 :   enableMobileBtn
Return type          :	 none
Input Parameter(s)   :   mobBtnId
Purpose              :   To enable save button on mobile.
History Header       :   Version   -   Date                  -   Developer Name
Added By             :   1.0       -   18th September, 2013  -   Pradeep Yadav
**********************************************************************************************/
function enableMobileBtn(mobBtnId){
	$('#' + mobBtnId).removeClass('payconnect_inactive_btn');
	$('#' + mobBtnId).addClass('payconnect_active_btn');
	enableButton(mobBtnId);
}

/********************************************************************************************
Name                 :   backToAddOrEditBillPage
Return type          :	 none
Input Parameter(s)   :   none
Purpose              :   To show the Add or Edit Biller Page on click of back button.
History Header       :   Version   -   Date           		 -   Developer Name
Added By             :   1.0       -   16th September, 2013  -   Pradeep Yadav
**********************************************************************************************/
function backToAddOrEditBillPage() {
	removeHomeScreenArea();
	bookmarks.sethash('#addBiller', null);
	$('#addEditBillerInner').show();
}

/********************************************************************************************
Name                 :   handleSaveCreds
Return type          :	 none
Input Parameter(s)   :   none
Purpose              :   To save(Add) or update(Edit) Biller Account.
History Header       :   Version   -   Date                  -   Developer Name
Added By             :   1.0       -   16th September, 2013  -   Pradeep Yadav
**********************************************************************************************/
function submitSelectedBillerRemitanceZip() {
   /* To show the progress bar */
   showProgressBar();
   var strNick = "" + $('#nickName').val();
   var nickname = strNick.replace(/[\<\>\;\&\/]/g, '');
   var nickNameLabelId = $('#nickNameSec > label:first').attr('id');
   var billerCorpId = nickNameLabelId.split('_')[0];
   var programId = nickNameLabelId.split('_')[1] === 'null' ? null : nickNameLabelId.split('_')[1];
   var billerCorpAccountId = nickNameLabelId.split('_')[2] === 'null' ? null : nickNameLabelId.split('_')[2];

   var request = new Object();
   request.userId = eval(getCookie('userId'));
   request.applicationId = applicationId;
   request.locale = getCookie("locale");
   request.nickname = nickname;
   request.billerCorpId = billerCorpId;
   if(programId) {
	   request.programId = programId;
   }
   if(billerCorpAccountId) {
	   request.billerCorpAccountId = billerCorpAccountId;
   }
   request.accountCredentials = new Array();
   var credCount = 0;
   for (var billerCredsId in billerCredElements) {
       var elementObj = billerCredElements[billerCredsId];
       var inputElementValue = replaceUnUsedChar("element" + billerCredsId);
       if (inputElementValue) {
           request.accountCredentials[credCount] = new Object();
           request.accountCredentials[credCount].elementId = billerCredsId;
           /* Checking for PHONE and DATE box type and getting only number from
            * the input field
            */
           if (elementObj.elementType === "PHONE_BOX"
                   || elementObj.elementType === "DATE_BOX") {
        	   if (elementObj.securedFlag) {
                   if (!/^[\\*]*$/.test(inputElementValue)) {
                       inputElementValue = getNumberFromString(inputElementValue);
                   }
               } else {
                   inputElementValue = getNumberFromString(inputElementValue);
               }
           }
           request.accountCredentials[credCount].value = inputElementValue;
           credCount++;
       }
   }
   request.remitBillers = new Array();
   var index = 0;
   /* Find value of selected row check box. */
   $("#auxiliaryBillerListArea").find('input[type="checkbox"]').each(function(){
		if($(this).attr("checked")){
			request.remitBillers[index] = new Object();
			request.remitBillers[index].billerId =  $(this).val();
			request.remitBillers[index].programId = $(this).attr("name");
			return false;
		}
	});
   
   var call_bp_save_biller_corp_acct_creds = new bp_save_biller_corp_acct_creds(request);
   call_bp_save_biller_corp_acct_creds.call();
}

/********************************************************************************************
' Name                 :   createZipCodeArray
' Return type          :   zipAndBillerArray
' Input Parameter(s)   :   None
' Purpose              :   To sort the object array based on the zip code in ascending order.
' History Header       :   Version   -   Date                -   Developer Name
' Added By             :   1.0       -   19 September 2013   -   Pradeep Yadav
'*******************************************************************************************/
function createZipCodeArray(){
	var zipArray = new Array();
	var billerAddressArray = new Array();
	var remitBillers = bp_save_biller_corp_acct_creds_obj.remitBillers;
	var zipAndBillerArray = [];
	// add data into both arrays (zipArray & billerAddressArray) .
	for (var index = 0; index < remitBillers.length; index++) {
		for (var addressArrayIndex = 0; addressArrayIndex < remitBillers[index].addresses.length; addressArrayIndex++) {
			var formatedBillerDetails = getFormatedBillerAddress(remitBillers[index].addresses[addressArrayIndex].address1, 
					remitBillers[index].addresses[addressArrayIndex].address2);
			var formatedBillerDetails2 = getFormatedBillerAddress(remitBillers[index].addresses[addressArrayIndex].city, 
					remitBillers[index].addresses[addressArrayIndex].state);
			var billerLocalZip = remitBillers[index].addresses[addressArrayIndex].zip;
			var numberInZip = billerLocalZip.replace( /^\D+/g, '');
			var completeObj = new Object();
			completeObj.name = remitBillers[index].billerName;
			completeObj.address = formatedBillerDetails;
			completeObj.address2 = formatedBillerDetails2;
			completeObj.remitBillerId = remitBillers[index].remitBillerId;
			completeObj.programId = remitBillers[index].programId;
			zipArray.push(numberInZip);
			billerAddressArray.push(completeObj);
		}				
	}

	for ( var zipArrayIndex = 0; zipArrayIndex < zipArray.length; zipArrayIndex++) {
		zipAndBillerArray.push([zipArray[zipArrayIndex], billerAddressArray[zipArrayIndex]]);
	}
	// sort data 
	zipAndBillerArray.sort(function(a,b){
		var x, y;
		if(a[0].split("-").length > 0){
			x = Number( a[0].split("-")[0] );
		}else{
			x = Number( a[0] );
		}
		if(b[0].split("-").length > 0){
			 y = Number( b[0].split("-")[0] );
		}else{
			y = Number( b[0] );
		}
	    if (x > y) {
			return 1;
		}
		if (x < y) {
			return -1;
		}
		if(x == y){
			
			if( ! (a[0].split("-").length > 1) ){
				return -1;
			}
			if( ! (b[0].split("-").length > 1) ){
				return 1;
			}
			
			if(a[0].split("-").length > 1){
				x = Number( a[0].split("-")[1] );
			}
			if(b[0].split("-").length > 1){
				 y = Number( b[0].split("-")[1] );
			}
			 if (x > y) {
				return 1;
			 }
			 if (x < y) {
				return -1;
			 }
			 return 0;
		}
		return 0;
	});
	// iterate over sorted array and create the list of data
	return zipAndBillerArray;
}

function getFormatedBillerAddress() {
    var formatedAddress="";
    var blankSpace = ", ";
    // Loop through the arguments, looking for null or undefined values.
    for(var i = 0; i < arguments.length; i++){
        if (arguments[i]){
        	formatedAddress += arguments[i]+blankSpace;
        }
    }
    var regEx = /, $/;
    return formatedAddress.replace(regEx, "");
}