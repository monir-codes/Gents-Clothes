import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

const FlashSaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Basic countdown timer for demo
    let target = new Date();
    target.setHours(target.getHours() + 12);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      
      if (diff <= 0) {
        clearInterval(interval);
      } else {
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours: h, minutes: m, seconds: s });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
        color: '#fff',
        padding: 'var(--space-6) var(--space-4)',
        textAlign: 'center',
        margin: 'var(--space-8) 0'
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Midnight Flash Sale</h2>
        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }}>Up to 50% Off Selected Premium Pieces.</p>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', margin: 'var(--space-3) 0' }}>
          <Clock size={28} color="var(--color-accent)" />
          <div style={{ display: 'flex', gap: '10px' }}>
            {['hours', 'minutes', 'seconds'].map(unit => (
              <div key={unit} style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 15px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 600 }}>{String(timeLeft[unit]).padStart(2, '0')}</span>
                <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>{unit}</span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/shop?sale=true">
          <button style={{
            background: 'var(--color-accent)',
            color: '#fff',
            padding: '16px 40px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer'
          }}>Shop The Sale</button>
        </Link>
      </div>
    </motion.section>
  );
};

export default FlashSaleBanner;
