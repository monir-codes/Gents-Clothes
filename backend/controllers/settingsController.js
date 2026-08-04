const Settings = require('../models/Settings');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // List of allowed fields to update
    const allowedFields = [
      'announcementText', 'announcementList', 'whatsappNumber', 'heroTitle', 'heroSubtitle', 'heroImage', 'heroVideo', 'heroSlideshow',
      'marqueeText', 'featuredCategories', 'featuredCollections', 'limitedEdition',
      'shopTheLook', 'premiumCollection', 'features', 'brandStory',
      'featuredVideoSection', 'reviews', 'instagramImages', 'newsletter', 'staticPages'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
