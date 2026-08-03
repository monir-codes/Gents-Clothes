import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import SearchModal from './SearchModal';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { cartItems, toggleCart } = useCartStore();
  return (
    <header className={styles.header}>
      <div className={styles.announcementBar}>
        FREE SHIPPING ON ORDERS OVER ৳5000 | PREMIUM SUMMER COLLECTION 2026
      </div>
      
      <div className={`container ${styles.navContainer}`}>
        <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className={styles.logo}>
          GentFits
        </Link>
        
        <nav className={styles.navLinks}>
          <Link to="/shop" className={styles.navLink}>Shop</Link>
          <Link to="/collections" className={styles.navLink}>Collections</Link>
          <Link to="/new-arrival" className={styles.navLink}>New Arrival</Link>
          <Link to="/sale" className={styles.navLink}>Sale</Link>
          <Link to="/track-order" className={styles.navLink}>Track Order</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
        </nav>
        
        <div className={styles.navIcons}>
          <button className={styles.iconBtn} aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <Search size={22} strokeWidth={1.5} />
          </button>
          
          <Link to="/profile" className={styles.iconWrapper}>
            <button className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={22} strokeWidth={1.5} />
            </button>
          </Link>
          
          <div className={styles.iconWrapper}>
            <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
              <ShoppingBag size={22} strokeWidth={1.5} />
            </button>
            {cartItems.length > 0 && (
              <span className={styles.badge}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
            )}
          </div>
          
          <Link to="/profile" className={styles.iconWrapper}>
            <button className={styles.iconBtn} aria-label="Profile">
              <User size={22} strokeWidth={1.5} />
            </button>
          </Link>
        </div>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Link to="/shop" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/collections" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
            <Link to="/new-arrival" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>New Arrival</Link>
            <Link to="/sale" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Sale</Link>
            <Link to="/track-order" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
            <Link to="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
