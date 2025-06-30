import { defineCollection, defineContentConfig, z } from '@nuxt/content';
import { asSitemapCollection } from '@nuxtjs/sitemap/content';

const docsSchema = z.object({
  tags: z.array(z.string()),
});

export default defineContentConfig({
  collections: {
    docs_en: defineCollection(
      asSitemapCollection({
        source: 'en/docs/*.md',
        type: 'page',
        schema: docsSchema,
      })
    ),
    docs_de: defineCollection(
      asSitemapCollection({
        source: 'de/docs/*.md',
        type: 'page',
        schema: docsSchema,
      })
    ),
  },
});
