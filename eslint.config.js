import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        IntersectionObserver: 'readonly',
        URLSearchParams: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        requestIdleCallback: 'readonly',
        history: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLElement: 'readonly',
        URL: 'readonly',
        Bun: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-empty': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.vercel/**',
      'build/**',
      '**/*.map',
      '.astro/**',
      'test-fixtures/**',
      '**/*.astro',
      '**/*.mjs',
      'src/pages/api/**',
      'src/pages/**/*.ts',
      'tailwind.config.cjs',
      'tests/**',
      'src/public/sw.js',
    ],
  },
];
