import fs from 'fs';
import path from 'path';
import https from 'https';

const API_URL = 'https://gent-fits-1do5.vercel.app/api/products';
const BASE_URL = 'https://gentfits.vercel.app';

console.log('Generating dynamic sitemap...');

https.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const products = response.products || response;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url><loc>${BASE_URL}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  
  <!-- Categories -->
  <url><loc>${BASE_URL}/shop?category=tshirts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/shop?category=panjabis</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/shop?category=shirts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  
  <!-- Support & Brand Pages -->
  <url><loc>${BASE_URL}/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${BASE_URL}/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${BASE_URL}/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  
  <!-- Legal Pages -->
  <url><loc>${BASE_URL}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${BASE_URL}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  
  <!-- Dynamic Products -->
`;

      if (Array.isArray(products)) {
        products.forEach((product) => {
          const lastMod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          xml += `  <url>\n    <loc>${BASE_URL}/product/${product._id}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });
      }

      xml += `</urlset>`;

      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
      console.log(`Successfully generated sitemap.xml with ${Array.isArray(products) ? products.length : 0} products.`);
    } catch (e) {
      console.error('Failed to parse API response or write sitemap', e);
    }
  });
}).on('error', (e) => {
  console.error('Failed to fetch products for sitemap:', e);
});
