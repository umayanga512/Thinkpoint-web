import { expect, test } from '@playwright/test';
import { checkA11y, injectAxe } from 'axe-playwright';

test.describe('Mobile Responsive & Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('homepage displays correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Test hero section exists and is visible
    const heroSection = page.locator('div').first();
    await expect(heroSection).toBeVisible();

    // Test navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Test footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('contact section displays correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/contact');

    // Test contact form exists and is visible
    const contactForm = page.locator('form');
    await expect(contactForm).toBeVisible();
  });

  test('touch targets are appropriately sized for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const touchTargets = page.locator('a, button').filter({ hasNotText: '' });

    for (let i = 0; i < Math.min(await touchTargets.count(), 10); i++) {
      const target = touchTargets.nth(i);
      if (await target.isVisible()) {
        const boundingBox = await target.boundingBox();
        if (boundingBox) {
          // Check if touch target meets 44px minimum requirement
          const meetsMinimum = boundingBox.width >= 44 || boundingBox.height >= 44;
          expect(meetsMinimum).toBeTruthy();
        }
      }
    }
  });

  test('Accessibility Tests - WCAG 2.2 AA compliance', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Run accessibility checks
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('navigation works correctly across devices', async ({ page }) => {
    // Test on different viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1280, height: 720 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Test navigation links
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        const firstLink = navLinks.first();
        await expect(firstLink).toBeVisible();
      }
    }
  });

  test('preserves existing visual design elements', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Take screenshot to ensure visual consistency
    await expect(page).toHaveScreenshot('homepage-baseline.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});
