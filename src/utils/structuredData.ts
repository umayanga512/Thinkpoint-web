// import type { CollectionEntry } from 'astro:content';
import { SITE_TITLE, SITE_URL } from '../config';

interface OrganizationData {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export function generateOrganizationSchema(data: OrganizationData = {}) {
  const {
    name = SITE_TITLE,
    url = SITE_URL,
    logo = `${SITE_URL}/images/logo.png`,
    sameAs = [
      'https://www.instagram.com/thinkpoint',
      'https://www.linkedin.com/company/thinkpoint',
    ],
  } = data;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs,
  };
}

interface BlogEntryData {
  title: string;
  snippet?: string;
  description?: string;
  image?: { src: string; alt: string } | string;
  publishDate: Date;
  updatedDate?: Date;
  author?: any;
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: string;
    instagramUsername?: string;
    linkedinProfile?: string;
  };
}

export function generateArticleSchema(post: { data: BlogEntryData; slug: string }) {
  const { data, slug } = post;
  const url = `${SITE_URL}/blog/${slug}`;

  // Extract author name safely
  const authorName =
    typeof data.author === 'object' && data.author?.data?.name
      ? data.author.data.name
      : 'ThinkPoint';

  // Handle different image formats
  let imageUrl = `${SITE_URL}/images/blog-default.jpg`;
  if (data.image) {
    if (typeof data.image === 'string') {
      imageUrl = `${SITE_URL}${data.image}`;
    } else if (data.image.src) {
      imageUrl = `${SITE_URL}${data.image.src}`;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    image: imageUrl,
    datePublished: data.publishDate.toISOString(),
    dateModified: data.updatedDate?.toISOString() || data.publishDate.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: data.description || data.snippet || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper to convert schema object to JSON string for inline script
export function schemaToString(schema: Record<string, any>): string {
  return JSON.stringify(schema, null, process.env.NODE_ENV === 'development' ? 2 : 0);
}
