import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartCrack } from 'lucide-react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import useWishlistStore from '../store/useWishlistStore';
import useLanguageStore from '../store/useLanguageStore';

const Wishlist = () => {
  const { wishlistItems } = useWishlistStore();
  const { language, formatNumber } = useLanguageStore();
  const isBn = language === 'bn';

  return (
    <>
      <SEO 
        title={isBn ? "পছন্দের তালিকা | রঙবতী" : "My Wishlist | Ronggoboti"} 
        description={isBn ? "আপনার পছন্দের সংরক্ষিত পোশাকগুলো দেখুন।" : "View your saved luxury fashion items at Ronggoboti."} 
      />
      <div className="container" style={{ padding: 'var(--space-6) var(--space-3)', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: 'var(--space-4)', textAlign: 'center' }}>
          {isBn ? 'আমার পছন্দের তালিকা' : 'My Wishlist'} {wishlistItems.length > 0 && `(${formatNumber(wishlistItems.length)})`}
        </h1>
        
        {wishlistItems.length === 0 ? (
          <motion.div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-8)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HeartCrack size={64} color="var(--color-text-secondary)" style={{ marginBottom: 'var(--space-3)' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
              {isBn ? 'আপনার উইশলিস্টে কোনো পোশাক নেই' : 'Your wishlist is empty'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {isBn ? 'পছন্দের পোশাকগুলো সংরক্ষণ করতে কার্ডের হার্ট আইকনে ক্লিক করুন।' : 'Save your favorite items here to review them later.'}
            </p>
            <Link to="/shop">
              <button style={{ padding: '12px 24px', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-background)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
                {isBn ? 'কালেকশন ঘুরে দেখুন' : 'Discover Premium Collection'}
              </button>
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
            {wishlistItems.map(item => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;

