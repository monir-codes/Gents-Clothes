import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLanguageStore from '../store/useLanguageStore';

const QUIZ_QUESTIONS = [
  {
    questionEn: "What's your go-to fashion vibe for celebrations & outings?",
    questionBn: "ছুটির দিন বা স্পেশাল অকেশনে আপনার পছন্দের স্টাইল কোনটি?",
    optionsEn: [
      "Regal & Traditional (Jamdani, Katan, Silk Sarees)",
      "Festive & Graceful (Embroidered 3-Piece Suits)",
      "Modern Chic (Designer Kurtis & Co-ord Sets)",
      "Elegant & Modest (Dubai Cherry Abayas & Sets)"
    ],
    optionsBn: [
      "অভিজাত ও ঐতিহ্যবাহী (জামদানি, কাতান, সিল্ক শাড়ি)",
      "জমকালো ও মার্জিত (এমব্রয়ডারি থ্রি-পিস স্যুট)",
      "আধুনিক ট্রেন্ডি (ডিজাইনার কুর্তি ও কর্ড সেট)",
      "স্নিগ্ধ ও মার্জিত (দুবাই চেরি আবায়া ও বোরকা)"
    ]
  },
  {
    questionEn: "Which color palette resonates with your personality?",
    questionBn: "কোন রঙের শেড আপনার সবচেয়ে বেশি পছন্দ?",
    optionsEn: [
      "Royal & Deep Hues (Maroon, Black, Wine, Navy Blue)",
      "Vibrant & Auspicious (Crimson Red, Gold, Mustard Yellow)",
      "Soft Pastels (Blush Rose, Peach, Ivory, Lavender)",
      "Rich Nature Tones (Emerald Green, Teal, Olive, Coral)"
    ],
    optionsBn: [
      "রাজকীয় গাঢ় শেড (মেরুন, কালো, ওয়াইন, নেভি ব্লু)",
      "উজ্জ্বল উৎসবের রঙ (টকটকে লাল, সোনালী, কাঁচা হলুদ)",
      "সফট ও প্যাস্টেল (ব্লাশ রোজ, পীচ, আইভরি, ল্যাভেন্ডার)",
      "প্রকৃতির স্নিগ্ধ রঙ (পান্না সবুজ, টিল, অলিভ, কোরাল)"
    ]
  },
  {
    questionEn: "What garment category are you looking for today?",
    questionBn: "আজকে আপনি মূলত কোন ধরণের পোশাক খুঁজছেন?",
    optionsEn: [
      "Exclusive Sarees (Dhakai Jamdani, Katan, Pure Silk)",
      "Luxury Salwar Kameez & 3-Piece Pret Sets",
      "Contemporary Kurtis, Tunics & Co-ords",
      "Modest Wear & Dubai Cherry Abayas"
    ],
    optionsBn: [
      "এক্সক্লুসিভ শাড়ি (ঢাকাই জামদানি, কাতান, সিল্ক)",
      "লাক্সারি সালোয়ার কামিজ ও ৩-পিস স্যুট",
      "কনটেম্পরারি কুর্তি, টিউনিক ও কর্ড সেট",
      "আবায়া, বোরকা ও মডেস্ট ওয়্যার কালেকশন"
    ]
  }
];

const StyleQuizModal = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finish quiz
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onClose();
        
        // Pick category target based on 3rd answer
        let targetUrl = '/shop';
        if (newAnswers[2] === 0) targetUrl = '/shop?category=Sarees';
        else if (newAnswers[2] === 1) targetUrl = '/shop?category=Three%20Piece';
        else if (newAnswers[2] === 2) targetUrl = '/shop?category=Kurtis';
        else if (newAnswers[2] === 3) targetUrl = '/shop?category=Modest%20Wear';
        
        navigate(targetUrl);
        // Reset state
        setCurrentQuestion(0);
        setAnswers([]);
      }, 2200);
    }
  };

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentQuestion];
  const questionTitle = isBn ? currentQ.questionBn : currentQ.questionEn;
  const optionsList = isBn ? currentQ.optionsBn : currentQ.optionsEn;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: 'var(--color-background)',
            width: '90%', maxWidth: '520px',
            borderRadius: 'var(--radius-lg, 16px)',
            padding: 'var(--space-6)',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute', 
              top: '18px', 
              right: '18px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--color-text-secondary)' 
            }}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {isAnalyzing ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ display: 'inline-block', marginBottom: 'var(--space-4)' }}
              >
                <Sparkles size={48} color="var(--color-accent)" />
              </motion.div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-brand-maroon, #5e0f2b)', marginBottom: 'var(--space-2)' }}>
                {isBn ? 'এআই আপনার পছন্দের কালেকশন সাজাচ্ছে...' : 'AI is curating your perfect style...'}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                {isBn 
                  ? 'আপনার পছন্দ ও রুচি অনুযায়ী আমাদের সেরা প্রিমিয়াম পোশাকগুলো বাছাই করা হচ্ছে।' 
                  : 'Matching your preferences with our finest curated fashion collection.'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-accent, #c9a265)' }}>
                  <Sparkles size={18} />
                  <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    {isBn ? 'এআই স্টাইল অ্যাসিস্ট্যান্ট' : 'AI Style Assistant'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {questionTitle}
                </h2>
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {isBn ? `প্রশ্ন ${currentQuestion + 1} / ${QUIZ_QUESTIONS.length}` : `Question ${currentQuestion + 1} of ${QUIZ_QUESTIONS.length}`}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {optionsList.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    whileHover={{ scale: 1.01, borderColor: 'var(--color-accent, #c9a265)' }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      padding: '14px 18px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm, 8px)',
                      background: 'var(--color-surface)',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StyleQuizModal;
