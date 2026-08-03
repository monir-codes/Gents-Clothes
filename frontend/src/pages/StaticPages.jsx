import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';

const StaticPageTemplate = ({ title, children }) => (
  <div className="container" style={{ padding: '60px 0', minHeight: '60vh', maxWidth: '800px' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '32px', textAlign: 'center' }}>{title}</h1>
    <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
      {children}
    </div>
  </div>
);

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
  <div>
    <SEO title="About Us - Our Story" description="Discover the heritage and craftsmanship behind GentFits." />
    {/* Cinematic Hero */}
    <div style={{ position: 'relative', height: '60vh', width: '100%', overflow: 'hidden' }}>
      <img src="/images/hero-banner.png" alt="Craftsmanship" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: '#fff', fontSize: '4rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}
        >
          Our Story
        </motion.h1>
      </div>
    </div>

    {/* Split Section */}
    <div className="container" style={{ padding: '80px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>A Legacy of Elegance</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
            {settings?.aboutStory || 'GentFits was founded with a singular, uncompromising vision: to redefine luxury menswear in Bangladesh. We believe that true elegance lies in the details—from the meticulous selection of premium fabrics to the flawless precision of our tailoring.'}
          </p>
        </motion.div>
        <motion.img 
          src="/images/hero-banner.png" 
          alt="Tailoring" 
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
        <motion.img 
          src="/images/hero-banner.png" 
          alt="Fabrics" 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }} 
        />
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>The Finest Materials</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
            We source only the highest grade Egyptian cottons, pure silks, and rich wools. Every garment is constructed to not only look breathtaking but to stand the test of time, adapting to the modern gentleman's lifestyle.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export const FAQ = () => (
  <StaticPageTemplate title="Frequently Asked Questions">
    <h3>When will my order ship?</h3>
    <p>Orders are typically processed within 24 hours. Delivery takes 2-3 business days.</p>
    <h3 style={{ marginTop: '24px'}}>Do you offer returns?</h3>
    <p>Yes, we offer a hassle-free 7-day return policy for unused products in their original packaging.</p>
  </StaticPageTemplate>
);

export const Contact = () => (
  <StaticPageTemplate title="Contact Us">
    <p><strong>Email:</strong> support@gentfits.com</p>
    <p><strong>Phone:</strong> +880 1711 000 000</p>
    <p><strong>Address:</strong> Banani, Dhaka, Bangladesh</p>
    <p style={{ marginTop: '24px' }}>Our customer service team is available Saturday to Thursday, 10 AM to 8 PM.</p>
  </StaticPageTemplate>
);

export const LegalPage = ({ title }) => (
  <StaticPageTemplate title={title}>
    <p>This is the standard {title} document. For full legal text, please refer to our official terms.</p>
    <p>Effective Date: August 2026.</p>
  </StaticPageTemplate>
);
