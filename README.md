# savyasachi

Kannada-first personal blog frontend for Deviprasad Shetty.

## Stack

- Astro static frontend
- WordPress.com public REST API backend
- Self-hosted Geist and Noto Sans Kannada fonts
- SEO routes: `sitemap.xml`, `robots.txt`, `rss.xml`

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy

Vercel is the simplest free option.

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Set this environment variable when the final deployment URL is known:

```text
PUBLIC_SITE_URL=https://your-site.vercel.app
```

The blog currently reads posts from:

```text
https://thesavysachi.wordpress.com
```
