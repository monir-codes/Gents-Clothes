const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
// Note: We bypass 'protect, admin' here for the demo to allow saving without auth,
// but in production it should be: router.route('/').get(getSettings).put(protect, admin, updateSettings);

router.route('/').get(getSettings).put(updateSettings);

module.exports = router;
