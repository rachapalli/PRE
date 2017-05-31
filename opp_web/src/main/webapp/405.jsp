<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--><!--<![endif]-->
<!--[if gt IE 7]><!-->
<html class="no-js" lang="en" itemscope>

<c:set var="resourceAppId" value="${requestScope.resourceAppId}"/>
<c:set var="reqLocale" value="${param.lang}"/>
<c:set var="loc" value="en_US"/>
<c:if test="${!empty resourceAppId}">
    <c:set var="loc" value="${loc}_${resourceAppId}"/>
</c:if>
<fmt:setLocale value="${loc}"/>
<fmt:setBundle basename="opp"/>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
    <title><fmt:message key="errorJsp.titleOf405"/></title>
    <meta name="description" content="">
    <link rel="stylesheet" href="resources/css/${resourceAppId}/error.css">
    <link rel="shortcut icon" type="image/x-icon" href="resources/images/favicon.ico">
    <c:choose>
        <c:when test="${!empty resourceAppId}">
            <link rel="stylesheet" href="resources/css/${resourceAppId}/imports.css">
        </c:when>
    </c:choose>


</head>
<body>
<%@ include file="googleAnalytics.jspf" %>

<div class="wrap-error">

    <h1></h1>

    <h2><fmt:message key="errorJsp.none"/></h2>

    <p><fmt:message key="errorJsp.messageOf405"/></p>

    <button class="pure-button pure-button-blue primary-cta"
            onClick="location.href = 'home.jsp?resourceAppId=${resourceAppId}'">
        <fmt:message key="errorJsp.returnHomeMsg"/>
    </button>

</div>
<!-- end contain -->
<p class="center"><fmt:message key="errorJsp.errorOf405"/></p>


</body>
</html>
