const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const aiRoutes = require('./routes/aiRoutes');

// CORS — allow all origins for now (tighten in production)
app.use(cors({ origin: '*' }));
app.use(express.json());

// Middleware: ensure DB is connected before every request.
// This is the correct pattern for Vercel serverless — avoids cold-start race conditions.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed on request:', err.message);
    // Don't block the request — let individual controllers handle missing DB
    next();
  }
});



// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GentFits API is running', timestamp: new Date().toISOString() });
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
