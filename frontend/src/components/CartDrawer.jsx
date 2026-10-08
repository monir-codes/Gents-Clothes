import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useLanguageStore from '../store/useLanguageStore';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQty } = useCartStore();
  const { t, language, formatPrice, localizeTitle, localizeColor, localizeSize } = useLanguageStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isBn = language === 'bn';

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />
          <motion.div 
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                {t('cart.title', 'Your Shopping Bag')} <span className={styles.headerCount}>({totalItemCount})</span>
              </h2>
              <button className={styles.closeBtn} onClick={toggleCart} aria-label="Close Cart"><X /></button>
            </div>

            <div className={styles.itemsContainer}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                    {t('cart.emptyTitle', 'Your shopping bag is empty!')}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {t('cart.emptySubtitle', 'Explore our latest collections to add your favorites.')}
                  </p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={`${item.product}-${item.size}-${item.color}-${index}`} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{localizeTitle(item.name)}</h4>
                      <p className={styles.itemVariants}>
                        {item.color && `${isBn ? 'রং:' : 'Color:'} ${localizeColor(item.color)}`} 
                        {item.size && ` | ${isBn ? 'সাইজ:' : 'Size:'} ${localizeSize(item.size)}`}
                      </p>
                      <div className={styles.priceRow}>
                        <div className={styles.qtyControl}>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQty(item.product, item.size, item.color, Math.max(1, item.qty - 1))}
                            aria-label="Decrease quantity"
                          >-</button>
                          <input type="text" value={item.qty} readOnly className={styles.qtyInput} />
                          <button 
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                        <div className={styles.cartItemPrice}>{formatPrice(item.price * item.qty)}</div>
                      </div>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.product, item.size, item.color)}
                        style={{ alignSelf: 'flex-start', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }}/> 
                        {t('cart.remove', 'Remove')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span>{t('cart.subtotal', 'Subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  {t('cart.checkoutBtn', 'Proceed to Checkout')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
