const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  adminReply: { type: String, default: '' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String }, // For hover effect
  brand: { type: String, required: true },
  category: { type: String, required: true }, // e.g. T-Shirts, Polo, Panjabi
  collectionType: { type: String }, // e.g. Summer Collection, Premium Collection
  description: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  oldPrice: { type: Number }, // For discount badges
  countInStock: { type: Number, required: true, default: 0 },
  
  // Specific features mentioned in PRD
  colors: [String],
  sizes: [String],
  fabricDetails: {
    material: String,
    gsm: String,
    washInstruction: String,
  },
  
  // Unique identifiers
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String },
  
  // AI features
  aiDescription: { type: String },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
