const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://gent_fits:bluWk3TM2C2HnFxs@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster';

// Cache the connection promise so Vercel serverless reuses it across invocations.
let cached = global.__mongoConnection;
if (!cached) {
  cached = global.__mongoConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse.
  if (cached.conn) return cached.conn;

  // Connection in progress — wait for it.
  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose
      .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((err) => {
        // Log but DO NOT call process.exit — let individual routes handle missing DB.
        console.error(`MongoDB connection error: ${err.message}`);
        cached.promise = null; // allow retry on next request
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
