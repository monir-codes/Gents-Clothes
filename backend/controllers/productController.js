const Product = require('../models/Product');

const BILINGUAL_SEARCH_MAP = {
  'শাড়ি': ['saree', 'sari', 'shari', 'sharee', 'jamdani', 'katan'],
  'জামদানি': ['jamdani', 'dhakai jamdani'],
  'কাতান': ['katan', 'katan silk'],
  'বেনারসি': ['benarasi', 'banarasi'],
  'সিল্ক': ['silk', 'pure silk', 'half silk', 'soft silk'],
  'সুতি': ['cotton', 'pure cotton', 'handloom', 'tant'],
  'তাঁত': ['tant', 'handloom'],
  'জর্জেট': ['georgette'],
  'অরগাঞ্জা': ['organza'],
  'মসলিন': ['muslin'],
  'বাটিক': ['batik'],
  'থ্রি পিস': ['three piece', '3 piece', 'salwar kameez', 'lawn'],
  '৩ পিস': ['three piece', '3 piece', 'salwar kameez'],
  '৩-পিস': ['three piece', '3 piece', 'salwar kameez'],
  'টু পিস': ['two piece', '2 piece', 'kurti pant'],
  '২ পিস': ['two piece', '2 piece', 'kurti pant'],
  '২-পিস': ['two piece', '2 piece', 'kurti pant'],
  'সালোয়ার কামিজ': ['salwar kameez', 'three piece'],
  'পাকিস্তানি লন': ['pakistani lawn', 'lawn'],
  'কুর্তি': ['kurti', 'kurtis', 'tunic'],
  'টিউনিক': ['tunic', 'top'],
  'টপস': ['tops', 'western tops'],
  'লেহেঙ্গা': ['lehenga', 'lehengas'],
  'ব্রাইডাল': ['bridal', 'wedding'],
  'গাউন': ['gown', 'gowns', 'maxi'],
  'আবায়া': ['abaya', 'abayas', 'cherry abaya', 'dubai'],
  'বোরকা': ['borka', 'burqa', 'abaya', 'modest'],
  'হিজাব': ['hijab', 'hijabs', 'khimar'],
  'কর্ড সেট': ['co-ord', 'coord', 'two piece'],
  'প্লাজো': ['palazzo', 'pants'],
  'শাল': ['shawl', 'shawls', 'kashmiri']
};

