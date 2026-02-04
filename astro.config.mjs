import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import compress from 'astro-compress';
import icon from 'astro-icon';

import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  site: 'https://indobintangrezki.com',
  output: 'static',
  adapter: cloudflare({}),
  integrations: [
    tailwind(),
    mdx(),
    compress({
      CSS: {
        csso: {
          restructure: true,
          forceMediaMerge: true,
          comments: false,
        },
      },
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
        },
      },
      JavaScript: {
        terser: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug'],
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
      },
      SVG: {
        svgo: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  removeTitle: false,
                },
              },
            },
          ],
        },
      },
      Image: false, // Disable image compression - conflicts with Astro's built-in image optimization
      Exclude: [
        (file) => file.includes('.map'), // Preserve source maps
        (file) => file.includes('sw.js'), // Don't compress service workers
        (file) => file.includes('partytown'), // Don't compress partytown scripts
      ],
    }),
    sitemap(),
    icon({
      svgoOptions: {
        plugins: [
          'preset-default',
          {
            name: 'convertColors',
            params: { currentColor: true },
          },
        ],
      },
    }),
    partytown({
      config: {
        forward: [],
      },
    }),
  ],
  vite: {
    server: {
      host: true,
      allowedHosts: true,
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            analytics: ['posthog-js'],
            ui: ['framer-motion'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@/': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ['posthog-js'],
    },
  },
});
