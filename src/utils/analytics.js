/**
 * Analytics Utilities
 * Privacy-first user behavior tracking utilities
 */

// Track custom events with PostHog
export function trackEvent(eventName, properties = {}) {
  if (
    typeof window !== 'undefined' &&
    window.posthog &&
    !window.posthog.has_opted_out_capturing()
  ) {
    window.posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
    });
  }
}

// Track page views manually
export function trackPageView(pageName = document.title) {
  trackEvent('page_viewed', {
    page_name: pageName,
    referrer: document.referrer,
  });
}

// Track business-specific events
export function trackContactMethod(method, details = {}) {
  trackEvent('contact_method_clicked', {
    contact_method: method,
    ...details,
  });
}

export function trackProductInquiry(product, source = 'unknown') {
  trackEvent('product_inquiry', {
    product_name: product,
    inquiry_source: source,
  });
}

export function trackFormInteraction(formId, action, fieldName = null) {
  trackEvent('form_interaction', {
    form_id: formId,
    action, // 'focus', 'blur', 'submit', 'error'
    field_name: fieldName,
  });
}

export function trackDownload(fileName, fileType = 'unknown') {
  trackEvent('file_downloaded', {
    file_name: fileName,
    file_type: fileType,
  });
}

// Privacy controls
export function optOutAnalytics() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('analytics-opt-out', 'true');
    if (window.posthog) {
      window.posthog.opt_out_capturing();
    }
  }
}

export function optInAnalytics() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('analytics-opt-out');
    if (window.posthog) {
      window.posthog.opt_in_capturing();
    }
  }
}

export function getAnalyticsOptStatus() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('analytics-opt-out') !== 'true';
  }
  return false;
}
