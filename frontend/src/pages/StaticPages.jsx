import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Feather, ShieldCheck, ArrowRight, ChevronDown, Search, HelpCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';
import useLanguageStore from '../store/useLanguageStore';

const StaticPageTemplate = ({ title, titleBn, subtitle, subtitleBn, children, contentKey, schemaMarkup }) => {
  const [settings, setSettings] = useState(null);
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const displayTitle = isBn ? (titleBn || title) : title;
  const displaySubtitle = isBn ? (subtitleBn || subtitle) : subtitle;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '80vh', paddingBottom: '80px' }}>
      <SEO 
        title={displayTitle} 
        description={displaySubtitle || `${displayTitle} - রঙবতী (Ronggoboti) Women's Fashion & Lifestyle in Bangladesh.`} 
        schemaMarkup={schemaMarkup}
      />
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(180deg, var(--color-surface, #faf6f1) 0%, var(--color-background, #ffffff) 100%)',
        padding: '60px 20px 40px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border, #ebdcd0)'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent, #c9a265)', marginBottom: '12px' }}>
            <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>{isBn ? 'হোম' : 'Home'}</Link> / {displayTitle}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            fontWeight: 700, 
            color: 'var(--color-brand-maroon, #5e0f2b)', 
            marginBottom: displaySubtitle ? '12px' : '0' 
          }}>
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: 0 }}>
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="container" style={{ maxWidth: '860px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
          border: '1px solid var(--color-border, #ebdcd0)',
          lineHeight: 1.85,
          color: 'var(--color-text-secondary, #6c5a60)',
          fontSize: '1.05rem'
        }}>
          {contentKey && settings?.staticPages?.[contentKey] ? (
            <div dangerouslySetInnerHTML={{ __html: settings.staticPages[contentKey] }} />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export const About = () => {
  const [settings, setSettings] = useState(null);
  const { t, language } = useLanguageStore();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div style={{ background: 'var(--color-background)', overflowX: 'hidden' }}>
      <SEO 
        title={isBn ? "আমাদের সম্পর্কে | রঙবতী" : "About Us | Our Story"} 
        description={isBn ? "রঙবতী (Ronggoboti) — ঐতিহ্য ও আধুনিক নারীর আভিজাত্যের মেলবন্ধন। আমাদের ইতিহাস, কারুশিল্প ও দর্শন সম্পর্কে জানুন।" : "Discover the heritage, artistry, and philosophy behind রঙবতী (Ronggoboti) — Bangladesh's premier luxury women's fashion house."} 
      />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, var(--color-surface, #faf6f1) 0%, var(--color-background, #ffffff) 100%)',
        padding: '70px 20px 50px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border, #ebdcd0)'
      }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ 
              display: 'inline-block',
              fontSize: '0.85rem', 
              fontWeight: 600,
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              color: 'var(--color-accent, #c9a265)', 
              marginBottom: '16px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(201, 162, 101, 0.12)'
            }}>
              {t('about.tagline', 'The Art of Elegance')}
            </span>
            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', 
              fontWeight: 700, 
              color: 'var(--color-brand-maroon, #5e0f2b)', 
              lineHeight: 1.25,
              marginBottom: '20px',
              fontFamily: 'var(--font-family-primary)'
            }}>
              {t('about.title', 'Crafting Timeless Grace for Every Woman')}
            </h1>
            <p style={{ 
              color: 'var(--color-text-secondary, #6c5a60)', 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
              maxWidth: '740px', 
              margin: '0 auto 28px', 
              lineHeight: 1.8 
            }}>
              {isBn ? (settings?.staticPages?.about?.storyTextBn || t('about.story')) : (settings?.staticPages?.about?.storyText || t('about.story'))}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Split Section */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '50px', 
          alignItems: 'center' 
        }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', 
              color: 'var(--color-brand-maroon, #5e0f2b)', 
              fontWeight: 700, 
              marginBottom: '20px' 
            }}>
              {t('about.heritageTitle', 'A Legacy of Fine Artistry')}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '20px' }}>
              {t('about.heritageText')}
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '30px' }}>
              {isBn ? (settings?.staticPages?.about?.materialsTextBn || t('about.materialsText')) : (settings?.staticPages?.about?.materialsText || t('about.materialsText'))}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-surface, #faf6f1)', 
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--color-border, #ebdcd0)' 
              }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-brand-maroon)', margin: '0 0 4px' }}>
                  {isBn ? '১০০%' : '100%'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  {t('about.authenticStat', 'Authentic Fabrics')}
                </p>
              </div>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-surface, #faf6f1)', 
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--color-border, #ebdcd0)' 
              }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-brand-maroon)', margin: '0 0 4px' }}>
                  {isBn ? '১০,০০০+' : '10K+'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  {t('about.happyClientsStat', 'Delighted Muses')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: 'var(--radius-lg, 16px)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(94, 15, 43, 0.12)',
              border: '1px solid var(--color-border, #ebdcd0)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" 
                alt="রঙবতী Heritage Craftsmanship" 
                style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values & Pillars */}
      <section style={{ 
        background: 'var(--color-surface, #faf6f1)', 
        padding: '80px 20px',
        borderTop: '1px solid var(--color-border, #ebdcd0)',
        borderBottom: '1px solid var(--color-border, #ebdcd0)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent, #c9a265)', fontWeight: 600 }}>
              {isBn ? 'মূল দর্শন' : 'Our Values'}
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', color: 'var(--color-brand-maroon, #5e0f2b)', marginTop: '8px', fontWeight: 700 }}>
              {t('about.valuesTitle', 'The Pillars of রঙবতী')}
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {[
              {
                icon: ShieldCheck,
                title: t('about.artisanTitle', 'Verified Sourcing'),
                desc: t('about.artisanDesc', 'We curate handpicked garments directly from verified trusted suppliers.')
              },
              {
                icon: RefreshCcw,
                title: t('about.modernGlamourTitle', 'Easy Doorstep Returns'),
                desc: t('about.modernGlamourDesc', 'Return easily upon delivery with standard delivery charge if not satisfied.')
              },
              {
                icon: Sparkles,
                title: t('about.uncompromisingQualityTitle', 'Strict Quality Control'),
                desc: t('about.uncompromisingQualityDesc', 'Multi-point inspection to ensure flaw-free premium fashion.')
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#ffffff',
                  padding: '40px 30px',
                  borderRadius: 'var(--radius-lg, 16px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  border: '1px solid var(--color-border, #ebdcd0)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(201, 162, 101, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-brand-maroon, #5e0f2b)',
                  marginBottom: '20px'
                }}>
                  <pillar.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-brand-maroon, #5e0f2b)', marginBottom: '12px' }}>
                  {pillar.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.98rem' }}>
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Gallery Grid */}
      <section className="container" style={{ padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--color-brand-maroon, #5e0f2b)', fontWeight: 700 }}>
            {isBn ? 'প্রতিটি সুতায় জড়ানো শিল্পকলা' : 'Every Thread Tells a Story'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            {isBn ? 'রঙবতীর নান্দনিক আভিজাত্য ও সমৃদ্ধ কারুকার্যের এক ঝলক।' : 'A glimpse into the elegance, fabrics, and craft behind রঙবতী.'}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {[
            { img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800', title: isBn ? 'রয়েল সিল্ক কালেকশন' : 'Royal Silk Weaves' },
            { img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800', title: isBn ? 'আধুনিক ফ্যাশন ডিজাইন' : 'Contemporary Silhouettes' },
            { img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', title: isBn ? 'উৎসবের এক্সক্লুসিভ সাজ' : 'Festive Allure' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              style={{
                borderRadius: 'var(--radius-lg, 16px)',
                overflow: 'hidden',
                height: '340px',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.06)'
              }}
            >
              <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(to top, rgba(34, 14, 20, 0.85) 0%, transparent 100%)',
                color: '#ffffff'
              }}>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>{item.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Footer Card */}
        <div style={{
          marginTop: '60px',
          padding: '50px 30px',
          borderRadius: 'var(--radius-lg, 16px)',
          background: 'linear-gradient(135deg, var(--color-brand-maroon, #5e0f2b) 0%, #2a0814 100%)',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 15px 40px rgba(94, 15, 43, 0.25)'
        }}>
          <h3 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '14px' }}>
            {t('about.ctaTitle', 'Experience the Magic of রঙবতী')}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
            {t('about.ctaDesc')}
          </p>
          <Link to="/shop">
            <button style={{
              padding: '14px 36px',
              background: '#ffffff',
              color: 'var(--color-brand-maroon, #5e0f2b)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-sm, 4px)',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {isBn ? 'সকল কালেকশন দেখুন' : 'Shop All Collections'} <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get('/api/faqs');
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
          setOpenId(data[0]?._id);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = isBn ? [
    { key: 'All', label: 'সকল' },
    { key: 'General', label: 'সাধারণ' },
    { key: 'Orders & Payment', label: 'অর্ডার ও পেমেন্ট' },
    { key: 'Delivery & Shipping', label: 'ডেলিভারি ও শিপিং' },
    { key: 'Fabric & Sizing', label: 'ফেব্রিক ও সাইজিং' },
    { key: 'Returns & Exchange', label: 'রিটার্ন ও এক্সচেঞ্জ' }
  ] : [
    { key: 'All', label: 'All' },
    { key: 'General', label: 'General' },
    { key: 'Orders & Payment', label: 'Orders & Payment' },
    { key: 'Delivery & Shipping', label: 'Delivery & Shipping' },
    { key: 'Fabric & Sizing', label: 'Fabric & Sizing' },
    { key: 'Returns & Exchange', label: 'Returns & Exchange' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'All' || (faq.category || 'General') === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const dynamicFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer.replace(/<[^>]+>/g, '')
      }
    }))
  };

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '85vh', paddingBottom: '80px' }}>
      <SEO 
        title={isBn ? "সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর (FAQ) | রঙবতী" : "Frequently Asked Questions (FAQ) | Ronggoboti"} 
        description={isBn ? "রঙবতী (Ronggoboti) থেকে শাড়ি, থ্রি পিস কেনাকাটা, ডেলিভারি সময়, পেমেন্ট পদ্ধতি ও রিটার্ন সম্পর্কিত প্রশ্নের উত্তর জেনে নিন।" : "Find answers to questions about ordering authentic Sarees, Salwar Kameez, Kurtis, shipping across Bangladesh, payment methods, returns, and fabric care at রঙবতী (Ronggoboti)."} 
        keywords="রঙবতী FAQ, Ronggoboti questions, online saree shopping bangladesh faq, cash on delivery questions, return policy ronggoboti, dress sizes bd, jamdani saree care"
        schemaMarkup={dynamicFaqSchema}
      />

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(180deg, var(--color-surface, #faf6f1) 0%, var(--color-background, #ffffff) 100%)',
        padding: '60px 20px 40px',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border, #ebdcd0)'
      }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent, #c9a265)', marginBottom: '12px' }}>
            <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>{isBn ? 'হোম' : 'Home'}</Link> / {isBn ? 'সাধারণ জিজ্ঞাসা' : 'FAQ'}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            fontWeight: 700, 
            color: 'var(--color-brand-maroon, #5e0f2b)', 
            marginBottom: '12px' 
          }}>
            {isBn ? 'সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: '0 auto 24px', maxWidth: '650px' }}>
            {isBn ? 'রঙবতী (Ronggoboti) থেকে কেনাকাটা, ডেলিভারি, পেমেন্ট ও ফেব্রিক সম্পর্কিত সাধারণ প্রশ্নগুলোর সহজ উত্তর জেনে নিন।' : 'Quick answers to common questions about ordering, nationwide shipping, payments, returns, and premium fabric care.'}
          </p>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            maxWidth: '540px',
            margin: '0 auto'
          }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input 
              type="text" 
              placeholder={isBn ? "প্রশ্ন বা বিষয় খুঁজুন (যেমন: ডেলিভারি, ক্যাশ অন ডেলিভারি, রিটার্ন)..." : "Search questions (e.g. delivery, payment, return, sizing)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '30px',
                border: '1.5px solid var(--color-border, #ebdcd0)',
                background: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main FAQ Content */}
      <div className="container" style={{ maxWidth: '920px', margin: '40px auto 0', padding: '0 20px' }}>
        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '36px'
        }}>
          {categories.map(cat => {
            const count = cat.key === 'All' ? faqs.length : faqs.filter(f => (f.category || 'General') === cat.key).length;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '24px',
                  border: isActive ? '1.5px solid var(--color-brand-maroon, #5e0f2b)' : '1px solid var(--color-border, #ebdcd0)',
                  background: isActive ? 'var(--color-brand-maroon, #5e0f2b)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--color-text-primary, #333333)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-surface, #faf6f1)',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)'
                }}>
                  {isBn ? String(count).replace(/[0-9]/g, d => ['০','১','২','৩','৪','৫','৬','৭','৮','৯'][Number(d)]) : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p>{isBn ? 'FAQ লোড হচ্ছে...' : 'Loading FAQs...'}</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg, 16px)',
            border: '1px solid var(--color-border, #ebdcd0)'
          }}>
            <HelpCircle size={44} style={{ color: 'var(--color-accent, #c9a265)', marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--color-brand-maroon)', fontSize: '1.2rem', marginBottom: '8px' }}>
              {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching questions found'}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {isBn ? 'অন্য কোনো কিওয়ার্ড দিয়ে খুঁজুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।' : 'Try adjusting your search terms or contact customer support.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id || idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md, 12px)',
                    border: isOpen ? '1.5px solid var(--color-accent, #c9a265)' : '1px solid var(--color-border, #ebdcd0)',
                    boxShadow: isOpen ? '0 6px 20px rgba(201, 162, 101, 0.12)' : '0 2px 10px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq._id)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'var(--color-brand-maroon, #5e0f2b)' : 'var(--color-surface, #faf6f1)',
                        color: isOpen ? '#ffffff' : 'var(--color-brand-maroon, #5e0f2b)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}>
                        Q
                      </span>
                      <span style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: isOpen ? 'var(--color-brand-maroon, #5e0f2b)' : 'var(--color-text-primary, #2d2424)',
                        lineHeight: 1.4
                      }}>
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease',
                        color: isOpen ? 'var(--color-accent, #c9a265)' : 'var(--color-text-secondary)',
                        flexShrink: 0
                      }}
                    />
                  </button>
                  
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        padding: '0 24px 22px 64px',
                        color: 'var(--color-text-secondary, #6c5a60)',
                        fontSize: '0.98rem',
                        lineHeight: 1.8,
                        borderTop: '1px solid rgba(0,0,0,0.04)'
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Need Help Support Banner */}
        <div style={{
          marginTop: '60px',
          padding: '36px 30px',
          borderRadius: 'var(--radius-lg, 16px)',
          background: 'linear-gradient(135deg, var(--color-surface, #faf6f1) 0%, #ffffff 100%)',
          border: '1px solid var(--color-border, #ebdcd0)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-brand-maroon, #5e0f2b)', margin: '0 0 6px' }}>
              {isBn ? 'আরও কোনো প্রশ্ন বা বিশেষ সাহায্য প্রয়োজন?' : 'Have more questions or need styling advice?'}
            </h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              {isBn ? 'আমাদের কাস্টমার কেয়ার টিম আপনাকে সার্বক্ষণিক সহায়তা করার জন্য প্রস্তুত।' : 'Our dedicated fashion consultants are ready to assist you anytime.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/contact">
              <button style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'var(--color-brand-maroon, #5e0f2b)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isBn ? 'যোগাযোগ করুন' : 'Contact Support'} <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Contact = () => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  return (
    <StaticPageTemplate 
      title="Contact Us"
      titleBn="যোগাযোগ করুন"
      subtitle="We would love to hear from you. Reach out to our customer care team anytime."
      subtitleBn="আপনার যেকোনো প্রশ্ন, পরামর্শ বা অর্ডারের সহায়তায় রঙবতী কাস্টমার কেয়ার সার্বক্ষণিক প্রস্তুত।"
      contentKey="contact"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', margin: '20px 0' }}>
        <div style={{ padding: '20px', background: 'var(--color-surface, #faf6f1)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <Phone size={24} color="var(--color-brand-maroon, #5e0f2b)" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--color-brand-maroon)' }}>{isBn ? 'হটলাইন / মোবাইল' : 'Direct Helpline'}</h4>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>+880 1700-000000</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--color-surface, #faf6f1)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <Mail size={24} color="var(--color-brand-maroon, #5e0f2b)" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--color-brand-maroon)' }}>{isBn ? 'ইমেইল সাপোর্ট' : 'Email Support'}</h4>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>support@ronggoboti.shop</p>
        </div>
        <div style={{ padding: '20px', background: 'var(--color-surface, #faf6f1)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <MapPin size={24} color="var(--color-brand-maroon, #5e0f2b)" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--color-brand-maroon)' }}>{isBn ? 'হেড অফিস' : 'Headquarters'}</h4>
          <p style={{ margin: 0, fontWeight: 500 }}>{isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}</p>
        </div>
      </div>
    </StaticPageTemplate>
  );
};

