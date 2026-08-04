import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, ArrowRight } from 'lucide-react';

const AISizeRecommender = ({ isOpen, onClose, onSelectSize }) => {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [fit, setFit] = useState('Regular');
  const [isCalculating, setIsCalculating] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState(null);

  const calculateSize = () => {
    setIsCalculating(true);
    // Mock algorithm based on standard Asian/BD sizing
    setTimeout(() => {
      let size = 'M';
      const h = parseInt(height);
      const w = parseInt(weight);

      if (h > 180 || w > 85) size = 'XL';
      else if (h > 175 || w > 75) size = 'L';
      else if (h < 165 || w < 60) size = 'S';
      else size = 'M';

      if (fit === 'Loose' && size !== 'XL') {
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        const idx = sizes.indexOf(size);
        if (idx < sizes.length - 1) size = sizes[idx + 1];
      } else if (fit === 'Slim' && size !== 'S') {
         const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
         const idx = sizes.indexOf(size);
         if (idx > 0) size = sizes[idx - 1];
      }
      
      setRecommendedSize(size);
      setIsCalculating(false);
      setStep(2);
    }, 1500);
  };

  const handleApply = () => {
    onSelectSize(recommendedSize);
    onClose();
    // reset
    setTimeout(() => {
      setStep(1);
      setRecommendedSize(null);
    }, 500);
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
            width: '90%', maxWidth: '450px',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <X size={24} />
          </button>

          {step === 1 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', color: 'var(--color-accent)' }}>
                <Ruler size={24} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Find Your Perfect Fit</h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
                Our AI analyzes thousands of data points to recommend the best size for your unique body type.
              </p>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Height (cm)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="range" min="150" max="200" value={height} onChange={(e) => setHeight(e.target.value)} style={{ flex: 1 }} />
                  <span style={{ fontWeight: 600, width: '50px', textAlign: 'right' }}>{height}</span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Weight (kg)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="range" min="40" max="120" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ flex: 1 }} />
                  <span style={{ fontWeight: 600, width: '50px', textAlign: 'right' }}>{weight}</span>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Preferred Fit</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Slim', 'Regular', 'Loose'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFit(f)}
                      style={{
                        flex: 1, padding: '10px',
                        border: `1px solid ${fit === f ? 'var(--color-text-primary)' : 'var(--color-border)'}`,
                        background: fit === f ? 'var(--color-text-primary)' : 'transparent',
                        color: fit === f ? 'var(--color-background)' : 'var(--color-text-primary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={calculateSize} 
                disabled={isCalculating}
                style={{
                  width: '100%', padding: '14px', background: 'var(--color-text-primary)', color: 'var(--color-background)',
                  border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem',
                  cursor: isCalculating ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: isCalculating ? 0.7 : 1
                }}
              >
                {isCalculating ? 'Analyzing...' : 'Calculate My Size'}
                {!isCalculating && <ArrowRight size={18} />}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
              <div style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
                <Ruler size={48} style={{ margin: '0 auto' }} />
              </div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-2)' }}>Your Recommended Size</h2>
              <div style={{ 
                fontSize: '4rem', fontWeight: 700, margin: 'var(--space-4) 0',
                textShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                {recommendedSize}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
                Based on {height}cm, {weight}kg and a {fit.toLowerCase()} fit preference.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: '14px', background: 'transparent', color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Recalculate
                </button>
                <button 
                  onClick={handleApply}
                  style={{
                    flex: 1, padding: '14px', background: 'var(--color-text-primary)', color: 'var(--color-background)',
                    border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Apply Size
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AISizeRecommender;
