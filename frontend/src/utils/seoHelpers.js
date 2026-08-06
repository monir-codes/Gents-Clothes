/**
 * Generates an extensive SEO keyword string from a product object.
 * @param {Object} product - The product object from the database
 * @returns {string} - A comma separated list of keywords
 */
export const generateProductKeywords = (product) => {
  if (!product) return '';

  const keywords = new Set();
  
  // Basic attributes
  if (product.name) {
    keywords.add(product.name);
    keywords.add(`buy ${product.name} online`);
    keywords.add(`${product.name} price in BD`);
  }
  
  if (product.category) {
    keywords.add(`${product.category} in BD`);
    keywords.add(`premium ${product.category}`);
    keywords.add(`buy ${product.category} online Dhaka`);
  }
  
  if (product.brand) {
    keywords.add(`${product.brand} clothing`);
    keywords.add(`${product.brand} ${product.category || ''}`.trim());
  }

  // Delivery & Service Intent
  keywords.add('cash on delivery mens clothing BD');
  keywords.add('online shopping BD home delivery');

  // Colors & Sizes
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach(color => {
      keywords.add(`${color} ${product.category || 'menswear'}`);
    });
  }

  if (product.sizes && Array.isArray(product.sizes)) {
    product.sizes.forEach(size => {
      keywords.add(`size ${size} ${product.category || ''}`.trim());
    });
  }

  return Array.from(keywords).filter(Boolean).join(', ');
};
