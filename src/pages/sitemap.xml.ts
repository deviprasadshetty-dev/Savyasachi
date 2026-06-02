import { getPosts } from "../lib/wordpress";

export async function GET(context: { site?: URL }) {
  const posts = await getPosts();
  const baseUrl = context.site?.toString().replace(/\/$/, "") || "https://savyasachi.vercel.app";
  const staticPages = ["/", "/articles/", "/about/", "/garike/"];
  const urls = [
    ...staticPages.map((path) => `${baseUrl}${path}`),
    ...posts.map((post) => `${baseUrl}/articles/${post.slug}/`),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    },
  );
}
