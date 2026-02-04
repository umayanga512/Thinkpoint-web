# Contributing to IBR Web

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0.0+
- Git

### Setup

```bash
# Clone and install
git clone https://github.com/mishaal79/ibr-web.git
cd ibr-web
bun install

# Start dev server
bun run dev
# Visit: http://localhost:4321
```

## 📋 Development Workflow

### 1. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code following project conventions
- Test locally: `bun run dev`
- Format: `bun run format`
- Lint: `bun run lint`

### 3. Commit Changes

```bash
git add .
git commit -m "feat: your feature description"
# Husky automatically runs: image optimization, formatting, linting
```

**Commit Format** (conventional commits):

- `feat:` New feature
- `fix:` Bug fix
- `chore:` Maintenance
- `docs:` Documentation
- `perf:` Performance improvement

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create PR on GitHub. This triggers:

- **Cloudflare**: Deploys preview at `https://[branch].ibr-web.pages.dev`
- **CI**: Runs quality checks (formatting, linting, tests, Lighthouse)

### 5. Test Preview

- Test preview URL (posted in PR comments)
- Verify Lighthouse scores ≥ 90
- Check mobile responsiveness
- Ensure no console errors

### 6. Wait for Review

- CODEOWNERS automatically requests review from @mishaal79
- Address feedback if needed
- CI must pass (all green checks)

### 7. Merge to Main

After approval and passing CI:

- Merge PR → Cloudflare automatically deploys to production
- Post-deployment verification runs (smoke tests)

## 🛡️ Quality Standards

### Required Before Merge

- ✅ Lighthouse scores ≥ 90 (all metrics)
- ✅ Zero ESLint errors
- ✅ All tests passing
- ✅ No high/critical security vulnerabilities
- ✅ Build successful

### Code Style

- Use Prettier (auto-runs on commit)
- Follow ESLint rules
- TypeScript strict mode
- Semantic HTML + Tailwind CSS

## 🚨 Emergency Rollback

```bash
# List recent deployments
bunx wrangler pages deployment list --project-name=ibr-web

# Rollback to specific deployment
bunx wrangler pages deployment rollback <deployment-id>
```

## 📚 Resources

- [Astro Docs](https://docs.astro.build)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Playwright Testing](https://playwright.dev)
