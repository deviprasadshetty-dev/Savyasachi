import { getPosts, stripHtml } from "../lib/wordpress";
import { site } from "../lib/site";

export async function GET(context: { site?: URL }) {
  const posts = await getPosts();
  const baseUrl = context.site?.toString().replace(/\/$/, "") || "https://savyasachi.vercel.app";

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/articles/${post.slug}/`;
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${stripHtml(post.excerpt || post.content)}]]></description>
        </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${site.title}</title>
        <link>${baseUrl}</link>
        <description>${site.description}</description>
        <language>kn-IN</language>
        ${items}
      </channel>
    </rss>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
