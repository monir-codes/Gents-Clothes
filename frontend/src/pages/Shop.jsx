import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import styles from './Shop.module.css';

const Shop = ({ hideHeader }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(''); // 'under1000', '1000-2000', '2000-5000', 'over5000'
  const [sortOption, setSortOption] = useState('Featured');
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const isAiRecommended = queryParams.get('style') === 'ai-recommended';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `/api/products?page=${page}&limit=12`;
        
        if (selectedCategories.length > 0) {
          query += `&category=${selectedCategories.join(',')}`;
        }
        if (selectedSizes.length > 0) {
          query += `&sizes=${selectedSizes.join(',')}`;
        }
        
        if (priceRange === 'under1000') {
          query += `&maxPrice=1000`;
        } else if (priceRange === '1000-2000') {
          query += `&minPrice=1000&maxPrice=2000`;
        } else if (priceRange === '2000-5000') {
          query += `&minPrice=2000&maxPrice=5000`;
        } else if (priceRange === 'over5000') {
          query += `&minPrice=5000`;
        }

        if (sortOption === 'Price: Low to High') {
          query += `&sort=priceAsc`;
        } else if (sortOption === 'Price: High to Low') {
          query += `&sort=priceDesc`;
        }

        const { data } = await axios.get(query);
        const prodData = data.products ?? data;
        setProducts(Array.isArray(prodData) ? prodData : []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || data.length || 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategories, selectedSizes, priceRange, sortOption]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setPage(1);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
  };

  const displayedProducts = isAiRecommended
    ? (Array.isArray(products) ? products.sort(() => 0.5 - Math.random()).slice(0, 6) : [])
    : (Array.isArray(products) ? products.filter(p => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) : []);
  const filteredProducts = displayedProducts;

  return (
    <>
    <SEO title="Shop All Collections" description="Browse all premium luxury products from Gents Clothes." />
    <div className={`container ${styles.shopContainer}`}>
      {/* Sidebar Filters */}
      {!hideHeader && (
        <>
          {/* Backdrop for mobile */}
          {isMobileFilterOpen && (
             <div 
               style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 990 }}
               onClick={() => setIsMobileFilterOpen(false)}
             />
          )}
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
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === ''} onChange={() => handlePriceChange('')} /> All Prices</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === 'under1000'} onChange={() => handlePriceChange('under1000')} /> Under ৳1000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === '1000-2000'} onChange={() => handlePriceChange('1000-2000')} /> ৳1000 - ৳2000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === '2000-5000'} onChange={() => handlePriceChange('2000-5000')} /> ৳2000 - ৳5000</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === 'over5000'} onChange={() => handlePriceChange('over5000')} /> Over ৳5000</label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Size</h3>
          <div className={styles.filterList}>
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <label key={size} className={styles.filterLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                /> {size}
              </label>
            ))}
          </div>
        </div>
        </motion.aside>
        </>
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
                  <Sparkles color="var(--color-accent)" size={24} />
                  <div>
                    <h1 className={styles.title} style={{ color: 'var(--color-accent)' }}>AI Curated</h1>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>For your style profile</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className={styles.title}>All Products</h1>
                  <p className={styles.resultCount}>{filteredProducts.length} Results</p>
                </div>
              )}
            </div>

            <div className={styles.toolbarActions}>
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput} />
              <button 
                className={styles.mobileFilterBtn} 
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <select className={styles.sortSelect} value={sortOption} onChange={handleSortChange}>
                <option>Featured</option>
                <option>New Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </motion.div>
        )}

        {loading ? (
          <Loader />
        ) : filteredProducts.length > 0 ? (
          <>
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '8px 16px', background: page === 1 ? 'var(--color-border)' : 'var(--color-text-primary)', color: page === 1 ? 'var(--color-text-secondary)' : '#fff', borderRadius: '4px' }}
                >
                  Prev
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: '8px 16px', background: page === totalPages ? 'var(--color-border)' : 'var(--color-text-primary)', color: page === totalPages ? 'var(--color-text-secondary)' : '#fff', borderRadius: '4px' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No products found matching your criteria.</p>
        )}
      </main>
    </div>
    </>
  );
};

export default Shop;
