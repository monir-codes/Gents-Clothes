const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  location: { 
    type: String, 
    default: 'ঢাকা, বাংলাদেশ',
    trim: true
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  rating: { 
    type: Number, 
    required: true, 
    default: 5,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true,
    trim: true
  },
  productName: { 
    type: String, 
    default: '',
    trim: true
  },
  productImage: { 
    type: String, 
    default: '' 
  },
  verified: { 
    type: Boolean, 
    default: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  order: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
