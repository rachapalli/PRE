<%@ page import="java.util.Locale"%>
<%@ page import="java.util.ResourceBundle"%>
<%@ page import="java.util.Set"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!doctype html>

<!--[if gt IE 7]>
<html class="no-js" lang="en" itemscope><![endif]-->

<%@ include file="commonPreHeader.jspf"%>

<c:set var="isChkoutEnabled" value="${cookie['chkoutEnabled'].value}" scope="request" />
<c:set var="userIdForUser" value="${cookie['userId'].value}" scope="request" />
<c:set var="category" value="${cookie['category'].value}" scope="request" />


<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="description" content="" />
<meta name="keywords" content="" />

<!-- Mobile viewport optimized: j.mp/bplateviewport -->
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
<script type="text/javascript">
    var standalone = window.navigator.standalone,
            userAgent = window.navigator.userAgent.toLowerCase(),
            safari = /safari|firefox|chrome|opera|msie|windows/.test( userAgent ),
            deviceHeight = document.documentElement.clientHeight+1;
    if ( !standalone && !safari ) {
        var viewPortTag=document.createElement('meta');
        viewPortTag.name = "viewport";
        viewPortTag.content = "height="+deviceHeight;
        document.getElementsByTagName('head')[0].appendChild(viewPortTag);
    }
</script>
<link rel="stylesheet" href="resources/css/imports.css">
<link rel="stylesheet" href="resources/css/font-awesome.min.css">
<link rel="shortcut icon" type="image/x-icon" href="resources/images/favicon.ico">

<!-- HTML5 elements compatibility for IE8 -->
<!--[if lt IE 9]>
    <script type="text/javascript">
        document.createElement("article");
        document.createElement("aside");
        document.createElement("details");
        document.createElement("figcaption");
        document.createElement("figure");
        document.createElement("footer");
        document.createElement("header");
        document.createElement("hgroup");
        document.createElement("menu");
        document.createElement("nav");
        document.createElement("section");
    </script>

    <link rel="stylesheet" type="text/css" href="resources/css/ie8.css"/>
    <![endif]-->
<!-- Ends HTML5 elements compatibility for IE8 -->

<!--[if gte IE 9]>
    <style type="text/css">
        .gradient {
            filter: none;
        }
    </style>
    <![endif]-->

<c:choose>
	<c:when test="${!empty resourceAppId}">
		<link rel="stylesheet"
			href="resources/css/${resourceAppId}/imports.css">
	</c:when>
</c:choose>
<%@include file="/WEB-INF/jsp/progress_bar.jsp"%>
<script src="resources/js/libs/jquery-1.8.3.min.js"></script>
<script src="resources/js/libs/jquery-ui.min.js"></script>
<script src="resources/js/libs/jquery.dataTables.min.js"></script>
<script src="resources/js/libs/jquery.caret.js"></script>
<script src="resources/js/libs/jquery.nicescroll.min.js"></script>
<script src="resources/js/libs/vesta.token-1.1.0.js"></script>

<!-- <script src="resources/js/utility/bookmarks.js"></script>
<script src="resources/js/utility/Utilities.js"></script>
<script src="resources/js/utility/currencySort.js"></script>
<script src="resources/js/utility/fieldValidator.js"></script>
<script src="resources/js/main_pay_page/button_events.js"></script>
<script src="resources/js/main_pay_page/pay_your_bill_area.js"></script>
<script src="resources/js/main_pay_page/selected_pay_area.js"></script>
<script src="resources/js/main_pay_page/latest_payment.js"></script>
<script src="resources/js/main_pay_page/add_edit_biller.js"></script>
<script src="resources/js/main_pay_page/auxiliary_add_edit_biller.js"></script>
<script src="resources/js/main_pay_page/biller_search.js"></script>
<script src="resources/js/main_pay_page/user_edit_profile.js"></script>
<script src="resources/js/main_pay_page/summary_receipt.js"></script>
<script src="resources/js/main_pay_page/details_receipt.js"></script>
<script src="resources/js/main_pay_page/billview_receipt.js"></script>
<script src="resources/js/main_pay_page/add_payment.js"></script>
<script src="resources/js/main_pay_page/schedule_payment_hist.js"></script>
<script src="resources/js/main_pay_page/confirmation_view.js"></script>
<script src="resources/js/cards/add_payment_cards.js"></script>
<script src="resources/js/cards/get_payment_cards.js"></script>
<script src="resources/js/cards/edit_payment_card.js"></script>
<script src="resources/js/cards/delete_payment_card.js"></script>
<script src="resources/js/guest/chkOutPaymentReceiptCreateProf.js"></script>
<script src="resources/js/guest/create_acc_guest.js"></script>
<script src="resources/js/guest/getCart.js"></script>
<script src="resources/js/guest/addCartItem.js"></script>
<script src="resources/js/guest/submitCart.js"></script>
<script src="resources/js/guest/checkCartStatus.js"></script>
<script src="resources/js/guest/add_payment_method.js"></script>
<script src="resources/js/guest/create_payment_options.js"></script>
<script src="resources/js/main_pay_page/switch_funding_source.js"></script>
<script src="resources/js/main_pay_page/manage_profile.js"></script>
<script src="resources/js/cards/manage_cards.js"></script>

