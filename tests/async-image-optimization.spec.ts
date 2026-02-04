import { expect, test } from '@playwright/test';

test.describe.parallel('Async Image Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AsyncImage component renders correctly', async ({ page }) => {
    const asyncImage = page.locator('img').first();
    await expect(asyncImage).toBeVisible();

    // Check if image has proper attributes
    const alt = await asyncImage.getAttribute('alt');
    expect(alt).toBeTruthy();

    // Check if image has loading attribute
    const loading = await asyncImage.getAttribute('loading');
    expect(['lazy', 'eager']).toContain(loading);
  });

  test('Image loading prevents layout shift', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    // Wait for images to load
    await page.waitForLoad();

    // Check if images have proper dimensions
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.getAttribute('width');
      const naturalHeight = await img.getAttribute('height');
      expect(naturalWidth).toBeTruthy();
      expect(naturalHeight).toBeTruthy();
    }
  });

  test('Skeleton loading appears during lazy load', async ({ page }) => {
    const lazyImage = page.locator('img[loading="lazy"]');
    if ((await lazyImage.count()) > 0) {
      // Check if skeleton placeholder exists
      const skeleton = lazyImage.locator('..').first();
      expect(skeleton).toHaveClass(/bg-gray-200/);
    }
  });

  test('WebP/AVIF format support (when available)', async ({ page }) => {
    const picture = page.locator('picture');
    if ((await picture.count()) > 0) {
      // Check for WebP source
      const webpSource = picture.locator('source[type="image/webp"]');
      if ((await webpSource.count()) > 0) {
        const srcset = await webpSource.getAttribute('srcset');
        expect(srcset).toContain('webp');
      }

      // Check for AVIF source
      const avifSource = picture.locator('source[type="image/avif"]');
      if (avifSource.count() > 0) {
        const srcset = await avifSource.getAttribute('srcset');
        expect(srcset).toContain('avif');
      }
    }
  });

  test('Image caching works on Vercel Edge Network', async ({ page }) => {
    const img = page.locator('img').first();
    const src = await img.getAttribute('src');

    // Make request to verify caching headers
    const response = await page.request.evaluate(() => {
      return fetch(src).then((response) => ({
        status: response.status,
        cacheControl: response.headers.get('cache-control'),
        lastModified: response.headers.get('last-modified'),
      }));
    });

    // Verify cache headers are set
    expect(response.cacheControl).toContain('max-age=');
  });

  test('Images are properly optimized for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.getAttribute('width');
      const naturalHeight = await img.getAttribute('height');

      // Mobile images should have smaller natural dimensions
      expect(naturalWidth).toBeLessThanOrEqual(1200); // Reasonable mobile max width
    }
  });

  test('Image alt text is accessible', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt.trim()).not.toBe('');
    }
  });

  test('Loading states transition smoothly', async ({ page }) => {
    const img = page.locator('img').first();

    // Initial state
    await expect(img).toHaveClass(/opacity-0/);

    // Wait for image to load
    await img.waitForLoadState('load');
    await expect(img).toHaveClass(/opacity-100/);
  });

  test('Performance metrics are maintained', async ({ page }) => {
    // Check LCP (Largest Contentful Paint)
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        lcp:
          performance.getEntriesByType('largest-contentful-paint')[0]?.startTime -
          navigation.startTime,
        fcp:
          performance.getEntriesByType('first-contentful-paint')[0]?.startTime -
          navigation.startTime,
      };
    });

    // Verify performance targets are met
    expect(metrics.lcp).toBeLessThan(2500); // < 2.5s
    expect(metrics.fcp).toBeLessThan(1800); // < 1.8s
  });
});
