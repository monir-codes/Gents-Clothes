import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import SEO from '../components/SEO';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div>
      <SEO 
        title="Home" 
        description="GentFits - Redefining luxury men's fashion in Bangladesh. Shop premium Panjabis, Shirts, and T-Shirts." 
      />
      <section className={styles.hero}>
        <img 
          src="/images/hero-banner.png" 
          alt="Luxury Fashion Hero" 
          className={styles.heroImage}
        />
        <div className={styles.overlay}></div>
        
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Redefine Your Elegance
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover the premium collection tailored for the modern gentleman.
          </motion.p>
          
          <motion.div 
            className={styles.ctaContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link to="/shop">
              <button className={styles.btnPrimary}>Shop Now</button>
            </Link>
            <Link to="/collections">
              <button className={styles.btnOutline}>Explore Collection</button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeText}>
          <span>PREMIUM QUALITY</span>
          <span>FLAWLESS TAILORING</span>
          <span>MODERN GENTLEMAN</span>
          <span>LUXURY FABRICS</span>
          {/* Duplicate for infinite loop illusion */}
          <span>PREMIUM QUALITY</span>
          <span>FLAWLESS TAILORING</span>
          <span>MODERN GENTLEMAN</span>
          <span>LUXURY FABRICS</span>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="container" style={{ padding: 'var(--space-8) var(--space-3)' }}>
        <motion.h2 
          style={{ textAlign: 'center', marginBottom: 'var(--space-6)', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.5px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Featured Categories
        </motion.h2>
        <motion.div 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <CategoryCard title="Premium T-Shirts" image="/images/category-tshirt.png" link="/shop?category=tshirts" />
          <CategoryCard title="Signature Polos" image="/images/category-tshirt.png" link="/shop?category=polos" />
          <CategoryCard title="Elegant Panjabis" image="/images/category-tshirt.png" link="/shop?category=panjabis" />
          <CategoryCard title="Winter Hoodies" image="/images/category-tshirt.png" link="/shop?category=hoodies" />
        </motion.div>
      </section>

      {/* Instagram Shop Section */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>@GentFits on Instagram</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Tag us to be featured #GentFits</p>
        </div>
        <div className={styles.instaGrid}>
          {[1,2,3,4].map((i) => (
            <div key={i} className={styles.instaItem}>
              <img src={`/images/hero-banner.png`} alt={`Instagram ${i}`} />
              <div className={styles.instaOverlay}>
                <Instagram size={32} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
