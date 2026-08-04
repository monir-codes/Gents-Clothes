import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    question: "What's your go-to weekend vibe?",
    options: ["Relaxed & Casual", "Sharp & Elegant", "Streetwear & Edgy", "Minimalist & Clean"]
  },
  {
    question: "Which color palette do you prefer?",
    options: ["Neutrals (Black, White, Grey)", "Earthy Tones (Brown, Olive, Sand)", "Bold & Bright", "Pastels"]
  },
  {
    question: "What's your preferred fit?",
    options: ["Slim Fit", "Regular Fit", "Oversized", "Tailored"]
  }
];

const StyleQuizModal = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finish quiz
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onClose();
        // Route to shop with a generic style filter parameter
        navigate('/shop?style=ai-recommended');
        // Reset state
        setCurrentQuestion(0);
        setAnswers([]);
      }, 2500);
    }
  };

  if (!isOpen) return null;

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
            width: '90%', maxWidth: '500px',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}>
            <X size={24} />
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
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>AI is curating your style...</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Matching your preferences with our premium collection.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-accent)' }}>
                  <Sparkles size={20} />
                  <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>AI Style Assistant</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{questions[currentQuestion].question}</h2>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questions[currentQuestion].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '16px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-surface)',
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
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
