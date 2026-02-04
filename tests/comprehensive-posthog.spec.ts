import { expect, test } from '@playwright/test';

test.describe.parallel('Comprehensive PostHog Analytics Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up analytics event capture
    await page.addInitScript(() => {
      // Capture all PostHog events
      window.capturedEvents = [];

      // Mock PostHog to capture events
      if (typeof window.posthog !== 'undefined') {
        const originalCapture = window.posthog.capture;
        window.posthog.capture = function (eventName, properties) {
          window.capturedEvents.push({
            eventName,
            properties,
            timestamp: new Date().toISOString(),
          });
          return originalCapture.call(this, eventName, properties);
        };
      }
    });
  });

  test('PostHog loads correctly with API key', async ({ page }) => {
    await page.goto('/');

    // Check if PostHog is properly initialized
    const posthogLoaded = await page.evaluate(() => {
      return (
        typeof window.posthog !== 'undefined' &&
        window.posthog.__loaded &&
        window.posthog.config?.token === 'phc_avzcFe1jcQ5pyqhOd7tDlcCHcXVVo27Mcx5whc813jY'
      );
    });

    expect(posthogLoaded).toBe(true);
  });

  test('Enhanced page view events are captured', async ({ page }) => {
    await page.goto('/');

    // Wait for analytics to initialize
    await page.waitForTimeout(1000);

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should have captured page view events
    const pageViewEvents = capturedEvents.filter(
      (event) => event.eventName.includes('page_view') || event.eventName.includes('enhanced')
    );

    expect(pageViewEvents.length).toBeGreaterThan(0);

    // Check event structure
    const enhancedPageView = pageViewEvents.find(
      (event) => event.eventName === 'page_view_enhanced'
    );

    expect(enhancedPageView).toBeDefined();
    expect(enhancedPageView.properties.page_url).toContain('localhost');
    expect(enhancedPageView.properties.viewport_width).toBeGreaterThan(0);
  });

  test('Hero CTA button clicks are tracked', async ({ page }) => {
    await page.goto('/');

    // Click the "Get Started" CTA button
    await page.click('a[data-cta="get_started"]');

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should capture CTA click
    const ctaEvents = capturedEvents.filter(
      (event) => event.eventName === 'hero_cta_clicked' || event.eventName === 'cta_clicked'
    );

    expect(ctaEvents.length).toBeGreaterThan(0);

    const heroCtaEvent = ctaEvents.find(
      (event) =>
        event.properties.cta_text === 'Get Started' || event.properties.source === 'hero_section'
    );

    expect(heroCtaEvent).toBeDefined();
  });

  test('Navigation interactions are tracked', async ({ page }) => {
    await page.goto('/');

    // Click navigation items
    await page.click('nav a[href="/contact"]');
    await page.waitForTimeout(500);
    await page.goBack();
    await page.click('nav a[href="/about"]');

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should track navigation clicks
    const navEvents = capturedEvents.filter(
      (event) => event.eventName === 'navigation_clicked' || event.eventName.includes('navbar')
    );

    expect(navEvents.length).toBeGreaterThan(0);
  });

  test('Contact form submission attempts are tracked', async ({ page }) => {
    await page.goto('/contact');

    // Fill out the contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Submit the form
    await page.click('button[type="submit"]');

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should track form submission attempt
    const formEvents = capturedEvents.filter(
      (event) => event.eventName.includes('contact_form') || event.eventName === 'form_submitted'
    );

    expect(formEvents.length).toBeGreaterThan(0);

    const submissionAttempt = formEvents.find(
      (event) => event.eventName === 'contact_form_submit_attempted'
    );

    expect(submissionAttempt).toBeDefined();
    expect(submissionAttempt.properties.form_name).toBe('Test User');
    expect(submissionAttempt.properties.form_email).toBe('test@example.com');
  });

  test('Scroll depth milestones are captured', async ({ page }) => {
    await page.goto('/');

    // Scroll to different positions
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should capture scroll depth events
    const scrollEvents = capturedEvents.filter(
      (event) => event.eventName === 'scroll_depth_milestone'
    );

    expect(scrollEvents.length).toBeGreaterThan(0);

    // Check scroll percentage tracking
    const scrollPercentages = scrollEvents.map((event) => event.properties.percentage);
    expect(scrollPercentages.some((pct) => pct >= 25)).toBe(true);
  });

  test('Link clicks are categorized and tracked', async ({ page }) => {
    await page.goto('/');

    // Click different types of links
    await page.click('a[href="/contact"]'); // Internal link
    await page.waitForTimeout(500);

    // Check if footer has phone/email links
    const phoneLink = await page.locator('a[href^="tel:"]').first();
    if (await phoneLink.isVisible()) {
      await phoneLink.click();
      await page.waitForTimeout(500);
    }

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should track link clicks with categorization
    const linkEvents = capturedEvents.filter((event) => event.eventName === 'link_clicked');

    expect(linkEvents.length).toBeGreaterThan(0);

    // Check link categorization
    const internalLinks = linkEvents.filter(
      (event) => event.properties.link_category === 'internal'
    );
    const phoneLinks = linkEvents.filter((event) => event.properties.link_category === 'phone');

    expect(internalLinks.length).toBeGreaterThan(0);
  });

  test('Blog engagement is tracked', async ({ page }) => {
    await page.goto('/blog');

    // Click on a blog article
    const firstArticle = await page.locator('a[href*="/blog/"]').first();
    if (await firstArticle.isVisible()) {
      await firstArticle.click();
      await page.waitForTimeout(1000);

      const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

      // Should track blog interactions
      const blogEvents = capturedEvents.filter(
        (event) => event.eventName.includes('blog') || event.eventName === 'blog_article_clicked'
      );

      expect(blogEvents.length).toBeGreaterThan(0);
    }
  });

  test('Business tracking events are captured', async ({ page }) => {
    await page.goto('/');

    // Wait for business tracking to initialize
    await page.waitForTimeout(1000);

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);

    // Should have business tracking initialization
    const businessInitEvent = capturedEvents.find(
      (event) => event.eventName === 'business_tracking_initialized'
    );

    expect(businessInitEvent).toBeDefined();
    expect(businessInitEvent.properties.tracking_capabilities).toBeInstanceOf(Array);
    expect(businessInitEvent.properties.tracking_capabilities.length).toBeGreaterThan(10);
  });

  test('No JavaScript errors with comprehensive tracking', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForTimeout(2000); // Allow all tracking scripts to load

    // Should have no JavaScript errors
    expect(errors.length).toBe(0);
  });

  test('Custom tracking functions are available', async ({ page }) => {
    await page.goto('/');

    // Check if custom tracking functions are available
    const customFunctionsAvailable = await page.evaluate(() => {
      return (
        typeof window.trackCustomEvent === 'function' &&
        typeof window.trackUserJourney === 'function'
      );
    });

    expect(customFunctionsAvailable).toBe(true);

    // Test custom event tracking
    await page.evaluate(() => {
      if (window.trackCustomEvent) {
        window.trackCustomEvent('test_custom_event', {
          test_property: 'test_value',
          test_timestamp: new Date().toISOString(),
        });
      }
    });

    const capturedEvents = await page.evaluate(() => window.capturedEvents || []);
    const testEvent = capturedEvents.find((event) => event.eventName === 'test_custom_event');

    expect(testEvent).toBeDefined();
    expect(testEvent.properties.test_property).toBe('test_value');
  });
});
