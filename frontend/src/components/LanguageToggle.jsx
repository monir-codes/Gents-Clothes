import React from 'react';
import { Globe } from 'lucide-react';
import useLanguageStore from '../store/useLanguageStore';
import styles from './LanguageToggle.module.css';

const LanguageToggle = ({ variant = 'icon', isFullWidth = false, className = '' }) => {
  const { language, toggleLanguage, setLanguage } = useLanguageStore();

  const isBn = language === 'bn';

  if (variant === 'icon' && !isFullWidth) {
    return (
      <button
        type="button"
        className={`${styles.globeIconButton} ${className}`}
        onClick={toggleLanguage}
        aria-label={isBn ? "ভাষা পরিবর্তন (বাংলা / English)" : "Switch Language (Bengali / English)"}
        data-tooltip={isBn ? "ভাষা: বাংলা (Click for English)" : "Language: English (বাংলায় দেখতে ক্লিক করুন)"}
        title={isBn ? "ভাষা: বাংলা (Click for English)" : "Language: English (বাংলায় দেখতে ক্লিক করুন)"}
      >
        <Globe size={20} strokeWidth={1.8} className={styles.globeSvg} />
        <span className={styles.langMicroBadge}>
          {isBn ? 'বাং' : 'EN'}
        </span>
      </button>
    );
  }

  // Mobile Drawer pill format
  return (
    <div 
      className={`${styles.languageTogglePill} ${isFullWidth ? styles.fullWidth : ''} ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        className={`${styles.langPillOption} ${isBn ? styles.active : ''}`}
        onClick={() => setLanguage('bn')}
        aria-pressed={isBn}
      >
        <Globe size={14} style={{ marginRight: '6px' }} />
        বাংলা (বাং)
      </button>
      <button
        type="button"
        className={`${styles.langPillOption} ${!isBn ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-pressed={!isBn}
      >
        English (EN)
      </button>
    </div>
  );
};

export default LanguageToggle;
