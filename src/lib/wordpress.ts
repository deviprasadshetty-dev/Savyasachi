import { site } from "./site";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  url: string;
  content: string;
  excerpt: string;
  description: string;
  date: string;
  modified: string;
  image: string | null;
  categories: string[];
  tags: string[];
  readingMinutes: number;
};

type WpComTerm = {
  name?: string;
  slug?: string;
};

type WpComPost = {
  ID: number;
  title: string;
  slug: string;
  URL: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featured_image?: string;
  post_thumbnail?: { URL?: string } | null;
  categories?: Record<string, WpComTerm>;
  tags?: Record<string, WpComTerm>;
};

const endpoint = `https://public-api.wordpress.com/rest/v1.1/sites/${site.wordpressSite}/posts/?number=100`;

export function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, maxLength = 150) {
  if (text.length <= maxLength) {
    return text;
  }

  const trimmed = text.slice(0, maxLength);
  return `${trimmed.slice(0, trimmed.lastIndexOf(" ") || maxLength).trim()}...`;
}

function getTerms(terms?: Record<string, WpComTerm>) {
  return Object.values(terms || {})
    .map((term) => term.name)
    .filter((name): name is string => Boolean(name));
}

function estimateReadingMinutes(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function normalizePost(post: WpComPost): BlogPost {
  const plainText = stripHtml(post.content);
  const description = truncateText(stripHtml(post.excerpt || post.content), 150);

  return {
    id: post.ID,
    title: stripHtml(post.title),
    slug: post.slug,
    url: post.URL,
    content: post.content,
    excerpt: post.excerpt,
    description,
    date: post.date,
    modified: post.modified,
    image: post.featured_image || post.post_thumbnail?.URL || null,
    categories: getTerms(post.categories),
    tags: getTerms(post.tags),
    readingMinutes: estimateReadingMinutes(plainText),
  };
}

export async function getPosts() {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`WordPress API returned ${response.status}`);
    }

    const data = (await response.json()) as { posts?: WpComPost[] };
    return (data.posts || []).map(normalizePost);
  } catch (error) {
    console.warn("Could not fetch WordPress posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
