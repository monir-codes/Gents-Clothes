import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartCrack } from 'lucide-react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import useWishlistStore from '../store/useWishlistStore';

const Wishlist = () => {
  const { wishlistItems } = useWishlistStore();

  return (
    <>
      <SEO title="My Wishlist" description="View your saved premium Gents Clothes items." />
      <div className="container" style={{ padding: 'var(--space-6) var(--space-3)', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: 'var(--space-4)', textAlign: 'center' }}>My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <motion.div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-8)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HeartCrack size={64} color="var(--color-text-secondary)" style={{ marginBottom: 'var(--space-3)' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Save your favorite items here to review them later.</p>
            <Link to="/shop">
              <button style={{ padding: '12px 24px', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-background)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
                Discover Premium Collection
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
