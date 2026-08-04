import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import SEO from '../components/SEO';
import styles from './Home.module.css';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error("CMS Fetch error", error);
      }
    };
    fetchSettings();
  }, []);
  return (
    <div>
      <SEO 
        title="Home" 
        description="GentFits - Redefining luxury men's fashion in Bangladesh. Shop premium Panjabis, Shirts, and T-Shirts." 
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        {settings?.heroVideo ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className={styles.heroVideo}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
          >
            <source src={settings.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <motion.div 
            className={styles.heroBackground} 
            style={{ 
              backgroundImage: `url(${settings?.heroImage || '/images/hero-banner.png'})`,
              y: y1 // Apply parallax
            }} 
          />
        )}
        <div className={styles.heroOverlay} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: -1 }} />
        
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className={styles.heroTitle}>{settings?.heroTitle || 'Premium Luxury Menswear'}</h1>
            <p className={styles.heroSubtitle}>
              {settings?.heroSubtitle || 'Discover the latest collections of Panjabis, Shirts, and T-Shirts.'}
            </p>
            <div className={styles.ctaContainer}>
              <Link to="/shop">
                <button className={styles.btnPrimary}>Shop Now</button>
              </Link>
              <Link to="/collections">
                <button className={styles.btnOutline}>Explore Collection</button>
              </Link>
            </div>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
