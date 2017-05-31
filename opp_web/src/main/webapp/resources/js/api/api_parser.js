/**
 * This file is used to contain all the web service response parser used within the application.
 */
/********************************************************************************************
 ' Name                 :   parse_init_app
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   27th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_init_app(responseJsonObj) {
    if (responseJsonObj) {
        this.maxLoginAttempts = responseJsonObj.applicationConfiguration.maxLoginAttempts;
        this.init_app_currentterms_id = responseJsonObj.applicationConfiguration.currentTerms.id;
        this.securityQuestionArr = responseJsonObj.applicationConfiguration.securityQuestions;
        this.currentTermsUrl = responseJsonObj.applicationConfiguration.currentTerms.url;
        this.moreInfoUrl = ("" + messages["moreinfo_url"]).toString();
        this.pricingUrl = responseJsonObj.applicationConfiguration.pricingUrl;
        this.contactInfoUrl = responseJsonObj.applicationConfiguration.contactInfoUrl;
        this.feedbackUrl = responseJsonObj.applicationConfiguration.feedbackUrl;
        this.privacyUrl = responseJsonObj.applicationConfiguration.privacyUrl;
        this.helpUrl = responseJsonObj.applicationConfiguration.helpUrl;
        this.billRemitZipUrl = responseJsonObj.applicationConfiguration.billRemitZipUrl;
        this.billPostingTimeUrl = responseJsonObj.applicationConfiguration.billPostingTimeUrl;
        this.loginSessionTimeoutMs = responseJsonObj.applicationConfiguration.loginSessionTimeoutMs;
        this.billPayFeePerBill = responseJsonObj.applicationConfiguration.billPayFeePerBill;
        this.maxBillPayHistoryDayRange = responseJsonObj.applicationConfiguration.maxBillPayHistoryDayRange;
        this.maxBillPayHistoryRecords = responseJsonObj.applicationConfiguration.maxBillPayHistoryRecords;
        this.cartStatusPingFrequencyMs = responseJsonObj.cartStatusPingFrequencyMs;
        this.maxBillPayHistoryDaysBack = responseJsonObj.applicationConfiguration.maxBillPayHistoryDaysBack;
        this.maxTranHistoryDaysBack = responseJsonObj.applicationConfiguration.maxTranHistoryDaysBack;
        this.fuzzySearchVariant = responseJsonObj.applicationConfiguration.fuzzySearchVariant;
        this.maxUserRegisteredCards  = responseJsonObj.applicationConfiguration.maxUserRegisteredCards ? 
        							   responseJsonObj.applicationConfiguration.maxUserRegisteredCards : 6;
        /* To store Funding Source Types */
        this.fundingSourceTypes = responseJsonObj.fundingSourceTypes;
        /* To store API Timeouts */
        if (responseJsonObj.apiTimeouts) {
            this.apiTimeOuts = new Object();
            for (var index = 0; index < responseJsonObj.apiTimeouts.length; index++) {
                this.apiTimeOuts[responseJsonObj.apiTimeouts[index].name] =
                        responseJsonObj.apiTimeouts[index].readTimeoutMs;
            }
        }
        /* To store Feature Names */
        if (responseJsonObj.applicationConfiguration.features) {
            this.featureName = new Object();
            for (var index = 0; index < responseJsonObj.applicationConfiguration.features.length; index++) {
                this.featureName[responseJsonObj.applicationConfiguration.features[index].name] =
                        responseJsonObj.applicationConfiguration.features[index].enabled;
            }
        }
        /* To store Social Media AppId */
        if (responseJsonObj.applicationConfiguration.socialMediaAppConfig) {
            this.mediaName = new Object();
            for (var index = 0; index < responseJsonObj.applicationConfiguration.socialMediaAppConfig.length; index++) {
                this.mediaName[responseJsonObj.applicationConfiguration.socialMediaAppConfig[index].partnerName] =
                        responseJsonObj.applicationConfiguration.socialMediaAppConfig[index].mediaAppId;
            }
        }
        /*Get vesta URL config */
        this.vestaTokenizationURL = responseJsonObj.applicationConfiguration.vestaTokenizationURL;
        this.vestaTokenizationUsername = responseJsonObj.applicationConfiguration.vestaTokenizationUsername;
    }
}

