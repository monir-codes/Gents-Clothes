import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const UGCSection = () => {
  return (
    <section style={{ padding: 'var(--space-8) 0', background: 'var(--color-surface)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Camera size={24} />
            <span style={{ fontWeight: 600, letterSpacing: '1px' }}>@RONGGOBOTI</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, textTransform: 'uppercase' }}>Spotted in রঙবতী</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Tag us to get featured on our official page.</p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          {[
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=600'
          ].map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', height: '300px' }}
            >
              <img src={img} alt={`UGC ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UGCSection;
