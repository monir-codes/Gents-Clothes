import fs from 'fs';
import path from 'path';
import https from 'https';

const API_URL = 'https://gents-clothes-server.vercel.app/api/products';
const BASE_URL = 'https://ronggoboti.vercel.app';

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
      const today = new Date().toISOString().split('T')[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Core Pages -->
  <url><loc>${BASE_URL}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/shop</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/collections</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  
  <!-- Categories -->
  <url><loc>${BASE_URL}/shop?category=Sarees</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>${BASE_URL}/shop?category=Salwar+Kameez</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>${BASE_URL}/shop?category=Kurtis</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>${BASE_URL}/shop?category=Lehengas</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>${BASE_URL}/shop?category=Modest+Wear</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/shop?category=Co-ord+Sets</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  
  <!-- Support & Brand Pages -->
  <url><loc>${BASE_URL}/about</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${BASE_URL}/contact</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${BASE_URL}/faq</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  
  <!-- Legal Pages -->
  <url><loc>${BASE_URL}/shipping</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/returns</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${BASE_URL}/privacy</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${BASE_URL}/terms</loc><lastmod>${today}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  
  <!-- Dynamic Products -->
`;

      if (Array.isArray(products)) {
        products.forEach((product) => {
          const lastMod = product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : today;
          xml += `  <url>\n    <loc>${BASE_URL}/product/${product._id}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n`;
          if (product.image) {
            xml += `    <image:image>\n      <image:loc>${product.image}</image:loc>\n      <image:title><![CDATA[${product.name || 'রঙবতী'}]]></image:title>\n    </image:image>\n`;
          }
          xml += `  </url>\n`;
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
