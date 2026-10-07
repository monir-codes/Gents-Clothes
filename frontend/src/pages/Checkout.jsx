import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Tag, CheckCircle2, XCircle, X, ShieldCheck, 
  Copy, Check, CreditCard, Smartphone, AlertCircle 
} from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';
import styles from './Checkout.module.css';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { t, language } = useLanguageStore();
  const isBn = language === 'bn';
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

  const [settings, setSettings] = useState(null);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    region: '',
    district: user?.addresses?.[0]?.district || '',
    city: user?.addresses?.[0]?.city || ''
  });

  const [selectedZone, setSelectedZone] = useState('inside-dhaka');
  
  // Payment State
  const [paymentType, setPaymentType] = useState('COD'); // 'COD' | 'ADVANCE'
  const [selectedAdvanceIndex, setSelectedAdvanceIndex] = useState(0);
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Fetch Settings on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings for checkout', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Delivery Charges & Zones derived from settings
  const deliveryZones = [
    { 
      id: 'inside-dhaka', 
      name: 'ঢাকা সিটির মধ্যে', 
      nameEn: 'Inside Dhaka City', 
      charge: settings?.paymentSettings?.deliveryChargeInsideDhaka ?? 70, 
      deliveryTime: '২-৩ কার্যদিবস' 
    },
    { 
      id: 'sub-dhaka', 
      name: 'সাব ঢাকা (সাভার, গাজীপুর, নারায়ণগঞ্জ, কেরানীগঞ্জ)', 
      nameEn: 'Sub Dhaka (Gazipur, Savar, Narayanganj, Keraniganj)', 
      charge: settings?.paymentSettings?.deliveryChargeSubDhaka ?? 100, 
      deliveryTime: '২-৪ কার্যদিবস' 
    },
    { 
      id: 'outside-dhaka', 
      name: 'ঢাকার বাহিরে (সারা বাংলাদেশ)', 
      nameEn: 'Outside Dhaka (All over Bangladesh)', 
      charge: settings?.paymentSettings?.deliveryChargeOutsideDhaka ?? 120, 
      deliveryTime: '৩-৫ কার্যদিবস' 
    }
  ];

  const activeZone = deliveryZones.find(z => z.id === selectedZone) || deliveryZones[0];
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = appliedCoupon 
    ? Math.round((itemsPrice * appliedCoupon.discountPercentage) / 100) 
    : 0;
  const discountedItemsPrice = Math.max(0, itemsPrice - discountAmount);
  
  const freeShippingThreshold = settings?.paymentSettings?.freeShippingThreshold ?? 5000;
  const shippingPrice = (freeShippingThreshold > 0 && itemsPrice >= freeShippingThreshold) ? 0 : activeZone.charge;
  const totalPrice = discountedItemsPrice + shippingPrice;

  // Active advance payment methods configured by admin
  const configuredAdvanceMethods = (settings?.paymentSettings?.advancePaymentMethods || []).filter(m => m.isActive && m.number);
  const isAdvanceEnabled = settings?.paymentSettings?.isAdvancePaymentEnabled !== false;
  const hasAdvanceMethods = isAdvanceEnabled && configuredAdvanceMethods.length > 0;

  const currentAdvanceMethod = configuredAdvanceMethods[selectedAdvanceIndex] || configuredAdvanceMethods[0];

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setAddress({ ...address, region: newRegion, district: '' });
    if (newRegion && newRegion !== 'Dhaka') {
      setSelectedZone('outside-dhaka');
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setAddress({ ...address, district: newDistrict });
    if (address.region === 'Dhaka') {
      if (newDistrict === 'Dhaka') {
        setSelectedZone('inside-dhaka');
      } else if (['Gazipur', 'Narayanganj', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi'].includes(newDistrict)) {
        setSelectedZone('sub-dhaka');
      } else {
        setSelectedZone('outside-dhaka');
      }
    } else {
      setSelectedZone('outside-dhaka');
    }
  };

  const handleCopyNumber = (num) => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
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

    // If advance payment is chosen, require sender number and transaction ID
    if (paymentType === 'ADVANCE' && hasAdvanceMethods) {
      if (!senderNumber.trim() || !transactionId.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Details Required',
          text: 'Please enter the Sender Phone Number and Transaction ID (TrxID).'
        });
        return;
      }
    }

    const finalPaymentMethod = (paymentType === 'ADVANCE' && hasAdvanceMethods && currentAdvanceMethod) 
      ? currentAdvanceMethod.name 
      : 'COD';

    Swal.fire({
      title: 'Confirm Order?',
      text: `Total Amount: ৳${totalPrice} (${finalPaymentMethod})`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#5e0f2b',
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
            paymentMethod: finalPaymentMethod,
            transactionId: paymentType === 'ADVANCE' ? transactionId.trim() : '',
            senderNumber: paymentType === 'ADVANCE' ? senderNumber.trim() : '',
            advanceAmount: paymentType === 'ADVANCE' ? (shippingPrice > 0 ? shippingPrice : totalPrice) : 0,
            paymentDetails: paymentType === 'ADVANCE' && currentAdvanceMethod ? {
              method: currentAdvanceMethod.name,
              accountNumber: currentAdvanceMethod.number,
              accountType: currentAdvanceMethod.type,
              senderNumber: senderNumber.trim(),
              transactionId: transactionId.trim(),
              advanceAmount: shippingPrice > 0 ? shippingPrice : totalPrice
            } : {},
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
              paymentMethod: finalPaymentMethod,
              transactionId: orderData.transactionId,
              senderNumber: orderData.senderNumber,
              discountAmount,
              couponCode: appliedCoupon?.code
            } 
          });
        } catch (error) {
          console.error(error);
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
        <h2 className={styles.sectionTitle}>
          {isBn ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}
        </h2>
        <form onSubmit={handlePlaceOrder}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{isBn ? 'সম্পূর্ণ নাম' : 'Full Name'}</label>
            <input required type="text" className={styles.input} value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} placeholder={isBn ? 'আপনার নাম লিখুন' : 'Enter your full name'} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
            <input required type="tel" className={styles.input} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="017XXXXXXXX" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>{isBn ? 'বিস্তারিত ঠিকানা' : 'Street Address'}</label>
            <input required type="text" className={styles.input} value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder={isBn ? 'বাসা/হোল্ডিং, রোড, এলাকা' : 'House, Road, Area details'} />
          </div>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{isBn ? 'বিভাগ' : 'Region (Division)'}</label>
              <select required className={styles.input} value={address.region} onChange={handleRegionChange}>
                <option value="">{isBn ? 'বিভাগ নির্বাচন করুন' : 'Select Region'}</option>
                {Object.keys(bdDivisions).map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{isBn ? 'জেলা' : 'District'}</label>
              <select required className={styles.input} value={address.district} onChange={handleDistrictChange} disabled={!address.region}>
                <option value="">{isBn ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                {currentDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{isBn ? 'শহর / থানা' : 'City/Thana'}</label>
            <input required type="text" className={styles.input} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder={isBn ? 'যেমন: ধানমন্ডি, মিরপুর, উত্তরা' : 'e.g. Dhanmondi, Mirpur, Uttara'} />
          </div>

          {/* Delivery Charges Section */}
          <h2 className={styles.sectionTitle} style={{ marginTop: '30px' }}>
            {isBn ? 'ডেলিভারি চার্জ ও এরিয়া' : 'Delivery Charge & Zone'}
          </h2>
          <div className={styles.deliveryZoneGroup}>
            {deliveryZones.map(zone => {
              const isSelected = selectedZone === zone.id;
              return (
                <div 
                  key={zone.id}
                  className={`${styles.zoneCard} ${isSelected ? styles.zoneCardActive : ''}`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className={styles.zoneInfo}>
                    <input 
                      type="radio" 
                      name="deliveryZone" 
                      value={zone.id} 
                      checked={isSelected}
                      onChange={() => setSelectedZone(zone.id)}
                      className={styles.zoneRadio}
                    />
                    <div>
                      <div className={styles.zoneTitle}>{isBn ? zone.name : zone.nameEn}</div>
                      <div className={styles.zoneSub}>
                        {isBn ? `ডেলিভারি সময়: ${zone.deliveryTime}` : `Delivery Time: ${zone.deliveryTime}`}
                      </div>
                    </div>
                  </div>
                  <div className={styles.zonePrice}>
                    {freeShippingThreshold > 0 && itemsPrice >= freeShippingThreshold ? (
                      <span style={{ color: '#16a34a', fontSize: '0.95rem' }}>{isBn ? 'ফ্রি' : 'FREE'}</span>
                    ) : (
                      `৳${zone.charge}`
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Methods Section */}
          <h2 className={styles.sectionTitle} style={{ marginTop: '30px' }}>
            {isBn ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
          </h2>
          <div className={styles.paymentMethod}>
            
            {/* Cash On Delivery Card */}
            <div 
              className={`${styles.paymentOptionCard} ${paymentType === 'COD' ? styles.paymentOptionCardActive : ''}`}
              onClick={() => setPaymentType('COD')}
            >
              <div className={styles.paymentHeader}>
                <input 
                  type="radio" 
                  name="paymentOption" 
                  value="COD" 
                  checked={paymentType === 'COD'}
                  onChange={() => setPaymentType('COD')}
                  className={styles.zoneRadio}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {isBn ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery (COD)'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {isBn 
                      ? <>পণ্য হাতে পেয়ে সর্বমোট <strong>৳{totalPrice}</strong> পরিশোধ করুন।</> 
                      : <>Pay in cash when your order is delivered (Total: <strong>৳{totalPrice}</strong>).</>}
                  </div>
                </div>
              </div>
            </div>

            {/* Advance Payment Card (Only shown if configured by admin) */}
            {hasAdvanceMethods && (
              <div 
                className={`${styles.paymentOptionCard} ${paymentType === 'ADVANCE' ? styles.paymentOptionCardActive : ''}`}
                onClick={() => setPaymentType('ADVANCE')}
              >
                <div className={styles.paymentHeader}>
                  <input 
                    type="radio" 
                    name="paymentOption" 
                    value="ADVANCE" 
                    checked={paymentType === 'ADVANCE'}
                    onChange={() => setPaymentType('ADVANCE')}
                    className={styles.zoneRadio}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isBn ? 'অগ্রিম মোবাইল পেমেন্ট (Advance Payment)' : 'Advance Payment (bKash / Nagad)'}
                      <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {isBn ? 'দ্রুত প্রসেসিং' : 'Fast Processing'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {isBn ? 'bKash, Nagad ইত্যাদির মাধ্যমে অগ্রিম পরিশোধ করুন।' : 'Pay in advance securely via bKash, Nagad, etc.'}
                    </div>
                  </div>
                </div>

                {/* Expanded Advance Payment Details when Active */}
                {paymentType === 'ADVANCE' && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                      {isBn ? 'পেমেন্ট মাধ্যম বেছে নিন:' : 'Select Payment Method:'}
                    </div>

                    {/* Method Selection Badges */}
                    <div className={styles.advanceMethodsGrid}>
                      {configuredAdvanceMethods.map((method, idx) => {
                        const isMethodSelected = selectedAdvanceIndex === idx;
                        const mName = method.name?.toLowerCase() || '';
                        let brandColor = 'var(--color-brand-maroon, #5e0f2b)';
                        if (mName.includes('bkash')) brandColor = '#db2777';
                        else if (mName.includes('nagad')) brandColor = '#ea580c';
                        else if (mName.includes('rocket')) brandColor = '#9333ea';

                        return (
                          <div 
                            key={idx}
                            className={`${styles.advanceMethodItem} ${isMethodSelected ? styles.advanceMethodItemActive : ''}`}
                            onClick={() => setSelectedAdvanceIndex(idx)}
                          >
                            <div className={styles.methodName} style={{ color: brandColor }}>
                              {method.name}
                            </div>
                            <div className={styles.methodTypeTag}>
                              {method.type || 'Personal'}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Method Info & Copy Number */}
                    {currentAdvanceMethod && (
                      <div className={styles.paymentInstructionsBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {currentAdvanceMethod.name} ({currentAdvanceMethod.type || 'Personal'}):
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                            {isBn ? `অগ্রিম প্রদেয়: ৳${shippingPrice > 0 ? shippingPrice : totalPrice}` : `Advance payable: ৳${shippingPrice > 0 ? shippingPrice : totalPrice}`}
                          </span>
                        </div>

                        <div className={styles.accountNumberRow}>
                          <span className={styles.accountNumberText}>{currentAdvanceMethod.number}</span>
                          <button 
                            type="button" 
                            className={styles.copyNumberBtn}
                            onClick={() => handleCopyNumber(currentAdvanceMethod.number)}
                          >
                            {copiedNumber ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                            {copiedNumber ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'নাম্বার কপি করুন' : 'Copy Number')}
                          </button>
                        </div>

                        {currentAdvanceMethod.instructions && (
                          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                            {currentAdvanceMethod.instructions}
                          </div>
                        )}

                        {/* Customer Transaction Input Fields */}
                        <div className={styles.paymentInputsRow}>
                          <div>
                            <label className={styles.label} style={{ fontSize: '0.8rem' }}>
                              {isBn ? 'আপনার ফোন / একাউন্ট নাম্বার' : 'Sender Phone / Account Number'} <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                              type="tel" 
                              required={paymentType === 'ADVANCE'}
                              placeholder="01XXXXXXXXX" 
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className={styles.input}
                              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
                            />
                          </div>
                          <div>
                            <label className={styles.label} style={{ fontSize: '0.8rem' }}>
                              Transaction ID (TrxID) <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input 
                              type="text" 
                              required={paymentType === 'ADVANCE'}
                              placeholder="e.g. 9J8A7K6L" 
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                              className={styles.input}
                              style={{ padding: '8px 12px', fontSize: '0.9rem', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 600 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

          <button type="submit" className={styles.placeOrderBtn}>
            {isBn ? `অর্ডার নিশ্চিত করুন (৳${totalPrice})` : `Confirm Order (৳${totalPrice})`}
          </button>
        </form>
      </div>

      {/* Order Summary Column */}
      <div className={styles.orderSummary}>
        <h2 className={styles.sectionTitle}>
          {isBn ? 'অর্ডারের বিবরণ' : 'Order Summary'}
        </h2>
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
                  {isBn ? 'পরিমাণ:' : 'Qty:'} {item.qty} x ৳{item.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className={styles.couponSection}>
          <label className={styles.couponLabel}>
            <Tag size={16} /> {isBn ? 'কুপন কোড আছে?' : 'Have a Coupon Code?'}
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
                title={isBn ? "কুপন বাতিল করুন" : "Remove Coupon"}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input 
                type="text" 
                placeholder={isBn ? "কুপন কোড লিখুন" : "Enter Coupon Code"} 
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
                {couponLoading ? (isBn ? 'যাচাই...' : 'Applying...') : (isBn ? 'প্রয়োগ' : 'Apply')}
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
          <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
          <span>৳{itemsPrice}</span>
        </div>

        {appliedCoupon && (
          <div className={`${styles.summaryItem} ${styles.discountItem}`}>
            <span>{isBn ? `ছাড় (${appliedCoupon.discountPercentage}%)` : `Discount (${appliedCoupon.discountPercentage}%)`}</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>-৳{discountAmount}</span>
          </div>
        )}

        <div className={styles.summaryItem}>
          <span>{isBn ? `ডেলিভারি চার্জ (${activeZone.name})` : `Shipping (${activeZone.nameEn})`}</span>
          <span>{shippingPrice === 0 ? <span style={{ color: '#16a34a', fontWeight: 600 }}>{isBn ? 'ফ্রি' : 'Free'}</span> : `৳${shippingPrice}`}</span>
        </div>

        <div className={styles.totalRow}>
          <span>{isBn ? 'সর্বমোট' : 'Total'}</span>
          <span style={{ color: 'var(--color-brand-maroon, #5e0f2b)' }}>৳{totalPrice}</span>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          <ShieldCheck size={16} color="#16a34a" />
          <span>{isBn ? '১০০% নিরাপদ ও সুরক্ষিত চেকআউট' : 'Guaranteed safe and secure checkout'}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
