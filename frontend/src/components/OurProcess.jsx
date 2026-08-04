import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Scissors, Package } from 'lucide-react';

const steps = [
  { icon: PenTool, title: "1. Design", desc: "Every piece starts with an original design, focusing on modern aesthetics and premium fits." },
  { icon: Scissors, title: "2. Craftsmanship", desc: "We source the finest fabrics and tailor them with precision for ultimate comfort and durability." },
  { icon: Package, title: "3. Delivery", desc: "Packaged sustainably and delivered swiftly to your doorstep with our premium service." }
];

const OurProcess = () => {
  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Our Process</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>From concept to your closet.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ 
              width: '80px', height: '80px', 
              margin: '0 auto var(--space-4)', 
              background: 'var(--color-surface)', 
              borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <step.icon size={36} color="var(--color-text-primary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurProcess;
