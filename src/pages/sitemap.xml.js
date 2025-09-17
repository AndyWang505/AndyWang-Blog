import { getCollection } from 'astro:content';

async function generateSitemap() {
  const posts = await getCollection('blog');
  const siteURL = 'https://andywangtw.dev';

  const staticPages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/archive', changefreq: 'weekly', priority: 0.8 },
    { url: '/archive/category', changefreq: 'weekly', priority: 0.7 },
    { url: '/archive/tag', changefreq: 'weekly', priority: 0.7 },
    { url: '/link', changefreq: 'monthly', priority: 0.6 },
  ];

  const sortedPosts = posts.sort((a, b) =>
    new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );
  const postPages = sortedPosts.map(post => ({
    url: `/post/${post.slug}`,
    changefreq: 'monthly',
    priority: 0.9,
    lastmod: post.data.updatedDate || post.data.pubDate
  }));

  const categories = [...new Set(posts.map(post => post.data.category))].filter(Boolean);
  const categoryPages = categories.map(category => ({
    url: `/archive/category/${encodeURIComponent(category.replace(/\s+/g, '-'))}`,
    changefreq: 'weekly',
    priority: 0.6
  }));

  const allTags = posts.flatMap(post => post.data.tags || []);
  const uniqueTags = [...new Set(allTags)].filter(Boolean);
  const tagPages = uniqueTags.map(tag => ({
    url: `/archive/tag/${encodeURIComponent(tag.replace(/\s+/g, '-'))}`,
    changefreq: 'weekly',
    priority: 0.5
  }));

  const postsPerPage = 10;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginationPages = [];
  for (let i = 2; i <= totalPages; i++) {
    paginationPages.push({
      url: `/${i}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  }

  const allPages = [
    ...staticPages,
    ...postPages,
    ...categoryPages,
    ...tagPages,
    ...paginationPages
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${siteURL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

export async function GET() {
  return await generateSitemap();
}