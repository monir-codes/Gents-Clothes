/**
 * Generates an extensive SEO keyword string from a product object.
 * @param {Object} product - The product object from the database
 * @returns {string} - A comma separated list of keywords
 */
export const generateProductKeywords = (product) => {
  if (!product) return '';

  const keywords = new Set();
  
  // Brand & Domain
  keywords.add('রঙবতী');
  keywords.add('Ronggoboti');
  keywords.add('ronggoboti.shop');
  keywords.add('Ronggoboti BD');
  keywords.add('রঙবতী ফ্যাশন');

  // Basic attributes
  if (product.name) {
    keywords.add(product.name);
    keywords.add(`buy ${product.name} online`);
    keywords.add(`${product.name} price in BD`);
    keywords.add(`${product.name} online shopping`);
    keywords.add(`${product.name} Bangladesh`);
  }
  
  if (product.category) {
    keywords.add(`${product.category} in BD`);
    keywords.add(`premium ${product.category}`);
    keywords.add(`buy ${product.category} online Dhaka`);
    keywords.add(`best ${product.category} in Bangladesh`);
    keywords.add(`designer ${product.category}`);
    keywords.add(`latest ${product.category} collection`);

    // Category Bengali terms
    if (/saree/i.test(product.category)) {
      keywords.add('শাড়ি কালেকশন');
      keywords.add('নতুন শাড়ি ডিজাইন');
      keywords.add('জামদানি শাড়ি');
      keywords.add('সিল্ক শাড়ি');
    } else if (/salwar|kameez|three\s*piece/i.test(product.category)) {
      keywords.add('সালোয়ার কামিজ');
      keywords.add('থ্রি পিস কালেকশন');
      keywords.add('রেডিমেড থ্রি পিস');
    } else if (/kurti/i.test(product.category)) {
      keywords.add('কুর্তি কালেকশন');
      keywords.add('ডিজাইনার কুর্তি');
    } else if (/lehenga/i.test(product.category)) {
      keywords.add('লেহেঙ্গা কালেকশন');
      keywords.add('ব্রাইডাল লেহেঙ্গা');
    }
  }
  
  if (product.brand) {
    keywords.add(`${product.brand} clothing`);
    keywords.add(`${product.brand} ${product.category || ''}`.trim());
  }

  // Delivery & Service Intent
  keywords.add('cash on delivery womens clothing BD');
  keywords.add('online shopping BD home delivery');
  keywords.add('মেয়েদের পোশাক অনলাইন শপিং');
  keywords.add('ক্যাশ অন ডেলিভারি বাংলাদেশ');

  // Colors & Sizes
  if (product.colors && Array.isArray(product.colors)) {
    product.colors.forEach(color => {
      keywords.add(`${color} ${product.category || 'womens fashion'}`);
      keywords.add(`${color} ${product.name || ''}`.trim());
    });
  }

  if (product.sizes && Array.isArray(product.sizes)) {
    product.sizes.forEach(size => {
      keywords.add(`size ${size} ${product.category || ''}`.trim());
    });
  }

  return Array.from(keywords).filter(Boolean).join(', ');
};
