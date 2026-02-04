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
  title: 'Indo Bintang Rezki',
  titleTemplate: '%s | Trusted Indonesian Partner',
  defaultTitle: 'Indo Bintang Rezki - Indonesian Trading Company',
  description:
    'Indo Bintang Rezki is a leading Indonesian commodity trading company connecting domestic producers with international markets. We provide reliable supply chain solutions with a focus on quality and sustainability.',
  defaultImage: '/opengraph.png',
  siteName: 'Indo Bintang Rezki',
  siteUrl: 'https://indobintangrezki.com',
  instagramUsername: 'indobintangrezki',
  linkedinProfile: 'company/indobintangrezki',
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
        { name: 'author', content: 'Indo Bintang Rezki' },
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
      name: metadata.articleAuthor || 'Indo Bintang Rezki',
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
