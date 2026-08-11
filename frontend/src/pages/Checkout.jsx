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
  const [transactionId, setTransactionId] = useState('');
  const [settings, setSettings] = useState(null);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const totalPrice = itemsPrice + shippingPrice;

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await fetch('/api/settings').then(res => res.json());
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  // Auth Guard
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'Advance Payment' && !transactionId) {
      Swal.fire('Required', 'Please enter your Transaction ID for Advance Payment', 'warning');
      return;
    }
    
    Swal.fire({
      title: 'Confirm Order?',
      text: "Are you sure you want to place this order?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${useAuthStore.getState().token}`
            }
          };
          
          const orderData = {
            orderItems: cartItems,
            shippingAddress: {
              fullName: address.fullName,
              phone: address.phone,
              street: address.street,
              city: address.city,
              district: address.district,
              postalCode: '1000', // Default or make dynamic later
              country: 'Bangladesh'
            },
            paymentMethod,
            transactionId: paymentMethod === 'Advance Payment' ? transactionId : '',
            itemsPrice,
            shippingPrice,
            totalPrice
          };

          const { data } = await fetch('/api/orders', {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(orderData)
          }).then(async res => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
          });

          clearCart();
          navigate('/order-success', { state: { orderId: data._id, totalPrice, paymentMethod } });
        } catch (error) {
          Swal.fire('Error', 'Failed to place order. Please try again.', 'error');
        }
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
                value="Advance Payment"
                checked={paymentMethod === 'Advance Payment'}
                onChange={() => setPaymentMethod('Advance Payment')}
              />
              Advance Payment
            </label>
          </div>

          {paymentMethod === 'Advance Payment' && (
            <div style={{ background: 'var(--color-surface)', padding: '20px', borderRadius: '8px', marginTop: '20px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ marginBottom: '10px' }}>Payment Instructions</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>
                Please send <strong>৳{totalPrice}</strong> using the following method:
              </p>
              <div style={{ background: 'var(--color-background)', padding: '15px', borderRadius: '4px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>Method:</span>
                  <span>{settings?.paymentSettings?.advancePaymentMethod || 'bKash (Send Money)'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>Number:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{settings?.paymentSettings?.advancePaymentNumber || 'Loading...'}</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Transaction ID</label>
                <input 
                  type="text" 
                  required 
                  className={styles.input} 
                  placeholder="e.g. 9F8A7B6C5D"
                  value={transactionId} 
                  onChange={e => setTransactionId(e.target.value)} 
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '5px' }}>
                  Enter the transaction ID received via SMS after your payment.
                </p>
              </div>
            </div>
          )}

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
