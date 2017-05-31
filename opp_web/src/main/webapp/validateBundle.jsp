<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="java.util.*" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title></title>
</head>
<body>


<%
    ResourceBundle.clearCache();
    Set<String> allKeys = new TreeSet<String>();
    HashMap<String, String> englishValues = new HashMap<String, String>();
    HashMap<String, String> spanishValues = new HashMap<String, String>();

    Integer resourceAppId = (Integer) request.getAttribute("resourceAppId");

    Locale englishLocale = new Locale("en", "US", resourceAppId.toString());
    ResourceBundle oppEnglish = ResourceBundle.getBundle("opp", englishLocale);

    Enumeration<String> keys = oppEnglish.getKeys();
    while (keys.hasMoreElements()) {
        String key = keys.nextElement();
        allKeys.add(key);
        englishValues.put(key, oppEnglish.getString(key));
    }

    Locale spanishLocale = new Locale("es", "US", resourceAppId.toString());
    ResourceBundle oppSpanish = ResourceBundle.getBundle("opp", spanishLocale);

    keys = oppSpanish.getKeys();
    while (keys.hasMoreElements()) {
        String key = keys.nextElement();
        allKeys.add(key);
        spanishValues.put(key, oppSpanish.getString(key));
    }


%>
<h1>ResourceAppId = <c:out value="${requestScope.resourceAppId}"/></h1>

<table border="1" width="100%">
    <tr>
        <td>Key</td>
        <td width="35%">English</td>
        <td width="35%">Spanish</td>
    </tr>
    <%
        for (String allKey : allKeys) {
    %>

    <tr>
        <td>
            <%=allKey%>
        </td>
        <td>
            <%=null != englishValues.get(allKey) ? StringEscapeUtils.escapeHtml(
                    englishValues.get(allKey)) : "<span style=\"color: red; font-weight: bolder\">NULL</span>" %>
        </td>
        <td>
            <%=null != spanishValues.get(allKey) ? StringEscapeUtils.escapeHtml(
                    spanishValues.get(allKey)) : "<span style=\"color: red; font-weight: bolder\">NULL</span>" %>
            <%
                if (null != spanishValues.get(allKey)) {
                    if (spanishValues.get(allKey).equals(englishValues.get(allKey))) {
            %>
            <span style="color: red; font-weight: bolder">NOT TRANSLATED</span>
            <%
                    }
                }
            %>
        </td>
    </tr>

    <%
        }
    %>
</table>


</body>
</html>