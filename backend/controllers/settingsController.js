const Settings = require('../models/Settings');
const { sendNewsletterNotificationEmail } = require('../utils/sendEmail');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await Settings.create({
        adminEmail: 'mdrummanmondal2@gmail.com',
        coupons: [
          {
            code: 'RONGGOBOTI10',
            discountPercentage: 10,
            isActive: true,
            description: '10% Discount on First Purchase',
            minOrderAmount: 0
          }
        ],
        paymentSettings: {
          deliveryChargeInsideDhaka: 70,
          deliveryChargeSubDhaka: 100,
          deliveryChargeOutsideDhaka: 120,
          freeShippingThreshold: 5000,
          isAdvancePaymentEnabled: true,
          advanceChargeType: 'deliveryCharge',
          fixedAdvanceAmount: 120,
          advancePaymentMethods: [
            {
              id: 'bkash_default',
              name: 'bKash',
              number: '01700000000',
              type: 'Personal (Send Money)',
              instructions: 'Send Money to this bKash number and provide your Transaction ID below.',
              isActive: true
            },
            {
              id: 'nagad_default',
              name: 'Nagad',
              number: '01800000000',
              type: 'Personal (Send Money)',
              instructions: 'Send Money to this Nagad number and provide your Transaction ID below.',
              isActive: true
            }
          ]
        }
      });
    } else {
      let needsSave = false;
      if (!settings.coupons || settings.coupons.length === 0) {
        settings.coupons = [
          {
            code: 'RONGGOBOTI10',
            discountPercentage: 10,
            isActive: true,
            description: '10% Discount on First Purchase',
            minOrderAmount: 0
          }
        ];
        needsSave = true;
      }
      if (!settings.paymentSettings) {
        settings.paymentSettings = {
          deliveryChargeInsideDhaka: 70,
          deliveryChargeSubDhaka: 100,
          deliveryChargeOutsideDhaka: 120,
          freeShippingThreshold: 5000,
          isAdvancePaymentEnabled: true,
          advanceChargeType: 'deliveryCharge',
          fixedAdvanceAmount: 120,
          advancePaymentMethods: [
            {
              id: 'bkash_default',
              name: 'bKash',
              number: '01700000000',
              type: 'Personal (Send Money)',
              instructions: 'Send Money to this bKash number and provide your Transaction ID below.',
              isActive: true
            },
            {
              id: 'nagad_default',
              name: 'Nagad',
              number: '01800000000',
              type: 'Personal (Send Money)',
              instructions: 'Send Money to this Nagad number and provide your Transaction ID below.',
              isActive: true
            }
          ]
        };
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
      }
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
      'featuredVideoSection', 'reviews', 'instagramImages', 'newsletter', 'staticPages', 'paymentSettings',
      'adminEmail', 'coupons'
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

// @desc    Validate coupon code
// @route   POST /api/settings/validate-coupon
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const cleanCode = code.trim().toUpperCase();
    const settings = await Settings.findOne();
    
    if (!settings || !settings.coupons || settings.coupons.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid Coupon' });
    }

    const coupon = settings.coupons.find(
      c => c.code && c.code.trim().toUpperCase() === cleanCode && c.isActive
    );

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid Coupon' });
    }

    if (coupon.minOrderAmount && cartTotal && Number(cartTotal) < Number(coupon.minOrderAmount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ৳${coupon.minOrderAmount} required for coupon ${coupon.code}`
      });
    }

    return res.json({
      success: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description,
      message: `Coupon "${coupon.code}" applied! ${coupon.discountPercentage}% discount.`
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ success: false, message: 'Error validating coupon code' });
  }
};

// @desc    Newsletter subscription & admin notification via Nodemailer
// @route   POST /api/settings/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const settings = await Settings.findOne();
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || 'mdrummanmondal2@gmail.com';

    // Send notification email to admin directly
    await sendNewsletterNotificationEmail(email.trim(), adminEmail);

    return res.json({
      success: true,
      message: 'Thank you! You have successfully subscribed to the রঙবতী newsletter.'
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe to newsletter.' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  validateCoupon,
  subscribeNewsletter
};
