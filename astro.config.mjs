import remarkFootnotes from 'remark-footnotes';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://luctiemessen.github.io',
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    remarkPlugins: [[remarkFootnotes, { inlineNotes: true }]],
  },
  // integrations: [mdx(), sitemap()],
  integrations: [sitemap()],
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
});

/*import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://luctiemessen.github.io',
  markdown: {
    shikiConfig: {
      theme: 'css-variables'
    }
  },
  integrations: [mdx(), sitemap()],
  // fix for malfunctioning sharp install.
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop'
    }
  }
});

*/
