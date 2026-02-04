# Cloudflare Pages Migration Checklist

This document tracks the migration from Vercel to Cloudflare Pages.

## 📋 Pre-Migration (Manual Steps)

### Cloudflare Dashboard Setup

- [ ] **Create Cloudflare Pages Project**
  - Project name: `ibr-web`
  - Build command: `bun run build`
  - Build output: `dist`
  - Framework preset: Astro

- [ ] **Generate Cloudflare API Token**
  - Go to: https://dash.cloudflare.com/profile/api-tokens
  - Create token with permissions:
    - Account - Cloudflare Pages:Edit
    - Account - Account Settings:Read
  - Copy token for GitHub Secrets

- [ ] **Get Cloudflare Account ID**
  - Found in: Cloudflare Dashboard > Workers & Pages > Overview
  - Copy account ID for GitHub Secrets

- [ ] **Create KV Namespaces**
  - Production:
    - [ ] `ibr-cache` - Static asset caching
    - [ ] `ibr-session` - User session management
  - Preview:
    - [ ] `ibr-cache-preview` - Preview environment caching
    - [ ] `ibr-session-preview` - Preview environment sessions

### GitHub Repository Setup

- [ ] **Add GitHub Secrets**
  - Go to: Repository Settings > Secrets and variables > Actions
  - Add secrets:
    - [ ] `CLOUDFLARE_API_TOKEN` - API token from Cloudflare
    - [ ] `CLOUDFLARE_ACCOUNT_ID` - Account ID from Cloudflare

### Environment Variables Migration

- [ ] **Migrate from Vercel to Cloudflare**
  - In Cloudflare Pages > Settings > Environment variables
  - Production (main branch):
    - [ ] `PUBLIC_POSTHOG_KEY`
    - [ ] `PUBLIC_POSTHOG_HOST`
    - [ ] `NODE_ENV=production`
  - Preview (\* all branches):
    - [ ] `PUBLIC_POSTHOG_KEY` (same or different for testing)
    - [ ] `PUBLIC_POSTHOG_HOST`
    - [ ] `NODE_ENV=development`

## 🤖 Automated Migration (Via GitHub Actions)

These steps are automated by the migration commit:

- [x] ✅ Created `.github/workflows/cloudflare-pages.yml`
- [x] ✅ Removed `.github/workflows/deploy.yml` (GitHub Pages)
- [x] ✅ Removed `vercel.json` configuration
- [x] ✅ Removed `.vercel/` directory
- [x] ✅ Updated `README.md` with Cloudflare deployment docs
- [x] ✅ Updated `.gitignore` for Cloudflare artifacts
- [x] ✅ Created this migration checklist

## ✅ Post-Migration Verification

### Immediate Checks (After First Deployment)

- [ ] **Verify Deployment**
  - [ ] GitHub Actions workflow completes successfully
  - [ ] Cloudflare Pages dashboard shows deployment
  - [ ] Preview URL is accessible
  - [ ] Production URL is accessible

- [ ] **Test Functionality**
  - [ ] Homepage loads correctly
  - [ ] All routes work (about, blog, contact)
  - [ ] Images display properly (WebP/AVIF)
  - [ ] Navigation works
  - [ ] Forms function correctly

- [ ] **Verify Configuration**
  - [ ] Environment variables are set
  - [ ] KV namespaces are bound
  - [ ] Headers are applied correctly
  - [ ] Redirects work as expected

### Within 24 Hours

- [ ] **Custom Domain Configuration**
  - [ ] Add custom domain in Cloudflare Pages: `indobintangrezki.com`
  - [ ] Add www subdomain: `www.indobintangrezki.com`
  - [ ] Verify SSL/TLS certificate is active
  - [ ] Test custom domain accessibility

- [ ] **DNS Configuration**
  - In Cloudflare DNS dashboard:
    - [ ] Add/Update CNAME: `indobintangrezki.com` → `ibr-web.pages.dev`
    - [ ] Add/Update CNAME: `www` → `ibr-web.pages.dev`
  - [ ] Wait for DNS propagation (can take up to 24 hours)
  - [ ] Verify custom domain resolves correctly

- [ ] **Analytics & Monitoring**
  - [ ] Verify PostHog analytics are working
  - [ ] Enable Cloudflare Web Analytics (optional)
  - [ ] Check Cloudflare Pages Analytics dashboard
  - [ ] Set up error tracking/alerting

### Within 1 Week

- [ ] **Performance Verification**
  - [ ] Run Lighthouse audit
    - [ ] Performance: 90+
    - [ ] Accessibility: 90+
    - [ ] Best Practices: 90+
    - [ ] SEO: 90+
  - [ ] Compare with previous Vercel metrics
  - [ ] Check Core Web Vitals in Search Console

- [ ] **Monitoring**
  - [ ] Check error rates in Cloudflare dashboard
  - [ ] Monitor deployment success rate
  - [ ] Verify all features work correctly
  - [ ] Review user feedback (if any)

- [ ] **Cleanup**
  - [ ] Archive Vercel project (do not delete immediately)
  - [ ] Update external links to new deployment
  - [ ] Update documentation with new URLs
  - [ ] Notify team of migration completion

## 🎯 Success Criteria

All of these must be true to consider migration successful:

- [x] ✅ GitHub Actions workflow deploys automatically
- [ ] ⏳ Production site accessible at https://indobintangrezki.com
- [ ] ⏳ Preview deployments work on pull requests
- [ ] ⏳ All environment variables configured correctly
- [ ] ⏳ KV namespaces connected and functional
- [ ] ⏳ Lighthouse scores maintain 90+ across all metrics
- [ ] ⏳ No increase in error rates compared to Vercel
- [ ] ⏳ All site features working as expected
- [ ] ⏳ Custom domain DNS propagated fully
- [ ] ⏳ SSL/TLS certificate active and valid

## 🚨 Rollback Plan

If critical issues occur during migration:

### Immediate Rollback (< 1 Hour)

1. **Re-enable Vercel Deployment**

   ```bash
   git revert HEAD  # Revert migration commit
   git push origin main
   ```

2. **Update DNS (if changed)**
   - Point DNS back to Vercel
   - Wait for propagation

3. **Communicate Issue**
   - Notify team
   - Document the problem
   - Plan retry strategy

### Debugging Before Rollback

1. **Check GitHub Actions Logs**
   - Review build logs for errors
   - Verify environment variables
   - Check API token permissions

2. **Verify Cloudflare Configuration**
   - KV namespaces exist and are bound
   - Environment variables are set
   - Build settings are correct

3. **Test Locally**
   ```bash
   bun run build
   bunx wrangler pages deploy dist --project-name=ibr-web
   ```

## 📊 Performance Comparison

Track these metrics before and after migration:

| Metric           | Vercel    | Cloudflare Pages | Delta  |
| ---------------- | --------- | ---------------- | ------ |
| Build Time       | **\_**min | **\_**min        | **\_** |
| Deploy Time      | **\_**s   | **\_**s          | **\_** |
| Cold Start       | **\_**ms  | **\_**ms         | **\_** |
| TTFB             | **\_**ms  | **\_**ms         | **\_** |
| LCP              | **\_**s   | **\_**s          | **\_** |
| Lighthouse Score | **\_**    | **\_**           | **\_** |

## 📝 Notes

### Migration Date

- **Started**: [DATE]
- **Completed**: [DATE]
- **Duration**: [TIME]

### Issues Encountered

- None (yet)

### Lessons Learned

- TBD after completion

---

**Last Updated**: 2025-10-03
**Status**: ⏳ In Progress
