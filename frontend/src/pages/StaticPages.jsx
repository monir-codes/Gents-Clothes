import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';

const StaticPageTemplate = ({ title, children, contentKey }) => {
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
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', minHeight: '60vh', maxWidth: '800px' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '32px', textAlign: 'center' }}>{title}</h1>
      <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', fontSize: '1.05rem' }}>
        {contentKey && settings?.staticPages?.[contentKey] ? (
          <div dangerouslySetInnerHTML={{ __html: settings.staticPages[contentKey] }} />
        ) : (
          children
        )}
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
  <div>
    <SEO title="About Us - Our Story" description="Discover the heritage and craftsmanship behind Gents Clothes." />
    {/* Cinematic Hero */}
    <div style={{ position: 'relative', height: '60vh', width: '100%', overflow: 'hidden' }}>
      <img src={settings?.staticPages?.about?.heroImage || '/images/hero-banner.jpg'} alt="Craftsmanship" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: '#fff', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}
        >
          Our Story
        </motion.h1>
      </div>
    </div>

    {/* Split Section */}
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '20px' }}>A Legacy of Elegance</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
            {settings?.staticPages?.about?.storyText || 'Gents Clothes was founded with a singular, uncompromising vision: to redefine luxury menswear in Bangladesh. We believe that true elegance lies in the details—from the meticulous selection of premium fabrics to the flawless precision of our tailoring.'}
          </p>
        </motion.div>
        <motion.img 
          src={settings?.staticPages?.about?.materialsImage1 || '/images/hero-banner.jpg'} 
          alt="Tailoring" 
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', alignItems: 'center' }}>
        <motion.img 
          src={settings?.staticPages?.about?.materialsImage2 || '/images/hero-banner.jpg'} 
          alt="Fabrics" 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '4px' }} 
        />
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '20px' }}>The Finest Materials</h2>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
            {settings?.staticPages?.about?.materialsText || 'We source only the highest grade Egyptian cottons, pure silks, and rich wools. Every garment is constructed to not only look breathtaking but to stand the test of time, adapting to the modern gentleman\'s lifestyle.'}
          </p>
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export const FAQ = () => (
  <StaticPageTemplate title="Frequently Asked Questions" contentKey="faq">
    <p>Loading FAQ...</p>
  </StaticPageTemplate>
);

export const Contact = () => (
  <StaticPageTemplate title="Contact Us" contentKey="contact">
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
    <StaticPageTemplate title={title} contentKey={contentKey}>
      <p>Loading document...</p>
    </StaticPageTemplate>
  );
};