<script src="resources/js/api/api_general_ajax_call.js"></script>
<script src="resources/js/api/api_ajax_call.js"></script>
<script src="resources/js/api/api_parser.js"></script>
<script src="resources/js/api/api_constant.js"></script>
<script src="resources/js/api/api_error_handler.js"></script> -->

<!-- Script included after simple optimization done -->
<script src="resources/js/all.js"></script>

<script type="text/javascript">
	VestaToken.init({
	    ServiceURL: localStorage.getItem("vestaTokenizationURL"),
	    AccountName: localStorage.getItem("vestaTokenizationUsername")
	});
	if(navigator.userAgent.match(/Android 4.0/i) 
			&& !(navigator.userAgent.match(/Chrome/i))) {
		var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = 'resources/css/android_4.0.css';
	    var js = document.createElement("script");
		js.type = "text/javascript";
		js.src = "resources/js/libs/iscroll-probe.js";
		head.appendChild(link);
		head.appendChild(js);
		$('.find_bill_bg').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		$('.head-sec').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		$('.footer').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		$('#accountInfoId').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		$('#signUpGuestId').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	}

</script>

<%@ include file="commonHeader.jspf"%>
<title><fmt:message key="main_pay.title" /></title>
</head>

<body onload="init_messages(${resourceAppId}, messages, '${param.billerCorpId}', '${param.utm_source}', '${param.utm_campaign}');">
	<%@ include file="googleAnalytics.jspf"%>
	<!--[if lt IE 9]>
<p class="oldBrowser">
    <fmt:message key="update.browserMessage"/>
