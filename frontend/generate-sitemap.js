import fs from 'fs';
import path from 'path';

// Using the production API URL to fetch products during build
const API_URLS = [
  'https://gents-clothes-server.vercel.app/api/products',
  'https://ronggoboti-server.vercel.app/api/products'
];
const BASE_URL = 'https://ronggoboti.vercel.app';

async function generateSitemap() {
  console.log('Generating high-performance SEO sitemap...');
  try {
    const today = new Date().toISOString().split('T')[0];

    // Core static & category routes
    const staticPages = [
      { route: '', priority: '1.0', changefreq: 'daily' },
      { route: '/shop', priority: '0.9', changefreq: 'daily' },
      { route: '/collections', priority: '0.9', changefreq: 'daily' },
      { route: '/shop?category=Sarees', priority: '0.85', changefreq: 'weekly' },
      { route: '/shop?category=Salwar+Kameez', priority: '0.85', changefreq: 'weekly' },
      { route: '/shop?category=Kurtis', priority: '0.85', changefreq: 'weekly' },
      { route: '/shop?category=Lehengas', priority: '0.85', changefreq: 'weekly' },
      { route: '/shop?category=Modest+Wear', priority: '0.8', changefreq: 'weekly' },
      { route: '/shop?category=Co-ord+Sets', priority: '0.8', changefreq: 'weekly' },
      { route: '/about', priority: '0.7', changefreq: 'monthly' },
      { route: '/contact', priority: '0.7', changefreq: 'monthly' },
      { route: '/faq', priority: '0.7', changefreq: 'monthly' },
      { route: '/shipping', priority: '0.5', changefreq: 'monthly' },
      { route: '/returns', priority: '0.5', changefreq: 'monthly' },
      { route: '/size-guide', priority: '0.5', changefreq: 'monthly' },
      { route: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { route: '/terms', priority: '0.3', changefreq: 'yearly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Add static & category routes
    staticPages.forEach(({ route, priority, changefreq }) => {
      sitemap += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>\n`;
    });

    // Try fetching products from live APIs
    let products = [];
    for (const url of API_URLS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          products = Array.isArray(data) ? data : (data.products || []);
          if (products.length > 0) break;
        }
      } catch (err) {
        // Try next URL
      }
    }

    const slugify = (text) => {
      if (!text) return '';
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u0980-\u09FF-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    if (Array.isArray(products) && products.length > 0) {
      products.forEach(product => {
        const lastMod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : today;
        const slug = product.slug || slugify(product.name) || product._id;
        const imgTag = product.image ? `
    <image:image>
      <image:loc>${product.image}</image:loc>
      <image:title><![CDATA[${product.name || 'রঙবতী'}]]></image:title>
      <image:caption><![CDATA[${product.description?.substring(0, 150) || 'রঙবতী - Women Fashion'}]]></image:caption>
    </image:image>` : '';

        sitemap += `  <url>
    <loc>${BASE_URL}/product/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imgTag}
  </url>\n`;
      });
      console.log(`Fetched and included ${products.length} products with Google Image metadata.`);
    } else {
      console.warn('Live API unreachable during build, generated comprehensive static sitemap.');
    }

    sitemap += `</urlset>`;

    fs.writeFileSync(path.resolve('./public/sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
