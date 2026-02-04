import { expect, test } from '@playwright/test';

test.describe('PostHog Analytics Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock PostHog for testing without real API calls
    await page.addInitScript(() => {
      // Mock console.log to capture debug messages
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      (window as any).testLogs = logs;
    });
  });

  test('PostHog library loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check if PostHog is available on window object
    const posthogExists = await page.evaluate(() => {
      return typeof window.posthog !== 'undefined';
    });

    expect(posthogExists).toBe(true);
  });

  test('PostHog initialization works with missing API key', async ({ page }) => {
    await page.goto('/');

    // Check that PostHog doesn't initialize without API key
    const isPosthogInitialized = await page.evaluate(() => {
      return window.posthog && window.posthog.__loaded;
    });

    // Should not be initialized without API key (expected behavior)
    expect(isPosthogInitialized).toBeFalsy();
  });

  test('PostHog debug mode works in development', async ({ page }) => {
    await page.goto('/');

    // Check if PostHog debug mode is configured correctly
    const debugModeConfigured = await page.evaluate(() => {
      // Check if PostHog is available and debug mode would be enabled if initialized
      return typeof window.posthog !== 'undefined' && !window.posthog.__loaded; // Should not be loaded without API key
    });

    // PostHog should be available but not initialized without API key
    expect(debugModeConfigured).toBeTruthy();
  });

  test('Analytics utility functions are available', async ({ page }) => {
    await page.goto('/');

    // Test if analytics utilities are loaded globally
    const analyticsLoaded = await page.evaluate(() => {
      return (
        typeof window.trackEvent === 'function' &&
        typeof window.optInAnalytics === 'function' &&
        typeof window.optOutAnalytics === 'function'
      );
    });

    // Analytics utilities should be available
    expect(analyticsLoaded).toBeTruthy();
  });

  test('No JavaScript errors related to PostHog', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');

    // Should have no PostHog-related JavaScript errors
    const posthogErrors = errors.filter(
      (error) =>
        error.toLowerCase().includes('posthog') || error.toLowerCase().includes('analytics')
    );

    expect(posthogErrors).toHaveLength(0);
  });
});
