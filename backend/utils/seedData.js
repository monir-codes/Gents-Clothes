const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const products = require('../data/products');

const seedData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Database empty, seeding data...');
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      const createdUsers = await User.create([
        {
          name: 'Admin User',
          email: 'admin@gentsclothes.com',
          password: 'password', // will be hashed by pre-save
          isAdmin: true
        },
        {
          name: 'Regular Customer',
          email: 'customer@gentsclothes.com',
          password: 'password'
        }
      ]);

      const adminUser = createdUsers[0]._id;
      const sampleProducts = products.map(p => {
        return { ...p, user: adminUser };
      });

      await Product.insertMany(sampleProducts);
      console.log('Data Imported successfully.');
    }
  } catch (error) {
    console.error(`Error Seeding: ${error}`);
  }
};

module.exports = seedData;
