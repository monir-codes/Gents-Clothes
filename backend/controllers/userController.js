const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendVerificationEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email address before logging in.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Directly create user and mark as verified
  const user = await User.create({
    name,
    email,
    password,
    isVerified: true
  });

  if (user) {
    res.status(201).json({
      message: 'Registration successful! You can now log in.'
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Verify user email
// @route   GET /api/users/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined; // Clear the token
  await user.save();

  res.json({ message: 'Email verified successfully! You can now log in.' });
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
      isAdmin: user.isAdmin,
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
    
    // In future if password update is needed
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

// @desc    Google login
// @route   POST /api/users/google
// @access  Public
const googleLogin = async (req, res) => {
  const { name, email } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    // Generate a random password for google users
    const generatedPassword = crypto.randomBytes(16).toString('hex');
    user = await User.create({
      name,
      email,
      password: generatedPassword,
      isVerified: true
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
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  googleLogin,
};
