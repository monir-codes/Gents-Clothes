import fs from 'fs';
import path from 'path';

// Using the production API URL to fetch products during build
const API_URL = 'https://gents-clothes-server.vercel.app/api';
const BASE_URL = 'https://gents-clothes.vercel.app';

async function generateSitemap() {
  console.log('Generating sitemap...');
  try {
    // Basic static routes
    const staticRoutes = [
      '',
      '/shop',
      '/collections',
      '/about',
      '/contact',
      '/faq',
      '/shipping',
      '/returns'
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static routes
    staticRoutes.forEach(route => {
      sitemap += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>\n`;
    });

    // Try to fetch dynamic products
    try {
      const response = await fetch(`${API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        products.forEach(product => {
          sitemap += `  <url>
    <loc>${BASE_URL}/product/${product._id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
        });
      } else {
        console.warn('Could not fetch products for sitemap. Using only static routes.');
      }
    } catch (apiError) {
      console.warn('API connection failed during sitemap generation. Using only static routes.');
    }

    sitemap += `</urlset>`;

    fs.writeFileSync(path.resolve('./public/sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
