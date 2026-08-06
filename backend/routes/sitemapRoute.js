const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).select('_id updatedAt');
    const baseUrl = 'https://gentfits.vercel.app';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/shop</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  
  <!-- Categories -->
  <url><loc>${baseUrl}/shop?category=tshirts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/shop?category=panjabis</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/shop?category=shirts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  
  <!-- Support & Brand Pages -->
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${baseUrl}/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  
  <!-- Legal Pages -->
  <url><loc>${baseUrl}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  
  <!-- Dynamic Products -->
`;

    products.forEach((product) => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${product._id}</loc>\n    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;
