import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://savyasachi.vercel.app",
  output: "static",
});
