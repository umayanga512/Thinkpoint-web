# Project-Specific Instructions for Claude Code

## Bun-First Development Policy

**WE ARE A BUN SHOP** - This project exclusively uses Bun for package management and runtime operations. **NEVER use npm** under any circumstances.

### Package Management Rules

**MANDATORY: Use Bun for all package operations:**

- `bun install` - Install dependencies
- `bun add <package>` - Add new dependencies
- `bun add -D <package>` - Add dev dependencies
- `bun remove <package>` - Remove dependencies
- `bun update` - Update dependencies
- `bun run <script>` - Run npm scripts
- `bunx <command>` - Execute package binaries

**FORBIDDEN npm commands:**

- ❌ `npm install` → Use `bun install`
- ❌ `npm run <script>` → Use `bun run <script>`
- ❌ `npm add <package>` → Use `bun add <package>`
- ❌ `npm test` → Use `bun run test`
- ❌ `npm run build` → Use `bun run build`
- ❌ `npm run dev` → Use `bun run dev`

### Performance-First Development

**Why Bun Only:**

- **3x faster** package installations than npm
- **Native TypeScript** support without configuration
- **Built-in test runner** with zero configuration
- **Bundled tools** - no need for separate bundlers
- **Reducuced memory usage** and faster startup times
- **All-in-one toolkit** for maximum performance

### Development Workflow

**Required Commands (Bun Only):**

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Run tests
bun run test

# Build for production
bun run build

# Linting and formatting
bun run lint
bun run format

# Security audit
bun run security:scan