/*******************************************************************************
 * ' Name		 		: parse_user_auth 
 * ' Return type	 	: None 
 * ' Input Parameter(s) : responseJsonObj
 * ' Purpose 			: Creating a parser to parse the data and to store into an object
 * ' History Header 	: Version 	- Date			 	- 		Developer Name 
 * ' Added By 			: 1.0 		- 27th Apr,2012 	- Ravi Raj 
 ******************************************************************************/
function parse_user_auth(responseJsonObj) {
    if (responseJsonObj) {
        this.user = responseJsonObj.user;
        if (this.user) {
            this.userId = responseJsonObj.user.id;
            this.userName = responseJsonObj.user.username;
            this.temppwd = responseJsonObj.user.tempPwdFlag;
            if (null != responseJsonObj.termsAcceptanceLog) {
                this.termId = responseJsonObj.termsAcceptanceLog.termId;
            }
        }
        this.mobileWallet = responseJsonObj.mobileWallet;
        if (this.mobileWallet) {
            this.mobileWalletId = responseJsonObj.mobileWallet.id;
            this.mobileWalletAccountNum = responseJsonObj.mobileWallet.accountNum;
        }
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_terms
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_terms(responseJsonObj) {
    if (responseJsonObj) {
        // TO-DO
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_sec_ques
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_sec_ques(responseJsonObj) {
    if (responseJsonObj) {
        this.userId = responseJsonObj.userId;
        this.securityQuestion = responseJsonObj.securityQuestion;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_send_temp_pwd
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_send_temp_pwd(responseJsonObj) {
    if (responseJsonObj) {
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_reset_pwd
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_reset_pwd(responseJsonObj) {
    if (responseJsonObj) {
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_get_profile
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_get_profile(responseJsonObj) {
    if (responseJsonObj) {
        if (responseJsonObj.user) {
            this.user = responseJsonObj.user;
            this.user.zip = null;
            if (responseJsonObj.userAddress) {
                this.userAddress = responseJsonObj.userAddress;
            }
        }
        if(responseJsonObj.errorCode){
        	this.errorCode = responseJsonObj.errorCode;	
        }
        if(responseJsonObj.errorMessage){
        	this.errorMessage = responseJsonObj.errorMessage;	
        }
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_upd_profile
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_upd_profile(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.user) {
    		this.user = responseJsonObj.user;
    	}
    	if (responseJsonObj.userAddress) {
            this.userAddress = responseJsonObj.userAddress;
        }
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_user_init_reg
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_init_reg(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.user) {
			this.user = responseJsonObj.user;
		}
		if(responseJsonObj.wallet) {
			this.wallet = responseJsonObj.wallet;
		}
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_user_guest
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_user_guest(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.user) {
    		this.userId = responseJsonObj.user.id;
    		this.username = responseJsonObj.user.username;
    	}
    	if(responseJsonObj.wallet) {
    		this.walletId = responseJsonObj.wallet.id;
    		this.accountNum = responseJsonObj.wallet.accountNum;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_upgrade_guest_user
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_upgrade_guest_user(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.user) {
    		this.user_id = responseJsonObj.user.id;
        	this.username = responseJsonObj.user.username;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_biller_corp_search
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_biller_corp_search(responseJsonObj) {
    if (responseJsonObj) {
        if (responseJsonObj.billerCorpSearchResults) {
            this.billerCorpSearchResults = responseJsonObj.billerCorpSearchResults;
        }
        if(responseJsonObj.preciseMatches){
            this.preciseMatches = responseJsonObj.preciseMatches;
        }
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_biller_corp_creds
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_biller_corp_creds(responseJsonObj) {
    if (responseJsonObj) {
        if (responseJsonObj.billerCorp) {
        	if (responseJsonObj.billerCorp.name) {
            	this.name = responseJsonObj.billerCorp.name;
            }
            if (responseJsonObj.billerCorp.industryCategory) {
            	this.industryCategory = responseJsonObj.billerCorp.industryCategory;
            }
            if (responseJsonObj.billerCorp.postingCategories) {
            	this.postingCategories = responseJsonObj.billerCorp.postingCategories;
            }
            if (responseJsonObj.billerCorp.billerCredentialElements) {
            	this.billerCredentialElements = responseJsonObj.billerCorp.billerCredentialElements;
            }
            if (responseJsonObj.billerCorp.industryId) {
                this.industryId = responseJsonObj.billerCorp.industryId;
            }
            if(responseJsonObj.billerCorp.id){
            	this.id = responseJsonObj.billerCorp.id;
            }
        }
        if (responseJsonObj.remitBillers) {
            this.remitBillers = responseJsonObj.remitBillers;
        }
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_get_corp_account
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_get_corp_account(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.billerCorpAccountCredentials) {
    		this.accountCredentials = responseJsonObj.billerCorpAccountCredentials.accountCredentials;
    		this.nickname = responseJsonObj.billerCorpAccountCredentials.nickname;
    		this.billerCorpId = responseJsonObj.billerCorpAccountCredentials.billerCorpId;
    		this.id = responseJsonObj.billerCorpAccountCredentials.id;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_save_biller_corp_acct_creds
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_save_biller_corp_acct_creds(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.failedValidations) {
    		this.billerCorpAccountId = responseJsonObj.billerCorpAccountId;
    		for(var index = 0; index < responseJsonObj.failedValidations.length; index++){
    			this.failedValidationsErrorCode = responseJsonObj.failedValidations[index].errorCode;
    			if(this.failedValidationsErrorCode === bp_save_biller_corp_acct_creds_constant.BP_TOO_MANY_BILLERS ||
    					this.failedValidationsErrorCode === bp_save_biller_corp_acct_creds_constant.BP_INVALID_ACCT_ZIP) {
    				this.programId = responseJsonObj.failedValidations[index].programId;
    				break;
    			}
    		}
    	}
    	if(responseJsonObj.remitBillers){
    		this.remitBillers = responseJsonObj.remitBillers;
    	}
    	this.scheduled = responseJsonObj.scheduled;
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_account_lite
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_account_lite(responseJsonObj) {
    if (responseJsonObj) {
    	this.billPayAccounts = responseJsonObj.billPayAccounts;
    	if(this.billPayAccounts && this.billPayAccounts.length > 0) {
    		this.billPayAccounts_Map = new Object();
    		for (var index = 0; index < this.billPayAccounts.length; index++) {
    			var billerCorpAcctId = this.billPayAccounts[index].billerCorpAcctId;
    	    	if(this.billPayAccounts_Map[billerCorpAcctId] && this.billPayAccounts[index].registrationStatus != "FAILURE") {
    	    		continue;
    	    	}
    	    	this.billPayAccounts_Map[billerCorpAcctId] = new Object();
    	    	this.billPayAccounts_Map[billerCorpAcctId].billerCorpAcctId = this.billPayAccounts[index].billerCorpAcctId;
    			this.billPayAccounts_Map[billerCorpAcctId].expectedPostingDate = this.billPayAccounts[index].expectedPostingDate;
    			this.billPayAccounts_Map[billerCorpAcctId].id = this.billPayAccounts[index].id;
    			this.billPayAccounts_Map[billerCorpAcctId].lastPaymentItemId = this.billPayAccounts[index].lastPaymentItemId;
    	        this.billPayAccounts_Map[billerCorpAcctId].lastPaymentAmount = this.billPayAccounts[index].lastPaymentAmount;
    	        this.billPayAccounts_Map[billerCorpAcctId].lastPaymentDate = this.billPayAccounts[index].lastPaymentDate;
    	        this.billPayAccounts_Map[billerCorpAcctId].programId = this.billPayAccounts[index].programId;
    	        this.billPayAccounts_Map[billerCorpAcctId].registrationStatus = this.billPayAccounts[index].registrationStatus;
    	        this.billPayAccounts_Map[billerCorpAcctId].updateDate = this.billPayAccounts[index].updateDate;
    	    }
    	}
    	if(responseJsonObj.billerCorpAccounts && responseJsonObj.billerCorpAccounts.length > 0) {
    		this.billerCorpAccounts = responseJsonObj.billerCorpAccounts;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_get_pending_transaction
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_get_pending_transaction(responseJsonObj) {
    if (responseJsonObj) {
    	if (responseJsonObj.balance) {
            this.balance = responseJsonObj.balance;
        }
    	if(responseJsonObj.pendingTransactions) {
    		this.pendingTransactions = responseJsonObj.pendingTransactions;
    	}
    	if(responseJsonObj.fundingSources) {
    		this.fundingSources = responseJsonObj.fundingSources;
    	}
    	if(responseJsonObj.credits) {
    		this.credits = responseJsonObj.credits;
    	}
    	if(responseJsonObj.submitType) {
    		this.submitType = responseJsonObj.submitType;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_hist
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_hist(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.billPayAccounts){
            this.billPayAccounts = responseJsonObj.billPayAccounts;
    	}
    	if(responseJsonObj.errorCode){
            this.errorCode = responseJsonObj.errorCode;
    	}
    	if(responseJsonObj.errorMessage){
    		this.errorMessage = responseJsonObj.errorMessage;
    	}
    	if(responseJsonObj.sessionTocken){
    		this.sessionTocken = responseJsonObj.sessionTocken;
    	}
    	if(responseJsonObj.transactions){
    		this.transactions = responseJsonObj.transactions;
    	}
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_scheduled_payment_hist
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_scheduled_payment_hist(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.paymentCards){
            this.paymentCards = responseJsonObj.paymentCards;    		
    	}
    	if(responseJsonObj.promoCodes){
            this.promoCodes = responseJsonObj.promoCodes;    		
    	}
    	if(responseJsonObj.scheduledTransactions){
            this.scheduledTransactions = responseJsonObj.scheduledTransactions;    		
    	}
    	if(responseJsonObj.sessionTocken){
            this.sessionTocken = responseJsonObj.sessionTocken;    		
    	}
    	if(responseJsonObj.errorCode){
            this.errorCode = responseJsonObj.errorCode;    		
    	}
    	if(responseJsonObj.errorMessage){
            this.errorMessage = responseJsonObj.errorMessage;    		
    	}
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_cancel_scheduled_payment
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_cancel_scheduled_payment(responseJsonObj) {
    if (responseJsonObj) {
        this.sessionToken = responseJsonObj.sessionToken;
        this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_remove_biller_corp_account
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_remove_biller_corp_account(responseJsonObj) {
    if (responseJsonObj) {
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_calc_submit_date
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_calc_submit_date(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.calcSubmitDate) {
    		this.calcSubmitDate = responseJsonObj.calcSubmitDate;
    		this.expressFlag = responseJsonObj.expressFlag;
    		this.fee = responseJsonObj.fee;
    		this.programId = responseJsonObj.programId;
    	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_add_verify_cart_item
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_add_verify_cart_item(responseJsonObj) {
    if (responseJsonObj) {
    	this.cumulativeUnloadAmountsToday = responseJsonObj.cumulativeUnloadAmountsToday;
    	if(responseJsonObj.transactions){
    		this.transactions = responseJsonObj.transactions;
    	}
    	if(responseJsonObj.validatedPayments) {
    		this.validatedPayments = responseJsonObj.validatedPayments;
    	}
    	if(responseJsonObj.velocityPayments) {
    		this.velocityPayments = responseJsonObj.velocityPayments;
    	}
    	this.errorCode = responseJsonObj.errorCode;
    	this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
' Name                 :   parse_bp_verify_funding_sources
' Return type          :   None
' Input Parameter(s)   :   responseJsonObj
' Purpose              :   Creating a parser to parse the data and to store into an object
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function parse_bp_verify_funding_sources(responseJsonObj) {
	if (responseJsonObj) {
		this.extraFundingSources = responseJsonObj.extraFundingSources;
		this.verifiedFundingSources = responseJsonObj.verifiedFundingSources;
		this.sessionToken = responseJsonObj.sessionToken;
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
' Name                 :   parse_bp_validate_promo_code
' Return type          :   None
' Input Parameter(s)   :   responseJsonObj
' Purpose              :   Creating a parser to parse the data and to store into an object
' History Header       :   Version   -   Date              -   Developer Name
' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
'*******************************************************************************************/
function parse_bp_validate_promo_code(responseJsonObj) {
	if (responseJsonObj) {
		this.promoCodeAmount = responseJsonObj.promoCodeAmount;
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
        this.promoCodeExpirationDate = responseJsonObj.promoCodeExpirationDate;
	}
}

/********************************************************************************************
 ' Name                 :   parse_bp_submit_payment_group
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_submit_payment_group(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.checkPaymentGroupStatus){
			this.checkPaymentGroupStatus = responseJsonObj.checkPaymentGroupStatus;
		}
		if(responseJsonObj.paymentGroupId){
			this.paymentGroupId = responseJsonObj.paymentGroupId;
		}
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_bp_check_payment_group_status
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_check_payment_group_status(responseJsonObj) {
    if (responseJsonObj) {
    	this.cartId = responseJsonObj.cartId;
    	this.paymentGroupStatus = responseJsonObj.paymentGroupStatus;
    	this.errorCode = responseJsonObj.errorCode;
    	this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_cart_hist
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_cart_hist(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.billPayAccounts){
    		this.billPayAccounts = responseJsonObj.billPayAccounts;}
    	if(responseJsonObj.carts){
    		this.carts = responseJsonObj.carts;}
    	if(responseJsonObj.credits){
    		this.credits = responseJsonObj.credits;}
    	if(responseJsonObj.transactions){
    		this.transactions = responseJsonObj.transactions;}
    	this.errorCode = responseJsonObj.errorCode;
    	this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_bp_cart_receipt
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_cart_receipt(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.cart){
			this.cart = responseJsonObj.cart;}
		if(responseJsonObj.cartCreateDate){
			this.cartCreateDate = responseJsonObj.cartCreateDate;}
		if(responseJsonObj.cartId){
			this.cartId = responseJsonObj.cartId;}
		this.creditsGenerated = responseJsonObj.creditsGenerated;
		if(responseJsonObj.fundingSources){
			this.fundingSources = responseJsonObj.fundingSources;}
		if(responseJsonObj.returnedItems){
			this.returnedItems = responseJsonObj.returnedItems;}
		if(responseJsonObj.submittedBills){
			this.submittedBills = responseJsonObj.submittedBills;}
		this.serviceFeeTotal = responseJsonObj.serviceFeeTotal;
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_bp_cart_receipt_reprint
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_bp_cart_receipt_reprint(responseJsonObj) {
    if (responseJsonObj) {

    }
}

/********************************************************************************************
 ' Name                 :   parse_cm_get_payment_card
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_cm_get_payment_card(responseJsonObj) {
    if (responseJsonObj) {
    	this.canAddCredit = responseJsonObj.canAddCredit;
   	 	this.canAddDebit = responseJsonObj.canAddDebit;
   	 	if(responseJsonObj.paymentCards) {
   	 		this.paymentCards = responseJsonObj.paymentCards; 
   	 	}
    	this.errorCode = responseJsonObj.errorCode;
        this.errorMessage = responseJsonObj.errorMessage;
    }
}

/********************************************************************************************
 ' Name                 :   parse_cm_add_payment_card
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_cm_add_payment_card(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.paymentCard){
			this.paymentCard = responseJsonObj.paymentCard;
		}
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_cm_edit_payment_card
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_cm_edit_payment_card(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.paymentCard){
			this.paymentCard = responseJsonObj.paymentCard;
		}
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_cm_delete_payment_card
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_cm_delete_payment_card(responseJsonObj) {
	if (responseJsonObj) {
		if(responseJsonObj.scheduledPayments){
			this.scheduledPayments = responseJsonObj.scheduledPayments;
		}
		this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
	}
}

/********************************************************************************************
 ' Name                 :   parse_location_load
 ' Return type          :   None
 ' Input Parameter(s)   :   responseJsonObj
 ' Purpose              :   Creating a parser to parse the data and to store into an object
 ' History Header       :   Version   -   Date              -   Developer Name
 ' Added By             :   1.0       -   28th Apr,2012     -   Ravi Raj
 '*******************************************************************************************/
function parse_location_load(responseJsonObj) {
    if (responseJsonObj) {
    	if(responseJsonObj.locations) {
    		this.locations = responseJsonObj.locations;
    	}
    	this.errorCode = responseJsonObj.errorCode;
		this.errorMessage = responseJsonObj.errorMessage;
    }
}