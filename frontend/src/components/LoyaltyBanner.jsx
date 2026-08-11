import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

const LoyaltyBanner = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container" 
      style={{ 
        padding: 'var(--space-6)', 
        background: 'var(--color-text-primary)', 
        color: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)', 
        margin: 'var(--space-8) auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
        <div style={{ background: 'var(--color-accent)', padding: '16px', borderRadius: '50%' }}>
          <Gift size={32} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, margin: 0 }}>Gents Clothes Insider</h2>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Join our loyalty program and earn exclusive rewards.</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ 
          padding: '12px 24px', 
          background: 'transparent', 
          border: '1px solid var(--color-background)', 
          color: 'var(--color-background)',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>Learn More</button>
        <button style={{ 
          padding: '12px 24px', 
          background: 'var(--color-background)', 
          border: 'none', 
          color: 'var(--color-text-primary)',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          cursor: 'pointer'
        }}>Join Now</button>
      </div>
    </motion.section>
  );
};

export default LoyaltyBanner;
