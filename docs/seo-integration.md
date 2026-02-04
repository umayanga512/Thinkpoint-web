# SEO Integration Guide

This document explains how the SEO integration works in our Astro project and how to use it with Strapi CMS.

## Overview

We've implemented a comprehensive SEO solution that:

1. Centralizes SEO configuration in a utility
2. Supports both static and CMS-driven SEO metadata
3. Includes structured data (JSON-LD) for enhanced search results
4. Properly sets up RSS feed and sitemap
5. Is fully integrated with Strapi CMS

## Project Structure

```
src/
├── utils/
│   ├── seo.ts                  # SEO utility functions
│   └── api/
│       └── cms.ts              # Strapi CMS integration for SEO
├── layouts/
│   ├── Layout.astro            # Main layout with SEO component
│   └── BlogLayout.astro        # Blog-specific layout with article structured data
├── pages/
│   ├── [...slug].astro         # Dynamic page with CMS-driven SEO
│   └── rss.xml.ts              # RSS feed with SEO metadata
└── content/
    └── config.ts               # Content collections with SEO schema
```

## Using SEO in Your Pages

### Static Pages

For statically defined pages, pass SEO metadata as props to the Layout component:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="About Us"
  description="Learn more about our company and mission"
  image="/images/about-cover.jpg">
  <!-- Page content -->
</Layout>
```

### Content Collections

For content collections, SEO metadata is defined in the frontmatter:

```markdown
---
title: Hello World
snippet: This is my first blog post
image:
  src: /images/blog-cover.jpg
  alt: Cover image
publishDate: 2023-01-01
author: John Doe
category: Announcements
tags: [welcome, first-post]
seo:
  title: Custom SEO Title
  description: A more detailed SEO description
  ogImage: /images/custom-social-image.jpg
---

Content goes here...
```

### CMS-Driven Pages

For CMS-driven pages, SEO metadata is fetched from Strapi:

```astro
---
import Layout from '../layouts/Layout.astro';
import { fetchSeoMetadata } from '../utils/api/cms';

const slug = 'about-us';
const seoMetadata = await fetchSeoMetadata('pages', slug);
---

<Layout {...seoMetadata}>
  <!-- Page content -->
</Layout>
```

## SEO Metadata Fields

The following SEO metadata fields are supported:

| Field               | Description                                  |
| ------------------- | -------------------------------------------- |
| title               | SEO title (overrides page title)             |
| description         | SEO description (overrides page description) |
| image               | Social sharing image URL                     |
| canonicalUrl        | Canonical URL for the page                   |
| ogType              | OpenGraph type (e.g., 'website', 'article')  |
| instagramUsername   | Instagram username for attribution           |
| linkedinProfile     | LinkedIn profile path for attribution        |
| articlePublishDate  | Publication date for articles                |
| articleModifiedDate | Last modification date for articles          |
| articleAuthor       | Author name for articles                     |

## Structured Data

We automatically generate structured data (JSON-LD) for:

1. **Organizations** - On all pages
2. **Articles** - On blog posts

This helps search engines better understand your content and can result in rich snippets in search results.

## Environment Variables

Set these environment variables to configure the CMS integration:

```
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here
```

## Further Customization

To customize the SEO defaults, edit `src/utils/seo.ts` and modify the `defaultSeoConfig` object.

## Setting Up Strapi CMS

See [Strapi SEO Schema Setup](./strapi-seo-schema.md) for detailed instructions on setting up your Strapi CMS for SEO.
