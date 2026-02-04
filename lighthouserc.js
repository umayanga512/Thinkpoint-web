export default {
  ci: {
    collect: {
      url: [
        'http://localhost:4322/',
        'http://localhost:4322/about',
        'http://localhost:4322/contact',
      ],
      startServerCommand: 'bun run dev',
      startServerReadyPattern: 'Local',
      numberOfRuns: 1, // Reduced for faster CI
      settings: {
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }], // Slightly relaxed for CI
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
        'total-blocking-time': ['warn', { maxNumericValue: 400 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        interactive: ['warn', { maxNumericValue: 4000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
