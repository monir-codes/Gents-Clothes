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

      // Price formatter helper: returns "৳ 2,500" (Standard, clear eCommerce format)
      formatPrice: (price) => {
        if (price === undefined || price === null || isNaN(Number(price))) return '৳ 0';
        const formattedEn = Number(price).toLocaleString('en-US');
        return `৳ ${formattedEn}`;
      },

      // Number formatter helper
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
          .replace(/12 Haat with Unstitched Blouse Piece/gi, '১২ হাত (আনস্টিচড ব্লাউজ পিস সহ)')
          .replace(/12 Haat with Blouse Piece/gi, '১২ হাত (ব্লাউজ পিস সহ)')
          .replace(/12 Haat \(Free Size\)/gi, '১২ হাত (ফ্রি সাইজ)')
          .replace(/12 Haat/gi, '১২ হাত')
          .replace(/14 Haat with Blouse Piece/gi, '১৪ হাত (ব্লাউজ পিস সহ)')
          .replace(/14 Haat/gi, '১৪ হাত')
          .replace(/Unstitched \(Free Size\)/gi, 'আনস্টিচড (ফ্রি সাইজ)')
          .replace(/Free Size with Matching Hijab/gi, 'ফ্রি সাইজ (ম্যাচিং হিজাব সহ)')
          .replace(/Free Size with Hijab/gi, 'ফ্রি সাইজ (হিজাব সহ)')
          .replace(/Free Size/gi, 'ফ্রি সাইজ')
          .replace(/with Blouse Piece/gi, '(ব্লাউজ পিস সহ)')
          .replace(/Semi-Stitched/gi, 'সেমি-স্টিচড')
          .replace(/Unstitched/gi, 'আনস্টিচড')
          .replace(/Stitched/gi, 'স্টিচড')
          .replace(/Ready to Wear|Ready-to-Wear/gi, 'রেডি টু ওয়্যার')
          .replace(/Standard Free Size/gi, 'স্ট্যান্ডার্ড ফ্রি সাইজ')
          .replace(/Custom Fit/gi, 'কাস্টম ফিট');

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

        // 1. Exact dictionary match
        if (PRODUCT_TRANSLATIONS[title.trim()]?.name) {
          return PRODUCT_TRANSLATIONS[title.trim()].name;
        }

        // 2. Comprehensive multi-phrase translation (ordered longest to shortest)
        let localized = title;
        const replacements = [
          // Festival & Special Collections
          [/Special Puja Collection/gi, 'পূজা স্পেশাল কালেকশন'],
          [/Puja Special Collection/gi, 'পূজা স্পেশাল কালেকশন'],
          [/Puja Collection/gi, 'পূজা কালেকশন'],
          [/Special Eid Collection/gi, 'ঈদ স্পেশাল কালেকশন'],
          [/Eid Special Collection/gi, 'ঈদ স্পেশাল কালেকশন'],
          [/Eid Collection/gi, 'ঈদ কালেকশন'],
          [/Festive Collection/gi, 'উৎসব কালেকশন'],
          [/Special Collection/gi, 'স্পেশাল কালেকশন'],
          [/Exclusive Collection/gi, 'এক্সক্লুসিভ কালেকশন'],
          [/New Collection/gi, 'নতুন কালেকশন'],
          [/Summer Collection/gi, 'সামার কালেকশন'],
          [/Winter Collection/gi, 'শীতকালীন কালেকশন'],
          [/Wedding Collection/gi, 'ওয়েডিং কালেকশন'],
          [/Bridal Collection/gi, 'ব্রাইডাল কালেকশন'],
          [/Puja/gi, 'পূজা'],
          [/Festive/gi, 'উৎসব কালেকশন'],
          [/Collection/gi, 'কালেকশন'],

          // Saree & Traditional Categories
          [/Kashmiri Katan Saree with Blouse Piece/gi, 'কাশ্মীরি কাতান শাড়ি (ব্লাউজ পিস সহ)'],
          [/Afsan Print Sharee with Blouse Piece/gi, 'আফসান প্রিন্ট শাড়ি (ব্লাউজ পিস সহ)'],
          [/Afsan Print Saree with Blouse Piece/gi, 'আফসান প্রিন্ট শাড়ি (ব্লাউজ পিস সহ)'],
          [/Royal Heritage Jamdani Saree/gi, 'রয়েল হেরিটেজ ঢাকাই জামদানি শাড়ি'],
          [/Dhakai Jamdani Saree/gi, 'ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি'],
          [/Mirpur Katan Silk Saree/gi, 'মিরপুর কাতান সিল্ক শাড়ি'],
          [/Mirpur Katan/gi, 'মিরপুর কাতান'],
          [/Katan Silk Saree/gi, 'কাতান সিল্ক শাড়ি'],
          [/Katan Saree/gi, 'কাতান শাড়ি'],
          [/Katan Silk/gi, 'কাতান সিল্ক'],
          [/Katan/gi, 'কাতান'],
          [/Dhakai Jamdani/gi, 'ঢাকাই জামদানি'],
          [/Jamdani Saree/gi, 'জামদানি শাড়ি'],
          [/Jamdani/gi, 'জামদানি'],
          [/Benarasi Saree|Banarasi Saree/gi, 'বেনারসি শাড়ি'],
          [/Benarasi|Banarasi/gi, 'বেনারসি'],
          [/Pure Katan Silk/gi, 'খাঁটি কাতান সিল্ক'],
          [/Pure Silk Saree/gi, 'পিওর সিল্ক শাড়ি'],
          [/Pure Silk/gi, 'পিওর সিল্ক'],
          [/Semi Silk Saree/gi, 'সেমি সিল্ক শাড়ি'],
          [/Semi Silk/gi, 'সেমি সিল্ক'],
          [/Half Silk Saree/gi, 'হাফ সিল্ক শাড়ি'],
          [/Half Silk|Half-Silk/gi, 'হাফ সিল্ক'],
          [/Soft Silk Saree/gi, 'সফট সিল্ক শাড়ি'],
          [/Soft Silk/gi, 'সফট সিল্ক'],
          [/Shiny Silk/gi, 'শাইনি সিল্ক'],
          [/Silk Saree/gi, 'সিল্ক শাড়ি'],
          [/Pure Cotton Saree/gi, 'পিওর সুতি শাড়ি'],
          [/Handloom Cotton Saree/gi, 'হ্যান্ডলুম তাঁতের শাড়ি'],
          [/Tangail Tant Saree|Tangail Tant/gi, 'টাঙ্গাইল তাঁতের শাড়ি'],
          [/Monipuri Tant Saree|Monipuri Tant/gi, 'মণিপুরী তাঁতের শাড়ি'],
          [/Tant Saree/gi, 'তাঁতের শাড়ি'],
          [/Tant/gi, 'তাঁতের'],
          [/Cotton Saree/gi, 'সুতি শাড়ি'],
          [/Georgette Saree/gi, 'জর্জেট শাড়ি'],
          [/Organza Saree/gi, 'অরগাঞ্জা শাড়ি'],
          [/Chiffon Saree/gi, 'শিফন শাড়ি'],
          [/Muslin Saree/gi, 'মসলিন শাড়ি'],
          [/Linen Saree/gi, 'লিনেন শাড়ি'],

          // Prints & Craftsmanship
          [/Block Printed Saree/gi, 'ব্লক প্রিন্টেড শাড়ি'],
          [/Block Printed/gi, 'ব্লক প্রিন্টেড'],
          [/Block Print/gi, 'ব্লক প্রিন্ট'],
          [/Block\s*প্রিন্টেড/gi, 'ব্লক প্রিন্টেড'],
          [/Block\s*প্রিন্ট/gi, 'ব্লক প্রিন্ট'],
          [/Block/gi, 'ব্লক প্রিন্ট'],
          [/Half\s*সিল্ক/gi, 'হাফ সিল্ক'],
          [/Half/gi, 'হাফ'],
          [/Digital Printed/gi, 'ডিজিটাল প্রিন্টেড'],
          [/Digital Print/gi, 'ডিজিটাল প্রিন্ট'],
          [/Screen Printed|Screen Print/gi, 'স্ক্রিন প্রিন্ট'],
          [/Hand Printed|Hand Print/gi, 'হ্যান্ড প্রিন্ট'],
          [/Afsan Print/gi, 'আফসান প্রিন্ট'],
          [/Afsan/gi, 'আফসান'],
          [/Batik Print|Batik/gi, 'বাটিক'],
          [/Chunri Print|Chunri/gi, 'চুন্দ্রি'],
          [/Mirror Work/gi, 'মিরর ওয়ার্ক'],
          [/Zari Work/gi, 'জরি ওয়ার্ক'],
          [/Gold Zari|Golden Zari/gi, 'সোনালী জরি'],
          [/Zari/gi, 'জরি'],
          [/Karchupi Work|Karchupi/gi, 'কারচুপি'],
          [/Sequin Work|Sequin|Sequence/gi, 'সিকোয়েন্স'],
          [/Embroidered|Embroidery/gi, 'এমব্রয়ডারি'],
          [/Printed/gi, 'প্রিন্টেড'],
          [/Print/gi, 'প্রিন্ট'],

          // 3-Piece, 2-Piece, Suits & Kurtis
          [/Pakistani Luxury Lawn 3-Piece/gi, 'পাকিস্তানি লাক্সারি লন ৩-পিস'],
          [/Pakistani Lawn 3-Piece/gi, 'পাকিস্তানি লন ৩-পিস'],
          [/Pakistani Lawn/gi, 'পাকিস্তানি লন'],
          [/Luxury Lawn/gi, 'লাক্সারি লন'],
          [/Lawn 3-Piece/gi, 'লন ৩-পিস'],
          [/Three-Piece Salwar Kameez|3-Piece Salwar Kameez/gi, 'সালোয়ার কামিজ (৩-পিস)'],
          [/Three Piece Salwar Kameez|3 Piece Salwar Kameez/gi, 'সালোয়ার কামিজ (৩-পিস)'],
          [/Salwar Kameez/gi, 'সালোয়ার কামিজ'],
          [/3-Piece Suit|Three Piece Suit|3-Piece|3 Piece|Three Piece/gi, '৩-পিস'],
          [/2-Piece Kurti Set|Two Piece Kurti Set|2-Piece Set|2-Piece|2 Piece|Two Piece/gi, '২-পিস'],
          [/Designer Kurti/gi, 'ডিজাইনার কুর্তি'],
          [/Silk Kurti/gi, 'সিল্ক কুর্তি'],
          [/Cotton Kurti/gi, 'সুতি কুর্তি'],
          [/Kurti & Co-ord Set/gi, 'কুর্তি ও কর্ড সেট'],
          [/Co-ord Set|Coord Set|Co-ord/gi, 'কর্ড সেট'],
          [/Kurti/gi, 'কুর্তি'],
          [/Kurtis/gi, 'কুর্তি'],
          [/Tunic/gi, 'টিউনিক'],
          [/Tunics/gi, 'টিউনিক'],
          [/Western Tops|Tops/gi, 'টপস'],
          [/Top/gi, 'টপ'],

          // Modest Wear & Abayas
          [/Dubai Cherry Abaya with Hijab/gi, 'দুবাই চেরি আবায়া (হিজাব সহ)'],
          [/Dubai Cherry Abaya/gi, 'দুবাই চেরি আবায়া'],
          [/Cherry Abaya/gi, 'চেরি আবায়া'],
          [/Front-Open Abaya|Front Open Abaya/gi, 'ফ্রন্ট ওপেন আবায়া'],
          [/Kimono Abaya/gi, 'কিমোনো আবায়া'],
          [/Abaya/gi, 'আবায়া'],
          [/Abayas/gi, 'আবায়া'],
          [/Borka/gi, 'বোরকা'],
          [/Burqa/gi, 'বোরকা'],
          [/Hijab/gi, 'হিজাব'],
          [/Hijabs/gi, 'হিজাব'],
          [/Khimar/gi, 'খিমার'],

          // Lehengas, Gowns & Shawls
          [/Bridal Lehenga Choli/gi, 'ব্রাইডাল লেহেঙ্গা চোলি'],
          [/Bridal Lehenga/gi, 'ব্রাইডাল লেহেঙ্গা'],
          [/Party Lehenga/gi, 'পার্টি লেহেঙ্গা'],
          [/Lehenga Choli/gi, 'লেহেঙ্গা চোলি'],
          [/Lehenga/gi, 'লেহেঙ্গা'],
          [/Velvet Festive Shawl & Party Wrap/gi, 'ভেলভেট ফেস্টিভ শাল ও পার্টি র‍্যাপ'],
          [/Festive Shawl/gi, 'ফেস্টিভ শাল'],
          [/Velvet Shawl/gi, 'ভেলভেট শাল'],
          [/Shawl|Shawls/gi, 'শাল'],
          [/Pashmina/gi, 'পশমিনা'],
          [/Maxi Dress/gi, 'ম্যাক্সি ড্রেস'],
          [/Maxi/gi, 'ম্যাক্সি'],
          [/Anarkali Gown/gi, 'আনারকলি গাউন'],
          [/Anarkali/gi, 'আনারকলি'],
          [/Gown/gi, 'গাউন'],
          [/Gowns/gi, 'গাউন'],
          [/Palazzo/gi, 'প্লাজো'],
          [/Palazzos/gi, 'প্লাজো'],
          [/Trousers/gi, 'ট্রাউজার'],
          [/Pants/gi, 'প্যান্ট'],
          [/Suit/gi, 'স্যুট'],
          [/Suits/gi, 'স্যুট'],
          [/Set/gi, 'সেট'],
          [/Sets/gi, 'সেট'],
          [/Dress/gi, 'ড্রেস'],
          [/Wrap/gi, 'র‍্যাপ'],

          // Fabric & Details
          [/Georgette/gi, 'জর্জেট'],
          [/Organza/gi, 'অরগাঞ্জা'],
          [/Chiffon/gi, 'শিফন'],
          [/Muslin/gi, 'মসলিন'],
          [/Linen/gi, 'লিনেন'],
          [/Velvet/gi, 'ভেলভেট'],
          [/Cotton/gi, 'সুতি'],
          [/Silk/gi, 'সিল্ক'],
          [/Handloom/gi, 'হ্যান্ডলুম'],
          [/with Unstitched Blouse Piece/gi, '(আনস্টিচড ব্লাউজ পিস সহ)'],
          [/with Blouse Piece/gi, '(ব্লাউজ পিস সহ)'],
          [/Blouse Piece/gi, 'ব্লাউজ পিস'],
          [/with Matching Hijab/gi, '(ম্যাচিং হিজাব সহ)'],
          [/with Hijab/gi, '(হিজাব সহ)'],
          [/with Matching Dupatta/gi, '(ম্যাচিং ওড়না সহ)'],
          [/with Dupatta/gi, '(ওড়না সহ)'],
          [/with/gi, 'সহ'],

          // Brand & Styles
          [/Kashmiri/gi, 'কাশ্মীরি'],
          [/Pakistani/gi, 'পাকিস্তানি'],
          [/Indian/gi, 'ইন্ডিয়ান'],
          [/Dubai/gi, 'দুবাই'],
          [/Cherry/gi, 'চেরি'],
          [/Boutique/gi, 'বুটিক'],
          [/Semi/gi, 'সেমি'],
          [/Pure/gi, 'পিওর'],
          [/Soft/gi, 'সফট'],
          [/Party Wear|Party/gi, 'পার্টি'],
          [/Bridal Wear|Bridal/gi, 'ব্রাইডাল'],
          [/Wedding/gi, 'ওয়েডিং'],
          [/Exclusive/gi, 'এক্সক্লুসিভ'],
          [/Premium/gi, 'প্রিমিয়াম'],
          [/Luxury/gi, 'লাক্সারি'],
          [/Royal/gi, 'রয়্যাল'],
          [/Heritage/gi, 'হেরিটেজ'],
          [/Contemporary/gi, 'কনটেম্পরারি'],
          [/Casual/gi, 'ক্যাজুয়াল'],
          [/Sharee|Saree|Sari/gi, 'শাড়ি']
        ];

        replacements.forEach(([regex, bengaliReplacement]) => {
          localized = localized.replace(regex, bengaliReplacement);
        });

        // 3. Clean up duplicated phrases
        localized = localized
          .replace(/(উৎসব কালেকশন\s*)+/g, 'উৎসব কালেকশন ')
          .replace(/(পূজা কালেকশন\s*)+/g, 'পূজা কালেকশন ')
          .replace(/(কালেকশন\s*)+/g, 'কালেকশন ')
          .replace(/(শাড়ি\s*)+/g, 'শাড়ি ')
          .replace(/(সিল্ক\s*)+/g, 'সিল্ক ')
          .replace(/(ব্লক প্রিন্ট\s*)+/g, 'ব্লক প্রিন্ট ')
          .replace(/(ব্লক\s*)+/g, 'ব্লক ')
          .replace(/\s{2,}/g, ' ')
          .trim();

        return localized;
      },

      // Product Description localizer (Intelligent High-End Bengali Copywriter)
      localizeDescription: (description, title = '') => {
        if (!description || typeof description !== 'string') return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return description;

        // 1. Check exact dictionary match by title
        if (title && PRODUCT_TRANSLATIONS[title.trim()]?.description) {
          return PRODUCT_TRANSLATIONS[title.trim()].description;
        }

        // 2. High-converting natural Bengali templates for known seeded items
        let text = description;
        if (text.includes('Kashmiri Katan Saree') || text.includes('serene beauty of Kashmir')) {
          return 'অভিজাত ও নিখুঁত সিল্ক সুতায় বোনা প্রিমিয়াম কাশ্মীরি কাতান শাড়ি। কাশ্মীরের ঐতিহ্যবাহী নান্দনিক নকশায় সাজানো এই শাড়িটি যেকোনো উৎসব, বিয়ে বা স্পেশাল অকেশনে আপনাকে দেবে এক অনন্য ও রাজকীয় আভিজাত্য। ম্যাচিং ব্লাউজ পিস সহ সম্পূর্ণ ১২ হাত শাড়ি।';
        }
        if (text.includes('Afsan Print Sharee') || text.includes('ethereal beauty of the Afsan Print')) {
          return 'নান্দনিক ও প্রিমিয়াম ডিজাইনে তৈরি এক্সক্লুসিভ আফসান প্রিন্ট শাড়ি। ঐতিহ্যবাহী কারুকাজ ও আধুনিক ফ্যাশনের অপূর্ব সংমিশ্রণে অত্যন্ত মসৃণ ও আরামদায়ক কাপড়ে তৈরি। উৎসব ও অনুষ্ঠানে স্টাইলিশ লুকের জন্য ম্যাচিং ব্লাউজ পিস সহ ১২ হাত শাড়ি।';
        }
        if (text.includes('Masterfully handwoven Dhakai Jamdani') || text.includes('Royal Heritage Jamdani')) {
          return 'দক্ষ তাঁতিদের হাতে বোনা খাঁটি ঢাকাই জামদানি শাড়ি। এতে রয়েছে নান্দনিক ফ্লোরাল মোটিফ, উজ্জ্বল মেরুন শেড এবং সোনালী জরির অভিজাত বর্ডার।';
        }
        if (text.includes('Elegant three-piece luxury suit') || text.includes('Embroidered Georgette Salwar Kameez')) {
          return 'সূক্ষ্ম সুতার নিপুণ এমব্রয়ডারি কাজ করা প্রিমিয়াম জর্জেট থ্রি-পিস স্যুট ও সফট অরগাঞ্জা ওড়না। যেকোনো উৎসবের জন্য আভিজাত্যময় সাজ।';
        }
        if (text.includes('Modern silhouette combining traditional') || text.includes('Contemporary Silk Kurti')) {
          return 'আধুনিক ট্রেন্ড ও ঐতিহ্যবাহী রুচির মেলবন্ধনে তৈরি পিওর সিল্ক ব্লেন্ড কুর্তি ও কর্ড সেট। পরায় অত্যন্ত আরামদায়ক ও স্টাইলিশ।';
        }
        if (text.includes('Ultra-soft micro velvet festive') || text.includes('Velvet Festive Shawl')) {
          return 'হাতে করা সূক্ষ্ম জরি এমব্রয়ডারি পাড়যুক্ত অত্যন্ত নরম মাইক্রো ভেলভেট শীতকালীন লাক্সারি শাল। উৎসব ও পার্টির পারফেক্ট অনুষঙ্গ।';
        }

        // 3. Comprehensive multi-tier sentence and semantic pattern translation
        const sentenceReplacements = [
          // Festival intro sentences
          [/Celebrate the auspicious aura of the festive season with this captivating Half Silk Saree from our Special Puja Collection/gi, 'আমাদের স্পেশাল পূজা কালেকশনের এই আকর্ষণীয় হাফ সিল্ক শাড়ির সাথে উৎসবের আনন্দে নিজেকে সাজিয়ে নিন'],
          [/Celebrate the auspicious aura of the festive season with this captivating/gi, 'উৎসবের এই বিশেষ আনন্দের মৌসুমে নিজেকে সাজিয়ে নিন আকর্ষণীয়'],
          [/Celebrate the festive season with this captivating/gi, 'উৎসবের আনন্দে নিজেকে সাজিয়ে নিন আকর্ষণীয়'],
          [/Celebrate the festive season with this/gi, 'উৎসবের আনন্দে উপভোগ করুন এই চমৎকার'],
          [/from our Special Puja Collection/gi, 'আমাদের স্পেশাল পূজা কালেকশন থেকে'],
          [/from our Special Eid Collection/gi, 'আমাদের স্পেশাল ঈদ কালেকশন থেকে'],
          [/from our Festive Collection/gi, 'আমাদের উৎসব কালেকশন থেকে'],
          [/from our exclusive collection/gi, 'আমাদের এক্সক্লুসিভ কালেকশন থেকে'],
          [/from our collection/gi, 'আমাদের কালেকশন থেকে'],
          [/Drape yourself in the timeless elegance of our/gi, 'নিজেকে সাজিয়ে নিন আমাদের অনন্য ও অভিজাত'],
          [/Drape yourself in the timeless elegance of/gi, 'নিজেকে সাজিয়ে নিন চিরন্তন আভিজাত্যময়'],
          [/Drape yourself in the ethereal beauty of the/gi, 'নিজেকে সাজিয়ে নিন নজরকাড়া সৌন্দর্যের'],
          [/Drape yourself in the ethereal beauty of/gi, 'নিজেকে সাজিয়ে নিন অপরূপ সৌন্দর্যের'],
          [/Embrace effortless elegance with this/gi, 'স্বাচ্ছন্দ্য ও অতুলনীয় সৌন্দর্যে নিজেকে সাজিয়ে নিন এই'],
          [/Step into the spotlight with our/gi, 'যেকোনো অনুষ্ঠানে সবার নজর কাড়তে বেছে নিন আমাদের'],

          // Craftsmanship and Body/Pallu details
          [/Meticulously crafted from a lightweight, ultra-soft semi-silk blend, this saree showcases intricate Jamdani-inspired block print motifs cascading across the body and pallu/gi, 'হালকা ও অত্যন্ত নরম সেমি-সিল্ক কাপড়ে নিপুণভাবে তৈরি এই শাড়ির পুরো জমিন ও আঁচলে রয়েছে জামদানি-অনুপ্রাণিত সূক্ষ্ম ব্লক প্রিন্টের অপরূপ কারুকাজ'],
          [/Meticulously crafted from a lightweight, ultra-soft semi-silk blend/gi, 'হালকা ও পরম নরম সেমি-সিল্ক কাপড়ে নিপুণভাবে তৈরি'],
          [/Meticulously crafted from a lightweight, ultra-soft/gi, 'হালকা ও অত্যন্ত নরম প্রিমিয়াম কাপড়ে তৈরি'],
          [/Meticulously crafted from/gi, 'দক্ষ কারিগরদের নিপুণ দক্ষতায় তৈরি'],
          [/Crafted from a lightweight, ultra-soft/gi, 'অত্যন্ত হালকা ও আরামদায়ক নরম কাপড়ে তৈরি'],
          [/Crafted from premium quality/gi, 'উচ্চমানের প্রিমিয়াম কাপড়ে তৈরি'],
          [/Crafted from/gi, 'উচ্চমানের প্রিমিয়াম ফেব্রিক দিয়ে তৈরি'],
          [/this saree showcases intricate Jamdani-inspired block print motifs cascading across the body and pallu/gi, 'এই শাড়ির পুরো জমিন ও আঁচলে রয়েছে জামদানি-অনুপ্রাণিত সূক্ষ্ম ব্লক প্রিন্ট মোটিফের দারুণ কারুকাজ'],
          [/showcases intricate Jamdani-inspired block print motifs cascading across the body and pallu/gi, 'ফুটে উঠেছে জামদানি-অনুপ্রাণিত সূক্ষ্ম ব্লক প্রিন্টের মনোরম নকশা পুরো বডি ও আঁচলে'],
          [/cascading across the body and pallu/gi, 'যা পুরো বডি ও আঁচল জুড়ে নান্দনিকভাবে সাজানো'],
          [/across the body and pallu/gi, 'পুরো জমিন ও আঁচল জুড়ে'],
          [/across the body and aanchal/gi, 'পুরো জমিন ও আঁচল জুড়ে'],
          [/body and pallu/gi, 'বডি ও আঁচল'],
          [/body and aanchal/gi, 'বডি ও আঁচল'],
          [/Jamdani-inspired block print motifs/gi, 'জামদানি-অনুপ্রাণিত ব্লক প্রিন্ট মোটিফ'],
          [/Jamdani-inspired/gi, 'জামদানি-অনুপ্রাণিত'],
          [/block print motifs/gi, 'ব্লক প্রিন্ট মোটিফ'],
          [/block print/gi, 'ব্লক প্রিন্ট'],
          [/block printed/gi, 'ব্লক প্রিন্টেড'],
          [/this saree showcases/gi, 'এই শাড়িতে রয়েছে'],
          [/this dress showcases/gi, 'এই পোশাকে রয়েছে'],
          [/this outfit showcases/gi, 'এই পোশাকে রয়েছে'],
          [/showcases intricate/gi, 'ফুটে উঠেছে নজরকাড়া সূক্ষ্ম'],
          [/intricate patterns/gi, 'নিখুঁত কারুকাজ ও নকশা'],
          [/intricate floral motifs/gi, 'সূক্ষ্ম ফ্লোরাল মোটিফ ও নকশা'],
          [/a masterpiece woven with the finest silk threads/gi, 'নিখুঁত সিল্ক সুতায় বোনা এক অনন্য মাস্টারপিস'],
          [/This exquisite creation showcases intricate patterns/gi, 'এই নান্দনিক সৃষ্টিতে ফুটে উঠেছে সূক্ষ্ম কারুকাজ'],
          [/Masterfully handwoven/gi, 'দক্ষ কারিগরদের নিপুণ হাতে বোনা'],
          [/handwoven/gi, 'হাতে বোনা'],
          [/royal maroon hues/gi, 'অভিজাত রাজকীয় মেরুন শেড'],
          [/metallic gold zari borders/gi, 'সোনালী জরি বর্ডারযুক্ত'],
          [/gold zari borders/gi, 'সোনালী জরি পাড়'],
          [/gold zari/gi, 'সোনালী জরি'],
          [/zari borders/gi, 'জরি পাড়'],
          [/zari work/gi, 'জরির কারুকাজ'],
          [/exquisite tonal thread embroidery/gi, 'আকর্ষণীয় রঙের সুতার এমব্রয়ডারি'],
          [/thread embroidery/gi, 'সুতার নিপুণ এমব্রয়ডারি'],

          // Drape, Comfort & Texture
          [/Its refined drape and featherlight texture ensure effortless grace and all-day ease, seamlessly blending traditional heritage with contemporary finesse/gi, 'এর চমৎকার কুঁচি ও পালকের মতো হালকা ফেব্রিক সারাদিন স্বাচ্ছন্দ্য ও অতুলনীয় সৌন্দর্য নিশ্চিত করে, যা ঐতিহ্য ও আধুনিক ফ্যাশনের এক দারুণ মেলবন্ধন'],
          [/Its refined drape and featherlight texture ensure effortless grace and all-day ease/gi, 'এর চমৎকার কুঁচি ও পালকের মতো হালকা বয়ন সারাদিন আরাম ও সাবলীল সৌন্দর্য বজায় রাখে'],
          [/ensure effortless grace and all-day ease/gi, 'সারাদিন আরাম ও স্বাচ্ছন্দ্য নিশ্চিত করে'],
          [/effortless grace and all-day ease/gi, 'সারাদিন স্বাচ্ছন্দ্য ও অপরূপ সৌন্দর্য'],
          [/seamlessly blending traditional heritage with contemporary finesse/gi, 'যা চিরন্তন ঐতিহ্য ও আধুনিক ট্রেন্ডের এক অনন্য মেলবন্ধন'],
          [/blending traditional heritage with contemporary finesse/gi, 'ঐতিহ্য ও আধুনিক ফ্যাশনের অপূর্ব সংমিশ্রণ'],
          [/traditional heritage/gi, 'ঐতিহ্যবাহী সংস্কৃতি ও শিল্প'],
          [/contemporary finesse/gi, 'আধুনিক রুচিশীল আভিজাত্য'],
          [/breathable, flattering, and effortless to style/gi, 'পরম আরামদায়ক, মানানসই ও সহজে পরিধানযোগ্য'],
          [/breathable and lightweight/gi, 'হালকা ও নিঃশ্বাসযোগ্য আরামদায়ক'],
          [/featherlight texture/gi, 'পালকের মতো হালকা ফেব্রিক'],
          [/refined drape/gi, 'মনকাড়া কুঁচি ও সুন্দর ফলিং'],
          [/promising a regal allure and unparalleled sophistication for every special occasion/gi, 'যা যেকোনো বিশেষ অনুষ্ঠানে আপনাকে দেবে রাজকীয় ও আকর্ষণীয় আভিজাত্য'],
          [/festive charm and timeless grace/gi, 'উৎসবের আভিজাত্য ও নান্দনিক সৌন্দর্য'],
          [/traditional craftsmanship/gi, 'ঐতিহ্যবাহী কারুশিল্প'],
          [/western aesthetic/gi, 'আধুনিক ওয়েস্টার্ন লুক'],
          [/ultra-soft micro velvet/gi, 'অত্যন্ত নরম মাইক্রো ভেলভেট'],
          [/hand-embroidered borders/gi, 'হাতে কারুকাজ করা এমব্রয়ডারি বর্ডার'],

          // Blouse Piece, Inclusions & Occasions
          [/Complete with an unstitched blouse piece, this saree offers limitless styling possibilities for both daytime rituals and evening festivities/gi, 'ম্যাচিং আনস্টিচড ব্লাউজ পিস সহ এই শাড়িটি দিনের পূজা-অর্চনা ও সন্ধ্যার জমকালো উৎসব—উভয় আয়োজনের জন্যই দারুণ মানানসই'],
          [/Complete with an unstitched blouse piece, this saree offers limitless styling possibilities/gi, 'ম্যাচিং আনস্টিচড ব্লাউজ পিস সহ এই শাড়িটি দেয় আপনার পছন্দমতো নানা স্টাইলে পরার দারুণ সুযোগ'],
          [/Complete with an unstitched blouse piece/gi, 'ম্যাচিং আনস্টিচড ব্লাউজ পিস সহ সম্পূর্ণ'],
          [/with an unstitched blouse piece/gi, 'আনস্টিচড ব্লাউজ পিস সহ'],
          [/with a matching blouse piece/gi, 'ম্যাচিং ব্লাউজ পিস সহ'],
          [/complete with a matching blouse piece/gi, 'ম্যাচিং ব্লাউজ পিস সহ সম্পূর্ণ'],
          [/this saree offers limitless styling possibilities/gi, 'এই শাড়িটি দেয় আপনার পছন্দমতো ডিজাইনে পরার সুযোগ'],
          [/for both daytime rituals and evening festivities/gi, 'দিনের আয়োজন ও সন্ধ্যার জমকালো উৎসব উভয়ের জন্যই'],
          [/daytime rituals and evening festivities/gi, 'দিনের ও রাতের যেকোনো উৎসব-অনুষ্ঠান'],
          [/daytime and evening wear/gi, 'দিন ও রাতের যেকোনো আয়োজন'],
          [/Comes with a matching organza dupatta/gi, 'সাথে রয়েছে ম্যাচিং সফট অরগাঞ্জা ওড়না'],
          [/Comes with a matching chiffon dupatta/gi, 'সাথে রয়েছে ম্যাচিং সফট শিফন ওড়না'],
          [/organza dupatta/gi, 'অরগাঞ্জা ওড়না'],
          [/silk dupatta/gi, 'সিল্ক ওড়না'],
          [/matching dupatta/gi, 'ম্যাচিং ওড়না'],
          [/matching hijab/gi, 'ম্যাচিং হিজাব'],
          [/three-piece luxury suit/gi, 'লাক্সারি থ্রি-পিস স্যুট'],

          // Styling and Accessories Advice
          [/Complement its artisanal detailing with silver temple jewellery, statement jhumkas, and a delicate bindi to radiate quintessential festive elegance/gi, 'শাড়ির শৈল্পিক কারুকাজের সাথে মানানসই সিলভার জুয়েলারি, নজরকাড়া ঝুমকা ও একটি ছোট্ট টিপ পরে প্রকাশ করুন উৎসবের পূর্ণাঙ্গ আভিজাত্য'],
          [/Complement its artisanal detailing with/gi, 'এর শৈল্পিক কারুকাজের সাথে মানানসই'],
          [/silver temple jewellery, statement jhumkas, and a delicate bindi/gi, 'ঐতিহ্যবাহী সিলভার জুয়েলারি, নজরকাড়া ঝুমকা ও একটি ছোট্ট টিপ'],
          [/silver temple jewellery/gi, 'ঐতিহ্যবাহী সিলভার জুয়েলারি'],
          [/statement jhumkas/gi, 'নজরকাড়া ঝুমকা'],
          [/a delicate bindi/gi, 'একটি ছোট্ট টিপ'],
          [/radiate quintessential festive elegance/gi, 'উৎসবের আভিজাত্য ও সৌন্দর্য ফুটিয়ে তুলুন'],
          [/radiate festive elegance/gi, 'উৎসবের রূপ ও আভিজাত্য ফুটিয়ে তুলুন'],
          [/festive elegance/gi, 'উৎসবের রূপ ও আভিজাত্য'],
          [/perfect accessory/gi, 'নিখুঁত অনুষঙ্গ'],
          [/celebratory look/gi, 'উৎসবের জমকালো সাজ'],
          [/special occasion/gi, 'যেকোনো বিশেষ অনুষ্ঠান'],
          [/special occasions/gi, 'বিশেষ উৎসব ও অনুষ্ঠানসমূহ'],

          // Garment Care & Washing
          [/Dry clean recommended/gi, 'ড্রাই ওয়াশ করার পরামর্শ দেয়া হচ্ছে'],
          [/Dry clean only/gi, 'শুধুমাত্র ড্রাই ওয়াশ'],
          [/Gentle cold hand wash, dry in shade/gi, 'ঠান্ডা পানিতে হাত ধোয়া এবং ছায়ায় শুকানো উচিত'],
          [/Gentle dry clean/gi, 'হালকা ড্রাই ক্লিন'],
          [/Hand wash cold/gi, 'ঠান্ডা পানিতে হাত ধোয়া'],
          [/Machine wash/gi, 'মেশিন ওয়াশ']
        ];

        sentenceReplacements.forEach(([regex, bnStr]) => {
          text = text.replace(regex, bnStr);
        });

        // Clean up punctuation and spacing
        text = text.replace(/\s{2,}/g, ' ').trim();
        return text;
      },

      // Color localizer with smart fashion palette fallback
      localizeColor: (color) => {
        if (!color || typeof color !== 'string') return '';
        const lang = get().language || 'bn';
        if (lang === 'en') return color;

        // 1. Direct dictionary match
        const trimmed = color.trim();
        if (COLOR_TRANSLATIONS[trimmed]) {
          return COLOR_TRANSLATIONS[trimmed];
        }

        // 2. Tokenized fashion color translation
        let localized = trimmed;
        const colorWords = [
          [/Festive Multi-Hue Palette/gi, 'বহুরঙা ফেস্টিভ মাল্টিকালার শেড'],
          [/Multi-Hue Palette/gi, 'বহুরঙা ফ্যাশন শেড'],
          [/Multi-Hue/gi, 'বহুরঙা'],
          [/Multi-Color|Multicolor|Multi Color/gi, 'মাল্টিকালার'],
          [/Festive Multi/gi, 'উৎসব কালেকশন বহুরঙা'],
          [/Pastel Multi/gi, 'প্যাস্টেল মাল্টিকালার'],
          [/Dual Tone|Two-Tone/gi, 'ডুয়েল শেড'],
          [/Crimson Red/gi, 'টকটকে লাল'],
          [/Wine Red/gi, 'ওয়াইন রেড'],
          [/Deep Wine/gi, 'ডিপ ওয়াইন'],
          [/Deep Maroon/gi, 'গাঢ় মেরুন'],
          [/Royal Maroon/gi, 'রাজকীয় মেরুন'],
          [/Royal Blue/gi, 'রয়্যাল ব্লু'],
          [/Navy Blue/gi, 'নেভি ব্লু'],
          [/Midnight Blue/gi, 'মিডনাইট ব্লু'],
          [/Sky Blue/gi, 'আকাশি নীল'],
          [/Teal Blue/gi, 'টিল ব্লু'],
          [/Emerald Green/gi, 'পান্না সবুজ'],
          [/Forest Green/gi, 'গাঢ় বোতল সবুজ'],
          [/Bottle Green/gi, 'বোতল সবুজ'],
          [/Olive Green/gi, 'অলিভ গ্রিন'],
          [/Mint Green/gi, 'মিন্ট গ্রিন'],
          [/Sea Green/gi, 'সি গ্রিন'],
          [/Mustard Yellow/gi, 'সরিষা হলুদ'],
          [/Lemon Yellow/gi, 'লেমন হলুদ'],
          [/Haldi Yellow/gi, 'কাঁচা হলুদ'],
          [/Sunset Orange/gi, 'সানসেট কমলা'],
          [/Rust Orange/gi, 'রাস্ট অরেঞ্জ'],
          [/Pastel Pink/gi, 'প্যাস্টেল পিঙ্ক'],
          [/Baby Pink/gi, 'বেবি পিঙ্ক'],
          [/Blush Rose/gi, 'ব্লাশ রোজ'],
          [/Rose Gold/gi, 'রোজ গোল্ড'],
          [/Dusty Rose/gi, 'ডাস্টি রোজ'],
          [/Pastel Peach/gi, 'প্যাস্টেল পীচ'],
          [/Coral Pink/gi, 'কোরাল পিঙ্ক'],
          [/Golden Zari/gi, 'সোনালী জরি'],
          [/Antique Gold/gi, 'অ্যান্টিক গোল্ডেন'],
          [/Champagne Gold/gi, 'শ্যাম্পেন গোল্ড'],
          [/Silver Zari/gi, 'রূপালী জরি'],
          [/Antique Silver/gi, 'অ্যান্টিক সিলভার'],
          [/Jet Black/gi, 'জেট ব্ল্যাক'],
          [/Midnight Black/gi, 'মিডনাইট ব্ল্যাক'],
          [/Charcoal Grey/gi, 'চারকোল ধূসর'],
          [/Silver Grey/gi, 'রূপালী ধূসর'],
          [/Chocolate Brown/gi, 'চকলেট ব্রাউন'],
          [/Coffee Brown/gi, 'কফি ব্রাউন'],
          [/Off White|Off-White/gi, 'অফ-হোয়াইট'],
          [/Pure White/gi, 'খাঁটি সাদা'],

          // Single words
          [/Maroon/gi, 'মেরুন'],
          [/Red/gi, 'লাল'],
          [/Wine/gi, 'ওয়াইন'],
          [/Burgundy/gi, 'বারগান্ডি'],
          [/Ruby/gi, 'রুবি রেড'],
          [/Pink/gi, 'গোলাপি'],
          [/Magenta/gi, 'ম্যাজেন্টা'],
          [/Peach/gi, 'পীচ'],
          [/Coral/gi, 'কোরাল'],
          [/Blue/gi, 'নীল'],
          [/Navy/gi, 'নেভি'],
          [/Teal/gi, 'টিল'],
          [/Turquoise/gi, 'ফিরোজা'],
          [/Cyan/gi, 'সায়ান'],
          [/Purple/gi, 'বেগুনী'],
          [/Violet/gi, 'বেগুনী'],
          [/Lavender/gi, 'ল্যাভেন্ডার'],
          [/Lilac/gi, 'লাইলাক'],
          [/Plum/gi, 'প্লাম'],
          [/Green/gi, 'সবুজ'],
          [/Emerald/gi, 'পান্না সবুজ'],
          [/Olive/gi, 'অলিভ গ্রিন'],
          [/Mint/gi, 'মিন্ট'],
          [/Yellow/gi, 'হলুদ'],
          [/Mustard/gi, 'সরিষা হলুদ'],
          [/Orange/gi, 'কমলা'],
          [/Gold|Golden/gi, 'সোনালী'],
          [/Silver/gi, 'রূপালী'],
          [/Bronze/gi, 'ব্রোঞ্জ'],
          [/Copper/gi, 'তামাটে'],
          [/White/gi, 'সাদা'],
          [/Ivory/gi, 'আইভরি'],
          [/Cream/gi, 'ক্রিম'],
          [/Beige/gi, 'বেইজ'],
          [/Nude/gi, 'নিউড'],
          [/Black/gi, 'কালো'],
          [/Grey|Gray/gi, 'ধূসর'],
          [/Brown/gi, 'বাদামী'],
          [/Tan/gi, 'ট্যান'],
          [/Festive/gi, 'উৎসব কালেকশন'],
          [/Palette|Shade|Tone/gi, 'শেড'],
          [/Multi/gi, 'বহুরঙা'],
          [/Pastel/gi, 'প্যাস্টেল'],
          [/Royal/gi, 'রয়্যাল'],
          [/Deep/gi, 'গাঢ়'],
          [/Light/gi, 'হালকা'],
          [/Dark/gi, 'ডার্ক'],
          [/Bright/gi, 'উজ্জ্বল'],
          [/Dusty/gi, 'ডাস্টি']
        ];

        colorWords.forEach(([regex, bnStr]) => {
          localized = localized.replace(regex, bnStr);
        });

        return localized.replace(/\s{2,}/g, ' ').trim();
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
            .replace(/Semi-Silk|Semi Silk/gi, 'সেমি-সিল্ক')
            .replace(/Half-Silk|Half Silk/gi, 'হাফ সিল্ক')
            .replace(/Premium Silk Blend/gi, 'প্রিমিয়াম সিল্ক ব্লেন্ড')
            .replace(/Pure Silk/gi, 'খাঁটি সিল্ক')
            .replace(/Pure Cotton/gi, 'খাঁটি সুতি')
            .replace(/Handloom Cotton/gi, 'হ্যান্ডলুম তাঁতের সুতি')
            .replace(/Dhakai Jamdani Cotton/gi, 'খাঁটি ঢাকাই জামদানি কটন')
            .replace(/Pure/gi, 'পিওর')
            .replace(/Katan/gi, 'কাতান')
            .replace(/Silk/gi, 'সিল্ক')
            .replace(/Cotton/gi, 'সুতি')
            .replace(/Georgette/gi, 'জর্জেট')
            .replace(/Organza/gi, 'অরগাঞ্জা')
            .replace(/Chiffon/gi, 'শিফন')
            .replace(/Muslin/gi, 'মসলিন')
            .replace(/Linen/gi, 'লিনেন')
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
            .replace(/Gentle cold hand wash, dry in shade/gi, 'ঠান্ডা পানিতে মৃদু হাত ধোয়া এবং ছায়ায় শুকানো উচিত')
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

