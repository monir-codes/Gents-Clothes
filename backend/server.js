const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

// Load env vars
dotenv.config();

// Connect to database safely – Vercel Serverless may start without all env vars
(async () => {
  try {
    await connectDB();
    console.log('✅ DB connection established');
  } catch (err) {
    console.error('⚠️ DB connection failed:', err.message);
    // Continue without crashing the function; individual routes should handle missing DB
  }
})();

const app = express();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('GentFits API is running...');
});

// Start server only if not running on Vercel Serverless
// In Vercel Serverless environment we export the Express app without starting a listener.
// The platform will invoke the exported handler for each request.
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
