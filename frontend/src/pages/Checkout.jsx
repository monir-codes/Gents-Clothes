import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tag, CheckCircle2, XCircle, X, ShieldCheck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import styles from './Checkout.module.css';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const bdDivisions = {
    Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
    Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Comilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    Rajshahi: ['Bogra', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj'],
    Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
    Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
    Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
  };

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    region: '',
    district: user?.addresses?.[0]?.district || '',
    city: user?.addresses?.[0]?.city || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryCharge, setDeliveryCharge] = useState(120);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountPercentage, description }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedCoupon 
    ? Math.round((itemsPrice * appliedCoupon.discountPercentage) / 100) 
    : 0;
  const discountedItemsPrice = Math.max(0, itemsPrice - discountAmount);
  const shippingPrice = itemsPrice > 5000 ? 0 : deliveryCharge;
  const totalPrice = discountedItemsPrice + shippingPrice;

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data && data.paymentSettings && data.paymentSettings.deliveryCharge !== undefined) {
          setDeliveryCharge(data.paymentSettings.deliveryCharge);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [user, navigate]);

  const handleRegionChange = (e) => {
    setAddress({ ...address, region: e.target.value, district: '' });
  };

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await axios.post('/api/settings/validate-coupon', {
        code: couponInput.trim(),
        cartTotal: itemsPrice
      });

      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discountPercentage: data.discountPercentage,
          description: data.description
        });
        setCouponInput('');
        setCouponError('');
        Swal.fire({
          icon: 'success',
          title: 'Coupon Applied!',
          text: `You received a ${data.discountPercentage}% discount on your order.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setCouponError(data.message || 'Invalid Coupon');
        Swal.fire('Invalid Coupon', data.message || 'The coupon code you entered is invalid or expired.', 'error');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid Coupon';
      setCouponError(msg);
      Swal.fire('Invalid Coupon', msg, 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!address.region || !address.district) {
      Swal.fire('Error', 'Please select both Region and District.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirm Order?',
      text: `Total Amount: ৳${totalPrice}${appliedCoupon ? ` (Includes ${appliedCoupon.discountPercentage}% coupon discount)` : ''}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6d1b29',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm Order'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const orderData = {
            orderItems: cartItems,
            shippingAddress: {
              fullName: address.fullName,
              phone: address.phone,
              street: address.street,
              city: address.city,
              district: address.district,
              region: address.region,
              postalCode: '1000',
              country: 'Bangladesh'
            },
            paymentMethod,
            itemsPrice,
            discountAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : '',
            shippingPrice,
            totalPrice
          };

          const { data } = await axios.post('/api/orders', orderData, {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`
            }
          });

          clearCart();
          navigate('/order-success', { 
            state: { 
              orderId: data.customId || data._id, 
              totalPrice, 
              paymentMethod,
              discountAmount,
              couponCode: appliedCoupon?.code
            } 
          });
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
        <button onClick={() => navigate('/shop')} style={{ padding: '12px 24px', marginTop: '20px', background: 'var(--color-brand-maroon, #5e0f2b)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const currentDistricts = address.region ? bdDivisions[address.region] : [];

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
            <input required type="tel" className={styles.input} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="017XXXXXXXX" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address</label>
            <input required type="text" className={styles.input} value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House, Road, Area details" />
          </div>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Region (Division)</label>
              <select required className={styles.input} value={address.region} onChange={handleRegionChange}>
                <option value="">Select Region</option>
                {Object.keys(bdDivisions).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>District</label>
              <select required className={styles.input} value={address.district} onChange={e => setAddress({...address, district: e.target.value})} disabled={!address.region}>
                <option value="">Select District</option>
                {currentDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>City/Thana</label>
            <input required type="text" className={styles.input} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600 }}>Cash on Delivery (COD)</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Pay cash upon receiving your parcel at your doorstep.</span>
              </div>
            </label>
          </div>

          <button type="submit" className={styles.placeOrderBtn}>Place Order (৳{totalPrice})</button>
        </form>
      </div>

      <div className={styles.orderSummary}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <div style={{ marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '55px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  {item.color && `${item.color} `}{item.size && `| ${item.size}`}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  Qty: {item.qty} x ৳{item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className={styles.couponSection}>
          <label className={styles.couponLabel}>
            <Tag size={16} /> Have a Coupon Code?
          </label>
          
          {appliedCoupon ? (
            <div className={styles.appliedCouponBadge}>
              <div className={styles.appliedCouponInfo}>
                <CheckCircle2 size={18} className={styles.couponSuccessIcon} />
                <div>
                  <strong>{appliedCoupon.code}</strong>
                  <span className={styles.couponDiscountText}> ({appliedCoupon.discountPercentage}% OFF)</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveCoupon} 
                className={styles.removeCouponBtn}
                title="Remove Coupon"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input 
                type="text" 
                placeholder="Enter Coupon Code" 
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  if (couponError) setCouponError('');
                }}
                className={`${styles.couponInput} ${couponError ? styles.couponInputError : ''}`}
                disabled={couponLoading}
              />
              <button 
                type="submit" 
                className={styles.applyCouponBtn}
                disabled={couponLoading || !couponInput.trim()}
              >
                {couponLoading ? 'Applying...' : 'Apply'}
              </button>
            </form>
          )}

          {couponError && (
            <div className={styles.couponErrorText}>
              <XCircle size={14} />
              <span>{couponError}</span>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className={styles.summaryItem}>
          <span>Subtotal</span>
          <span>৳{itemsPrice}</span>
        </div>

        {appliedCoupon && (
          <div className={`${styles.summaryItem} ${styles.discountItem}`}>
            <span>Discount ({appliedCoupon.discountPercentage}%)</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>-৳{discountAmount}</span>
          </div>
        )}

        <div className={styles.summaryItem}>
          <span>Shipping</span>
          <span>{shippingPrice === 0 ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span> : `৳${shippingPrice}`}</span>
        </div>

        <div className={styles.totalRow}>
          <span>Total</span>
          <span style={{ color: 'var(--color-brand-maroon, #5e0f2b)' }}>৳{totalPrice}</span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          <ShieldCheck size={16} color="#16a34a" />
          <span>Guaranteed safe and secure checkout</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
