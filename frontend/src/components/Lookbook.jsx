import React from 'react';
import { motion } from 'framer-motion';

const Lookbook = () => {
  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Interactive Lookbook</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Explore how to style our premium pieces.</p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        {[
          { img: 'https://images.unsplash.com/photo-1594938298596-eb5fd3f6b3b0?auto=format&fit=crop&q=80&w=800', title: 'The Modern Classic' },
          { img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800', title: 'Summer Essence' },
          { img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800', title: 'Evening Elegance' }
        ].map((look, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '450px', cursor: 'pointer' }}
          >
            <img src={look.img} alt={look.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="lookbookImg" />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 'var(--space-4)', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: '#fff' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px' }}>{look.title}</h3>
              <p style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>Shop This Look</p>
            </div>
            {/* Mock Hotspot */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', top: '40%', left: '50%', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }} 
            />
          </motion.div>
        ))}
      </div>
      <style>{`
        .lookbookImg:hover { transform: scale(1.05); }
      `}</style>
    </section>
  );
};

export default Lookbook;
