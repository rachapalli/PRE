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
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
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

<!-- Ends HTML5 elements compatibility for IE8 -->
<script src="resources/js/libs/jquery-1.8.3.min.js"></script>
<script src="resources/js/libs/jquery.caret.js"></script>
<script src="resources/js/libs/easyjquery.js"></script>
<script src="resources/js/libs/gumby.min.js"></script>
<script src="resources/js/libs/jquery.nicescroll.min.js"></script>
<script src="resources/js/libs/jquery.dataTables.min.js"></script>

<script src="resources/js/utility/currencySort.js"></script>
<script src="resources/js/utility/Utilities.js"></script>
<script src="resources/js/utility/fieldValidator.js"></script>
<script src="resources/js/utility/bookmarks.js"></script>
<script src="resources/js/login/createAccount.js"></script>
<script src="resources/js/guest/create_acc_guest.js"></script>

<script src="resources/js/api/api_general_ajax_call.js"></script>
<script src="resources/js/api/api_ajax_call.js"></script>
<script src="resources/js/api/api_parser.js"></script>
<script src="resources/js/api/api_constant.js"></script>
<script src="resources/js/api/api_error_handler.js"></script> 

<!-- Script included after simple optimization done  
<script src="resources/js/all.js"></script> --> 

<%@ include file="commonHeader.jspf"%>
</head>

<body onLoad="loadCreateAccountPage(${resourceAppId}, messages, '${param.utm_source}', '${param.utm_campaign}');">
<%@ include file="googleAnalytics.jspf"%>

	<!--[if lt IE 9]>
	<p class="oldBrowser"> 
	<fmt:message key="update.browserMessage" />
	</p>
<![endif]-->
	<div id="signUpContainerDiv" class="container mob_container">
		<div class="wrapper_area">
		<!-- Include header_login.jsp for Header Section -->
		<%@include file="/WEB-INF/jsp/header_login.jsp"%>
		<!-- End of Header Section -->

		<!-- Include mobile_more.jsp to show more screen on mobile -->
		<%@include file="/WEB-INF/jsp/mobile_more.jsp"%>
		<!-- End of mobile_more.jsp -->
		
		<!-- Include progress_bar.jsp to show Progress_Bar on page load -->
		<%@include file="/WEB-INF/jsp/progress_bar.jsp"%>
		<!-- End of Progress_Bar Section -->

		<!-- Include inline_error_message.jsp for Error slid down message -->
		<%@include file="/WEB-INF/jsp/inline_error_message.jsp"%>
		<!-- End of mobile_more.jsp -->
		<section id="createProfLogInRoWId" class="login_row">
			<!-- Include user_add_edit_profile.jsp for CREATE/EDIT Profile Section -->
			<%@include file="/WEB-INF/jsp/user_add_profile.jsp"%>
			<!-- End of CREATE/EDIT Profile Section -->
		</section>
			<!-- Include footer.jsp for Language_Selection Section -->
			<div id="home_footer" class="footer">
				<%@include file="/WEB-INF/jsp/footer_login.jsp"%>
			</div>
			<!-- End of Footer Section -->
		</div>
		
		
		<div class="account_infoarea">		
			<div class="signup_img_container mob_flt_none">
				<img src="" id="signUpImageRight" width="100%"/>
			</div>
		</div>		
		

		<!--Include footer popup so links at bottom are viewable-->
		<%@include file="/WEB-INF/jsp/footer_popup.jsp"%>
		<!-- End of Footer popup Section -->
	</div>
</body>
</html>
