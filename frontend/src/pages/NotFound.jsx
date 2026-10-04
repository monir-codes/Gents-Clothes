import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Sparkles, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <SEO 
        title="404 - Page Not Found" 
        description="The page you are looking for does not exist on রঙবতী (Ronggoboti)." 
        noIndex={true}
      />

      <motion.div 
        className={styles.contentWrapper}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={styles.badge}>
          <Sparkles size={16} /> Error 404 • Lost in Luxury
        </div>

        <div className={styles.glitchNumber}>
          404
        </div>

        <h1 className={styles.title}>
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className={styles.description}>
          The page you requested may have moved, expired, or does not exist. Explore our exclusive designer collections or head back to the homepage.
        </p>

        <div className={styles.actionButtons}>
          <Link to="/" className={styles.btnPrimary}>
            <Home size={18} /> Back to Homepage
          </Link>
          <Link to="/shop" className={styles.btnSecondary}>
            <ShoppingBag size={18} /> Explore Shop
          </Link>
        </div>

        <div className={styles.popularSection}>
          <div className={styles.popularLabel}>
            Popular Categories
          </div>
          <div className={styles.categoryPills}>
            <Link to="/shop?category=Sarees" className={styles.pill}>
              শাড়ি (Sarees)
            </Link>
            <Link to="/shop?category=Salwar+Kameez" className={styles.pill}>
              সালোয়ার কামিজ (Salwar Suits)
            </Link>
            <Link to="/shop?category=Kurtis" className={styles.pill}>
              কুর্তি ও টিউনিক (Kurtis)
            </Link>
            <Link to="/shop?category=Lehengas" className={styles.pill}>
              লেহেঙ্গা ও গাউন (Lehengas)
            </Link>
            <Link to="/collections" className={styles.pill}>
              ঈদ কালেকশন (Collections)
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
