import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import useLanguageStore from '../store/useLanguageStore';

const DEFAULT_FAQS = [
  { 
    questionEn: "What is your return and check policy?", 
    answerEn: "You can inspect your parcel upon delivery. If you are not satisfied or find any issue, simply pay the delivery fee and hand it back to the delivery executive immediately.",
    questionBn: "পণ্য হাতে পেয়ে চেক করা ও রিটার্নের নিয়ম কী?", 
    answerBn: "ডেলিভারিম্যান থেকে পার্সেল গ্রহণের সময় দেখে নেওয়ার পূর্ণ সুবিধা রয়েছে। পণ্য পছন্দ না হলে বা কোনো সমস্যা থাকলে সাথে সাথে কেবল ডেলিভারি চার্জ দিয়ে রিটার্ন করতে পারবেন।"
  },
  { 
    questionEn: "How long does delivery take across Bangladesh?", 
    answerEn: "Standard delivery takes 2-3 business days inside Dhaka and 3-5 business days across all other districts in Bangladesh.",
    questionBn: "ডেলিভারি পেতে কতদিন সময় লাগে?", 
    answerBn: "ঢাকার ভিতরে সাধারণত ২-৩ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে সারা বাংলাদেশের যেকোনো স্থানে দ্রুততম সময়ে হোম ডেলিভারি পৌঁছে দেওয়া হয়।"
  },
  { 
    questionEn: "Are all garments 100% authentic and hand-inspected?", 
    answerEn: "Yes! Every saree, salwar kameez, kurti, and abaya is personally curated and quality-checked from verified master artisans and top weaving hubs.",
    questionBn: "রঙবতীর সকল পোশাক কি ১০০% অরিজিনাল ও কোয়ালিটি নিশ্চিত?", 
    answerBn: "হ্যাঁ! প্রতিটি শাড়ি, ৩-পিস ও কুর্তি দেশের সেরা ও বিশ্বস্ত সাপ্লায়ার এবং ঐতিহ্যবাহী তাঁতিদের কাছ থেকে নিখুঁত কোয়ালিটি চেকের মাধ্যমে বাছাই করা হয়।"
  },
  { 
    questionEn: "Do you offer nationwide Cash on Delivery (COD)?", 
    answerEn: "Yes! We provide safe Cash on Delivery service across all 64 districts in Bangladesh with parcel checking security.",
    questionBn: "সারা বাংলাদেশে কি ক্যাশ অন ডেলিভারি (COD) সুবিধা আছে?", 
    answerBn: "হ্যাঁ! দেশের ৬৪টি জেলার যেকোনো প্রান্তে নিশ্চিন্তে ক্যাশ অন ডেলিভারি এবং দেখে নিয়ে মূল্য পরিশোধের শতভাগ সুবিধা রয়েছে।"
  }
];

const FAQSection = () => {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState(0);
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

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
          {isBn ? 'আপনার জিজ্ঞাসা' : 'Got Questions?'}
        </span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-brand-maroon, #5e0f2b)', marginTop: '6px' }}
        >
          {isBn ? 'সাধারণ জিজ্ঞাসা ও উত্তর' : 'Frequently Asked Questions'}
        </motion.h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          const questionText = isBn ? (faq.questionBn || faq.question || faq.q) : (faq.questionEn || faq.question || faq.q);
          const answerText = isBn ? (faq.answerBn || faq.answer || faq.a) : (faq.answerEn || faq.answer || faq.a);

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
                <span>{questionText}</span>
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
                      dangerouslySetInnerHTML={{ __html: answerText }}
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
