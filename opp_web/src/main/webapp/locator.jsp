<%@ page import="java.util.Locale"%>
<%@ page import="java.util.ResourceBundle"%>
<%@ page import="java.util.Set"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"
	session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<!--[if gt IE 7]>
<html class="no-js" lang="en" itemscope><![endif]-->
<%@ include file="commonPreHeader.jspf"%>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title><fmt:message key="locator.title" /></title>
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
            deviceHeight = document.documentElement.clientHeight;
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

<c:choose>
	<c:when test="${!empty resourceAppId}">
		<link rel="stylesheet"
			href="resources/css/${resourceAppId}/imports.css">
	</c:when>
</c:choose>
<script
	src="<fmt:message key="locator.googleMapsApiScriptUrl">
		       <fmt:param value="${requestScope.googleMapsApiKey}"/>
		    </fmt:message>">
</script>
<script src="resources/js/libs/jquery-1.8.3.min.js"></script>
<script src="resources/js/libs/jquery.nicescroll.min.js"></script>
<script src="resources/js/libs/modernizr-custom.js"></script>
<script src="resources/js/libs/polyfiller.js"></script>
<script src="resources/js/libs/geolocation.js"></script>

<script src="resources/js/utility/bookmarks.js"></script>
<script src="resources/js/utility/Utilities.js"></script>
<script src="resources/js/utility/fieldValidator.js"></script>
<script src="resources/js/locator/locator_left_navigator.js"></script>
<script src="resources/js/locator/locator_map.js"></script>

<script src="resources/js/api/api_general_ajax_call.js"></script>
<script src="resources/js/api/api_ajax_call.js"></script>
<script src="resources/js/api/api_parser.js"></script>
<script src="resources/js/api/api_constant.js"></script>
<script src="resources/js/api/api_error_handler.js"></script><!-- -->


<!-- Script included after simple optimization done 
<script src="resources/js/locator/all_locator.js"></script> -->
<%@ include file="commonHeader.jspf"%>
</head>

<body onload="init_locator_page(${resourceAppId}, messages,  '${param.utm_source}', '${param.utm_campaign}');">
	<%@ include file="googleAnalytics.jspf"%>

	<!--[if lt IE 9]>
	<p class="oldBrowser"> 
	<fmt:message key="update.browserMessage" />
	</p>
<![endif]-->
	<!-- <div id="topLocatorHeadBg" class="body_bg">&nbsp;</div> -->
	<div id="locatorContainer" class="container">
		<div class="wrapper_area">
			<!-- Include progress_bar.jsp to show Progress_Bar on page load -->
			<%@include file="/WEB-INF/jsp/progress_bar.jsp"%>
			<!-- End of Progress_Bar Section -->

			<!-- Include header_login.jsp for Header Section -->
			<%@include file="/WEB-INF/jsp/header.jsp"%>
			<!-- End of Header Section -->

			<section class="row"> <!-- Include locator_map.jsp to show Locator_MAP Section -->
			<%@include file="/WEB-INF/jsp/locator_map.jsp"%>
			<!-- End of Locator_MAP Section --> <!-- Include inline_error_message.jsp for Error slid down message -->
			<%@include file="/WEB-INF/jsp/inline_error_message.jsp"%>
			<!-- End of inline_error_message.jsp --> <!-- Include inline_message.jsp to for Success slid down message -->
			<%@include file="/WEB-INF/jsp/inline_success_message.jsp"%>
			<!-- End of inline_success_message.jsp --> <!-- Include footer_popup.jsp to show footer popup -->
			<%@include file="/WEB-INF/jsp/footer_popup.jsp"%>
			<!-- End of show footer_popup Section --> </section>

			<!-- Include footer.jsp for Language_Selection Section -->
			<div id="home_footer" class="footer">
				<%@include file="/WEB-INF/jsp/footer.jsp"%>
			</div>
			<!-- End of Footer Section -->
		</div>
		<div id="accountInfoId" class="account_infoarea txt_inv">
			<div>
				<!-- Include my_account_area.jsp for my_account_area Section -->
				<%@include file="/WEB-INF/jsp/my_account_area.jsp"%>
				<!-- End of Selected_Payment_Area Section -->
			</div>
		</div>
		<div  id="signUpGuestLocatorId" class="account_infoarea txt_inv">
			<!-- Include my_account_area.jsp for my_account_area Section -->
			<%@include file="/WEB-INF/jsp/sign_up_guest.jsp"%>
			<!-- End of Selected_Payment_Area Section -->
		</div>

	</div>
</body>
</html>
