import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://luctiemessen.github.io',
  markdown: {
    // Codeblokken volgen het lichte of donkere thema (kleuren staan in article.css).
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  integrations: [sitemap()],
  // Fix for a malfunctioning sharp install: images are copied, not optimized.
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
});
