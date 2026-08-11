const products = [
  {
    name: 'Premium Cotton T-Shirt',
    image: '/images/category-tshirt.png',
    hoverImage: '/images/category-tshirt.png',
    description:
      'Luxurious 100% combed cotton t-shirt with a modern fit. Perfect for layering or wearing on its own.',
    brand: 'Gents Clothes',
    category: 'T-Shirts',
    price: 1200,
    oldPrice: 1500,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    fabricDetails: {
      material: '100% Combed Cotton',
      gsm: '180 GSM',
      washInstruction: 'Machine wash cold, tumble dry low'
    },
    sku: 'TS-BLK-001'
  },
  {
    name: 'Signature Polo Shirt',
    image: '/images/category-tshirt.png',
    hoverImage: '/images/category-tshirt.png',
    description:
      'Elevate your casual look with our signature polo shirt, crafted from premium pique cotton.',
    brand: 'Gents Clothes',
    category: 'Polos',
    price: 1800,
    countInStock: 7,
    rating: 4.8,
    numReviews: 8,
    colors: ['Navy', 'Burgundy'],
    sizes: ['M', 'L', 'XL'],
    fabricDetails: {
      material: '95% Cotton, 5% Spandex',
      gsm: '220 GSM',
      washInstruction: 'Hand wash recommended'
    },
    sku: 'PL-NVY-002'
  },
  {
    name: 'Classic Linen Panjabi',
    image: '/images/category-tshirt.png',
    description:
      'A timeless classic for festive occasions. Made with breathable linen for ultimate comfort.',
    brand: 'Gents Clothes',
    category: 'Panjabis',
    price: 3500,
    oldPrice: 4000,
    countInStock: 0,
    rating: 4.9,
    numReviews: 24,
    colors: ['White', 'Beige'],
    sizes: ['40', '42', '44'],
    fabricDetails: {
      material: '100% Linen',
      gsm: '160 GSM',
      washInstruction: 'Dry clean only'
    },
    sku: 'PJ-WHT-003'
  },
  {
    name: 'Essential Winter Hoodie',
    image: '/images/category-tshirt.png',
    description:
      'Stay warm without sacrificing style. Heavyweight fleece fabric for maximum heat retention.',
    brand: 'Gents Clothes',
    category: 'Hoodies',
    price: 2500,
    countInStock: 15,
    rating: 4.7,
    numReviews: 15,
    colors: ['Black', 'Grey Melange'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    fabricDetails: {
      material: '80% Cotton, 20% Polyester Fleece',
      gsm: '320 GSM',
      washInstruction: 'Machine wash cold'
    },
    sku: 'HD-BLK-004'
  }
];

module.exports = products;
