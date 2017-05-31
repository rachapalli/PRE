package com.precash.common.rest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.servlet.http.HttpSessionEvent;

/**
 * TODO: fill in JavaDoc.
 */
public class HttpSessionListener implements javax.servlet.http.HttpSessionListener {
    private static transient final Log LOGGER = LogFactory.getLog(HttpSessionListener.class);

    public void sessionCreated(HttpSessionEvent se) {
        Object source = se.getSource();
        LOGGER.warn("AN HTTP SESSION HAS BEEN CREATED investigate the source and kill it. source=" + source,
                    new IllegalStateException());

    }

    public void sessionDestroyed(HttpSessionEvent se) {

    }
}
