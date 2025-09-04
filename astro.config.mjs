import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax"
import tailwind from "@astrojs/tailwind";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import swup from '@swup/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://andywangtw.dev',
  integrations: [
    swup({
      theme: false,
      animationClass: "transition-swup-",
      containers: ["main"],
      smoothScrolling: true,
      cache: true,
      preload: true,
      accessibility: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
    }),
    mdx({
      systaxHighlight: false,
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        [remarkToc, { heading: 'Table of Contents', maxDepth: 3 }],
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behavior: 'append',
          properties: {
            class: 'heading-link',
          },
        }],
        rehypeMathjax,
      ],
    }),
    sitemap(),
    react(),
    tailwind()
  ],
  base: '',
});