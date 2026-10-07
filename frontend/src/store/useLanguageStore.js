import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, BILINGUAL_SYNONYMS, CATEGORY_TRANSLATIONS } from '../translations/translations';

// Helper to access nested keys like "nav.shop"
const getNestedTranslation = (obj, path) => {
  if (!obj || !path) return '';
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

// Bengali numeral converter
export const toBengaliNumerals = (num) => {
  if (num === undefined || num === null) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)]);
};

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'bn', // Default to Bengali

      setLanguage: (lang) => {
        const safeLang = lang === 'en' ? 'en' : 'bn';
        if (typeof document !== 'undefined') {
          document.documentElement.lang = safeLang;
        }
        set({ language: safeLang });
      },

      toggleLanguage: () => {
        const current = get().language;
        const next = current === 'bn' ? 'en' : 'bn';
        if (typeof document !== 'undefined') {
          document.documentElement.lang = next;
        }
        set({ language: next });
      },

      // Translate helper function: t('nav.shop', 'Shop')
      t: (path, fallback = '') => {
        const lang = get().language || 'bn';
        const langDict = translations[lang] || translations.bn;
        const result = getNestedTranslation(langDict, path);
        if (result !== undefined) return result;

        // Try english fallback
        const enResult = getNestedTranslation(translations.en, path);
        if (enResult !== undefined) return enResult;

        return fallback || path;
      },

      // Price formatter helper: returns "৳২,৫০০" (in bn) or "৳2,500" (in en)
      formatPrice: (price) => {
        if (price === undefined || price === null || isNaN(Number(price))) return '৳০';
        const lang = get().language || 'bn';
        const formattedEn = Number(price).toLocaleString('en-US');
        if (lang === 'bn') {
          return `৳${toBengaliNumerals(formattedEn)}`;
        }
        return `৳${formattedEn}`;
      },

      // Number formatter helper (e.g. 10 -> ১০ in Bengali)
      formatNumber: (num) => {
        if (num === undefined || num === null) return '';
        const lang = get().language || 'bn';
        if (lang === 'bn') {
          return toBengaliNumerals(num);
        }
        return String(num);
      },

      // Category localizer
      localizeCategory: (catName) => {
        if (!catName) return '';
        const lang = get().language || 'bn';
        if (CATEGORY_TRANSLATIONS[catName]) {
          return CATEGORY_TRANSLATIONS[catName][lang] || catName;
        }
        return catName;
      },

      // Product Title localizer
      localizeTitle: (title) => {
        if (!title || typeof title !== 'string') return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return title;

        // Common title localizations for luxury boutique items
        let localized = title;
        const replacements = [
          [/Dhakai Jamdani/gi, 'ঢাকাই জামদানি'],
          [/Jamdani Saree/gi, 'জামদানি শাড়ি'],
          [/Jamdani/gi, 'জামদানি'],
          [/Mirpur Katan/gi, 'মিরপুর কাতান'],
          [/Katan Silk Saree/gi, 'কাতান সিল্ক শাড়ি'],
          [/Katan Saree/gi, 'কাতান শাড়ি'],
          [/Katan/gi, 'কাতান'],
          [/Pure Silk Saree/gi, 'পিওর সিল্ক শাড়ি'],
          [/Silk Saree/gi, 'সিল্ক শাড়ি'],
          [/Silk/gi, 'সিল্ক'],
          [/Benarasi Saree/gi, 'বেনারসি শাড়ি'],
          [/Benarasi/gi, 'বেনারসি'],
          [/Pakistani Luxury Lawn 3-Piece/gi, 'পাকিস্তানি লাক্সারি লন ৩-পিস'],
          [/Pakistani Lawn 3-Piece/gi, 'পাকিস্তানি লন ৩-পিস'],
          [/Pakistani Lawn/gi, 'পাকিস্তানি লন'],
          [/3-Piece/gi, '৩-পিস'],
          [/Three Piece/gi, 'থ্রি পিস'],
          [/2-Piece/gi, '২-পিস'],
          [/Two Piece/gi, 'টু পিস'],
          [/Salwar Kameez/gi, 'সালোয়ার কামিজ'],
          [/Bridal Lehenga/gi, 'ব্রাইডাল লেহেঙ্গা'],
          [/Lehenga/gi, 'লেহেঙ্গা'],
          [/Designer Kurti/gi, 'ডিজাইনার কুর্তি'],
          [/Kurti/gi, 'কুর্তি'],
          [/Dubai Cherry Abaya/gi, 'দুবাই চেরি আবায়া'],
          [/Abaya/gi, 'আবায়া'],
          [/Co-ord Set/gi, 'কর্ড সেট'],
          [/Saree/gi, 'শাড়ি'],
          [/Sari/gi, 'শাড়ি']
        ];

        replacements.forEach(([regex, bengaliReplacement]) => {
          localized = localized.replace(regex, bengaliReplacement);
        });

        return localized;
      },

      // Query expansion for search (bilingual search terms)
      getSearchSynonyms: (searchTerm) => {
        if (!searchTerm || typeof searchTerm !== 'string') return [];
        const term = searchTerm.trim().toLowerCase();
        const results = new Set([term]);

        Object.entries(BILINGUAL_SYNONYMS).forEach(([key, synonyms]) => {
          const keyLower = key.toLowerCase();
          if (term.includes(keyLower) || keyLower.includes(term)) {
            synonyms.forEach(s => results.add(s.toLowerCase()));
          }
          synonyms.forEach(syn => {
            if (term.includes(syn.toLowerCase()) || syn.toLowerCase().includes(term)) {
              results.add(keyLower);
            }
          });
        });

        return Array.from(results);
      }
    }),
    {
      name: 'ronggoboti-language',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.lang = state.language || 'bn';
        }
      }
    }
  )
);

export default useLanguageStore;