# Performance testing
bun run lighthouse
```

### Code Quality Standards

**Performance Requirements:**

- All new packages must be compatible with Bun runtime
- Prefer native Bun APIs over Node.js equivalents when available
- Use Bun's built-in test runner for new tests
- Leverage Bun's fast bundler for optimization

**File Structure:**

- Use `bun.lockb` lockfile (never `package-lock.json`)
- Maintain `package.json` for script definitions only
- Ensure all CI/CD pipelines use Bun runtime

### Error Prevention

**If you see npm being used:**

1. Immediately stop the operation
2. Replace with equivalent Bun command
3. Verify lockfile consistency with `bun install`
4. Test that all dependencies work with Bun runtime

### Common Tasks Reference

| Task           | npm (FORBIDDEN)     | bun (REQUIRED)      |
| -------------- | ------------------- | ------------------- |
| Install deps   | `npm install`       | `bun install`       |
| Add package    | `npm add react`     | `bun add react`     |
| Add dev dep    | `npm add -D vitest` | `bun add -D vitest` |
| Run script     | `npm run dev`       | `bun run dev`       |
| Run tests      | `npm test`          | `bun run test`      |
| Build          | `npm run build`     | `bun run build`     |
| Execute binary | `npx vite`          | `bunx vite`         |
| Update deps    | `npm update`        | `bun update`        |

### Enforcement

**All contributors must:**

- Use Bun for all package management operations
- Never commit npm-generated lockfiles
- Ensure CI/CD uses Bun runtime exclusively
- Monitor build times and optimize with Bun-specific features

### Performance Monitoring

**Key metrics to track:**

- Package installation time (should be < 10s with Bun)
- Build time (leveraging Bun's bundler)
- Test execution time (using Bun's test runner)
- Bundle size (utilizing Bun's tree-shaking)

**Remember: Fast development = Happy developers. Bun delivers performance.**

## Deployment Standards

### Platform: Cloudflare Pages

**MANDATORY: All deployments use Cloudflare Pages**

- **Production URL**: https://indobintangrezki.com
- **Preview URL**: https://[branch].ibr-web.pages.dev
- **GitHub Actions**: `.github/workflows/cloudflare-pages.yml`
- **Manual Deployment**: `bunx wrangler pages deploy dist --project-name=ibr-web`

### Deployment Workflow

**Automatic Deployments:**

- **Main Branch**: Production deployment to custom domain
- **Feature Branches**: Preview deployments with unique URLs
- **Pull Requests**: Preview deployments with PR comments

**Build Process:**

1. Install dependencies: `bun install --frozen-lockfile`
2. Optimize images: `bun run scripts/optimize-images.js`
3. Build application: `bun run build`
4. Deploy to Cloudflare: `wrangler pages deploy dist`

### Environment Variables

**Configure in Cloudflare Pages Dashboard:**
Settings > Environment variables

**Production (main branch):**

- `NODE_ENV=production`
- `PUBLIC_POSTHOG_KEY` - Analytics key
- `PUBLIC_POSTHOG_HOST` - Analytics host

**Preview (all other branches):**

- `NODE_ENV=development`
- `PUBLIC_POSTHOG_KEY` - Test analytics key (optional)
- `PUBLIC_POSTHOG_HOST` - Test analytics host (optional)

### KV Namespaces

**Configured in `cloudflare-pages.json`:**

**Production:**

- `CACHE` binding → `ibr-cache` namespace
- `SESSION` binding → `ibr-session` namespace

**Preview:**

- `CACHE` binding → `ibr-cache-preview` namespace
- `SESSION` binding → `ibr-session-preview` namespace

### Required GitHub Secrets

**Repository Settings > Secrets and variables > Actions:**

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages edit permission
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

### Local CI Commands (Identical to Remote CI)

**Run full CI pipeline locally (same as GitHub Actions):**

```bash
bun run ci                # Full CI: quality + performance + security
bun run ci:quality        # Just format, lint, build
bun run ci:performance    # Just tests + lighthouse
bun run ci:security       # Just security scan
```

**These commands mirror the GitHub Actions CI workflow exactly - same sequence, same checks.**

### Manual Deployment Commands

**Production deployment:**

```bash
bun run build                  # Build locally first
bun run deploy:production      # Deploy to production (main branch)
```

**Preview deployment:**

```bash
bun run build                  # Build locally first
bun run deploy:preview         # Deploy current branch as preview
```

**Combined (CI + Deploy):**

```bash
bun run deploy                 # Runs CI, then deploys to production if CI passes
```

**Low-level Wrangler commands:**

```bash
bunx wrangler pages deploy dist --project-name=ibr-web --branch=main      # Production
bunx wrangler pages deploy dist --project-name=ibr-web                    # Preview
bunx wrangler pages deployment list --project-name=ibr-web                # List deployments
bunx wrangler pages deployment rollback <id> --project-name=ibr-web      # Rollback
```

### Deployment Verification

After deployment, verify:

1. ✅ GitHub Actions workflow completes successfully
2. ✅ Deployment appears in Cloudflare Pages dashboard
3. ✅ Site is accessible at deployment URL
4. ✅ All routes and features work correctly
5. ✅ Lighthouse scores maintain 90+ across all metrics
6. ✅ No console errors or broken resources

### Troubleshooting

**Build Failures:**

- Check GitHub Actions logs
- Verify environment variables are set
- Ensure `bun.lockb` is up to date
- Test build locally: `bun run build`

**Deployment Failures:**

- Verify API token has correct permissions
- Check account ID is correct
- Ensure project name matches: `ibr-web`
- Review Cloudflare Pages deployment logs

**Runtime Errors:**

- Check environment variables in Cloudflare dashboard
- Verify KV namespaces are bound correctly
- Review browser console for errors
- Check Cloudflare Pages Functions logs

## Deployment Protection Rules

### CRITICAL: No Direct Merges to Main

**ALWAYS use PR workflow:**

1. Create feature branch
2. Make changes and push
3. Wait for CI to pass
4. Get CODEOWNERS approval
5. Verify preview deployment
6. Merge only after all gates pass

### Multi-Layer Protection

**Layer 1: CODEOWNERS** (Technical Enforcement)

- All PRs require @mishaal79 approval
- Merge button disabled until approved
- Cannot be bypassed (except by admin)

**Layer 2: CI Deployment Gate** (Visual Indicator)

- 🚦 deployment-gate job must pass
- Visible status check on PR
- Failed CI = Red X = DO NOT MERGE

**Layer 3: PR Auto-Labels** (Visual Warning)

- ✅ safe-to-merge = Green label (CI passed)
- ❌ do-not-merge = Red label (CI failed)
- Updates automatically when CI completes

**Layer 4: PR Checklist** (Manual Verification)

- Template auto-populates on PR creation
- Developer confirms all checks passed
- Documents what was tested

**Layer 5: Post-Deployment Verification** (Production Safety)

- Runs after main branch deployment
- Smoke tests production endpoints
- Alerts if deployment broken

### Regression Prevention Checklist

Before merging ANY PR:

- [ ] ✅ All CI checks passed (green checkmarks)
- [ ] ✅ CODEOWNERS approved
- [ ] ✅ Preview deployment tested
- [ ] ✅ Lighthouse scores ≥ 90
- [ ] ✅ No console errors
- [ ] ✅ Mobile tested
- [ ] ✅ PR checklist completed

### Emergency Procedures

**If bad deployment reaches production:**

1. Run Emergency Rollback workflow (GitHub Actions)
2. Or use Wrangler CLI: `bunx wrangler pages deployment rollback <id>`
3. Investigate issue in feature branch
4. Fix and re-deploy via PR workflow

**Never push directly to main to fix production!**

## Image Optimization Standards

### Tool: sharp-cli

**MANDATORY: Use sharp-cli for all image conversions via bunx**

- NEVER write custom image processing scripts
- ALWAYS use `bunx sharp` for consistency and reliability
- PREFERRED formats: AVIF (primary), WebP (fallback), original (last resort)

### Standard Commands

**WebP Conversion (quality 75-80):**

```bash
bunx sharp -i <input> -o <output> -f webp --quality 80
```

**AVIF Conversion (quality 65-70):**

```bash
bunx sharp -i <input> -o <output> -f avif --quality 70
```

**Responsive Image Generation:**

```bash
# Small viewport (476px)
bunx sharp -i image.jpg -o image-476.webp -f webp --quality 75 --width 476

# Medium viewport (800px)
bunx sharp -i image.jpg -o image-800.webp -f webp --quality 75 --width 800

# Large viewport (1200px)
bunx sharp -i image.jpg -o image-1200.webp -f webp --quality 75 --width 1200
```

### Quality Standards

**Photos/Gradients:**

- WebP: quality 75-80
- AVIF: quality 65-70

**Graphics/Screenshots:**

- WebP: quality 80-90
- AVIF: quality 70-80

**Transparency:**

- Always preserve alpha channel
- Use PNG fallback if needed

### HTML Implementation Requirements

**ALWAYS use picture element with srcset for responsive images:**

```html
<picture>
  <source
    type="image/avif"
    srcset="img-476.avif 476w, img-800.avif 800w"
    sizes="(max-width: 768px) 476px, 800px" />
  <source
    type="image/webp"
    srcset="img-476.webp 476w, img-800.webp 800w"
    sizes="(max-width: 768px) 476px, 800px" />
  <img src="img.jpg" alt="Description" loading="lazy" width="800" height="600" />
</picture>
```

**Loading Strategy:**

- **Above-the-fold (LCP)**: `loading="eager"` + `fetchpriority="high"`
- **Below-the-fold**: `loading="lazy"`
- **Always specify**: `width` and `height` attributes (prevent layout shift)
