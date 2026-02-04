import { getCollection } from 'astro:content';

import rss from '@astrojs/rss';

import { SITE_DESCRIPTION, SITE_TITLE } from '../config';

export async function get(context) {
  const blog = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.snippet,
      author: post.data.author,
      // customData helps with SEO in RSS feeds
      customData: `
        <image>
          <url>${new URL(post.data.image.src, context.site).toString()}</url>
          <title>${post.data.title}</title>
          <link>${new URL(`/blog/${post.id}`, context.site).toString()}</link>
        </image>
      `,
      link: `/blog/${post.id}/`,
    })),
    // Optional: customize the RSS output with custom namespaces
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${new URL('rss.xml', context.site)}" rel="self" type="application/rss+xml" />
    `,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      content: 'http://purl.org/rss/1.0/modules/content/',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  });
}
