const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
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
      default: '/images/hero-banner.png',
    },
    heroVideo: {
      type: String,
      default: '',
    },
    heroSlideshow: {
      type: [String],
      default: [],
    },
    aboutStory: {
      type: String,
      default: 'GentFits was founded with a singular, uncompromising vision: to redefine luxury menswear in Bangladesh.',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
