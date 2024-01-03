import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://luctiemessen.github.io',
  markdown: { shikiConfig: { theme: 'css-variables' } },
  integrations: [mdx()]
});