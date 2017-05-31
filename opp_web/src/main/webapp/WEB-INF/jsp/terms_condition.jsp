<div class="backdrop"></div>
<div class="inner_box mrgn_popup_top term_cond_holder">
    <div class="term_cond_wrapper">
        <object type="text/html" id="terms_conditions" class="term_cond_box"></object>
    </div>
    <div class="top-margin term_cond_btn_area">
        <input type="checkbox" id="chkAcceptTerms" name="chkAcceptTerms" class="mrgn_lft" onchange="enableDisableContinueButton()">
        <span class="term_cond_txt"><label for="chkAcceptTerms"><fmt:message key="login.acpttermId"/></label></span>
        <div class="terms_button_holder">
            <input type="button" id="termCont" class="grey_terms_cond_btn terms_cond_btn" onclick="acceptTermCndChkBox();" value=<fmt:message key="login.continue"/>
                disabled="disabled" />
            <input type="button" id="terms_cancel_btn" class="grey_terms_cond_btn terms_cond_btn" value=<fmt:message key="login.cancel"/> onclick="close_box()" />
            </div>
    </div>
</div>