export const LegalPage = ({ title }) => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  let contentKey = '';
  let titleBn = '';
  let subtitle = 'Important terms, policies, and guidance regarding your shopping experience.';
  let subtitleBn = 'রঙবতী থেকে শপিং করার নিয়মাবলী, পলিসি ও দিকনির্দেশনা।';

  if (title === 'Shipping Policy') {
    contentKey = 'shipping';
    titleBn = 'ডেলিভারি ও শিপিং পলিসি';
  } else if (title === 'Return & Exchange Policy' || title === 'Return & Exchange') {
    contentKey = 'returns';
    titleBn = 'রিটার্ন ও এক্সচেঞ্জ পলিসি';
  } else if (title === 'Size Guide') {
    contentKey = 'sizeGuide';
    titleBn = 'সাইজ নির্দেশিকা (Size Guide)';
  } else if (title === 'Privacy Policy') {
    contentKey = 'privacy';
    titleBn = 'গোপনীয়তা নীতি (Privacy Policy)';
  } else if (title === 'Terms of Service') {
    contentKey = 'terms';
    titleBn = 'শর্তাবলী (Terms of Service)';
  }

  const renderDefaultContent = () => {
    if (contentKey === 'returns') {
      return isBn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(201, 162, 101, 0.1)',
            borderLeft: '4px solid var(--color-accent, #c9a265)',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', margin: '0 0 8px', fontSize: '1.2rem' }}>
              🛍️ ডেলিভারির সময় চেক ও তাত্ক্ষণিক রিটার্ন সুবিধা
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-primary)' }}>
              রঙবতী থেকে অর্ডার করার পর ডেলিভারিম্যানের সামনে পার্সেলটি খুলে দেখে নেওয়ার পূর্ণ সুবিধা রয়েছে। পণ্যে কোনো ত্রুটি বা সমস্যা থাকলে কিংবা পোশাকটি আপনার মনের মতো পছন্দ না হলে, <strong>ডেলিভারিম্যানকে শুধুমাত্র ডেলিভারি চার্জ পরিশোধ করে সাথে সাথে সম্পূর্ণ পার্সেলটি রিটার্ন করতে পারবেন</strong>।
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              ১. আমাদের সোর্সিং ও কোয়ালিটি নিশ্চয়তা
            </h3>
            <p style={{ lineHeight: 1.8 }}>
              রঙবতী কোনো নিজস্ব উৎপাদন কারখানা নয়। আমরা দেশের শীর্ষস্থানীয় ও বিশ্বস্ত ভেরিফাইড সাপ্লায়ার (Verified Suppliers) ও সেরা তাঁত হাবগুলো থেকে কোয়ালিটিফুল শাড়ি, থ্রি-পিস ও পোশাক নিবিড়ভাবে বাছাই ও কোয়ালিটি চেক করে রিসেলিং করে থাকি। গ্রাহকের কাছে পাঠানোর আগে প্রতিটি পোশাক আমাদের এক্সপার্ট টিম দ্বারা খুঁটিনাটি চেক করা হয়।
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              ২. রিটার্ন করার সহজ নিয়ম
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.9 }}>
              <li><strong>ডেলিভারি গ্রহণের সময়:</strong> ডেলিভারিম্যান থাকা অবস্থায় পোশাকটি দেখে নিন। পছন্দ না হলে বা কোনো সমস্যা থাকলে সাথে সাথে তাকে শুধু ডেলিভারি ফি দিয়ে পার্সেল ফেরত দিন।</li>
              <li><strong>ডেলিভারি পরবর্তী সমস্যা:</strong> ডেলিভারি গ্রহণের পর যদি কোনো বিশেষ ম্যানুফ্যাকচারিং ত্রুটি পরিলক্ষিত হয়, তবে ২৪ ঘণ্টার মধ্যে স্পষ্ট ছবি বা ভিডিওসহ আমাদের হটলাইন বা ফেসবুক পেজে জানান।</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              ৩. এক্সচেঞ্জ পলিসি (Size / Color Exchange)
            </h3>
            <p style={{ lineHeight: 1.8 }}>
              সাইজ বা কালার পরিবর্তন করতে চাইলে পণ্য গ্রহণের ৪৮ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করুন। পোশাকটি অব্যবহৃত, অবিকৃত এবং আসল ট্যাগযুক্ত থাকতে হবে। এক্সচেঞ্জের ক্ষেত্রে রিটার্ন ও নতুন ডেলিভারির স্ট্যান্ডার্ড চার্জ প্রযোজ্য হবে।
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(201, 162, 101, 0.1)',
            borderLeft: '4px solid var(--color-accent, #c9a265)',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', margin: '0 0 8px', fontSize: '1.2rem' }}>
              🛍️ Doorstep Inspection & Easy Return Guarantee
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-primary)' }}>
              You have the full right to inspect your parcel upon arrival in the presence of the delivery agent. If there is any defect or the item does not match your taste/expectation, <strong>you can return the parcel on the spot simply by paying the standard delivery charge</strong>.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              1. Curated Sourcing & Quality Assurance
            </h3>
            <p style={{ lineHeight: 1.8 }}>
              Ronggoboti is a curated fashion boutique. We do not manufacture garments directly; instead, we handpick, inspect, and curate authentic, top-grade fashion from verified suppliers and renowned textile hubs. Every garment undergoes strict quality inspection before dispatch.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              2. Simple Return Process
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.9 }}>
              <li><strong>At Delivery:</strong> Check your item upon receipt. If not satisfied, hand it back to the courier by paying only the delivery charge.</li>
              <li><strong>Post-Delivery Support:</strong> In case of any unnoticed defect, reach out to our customer care team within 24 hours with photos/videos.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ color: 'var(--color-brand-maroon, #5e0f2b)', fontSize: '1.25rem', marginBottom: '10px' }}>
              3. Exchange Policy
            </h3>
            <p style={{ lineHeight: 1.8 }}>
              Need a size or color swap? Contact our hotline within 48 hours of delivery. Items must be unworn, unwashed, and in original packaging with tags intact. Standard delivery fees apply for exchanges.
            </p>
          </div>
        </div>
      );
    }

    if (contentKey === 'shipping') {
      return isBn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.8 }}>
          <h3 style={{ color: 'var(--color-brand-maroon)' }}>ডেলিভারি চার্জ ও সময়সীমা</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>ঢাকা সিটির ভিতরে:</strong> ২-৩ কার্যদিবস (ডেলিভারি চার্জ ৳৭০)</li>
            <li><strong>সাব-ঢাকা (গাজীপুর, সাভার, নারায়ণগঞ্জ, কেরানীগঞ্জ):</strong> ২-৪ কার্যদিবস (ডেলিভারি চার্জ ৳১০০)</li>
            <li><strong>ঢাকার বাইরে (সারা বাংলাদেশ):</strong> ৩-৫ কার্যদিবস (ডেলিভারি চার্জ ৳১২০)</li>
          </ul>
          <p><strong>ফ্রি ডেলিভারি অফার:</strong> ৳৫,০০০ বা তার বেশি মূল্যের অর্ডারে সারা বাংলাদেশে ফ্রি ডেলিভারি প্রদান করা হয়।</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.8 }}>
          <h3 style={{ color: 'var(--color-brand-maroon)' }}>Shipping Charges & Delivery Timelines</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Inside Dhaka City:</strong> 2-3 business days (Fee: ৳70)</li>
            <li><strong>Sub-Dhaka (Gazipur, Savar, Narayanganj):</strong> 2-4 business days (Fee: ৳100)</li>
            <li><strong>Outside Dhaka (Nationwide):</strong> 3-5 business days (Fee: ৳120)</li>
          </ul>
          <p><strong>Free Delivery Offer:</strong> Enjoy Free Nationwide Delivery on orders exceeding ৳5,000.</p>
        </div>
      );
    }

    return <p>{isBn ? 'পলিসির বিস্তারিত তথ্য লোড হচ্ছে...' : 'Loading document details...'}</p>;
  };

  return (
    <StaticPageTemplate 
      title={title}
      titleBn={titleBn}
      subtitle={subtitle}
      subtitleBn={subtitleBn}
      contentKey={contentKey}
    >
      {renderDefaultContent()}
    </StaticPageTemplate>
  );
};
