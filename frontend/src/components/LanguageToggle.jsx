import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import useLanguageStore from '../store/useLanguageStore';
import styles from './LanguageToggle.module.css';

const LanguageToggle = ({ isFullWidth = false, showIcon = true, className = '' }) => {
  const { language, setLanguage } = useLanguageStore();

  const handleToggle = (lang) => {
    setLanguage(lang);
  };

  return (
    <div 
      className={`${styles.languageToggle} ${isFullWidth ? styles.fullWidth : ''} ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      {showIcon && (
        <span className={styles.globeIcon} aria-hidden="true">
          <Globe size={13} strokeWidth={2} />
        </span>
      )}
      <button
        type="button"
        className={`${styles.langOption} ${language === 'bn' ? styles.active : ''}`}
        onClick={() => handleToggle('bn')}
        aria-pressed={language === 'bn'}
        title="বাংলায় দেখুন"
      >
        বাং
      </button>
      <button
        type="button"
        className={`${styles.langOption} ${language === 'en' ? styles.active : ''}`}
        onClick={() => handleToggle('en')}
        aria-pressed={language === 'en'}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
