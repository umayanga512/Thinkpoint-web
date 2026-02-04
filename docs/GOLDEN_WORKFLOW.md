# Golden Workflow: Astro + Cloudflare Pages + Bun

**The Definitive Guide for Modern Web Projects**

A battle-tested workflow for building, deploying, and maintaining production-grade Astro websites with Cloudflare Pages, using Bun as the package manager.

---

## Table of Contents

1. [Philosophy & Principles](#philosophy--principles)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Package Management (Bun-Only)](#package-management-bun-only)
5. [Cloudflare Pages Setup](#cloudflare-pages-setup)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Image Optimization](#image-optimization)
8. [Deployment Protection](#deployment-protection)
9. [Troubleshooting](#troubleshooting)
10. [Common Pitfalls](#common-pitfalls)

---

## Philosophy & Principles

### Core Values

1. **Bun-First Development** - Use Bun exclusively for all package operations. Never mix npm/yarn/pnpm.
2. **Direct Git Integration** - Let Cloudflare handle deployments automatically. No custom CD workflows.
3. **Lean CI Pipeline** - Only run quality gates (format, lint, build, security). No deployment logic in CI.
4. **Static Analysis** - Use Astro's official components for images. Never hardcode asset paths.
5. **Multi-Layer Protection** - Combine CODEOWNERS, CI gates, and PR templates to prevent regressions.

### Decision Framework

**When to use what:**

- ✅ **Bun**: All package operations (install, add, remove, run)
- ✅ **Cloudflare Direct Git**: Automatic deployments (main → production, branches → preview)
- ✅ **GitHub Actions CI**: Quality gates only (no deployment)
- ✅ **Astro `<Picture>` component**: All responsive images
- ✅ **Wrangler CLI**: Manual deployments, KV management, emergency rollbacks

**What to avoid:**

- ❌ Never use npm/yarn/pnpm in a Bun project
- ❌ Never deploy via GitHub Actions (Cloudflare handles this)
- ❌ Never hardcode `/src/assets/` paths in srcset
- ❌ Never commit package-lock.json or yarn.lock
- ❌ Never merge PRs with failing CI

---

## Technology Stack

### Core Technologies

```yaml
Runtime: Bun (v1.2.23+)
Framework: Astro (v5.14.1+)
Adapter: @astrojs/cloudflare
Styling: TailwindCSS
TypeScript: Yes (strict mode)
Package Manager: Bun ONLY
```

### Deployment Platform

```yaml
Platform: Cloudflare Pages
CDN: Cloudflare Global Network
KV Storage: Cloudflare Workers KV
DNS: Cloudflare DNS (optional)
```

### Development Tools

```yaml
Linter: ESLint (flat config)
Formatter: Prettier
Git Hooks: Husky
Commit Format: Commitlint (conventional commits)
Image Optimization: Sharp (via bunx)
```

---

## Project Setup

### 1. Initialize Project

```bash
# Create Astro project with Bun
bunx create-astro@latest my-project

# Navigate to project
cd my-project

# Install Cloudflare adapter
bun add -D @astrojs/cloudflare

# Install essential dependencies
bun add -D \
  @astrojs/tailwind \
  @astrojs/sitemap \
  prettier \
  eslint \
  husky \
  lint-staged \
  commitlint \
  sharp
```

### 2. Configure Astro for Cloudflare

**`astro.config.mjs`:**

```javascript
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server', // or 'hybrid' for partial prerendering
  adapter: cloudflare({
    imageService: 'compile', // Use Sharp at build time
    platformProxy: {
      enabled: true,
    },
  }),
  site: 'https://yourdomain.com',
  integrations: [tailwind(), sitemap()],
  vite: {
    build: {
      sourcemap: false, // Disable for production
    },
  },
});
```

### 3. Setup Package Scripts

**`package.json`:**

```json
{
  "name": "my-project",
  "type": "module",
  "packageManager": "bun@1.2.23",
  "//": "BUN-SHOP: Use ONLY 'bun install', 'bun run', 'bun add' - NEVER use npm",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "lint:check": "eslint . --ext .js,.jsx,.ts,.tsx",
    "security:scan": "bun audit --audit-level critical",
    "ci:quality": "bun run format:check && bun run lint:check && bun run build",
    "ci": "bun run ci:quality && bun run security:scan",
    "deploy:production": "bunx wrangler pages deploy dist --project-name=my-project --branch=main",
    "deploy:preview": "bunx wrangler pages deploy dist --project-name=my-project",
    "deploy": "bun run ci && bun run deploy:production"
  }
}
```

### 4. Essential Configuration Files

**`.gitignore`:**

```gitignore
# Build output
dist/
.output/

# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Logs
*.log

# Environment
.env
.env.production

# Cloudflare
.dev.vars
.wrangler/

# Astro
.astro/

# IDE
.vscode/
.idea/
```

**`.prettierrc`:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"]
}
```

**`eslint.config.js`:**

```javascript
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        Bun: 'readonly', // Add Bun global
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', '.astro/**'],
  },
];
```

---

## Package Management (Bun-Only)

### The Bun Mandate

**This project is a BUN SHOP.** All package operations MUST use Bun exclusively.

### Bun Commands Reference

```bash
# Install dependencies
bun install
bun install --frozen-lockfile  # Production/CI

# Add dependencies
bun add <package>              # Production dependency
bun add -D <package>           # Development dependency

# Remove dependencies
bun remove <package>

# Update dependencies
bun update                     # Update all
bun update <package>           # Update specific

# Run scripts
bun run dev
bun run build
bun run test

# Execute binaries
bunx wrangler pages deploy dist
bunx sharp -i input.jpg -o output.webp
```

### Forbidden Commands

**NEVER use these commands:**

```bash
# ❌ FORBIDDEN - Will cause lockfile conflicts
npm install
npm run build
npm add <package>
npx <command>

# ❌ FORBIDDEN - Not used in this project
yarn install
yarn add <package>

# ❌ FORBIDDEN - Not used in this project
pnpm install
pnpm add <package>
```

### Lockfile Management

**Critical Rules:**

1. **Only commit `bun.lockb`** - Never commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`
2. **Use `--frozen-lockfile` in CI** - Ensures reproducible builds
3. **Add npm lockfiles to `.gitignore`** - Prevents accidental commits

**If you accidentally generate npm lockfile:**

```bash
rm package-lock.json
echo "package-lock.json" >> .gitignore
bun install  # Regenerate bun.lockb
```

---

## Cloudflare Pages Setup

### 1. Create KV Namespaces

**Create namespaces for production and preview:**

```bash
# Production namespaces
bunx wrangler kv namespace create "CACHE"
bunx wrangler kv namespace create "SESSION"

# Preview namespaces
bunx wrangler kv namespace create "CACHE" --preview
bunx wrangler kv namespace create "SESSION" --preview
```

**Expected output:**

```
✅ Success! Created KV namespace CACHE with id: adb7e6b7c069439fbc77d278865381b6
✅ Success! Created KV namespace SESSION with id: 6f739d78691b40d890171b25ebd0ec46
```

Save these IDs for `wrangler.toml`.

### 2. Configure Wrangler

**`wrangler.toml`:**

```toml
# Cloudflare Pages Configuration
name = "my-project"
pages_build_output_dir = "dist"
compatibility_date = "2025-10-04"

# NOTE: Build command MUST be configured in Cloudflare Pages dashboard
# Dashboard → Pages → my-project → Settings → Builds & deployments
# Build command: bun install --frozen-lockfile && bun run build
# Build output directory: dist

# Default environment (preview deployments)
[[kv_namespaces]]
binding = "CACHE"
id = "your-preview-cache-id"

[[kv_namespaces]]
binding = "SESSION"
id = "your-preview-session-id"

[vars]
NODE_ENV = "development"

# Production environment (main branch)
[env.production]

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-production-cache-id"

[[env.production.kv_namespaces]]
binding = "SESSION"
id = "your-production-session-id"

[env.production.vars]
NODE_ENV = "production"
```

**⚠️ CRITICAL Notes:**

- For Direct Git Integration, the `[build]` section is NOT supported in `wrangler.toml`
- Build configuration MUST be set in Cloudflare Pages dashboard (see next step)
- Regular environment variables are managed via `wrangler.toml` `[vars]` section
- Secrets (encrypted variables) must be set via Dashboard or Wrangler CLI only

### 3. Set Environment Variables

**Two types of variables:**

**A. Regular Variables (via `wrangler.toml`):**

Already configured in `wrangler.toml`:

```toml
[vars]
NODE_ENV = "development"  # Preview environment

[env.production.vars]
NODE_ENV = "production"   # Production environment
```

**B. Secrets (encrypted variables via Dashboard or CLI):**

**Via Cloudflare Dashboard:**

1. Go to Cloudflare Pages → Your Project → Settings → Environment variables
2. Add **Production** and **Preview** secrets separately
3. Example secrets: `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, API tokens

**Via Wrangler CLI:**

```bash
# Set production secrets
bunx wrangler pages secret put PUBLIC_POSTHOG_KEY --project-name=my-project
bunx wrangler pages secret put PUBLIC_POSTHOG_HOST --project-name=my-project
```

**⚠️ Important:**

- Regular environment variables → `wrangler.toml` `[vars]` section
- Secrets (encrypted) → Cloudflare Dashboard or Wrangler CLI only

### 4. Connect GitHub Repository

**Via Cloudflare Dashboard:**

1. Cloudflare Dashboard → Pages → Create a project
2. Choose **Connect to Git**
3. Authorize Cloudflare to access GitHub
4. Select repository: `your-username/my-project`
5. Configure build settings:
   - **Build command**: Leave empty (wrangler.toml handles this)
   - **Build output directory**: `dist`
   - **Production branch**: `main`
6. Click **Save and Deploy**

**Result:**

- Push to `main` → Production deployment (yourdomain.com)
- Push to any other branch → Preview deployment (branch-name.my-project.pages.dev)

### 5. Add Custom Domain (Optional)

**Via Cloudflare Dashboard:**

1. Pages → Your Project → Custom domains → Set up a custom domain
2. Enter your domain: `yourdomain.com`
3. Follow DNS setup instructions
4. Wait for SSL certificate provisioning (~5 minutes)

**DNS Configuration:**

```
Type: CNAME
Name: @
Content: my-project.pages.dev
Proxy: Enabled (orange cloud)
```

---

## CI/CD Pipeline

### Architecture

**Hybrid Deployment Model:**

```
Push to GitHub
    ↓
┌─────────────────────┬──────────────────────────┐
│ GitHub Actions CI   │ Cloudflare Pages        │
│ (Quality Gates)     │ (Deployment)            │
├─────────────────────┼──────────────────────────┤
│ - Format check      │ - Auto-deploys preview  │
│ - Linting           │   or production         │
│ - Build             │ - No CI needed          │
│ - Security audit    │                         │
└─────────────────────┴──────────────────────────┘
```

**Key Principle:** CI runs quality checks. Cloudflare handles deployment. No deployment logic in GitHub Actions.

### GitHub Actions CI

**`.github/workflows/ci.yml`:**

```yaml
name: 🔬 Continuous Integration

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-checks:
    name: 🔍 Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 📦 Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 🗂️ Cache Bun Dependencies
        uses: actions/cache@v4
        with:
          path: ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: 🔧 Install Dependencies
        run: bun install --frozen-lockfile

      - name: 🎨 Code Formatting Check
        run: bun run format:check

      - name: 🔍 Linting Check
        run: bun run lint:check

      - name: 🏗️ Build Check
        run: bun run build

  security-audit:
    name: 🔒 Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 📦 Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: 🔧 Install Dependencies
        run: bun install --frozen-lockfile

      - name: 🔒 Security Vulnerability Scan
        run: bun run security:scan

  deployment-gate:
    name: 🚦 Deployment Gate
    runs-on: ubuntu-latest
    needs: [quality-checks, security-audit]
    steps:
      - name: ✅ All Checks Passed
        run: |
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo "✅ ALL QUALITY GATES PASSED"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
          echo ""
          echo "✅ Code formatting verified"
          echo "✅ Linting passed"
          echo "✅ Build successful"
          echo "✅ Security audit passed"
          echo ""
          echo "🚀 SAFE TO MERGE"
          echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

### Local CI Commands

**Run identical CI pipeline locally:**

```bash
# Full CI (same as GitHub Actions)
bun run ci

# Individual checks
bun run format:check
bun run lint:check
bun run build
bun run security:scan
```

**Benefits:**

- Catch issues before pushing
- Faster feedback loop
- No wasted CI minutes
- Identical to remote CI

---

## Image Optimization

### The Golden Rule

**NEVER hardcode `/src/assets/` paths in HTML `srcset` attributes.**

Astro's build system uses static analysis and cannot process plain string paths. This causes images to fail loading in production.

### ❌ WRONG - Hardcoded Paths

```astro
<!-- DON'T DO THIS - Will break in production -->
<picture>
  <source type="image/avif" srcset="/src/assets/hero.avif" />
  <source type="image/webp" srcset="/src/assets/hero.webp" />
  <img src={heroImage.src} alt="Hero" />
</picture>
```

### ✅ CORRECT - Astro Picture Component

```astro
---
import { Picture } from 'astro:assets';
import heroImage from '../assets/hero.png';
---

<Picture
  src={heroImage}
  formats={['avif', 'webp']}
  alt="Hero image"
  width={1920}
  height={1080}
  loading="lazy"
/>
```

### Responsive Images with Multiple Widths

```astro
---
import { Picture } from 'astro:assets';
import mapImage from '../assets/map.jpg';
---

<Picture
  src={mapImage}
  widths={[476, 800, 1200]}
  sizes="(max-width: 768px) 476px, (max-width: 1024px) 800px, 1200px"
  formats={['avif', 'webp']}
  alt="Indonesia Map"
  width={1200}
  height={800}
  loading="lazy"
/>
```

### Image Conversion with Sharp

**Install sharp-cli (via bunx - no global install needed):**

```bash
# Convert to WebP
bunx sharp -i src/assets/image.jpg -o src/assets/image.webp -f webp --quality 80

# Convert to AVIF
bunx sharp -i src/assets/image.jpg -o src/assets/image.avif -f avif --quality 70

# Responsive sizes
bunx sharp -i src/assets/large.jpg -o src/assets/small-476.webp -f webp --quality 75 --width 476
bunx sharp -i src/assets/large.jpg -o src/assets/medium-800.webp -f webp --quality 75 --width 800
bunx sharp -i src/assets/large.jpg -o src/assets/large-1200.webp -f webp --quality 75 --width 1200
```

### Quality Guidelines

**Photos/Gradients:**

- WebP: quality 75-80
- AVIF: quality 65-70

**Graphics/Screenshots:**

- WebP: quality 80-90
- AVIF: quality 70-80

### Loading Strategy

**Above-the-fold (LCP - Largest Contentful Paint):**

```astro
<Picture src={heroImage} loading="eager" fetchpriority="high" {...otherProps} />
```

**Below-the-fold:**

```astro
<Picture src={contentImage} loading="lazy" {...otherProps} />
```

---

## Deployment Protection

### Multi-Layer Protection Strategy

**Layer 1: CODEOWNERS** (Technical Enforcement)

**`.github/CODEOWNERS`:**

```
# Require review from owner on all PRs
* @your-username

# Critical infrastructure requires explicit approval
/.github/workflows/* @your-username
/astro.config.mjs @your-username
/package.json @your-username
/wrangler.toml @your-username
```

**Layer 2: PR Template** (Visual Warning)

**`.github/pull_request_template.md`:**

```markdown
## 📋 Pre-Merge Checklist

### 🚦 CI Status

- [ ] All GitHub Actions checks passed (green checkmarks)
- [ ] No failing tests
- [ ] No linting errors

### 🧪 Testing

- [ ] Tested preview deployment: [paste URL]
- [ ] Lighthouse score ≥ 90 (all metrics)
- [ ] No console errors
- [ ] Mobile tested

### ⚠️ CRITICAL WARNING

**DO NOT MERGE IF ANY CI CHECKS ARE FAILING**

Merging broken code to main will deploy to production immediately via Cloudflare Pages.
```

**Layer 3: Husky Pre-commit Hooks**

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh

echo "🔍 Running code quality checks..."

# Run image optimization
bun run scripts/optimize-images.js

# Run lint-staged
bunx lint-staged

# Scan for secrets (if gitleaks installed)
if command -v gitleaks &> /dev/null; then
  gitleaks detect --source . --verbose
fi

echo "✅ Pre-commit checks passed!"
```

**`.husky/commit-msg`:**

```bash
#!/usr/bin/env sh

# Validate commit message format (conventional commits)
bunx commitlint --edit $1
```

**`lint-staged` configuration in `package.json`:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{astro,json,md,css}": ["prettier --write"]
  }
}
```

### Workflow Enforcement

**Before ANY merge to main:**

1. ✅ Create feature branch from main
2. ✅ Make changes and commit (Husky hooks run automatically)
3. ✅ Push branch (triggers Cloudflare preview deployment)
4. ✅ Wait for CI to pass (GitHub Actions)
5. ✅ Test preview deployment
6. ✅ Create PR with completed checklist
7. ✅ Get CODEOWNERS approval
8. ✅ Merge to main → Production deployment

**Emergency Rollback:**

```bash
# List recent deployments
bunx wrangler pages deployment list --project-name=my-project

# Rollback to specific deployment
bunx wrangler pages deployment rollback <deployment-id> --project-name=my-project
```

---

## Troubleshooting

### Issue 1: Cloudflare Uses npm Instead of Bun

**Symptoms:**

```
npm error `npm ci` can only install packages when your package.json
and package-lock.json are in sync
```

**Root Cause:** Missing `[build]` command in `wrangler.toml`

**Fix:**

```toml
# Add to wrangler.toml
[build]
command = "bun install --frozen-lockfile && bun run build"
```

```bash
# Remove npm lockfile
rm package-lock.json

# Add to .gitignore
echo "package-lock.json" >> .gitignore

# Commit and push
git add wrangler.toml .gitignore
git commit -m "fix: force Bun in Cloudflare Pages build"
git push
```

### Issue 2: Images Not Loading in Production

**Symptoms:**

- Images work in dev (`astro dev`)
- Images 404 in production build

**Root Cause:** Hardcoded `/src/assets/` paths in `srcset`

**Fix:**

Replace manual `<picture>` with Astro's `<Picture>` component:

```astro
---
import { Picture } from 'astro:assets';
import myImage from '../assets/my-image.jpg';
---

<!-- ❌ BEFORE (broken) -->
<picture>
  <source srcset="/src/assets/my-image.webp" type="image/webp" />
  <img src="/src/assets/my-image.jpg" alt="My Image" />
</picture>

<!-- ✅ AFTER (works) -->
<Picture src={myImage} formats={['avif', 'webp']} alt="My Image" width={800} height={600} />
```

### Issue 3: Duplicate Dependency Errors

**Symptoms:**

```
error: Duplicate dependency: "@astrojs/cloudflare" specified in package.json
```

**Root Cause:** Same package in both `dependencies` and `devDependencies`

**Fix:**

```bash
# Edit package.json - remove duplicate
# Keep latest version in devDependencies only

# Reinstall
rm -rf node_modules bun.lockb
bun install
```

### Issue 4: Security Audit Fails CI

**Symptoms:**

```
error: script "security:scan" exited with code 1
1 vulnerabilities (1 high)
```

**Root Cause:** High severity vulnerability in indirect dependency (can't fix)

**Fix:**

Change audit level from `high` to `critical`:

```json
// package.json
{
  "scripts": {
    "security:scan": "bun audit --audit-level critical"
  }
}
```

### Issue 5: Build Fails with Sharp Boolean Error

**Symptoms:**

```
TypeError: A boolean was expected
  at astro-compress/Sharp
```

**Root Cause:** Incompatible Sharp configuration in `astro-compress`

**Fix:**

```javascript
// astro.config.mjs
import compress from 'astro-compress';

export default defineConfig({
  integrations: [
    compress({
      Image: false, // Disable image compression - conflicts with Astro's built-in
    }),
  ],
});
```

---

## Common Pitfalls

### 1. Mixing Package Managers

**❌ DON'T:**

```bash
npm install         # Creates package-lock.json
bun add react      # Updates bun.lockb
npm run build      # Uses npm's resolution
```

**✅ DO:**

```bash
bun install        # Uses bun.lockb only
bun add react      # Updates bun.lockb only
bun run build      # Uses bun's resolution
```

### 2. Committing Multiple Lockfiles

**❌ DON'T commit:**

- `package-lock.json`
- `yarn.lock`
- `pnpm-lock.yaml`

**✅ DO commit:**

- `bun.lockb` ONLY

### 3. Deploying via GitHub Actions

**❌ DON'T:**

```yaml
# .github/workflows/deploy.yml - DON'T DO THIS
- name: Deploy to Cloudflare
  run: bunx wrangler pages deploy dist
```

**✅ DO:**

- Let Cloudflare Direct Git Integration handle deployments
- Use GitHub Actions ONLY for quality gates

### 4. Hardcoding Asset Paths

**❌ DON'T:**

```astro
<img src="/src/assets/logo.png" alt="Logo" />
<source srcset="/src/assets/hero.webp" />
```

**✅ DO:**

```astro
---
import { Image, Picture } from 'astro:assets';
import logo from '../assets/logo.png';
import hero from '../assets/hero.png';
---

<Image src={logo} alt="Logo" width={200} height={100} />
<Picture src={hero} formats={['avif', 'webp']} alt="Hero" width={1920} height={1080} />
```

### 5. Merging Without CI Passing

**❌ DON'T:**

- Merge PRs with red X (failing CI)
- Skip CODEOWNERS approval
- Ignore PR checklist

**✅ DO:**

- Wait for all green checkmarks
- Get CODEOWNERS approval
- Complete PR checklist
- Test preview deployment

### 6. Missing Build Command in wrangler.toml

**❌ DON'T:**

```toml
# wrangler.toml - Missing [build] section
name = "my-project"
pages_build_output_dir = "dist"
```

**✅ DO:**

```toml
# wrangler.toml - With explicit build command
name = "my-project"
pages_build_output_dir = "dist"

[build]
command = "bun install --frozen-lockfile && bun run build"
```

### 7. Ignoring Deployment Preview URLs

**❌ DON'T:**

- Merge without testing preview
- Assume build success = working site

**✅ DO:**

- Test every preview deployment
- Check all pages and features
- Verify Lighthouse scores
- Test on mobile devices

---

## Quick Reference

### Essential Commands

```bash
# Development
bun install              # Install dependencies
bun run dev             # Start dev server
bun run build           # Build for production
bun run preview         # Preview production build

# Quality Checks
bun run ci              # Run full CI pipeline
bun run format:check    # Check formatting
bun run lint:check      # Check linting
bun run security:scan   # Security audit

# Deployment
bun run deploy:production  # Deploy to production
bun run deploy:preview     # Deploy preview
bunx wrangler pages deployment list --project-name=my-project
bunx wrangler pages deployment rollback <id> --project-name=my-project

# Image Optimization
bunx sharp -i input.jpg -o output.webp -f webp --quality 80
bunx sharp -i input.jpg -o output.avif -f avif --quality 70

# KV Management
bunx wrangler kv namespace create "NAMESPACE_NAME"
bunx wrangler kv namespace create "NAMESPACE_NAME" --preview
bunx wrangler kv key put "key" "value" --namespace-id=<id>
bunx wrangler kv key get "key" --namespace-id=<id>
```

### File Checklist

**Must have:**

- ✅ `wrangler.toml` with `[build]` command
- ✅ `bun.lockb` (committed)
- ✅ `.github/CODEOWNERS`
- ✅ `.github/pull_request_template.md`
- ✅ `.github/workflows/ci.yml`
- ✅ `.husky/pre-commit`
- ✅ `.husky/commit-msg`
- ✅ `.gitignore` with `package-lock.json`

**Must NOT have:**

- ❌ `package-lock.json` (gitignored)
- ❌ `yarn.lock` (gitignored)
- ❌ `.github/workflows/deploy.yml` (Cloudflare handles this)

### Pre-deployment Checklist

Before merging to main:

- [ ] All CI checks passed (green checkmarks)
- [ ] CODEOWNERS approved
- [ ] Preview deployment tested
- [ ] Lighthouse scores ≥ 90
- [ ] No console errors
- [ ] Mobile tested
- [ ] PR checklist completed
- [ ] `bun.lockb` is up to date
- [ ] No `package-lock.json` committed

---

## Appendix: Real-World Example

### Project: Indo Bintang Rezki Website

**Stack:**

- Astro 5.14.1
- Cloudflare Pages
- Bun 1.2.23
- TailwindCSS
- TypeScript

**Key Learnings:**

1. **Duplicate Dependency Issue**: Had `@astrojs/cloudflare` in both `dependencies` and `devDependencies`. Removed from dependencies, kept in devDependencies.

2. **Cloudflare npm vs Bun**: Cloudflare auto-detected Bun but still ran `npm install`. Fixed by adding explicit `[build]` command to `wrangler.toml`.

3. **Image Loading Failure**: Used manual `<picture>` elements with hardcoded `/src/assets/` paths in srcset. Replaced all with Astro's `<Picture>` component.

4. **Security Audit Blocking**: `tar-fs` high vulnerability from Lighthouse indirect dependency. Changed audit level from `high` to `critical`.

5. **CI Workflow Bloat**: Had 3 workflows (CI, Cloudflare deploy, semantic release). Simplified to 1 workflow (CI only), let Cloudflare handle deployment.

**Results:**

- ✅ Build time: 1-2 minutes (was 5-10 minutes)
- ✅ Zero deployment failures
- ✅ Lighthouse scores: 90+ (all metrics)
- ✅ No image loading issues
- ✅ Clean, maintainable codebase

---

## Conclusion

This workflow represents battle-tested practices from real production deployments. Following these guidelines will save you hours of debugging and prevent common pitfalls.

**Remember the golden rules:**

1. Bun only, never npm
2. Cloudflare deploys, CI validates
3. Astro components for images, never hardcoded paths
4. Multi-layer protection prevents regressions
5. Test preview deployments before merging

**When in doubt:**

- Check this document
- Run `bun run ci` locally first
- Test preview deployment thoroughly
- Never merge with failing CI

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-04
**Status:** Production-Ready ✅