// @desc    Fetch all products (with pagination, sorting & bilingual search)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    // Filter Query
    const query = {};

    // Bilingual Search Filter (Keyword / Search)
    const searchTerm = req.query.search || req.query.keyword;
    if (searchTerm && searchTerm.trim()) {
      const cleanTerm = searchTerm.trim().toLowerCase();
      const termsSet = new Set([cleanTerm]);

      // Expand with synonyms
      Object.entries(BILINGUAL_SEARCH_MAP).forEach(([key, synonyms]) => {
        if (cleanTerm.includes(key.toLowerCase()) || key.toLowerCase().includes(cleanTerm)) {
          synonyms.forEach(s => termsSet.add(s.toLowerCase()));
        }
        synonyms.forEach(syn => {
          if (cleanTerm.includes(syn.toLowerCase()) || syn.toLowerCase().includes(cleanTerm)) {
            termsSet.add(key.toLowerCase());
          }
        });
      });

      const searchRegexList = Array.from(termsSet).map(term => new RegExp(term, 'i'));

      query.$or = [
        { name: { $in: searchRegexList } },
        { description: { $in: searchRegexList } },
        { category: { $in: searchRegexList } },
        { brand: { $in: searchRegexList } },
        { 'fabricDetails.fabric': { $in: searchRegexList } }
      ];
    }

    // Category Filter
    if (req.query.category) {
      const catList = req.query.category.split(',').map(c => new RegExp(`^${c.trim()}$`, 'i'));
      query.category = { $in: catList };
    }

    // Size Filter
    if (req.query.sizes) {
      query.sizes = { $in: req.query.sizes.split(',') };
    }

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: Newest Arrivals
    if (req.query.sort === 'priceAsc') sortOption = { price: 1 };
    if (req.query.sort === 'priceDesc') sortOption = { price: -1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const mongoose = require('mongoose');

// @desc    Fetch single product (by ID or Slug)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    }
    
    if (!product) {
      product = await Product.findOne({ slug: identifier });
    }

    if (product) {
      // If product has no slug yet, generate and save it
      if (!product.slug) {
        await product.save();
      }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name, price, oldPrice, image, hoverImage, images, brand, category,
      countInStock, numReviews, description, colors, sizes, fabricDetails, sku
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product title (Name) is required' });
    }

    // Default luxury image if none uploaded yet
    const fallbackImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';

    const safeColors = Array.isArray(colors) 
      ? colors.filter(Boolean) 
      : (typeof colors === 'string' ? colors.split(',').map(c => c.trim()).filter(Boolean) : []);

    const safeSizes = Array.isArray(sizes) 
      ? sizes.filter(Boolean) 
      : (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()).filter(Boolean) : []);

    const safeImages = Array.isArray(images) 
      ? images.map(img => (typeof img === 'string' ? img.trim() : '')).filter(Boolean)
      : (typeof images === 'string' ? images.split(',').map(img => img.trim()).filter(Boolean) : []);

    const safeFabricDetails = typeof fabricDetails === 'object' && fabricDetails !== null ? {
      material: fabricDetails.material || '',
      gsm: fabricDetails.gsm || '',
      washInstruction: fabricDetails.washInstruction || ''
    } : {
      material: typeof fabricDetails === 'string' ? fabricDetails : '',
      gsm: '',
      washInstruction: ''
    };

    const catName = category || 'Sarees';
    const catCode = catName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRD');
    const autoSku = `RGB-${catCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    const primaryImg = image && image.trim() ? image.trim() : (safeImages[0] || fallbackImage);
    const secondaryImg = hoverImage && hoverImage.trim() ? hoverImage.trim() : (safeImages[1] || '');
    const allGalleryImages = Array.from(new Set([
      primaryImg,
      secondaryImg,
      ...safeImages
    ])).filter(Boolean);

    const product = new Product({
      name: name.trim(),
      price: Number(price) >= 0 ? Number(price) : 0,
      oldPrice: oldPrice && Number(oldPrice) > 0 ? Number(oldPrice) : null,
      image: primaryImg,
      hoverImage: secondaryImg,
      images: allGalleryImages,
      brand: brand || 'রঙবতী',
      category: catName,
      countInStock: Number(countInStock) >= 0 ? Number(countInStock) : 0,
      numReviews: numReviews || 0,
      description: description ? description.trim() : 'Exquisite luxury fashion piece from রঙবতী.',
      colors: safeColors,
      sizes: safeSizes,
      fabricDetails: safeFabricDetails,
      sku: sku && sku.trim() ? sku.trim() : autoSku
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: error.message || 'Server Error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    oldPrice,
    description,
    image,
    hoverImage,
    images,
    brand,
    category,
    countInStock,
    colors,
    sizes,
    fabricDetails,
    sku
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (name) product.name = name.trim();
      if (price !== undefined) product.price = Number(price) >= 0 ? Number(price) : 0;
      if (oldPrice !== undefined) product.oldPrice = oldPrice && Number(oldPrice) > 0 ? Number(oldPrice) : null;
      if (description !== undefined) product.description = description.trim();
      if (image) product.image = image.trim();
      if (hoverImage !== undefined) product.hoverImage = hoverImage.trim();
      
      const rawImgs = Array.isArray(images) 
        ? images.map(img => (typeof img === 'string' ? img.trim() : '')).filter(Boolean)
        : (typeof images === 'string' ? images.split(',').map(img => img.trim()).filter(Boolean) : (product.images || []));
      const finalMain = (image && image.trim()) || product.image;
      const finalHover = hoverImage !== undefined ? hoverImage.trim() : product.hoverImage;
      product.images = Array.from(new Set([finalMain, finalHover, ...rawImgs])).filter(Boolean);
      if (brand) product.brand = brand;
      if (category) product.category = category;
      if (countInStock !== undefined) product.countInStock = Number(countInStock) >= 0 ? Number(countInStock) : 0;
      
      if (colors !== undefined) {
        product.colors = Array.isArray(colors) 
          ? colors.filter(Boolean) 
          : (typeof colors === 'string' ? colors.split(',').map(c => c.trim()).filter(Boolean) : []);
      }

      if (sizes !== undefined) {
        product.sizes = Array.isArray(sizes) 
          ? sizes.filter(Boolean) 
          : (typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()).filter(Boolean) : []);
      }

      if (fabricDetails !== undefined) {
        product.fabricDetails = typeof fabricDetails === 'object' && fabricDetails !== null ? {
          material: fabricDetails.material || product.fabricDetails?.material || '',
          gsm: fabricDetails.gsm || product.fabricDetails?.gsm || '',
          washInstruction: fabricDetails.washInstruction || product.fabricDetails?.washInstruction || ''
        } : product.fabricDetails;
      }

      if (sku && sku.trim()) product.sku = sku.trim();

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: error.message || 'Server Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        isApproved: false,
        adminReply: '',
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added and pending approval' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all reviews across all products
// @route   GET /api/products/reviews/all
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const allReviews = await Product.aggregate([
      { $match: { 'reviews.0': { $exists: true } } },
      { $unwind: '$reviews' },
      {
        $project: {
          _id: '$reviews._id',
          name: '$reviews.name',
          rating: '$reviews.rating',
          comment: '$reviews.comment',
          isApproved: '$reviews.isApproved',
          adminReply: '$reviews.adminReply',
          user: '$reviews.user',
          createdAt: '$reviews.createdAt',
          updatedAt: '$reviews.updatedAt',
          productId: '$_id',
          productName: '$name',
          productImage: '$image'
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update review status/reply
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  const { isApproved, adminReply } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = product.reviews.id(req.params.reviewId);
      if (review) {
        if (isApproved !== undefined) review.isApproved = isApproved;
        if (adminReply !== undefined) review.adminReply = adminReply;
        await product.save();
        res.json({ message: 'Review updated successfully' });
      } else {
        res.status(404).json({ message: 'Review not found' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllReviews,
  updateReviewStatus
};
