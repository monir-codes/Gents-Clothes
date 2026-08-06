import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Truck, RefreshCw } from 'lucide-react';
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
import StyleQuizModal from '../components/StyleQuizModal';
import FlashSaleBanner from '../components/FlashSaleBanner';
import Lookbook from '../components/Lookbook';
import FAQSection from '../components/FAQSection';
import OurProcess from '../components/OurProcess';
import PressMentions from '../components/PressMentions';
import styles from './Home.module.css';

const Home = () => {
  const [settings, setSettings] = useState({
    heroVideo: null,
    heroSlideshow: [],
    heroTitle: 'ELEVATE YOUR STYLE',
    heroSubtitle: 'Premium Men\'s Fashion',
    announcementText: '',
    announcementList: [],
    featuredCategories: [],
    featuredCollections: [],
    limitedEdition: null,
    shopTheLook: [],
    premiumCollection: null,
    features: [],
    brandStory: null,
    featuredVideoSection: null,
    reviews: [],
    instagramImages: [],
    newsletter: null,
    marqueeText: '',
    whatsappNumber: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
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

  if (loading) return <Loader fullScreen />;

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
        ) : settings.heroSlideshow && settings.heroSlideshow.length > 0 ? (
          settings.heroSlideshow.length > 1 ? (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}>
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                speed={1500}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                allowTouchMove={false}
                style={{ width: '100%', height: '100%' }}
              >
                {settings.heroSlideshow.map((imgUrl, idx) => (
                  <SwiperSlide key={idx}>
                    <motion.div 
                      className={styles.heroBackground} 
                      style={{ 
                        backgroundImage: `url(${imgUrl})`,
                        y: y1,
                        width: '100%',
                        height: '100%'
                      }} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <motion.div 
              className={styles.heroBackground} 
              style={{ 
                backgroundImage: `url(${settings.heroSlideshow[0]})`,
                y: y1 
              }} 
            />
          )
        ) : (
          <motion.div 
            className={styles.heroBackground} 
            style={{ 
              backgroundImage: `url(${settings.heroImage || '/images/hero-banner.jpg'})`,
              y: y1 
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

      <StyleQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      {/* AI Style Quiz Banner */}
      <section className={styles.quizBanner}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--space-4) 0' }}>
          <motion.div 
            className={styles.quizBannerContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              background: 'var(--color-surface)', 
              padding: 'var(--space-4) var(--space-6)', 
              borderRadius: 'var(--radius-full)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-4)',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
            onClick={() => setIsQuizOpen(true)}
            whileHover={{ scale: 1.02 }}
          >
            <div style={{ background: 'var(--color-accent)', padding: '10px', borderRadius: '50%', color: '#fff', display: 'flex' }}>
              <Shield size={24} /> {/* Placeholder icon, could use Sparkles */}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Not sure what to buy?</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Take our AI Style Quiz to find your perfect match.</p>
            </div>
            <button className={styles.btnPrimary} style={{ padding: '8px 20px', marginLeft: 'auto' }}>Take Quiz</button>
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

      {/* Flash Sale Banner */}
      <FlashSaleBanner />

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
      <motion.section 
        className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>New Arrivals</h2>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map((p, i) => (
            <motion.div 
              key={p._id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Collections */}
      {settings.featuredCollections && settings.featuredCollections.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Featured Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
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
        <motion.section 
          className={styles.banner}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={settings.limitedEdition.image} alt={settings.limitedEdition.title} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
          <motion.div 
            className={styles.bannerContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2>{settings.limitedEdition.title}</h2>
            <p style={{ marginBottom: 'var(--space-4)', fontSize: '1.2rem' }}>{settings.limitedEdition.subtitle}</p>
            <Link to={settings.limitedEdition.link}>
              <button className={styles.btnPrimary}>Discover Now</button>
            </Link>
          </motion.div>
        </motion.section>
      )}

      {/* Shop the Look */}
      {settings.shopTheLook && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Shop the Look
          </motion.h2>
          <div className={styles.shopTheLook}>
            <motion.div 
              className={styles.lookImage}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={settings.shopTheLook.image} alt={settings.shopTheLook.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>{settings.shopTheLook.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                {settings.shopTheLook.subtitle}
              </p>
              <div className={styles.productGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
                {products.slice(0, 2).map((p, i) => (
                  <motion.div 
                    key={p._id+'stl'}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Interactive Lookbook */}
      <Lookbook />

      {/* Premium Collection Banner */}
      {settings.premiumCollection && (
        <motion.section 
          className={styles.banner} style={{ height: '40vh', marginTop: 'var(--space-8)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={settings.premiumCollection.image} alt={settings.premiumCollection.title} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2 }} />
          <motion.div 
            className={styles.bannerContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2>{settings.premiumCollection.title}</h2>
            <Link to={settings.premiumCollection.link}>
              <button className={styles.btnOutline}>View Collection</button>
            </Link>
          </motion.div>
        </motion.section>
      )}

      {/* Trending Products */}
      <motion.section 
        className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>Trending Now</h2>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map((p, i) => (
            <motion.div 
              key={p._id+'tp'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>


      {/* Why Choose Us */}
      {settings.features && settings.features.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <div className={styles.featuresGrid}>
            {settings.features.map((feature, i) => (
              <motion.div 
                key={i} 
                className={styles.featureItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {feature.icon === 'Truck' && <Truck size={40} className={styles.featureIcon} />}
                {feature.icon === 'Shield' && <Shield size={40} className={styles.featureIcon} />}
                {feature.icon === 'RefreshCw' && <RefreshCw size={40} className={styles.featureIcon} />}
                {!['Truck', 'Shield', 'RefreshCw'].includes(feature.icon) && <Shield size={40} className={styles.featureIcon} />}
                <h3 style={{ marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{feature.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Story */}
      {settings.brandStory && (
        <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
          <div className={styles.storySection}>
            <motion.div 
              className={styles.storyContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>{settings.brandStory.title}</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                {settings.brandStory.text}
              </p>
              <Link to="/about">
                <button className={styles.btnPrimary} style={{ background: 'var(--color-text-primary)', color: 'var(--color-background)' }}>Read Our Story</button>
              </Link>
            </motion.div>
            <motion.div 
              className={styles.storyImage}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={settings.brandStory.image} alt={settings.brandStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* Our Process */}
      <OurProcess />

      {/* Featured Video */}
      {settings.featuredVideoSection && (
        <motion.section 
          className={styles.banner} style={{ height: '70vh' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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
          ) : settings.featuredVideoSection.slideshow && settings.featuredVideoSection.slideshow.length > 0 ? (
            settings.featuredVideoSection.slideshow.length > 1 ? (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  speed={2000}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  allowTouchMove={false}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                >
                  {settings.featuredVideoSection.slideshow.map((imgUrl, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={imgUrl} alt={`Slideshow ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img src={settings.featuredVideoSection.slideshow[0]} alt="Video fallback" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
            )
          ) : (
            <img src={settings.featuredVideoSection.fallbackImage} alt="Video fallback" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', zIndex: 2 }} />
          <motion.div 
            className={styles.bannerContent}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2>{settings.featuredVideoSection.title}</h2>
            <p>{settings.featuredVideoSection.subtitle}</p>
          </motion.div>
        </motion.section>
      )}


      {/* Customer Reviews */}
      {settings.reviews && settings.reviews.length > 0 && (
        <section className="container" style={{ padding: 'var(--space-8) 0' }}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Customers Say
          </motion.h2>
          <div className={styles.reviewsGrid}>
            {settings.reviews.map((review, i) => (
              <motion.div 
                key={i} 
                className={styles.reviewCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
              >
                <div className={styles.reviewStars}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
                <h4 style={{ fontWeight: 600 }}>- {review.author}</h4>
              </motion.div>
            ))}
          </div>
        </section>
      )}



      {/* FAQ Section */}
      <FAQSection />

      {/* Press Mentions */}
      <PressMentions />


      {/* Newsletter */}
      {settings.newsletter && (
        <motion.section 
          className={styles.newsletterSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{settings.newsletter.title}</h2>
            <p style={{ marginBottom: 'var(--space-6)', color: 'rgba(255,255,255,0.8)' }}>{settings.newsletter.subtitle}</p>
            <form className={styles.newsletterInputGroup} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;
