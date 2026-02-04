/**
 * Link Validation Utility for SEO Crawlability
 * Ensures all links have proper href attributes for search engine crawling
 */

export function validateLinks() {
  if (typeof window === 'undefined') return;

  const links = document.querySelectorAll('a');
  const issues = [];

  links.forEach((link, index) => {
    const href = link.getAttribute('href');

    // Check for missing or invalid href
    if (!href || href === '#' || href === 'javascript:void(0)') {
      issues.push({
        element: link,
        issue: 'Non-crawlable href',
        recommendation: 'Provide a proper URL or fallback page',
        index,
      });
    }

    // Check for missing aria-label on icon-only links
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      issues.push({
        element: link,
        issue: 'Missing aria-label on icon-only link',
        recommendation: 'Add descriptive aria-label',
        index,
      });
    }
  });

  return issues;
}

export function enhanceLinksWithAnalytics() {
  if (typeof window === 'undefined') return;

  const links = document.querySelectorAll('a[data-tracking]');

  links.forEach((link) => {
    const trackingData = link.getAttribute('data-tracking');
    if (trackingData) {
      try {
        const data = JSON.parse(trackingData);
        link.addEventListener('click', () => {
          // PostHog tracking integration
          if (window.posthog) {
            window.posthog.capture('link_clicked', data);
          }
        });
      } catch {
        console.warn('Invalid tracking data on link:', link);
      }
    }
  });
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', enhanceLinksWithAnalytics);
}
