# Strapi SEO Schema Setup

This document explains how to set up your Strapi CMS to manage SEO metadata for your Astro website.

## Setting up the SEO Component

1. In your Strapi admin panel, go to **Content-Type Builder**
2. Click on **Components** and then **Create new component**
3. Use the following settings:
   - Category: "SEO"
   - Name: "Metadata"

4. Add the following fields:

| Field Name      | Type           | Description                                                       |
| --------------- | -------------- | ----------------------------------------------------------------- |
| metaTitle       | Text           | Page/content title for SEO purposes                               |
| metaDescription | Long text      | Description for search engines                                    |
| metaImage       | Media (single) | Image to be used in social shares                                 |
| canonicalURL    | Text           | Optional canonical URL if different from default                  |
| metaRobots      | Text           | Optional, controls search engine behavior (e.g., "index, follow") |
| keywords        | Text           | Optional, comma-separated keywords                                |

5. Create another component under the "SEO" category named "Meta Social"

6. Add the following fields:

| Field Name    | Type        | Description                                 |
| ------------- | ----------- | ------------------------------------------- |
| socialNetwork | Enumeration | Values: "Facebook", "Instagram", "LinkedIn" |
| title         | Text        | e.g. "Instagram specific title"             |
| description   | Text        | Description for social media                |
| image         | Media       | Image for social media                      |

7. Go back to the "Metadata" component and add a new field:
   - Field Name: "metaSocial"
   - Type: Component
   - Component: "SEO.Meta Social"
   - Allow multiple entries: Yes

## Adding SEO to Content Types

Add the SEO component to your content types (e.g., Blog, Pages):

1. Go to **Content-Type Builder**
2. Select the content type you want to add SEO to
3. Click **Add another field**
4. Choose **Component**
5. Select the "SEO.Metadata" component
6. Save your changes

## Example Strapi API Structure

When fetched through the API, your SEO data will look something like this:

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "My Page",
      "content": "The page content...",
      "slug": "my-page",
      "seo": {
        "metaTitle": "Custom SEO Title",
        "metaDescription": "This is the meta description for SEO purposes",
        "metaImage": {
          "data": {
            "attributes": {
              "url": "/uploads/seo_image.jpg",
              "width": 1200,
              "height": 630
            }
          }
        },
        "canonicalURL": "https://example.com/canonical-page",
        "metaRobots": "index, follow",
        "keywords": "key,words,here",
        "metaSocial": [
          {
            "socialNetwork": "Instagram",
            "title": "Instagram specific title",
            "description": "Description for Instagram",
            "image": {
              "data": {
                "attributes": {
                  "url": "/uploads/instagram_image.jpg"
                }
              }
            }
          },
          {
            "socialNetwork": "LinkedIn",
            "title": "LinkedIn specific title",
            "description": "Description for LinkedIn",
            "image": {
              "data": {
                "attributes": {
                  "url": "/uploads/linkedin_image.jpg"
                }
              }
            }
          }
        ]
      }
    }
  }
}
```

## Using SEO Data in Astro

The integration we've set up in your Astro site will automatically fetch and use this SEO data from Strapi when rendering pages. The `fetchSeoMetadata` utility will:

1. Fetch the SEO data for a specific page
2. Convert it to the format expected by our SEO utility
3. Apply it to your page

For example, in dynamic pages like blog posts, the SEO data is automatically applied.
