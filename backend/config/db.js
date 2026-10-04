const mongoose = require('mongoose');

const FALLBACK_MONGO_URI = 'mongodb+srv://gents_clothes:PmNDv7XfjaCW5Riw@simple-crud-cluster.0hdbxiy.mongodb.net/gentsclothes?appName=Simple-crud-cluster';

// Cache the connection promise so Vercel serverless reuses it across invocations.
let cached = global.__mongoConnection;
if (!cached) {
  cached = global.__mongoConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse.
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGO_URI || FALLBACK_MONGO_URI;

  // Connection in progress — wait for it.
  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose
      .connect(uri, { 
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000 
      })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cached.conn = conn;
        return conn;
      })
      .catch((err) => {
        console.error(`MongoDB connection error: ${err.message}`);
        cached.promise = null; // allow retry on next request
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
