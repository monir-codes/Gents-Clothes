const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Settings = require('./models/Settings');

dotenv.config();

const resetSettings = async () => {
  await connectDB();
  console.log('Connected to DB. Resetting settings...');
  await Settings.deleteMany();
  
  // Recreate with defaults
  await Settings.create({
    featuredCategories: [
      { title: 'Premium T-Shirts', image: '/images/category-tshirt.png', link: '/shop?category=tshirts' },
      { title: 'Signature Polos', image: '/images/category-tshirt.png', link: '/shop?category=polos' },
      { title: 'Elegant Panjabis', image: '/images/category-tshirt.png', link: '/shop?category=panjabis' },
      { title: 'Winter Hoodies', image: '/images/category-tshirt.png', link: '/shop?category=hoodies' }
    ],
    featuredCollections: [
      { title: "Summer Collection '26", image: '/images/hero-banner.png', link: '/shop?collection=summer' },
      { title: 'Essentials', image: '/images/category-tshirt.png', link: '/shop?collection=essentials' }
    ]
  });
  
  console.log('Settings reset completed!');
  process.exit();
};

resetSettings();
