import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLanguageStore from '../store/useLanguageStore';
import styles from './SearchModal.module.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();

  const handleSearch = (term) => {
    const query = term || searchTerm;
    if (query && query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularTags = language === 'bn' ? [
    'ঢাকাই জামদানি শাড়ি',
    'মিরপুর কাতান শাড়ি',
    'সিল্ক শাড়ি',
    'পাকিস্তানি লন ৩-পিস',
    'ডিজাইনার কুর্তি',
    'দুবাই চেরি আবায়া',
    'ব্রাইডাল লেহেঙ্গা',
    'সুতি ২-পিস'
  ] : [
    'Dhakai Jamdani Saree',
    'Katan Silk Saree',
    'Pure Silk Saree',
    'Pakistani Lawn 3-Piece',
    'Designer Kurtis',
    'Dubai Cherry Abaya',
    'Bridal Lehenga',
    'Cotton Two-Piece'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className={styles.modal}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.header}>
              <div className={styles.searchBar}>
                <SearchIcon size={20} color="var(--color-text-secondary)" />
                <input 
                  type="text" 
                  placeholder={t('search.placeholder', 'Search products, categories...')}
                  autoFocus 
                  className={styles.input}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className={styles.aiBtn} onClick={() => handleSearch()}>
                  <Sparkles size={16} /> {t('search.searchBtn', 'Search')}
                </button>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close search"><X size={24} /></button>
            </div>
            
            <div className={styles.suggestions}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <TrendingUp size={18} color="var(--color-accent, #c9a265)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{t('search.popularSearches', 'Popular Searches')}</h3>
              </div>
              <div className={styles.tags}>
                {popularTags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className={styles.tag}
                    onClick={() => handleSearch(tag)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;

