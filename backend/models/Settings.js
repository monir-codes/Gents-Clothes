const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    announcementText: {
      type: String,
      default: 'FREE SHIPPING ON ORDERS OVER ৳5000 | PREMIUM SUMMER COLLECTION 2026',
    },
    announcementList: {
      type: [String],
      default: ['FREE SHIPPING ON ORDERS OVER ৳5000', 'PREMIUM SUMMER COLLECTION 2026'],
    },
    whatsappNumber: {
      type: String,
      default: '8801700000000',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/gentfits' },
      instagram: { type: String, default: 'https://instagram.com/gentfits' },
      tiktok: { type: String, default: 'https://tiktok.com/@gentfits' },
      youtube: { type: String, default: 'https://youtube.com/gentfits' }
    },
    heroTitle: {
      type: String,
      default: 'Premium Luxury Menswear',
    },
    heroSubtitle: {
      type: String,
      default: 'Discover the latest collections of Panjabis, Shirts, and T-Shirts.',
    },
    heroImage: {
      type: String,
      default: '/images/hero-banner.jpg',
    },
    heroVideo: {
      type: String,
      default: '',
    },
    heroSlideshow: {
      type: [String],
      default: []
    },
    marqueeText: {
      type: [String],
      default: ['PREMIUM QUALITY', 'FLAWLESS TAILORING', 'MODERN GENTLEMAN', 'LUXURY FABRICS'],
    },
    featuredCategories: [
      {
        title: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String, required: true }
      }
    ],
    featuredCollections: [
      {
        title: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String, required: true }
      }
    ],
    limitedEdition: {
      title: { type: String, default: 'Limited Edition Pre-Order' },
      subtitle: { type: String, default: 'Exclusive designs, limited quantities.' },
      image: { type: String, default: '/images/limited-edition.jpg' },
      link: { type: String, default: '/shop?category=limited' }
    },
    shopTheLook: {
      title: { type: String, default: 'The Weekend Edit' },
      subtitle: { type: String, default: 'Curated outfits for your weekend getaways. Effortless style meets ultimate comfort.' },
      image: { type: String, default: '/images/shop-the-look.jpg' }
    },
    premiumCollection: {
      title: { type: String, default: 'Premium Collection' },
      image: { type: String, default: '/images/premium-collection.jpg' },
      link: { type: String, default: '/shop?category=premium' }
    },
    features: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, required: true }
      }
    ],
    brandStory: {
      title: { type: String, default: 'The GentFits Story' },
      text: { type: String, default: 'Born out of a desire to redefine men\'s fashion in Bangladesh, GentFits bridges the gap between traditional craftsmanship and modern aesthetics.' },
      image: { type: String, default: '/images/brand-story.jpg' }
    },
    featuredVideoSection: {
      title: { type: String, default: 'Craftsmanship in Motion' },
      subtitle: { type: String, default: 'Experience the art of tailoring.' },
      videoUrl: { type: String, default: '' },
      fallbackImage: { type: String, default: '/images/video-fallback.jpg' },
      slideshow: { type: [String], default: [] }
    },
    reviews: [
      {
        rating: { type: Number, default: 5 },
        text: { type: String, required: true },
        author: { type: String, required: true }
      }
    ],
    instagramImages: {
      type: [String],
      default: ['/images/insta-1.jpg', '/images/insta-2.jpg', '/images/insta-3.jpg', '/images/insta-4.jpg']
    },
    newsletter: {
      title: { type: String, default: 'Join the GentFits Club' },
      subtitle: { type: String, default: 'Subscribe for exclusive updates, early access to new collections, and style tips.' }
    },
    staticPages: {
      about: {
        heroImage: { type: String, default: '/images/hero-banner.jpg' },
        storyText: { type: String, default: 'GentFits was founded with a singular, uncompromising vision: to redefine luxury menswear in Bangladesh. We believe that true elegance lies in the details—from the meticulous selection of premium fabrics to the flawless precision of our tailoring.' },
        materialsText: { type: String, default: 'We source only the highest grade Egyptian cottons, pure silks, and rich wools. Every garment is constructed to not only look breathtaking but to stand the test of time, adapting to the modern gentleman\'s lifestyle.' },
        materialsImage1: { type: String, default: '/images/hero-banner.jpg' },
        materialsImage2: { type: String, default: '/images/hero-banner.jpg' }
      },
      faq: { type: String, default: '<h3>When will my order ship?</h3><p>Orders are typically processed within 24 hours. Delivery takes 2-3 business days.</p><h3 style="margin-top:24px">Do you offer returns?</h3><p>Yes, we offer a hassle-free 7-day return policy for unused products in their original packaging.</p>' },
      contact: { type: String, default: '<p><strong>Email:</strong> support@gentfits.com</p><p><strong>Phone:</strong> +880 1711 000 000</p><p><strong>Address:</strong> Banani, Dhaka, Bangladesh</p><p style="margin-top:24px">Our customer service team is available Saturday to Thursday, 10 AM to 8 PM.</p>' },
      shipping: { type: String, default: '<p>This is the standard Shipping Policy document. For full legal text, please refer to our official terms.</p>' },
      returns: { type: String, default: '<p>This is the standard Return & Exchange Policy document. For full legal text, please refer to our official terms.</p>' },
      sizeGuide: { type: String, default: '<p>This is the standard Size Guide document. For full legal text, please refer to our official terms.</p>' },
      privacy: { type: String, default: '<p>This is the standard Privacy Policy document. For full legal text, please refer to our official terms.</p>' },
      terms: { type: String, default: '<p>This is the standard Terms of Service document. For full legal text, please refer to our official terms.</p>' }
    },
    paymentSettings: {
      advancePaymentMethod: { type: String, default: 'bKash (Send Money)' },
      advancePaymentNumber: { type: String, default: '01700000000' }
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
