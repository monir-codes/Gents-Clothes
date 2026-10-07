import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import CategoryCard from '../components/CategoryCard';
import useLanguageStore from '../store/useLanguageStore';
import styles from './Shop.module.css';

const Collections = () => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  const collectionsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": isBn ? "এক্সক্লুসিভ উইমেন ফ্যাশন কালেকশন - রঙবতী | Ronggoboti" : "Exclusive Women's Fashion Collections - রঙবতী | Ronggoboti",
    "description": isBn ? "রঙবতী এর ব্রাইডাল, ঢাকাই জামদানি, পিওর সিল্ক ও আধুনিক ফ্যাশন কালেকশন অনলাইনে দেখুন।" : "Explore exclusive festive, bridal, Jamdani, silk, and contemporary women's fashion collections from রঙবতী (Ronggoboti) in Bangladesh.",
    "url": "https://www.ronggoboti.shop/collections"
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px', minHeight: '80vh' }}>
      <SEO 
        title={isBn ? "এক্সক্লুসিভ উইমেন কালেকশন - শাড়ি, থ্রি পিস, কুর্তি | রঙবতী" : "Exclusive Women's Fashion Collections - শাড়ি, থ্রি পিস, কুর্তি"} 
        description={isBn ? "রঙবতী এর উৎসব ও ব্রাইডাল, রাজকীয় ঢাকাই জামদানি, সিল্ক ও আধুনিক ডিজাইনার কালেকশন।" : "Explore exclusive festive, bridal, Dhakai Jamdani, pure silk, and modern designer collections from রঙবতী (Ronggoboti) in Bangladesh."} 
        canonical="https://www.ronggoboti.shop/collections"
        schemaMarkup={collectionsSchema}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 600, textTransform: 'uppercase' }}>
          {isBn ? 'আমাদের কালেকশন' : 'Our Collections'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          {isBn ? 'প্রতিটি ঋতু ও উৎসবের জন্য এক্সক্লুসিভ সিলেকশন' : 'Curated selections for every season'}
        </p>
      </motion.div>

      <motion.div 
        className={styles.productGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CategoryCard 
            title={isBn ? "উৎসব ও ব্রাইডাল কালেকশন" : "The Festive & Bridal Edit"} 
            image="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" 
            link="/shop?collection=festive" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CategoryCard 
            title={isBn ? "ঐতিহ্যবাহী রাজকীয় জামদানি" : "Royal Jamdani Heritage"} 
            image="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800" 
            link="/shop?collection=jamdani" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CategoryCard 
            title={isBn ? "ডিজাইনার সিল্ক ও কুর্তি" : "Contemporary Silk & Kurtis"} 
            image="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800" 
            link="/shop?collection=kurtis" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CategoryCard 
            title={isBn ? "মডার্ন এলিগেন্স ও কর্ড সেট" : "Modern Elegance & Co-ords"} 
            image="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800" 
            link="/shop?collection=coords" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Collections;

