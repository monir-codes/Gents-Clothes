import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQty } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

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
              <h2 className={styles.title}>Your Cart ({cartItems.length})</h2>
              <button className={styles.closeBtn} onClick={toggleCart}><X /></button>
            </div>

            <div className={styles.itemsContainer}>
              {cartItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={`${item.product}-${item.size}-${item.color}-${index}`} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemVariants}>
                        {item.color && `Color: ${item.color}`} 
                        {item.size && ` | Size: ${item.size}`}
                      </p>
                      <div className={styles.priceRow}>
                        <div className={styles.qtyControl}>
                          <button 
                            className={styles.qtyBtn} 
                            onClick={() => updateQty(item.product, item.size, item.color, Math.max(1, item.qty - 1))}
                          >-</button>
                          <input type="text" value={item.qty} readOnly className={styles.qtyInput} />
                          <button 
                            className={styles.qtyBtn}
                            onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                          >+</button>
                        </div>
                        <div style={{fontWeight: 600}}>৳{item.price * item.qty}</div>
                      </div>
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.product, item.size, item.color)}
                        style={{ alignSelf: 'flex-start', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }}/> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Also import ShoppingBag at top since we used it in empty state
import { ShoppingBag } from 'lucide-react';

export default CartDrawer;
