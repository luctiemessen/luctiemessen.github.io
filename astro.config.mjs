import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';


// https://astro.build/config
export default defineConfig({
    site: 'https://luctiemessen.github.io',
    integrations: [markdoc()],
});