</p>
<![endif]-->
	<!-- Facebook SDK integration -->
	<div id="fb-root"></div>
	<script>
    (function (d, s, id) {
        var js;
        var fjs = d.getElementsByTagName(s)[0];
        var mediaPartnerName = JSON.parse(localStorage.getItem("mediaNames"));
        var fbAppId = mediaPartnerName["FACEBOOK"];
        if (d.getElementById(id))
            return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=" + fbAppId;
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>

	<!-- 	<div id="topMainHeadBg" class="body_bg">&nbsp;</div> -->
	<div id="mainPageContainer" class="container">
		<div class="wrapper_area">
			<!-- Include header.jsp for Header Section -->
			<%@include file="/WEB-INF/jsp/header.jsp"%>
			<!-- End of Header Section -->
			<section class="row">
				<div id="section_row">
					<!-- Include pay_bill.jsp for Pay_Your_Bill_Area Section -->
					<%@include file="/WEB-INF/jsp/pay_bill.jsp"%>
					<!-- End of Pay_Your_Bill_Area Section -->
				</div>

				<div class="clear"></div>

				<!-- Include search_biller.jsp to show Find_Biller Section -->
				<%@include file="/WEB-INF/jsp/search_biller.jsp"%>
				<!-- End of Find_Biller Section -->

				<!-- Include payment_confirmation.jsp to show payment confirmation Section -->
				<%@include file="/WEB-INF/jsp/payment_confirmation.jsp"%>
				<!-- End of Find_Biller Section -->

				<!-- Include add_edit_biller.jsp to show add/edit biller Section -->
				<%@include file="/WEB-INF/jsp/add_edit_biller.jsp"%>
				<!-- End of Find_Biller Section -->

				<!-- Include auxiliary_add_edit_biller.jsp to show Biller State List Section -->
				<%@include file="/WEB-INF/jsp/auxiliary_add_edit_biller.jsp"%>
				<!-- End of auxiliary_add_edit_biller Section -->

				<!-- Include payment_history.jsp to show payment history Section -->
				<%@include file="/WEB-INF/jsp/payment_history.jsp"%>
				<!-- End of payment history Section -->

				<!-- Include paymentReceipt.jsp to show Payment Receipt Section -->
				<%@include file="/WEB-INF/jsp/paymentReceipt.jsp"%>
				<!-- End of Payment Receipt Section -->

				<!-- Include user_edit_profile.jsp to show Edit_Profile Section -->
				<%@include file="/WEB-INF/jsp/user_edit_profile.jsp"%>
				<!-- End of Edit_Profile Section -->

				<!-- Include profile.jsp Section -->
				<%@include file="/WEB-INF/jsp/profile.jsp"%>
				<!-- End of Pay_Your_Bill_Area Section -->
				
				<!-- Include manage_cards.jsp to show the manage cards Section -->
				<%@include file="/WEB-INF/jsp/manage_cards.jsp"%>
				<!-- End of Pay_Your_Bill_Area Section -->
				
				<!-- Include user_edit_profile_security.jsp to show edit profile Area Section -->
				<%@include file="/WEB-INF/jsp/user_edit_profile_security.jsp"%>
				<!-- End of user_edit_profile_security.jsp Section -->

				<!-- Include balance_detail.jsp to show balance detail Section -->
				<%-- <%@include file="/WEB-INF/jsp/balance_detail.jsp" %> --%>
				<!-- End of show balance detail Section -->

				<!-- Include add_money.jsp to show Add money detail Section -->
				<%-- <%@include file="/WEB-INF/jsp/add_money.jsp" %> --%>
				<!-- End of show balance detail Section -->

				<!-- Include mobile_more.jsp to show more screen on mobile -->
				<%@include file="/WEB-INF/jsp/mobile_more.jsp"%>
				<!-- End of mobile_more.jsp -->

				<!-- Include inline_error_message.jsp for Error slide down message -->
				<%@include file="/WEB-INF/jsp/inline_error_message.jsp"%>
				<!-- End of inline_error_message.jsp -->

				<!-- Include inline_message.jsp to for Success slide down message -->
				<%@include file="/WEB-INF/jsp/inline_success_message.jsp"%>
				<!-- End of mobile_more.jsp -->

				<!-- Include add_money.jsp to show Add money detail Section -->
				<%@include file="/WEB-INF/jsp/checkout.jsp"%>
				<!-- End of show balance detail Section -->

				<!-- Include history_summary_view.jsp to show history summary view Section -->
				<%@include file="/WEB-INF/jsp/history_summary_view.jsp"%>
				<!-- End of  show history summary view Section -->

				<!-- Include history_detail_view.jsp to show history detail view Section -->
				<%@include file="/WEB-INF/jsp/history_detail_view.jsp"%>
				<!-- End of show history detail view Section -->

				<!-- Include checkout_payment_summary_view.jsp to show payment summary of checkout flow -->
				<%@include file="/WEB-INF/jsp/chkout_payment_summary_view.jsp"%>
				<!-- End of show payment summary Section -->

				<!-- Include footer_popup.jsp to show footer pop-up -->
				<%@include file="/WEB-INF/jsp/footer_popup.jsp"%>
				<!-- End of show footer pop-up Section -->
				
				<!-- Include popup_edit_card_confirmation.jsp to show confirmation error message for edit card section pop-up -->
				<%@include file="/WEB-INF/jsp/popups/popup_edit_card_confirmation.jsp"%>
				<!-- End of show footer pop-up Section -->
				
				<!-- Include popup_edit_card_confirmation_success.jsp to show confirmation error message for edit card section pop-up -->
				<%@include file="/WEB-INF/jsp/popups/popup_edit_card_confirmation_success.jsp"%>
				<!-- End of show footer pop-up Section -->
				
				<!-- Include popup_card_no_longer_for_scheduled_payments.jsp to show confirmation error message for edit card section pop-up -->
				<%@include file="/WEB-INF/jsp/popups/popup_card_no_longer_for_scheduled_payments.jsp"%>
				<!-- End of show footer pop-up Section -->
				
			</section>
			<!-- Include footer.jsp to show Footer Section -->
			<div class="footer">
				<%@include file="/WEB-INF/jsp/social_network.jsp"%>
				<%@include file="/WEB-INF/jsp/social_network_mob.jsp"%>
				<%@include file="/WEB-INF/jsp/footer.jsp"%>
			</div>
			<!-- End of Footer Section -->
		</div>

		<!-- Include general_success_alert.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_view_detail_error.jsp"%>
		<!-- End of popup_view_detail_error.jsp -->
		
		<!-- Include popup_outSide_click.jsp to show the manage cards Section -->
		<%@include file="/WEB-INF/jsp/popups/popup_outSide_click.jsp"%>
		<!-- End of popup_outSide_click.jsp Section -->
		
		<!-- pop up section for cvv  -->
		<%@ include file="/WEB-INF/jsp/popups/popup_ask_different_debit_card.jsp"%>
		<!-- pop up section for cvv -->

		<!-- Include pop_bill_status_view.jsp to show popup for bill status view in case of failed payments -->
		<%@include file="/WEB-INF/jsp/popups/popup_bill_status_view.jsp"%>
		<!-- End of  bill status view in case of failed payments -->

		<!-- pop up section starts in case of cut of time error -->
		<%@ include file="/WEB-INF/jsp/popups/popup_cash_user_error.jsp"%>
		<!-- pop up section ends in case of cut of time error -->

		<!-- Include popup_view_detail_no_error.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_view_detail_no_error.jsp"%>
		<!-- End of popup_view_detail_no_error.jsp -->

		<!-- pop up section starts in case of cut of time error -->
		<%@ include file="/WEB-INF/jsp/popups/popup_cutoff_time_error.jsp"%>
		<!-- pop up section ends in case of cut of time error -->

		<!-- Include popup_view_detail_no_error.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_daily_limit_alert.jsp"%>
		<!-- End of popup_view_detail_no_error.jsp -->

		<!-- Include popup_delete_manageCards.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_delete_manageCards.jsp"%>
		<!-- End of popup_delete_manageCards.jsp -->


		<!-- pop up section for cvv  -->
		<%@ include
			file="/WEB-INF/jsp/popups/popup_debit_card_payment_cvv.jsp"%>
		<!-- pop up section for cvv -->

		<!-- pop up delete scheduled popup  -->
		<%@ include
			file="/WEB-INF/jsp/popups/popup_delete_scheduled_card_error.jsp"%>
		<!-- pop up delete scheduled popup -->

		<!-- pop up section starts in case of guest user scheduling -->
		<%@ include file="/WEB-INF/jsp/popups/popup_guest_user_scheduling.jsp"%>
		<!-- pop up section ends in case of guest user scheduling -->

		<!-- Include popup_scheduled_payment.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_scheduled_payment.jsp"%>
		<!-- End of popup_scheduled_payment.jsp -->

		<!-- Include popup_credential_error.jsp  -->
		<%@include file="/WEB-INF/jsp/popups/popup_credential_error.jsp"%>
		<!-- End of popup_credential_error.jsp -->

		<!-- Include popup_credential_error.jsp  -->
		<%@include
			file="/WEB-INF/jsp/popups/popup_cancel_scheduled_payment.jsp"%>
		<!-- End of  popup_cancel_scheduled_payment.jsp -->

		<!-- Include popup_cancel_scheduled_failed.jsp  -->
		<%@include
			file="/WEB-INF/jsp/popups/popup_cancel_scheduled_failed.jsp"%>
		<!-- End of  popup_cancel_scheduled_failed.jsp -->
		
		<!-- Include popup_provider_credential_info.jsp  -->
		<%@include
			file="/WEB-INF/jsp/popups/popup_provider_credential_info.jsp"%>
		<!-- End of  popup_provider_credential_info.jsp -->
		
		<!-- Include popup_card_bill_pay.jsp to show pop up for add  card fee message -->
			<%@include file="/WEB-INF/jsp/popups/popup_card_bill_pay.jsp"%>
		<!-- End of show popup_card_bill_pay.jsp Section -->
		
		<!-- Include popup_payment_bill_pay.jsp to show pop up for add  card fee message -->
			<%@include file="/WEB-INF/jsp/popups/popup_payment_bill_pay.jsp"%>
		<!-- End of show popup_payment_bill_pay.jsp Section -->
		
		<!-- Include popup_bill_pay_fees.jsp to show pop up for add  card fee message -->
			<%@include file="/WEB-INF/jsp/popups/popup_bill_pay_fees.jsp"%>
		<!-- End of show popup_bill_pay_fees.jsp Section -->

		<div id="accountInfoId" class="account_infoarea txt_inv">
			<div>
				<!-- Include my_account_area.jsp for my_account_area Section -->
				<%@include file="/WEB-INF/jsp/my_account_area.jsp"%>
				<!-- End of Selected_Payment_Area Section -->
			</div>
		</div>
		<div id="signUpGuestId" class="account_infoarea txt_inv">
			<!-- Include my_account_area.jsp for my_account_area Section -->
			<%@include file="/WEB-INF/jsp/sign_up_guest.jsp"%>
			<!-- End of Selected_Payment_Area Section -->
		</div>
	</div>
	<!--! end of #container -->
</body>
</html>
