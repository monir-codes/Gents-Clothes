import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const RecentlyViewed = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Read from local storage
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Exclude current product and take top 4
        const filtered = parsed.filter(p => p._id !== currentProductId).slice(0, 4);
        setRecentProducts(filtered);
      } catch (e) {
        console.error('Error parsing recently viewed products', e);
      }
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <motion.div 
      style={{ marginTop: 'var(--space-8)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center', marginBottom: 'var(--space-4)' }}>Recently Viewed</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
        {recentProducts.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;
