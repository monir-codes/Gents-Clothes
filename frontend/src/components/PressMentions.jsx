import React from 'react';
import { motion } from 'framer-motion';

const PressMentions = () => {
  const logos = [
    "VOGUE", "GQ", "HYPEBEAST", "ESQUIRE", "FORBES"
  ];

  return (
    <section style={{ padding: 'var(--space-6) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: 'var(--space-8) 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>As Featured In</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
          {logos.map((logo, i) => (
            <motion.h3 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)', opacity: 0.6, letterSpacing: '1px', margin: 0 }}
            >
              {logo}
            </motion.h3>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressMentions;
