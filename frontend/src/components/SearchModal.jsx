import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, Sparkles } from 'lucide-react';
import styles from './SearchModal.module.css';

const SearchModal = ({ isOpen, onClose }) => {
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
                <input type="text" placeholder="Search products, categories..." autoFocus className={styles.input} />
                <button className={styles.aiBtn}>
                  <Sparkles size={16} /> AI Smart Search
                </button>
              </div>
              <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
            </div>
            
            <div className={styles.suggestions}>
              <h3>Popular Searches</h3>
              <div className={styles.tags}>
                <span className={styles.tag}>Premium Panjabis</span>
                <span className={styles.tag}>Black T-Shirts</span>
                <span className={styles.tag}>Winter Hoodies</span>
              </div>
              
              <h3 style={{ marginTop: '24px' }}>AI Recommended for You</h3>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <div style={{ width: '80px', height: '100px', background: 'var(--color-surface)', borderRadius: '4px' }}></div>
                <div style={{ width: '80px', height: '100px', background: 'var(--color-surface)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
