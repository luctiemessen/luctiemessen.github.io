import rss from '@astrojs/rss';
// import sanitizeHtml from 'sanitize-html';

import { SITE } from '../site.config';
import { getPosts, parseDate, postUrl } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: SITE.homeTitle,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      link: postUrl(post),
      title: post.frontmatter.title,
      pubDate: parseDate(post.frontmatter.date),
      description: post.frontmatter.description,
      /* content: sanitizeHtml(post.compiledContent()),*/
    })),
    stylesheet: '/rss/styles.xsl',
  });
}
