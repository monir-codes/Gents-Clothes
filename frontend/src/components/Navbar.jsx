import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, User, Menu, X, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';
import LanguageToggle from './LanguageToggle';
import SearchModal from './SearchModal';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [announcements, setAnnouncements] = useState(['FREE SHIPPING ON ORDERS OVER ৳5000 | PREMIUM SUMMER COLLECTION 2026']);
  const { cartItems, toggleCart } = useCartStore();
  const { wishlistItems } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isBn = language === 'bn';

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
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.announcementBar}>
          {(() => {
            const getLocalizedAnnouncement = (text) => {
              if (!isBn) return text;
              if (text.includes('FREE SHIPPING') || text.includes('5000')) {
                return '৳ ৫০০০ টাকার অর্ডারে সারা বাংলাদেশে ফ্রি ডেলিভারি | প্রিমিয়াম সামার কালেকশন ২০২৬';
              }
              if (text.includes('PREMIUM SUMMER COLLECTION')) {
                return 'প্রিমিয়াম সামার কালেকশন ২০২৬ - এক্সক্লুসিভ উইমেন ফ্যাশন';
              }
              return text;
            };

            if (announcements.length > 1) {
              return (
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  loop={true}
                  allowTouchMove={false}
                  speed={800}
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
                >
                  {announcements.map((text, idx) => (
                    <SwiperSlide key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {getLocalizedAnnouncement(text)}
                    </SwiperSlide>
                  ))}
                </Swiper>
              );
            }
            return getLocalizedAnnouncement(announcements[0] || '');
          })()}
        </div>
        
        <div className={`container ${styles.navContainer}`}>
          <Link to="/" className={styles.logoLink} aria-label="রঙবতী Home">
            <img 
              src="/images/ronggoboti-logo.png" 
              alt="রঙবতী" 
              className={styles.logoImg}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'inline-block';
                }
              }}
            />
            <span className={styles.logoText} style={{ display: 'none' }}>রঙবতী</span>
          </Link>
          
          <nav className={styles.navLinks}>
            <Link to="/shop" className={styles.navLink}>{t('nav.shop', 'Shop')}</Link>
            <Link to="/collections" className={styles.navLink}>{t('nav.collections', 'Collections')}</Link>
            <Link to="/new-arrival" className={styles.navLink}>{t('nav.newArrivals', 'New Arrival')}</Link>
            <Link to="/sale" className={styles.navLink}>{t('nav.sale', 'Sale')}</Link>
            <Link to="/about" className={styles.navLink}>{t('nav.about', 'About')}</Link>
          </nav>
          
          <div className={styles.navIcons}>
            {/* Search Trigger */}
            <button 
              className={styles.iconBtn} 
              aria-label={isBn ? "অনুসন্ধান" : "Search"}
              data-tooltip={isBn ? "সার্চ" : "Search"}
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={21} strokeWidth={1.75} />
            </button>

            {/* Language Toggle (World / Globe icon) */}
            <div className={styles.navLangWrapper}>
              <LanguageToggle variant="icon" />
            </div>

            {/* Wishlist Link */}
            <Link 
              to="/wishlist" 
              className={styles.iconBtn} 
              aria-label={t('nav.wishlist', 'Wishlist')}
              data-tooltip={isBn ? "উইশলিস্ট" : "Wishlist"}
            >
              <Heart size={21} strokeWidth={1.75} />
              {wishlistItems.length > 0 && (
                <span className={styles.badge}>{wishlistItems.length}</span>
              )}
            </Link>
            
            {/* Cart Trigger */}
            <button 
              className={styles.iconBtn} 
              aria-label={t('nav.cart', 'Cart')} 
              onClick={toggleCart} 
              data-tooltip={isBn ? "কার্ট" : "Cart"}
            >
              <ShoppingBag size={21} strokeWidth={1.75} />
              {cartItems.length > 0 && (
                <span className={styles.badge}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
              )}
            </button>

            {/* User Icon visible only on Desktop */}
            <div className={styles.desktopUserIcon}>
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button 
                    className={styles.iconBtn} 
                    aria-label={t('nav.profile', 'User')} 
                    onClick={handleAuth} 
                    data-tooltip={!isUserMenuOpen ? (isBn ? "প্রোফাইল" : "Profile") : undefined}
                  >
                    <User size={21} strokeWidth={1.75} />
                  </button>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={styles.userMenu}
                    >
                      <Link to="/dashboard" className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.profile', 'Profile')}
                      </Link>
                      <button className={styles.userMenuItem} onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}>
                        {t('nav.logout', 'Logout')}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button 
                  className={styles.iconBtn} 
                  aria-label={t('nav.login', 'Login')} 
                  onClick={handleAuth} 
                  data-tooltip={isBn ? "লগইন" : "Login"}
                >
                  <User size={21} strokeWidth={1.75} />
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button 
              className={styles.mobileMenuBtn} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
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
                  <span>{user ? user.name || t('nav.welcome', 'User') : t('nav.guest', 'Guest')}</span>
                </div>
                
                {!user ? (
                  <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                    {t('nav.login', 'Login')}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} style={{ background: 'var(--color-text-primary)', color: 'white' }}>
                      {t('nav.profile', 'Profile')}
                    </button>
                    <button className={styles.mobileAuthBtn} onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }} style={{ background: 'var(--color-error)', color: 'white' }}>
                      {t('nav.logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Language Switcher Box */}
              <div style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  Language / ভাষা পরিবর্তন:
                </div>
                <LanguageToggle isFullWidth={true} />
              </div>

              <Link to="/shop" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.shop', 'Shop')}</Link>
              <Link to="/collections" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.collections', 'Collections')}</Link>
              <Link to="/new-arrival" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.newArrivals', 'New Arrival')}</Link>
              <Link to="/sale" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.sale', 'Sale')}</Link>
              <Link to="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about', 'About')}</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;


