import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const FloatingWidgets = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('8801700000000');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data && data.whatsappNumber) {
          setWhatsappNumber(data.whatsappNumber);
        }
      } catch (error) {
        console.error("CMS Fetch error", error);
      }
    };
    fetchSettings();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = "Hi GentFits! I'm interested in your premium collection.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 9999
    }}>
      {/* WhatsApp Chat Button */}
      <motion.button
        onClick={openWhatsApp}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.152.565 4.225 1.637 6.06L.07 23.94l6.002-1.576c1.782.983 3.791 1.5 5.959 1.5 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm6.275 17.202c-.27.765-1.57 1.47-2.164 1.53-.553.056-1.28.163-4.143-1.025-3.518-1.458-5.787-5.066-5.962-5.302-.175-.235-1.424-1.895-1.424-3.613 0-1.719.897-2.558 1.214-2.887.316-.328.694-.41 1.011-.41.316 0 .633.003.904.015.284.012.666-.11 1.042.802.396.963 1.353 3.303 1.472 3.539.119.235.198.513.04.793-.159.28-.238.455-.476.735-.238.28-.498.604-.716.81-.238.235-.494.492-.218.963.277.47 1.229 2.023 2.639 3.28 1.823 1.626 3.327 2.132 3.803 2.368.476.235.753.197 1.033-.122.28-.319 1.21-1.413 1.534-1.897.323-.483.642-.403 1.077-.246.435.158 2.766 1.303 3.242 1.539.476.235.793.355.912.55.119.197.119 1.144-.151 1.909z" />
        </svg>
      </motion.button>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-text-primary)',
              color: 'var(--color-background)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              alignSelf: 'center'
            }}
            aria-label="Scroll to Top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWidgets;
