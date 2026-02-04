// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

// 2. Define your collection(s) using the new Content Layer API
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform((str) => new Date(str)),
    author: z.string().default('Qrius Global'),
    category: z.string(),
    tags: z.array(z.string()),
    // SEO metadata
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        canonicalUrl: z.string().optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
});

const teamCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/team' }),
  schema: z.object({
    draft: z.boolean(),
    name: z.string(),
    title: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform((str) => new Date(str)),
    // SEO metadata
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
});

// Define a page collection for regular pages
const pageCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),
    // SEO metadata
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        canonicalUrl: z.string().optional(),
        ogImage: z.string().optional(),
        ogType: z.string().optional(),
      })
      .optional(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
  team: teamCollection,
  pages: pageCollection,
};
