import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import styles from './Shop.module.css';

const Shop = ({ hideHeader }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('Featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const isAiRecommended = queryParams.get('style') === 'ai-recommended';

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

    if (isAiRecommended) {
      // Mock AI filtering - just shuffling and picking 4-6 products for demo
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 6);
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
        <motion.aside 
          className={`${styles.sidebar} ${isMobileFilterOpen ? styles.sidebarOpen : ''}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.mobileFilterHeader}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Filters</h3>
            <button onClick={() => setIsMobileFilterOpen(false)} style={{ fontSize: '1.5rem' }}>&times;</button>
          </div>
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
        </motion.aside>
      )}

      {/* Main Content */}
      <main className={styles.mainContent} style={hideHeader ? { width: '100%', paddingLeft: 0 } : {}}>
        {!hideHeader && (
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.headerTitleGroup}>
              {isAiRecommended ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles color="var(--color-accent)" size={32} />
                  <div>
                    <h1 className={styles.title} style={{ color: 'var(--color-accent)' }}>AI Curated For You</h1>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Based on your style profile</p>
                  </div>
                </div>
              ) : (
                <h1 className={styles.title}>All Products</h1>
              )}
              <button 
                className={styles.mobileFilterBtn} 
                onClick={() => setIsMobileFilterOpen(true)}
              >
                Filters
              </button>
            </div>
            <select className={styles.sortSelect} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option>Featured</option>
              <option>New Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </motion.div>
        )}

        {loading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            className={styles.productGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
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
