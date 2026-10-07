import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, BILINGUAL_SYNONYMS } from '../translations/translations';

// Helper to access nested keys like "nav.shop"
const getNestedTranslation = (obj, path) => {
  if (!obj || !path) return '';
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
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
