/**
 * Blogposts ophalen en opmaken.
 *
 * Posts zijn gewone markdownpagina's in src/pages/blog/. De lijst wordt pas
 * geladen als je getPosts() aanroept, zodat BlogPostLayout (die zelf door die
 * posts wordt gebruikt) dit bestand zonder kringverwijzing kan importeren.
 */
import type { MarkdownInstance } from 'astro';

export interface PostFrontmatter {
  title: string;
  date: string | Date;
  description?: string;
  tags?: string | string[];
  draft?: boolean;
  /** Stukken in het Nederlands (`dutch: yes`). */
  dutch?: boolean | string;
}

export type Post = MarkdownInstance<PostFrontmatter>;

const modules = import.meta.glob<Post>('../pages/blog/*.md');

/** Gepubliceerde posts, nieuwste eerst: zonder concepten en zonder posts met een datum in de toekomst. */
export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(Object.values(modules).map((load) => load()));
  const now = new Date();

  return posts
    .filter((post) => {
      const date = parseDate(post.frontmatter.date);
      return !post.frontmatter.draft && date !== undefined && date <= now;
    })
    .sort((a, b) => +parseDate(b.frontmatter.date)! - +parseDate(a.frontmatter.date)!);
}

/** De datum uit de frontmatter, of undefined als die niet geldig is (zoals 2024-01-00 in een concept). */
export function parseDate(value: string | Date | undefined): Date | undefined {
  if (value === undefined) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** 20 February 2025 */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** 20 February */
export const formatDayMonth = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

/** Leestijd in minuten, op basis van de markdownbron (± 220 woorden per minuut). */
export function readingTime(source: string): number {
  const words = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** De omschrijving van een post, zonder de oude opvulling "no description present". */
export function summary(post: Post): string {
  const text = post.frontmatter.description ?? '';
  return text === 'no description present' ? '' : text;
}

/** De tags uit de frontmatter als lijst (`tags: css web` of `tags: [css, web]`). */
export function tagList(tags: PostFrontmatter['tags']): string[] {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : String(tags).split(' ').filter(Boolean);
}

/** De url van een post, met een slash aan het eind (zo serveert GitHub Pages hem). */
export const postUrl = (post: Post) => `${post.url}/`;
