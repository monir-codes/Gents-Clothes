import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import CategoryCard from '../components/CategoryCard';

const Collections = () => {
  return (
    <div className="container" style={{ padding: '60px var(--space-3)', minHeight: '80vh' }}>
      <SEO title="Collections" description="Explore GentFits exclusive collections" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 600, textTransform: 'uppercase' }}>Our Collections</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Curated selections for every season</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <CategoryCard title="Summer Edition 2026" image="/images/hero-banner.png" link="/shop?collection=summer" />
        <CategoryCard title="Eid Exclusive" image="/images/hero-banner.png" link="/shop?collection=eid" />
        <CategoryCard title="Winter Essentials" image="/images/hero-banner.png" link="/shop?collection=winter" />
        <CategoryCard title="Premium Minimal" image="/images/hero-banner.png" link="/shop?collection=minimal" />
      </div>
    </div>
  );
};

export default Collections;
