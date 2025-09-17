import { defineConfig } from 'astro/config';
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

import ExpressiveCode from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginLanguageBadge } from './plugins/expressive-code/language-badge';

// https://astro.build/config
export default defineConfig({
  site: 'https://andywangtw.dev',
  integrations: [swup({
    theme: false,
    animationClass: "transition-swup-",
    containers: ["main"],
    smoothScrolling: false,
    cache: true,
    preload: true,
    accessibility: true,
    updateHead: true,
    updateBodyClass: false,
    globalInstance: true,
  }), ExpressiveCode(
    {
      themes: ['github-dark'],
      plugins: [
        pluginCollapsibleSections(),
        pluginLineNumbers(),
        pluginLanguageBadge(),
      ],
      defaultProps: {
        wrap: false,
        overridesByLang: {
          'shellsession': {
            showLineNumbers: false,
          },
        },
      },
      styleOverrides: {
        codeBackground: "var(--codeblock-bg)",
        borderRadius: "0.75rem",
        borderColor: "none",
        codeFontSize: "0.875rem",
        codeFontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        codeLineHeight: "1.5rem",
        frames: {
          editorBackground: "var(--codeblock-bg)",
          terminalBackground: "var(--codeblock-bg)",
          terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
          editorTabBarBackground: "var(--codeblock-topbar-bg)",
          editorActiveTabBackground: "none",
          editorActiveTabIndicatorBottomColor: "var(--primary)",
          editorActiveTabIndicatorTopColor: "none",
          editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
          terminalTitlebarBorderBottomColor: "none"
        },
        textMarkers: {
          delHue: 0,
          insHue: 180,
          markHue: 250
        }
      },
      frames: {
        showCopyToClipboardButton: true,
      }
    }
  ), sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    entryLimit: 10000,
    customPages: [
      'https://andywangtw.dev/about',
      'https://andywangtw.dev/archive',
      'https://andywangtw.dev/archive/category',
      'https://andywangtw.dev/archive/tag',
      'https://andywangtw.dev/link',
    ],
    i18n: {
      defaultLocale: 'zh-TW',
      locales: {
        'zh-TW': 'zh-TW'
      }
    }
  }), react(), tailwind()],
  markdown: {
    syntaxHighlight: false,
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
  },
  base: '',
});