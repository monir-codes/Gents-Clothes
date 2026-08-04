import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import styles from './Checkout.module.css';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    district: user?.addresses?.[0]?.district || '',
    city: user?.addresses?.[0]?.city || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const totalPrice = itemsPrice + shippingPrice;

  // Auth Guard
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Confirm Order?',
      text: "Are you sure you want to place this order?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Generate a pseudo-random Order ID for the success page
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        clearCart();
        navigate('/order-success', { state: { orderId, totalPrice, paymentMethod } });
      }
    });
  };

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} style={{ padding: '10px 20px', marginTop: '20px', background: '#000', color: '#fff' }}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutContainer}`}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>Shipping Address</h2>
        <form onSubmit={handlePlaceOrder}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input required type="text" className={styles.input} value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input required type="tel" className={styles.input} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address</label>
            <input required type="text" className={styles.input} value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input required type="text" className={styles.input} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>District</label>
              <select required className={styles.input} value={address.district} onChange={e => setAddress({...address, district: e.target.value})}>
                <option value="">Select District</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
              </select>
            </div>
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>Payment Method</h2>
          <div className={styles.paymentMethod}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              Cash on Delivery (COD)
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="payment" 
                value="SSLCommerz"
                checked={paymentMethod === 'SSLCommerz'}
                onChange={() => setPaymentMethod('SSLCommerz')}
              />
              Online Payment (Card / Mobile Banking)
            </label>
          </div>

          <button type="submit" className={styles.placeOrderBtn}>Place Order</button>
        </form>
      </div>

      <div className={styles.orderSummary}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <div style={{ marginBottom: '24px' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{item.color} | {item.size}</div>
                <div style={{ fontSize: '0.85rem' }}>Qty: {item.qty} x ৳{item.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summaryItem}>
          <span>Subtotal</span>
          <span>৳{itemsPrice}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Shipping</span>
          <span>{shippingPrice === 0 ? 'Free' : `৳${shippingPrice}`}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>৳{totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
