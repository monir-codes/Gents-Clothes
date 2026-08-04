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
    res.status(500).json({ message: 'Server Error' });
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

    settings.heroTitle = req.body.heroTitle !== undefined ? req.body.heroTitle : settings.heroTitle;
    settings.heroSubtitle = req.body.heroSubtitle !== undefined ? req.body.heroSubtitle : settings.heroSubtitle;
    settings.heroImage = req.body.heroImage !== undefined ? req.body.heroImage : settings.heroImage;
    settings.heroVideo = req.body.heroVideo !== undefined ? req.body.heroVideo : settings.heroVideo;
    settings.heroSlideshow = req.body.heroSlideshow !== undefined ? req.body.heroSlideshow : settings.heroSlideshow;
    settings.aboutStory = req.body.aboutStory !== undefined ? req.body.aboutStory : settings.aboutStory;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSettings, updateSettings };
