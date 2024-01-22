import rss from '@astrojs/rss';
// import sanitizeHtml from 'sanitize-html';

import { orderBlogPosts } from '../js/utils';

export function GET(context) {
  const postImportResult = import.meta.glob('./blog/**/*.md', { eager: true });
  const posts = orderBlogPosts(Object.values(postImportResult));

  return rss({
    title: 'Luc Tiemessen, Designer',
    description: 'Personal site of Luc Tiemessen, Designer, thinking and writing about philosphy, design and fountain pens.',
    site: context.site,
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
      description: post.frontmatter.description,
      /* content: sanitizeHtml(post.compiledContent()),*/
    })),
    stylesheet: '/rss/styles.xsl',
  });
}