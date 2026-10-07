const express = require('express');
const router = express.Router();
const {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for storefront & SEO Schema
router.get('/', getFAQs);

// Admin protected routes
router.get('/admin', protect, admin, getAdminFAQs);
router.post('/', protect, admin, createFAQ);
router.put('/:id', protect, admin, updateFAQ);
router.delete('/:id', protect, admin, deleteFAQ);

module.exports = router;
