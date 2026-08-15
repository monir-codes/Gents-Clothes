const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendOtpEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Auth user & get token (Step 1: Check creds & send OTP)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if ((user.email.toLowerCase() === 'mdrummanmondal2@gmail.com' || user.email.toLowerCase() === 'info.gentsclothes@gmail.com') && !user.isAdmin) {
      user.isAdmin = true;
    }

    // Generate OTP for login
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp, 'Login');

    res.json({
      message: 'OTP_SENT',
      email: user.email,
      isVerified: user.isVerified
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Verify OTP (Step 2 of Login/Register)
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};


// @desc    Register a new user (Step 1: Save & send OTP)
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }
  }

  if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
    return res.status(400).json({ message: 'Please provide a valid 11-digit Bangladeshi phone number' });
  }

  const isAdminEmail = email.toLowerCase() === 'mdrummanmondal2@gmail.com' || email.toLowerCase() === 'info.gentsclothes@gmail.com';
  const otp = generateOTP();

  if (user) {
    // Update unverified user
    user.name = name;
    user.password = password;
    user.phone = phone;
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password,
      phone,
      isVerified: false,
      isAdmin: isAdminEmail,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    });
  }

  await sendOtpEmail(user.email, otp, 'Registration');

  res.status(201).json({
    message: 'OTP_SENT',
    email: user.email
  });
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendPasswordResetEmail(user.email, otp);

  res.json({ message: 'OTP_SENT', email: user.email });
};

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.password = password;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
};


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      addresses: user.addresses
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    if (req.body.addresses && req.body.addresses.length > 0) {
      user.addresses = req.body.addresses;
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      addresses: updatedUser.addresses,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400).json({ message: 'Cannot delete admin user' });
      return;
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.email === 'mdrummanmondal2@gmail.com') {
      return res.status(400).json({ message: 'Cannot change role of super admin' });
    }
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Google login
// @route   POST /api/users/google
// @access  Public
const googleLogin = async (req, res) => {
  const { name, email } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if ((user.email.toLowerCase() === 'mdrummanmondal2@gmail.com' || user.email.toLowerCase() === 'info.gentsclothes@gmail.com') && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    const password = crypto.randomBytes(20).toString('hex');
    const isAdminEmail = email.toLowerCase() === 'mdrummanmondal2@gmail.com' || email.toLowerCase() === 'info.gentsclothes@gmail.com';
    
    user = await User.create({
      name,
      email,
      password,
      isVerified: true,
      isAdmin: isAdminEmail
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  }
};

module.exports = {
  authUser,
  registerUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserRole,
  googleLogin,
};
