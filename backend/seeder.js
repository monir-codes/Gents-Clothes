const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const products = require('./data/products');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    try {
      await User.collection.dropIndex('clerkId_1');
      console.log('Dropped clerkId_1 index');
    } catch (err) {
      // Ignore error if index does not exist
      console.log('clerkId_1 index not found or already dropped');
    }

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@gentsclothes.com',
        password: 'password', // will be hashed by pre-save
        isAdmin: true,
        clerkId: 'admin_123'
      },
      {
        name: 'Regular Customer',
        email: 'customer@gentsclothes.com',
        password: 'password',
        clerkId: 'cust_123'
      }
    ]);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map(p => {
      return { ...p, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
