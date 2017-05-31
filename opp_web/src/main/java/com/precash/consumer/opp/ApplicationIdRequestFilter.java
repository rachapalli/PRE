package com.precash.consumer.opp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

/**
 * TODO: fill in JavaDoc.
 */
public class ApplicationIdRequestFilter implements javax.servlet.Filter {
    private static transient final Log LOGGER = LogFactory.getLog(ApplicationIdRequestFilter.class);

    private Map<Integer, String> applicationUrlExpressions = new LinkedHashMap<Integer, String>();
    private String[] exclusions;
    private boolean allowAppIdSelection;
    private String selectAppPath;

    public void init(FilterConfig filterConfig) throws ServletException {

        ResourceBundle oppConfig = ResourceBundle.getBundle("oppConfig");
        Enumeration<String> keys = oppConfig.getKeys();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            if (key.startsWith("applicationId")) {
                String[] parts = key.split("_");
                int appId = Integer.parseInt(parts[1]);
                String expression = oppConfig.getString(key);
                applicationUrlExpressions.put(appId, expression);
            }
        }

        allowAppIdSelection = "true".equalsIgnoreCase(oppConfig.getString("allowAppIdSelection"));

        String exclusionsConfig = filterConfig.getInitParameter("exclusions");
        if (null == exclusionsConfig) {
            exclusionsConfig = "";
        }
        exclusions = exclusionsConfig.split(",");

        selectAppPath = filterConfig.getInitParameter("selectAppPath");
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        request.setAttribute("allowAppIdSelection", allowAppIdSelection);

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String requestUri = httpServletRequest.getRequestURI();

        boolean needResourceAppId = determineResourceAppIdNeeded(requestUri);

        if (needResourceAppId) {

            int applicationId = findApplicationIdForRequest(httpServletRequest);
            request.setAttribute("resourceAppId", applicationId);

            if (applicationId > 0) {

                ResourceBundle oppConfig = ResourceBundle.getBundle("oppConfig");
                String googleMapsApiKey = oppConfig.getString("googleMapsApiKey_" + applicationId);
                LOGGER.debug("googleMapsApiKey for app Id=" + applicationId + " is: " + googleMapsApiKey);
                request.setAttribute("googleMapsApiKey", googleMapsApiKey);

                filterChain.doFilter(request, response);
            } else {
                LOGGER.warn("redirecting to selectAppId page. from:'" + requestUri + "', to:'" + selectAppPath + "'");
                request.getRequestDispatcher(selectAppPath).forward(request, response);
            }

        } else {
            filterChain.doFilter(request, response);
        }

    }

    private boolean determineResourceAppIdNeeded(String requestUri) {
        for (String exclusion : exclusions) {
            if (requestUri.matches(exclusion)) {
                return false;
            }
        }
        return !requestUri.contains("selectAppId");
    }

    private int findApplicationIdForRequest(HttpServletRequest httpServletRequest) {
        String requestUri = httpServletRequest.getRequestURI();

        Set<Integer> appIds = applicationUrlExpressions.keySet();
        Map<String, String> parameterMap = httpServletRequest.getParameterMap();
        Set<String> parameterNames = parameterMap.keySet();
        String appNameHeader = httpServletRequest.getHeader("app_name");
        String host = httpServletRequest.getHeader("host");
        StringBuilder testString = new StringBuilder();
        testString.append(host);
        testString.append(requestUri);
        testString.append(";app_name=");
        testString.append(appNameHeader);

        if (parameterNames.size() > 0) {
            testString.append("?");
            for (String param : parameterNames) {
                String paramValue = httpServletRequest.getParameter(param);
                testString.append(param).append("=").append(paramValue).append("&");
            }
        }

        String testValue = testString.toString();

        if (null != appNameHeader) {
            //first let app_name header be the one that finds the appId first, if possible.
            for (Integer appId : appIds) {
                String expression = applicationUrlExpressions.get(appId);
                if (appNameHeader.matches(expression)) {
                    LOGGER.debug(
                            "appId determined by matching app_name header: '" + appNameHeader + "', appId=" + appId);
                    return appId;
                }
            }
        }

        //if the appNameHeader isn't set then we let the url find it.
        for (Integer appId : appIds) {
            String expression = applicationUrlExpressions.get(appId);
            if (testValue.matches(expression)) {
                LOGGER.debug("appId determined from '" + testValue + "', matches '" + expression + "', appId=" + appId);
                return appId;
            }
        }

        LOGGER.warn(
                "oppConfig.properties did not have an applicationId that matches the request uri:" +
                        testValue);
        return 0;
    }

    public void destroy() {

    }
}
