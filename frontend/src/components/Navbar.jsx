import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(['FREE SHIPPING ON ORDERS OVER ৳5000 | PREMIUM SUMMER COLLECTION 2026']);
  const { cartItems, toggleCart } = useCartStore();
  const { wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data && data.announcementList && data.announcementList.length > 0) {
          setAnnouncements(Array.isArray(data.announcementList) ? data.announcementList : [data.announcementList]);
        } else if (data && data.announcementText) {
          setAnnouncements([data.announcementText]);
        }
      } catch (error) {
        console.error("CMS Fetch error", error);
      }
    };
    fetchSettings();
  }, []);

  const handleAuth = async () => {
    if (user) {
      // Toggle user menu dropdown
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.announcementBar}>
        {announcements.length > 1 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            speed={800}
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            {announcements.map((text, idx) => (
              <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {text}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          announcements[0]
        )}
      </div>
      
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          Gents Clothes
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
          
          <Link to="/wishlist" className={styles.iconWrapper}>
            <button className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={22} strokeWidth={1.5} />
            </button>
            {wishlistItems.length > 0 && (
              <span className={styles.badge}>{wishlistItems.length}</span>
            )}
          </Link>
          
          <div className={styles.iconWrapper}>
            <button className={styles.iconBtn} aria-label="Cart" onClick={toggleCart}>
              <ShoppingBag size={22} strokeWidth={1.5} />
            </button>
            {cartItems.length > 0 && (
              <span className={styles.badge}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
            )}
          </div>
                    {/* User Icon visible only on Desktop */}
            <div className={styles.desktopUserIcon}>
                {user ? (
                  <>
                    <button className={styles.iconBtn} aria-label="User" onClick={handleAuth} title="User Menu">
                      <User size={22} strokeWidth={1.5} />
                    </button>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.userMenu}
                      >
                        <Link to="/dashboard" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                          Profile
                        </Link>
                        <button className={styles.userMenuItem} onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <button className={styles.iconBtn} aria-label="Login" onClick={handleAuth} title="Login">
                    <User size={22} strokeWidth={1.5} />
                  </button>
                )}
            </div>

          <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* User Login/Logout in Mobile Menu */}
            <div className={styles.mobileAuthBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={24} />
                <span>{user ? user.name || 'User' : 'Guest'}</span>
              </div>
              
              {!user ? (
                <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                  Login
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} style={{ background: 'var(--color-text-primary)', color: 'white' }}>
                    Profile
                  </button>
                  <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }} style={{ background: 'var(--color-error)', color: 'white' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>

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
