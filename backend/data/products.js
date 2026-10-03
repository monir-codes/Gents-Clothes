const products = [
  {
    name: 'Royal Heritage Jamdani Saree',
    image: '/images/hero-banner.jpg',
    hoverImage: '/images/hero-banner.jpg',
    description:
      'Masterfully handwoven Dhakai Jamdani saree featuring intricate floral motifs and royal maroon hues with metallic gold zari borders.',
    brand: 'রঙবতী',
    category: 'Sarees',
    price: 6500,
    oldPrice: 7800,
    countInStock: 12,
    rating: 4.9,
    numReviews: 18,
    colors: ['Maroon', 'Blush Rose', 'Ivory'],
    sizes: ['Free Size'],
    fabricDetails: {
      material: '100% Fine Cotton & Gold Zari',
      gsm: '80 GSM',
      washInstruction: 'Dry clean only'
    },
    sku: 'RGB-SAR-001'
  },
  {
    name: 'Embroidered Georgette Salwar Kameez',
    image: '/images/hero-banner.jpg',
    hoverImage: '/images/hero-banner.jpg',
    description:
      'Elegant three-piece luxury suit with exquisite tonal thread embroidery and organza dupatta. Designed for festive charm and timeless grace.',
    brand: 'রঙবতী',
    category: 'Salwar Kameez',
    price: 4800,
    oldPrice: 5500,
    countInStock: 8,
    rating: 4.8,
    numReviews: 14,
    colors: ['Rose Gold', 'Wine', 'Champagne'],
    sizes: ['S', 'M', 'L', 'XL'],
    fabricDetails: {
      material: 'Pure Viscose Georgette with Silk Dupatta',
      gsm: '120 GSM',
      washInstruction: 'Gentle dry clean'
    },
    sku: 'RGB-SK-002'
  },
  {
    name: 'Contemporary Silk Kurti & Co-ord Set',
    image: '/images/hero-banner.jpg',
    description:
      'Modern silhouette combining traditional craftsmanship with a chic western aesthetic. Breathable, flattering, and effortless to style.',
    brand: 'রঙবতী',
    category: 'Kurtis & Tunics',
    price: 2800,
    oldPrice: 3400,
    countInStock: 15,
    rating: 4.7,
    numReviews: 22,
    colors: ['Burgundy', 'Dusty Rose', 'Emerald'],
    sizes: ['S', 'M', 'L', 'XL'],
    fabricDetails: {
      material: 'Mulberry Silk Blend',
      gsm: '140 GSM',
      washInstruction: 'Hand wash cold or gentle machine wash'
    },
    sku: 'RGB-KRT-003'
  },
  {
    name: 'Velvet Festive Shawl & Party Wrap',
    image: '/images/hero-banner.jpg',
    description:
      'Ultra-soft micro velvet festive shawl with hand-embroidered borders. The perfect accessory to complete your celebratory look.',
    brand: 'রঙবতী',
    category: 'Western Wear',
    price: 3200,
    countInStock: 10,
    rating: 5.0,
    numReviews: 9,
    colors: ['Deep Wine', 'Midnight Black'],
    sizes: ['Free Size'],
    fabricDetails: {
      material: 'Micro Velvet with Zari Trim',
      gsm: '260 GSM',
      washInstruction: 'Dry clean only'
    },
    sku: 'RGB-SHW-004'
  }
];

module.exports = products;
