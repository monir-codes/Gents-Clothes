import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Truck, RefreshCw, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import styles from './Home.module.css';

// Function to find and filter the lowest price / budget-friendly products
const getMostAffordableProducts = (productList, limit = 4) => {
  if (!Array.isArray(productList) || productList.length === 0) return [];
  return [...productList]
    .filter(p => p && typeof p.price === 'number' && p.price > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
};

const Home = () => {
  const [settings, setSettings] = useState({
    heroVideo: null,
    heroSlideshow: [],
    heroTitle: 'রঙবতী',
    heroSubtitle: 'Redefining Luxury Fashion in Bangladesh',
    announcementText: '',
    announcementList: [],
    featuredCategories: [],
    featuredCollections: [],
    limitedEdition: null,
    shopTheLook: null,
    premiumCollection: null,
    features: [],
    brandStory: null,
    reviews: [],
    instagramImages: [],
    newsletter: null,
    marqueeText: [],
    whatsappNumber: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ loading: false, message: '', error: false });

  useEffect(() => {
    const fetchSettingsAndProducts = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          axios.get('/api/settings'),
          axios.get('/api/products')
        ]);
        
        let settingsData = settingsRes.data || {};
        const ensureArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);
        
        settingsData.heroSlideshow = ensureArray(settingsData.heroSlideshow);
        settingsData.marqueeText = ensureArray(settingsData.marqueeText);
        settingsData.featuredCategories = ensureArray(settingsData.featuredCategories);
        settingsData.featuredCollections = ensureArray(settingsData.featuredCollections);
        settingsData.features = ensureArray(settingsData.features);
        settingsData.reviews = ensureArray(settingsData.reviews);
        
        setSettings(settingsData);

        const prodData = productsRes.data.products ?? productsRes.data;
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsAndProducts();
  }, []);

  // Compute lowest priced products dynamically
  const affordableProducts = useMemo(() => {
    return getMostAffordableProducts(products, 4);
  }, [products]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setNewsletterStatus({ loading: true, message: '', error: false });
    try {
      const { data } = await axios.post('/api/settings/newsletter/subscribe', { email: newsletterEmail.trim() });
      setNewsletterStatus({ 
        loading: false, 
        message: data.message || 'ধন্যবাদ! আপনি সফলভাবে রঙবতী নিউজলেটারে যুক্ত হয়েছেন।', 
        error: false 
      });
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus({
        loading: false,
        message: error.response?.data?.message || 'সাবস্ক্রাইব করতে ব্যর্থ হয়েছে।',
        error: true
      });
    }
  };

  if (loading) return <Loader fullScreen />;

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "name": "রঙবতী | Ronggoboti",
      "alternateName": ["Ronggoboti", "রঙবতী", "Rongoboti", "Ronggoboti Fashion", "Ronggoboti BD"],
      "url": "https://ronggoboti.vercel.app",
      "logo": "https://ronggoboti.vercel.app/images/ronggoboti-logo.png",
      "image": "https://ronggoboti.vercel.app/images/hero-banner.jpg",
      "description": "রঙবতী (Ronggoboti) - বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম ওমেন ফ্যাশন ও লাইফস্টাইল ব্র্যান্ড। শাড়ি, সালোয়ার কামিজ, কুর্তি ও লেহেঙ্গার সেরা অনলাইন শপ।",
      "priceRange": "৳৳",
      "currenciesAccepted": "BDT",
      "paymentAccepted": "Cash on Delivery, bKash, Nagad, Card",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressCountry": "BD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://ronggoboti.vercel.app",
      "name": "রঙবতী | Ronggoboti",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ronggoboti.vercel.app/shop?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>
      <SEO 
        title="রঙবতী | Ronggoboti - Exclusive Women's Fashion & Designer Clothing BD" 
        description="রঙবতী (Ronggoboti) - বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম ওমেন ফ্যাশন ব্র্যান্ড। এক্সক্লুসিভ শাড়ি (Sarees), সালোয়ার কামিজ (Salwar Kameez), ডিজাইনার কুর্তি (Kurtis), লেহেঙ্গা ও মডেস্ট ওয়েয়ার অনলাইন কিনুন সেরা দামে। Fast delivery across Bangladesh." 
        canonical="https://ronggoboti.vercel.app"
        schemaMarkup={homeSchema}
      />

      {/* Fixed Hero Section (No parallax scroll displacement) */}
      <section className={styles.hero}>
        {settings.heroVideo ? (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className={styles.heroVideo}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          >
            <source src={settings.heroVideo} type="video/mp4" />
          </video>
        ) : settings.heroSlideshow && settings.heroSlideshow.length > 0 ? (
          settings.heroSlideshow.length > 1 ? (
            <div className={styles.heroBackgroundWrapper}>
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                speed={1500}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                allowTouchMove={false}
                style={{ width: '100%', height: '100%' }}
              >
                {settings.heroSlideshow.map((imgUrl, idx) => (
                  <SwiperSlide key={idx}>
                    <div 
                      className={styles.heroBackground} 
                      style={{ backgroundImage: `url(${imgUrl})` }} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div 
              className={styles.heroBackgroundStatic} 
              style={{ backgroundImage: `url(${settings.heroSlideshow[0]})` }} 
            />
          )
        ) : (
          <div 
            className={styles.heroBackgroundStatic} 
            style={{ backgroundImage: `url(${settings.heroImage || '/images/ronggoboti-banner.png'})` }} 
          />
        )}
        
        {/* Hero Call to Action Buttons */}
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className={styles.ctaContainer}>
              <Link to="/shop">
                <button className={styles.btnPrimary}>Shop Now</button>
              </Link>
              <Link to="/collections">
                <button className={styles.btnOutline}>Explore Collections</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Banner */}
      {settings.marqueeText && settings.marqueeText.length > 0 && (
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeText}>
            {settings.marqueeText.map((text, i) => <span key={i}>{text}</span>)}
            {settings.marqueeText.map((text, i) => <span key={`dup-${i}`}>{text}</span>)}
          </div>
        </div>
      )}

      {/* Featured Categories */}
      {settings.featuredCategories && settings.featuredCategories.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            Featured Categories
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              navigation
            >
              {settings.featuredCategories.map((cat, i) => (
                <SwiperSlide key={i}>
                  <CategoryCard title={cat.title} image={cat.image} link={cat.link} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section>
      )}

      {/* New Arrivals Grid */}
      <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className={styles.sectionHeader}
        >
          <div className={styles.sectionHeaderTitleGroup}>
            <h2 className={styles.sectionTitleLeft}>New Arrivals</h2>
            <p className={styles.sectionSubtitle}>
              Freshly handcrafted additions to our signature collections.
            </p>
          </div>
          <Link to="/new-arrival" className={styles.viewAllLink}>
            View All &rarr;
          </Link>
        </motion.div>
        <div className={styles.productGrid}>
          {products.slice(0, 8).map((p, i) => (
            <motion.div 
              key={p._id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.4 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Collections / Curated Showcase */}
      {settings.featuredCollections && settings.featuredCollections.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            Curated Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Swiper
              modules={[Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 }
              }}
              pagination={{ clickable: true }}
              style={{ paddingBottom: '40px' }}
            >
              {settings.featuredCollections.map((col, i) => (
                <SwiperSlide key={i}>
                  <div className={styles.collectionItem}>
                    <img src={col.image} alt={col.title} />
                    <div className={styles.collectionContent}>
                      <h3>{col.title}</h3>
                      <Link to={col.link || '/shop'} style={{ color: '#fff', textDecoration: 'underline' }}>Shop Now</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section>
      )}

      {/* Shop the Look / Editorial Spotlight */}
      {settings.shopTheLook && settings.shopTheLook.image && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <div className={styles.shopTheLook}>
            <motion.div 
              className={styles.lookImage}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={settings.shopTheLook.image} alt={settings.shopTheLook.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className={styles.lookTitle}>{settings.shopTheLook.title}</h3>
              <p className={styles.lookSubtitle}>
                {settings.shopTheLook.subtitle}
              </p>
              <div className={styles.productGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                {products.slice(0, 2).map((p, i) => (
                  <motion.div 
                    key={p._id+'stl'}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Pocket Friendly / Best Value Deals Section (Lowest Price Products) */}
      {affordableProducts && affordableProducts.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={styles.sectionHeader}
          >
            <div className={styles.sectionHeaderTitleGroup}>
              <h2 className={styles.sectionTitleLeft}>Pocket Friendly Finds</h2>
              <p className={styles.sectionSubtitle}>
                Explore our best-loved luxury styles at our most affordable prices.
              </p>
            </div>
            <Link to="/shop" className={styles.viewAllLink}>
              View All Deals &rarr;
            </Link>
          </motion.div>
          <div className={styles.productGrid}>
            {affordableProducts.map((p, i) => (
              <motion.div 
                key={p._id + '-budget'} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.4 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <motion.section 
        className={styles.newsletterSection}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <h2 className={styles.newsletterTitle}>
            {settings.newsletter?.title || 'Join the রঙবতী Inner Circle'}
          </h2>
          <p className={styles.newsletterSubtitle}>
            {settings.newsletter?.subtitle || 'Subscribe to receive priority access to new saree collections, luxury pret launches, and private offers.'}
          </p>
          <form className={styles.newsletterInputGroup} onSubmit={handleNewsletterSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={newsletterStatus.loading}
              required 
            />
            <button type="submit" disabled={newsletterStatus.loading}>
              {newsletterStatus.loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {newsletterStatus.message && (
            <p style={{ 
              marginTop: '12px', 
              color: newsletterStatus.error ? '#fca5a5' : '#86efac', 
              fontWeight: 500,
              fontSize: '0.95rem'
            }}>
              {newsletterStatus.message}
            </p>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
