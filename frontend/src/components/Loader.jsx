import React from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen ? `${styles.loaderContainer} ${styles.fullScreen}` : styles.loaderContainer;

  return (
    <div className={containerClass}>
      <motion.div
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.h3 
        className={styles.text}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        GENTFITS
      </motion.h3>
    </div>
  );
};

export default Loader;
