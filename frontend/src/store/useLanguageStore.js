import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  translations, 
  BILINGUAL_SYNONYMS, 
  CATEGORY_TRANSLATIONS,
  PRODUCT_TRANSLATIONS,
  COLOR_TRANSLATIONS,
  FABRIC_TRANSLATIONS
} from '../translations/translations';

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

      // Price formatter helper: returns "৳ 2,500" (Clear, professional, standard eCommerce format)
      formatPrice: (price) => {
        if (price === undefined || price === null || isNaN(Number(price))) return '৳ 0';
        const formattedEn = Number(price).toLocaleString('en-US');
        return `৳ ${formattedEn}`;
      },

      // Number formatter helper: returns clean, crystal-clear standard numerals (e.g. 1, 2, 3...)
      formatNumber: (num) => {
        if (num === undefined || num === null) return '';
        return String(num);
      },

      // Size localizer helper
      localizeSize: (size) => {
        if (!size || typeof size !== 'string') return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return size;

        let localized = size;
        localized = localized
          .replace(/12 Haat with Blouse Piece/gi, '১২ হাত (ব্লাউজ পিস সহ)')
          .replace(/12 Haat \(Free Size\)/gi, '১২ হাত (ফ্রি সাইজ)')
          .replace(/12 Haat/gi, '১২ হাত')
          .replace(/14 Haat/gi, '১৪ হাত')
          .replace(/Free Size/gi, 'ফ্রি সাইজ')
          .replace(/with Blouse Piece/gi, '(ব্লাউজ পিস সহ)')
          .replace(/Semi-Stitched/gi, 'সেমি-স্টিচড')
          .replace(/Unstitched/gi, 'আনস্টিচড')
          .replace(/Stitched/gi, 'স্টিচড')
          .replace(/Ready to Wear/gi, 'রেডি টু ওয়্যার');

        return localized;
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

        // 1. Check exact dictionary translation
        if (PRODUCT_TRANSLATIONS[title.trim()]?.name) {
          return PRODUCT_TRANSLATIONS[title.trim()].name;
        }

        // 2. Multi-word phrase translation
        let localized = title;
        const replacements = [
          [/Kashmiri Katan Saree with Blouse Piece/gi, 'কাশ্মীরি কাতান শাড়ি (ব্লাউজ পিস সহ)'],
          [/Afsan Print Sharee with Blouse Piece/gi, 'আফসান প্রিন্ট শাড়ি (ব্লাউজ পিস সহ)'],
          [/Afsan Print Saree with Blouse Piece/gi, 'আফসান প্রিন্ট শাড়ি (ব্লাউজ পিস সহ)'],
          [/Royal Heritage Jamdani Saree/gi, 'রয়েল হেরিটেজ ঢাকাই জামদানি শাড়ি'],
          [/Embroidered Georgette Salwar Kameez/gi, 'এমব্রয়ডারি জর্জেট সালোয়ার কামিজ (৩-পিস)'],
          [/Contemporary Silk Kurti & Co-ord Set/gi, 'কনটেম্পরারি সিল্ক কুর্তি ও কর্ড সেট'],
          [/Velvet Festive Shawl & Party Wrap/gi, 'ভেলভেট ফেস্টিভ শাল ও পার্টি র‍্যাপ'],
          [/Dhakai Jamdani Saree/gi, 'ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি'],
          [/Dhakai Jamdani/gi, 'ঢাকাই জামদানি'],
          [/Jamdani Saree/gi, 'জামদানি শাড়ি'],
          [/Jamdani/gi, 'জামদানি'],
          [/Mirpur Katan Silk Saree/gi, 'মিরপুর কাতান সিল্ক শাড়ি'],
          [/Mirpur Katan/gi, 'মিরপুর কাতান'],
          [/Katan Silk Saree/gi, 'কাতান সিল্ক শাড়ি'],
          [/Katan Saree/gi, 'কাতান শাড়ি'],
          [/Katan/gi, 'কাতান'],
          [/Pure Silk Saree/gi, 'পিওর সিল্ক শাড়ি'],
          [/Silk Saree/gi, 'সিল্ক শাড়ি'],
          [/Silk/gi, 'সিল্ক'],
          [/Benarasi Saree/gi, 'বেনারসি শাড়ি'],
          [/Benarasi/gi, 'বেনারসি'],
          [/Banarasi Saree/gi, 'বেনারসি শাড়ি'],
          [/Banarasi/gi, 'বেনারসি'],
          [/Pakistani Luxury Lawn 3-Piece/gi, 'পাকিস্তানি লাক্সারি লন ৩-পিস'],
          [/Pakistani Lawn 3-Piece/gi, 'পাকিস্তানি লন ৩-পিস'],
          [/Pakistani Lawn/gi, 'পাকিস্তানি লন'],
          [/Luxury Lawn/gi, 'লাক্সারি লন'],
          [/3-Piece/gi, '৩-পিস'],
          [/Three Piece/gi, 'থ্রি পিস'],
          [/2-Piece/gi, '২-পিস'],
          [/Two Piece/gi, 'টু পিস'],
          [/Salwar Kameez/gi, 'সালোয়ার কামিজ'],
          [/Bridal Lehenga Choli/gi, 'ব্রাইডাল লেহেঙ্গা চোলি'],
          [/Bridal Lehenga/gi, 'ব্রাইডাল লেহেঙ্গা'],
          [/Party Lehenga/gi, 'পার্টি লেহেঙ্গা'],
          [/Lehenga Choli/gi, 'লেহেঙ্গা চোলি'],
          [/Lehenga/gi, 'লেহেঙ্গা'],
          [/Designer Kurti/gi, 'ডিজাইনার কুর্তি'],
          [/Silk Kurti/gi, 'সিল্ক কুর্তি'],
          [/Cotton Kurti/gi, 'সুতি কুর্তি'],
          [/Kurti/gi, 'কুর্তি'],
          [/Kurtis/gi, 'কুর্তি'],
          [/Tunic/gi, 'টিউনিক'],
          [/Tunics/gi, 'টিউনিক'],
          [/Western Tops/gi, 'ওয়েস্টার্ন টপস'],
          [/Tops/gi, 'টপস'],
          [/Top/gi, 'টপ'],
          [/Dubai Cherry Abaya/gi, 'দুবাই চেরি আবায়া'],
          [/Cherry Abaya/gi, 'চেরি আবায়া'],
          [/Abaya/gi, 'আবায়া'],
          [/Abayas/gi, 'আবায়া'],
          [/Borka/gi, 'বোরকা'],
          [/Burqa/gi, 'বোরকা'],
          [/Hijab/gi, 'হিজাব'],
          [/Hijabs/gi, 'হিজাব'],
          [/Khimar/gi, 'খিমার'],
          [/Co-ord Set/gi, 'কর্ড সেট'],
          [/Coord Set/gi, 'কর্ড সেট'],
          [/Co-ord/gi, 'কর্ড সেট'],
          [/Saree/gi, 'শাড়ি'],
          [/Sari/gi, 'শাড়ি'],
          [/Sharee/gi, 'শাড়ি'],
          [/Embroidered/gi, 'এমব্রয়ডারি'],
          [/Embroidery/gi, 'এমব্রয়ডারি'],
          [/Georgette/gi, 'জর্জেট'],
          [/Organza/gi, 'অরগাঞ্জা'],
          [/Chiffon/gi, 'শিফন'],
          [/Muslin/gi, 'মসলিন'],
          [/Linen/gi, 'লিনেন'],
          [/Velvet/gi, 'ভেলভেট'],
          [/Shawl/gi, 'শাল'],
          [/Shawls/gi, 'শাল'],
          [/Handloom/gi, 'হ্যান্ডলুম তাঁতের'],
          [/Tant/gi, 'তাঁতের'],
          [/Cotton/gi, 'সুতি'],
          [/with Blouse Piece/gi, 'ব্লাউজ পিস সহ'],
          [/Blouse Piece/gi, 'ব্লাউজ পিস'],
          [/with Hijab/gi, 'হিজাব সহ'],
          [/Kashmiri/gi, 'কাশ্মীরি'],
          [/Afsan Print/gi, 'আফসান প্রিন্ট'],
          [/Afsan/gi, 'আফসান'],
          [/Shiny Silk/gi, 'শাইনি সিল্ক'],
          [/Shiny/gi, 'শাইনি'],
          [/Soft/gi, 'সফট'],
          [/Semi Pure/gi, 'সেমি পিওর'],
          [/Semi/gi, 'সেমি'],
          [/Pure/gi, 'পিওর'],
          [/Party Wear/gi, 'পার্টি পোশাক'],
          [/Bridal Wear/gi, 'ব্রাইডাল পোশাক'],
          [/Party Wrap/gi, 'পার্টি র‍্যাপ'],
          [/Party/gi, 'পার্টি'],
          [/Festive/gi, 'উৎসব কালেকশন'],
          [/Gown/gi, 'গাউন'],
          [/Gowns/gi, 'গাউন'],
          [/Maxi Dress/gi, 'ম্যাক্সি ড্রেস'],
          [/Maxi/gi, 'ম্যাক্সি'],
          [/Palazzo/gi, 'প্লাজো'],
          [/Trousers/gi, 'ট্রাউজার'],
          [/Pants/gi, 'প্যান্ট'],
          [/Suit/gi, 'স্যুট'],
          [/Set/gi, 'সেট'],
          [/Dress/gi, 'ড্রেস'],
          [/Wrap/gi, 'র‍্যাপ'],
          [/Printed/gi, 'প্রিন্টেড'],
          [/Digital Print/gi, 'ডিজিটাল প্রিন্ট'],
          [/Block Print/gi, 'ব্লক প্রিন্ট'],
          [/Batik/gi, 'বাটিক'],
          [/Chunri/gi, 'চুন্দ্রি'],
          [/Exclusive/gi, 'এক্সক্লুসিভ'],
          [/Premium/gi, 'প্রিমিয়াম'],
          [/Royal/gi, 'রয়্যাল'],
          [/Heritage/gi, 'হেরিটেজ'],
          [/Contemporary/gi, 'কনটেম্পরারি'],
          [/Casual/gi, 'ক্যাজুয়াল']
        ];

        replacements.forEach(([regex, bengaliReplacement]) => {
          localized = localized.replace(regex, bengaliReplacement);
        });

        return localized;
      },

      // Product Description localizer
      localizeDescription: (description, title = '') => {
        if (!description || typeof description !== 'string') return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return description;

        // 1. Check exact dictionary match by title
        if (title && PRODUCT_TRANSLATIONS[title.trim()]?.description) {
          return PRODUCT_TRANSLATIONS[title.trim()].description;
        }

        // 2. Check phrase matches for live & seeded catalog items
        let text = description;
        if (text.includes('Kashmiri Katan Saree') || text.includes('serene beauty of Kashmir')) {
          return 'অভিজাত ও নিখুঁত সিল্ক সুতায় বোনা প্রিমিয়াম কাশ্মীরি কাতান শাড়ি। কাশ্মীরের ঐতিহ্যবাহী নান্দনিক নকশায় সাজানো এই শাড়িটি যেকোনো উৎসব, বিয়ে বা স্পেশাল অকেশনে আপনাকে দেবে এক অনন্য ও রাজকীয় আভিজাত্য। ম্যাচিং ব্লাউজ পিস সহ সম্পূর্ণ ১২ হাত শাড়ি।';
        }
        if (text.includes('Afsan Print Sharee') || text.includes('ethereal beauty of the Afsan Print')) {
          return 'নান্দনিক ও প্রিমিয়াম ডিজাইনে তৈরি এক্সক্লুসিভ আফসান প্রিন্ট শাড়ি। ঐতিহ্যবাহী কারুকাজ ও আধুনিক ফ্যাশনের অপূর্ব সংমিশ্রণে অত্যন্ত মসৃণ ও আরামদায়ক কাপড়ে তৈরি। উৎসব ও অনুষ্ঠানে স্টাইলিশ লুকের জন্য ম্যাচিং ব্লাউজ পিস সহ ১২ হাত শাড়ি।';
        }
        if (text.includes('Masterfully handwoven Dhakai Jamdani')) {
          return 'দক্ষ তাঁতিদের হাতে বোনা খাঁটি ঢাকাই জামদানি শাড়ি। এতে রয়েছে নান্দনিক ফ্লোরাল মোটিফ, উজ্জ্বল মেরুন শেড এবং সোনালী জরির অভিজাত বর্ডার।';
        }
        if (text.includes('Elegant three-piece luxury suit')) {
          return 'সূক্ষ্ম সুতার নিপুণ এমব্রয়ডারি কাজ করা প্রিমিয়াম জর্জেট থ্রি-পিস স্যুট ও সফট অরগাঞ্জা ওড়না। যেকোনো উৎসবের জন্য আভিজাত্যময় সাজ।';
        }
        if (text.includes('Modern silhouette combining traditional')) {
          return 'আধুনিক ট্রেন্ড ও ঐতিহ্যবাহী রুচির মেলবন্ধনে তৈরি পিওর সিল্ক ব্লেন্ড কুর্তি ও কর্ড সেট। পরায় অত্যন্ত আরামদায়ক ও স্টাইলিশ।';
        }
        if (text.includes('Ultra-soft micro velvet festive')) {
          return 'হাতে করা সূক্ষ্ম জরি এমব্রয়ডারি পাড়যুক্ত অত্যন্ত নরম মাইক্রো ভেলভেট শীতকালীন লাক্সারি শাল। উৎসব ও পার্টির পারফেক্ট অনুষঙ্গ।';
        }

        // 3. Heuristic dictionary replacement for generic product descriptions
        const descReplacements = [
          [/Drape yourself in the timeless elegance of our/gi, 'নিজেকে সাজিয়ে নিন আমাদের অনন্য ও অভিজাত'],
          [/Drape yourself in the ethereal beauty of the/gi, 'নিজেকে সাজিয়ে নিন নজরকাড়া সৌন্দর্যের'],
          [/a masterpiece woven with the finest silk threads/gi, 'নিখুঁত সিল্ক সুতায় বোনা এক অনন্য মাস্টারপিস'],
          [/This exquisite creation showcases intricate patterns/gi, 'এই নান্দনিক সৃষ্টিতে ফুটে উঠেছে সূক্ষ্ম কারুকাজ'],
          [/promising a regal allure and unparalleled sophistication for every special occasion/gi, 'যা যেকোনো বিশেষ অনুষ্ঠানে আপনাকে দেবে রাজকীয় ও আকর্ষণীয় আভিজাত্য'],
          [/Masterfully handwoven/gi, 'দক্ষ কারিগরদের নিপুণ হাতে বোনা'],
          [/handwoven/gi, 'হাতে বোনা'],
          [/intricate floral motifs/gi, 'সূক্ষ্ম ফ্লোরাল মোটিফ ও নকশা'],
          [/royal maroon hues/gi, 'অভিজাত রাজকীয় মেরুন শেড'],
          [/metallic gold zari borders/gi, 'সোনালী জরি বর্ডারযুক্ত'],
          [/gold zari/gi, 'সোনালী জরি'],
          [/zari borders/gi, 'জরি পাড়'],
          [/three-piece luxury suit/gi, 'লাক্সারি থ্রি-পিস স্যুট'],
          [/exquisite tonal thread embroidery/gi, 'আকর্ষণীয় রঙের সুতার এমব্রয়ডারি'],
          [/organza dupatta/gi, 'অরগাঞ্জা ওড়না'],
          [/silk dupatta/gi, 'সিল্ক ওড়না'],
          [/festive charm and timeless grace/gi, 'উৎসবের আভিজাত্য ও নান্দনিক সৌন্দর্য'],
          [/traditional craftsmanship/gi, 'ঐতিহ্যবাহী কারুশিল্প'],
          [/western aesthetic/gi, 'আধুনিক ওয়েস্টার্ন লুক'],
          [/breathable, flattering, and effortless to style/gi, 'পরম আরামদায়ক, মানানসই ও সহজে পরিধানযোগ্য'],
          [/ultra-soft micro velvet/gi, 'অত্যন্ত নরম মাইক্রো ভেলভেট'],
          [/hand-embroidered borders/gi, 'হাতে কারুকাজ করা এমব্রয়ডারি বর্ডার'],
          [/perfect accessory/gi, 'নিখুঁত অনুষঙ্গ'],
          [/celebratory look/gi, 'উৎসবের জমকালো সাজ'],
          [/with a matching blouse piece/gi, 'ম্যাচিং ব্লাউজ পিস সহ'],
          [/complete with a matching blouse piece/gi, 'ম্যাচিং ব্লাউজ পিস সহ সম্পূর্ণ'],
          [/Dry clean recommended/gi, 'ড্রাই ওয়াশ প্রযোজ্য'],
          [/Dry clean only/gi, 'শুধুমাত্র ড্রাই ওয়াশ'],
          [/Gentle dry clean/gi, 'হালকা ড্রাই ক্লিন'],
          [/Hand wash cold/gi, 'ঠান্ডা পানিতে হাত ধোয়া'],
          [/Machine wash/gi, 'মেশিন ওয়াশ']
        ];

        descReplacements.forEach(([regex, bnStr]) => {
          text = text.replace(regex, bnStr);
        });

        return text;
      },

      // Color localizer
      localizeColor: (color) => {
        if (!color) return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return color;
        return COLOR_TRANSLATIONS[color.trim()] || color;
      },

      // Fabric details localizer
      localizeFabric: (fabricDetails) => {
        if (!fabricDetails) return null;
        const lang = get().language || 'bn';
        if (lang === 'en') return fabricDetails;

        let mat = fabricDetails.material || '';
        if (FABRIC_TRANSLATIONS[mat.trim()]) {
          mat = FABRIC_TRANSLATIONS[mat.trim()];
        } else {
          mat = mat
            .replace(/Pure Katan Silk/gi, 'খাঁটি কাতান সিল্ক')
            .replace(/Premium Silk Blend/gi, 'প্রিমিয়াম সিল্ক ব্লেন্ড')
            .replace(/Pure Silk/gi, 'খাঁটি সিল্ক')
            .replace(/Pure Cotton/gi, 'খাঁটি সুতি')
            .replace(/Pure/gi, 'পিওর')
            .replace(/Katan/gi, 'কাতান')
            .replace(/Silk/gi, 'সিল্ক')
            .replace(/Cotton/gi, 'সুতি')
            .replace(/Georgette/gi, 'জর্জেট')
            .replace(/Organza/gi, 'অরগাঞ্জা')
            .replace(/Chiffon/gi, 'শিফন')
            .replace(/Velvet/gi, 'ভেলভেট')
            .replace(/Viscose/gi, 'ভিসকোস')
            .replace(/with/gi, 'সাথে')
            .replace(/Dupatta/gi, 'ওড়না');
        }

        let gsm = fabricDetails.gsm || '';
        if (FABRIC_TRANSLATIONS[gsm.trim()]) {
          gsm = FABRIC_TRANSLATIONS[gsm.trim()];
        } else if (gsm && gsm.trim()) {
          const numOnly = gsm.replace(/[^0-9]/g, '');
          gsm = numOnly ? `${numOnly} জিএসএম` : gsm;
        } else {
          gsm = '';
        }

        let wash = fabricDetails.washInstruction || '';
        if (FABRIC_TRANSLATIONS[wash.trim()]) {
          wash = FABRIC_TRANSLATIONS[wash.trim()];
        } else {
          wash = wash
            .replace(/Dry clean recommended/gi, 'ড্রাই ওয়াশ করার পরামর্শ দেয়া হচ্ছে')
            .replace(/Dry clean only/gi, 'শুধুমাত্র ড্রাই ওয়াশ')
            .replace(/Gentle dry clean/gi, 'হালকা ড্রাই ক্লিন')
            .replace(/Hand wash cold/gi, 'ঠান্ডা পানিতে হাত ধোয়া')
            .replace(/Machine wash/gi, 'মেশিন ওয়াশ');
        }

        return {
          material: mat,
          gsm: gsm,
          washInstruction: wash
        };
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

