/** @type {import('tailwindcss').Config} */

const tokens = require('./src/tokens/design-tokens.json');

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    screens: tokens.breakpoints,
    container: {
      center: true,
      padding: tokens.spacing[2],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: tokens.colors.primary[500],
          ...tokens.colors.primary,
        },
        secondary: {
          DEFAULT: tokens.colors.secondary[500],
          ...tokens.colors.secondary,
        },
        accent: {
          DEFAULT: tokens.colors.accent[500],
          ...tokens.colors.accent,
        },
        dark: {
          DEFAULT: tokens.colors.dark[700],
          ...tokens.colors.dark,
        },
        gray: {
          DEFAULT: tokens.colors.gray[500],
          ...tokens.colors.gray,
        },
        warning: tokens.colors.semantic.warning,
        error: tokens.colors.semantic.error,
        success: tokens.colors.semantic.success,
        info: tokens.colors.semantic.info,
        stroke: tokens.colors.gray[200],
        'body-color': tokens.colors.gray[600],
        'body-secondary': tokens.colors.gray[400],
      },
      spacing: tokens.spacing,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      borderRadius: tokens.radius,
      boxShadow: {
        ...tokens.shadows,
        input: '0px 7px 20px rgba(0, 0, 0, 0.03)',
        form: '0px 1px 55px -11px rgba(0, 0, 0, 0.01)',
        pricing: '0px 0px 40px 0px rgba(0, 0, 0, 0.08)',
        'switch-1': '0px 0px 5px rgba(0, 0, 0, 0.15)',
        testimonial: '0px 10px 20px 0px rgba(92, 115, 160, 0.07)',
        'testimonial-btn': '0px 8px 15px 0px rgba(72, 72, 138, 0.08)',
        1: '0px 1px 3px 0px rgba(166, 175, 195, 0.40)',
        2: '0px 5px 12px 0px rgba(0, 0, 0, 0.10)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        spotlight: 'spotlight 2s ease .75s 1 forwards',
        shimmer: 'shimmer 2s linear infinite',
        'text-gradient': 'text-gradient 1.5s linear infinite',
        'background-shine': 'background-shine 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        spotlight: {
          '0%': {
            opacity: 0,
            transform: 'translate(-72%, -62%) scale(0.5)',
          },
          '100%': {
            opacity: 1,
            transform: 'translate(-50%,-40%) scale(1)',
          },
        },
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
        'text-gradient': {
          to: {
            backgroundPosition: '200% center',
          },
        },
        'background-shine': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
