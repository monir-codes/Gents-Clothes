const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  validateCoupon,
  subscribeNewsletter
} = require('../controllers/settingsController');

router.route('/').get(getSettings).put(updateSettings);
router.post('/validate-coupon', validateCoupon);
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;
