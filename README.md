# Indo Bintang Rezki - Astro Website

Modern, SEO-optimized website built with Astro, TailwindCSS, and headless CMS integration.

## 🚀 Features

- ✅ **SEO-Optimized** with meta tags, Open Graph, JSON-LD structured data
- 📱 **Fully Responsive** design for all devices
- 🔎 **Automatic Sitemap & RSS Feed** generation
- 📄 **Content Collection API** for managing blog posts and team members
- 🏛️ **Strapi CMS Integration** for dynamic content
- 📊 **Semantic Structured Data** (JSON-LD) for better search visibility
- 🎨 **TailwindCSS** styling with beautiful components
- 🔄 **Automated Deployment** via GitHub Actions

## 🧰 Tech Stack

- [Astro](https://astro.build) - Fast, lean static site generator
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [Strapi CMS](https://strapi.io) - Headless CMS for content management
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Bun](https://bun.sh) - Modern JavaScript runtime and package manager

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)
- [Node.js](https://nodejs.org) (v18.14.1 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ibr-web.git
cd ibr-web

# Install dependencies
bun install

# Start the development server
bun run dev
```

### Environment Variables

For Strapi CMS integration, you need to set up environment variables:

```bash
# Run the helper script
./setup-strapi-env.sh
```

Or manually create a `.env` file:

```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
```

### Build for Production

```bash
bun run build
```

## 📂 Project Structure

```
/
├── docs/                # Documentation
│   ├── seo-integration.md       # SEO integration guide
│   └── strapi-seo-schema.md     # Strapi SEO schema setup
├── public/              # Static assets
├── src/
│   ├── components/      # UI components
│   ├── content/         # Content collections
│   │   ├── blog/        # Blog articles
│   │   ├── pages/       # Static pages
│   │   └── team/        # Team member profiles
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   └── utils/           # Utility functions
│       ├── api/         # API integration utilities
│       │   └── cms.ts   # Strapi CMS integration
│       └── structuredData.ts    # JSON-LD generation
└── setup-strapi-env.sh  # Environment setup script
```

## 🖼️ Image Optimization

This project uses **sharp-cli** for all image optimization and conversion tasks.

### Converting Images to Modern Formats

**Install and convert (using bunx - no installation needed):**

```bash
# Convert to WebP
bunx sharp -i src/assets/image.jpg -o src/assets/image.webp -f webp --quality 80

# Convert to AVIF
bunx sharp -i src/assets/image.jpg -o src/assets/image.avif -f avif --quality 70

# Resize and convert
bunx sharp -i src/assets/large.jpg -o src/assets/small.webp -f webp --quality 75 --width 800
```

### Best Practices

- **WebP quality**: 75-80 for photos, 80-90 for graphics
- **AVIF quality**: 65-70 (provides better compression than WebP)
- **Generate responsive sizes**: 476w, 800w, 1200w for different viewports
- **Always include width/height** attributes to prevent layout shifts
- **Use picture element** with modern format fallbacks (AVIF → WebP → original)

### ⚠️ CRITICAL: Image Component Usage in Astro

**NEVER use hardcoded `/src/assets/` paths in `srcset` attributes!**

Astro's build system uses static analysis and **cannot process plain string paths** in srcset. This causes images to fail loading in production.

**❌ WRONG - Hardcoded paths (will break in production):**

```astro
<picture>
  <source type="image/avif" srcset="/src/assets/hero.avif" />
  <source type="image/webp" srcset="/src/assets/hero.webp" />
  <img src={heroImage.src} alt="Hero" />
</picture>
```

**✅ CORRECT - Use Astro's official `<Picture>` component:**

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

**✅ CORRECT - Responsive images with multiple widths:**

```astro
---
import { Picture } from 'astro:assets';
import indonesiaMap from '../assets/indonesia-map.jpg';
---

<Picture
  src={indonesiaMap}
  widths={[476, 800, 1200]}
  sizes="(max-width: 768px) 476px, (max-width: 1024px) 800px, 1200px"
  formats={['avif', 'webp']}
  alt="Indonesia Map"
  width={1200}
  height={800}
  loading="lazy"
/>
```

**Why this matters:**

- Astro uses **ESM imports** and **static analysis** at build time
- String literals in `srcset` are **not processed** during build
- Build tools cannot infer which files to optimize from plain strings
- Using `<Picture>` component ensures proper asset optimization and path resolution

**For simple images without responsive sizes:**

```astro
---
import { Image } from 'astro:assets';
import logo from '../assets/logo.png';
---

<Image src={logo} alt="Logo" width={200} height={100} />
```

See [Astro Image Documentation](https://docs.astro.build/en/guides/images/) for more details.

## 🔍 SEO & Discovery

This site is fully optimized for search engines and AI discovery:

- **Sitemap**: Auto-generated at build time via `@astrojs/sitemap`
  - Generates `sitemap-index.xml` and `sitemap-0.xml`
  - Automatically discovers all pages and content collections
  - No manual updates needed - regenerates every build
- **robots.txt**: Configured for optimal crawling (HTTPS URLs)
- **llms.txt**: LLM-readable site summary for AI discovery
- **X-Robots-Tag**: Explicitly set to `index, follow` for production
- **Structured Data**: JSON-LD schema for organization and articles

All SEO files are generated automatically during `bun run build`.

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [SEO Integration Guide](docs/seo-integration.md)
- [Strapi SEO Schema Setup](docs/strapi-seo-schema.md)

## 🔄 Deployment

This project uses a **hybrid deployment architecture** with Cloudflare Pages Direct Git Integration and GitHub Actions CI pipeline.

### Architecture Overview

```
Push to GitHub
    ↓
┌───────────────────┬─────────────────────┐
│  Cloudflare       │  GitHub Actions     │
│  Direct Git       │  CI Pipeline        │
├───────────────────┼─────────────────────┤
│  Deploys preview  │  Runs quality gates │
│  or production    │  - Formatting       │
│                   │  - Linting          │
│                   │  - Build            │
│                   │  - Tests            │
│                   │  - Lighthouse       │
│                   │  - Security audit   │
└───────────────────┴─────────────────────┘
```

### Development Workflow

1. **Create feature branch** from main
2. **Make changes** and commit (triggers Husky hooks)
3. **Push branch** → Cloudflare deploys preview + CI runs
4. **Test preview** deployment at `https://[branch].ibr-web.pages.dev`
5. **Wait for CI** to complete (must pass all checks)
6. **Create PR** with completed checklist
7. **Get review** approval (CODEOWNERS enforced)
8. **Merge to main** → Production deployment

### Deployment Channels

- **Production**: `main` branch → https://indobintangrezki.com
- **Preview**: All other branches → `https://[branch].ibr-web.pages.dev`

### Environment Variables

**Regular Variables** (via `wrangler.toml`):

- Configured in `[vars]` section for preview
- Configured in `[env.production.vars]` for production
- Example: `NODE_ENV`

**Secrets** (encrypted, via Dashboard or CLI):

- Dashboard: Settings → Environment variables → Add variable
- CLI: `bunx wrangler pages secret put SECRET_NAME`
- Example: API keys, tokens, passwords

### Quality Gates (All Required)

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ Build verification
- ✅ Accessibility tests (Playwright + axe)
- ✅ Performance tests (Lighthouse ≥ 90)
- ✅ Security audit (no high vulnerabilities)

### Emergency Rollback

```bash
# List recent deployments
bunx wrangler pages deployment list --project-name=ibr-web

# Rollback to specific deployment
bunx wrangler pages deployment rollback <deployment-id>
```

Or use GitHub Actions: **Actions** → **🔙 Emergency Rollback** → **Run workflow**

### Local CI (Override Option)

Run the **identical CI pipeline locally** (same as GitHub Actions):

```bash
bun run ci                # Full CI: quality + performance + security
bun run ci:quality        # Just format, lint, build
bun run ci:performance    # Just tests + lighthouse
bun run ci:security       # Just security scan
```

**Local CI is faster** (runs on your machine) and **identical to remote CI** (same commands, same sequence).

### Manual Deployment

**Production:**

```bash
bun run build                  # Build locally
bun run deploy:production      # Deploy to Cloudflare (main branch)
```

**Preview (current branch):**

```bash
bun run build                  # Build locally
bun run deploy:preview         # Deploy as preview
```

**Combined (CI + Deploy):**

```bash
bun run deploy                 # Runs full CI, then deploys if passing
```

**Emergency rollback:**

```bash
bunx wrangler pages deployment list --project-name=ibr-web        # List deployments
bunx wrangler pages deployment rollback <id> --project-name=ibr-web  # Rollback
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed developer workflow.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build) - For the amazing web framework
- [TailwindCSS](https://tailwindcss.com) - For the utility-first CSS framework
- [Strapi](https://strapi.io) - For the headless CMS
