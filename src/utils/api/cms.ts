import type { SeoMetadata } from '../seo';

// Define the shape of SEO data from Strapi
export interface StrapiSeoData {
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: {
    data?: {
      attributes?: {
        url: string;
      };
    };
  };
  canonicalURL?: string;
  metaRobots?: string;
  keywords?: string;
  metaSocial?: {
    socialNetwork: string;
    title?: string;
    description?: string;
    image?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  }[];
}

export interface StrapiContentItem {
  id: number;
  attributes: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    publishedAt?: string;
    updatedAt?: string;
    seo?: StrapiSeoData;
    // Add other attributes as needed
  };
}

/**
 * Base URL for Strapi API
 */
const STRAPI_API_URL = import.meta.env.STRAPI_API_URL || 'http://localhost:1337';

/**
 * Fetch data from Strapi API
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${STRAPI_API_URL}/api/${endpoint}`);

  // Add params to URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${import.meta.env.STRAPI_API_TOKEN || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Convert Strapi SEO data to our app's SEO metadata format
 */
export function strapiSeoToMetadata(
  data: StrapiSeoData,
  defaultData: Partial<SeoMetadata> = {}
): SeoMetadata {
  const metadata: SeoMetadata = {
    ...defaultData,
    title: data.metaTitle || defaultData.title,
    description: data.metaDescription || defaultData.description,
    canonicalUrl: data.canonicalURL || defaultData.canonicalUrl,
    // Handle image URLs from Strapi that might be relative
    image: data.metaImage?.data?.attributes?.url
      ? data.metaImage.data.attributes.url.startsWith('http')
        ? data.metaImage.data.attributes.url
        : `${STRAPI_API_URL}${data.metaImage.data.attributes.url}`
      : defaultData.image,
  };

  // Add Instagram-specific metadata if available
  const instagramData = data.metaSocial?.find((social) => social.socialNetwork === 'Instagram');
  if (instagramData) {
    metadata.instagramUsername = defaultData.instagramUsername;
  }

  // Add LinkedIn-specific metadata if available
  const linkedinData = data.metaSocial?.find((social) => social.socialNetwork === 'LinkedIn');
  if (linkedinData) {
    metadata.linkedinProfile = defaultData.linkedinProfile;
  }

  return metadata;
}

/**
 * Fetch a single entry from Strapi by collection type and slug
 */
export async function fetchSingleEntry(
  collectionType: string,
  slug: string,
  populate: string[] = ['seo', 'seo.metaImage']
): Promise<StrapiContentItem | null> {
  try {
    const populateQuery = populate.length ? `populate=${populate.join(',')}` : '';
    const filterQuery = `filters[slug][$eq]=${slug}`;

    const response = await fetchFromStrapi<{ data: StrapiContentItem[] }>(collectionType, {
      [populateQuery]: '',
      [filterQuery]: '',
    });

    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching ${collectionType} with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch SEO data for a specific page from Strapi
 */
export async function fetchSeoMetadata(
  pageType: string,
  slug: string,
  defaultMetadata: Partial<SeoMetadata> = {}
): Promise<SeoMetadata> {
  try {
    const entry = await fetchSingleEntry(pageType, slug);

    if (entry && entry.attributes.seo) {
      return strapiSeoToMetadata(entry.attributes.seo, {
        title: entry.attributes.title,
        description: entry.attributes.description,
        ...defaultMetadata,
      });
    }

    // If no SEO data in Strapi, return default metadata with basic page info
    return {
      title: entry?.attributes.title || defaultMetadata.title,
      description: entry?.attributes.description || defaultMetadata.description,
      ...defaultMetadata,
    };
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return defaultMetadata as SeoMetadata;
  }
}
