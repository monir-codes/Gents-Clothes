import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: "What is your return policy?", a: "We offer a hassle-free 7-day return policy for all unworn items with original tags attached." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days within Dhaka." },
  { q: "Do you offer international shipping?", a: "Currently, we only ship within Bangladesh. We plan to expand internationally soon." },
  { q: "How do I care for the luxury fabrics?", a: "Each product comes with specific wash care instructions. We generally recommend dry cleaning or gentle hand wash." }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center', marginBottom: 'var(--space-6)' }}
      >
        Frequently Asked Questions
      </motion.h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}
          >
            <button 
              onClick={() => toggleFAQ(i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--color-surface)', border: 'none', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 500, color: 'var(--color-text-primary)', textAlign: 'left' }}
            >
              {faq.q}
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                <ChevronDown size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ padding: '0 20px 16px', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}
                >
                  <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
