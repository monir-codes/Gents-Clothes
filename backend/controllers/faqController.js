const FAQ = require('../models/FAQ');

// High quality initial seed FAQs for Bangladeshi Women's Fashion eCommerce
const DEFAULT_FAQS = [
  {
    question: "কীভাবে রঙবতী (Ronggoboti) থেকে শাড়ি, থ্রি-পিস বা কুর্তি অর্ডার করব?",
    answer: "পছন্দের প্রোডাক্টটি সিলেক্ট করে 'Add to Cart' অথবা 'Buy Now' বাটনে ক্লিক করুন। আপনার নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে ক্যাশ অন ডেলিভারি (COD) বা বিকাশ/নগদে পেমেন্ট সিলেক্ট করে খুব সহজেই অর্ডার কনফার্ম করতে পারবেন।",
    category: "Orders & Payment",
    order: 1,
    isActive: true
  },
  {
    question: "সারা বাংলাদেশে ডেলিভারি পেতে কত দিন সময় লাগে?",
    answer: "ঢাকা সিটির ভেতরে ১ থেকে ২ কর্মদিবস এবং ঢাকার বাইরে ৩ থেকে ৫ কর্মদিবসের মধ্যে আপনার দোরগোড়ায় পণ্য পৌঁছে দেওয়া হয়।",
    category: "Delivery & Shipping",
    order: 2,
    isActive: true
  },
  {
    question: "রঙবতীর শাড়ি ও পোশাকের কাপড়ের মান (Quality & Fabric) কেমন?",
    answer: "রঙবতী শতভাগ খাঁটি ও প্রিমিয়াম কোয়ালিটি নিশ্চয়তা দেয়। আমাদের প্রতিটি ঢাকাই জামদানি, সুতি তাঁত, কাতান ও সিল্ক সরাসরি অভিজ্ঞ কারিগরদের দ্বারা নিপুণভাবে বোনা হয়।",
    category: "Fabric & Sizing",
    order: 3,
    isActive: true
  },
  {
    question: "ক্যাশ অন ডেলিভারিতে (Cash on Delivery) কি পণ্য চেক করে নেওয়া যাবে?",
    answer: "হ্যাঁ, ডেলিভারিম্যানের সামনে পার্সেলটি চেক করে নেওয়ার পূর্ণ সুবিধা রয়েছে। পণ্যে কোনো ত্রুটি বা অমিল থাকলে সাথে সাথে রিটার্ন করতে পারবেন।",
    category: "Orders & Payment",
    order: 4,
    isActive: true
  },
  {
    question: "পণ্য পছন্দ না হলে বা সাইজের সমস্যা হলে কি পরিবর্তন (Return & Exchange) করা যাবে?",
    answer: "হ্যাঁ, পণ্য পাওয়ার পর ৭ দিনের মধ্যে আমাদের সাথে যোগাযোগ করে সহজেই সাইজ বা প্রোডাক্ট এক্সচেঞ্জ/রিটার্ন করতে পারবেন। পোশাকটি অবশ্যই অবিকৃত ও আসল ট্যাগযুক্ত থাকতে হবে।",
    category: "Returns & Exchange",
    order: 5,
    isActive: true
  },
  {
    question: "শাড়ি ও দামি পোশাকগুলোর যত্ন কীভাবে নেব (Wash & Care)?",
    answer: "জামদানি, কাতান ও সিল্কের মতো এক্সক্লুসিভ পোশাকগুলোর সৌন্দর্য ও জরির কাজ দীর্ঘস্থায়ী রাখতে ড্রাই ক্লিন (Dry Clean) করার পরামর্শ দেওয়া হয়। সুতি পোশাক হালকা পানিতে কোমল ডিটারজেন্ট দিয়ে ধোয়া উত্তম।",
    category: "Fabric & Sizing",
    order: 6,
    isActive: true
  },
  {
    question: "অগ্রিম কোনো টাকা দিতে হবে কি?",
    answer: "ঢাকার বাইরের অর্ডারের ক্ষেত্রে ডেলিভারি চার্জ বাবদ সামান্য অগ্রিম প্রযোজ্য হতে পারে, যা অর্ডারের সময় বিকাশ বা নগদের মাধ্যমে সহজে পরিশোধ করতে পারবেন। বাকি পুরো টাকা পণ্য হাতে পেয়ে পরিশোধ করবেন।",
    category: "Orders & Payment",
    order: 7,
    isActive: true
  }
];

// @desc    Get all active FAQs for public site
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    let faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    if (!faqs || faqs.length === 0) {
      await FAQ.insertMany(DEFAULT_FAQS);
      faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    }

    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.json(DEFAULT_FAQS);
  }
};

// @desc    Get all FAQs for Admin
// @route   GET /api/faqs/admin
// @access  Private/Admin
const getAdminFAQs = async (req, res) => {
  try {
    let faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });

    if (!faqs || faqs.length === 0) {
      await FAQ.insertMany(DEFAULT_FAQS);
      faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
    }

    res.json(faqs);
  } catch (error) {
    console.error('Error fetching admin FAQs:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const faq = new FAQ({
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'General',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedFAQ = await faq.save();
    res.status(201).json(savedFAQ);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Failed to create FAQ', error: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const { question, answer, category, order, isActive } = req.body;

    if (question !== undefined) faq.question = question.trim();
    if (answer !== undefined) faq.answer = answer.trim();
    if (category !== undefined) faq.category = category;
    if (order !== undefined) faq.order = Number(order);
    if (isActive !== undefined) faq.isActive = isActive;

    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.deleteOne();
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
  }
};

module.exports = {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
