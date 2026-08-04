import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1,
      color: product.colors?.[0] || 'Default',
      size: product.sizes?.[0] || 'Default'
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className={styles.card}
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
    >
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product._id}`} className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.image} />
          {product.hoverImage && (
            <img src={product.hoverImage} alt={product.name} className={styles.hoverImage} />
          )}
          
          {/* Badges */}
          {product.oldPrice && (
            <div className={styles.discountBadge}>Sale</div>
          )}
          {product.countInStock < 5 && product.countInStock > 0 && (
            <div className={styles.stockBadge}>Only {product.countInStock} Left</div>
          )}
        </Link>
        
        <div className={styles.actions}>
          <button className={styles.actionBtn} aria-label="Add to Wishlist" onClick={(e) => e.preventDefault()}>
            <Heart size={20} />
          </button>
          <button className={styles.actionBtn} aria-label="Quick Add" onClick={handleQuickAdd}>
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <Link to={`/product/${product._id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <div className={styles.priceContainer}>
          <span className={styles.price}>৳{product.price}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>৳{product.oldPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
