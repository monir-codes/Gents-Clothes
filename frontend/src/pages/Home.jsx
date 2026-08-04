import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Truck, RefreshCw } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import Loader from '../components/Loader';
import styles from './Home.module.css';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect

  useEffect(() => {
    const fetchSettingsAndProducts = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          axios.get('/api/settings'),
          axios.get('/api/products')
        ]);
        setSettings(settingsRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettingsAndProducts();
  }, []);

  if (loading || !settings) return <Loader fullScreen />;

  return (
    <div style={{ overflowX: 'hidden' }}>
      <SEO 
        title="Home" 
        description="GentFits - Redefining luxury men's fashion in Bangladesh. Shop premium Panjabis, Shirts, and T-Shirts." 
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        {settings.heroVideo ? (
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
              backgroundImage: `url(${settings.heroImage || '/images/hero-banner.jpg'})`,
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
            <h1 className={styles.heroTitle}>{settings.heroTitle}</h1>
            <p className={styles.heroSubtitle}>
              {settings.heroSubtitle}
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
      {settings.marqueeText && settings.marqueeText.length > 0 && (
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeText}>
            {settings.marqueeText.map((text, i) => <span key={i}>{text}</span>)}
            {/* Duplicate for infinite loop illusion */}
            {settings.marqueeText.map((text, i) => <span key={`dup-${i}`}>{text}</span>)}
          </div>
        </div>
      )}

      {/* Featured Categories */}
      {settings.featuredCategories && settings.featuredCategories.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Featured Categories
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
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
              autoplay={{ delay: 3000, disableOnInteraction: false }}
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

      {/* New Arrivals */}
      <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Featured Collections */}
      {settings.featuredCollections && settings.featuredCollections.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <h2 className={styles.sectionTitle}>Featured Collections</h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
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
                      <Link to={col.link} style={{ color: '#fff', textDecoration: 'underline' }}>Shop Now</Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </section>
      )}



      {/* Limited Edition Banner */}
      {settings.limitedEdition && (
        <section className={styles.banner}>
          <img src={settings.limitedEdition.image} alt={settings.limitedEdition.title} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
          <div className={styles.bannerContent}>
            <h2>{settings.limitedEdition.title}</h2>
            <p style={{ marginBottom: 'var(--space-4)', fontSize: '1.2rem' }}>{settings.limitedEdition.subtitle}</p>
            <Link to={settings.limitedEdition.link}>
              <button className={styles.btnPrimary}>Discover Now</button>
            </Link>
          </div>
        </section>
      )}

      {/* Shop the Look */}
      {settings.shopTheLook && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <h2 className={styles.sectionTitle}>Shop the Look</h2>
          <div className={styles.shopTheLook}>
            <div className={styles.lookImage}>
              <img src={settings.shopTheLook.image} alt={settings.shopTheLook.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>{settings.shopTheLook.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                {settings.shopTheLook.subtitle}
              </p>
              <div className={styles.productGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                {products.slice(0, 2).map(p => <ProductCard key={p._id+'stl'} product={p} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Premium Collection Banner */}
      {settings.premiumCollection && (
        <section className={styles.banner} style={{ height: '40vh', marginTop: 'var(--space-8)' }}>
          <img src={settings.premiumCollection.image} alt={settings.premiumCollection.title} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2 }} />
          <div className={styles.bannerContent}>
            <h2>{settings.premiumCollection.title}</h2>
            <Link to={settings.premiumCollection.link}>
              <button className={styles.btnOutline}>View Collection</button>
            </Link>
          </div>
        </section>
      )}

      {/* Trending Products */}
      <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map(p => <ProductCard key={p._id+'tp'} product={p} />)}
        </div>
      </section>

      {/* Why Choose Us */}
      {settings.features && settings.features.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <div className={styles.featuresGrid}>
            {settings.features.map((feature, i) => (
              <div key={i} className={styles.featureItem}>
                {feature.icon === 'Truck' && <Truck size={40} className={styles.featureIcon} />}
                {feature.icon === 'Shield' && <Shield size={40} className={styles.featureIcon} />}
                {feature.icon === 'RefreshCw' && <RefreshCw size={40} className={styles.featureIcon} />}
                {!['Truck', 'Shield', 'RefreshCw'].includes(feature.icon) && <Shield size={40} className={styles.featureIcon} />}
                <h3 style={{ marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Story */}
      {settings.brandStory && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <div className={styles.storySection}>
            <div className={styles.storyContent}>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>{settings.brandStory.title}</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                {settings.brandStory.text}
              </p>
              <Link to="/about">
                <button className={styles.btnPrimary} style={{ background: 'var(--color-text-primary)', color: 'var(--color-background)' }}>Read Our Story</button>
              </Link>
            </div>
            <div className={styles.storyImage}>
              <img src={settings.brandStory.image} alt={settings.brandStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </section>
      )}

      {/* Featured Video */}
      {settings.featuredVideoSection && (
        <section className={styles.banner} style={{ height: '70vh' }}>
          {settings.featuredVideoSection.videoUrl ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            >
              <source src={settings.featuredVideoSection.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img src={settings.featuredVideoSection.fallbackImage} alt="Video fallback" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 2 }} />
          <div className={styles.bannerContent}>
            <h2>{settings.featuredVideoSection.title}</h2>
            <p>{settings.featuredVideoSection.subtitle}</p>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {settings.reviews && settings.reviews.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) 0' }}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <div className={styles.reviewsGrid}>
            {settings.reviews.map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.reviewStars}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
                <h4 style={{ fontWeight: 600 }}>- {review.author}</h4>
              </div>
            ))}
          </div>
        </section>
      )}



      {/* Newsletter */}
      {settings.newsletter && (
        <section className={styles.newsletterSection}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{settings.newsletter.title}</h2>
            <p style={{ marginBottom: 'var(--space-6)', color: 'rgba(255,255,255,0.8)' }}>{settings.newsletter.subtitle}</p>
            <form className={styles.newsletterInputGroup} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
