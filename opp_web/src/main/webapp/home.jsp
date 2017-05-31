
<%
	HttpServletResponse httpResponse = (HttpServletResponse) response;
	httpResponse.setHeader("Cache-Control",
			"no-cache, no-store, must-revalidate");
	response.setHeader("Expires", "Sat, 6 May 1995 12:00:00 GMT");
	response.addHeader("Cache-Control", "post-check=0, pre-check=0");
	httpResponse.setHeader("Pragma", "no-cache");
	httpResponse.setDateHeader("Expires", 0);
%>
<%@ page import="java.util.Locale"%>
<%@ page import="java.util.ResourceBundle"%>
<%@ page import="java.util.Set"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"
	session="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!doctype html>

<!--[if gt IE 7]>
<html class="no-js" lang="en" itemscope><![endif]-->

<%@ include file="commonPreHeader.jspf"%>

<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

<title><fmt:message key="login.title" /></title>
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
    if ( !standalone && !safari) {
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
	      
	<link rel="stylesheet" type="text/css" href="resources/css/ie8.css" />
	    <![endif]-->
<!-- Ends HTML5 elements compatibility for IE8 -->

<script src="resources/js/libs/jquery-1.8.3.min.js"></script>
<script src="resources/js/libs/easyjquery.js"></script>
<script src="resources/js/libs/gumby.min.js"></script>
<script src="resources/js/libs/jquery.dataTables.min.js"></script>

<script src="resources/js/utility/bookmarks.js"></script>
<script src="resources/js/utility/Utilities.js"></script>
<script src="resources/js/login/login.js"></script>
<script src="resources/js/login/tempPassword.js"></script>
<script src="resources/js/login/resetPassword.js"></script>

<script src="resources/js/api/api_general_ajax_call.js"></script>
<script src="resources/js/api/api_ajax_call.js"></script>
<script src="resources/js/api/api_parser.js"></script>
<script src="resources/js/api/api_constant.js"></script>
<script src="resources/js/api/api_error_handler.js"></script><!-- -->

<!-- Script included after simple optimization done 
<script src="resources/js/all.js"></script> -->  

<script type="text/javascript">
    if( getCookie("isLocatorLoaded") === "true" || getCookie("isCreateProfileLoaded") === "true" || getCookie("isUserChangeLanguage") === "true"){
    	setCookie("isLocatorLoaded", false);
    	setCookie("isCreateProfileLoaded", false);
    	setCookie("isUserChangeLanguageLogin", false);
    } else if("" != getCookie("userId") && null != getCookie("userId")  && undefined != getCookie("userId")){
    	window.history.forward(1);
    }
</script>

<%@ include file="commonHeader.jspf"%>

</head>

<body
	onLoad="init_login_page(${resourceAppId}, '${param.utm_source}', '${param.utm_campaign}', messages);">
	<%@ include file="googleAnalytics.jspf"%>

	<!--[if lt IE 9]>
	<p class="oldBrowser"> 
	<fmt:message key="update.browserMessage" />
	</p>
<![endif]-->
	<!-- Include progress_bar.jsp to show Progress_Bar on page load -->
	<%@include file="/WEB-INF/jsp/progress_bar.jsp"%>
	<!-- End of Progress_Bar Section -->

	<!-- <div id="topHeadBg" class="body_bg"></div> -->
	<div class="login_main_container txt_inv" id="loginContainerDiv">
		<div class="wrapper_area">
			<!-- Include header_login.jsp for Header Section -->
			<%@include file="/WEB-INF/jsp/header_login.jsp"%>
			<!-- End of Header Section -->

			<!-- Include inline_message.jsp to for Success slid down message -->
			<%@include file="/WEB-INF/jsp/inline_success_message.jsp"%>
			<!-- End of mobile_more.jsp -->

			<!-- Include inline_error_message.jsp for Error slid down message -->
			<%@include file="/WEB-INF/jsp/inline_error_message.jsp"%>
			<!-- End of mobile_more.jsp -->

			<section id="login_sec" class="login_row">
				<!-- Include login_area.jsp for Login Section -->
				<%@include file="/WEB-INF/jsp/login_area.jsp"%>
				<!-- End of Login Section -->
			</section>

			<!-- Include footer.jsp for footer link Section -->
			<div id="home_footer" class="footer">
				<%@include file="/WEB-INF/jsp/footer_login.jsp"%>
			</div>
			<!-- End of Footer Section -->

			<%--include footer popup so links at bottom are viewable--%>
			<%@include file="/WEB-INF/jsp/footer_popup.jsp"%>
			<!-- End of Footer popup Section -->
		</div>
		<div class="account_infoarea">
			<!-- Include my_account_area.jsp for my_account_area Section -->
			<%@include file="/WEB-INF/jsp/sign_up_guest.jsp"%>
			<!-- End of Selected_Payment_Area Section -->
		</div>
	</div>

	<!-- Include terms_condition.jsp to show Terms_Condition Section as pop up -->
	<%@include file="/WEB-INF/jsp/terms_condition.jsp"%>
	<!-- End of Terms_Condition Section -->

	<!--! end of #container -->
</body>
</html>
