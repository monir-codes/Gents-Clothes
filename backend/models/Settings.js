const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    announcementText: {
      type: String,
      default: 'FREE SHIPPING ON ORDERS OVER ৳5000 | PREMIUM SUMMER COLLECTION 2026',
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
      fallbackImage: { type: String, default: '/images/video-fallback.jpg' }
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
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
