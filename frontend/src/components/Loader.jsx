import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen ? `${styles.loaderContainer} ${styles.fullScreen}` : styles.loaderContainer;
  const brandName = "GENTS CLOTHES";

  return (
    <div className={containerClass}>
      <div style={{ display: 'flex', overflow: 'hidden', padding: '10px 0' }}>
        {brandName.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 1.5
            }}
            style={{
              fontSize: fullScreen ? '2rem' : '1.5rem',
              fontWeight: 700,
              letterSpacing: '6px',
              display: 'inline-block',
              color: 'var(--color-text-primary)',
              textTransform: 'uppercase'
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      
      {/* Sleek Line Indicator */}
      <div style={{ width: '120px', height: '1px', background: 'var(--color-border)', position: 'relative', overflow: 'hidden', marginTop: '10px' }}>
        <motion.div
          style={{ width: '100%', height: '100%', background: 'var(--color-text-primary)', position: 'absolute', top: 0, left: 0, transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0], transformOrigin: ['left', 'left', 'right'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default Loader;
