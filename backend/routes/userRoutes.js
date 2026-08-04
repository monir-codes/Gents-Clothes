const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
