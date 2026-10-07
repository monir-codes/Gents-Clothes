import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

const DEFAULT_FAQS = [
  { question: "What is your return policy?", answer: "We offer a hassle-free 7-day return and exchange policy for all unworn items with original tags attached." },
  { question: "How long does delivery take?", answer: "Standard delivery takes 2-3 business days inside Dhaka and 3-5 business days outside Dhaka." },
  { question: "Are all products 100% authentic at রঙবতী?", answer: "Yes, every saree, salwar kameez, and kurti is hand-inspected for premium fabric quality and artisanal craftsmanship." },
  { question: "Do you offer Cash on Delivery (COD)?", answer: "Yes! We offer nationwide Cash on Delivery across all 64 districts in Bangladesh." }
];

const FAQSection = () => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const { data } = await axios.get('/api/faqs');
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data.slice(0, 6)); // Display top 6 FAQs
        }
      } catch (err) {
        // Fallback to default FAQs
      }
    };
    loadFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-accent, #c9a265)', fontWeight: 600 }}>
          Got Questions?
        </span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-brand-maroon, #5e0f2b)', marginTop: '6px' }}
        >
          Frequently Asked Questions
        </motion.h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div 
              key={faq._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ 
                border: isOpen ? '1.5px solid var(--color-accent, #c9a265)' : '1px solid var(--color-border, #ebdcd0)', 
                borderRadius: 'var(--radius-md, 12px)', 
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: isOpen ? '0 6px 20px rgba(201, 162, 101, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <button 
                onClick={() => toggleFAQ(i)}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '18px 22px', 
                  background: isOpen ? 'rgba(250, 246, 241, 0.6)' : 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.02rem', 
                  fontWeight: 600, 
                  color: isOpen ? 'var(--color-brand-maroon, #5e0f2b)' : 'var(--color-text-primary, #2d2424)', 
                  textAlign: 'left',
                  gap: '12px'
                }}
              >
                <span>{faq.question || faq.q}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={20} style={{ color: isOpen ? 'var(--color-accent, #c9a265)' : 'var(--color-text-secondary)' }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ 
                      padding: '0 22px 18px', 
                      background: 'rgba(250, 246, 241, 0.6)', 
                      color: 'var(--color-text-secondary, #6c5a60)', 
                      fontSize: '0.95rem',
                      lineHeight: 1.75
                    }}
                  >
                    <div 
                      style={{ paddingTop: '10px', borderTop: '1px solid var(--color-border, #ebdcd0)' }}
                      dangerouslySetInnerHTML={{ __html: faq.answer || faq.a }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
