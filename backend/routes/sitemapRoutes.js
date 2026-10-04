const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    
    // Core static & category pages
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/shop', priority: '0.9', changefreq: 'daily' },
      { path: '/collections', priority: '0.9', changefreq: 'daily' },
      { path: '/shop?category=Sarees', priority: '0.85', changefreq: 'weekly' },
      { path: '/shop?category=Salwar+Kameez', priority: '0.85', changefreq: 'weekly' },
      { path: '/shop?category=Kurtis', priority: '0.85', changefreq: 'weekly' },
      { path: '/shop?category=Lehengas', priority: '0.85', changefreq: 'weekly' },
      { path: '/shop?category=Modest+Wear', priority: '0.8', changefreq: 'weekly' },
      { path: '/shop?category=Co-ord+Sets', priority: '0.8', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/faq', priority: '0.7', changefreq: 'monthly' },
      { path: '/shipping', priority: '0.5', changefreq: 'monthly' },
      { path: '/returns', priority: '0.5', changefreq: 'monthly' },
      { path: '/size-guide', priority: '0.5', changefreq: 'monthly' },
      { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    ];

    const baseUrl = 'https://ronggoboti.vercel.app';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Add static pages
    staticPages.forEach(({ path, priority, changefreq }) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${path}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

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

    // Add dynamic product pages
    products.forEach((product) => {
      const slug = product.slug || slugify(product.name) || product._id;
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/product/${slug}</loc>\n`;
      const lastMod = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : today;
      sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.9</priority>\n`;
      if (product.image) {
        sitemap += `    <image:image>\n`;
        sitemap += `      <image:loc>${product.image}</image:loc>\n`;
        sitemap += `      <image:title><![CDATA[${product.name || 'রঙবতী'}]]></image:title>\n`;
        sitemap += `    </image:image>\n`;
      }
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
