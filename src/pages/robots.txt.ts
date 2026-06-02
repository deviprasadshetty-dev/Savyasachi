export function GET(context: { site?: URL }) {
  const baseUrl = context.site?.toString().replace(/\/$/, "") || "https://savyasachi.vercel.app";

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
