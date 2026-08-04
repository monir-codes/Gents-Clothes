const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Public (should be Admin, but keeping public for demo)
const getStats = async (req, res) => {
  try {
    const orders = await Order.find({});
    const users = await User.find({});
    const products = await Product.find({});

    const totalOrders = orders.length;
    const totalCustomers = users.length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((acc, order) => {
      // If order has totalPrice, use it. Otherwise calculate from orderItems if populated
      return acc + (order.totalPrice || 0);
    }, 0);

    // Dummy conversion rate for now since we don't track page visits
    const conversionRate = totalOrders > 0 ? (totalOrders / 1000 * 100).toFixed(1) : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      conversionRate,
      recentOrders: orders.slice(0, 5) // Send 5 most recent orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getStats };
