const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("MONGO_URI IS:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://gent_fits:bluWk3TM2C2HnFxs@simple-crud-cluster.0hdbxiy.mongodb.net/?appName=Simple-crud-cluster");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
