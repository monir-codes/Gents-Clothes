import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import useLanguageStore from '../store/useLanguageStore';
import styles from './Shop.module.css';

const CATEGORY_OPTIONS = [
  { key: 'Sarees', bn: 'শাড়ি কালেকশন', en: 'Sarees' },
  { key: 'Salwar Kameez', bn: 'সালোয়ার কামিজ ও ৩-পিস', en: 'Salwar Kameez' },
  { key: 'Two Piece', bn: '২-পিস ড্রেস', en: 'Two Piece Suits' },
  { key: 'Kurtis', bn: 'ডিজাইনার কুর্তি ও টিউনিক', en: 'Kurtis & Tunics' },
  { key: 'Lehengas', bn: 'লেহেঙ্গা ও গাউন', en: 'Lehengas & Gowns' },
  { key: 'Modest Wear', bn: 'মডেস্ট ওয়্যার ও আবায়া', en: 'Modest Wear & Abaya' },
  { key: 'Co-ord Sets', bn: 'লেডিস কর্ড সেট', en: 'Co-ord Sets' }
];

const Shop = ({ hideHeader }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language, getSearchSynonyms } = useLanguageStore();
  
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
  const urlSearch = queryParams.get('search');
  const urlCategory = queryParams.get('category');

  // Sync with URL parameters
  useEffect(() => {
    if (urlSearch !== null) {
      setSearchTerm(urlSearch);
    }
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = `/api/products?page=${page}&limit=12`;
        
        if (selectedCategories.length > 0) {
          query += `&category=${encodeURIComponent(selectedCategories.join(','))}`;
        }
        if (searchTerm && searchTerm.trim()) {
          query += `&search=${encodeURIComponent(searchTerm.trim())}`;
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

        if (sortOption === 'Price: Low to High' || sortOption === 'মূল্য: কম থেকে বেশি') {
          query += `&sort=priceAsc`;
        } else if (sortOption === 'Price: High to Low' || sortOption === 'মূল্য: বেশি থেকে কম') {
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
  }, [page, selectedCategories, searchTerm, selectedSizes, priceRange, sortOption]);

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
    : (Array.isArray(products) ? products : []);
  const filteredProducts = displayedProducts;

  const currentCategoryName = selectedCategories.length === 1 ? selectedCategories[0] : urlCategory;

  const seoTitle = currentCategoryName 
    ? `${currentCategoryName} Collection - Buy Online in Bangladesh | রঙবতী` 
    : "Shop Women's Fashion Collection - শাড়ি, থ্রি পিস, কুর্তি | রঙবতী";

  const seoDescription = currentCategoryName
    ? `Explore exclusive ${currentCategoryName} collection at রঙবতী (Ronggoboti). Premium quality, exquisite design, and fast home delivery all over Bangladesh.`
    : "রঙবতী (Ronggoboti) এর এক্সক্লুসিভ শাড়ি, সালোয়ার কামিজ, কুর্তি, থ্রি পিস এবং লেহেঙ্গার সম্পূর্ণ কালেকশন অনলাইন দেখুন ও সেরা মূল্যে অর্ডার করুন।";

  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoTitle,
    "description": seoDescription,
    "url": typeof window !== 'undefined' ? window.location.href : "https://www.ronggoboti.shop/shop",
    "isPartOf": {
      "@type": "WebSite",
      "name": "রঙবতী | Ronggoboti",
      "url": "https://www.ronggoboti.shop"
    }
  };

  return (
    <>
    <SEO 
      title={seoTitle} 
      description={seoDescription} 
      schemaMarkup={shopSchema}
    />
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('shop.filterBy', 'Filters')}</h3>
            <button onClick={() => setIsMobileFilterOpen(false)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
          </div>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>{t('shop.categories', 'Categories')}</h3>
            <div className={styles.filterList}>
              {CATEGORY_OPTIONS.map(cat => (
                <label key={cat.key} className={styles.filterLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.key)}
                    onChange={() => handleCategoryChange(cat.key)}
                  /> {language === 'bn' ? cat.bn : cat.en}
                </label>
              ))}
            </div>
          </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>{t('shop.price', 'Price')}</h3>
          <div className={styles.filterList}>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === ''} onChange={() => handlePriceChange('')} /> {t('shop.allPrices', 'All Prices')}</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === 'under1000'} onChange={() => handlePriceChange('under1000')} /> {t('shop.under1000', 'Under ৳1,000')}</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === '1000-2000'} onChange={() => handlePriceChange('1000-2000')} /> {t('shop.range1000to2000', '৳1,000 - ৳2,000')}</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === '2000-5000'} onChange={() => handlePriceChange('2000-5000')} /> {t('shop.range2000to5000', '৳2,000 - ৳5,000')}</label>
            <label className={styles.filterLabel}><input type="radio" name="price" checked={priceRange === 'over5000'} onChange={() => handlePriceChange('over5000')} /> {t('shop.over5000', 'Over ৳5,000')}</label>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>{t('shop.size', 'Size')}</h3>
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
                  <h1 className={styles.title}>
                    {searchTerm ? `${t('search.resultsFor', 'Search:')} "${searchTerm}"` : t('shop.allProducts', 'All Products')}
                  </h1>
                  <p className={styles.resultCount}>{totalProducts} {language === 'bn' ? 'টি পোশাক পাওয়া গেছে' : 'Items Found'}</p>
                </div>
              )}
            </div>

            <div className={styles.toolbarActions}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <SearchIcon size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder={t('search.placeholder', 'Search products...')} 
                  value={searchTerm} 
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} 
                  className={styles.searchInput} 
                  style={{ paddingLeft: '34px' }}
                />
              </div>
              <button 
                className={styles.mobileFilterBtn} 
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal size={16} /> {t('shop.filterBy', 'Filters')}
              </button>
              <select className={styles.sortSelect} value={sortOption} onChange={handleSortChange}>
                <option value="Featured">{t('shop.sortFeatured', 'Featured')}</option>
                <option value="New Arrivals">{t('shop.sortNewest', 'Newest Arrivals')}</option>
                <option value="Price: Low to High">{t('shop.sortPriceLowHigh', 'Price: Low to High')}</option>
                <option value="Price: High to Low">{t('shop.sortPriceHighLow', 'Price: High to Low')}</option>
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
                  style={{ padding: '8px 16px', background: page === 1 ? 'var(--color-border)' : 'var(--color-text-primary)', color: page === 1 ? 'var(--color-text-secondary)' : '#fff', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  {language === 'bn' ? 'পূর্ববর্তী' : 'Prev'}
                </button>
                <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                  {language === 'bn' ? `পৃষ্ঠা ${page} এর ${totalPages}` : `Page ${page} of ${totalPages}`}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: '8px 16px', background: page === totalPages ? 'var(--color-border)' : 'var(--color-text-primary)', color: page === totalPages ? 'var(--color-text-secondary)' : '#fff', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  {language === 'bn' ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--color-border, #ebdcd0)', marginTop: '20px' }}>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', marginBottom: '8px' }}>{t('shop.noProductsFound', 'No products found')}</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('shop.tryDifferentFilter', 'Try adjusting your filters or search keywords.')}</p>
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default Shop;

