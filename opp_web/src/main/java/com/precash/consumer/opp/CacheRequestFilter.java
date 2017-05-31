package com.precash.consumer.opp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.ResourceBundle;

/**
 * Sets cache headers based on matching url patterns configured in oppConfig.properties.
 */
public class CacheRequestFilter implements Filter {
    private static transient final Log LOGGER = LogFactory.getLog(CacheRequestFilter.class);


    public void init(FilterConfig filterConfig) throws ServletException {


    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        ResourceBundle oppConfig = ResourceBundle.getBundle("oppConfig");
        String[] urls = oppConfig.getString("cacheHeader.urls").split("~");
        String[] times = oppConfig.getString("cacheHeader.timesSec").split("~");

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        String requestUri = httpServletRequest.getRequestURI();

        boolean headerSet = false;
        for (int i = 0; i < urls.length; i++) {
            String url = urls[i];

            if (requestUri.matches(url)) {

                //set cache based on time.
                httpServletResponse.setHeader("Cache-Control", times[i] + ", must-revalidate");
                long date = Long.parseLong(times[i]) * 1000L + System.currentTimeMillis();
                httpServletResponse.setDateHeader("Expires", date);
                if (LOGGER.isTraceEnabled()) {
                    LOGGER.trace("setting Cache header: Cache-Control=" + times[i] + " for " + requestUri);
                    LOGGER.trace("setting Cache header: Expires=" + new Date(date) + " for " + requestUri);
                }
                headerSet = true;
                break;
            }
        }

        if (!headerSet) {
            //set no cache.
            httpServletResponse.setHeader("Cache-Control", "no-cache, must-revalidate");
            httpServletResponse.setDateHeader("Expires", 0);
            if (LOGGER.isTraceEnabled()) {
                LOGGER.trace("setting Cache header: Cache-Control=no-cache for " + requestUri);
                LOGGER.trace("setting Cache header: Expires=" + new Date(0) + " for " + requestUri);
            }


        }

        filterChain.doFilter(request, response);

    }


    public void destroy() {

    }
}
