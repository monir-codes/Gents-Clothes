const express = require('express');
const router = express.Router();
const { authUser, registerUser, verifyOtp, forgotPassword, resetPassword, getUserProfile, updateUserProfile, getUsers, deleteUser, updateUserRole, googleLogin } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);

module.exports = router;
