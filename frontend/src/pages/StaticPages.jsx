import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Feather, ShieldCheck, ArrowRight, ChevronDown, Search, HelpCircle } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const StaticPageTemplate = ({ title, subtitle, children, contentKey, schemaMarkup }) => {
  const [settings, setSettings] = useState(null);

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
        title={title} 
        description={subtitle || `${title} - রঙবতী (Ronggoboti) Women's Fashion & Lifestyle in Bangladesh.`} 
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
            <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>Home</Link> / {title}
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            fontWeight: 700, 
            color: 'var(--color-brand-maroon, #5e0f2b)', 
            marginBottom: subtitle ? '12px' : '0' 
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: 0 }}>
              {subtitle}
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
        title="About Us | Our Story" 
        description="Discover the heritage, artistry, and philosophy behind রঙবতী (Ronggoboti) — Bangladesh's premier luxury women's fashion house." 
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
              The Art of Elegance
            </span>
            <h1 style={{ 
              fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', 
              fontWeight: 700, 
              color: 'var(--color-brand-maroon, #5e0f2b)', 
              lineHeight: 1.2,
              marginBottom: '20px',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Crafting Timeless Grace for Every Woman
            </h1>
            <p style={{ 
              color: 'var(--color-text-secondary, #6c5a60)', 
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
              maxWidth: '720px', 
              margin: '0 auto 28px',
              lineHeight: 1.7 
            }}>
              {settings?.staticPages?.about?.storyText || 
                'রঙবতী (Ronggoboti) was born from an unwavering passion to celebrate the timeless beauty of Bengali heritage and modern feminine elegance. Every silhouette is a canvas of craftsmanship, emotion, and individuality.'}
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
              A Legacy of Fine Artistry
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '20px' }}>
              From the delicate threads of authentic Dhakai Jamdani to luxurious pure silks and fluid georgettes, we bring together Bangladesh's master weavers and modern designers under one visionary atelier.
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '30px' }}>
              {settings?.staticPages?.about?.materialsText || 
                'We handpick each fabric with uncompromising standards. Our designs honor our cultural roots while empowering the contemporary woman to express herself boldly and beautifully.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-surface, #faf6f1)', 
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--color-border, #ebdcd0)' 
              }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-brand-maroon)', margin: '0 0 4px' }}>100%</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Authentic Fabrics</p>
              </div>
              <div style={{ 
                padding: '20px', 
                background: 'var(--color-surface, #faf6f1)', 
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--color-border, #ebdcd0)' 
              }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-brand-maroon)', margin: '0 0 4px' }}>10K+</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Delighted Muses</p>
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
              Our Values
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', color: 'var(--color-brand-maroon, #5e0f2b)', marginTop: '8px', fontWeight: 700 }}>
              The Pillars of রঙবতী
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {[
              {
                icon: Feather,
                title: "Artisanal Heritage",
                desc: "We work directly with traditional weaving communities across Bengal, sustaining generational artistry and empowering local artisans."
              },
              {
                icon: Sparkles,
                title: "Modern Glamour",
                desc: "Every creation is infused with chic contemporary cuts, opulent hues, and flattering draping suited for grand celebrations and everyday luxury."
              },
              {
                icon: ShieldCheck,
                title: "Uncompromising Quality",
                desc: "From the finest pure silk threads to precise hand-finished hemlines, we never cut corners on quality, comfort, or endurance."
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
            Every Thread Tells a Story
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            A glimpse into the elegance, fabrics, and craft behind রঙবতী.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {[
            { img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800', title: 'Royal Silk Weaves' },
            { img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800', title: 'Contemporary Silhouettes' },
            { img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', title: 'Festive Allure' }
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
            Experience the Magic of রঙবতী
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 28px', fontSize: '1.05rem' }}>
            Explore our curated collections of sarees, salwar kameez, and contemporary festive wear designed for your special moments.
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
              Shop All Collections <ArrowRight size={18} />
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

  const categories = ['All', 'General', 'Orders & Payment', 'Delivery & Shipping', 'Fabric & Sizing', 'Returns & Exchange'];

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
        title="Frequently Asked Questions (FAQ) | রঙবতী" 
        description="Find answers to questions about ordering authentic Sarees, Salwar Kameez, Kurtis, shipping across Bangladesh, payment methods, returns, and fabric care at রঙবতী (Ronggoboti)." 
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
            <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>Home</Link> / FAQ
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            fontWeight: 700, 
            color: 'var(--color-brand-maroon, #5e0f2b)', 
            marginBottom: '12px' 
          }}>
            সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর (FAQ)
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', margin: '0 auto 24px', maxWidth: '650px' }}>
            রঙবতী (Ronggoboti) থেকে কেনাকাটা, ডেলিভারি, পেমেন্ট ও ফেব্রিক সম্পর্কিত সাধারণ প্রশ্নগুলোর সহজ উত্তর জেনে নিন।
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
              placeholder="প্রশ্ন বা বিষয় খুঁজুন (যেমন: ডেলিভারি, ক্যাশ অন ডেলিভারি, রিটার্ন)..."
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
            const count = cat === 'All' ? faqs.length : faqs.filter(f => (f.category || 'General') === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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
                <span>{cat}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-surface, #faf6f1)',
                  color: isActive ? '#ffffff' : 'var(--color-text-secondary)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p>FAQ লোড হচ্ছে...</p>
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
            <h3 style={{ color: 'var(--color-brand-maroon)', fontSize: '1.2rem', marginBottom: '8px' }}>কোনো ফলাফল পাওয়া যায়নি</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              অন্য কোনো কিওয়ার্ড দিয়ে খুঁজুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।
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
              আরও কোনো প্রশ্ন বা বিশেষ সাহায্য প্রয়োজন?
            </h3>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              আমাদের কাস্টমার কেয়ার টিম আপনাকে সার্বক্ষণিক সহায়তা করার জন্য প্রস্তুত।
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
                Contact Support <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Contact = () => (
  <StaticPageTemplate 
    title="Contact Us" 
    subtitle="We would love to hear from you. Reach out to our customer care team anytime."
    contentKey="contact"
  >
    <p>Loading contact info...</p>
  </StaticPageTemplate>
);

export const LegalPage = ({ title }) => {
  let contentKey = '';
  if (title === 'Shipping Policy') contentKey = 'shipping';
  if (title === 'Return & Exchange Policy') contentKey = 'returns';
  if (title === 'Size Guide') contentKey = 'sizeGuide';
  if (title === 'Privacy Policy') contentKey = 'privacy';
  if (title === 'Terms of Service') contentKey = 'terms';

  return (
    <StaticPageTemplate 
      title={title} 
      subtitle="Important terms, policies, and guidance regarding your shopping experience."
      contentKey={contentKey}
    >
      <p>Loading document...</p>
    </StaticPageTemplate>
  );
};
