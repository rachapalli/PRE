
<div id="editCardContainer" class="create_account_container txt_inv">
	
	<div id="editCardForm" class="add_pmt_method_cardarea">
		
		 <div class="card_field_sep">
				<label><fmt:message key="editPaymentCard.userName" /></label>
				<label id="editCrdPmtNameOnCrd"></label>
		</div>
			
		<div class="card_field_sep">
				<label><fmt:message key="editPaymentCard.typeOfCrd" /></label>
				<label id="editCrdPmtCrdTyp"></label>
		</div>
			
		<div class="card_field_sep">
				<label><fmt:message key="editPaymentCard.cardLastFr" /></label>
				<label id="editCrdPmtlstFour"></label>
		</div>
			
		<!--<div class="card_field_sep">
				<label>	Card last four:	</label>
				<input type="text"  id="editCrdPmtLastFour" maxlength="10" minlength="1" onkeypress="return isNumberKey(event)"/>
		</div>
			 -->
		<div class="card_field_sep">
				<label><fmt:message key="editPaymentCard.cardExpiryDate" /></label>
				<select name="select" id="editCardPmtMmSelect" class="select_wd88">
		  			<option>MM</option>
        		</select>
  
  				<select name="select2" id="editCardPmtYySelect" class="select_wd88">
				  	<option>YY</option>
				 </select>
			</div>
			
			<!-- <div class="card_field_sep">
				<label>
					Default: 
				</label>
				<input type="text"  id="editCrdPmtDefault" />
				</div> -->
			
			<!-- <div class="card_field_sep">
				<label>
					One Time Use:
				</label>
				<input type="text"  id="editCrdPmtOneTimeUse" />
				</div> -->
			
			<div class="card_field_sep">
				<label>
					
					<fmt:message key="addPaymentCardForm.firstName" /> :
				</label>
				<input type="text"  id="editCrdPmtFisrtName" />
				</div>
			
			<div class="card_field_sep">
				<label>
				<fmt:message key="addPaymentCardForm.lastName" /> :
				</label>
				<input type="text"  id="editCrdPmtLastName" />
				</div>
			
			<div class="card_field_sep">
				<label>
					<fmt:message key="editPaymentCard.address1" />
				</label>
				<input type="text"  id="editCrdPmtAddress1" />
</div>
			
			<div class="card_field_sep">
				<label>
					<fmt:message key="editPaymentCard.address2" />
				</label>
				<input type="text"  id="editCrdPmtAddress2" />
				</div>
			
			<div class="card_field_sep">
				<label>
					<fmt:message key="editPaymentCard.city" />
				</label>
				<input type="text"  id="editCrdPmtCity" />
				</div>
			
			<div class="card_field_sep">
			<label>
					<fmt:message key="editPaymentCard.state" />
				</label>
			<fmt:message key="editProfile.state.code.counter" var="loopEndPoint" />
				<select id="editCrdPmtState">
                    <option value="">
                        <fmt:message key="editProfile.state.codeOption.0" />
                    </option>
					 <c:forEach var="i" begin="1" end="${loopEndPoint }">
            			<option value="<fmt:message key="editProfile.state.codeValue.${i}" />">
							<fmt:message key="editProfile.state.codeOption.${i}" />
						</option>
			          </c:forEach>
				</select>
				
				</div>
			<div class="card_field_sep">
				<label>
					<fmt:message key="editPaymentCard.zip" />
				</label>
				<input type="tel"  id="editCrdPmtZip" maxlength="5" minlength="1" onkeypress="return isNumberKey(event)"/>
				</div>
			<!-- <div class="card_field_sep">
				<label>
					Phone:
				</label>
				<input type="text"  id="editCrdPmtPhone" maxlength="10"  onkeypress="return isNumberKey(event)"/>
				</div> -->
			<div class="card_field_sep txt_nwmiddle">
				<input type="button" id="editCrdPmtDelete" class="vesta_card_del_btn" onclick="handleDeletePaymentCard(getCookie('cardId'));" 
				value="Delete" /> 
				<input  type="button" id="editCrdPmtSave" class="vesta_card_sv_btn"  onclick="makeRequestObjForEditCardOnSave();" 
				value="Save" />
				<input type="button" value="Back" class="vesta_card_back_btn" id="backEditPmtCard">
			</div>	
                   
	</div>
	</div>
