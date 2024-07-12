import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax"
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx({
      systaxHighlight: false,
      remarkPlugins: [
        remarkMath,
      ],
      rehypePlugins: [
        rehypeMathjax,
        //rehypeCheck
      ],
    }),
    sitemap(),
    react(),
    tailwind()
  ],
  site: 'https://andywang505.github.io',
  base: '',
});