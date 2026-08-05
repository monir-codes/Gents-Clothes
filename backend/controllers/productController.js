const Product = require('../models/Product');

// @desc    Fetch all products (with pagination & sorting)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    // Filter Query
    const query = {};

    // Category Filter
    if (req.query.category) {
      query.category = { $in: req.query.category.split(',') };
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

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name, price, oldPrice, image, hoverImage, brand, category,
      countInStock, numReviews, description, colors, sizes, fabricDetails, sku
    } = req.body;

    const product = new Product({
      name: name || 'Sample name',
      price: price || 0,
      oldPrice: oldPrice || null,
      image: image || '/images/sample.jpg',
      hoverImage: hoverImage || '',
      brand: brand || 'GentFits',
      category: category || 'Sample category',
      countInStock: countInStock || 0,
      numReviews: numReviews || 0,
      description: description || 'Sample description',
      colors: colors || [],
      sizes: sizes || [],
      fabricDetails: fabricDetails || '',
      sku: sku || ''
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
      product.name = name || product.name;
      product.price = price || product.price;
      if (oldPrice !== undefined) product.oldPrice = oldPrice;
      product.description = description || product.description;
      product.image = image || product.image;
      product.hoverImage = hoverImage || product.hoverImage;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.colors = colors || product.colors;
      product.sizes = sizes || product.sizes;
      product.fabricDetails = fabricDetails || product.fabricDetails;
      if (sku !== undefined) product.sku = sku;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } });
    let allReviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        allReviews.push({ ...r.toObject(), productId: p._id, productName: p.name, productImage: p.image });
      });
    });
    // sort newest first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
