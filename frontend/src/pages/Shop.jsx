import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import styles from './Shop.module.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
    <SEO title="Shop All Collections" description="Browse all premium luxury products from GentFits." />
    <div className={`container ${styles.shopContainer}`}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Categories</h3>
          <div className={styles.filterList}>
            <label className={styles.filterLabel}><input type="checkbox" /> T-Shirts</label>
            <label className={styles.filterLabel}><input type="checkbox" /> Polos</label>
            <label className={styles.filterLabel}><input type="checkbox" /> Shirts</label>
            <label className={styles.filterLabel}><input type="checkbox" /> Panjabis</label>
            <label className={styles.filterLabel}><input type="checkbox" /> Hoodies</label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Price</h3>
          <div className={styles.filterList}>
            <label className={styles.filterLabel}><input type="radio" name="price" /> Under ৳1000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" /> ৳1000 - ৳2000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" /> ৳2000 - ৳5000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" /> Over ৳5000</label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Size</h3>
          <div className={styles.filterList}>
            <label className={styles.filterLabel}><input type="checkbox" /> S</label>
            <label className={styles.filterLabel}><input type="checkbox" /> M</label>
            <label className={styles.filterLabel}><input type="checkbox" /> L</label>
            <label className={styles.filterLabel}><input type="checkbox" /> XL</label>
            <label className={styles.filterLabel}><input type="checkbox" /> XXL</label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Products</h1>
          <select className={styles.sortSelect}>
            <option>Featured</option>
            <option>New Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className={styles.productGrid}>
             {/* Skeleton Loading */}
             {[1,2,3,4,5,6].map(i => (
               <div key={i} style={{ aspectRatio: '3/4', borderRadius: '8px' }} className="skeleton"></div>
             ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            className={styles.productGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <p>No products found. (Run seeder to add sample products)</p>
        )}
      </main>
    </div>
    </>
  );
};

export default Shop;
