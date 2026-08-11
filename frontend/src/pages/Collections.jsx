import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import CategoryCard from '../components/CategoryCard';
import styles from './Shop.module.css';

const Collections = () => {
  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', minHeight: '80vh' }}>
      <SEO title="Collections" description="Explore Gents Clothes exclusive collections" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 600, textTransform: 'uppercase' }}>Our Collections</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Curated selections for every season</p>
      </motion.div>

      <motion.div 
        className={styles.productGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><CategoryCard title="Summer Edition 2026" image="/images/hero-banner.png" link="/shop?collection=summer" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><CategoryCard title="Eid Exclusive" image="/images/hero-banner.png" link="/shop?collection=eid" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><CategoryCard title="Winter Essentials" image="/images/hero-banner.png" link="/shop?collection=winter" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><CategoryCard title="Premium Minimal" image="/images/hero-banner.png" link="/shop?collection=minimal" /></motion.div>
      </motion.div>
    </div>
  );
};

export default Collections;
