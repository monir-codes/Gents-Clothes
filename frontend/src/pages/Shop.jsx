import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import styles from './Shop.module.css';

const Shop = ({ hideHeader }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('Featured');

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

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (sortOption === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <>
    <SEO title="Shop All Collections" description="Browse all premium luxury products from GentFits." />
    <div className={`container ${styles.shopContainer}`}>
      {/* Sidebar Filters */}
      {!hideHeader && (
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Categories</h3>
            <div className={styles.filterList}>
              {['T-Shirts', 'Polos', 'Shirts', 'Panjabis', 'Hoodies'].map(cat => (
                <label key={cat} className={styles.filterLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  /> {cat}
                </label>
              ))}
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
      )}

      {/* Main Content */}
      <main className={styles.mainContent} style={hideHeader ? { width: '100%', paddingLeft: 0 } : {}}>
        {!hideHeader && (
          <div className={styles.header}>
            <h1 className={styles.title}>All Products</h1>
            <select className={styles.sortSelect} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option>Featured</option>
              <option>New Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        )}

        {loading ? (
          <div className={styles.productGrid}>
             {/* Skeleton Loading */}
             {[1,2,3,4,5,6].map(i => (
               <div key={i} style={{ aspectRatio: '3/4', borderRadius: '8px' }} className="skeleton"></div>
             ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            className={styles.productGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <p>No products found matching your criteria.</p>
        )}
      </main>
    </div>
    </>
  );
};

export default Shop;
