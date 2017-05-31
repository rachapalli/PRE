<%@ page import="java.util.Locale" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!doctype html>

<!--[if gt IE 7]><!-->
<html class="no-js" lang="en" itemscope>

<c:set var="loc" value="${cookie['locale'].value}"/>
<c:if test="${empty loc}">
    <c:set var="loc" value="en_US"/>
</c:if>

<fmt:setLocale value="${loc}"/>
<fmt:setBundle basename="opp"/>

<head>
    <meta charset="utf-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title><fmt:message key="login.title"/></title>
    <meta name="description" content=""/>
    <meta name="keywords" content=""/>

    <!-- Mobile viewport optimized: j.mp/bplateviewport -->
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui"/>
    <link rel="stylesheet" href="resources/css/imports.css">

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
    <![endif]-->
    <!-- Ends HTML5 elements compatibility for IE8 -->
    <script src="resources/js/libs/jquery-1.8.3.min.js"></script>
    <script src="resources/js/libs/easyjquery.js"></script>
    <script src="resources/js/libs/gumby.min.js"></script>
    <script src="resources/js/libs/jquery.dataTables.min.js"></script>
    <script src="resources/js/all.js"></script>
    
</head>

<body>
<!--[if lt IE 9]>
<p class="oldBrowser">
    <fmt:message key="update.browserMessage"/>
</p>
<![endif]-->
<div class="body_bg">&nbsp;</div>

<div class="container">
    <c:choose>
        <c:when test="${requestScope.allowAppIdSelection}">

            <!-- Include header_login.jsp for Header Section -->
            <%@include file="/WEB-INF/jsp/header_login.jsp" %>
            <!-- End of Header Section -->
            <section class="row login_row">
                <form name="myForm" action="home.jsp" method="get" class="mrgn_top">
                    <label>
                        <fmt:message key="index.title"/>
                        <select name="resourceAppId">
                            <option value="1"><fmt:message key="index.opt0"/></option>
                            <%
                                ResourceBundle opp = ResourceBundle.getBundle("opp", Locale.US);
                                String appIdValue;
                                for (int i = 0; i < 50; i++) {
                                    try {
                                        appIdValue = opp.getString("selectAppId.value" + i);
                            %>
                            <option value="<%=i%>">(<%=i%>) <%=appIdValue%>
                            </option>
                            <%
                                    } catch (Throwable t) {
                                        //skip that app id.
                                    }
                                }
                            %>
                        </select>
                    </label>
                    <input type="submit" name="submit" value="Go To Home" onclick="document.myForm.action='home.jsp';"/>
                    <br/>
                    <input type="submit" name="verifyBundle" value="Validate Bundle" onclick="document.myForm.action='validateBundle.jsp';"/>
                     <br/>
                    
                </form>
                <input type="submit" name="submit" value="Add Biller" onclick="location.href='adToBiller.html?resourceAppId=6&billerCorpId=1005';"/>
            </section>

        </c:when>
        <c:otherwise>
            <div class="clear"></div>
            <section class="row login_row">
                <fmt:message key="index.error"/>
            </section>
        </c:otherwise>
    </c:choose>


    <%
        String x = request.getHeader("X-Forwarded-For");
        String remoteAddr = request.getRemoteAddr();
        out.println("<br/>X-Forwarded-For=" + x);
        out.println("<br/>remoteAddr=" + remoteAddr);
    %>
</div>

<!--! end of #container -->
</body>
</html>
