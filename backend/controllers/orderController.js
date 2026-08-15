const Order = require('../models/Order');
const { sendOrderNotificationEmail } = require('../utils/sendEmail');
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    transactionId,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    // Generate Custom ID: UserName-Count
    const userOrdersCount = await Order.countDocuments({ user: req.user._id });
    const userFirstName = req.user.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
    const customId = `${userFirstName}-${userOrdersCount + 1}`;

    const order = new Order({
      orderItems,
      user: req.user._id,
      customId,
      shippingAddress,
      paymentMethod,
      transactionId,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send email to Admin
    try {
      const adminEmails = ['info.gentsclothes@gmail.com', 'mdrummanmondal2@gmail.com'];
      for (const email of adminEmails) {
        await sendOrderNotificationEmail(email, createdOrder);
      }
    } catch (error) {
      console.error('Failed to send admin order notification email', error);
    }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { status } = req.body;

  if (order) {
    order.status = status;
    
    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Track order publicly
// @route   POST /api/orders/track
// @access  Public
const trackOrder = async (req, res) => {
  const { orderId, phone } = req.body;
  try {
    let order;
    
    // Check if orderId is a valid ObjectId, otherwise it might be a customId
    if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(orderId).populate('user', 'name');
    }
    
    if (!order) {
      order = await Order.findOne({ customId: orderId }).populate('user', 'name');
    }
    
    if (order) {
      if (order.shippingAddress.phone !== phone) {
        return res.status(401).json({ message: 'Invalid phone number for this order' });
      }
      res.json({
        _id: order.customId || order._id, // Return customId if available
        status: order.status,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        orderItems: order.orderItems,
        totalPrice: order.totalPrice
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Invalid Order ID' });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  trackOrder,
  deleteOrder,
};
