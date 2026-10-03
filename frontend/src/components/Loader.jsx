import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen ? `${styles.loaderContainer} ${styles.fullScreen}` : styles.loaderContainer;

  return (
    <div className={containerClass}>
      {/* Animated Logo Emblem */}
      <div className={styles.logoWrapper}>
        <motion.div
          className={styles.pulseRing}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.img
          src="/favicon.png"
          alt="রঙবতী"
          className={styles.logoImage}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: [0.96, 1.04, 0.96]
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Brand Name Typography */}
      <motion.div 
        className={styles.brandTitle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        রঙবতী
      </motion.div>

      {/* Tagline */}
      <motion.div
        className={styles.tagline}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        FASHION FOR EVERY YOU
      </motion.div>

      {/* Sleek Golden Line Shimmer */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0], transformOrigin: ['left', 'center', 'right'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default Loader;
