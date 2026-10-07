const Testimonial = require('../models/Testimonial');

// Default initial high-quality reviews without real photos (using pure styled avatars)
const DEFAULT_TESTIMONIALS = [
  {
    name: "নুসরাত জাহান",
    location: "ধানমন্ডি, ঢাকা",
    avatar: "",
    rating: 5,
    comment: "রঙবতী থেকে লাল ঢাকাই জামদানি শাড়িটা অর্ডার করেছিলাম। কাপড়ের কোয়ালিটি ও সূক্ষ্ম সুতার কাজ অসম্ভব সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। অত্যন্ত সন্তুষ্ট!",
    productName: "রয়েল লাল ঢাকাই জামদানি",
    verified: true,
    isActive: true,
    order: 1
  },
  {
    name: "Tahmina Rahman",
    location: "Gulshan, Dhaka",
    avatar: "",
    rating: 5,
    comment: "The Pakistani Luxury Lawn 3-Piece exceeded all my expectations. Pure chiffon dupatta and exquisite embroidery. Perfectly tailored to perfection!",
    productName: "Luxury Embroidered Lawn Suite",
    verified: true,
    isActive: true,
    order: 2
  },
  {
    name: "ফারহানা হক",
    location: "জিইসি মোড়, চট্টগ্রাম",
    avatar: "",
    rating: 5,
    comment: "দুবাই চেরি সিল্ক আবায়াটির ফ্যাব্রিক প্রিমিয়াম এবং ফল অত্যন্ত এলিগ্যান্ট। হিজাবের কোয়ালিটিও চমৎকার। অনলাইন কেনাকাটায় এমন সততা বিরল। ধন্যবাদ রঙবতী!",
    productName: "দুবাই চেরি সিল্ক আবায়া",
    verified: true,
    isActive: true,
    order: 3
  },
  {
    name: "Dr. Sabina Yasmin",
    location: "Sylhet Sadar",
    avatar: "",
    rating: 5,
    comment: "Pure Handloom Cotton Saree-র কালার কম্বিনেশন একদম ছবির মতোই নিখুঁত। নরম ও আরামদায়ক ফ্যাব্রিক। অফিস ও ক্যাজুয়াল ব্যবহারের জন্য সেরা!",
    productName: "হ্যান্ডলুম কটন শাড়ি",
    verified: true,
    isActive: true,
    order: 4
  },
  {
    name: "আফরিন সুলতানা",
    location: "উত্তরা, ঢাকা",
    avatar: "",
    rating: 5,
    comment: "ওয়েডিং কালেকশনের কাতান সিল্ক শাড়িটি পরে সবার প্রশংসা পেয়েছি। প্যাকেজিং ও কাস্টমার সার্ভিস এককথায় অসাধারণ। রঙবতী সবসময় আমার প্রথম পছন্দ!",
    productName: "কাতান সিল্ক ওয়েডিং কালেকশন",
    verified: true,
    isActive: true,
    order: 5
  }
];

// @desc    Get active testimonials for public site
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    let testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    // Seed default testimonials if DB is completely empty
    if (!testimonials || testimonials.length === 0) {
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    }

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.json(DEFAULT_TESTIMONIALS);
  }
};

// @desc    Get all testimonials for Admin
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAdminTestimonials = async (req, res) => {
  try {
    let testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });

    if (!testimonials || testimonials.length === 0) {
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      testimonials = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    }

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
  try {
    const { name, location, avatar, rating, comment, productName, productImage, verified, isActive, order } = req.body;

    if (!name || !comment) {
      return res.status(400).json({ message: 'Name and comment are required' });
    }

    const testimonial = new Testimonial({
      name: name.trim(),
      location: location ? location.trim() : 'ঢাকা, বাংলাদেশ',
      avatar: avatar || '',
      rating: Number(rating) || 5,
      comment: comment.trim(),
      productName: productName ? productName.trim() : '',
      productImage: productImage || '',
      verified: verified !== undefined ? verified : true,
      isActive: isActive !== undefined ? isActive : true,
      order: Number(order) || 0
    });

    const createdTestimonial = await testimonial.save();
    res.status(201).json(createdTestimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const { name, location, avatar, rating, comment, productName, productImage, verified, isActive, order } = req.body;

    if (name !== undefined) testimonial.name = name.trim();
    if (location !== undefined) testimonial.location = location.trim();
    if (avatar !== undefined) testimonial.avatar = avatar;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (comment !== undefined) testimonial.comment = comment.trim();
    if (productName !== undefined) testimonial.productName = productName.trim();
    if (productImage !== undefined) testimonial.productImage = productImage;
    if (verified !== undefined) testimonial.verified = verified;
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (order !== undefined) testimonial.order = Number(order);

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
  }
};

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
