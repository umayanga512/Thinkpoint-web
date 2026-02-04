import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['work-1-tipksnwqwkblbmrb.prod-runtime.all-hands.dev', 'localhost', '127.0.0.1'],
  },
  build: {
    // Optimize for performance
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create chunks for better caching
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/components')) {
            return 'components';
          }
          if (id.includes('src/utils')) {
            return 'utils';
          }
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['astro', 'sharp'],
  },
  // Enable asset optimization
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webp'],
});
