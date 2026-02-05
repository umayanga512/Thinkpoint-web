import type { Props as SEOProps } from 'astro-seo';

export interface SeoMetadata {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  ogType?: string;
  instagramUsername?: string;
  linkedinProfile?: string;
  articlePublishDate?: Date;
  articleModifiedDate?: Date;
  articleAuthor?: string;
}

const defaultSeoConfig = {
  title: 'ThinkPoint',
  titleTemplate: '%s | ThinkPoint Study Centre',
  defaultTitle: 'ThinkPoint - Study Centre in Nugegoda',
  description:
    'ThinkPoint is a study centre venture in Nugegoda - a physical spot where students and freelancers can come to work, study, and think. Experience a productive environment designed for focused work and collaboration.',
  defaultImage: '/opengraph.png',
  siteName: 'ThinkPoint',
  siteUrl: 'https://thinkpoint.lk',
  instagramUsername: 'thinkpoint',
  linkedinProfile: 'company/thinkpoint',
  locale: 'en_US',
};

/**
 * Generates SEO configuration based on provided metadata, with reasonable defaults
 */
export function generateSeoConfig(
  metadata: SeoMetadata = {},
  siteUrl: string = defaultSeoConfig.siteUrl
): SEOProps {
  const {
    title,
    description = defaultSeoConfig.description,
    image = defaultSeoConfig.defaultImage,
    canonicalUrl,
    ogType = 'website',
    instagramUsername = defaultSeoConfig.instagramUsername,
    linkedinProfile = defaultSeoConfig.linkedinProfile,
    articlePublishDate,
    articleModifiedDate,
    articleAuthor,
  } = metadata;

  const resolvedTitle = title ? `${title}` : defaultSeoConfig.defaultTitle;

  const displayTitle = title
    ? defaultSeoConfig.titleTemplate.replace('%s', title)
    : defaultSeoConfig.defaultTitle;

  const resolvedCanonicalUrl = canonicalUrl || '';
  const resolvedImageWithDomain = image.startsWith('http')
    ? image
    : new URL(image, siteUrl).toString();

  const seoConfig: SEOProps = {
    title: displayTitle,
    description: description,
    canonical: resolvedCanonicalUrl,
    openGraph: {
      basic: {
        title: resolvedTitle,
        type: ogType,
        image: resolvedImageWithDomain,
        url: resolvedCanonicalUrl,
      },
      image: {
        alt: resolvedTitle,
        width: 1200,
        height: 630,
      },
      optional: {
        siteName: defaultSeoConfig.siteName,
        description: description,
        locale: defaultSeoConfig.locale,
      },
    },
    extend: {
      meta: [
        { name: 'theme-color', content: '#DFF5E9' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'author', content: 'ThinkPoint' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:see_also', content: `https://www.instagram.com/${instagramUsername}` },
        { property: 'og:see_also', content: `https://www.linkedin.com/${linkedinProfile}` },
      ],
    },
  };

  // Add article specific metadata if it's a blog post
  if (ogType === 'article') {
    seoConfig.openGraph!.article = {
      authors: articleAuthor ? [articleAuthor] : undefined,
      publishedTime: articlePublishDate?.toISOString(),
      modifiedTime: articleModifiedDate?.toISOString(),
    };
  }

  return seoConfig;
}

/**
 * Create structured data JSON-LD for articles
 */
export function generateArticleStructuredData(metadata: SeoMetadata, url: string) {
  if (!metadata.title) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    image: metadata.image,
    datePublished: metadata.articlePublishDate?.toISOString(),
    dateModified:
      metadata.articleModifiedDate?.toISOString() || metadata.articlePublishDate?.toISOString(),
    author: {
      '@type': 'Person',
      name: metadata.articleAuthor || 'ThinkPoint',
    },
    publisher: {
      '@type': 'Organization',
      name: defaultSeoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/logo.svg', defaultSeoConfig.siteUrl).toString(),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Create structured data JSON-LD for Organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: defaultSeoConfig.siteName,
    url: defaultSeoConfig.siteUrl,
    logo: new URL('/logo.svg', defaultSeoConfig.siteUrl).toString(),
    sameAs: [
      'https://www.instagram.com/' + defaultSeoConfig.instagramUsername,
      'https://www.linkedin.com/' + defaultSeoConfig.linkedinProfile,
    ],
  };
}
