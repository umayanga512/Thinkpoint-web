import { expect, test } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual consistency', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot for visual regression testing
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('about page visual consistency', async ({ page }) => {
    await page.goto('/about');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('about-page-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('contact page visual consistency', async ({ page }) => {
    await page.goto('/contact');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('contact-page-full.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('mobile homepage visual consistency', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });
});
