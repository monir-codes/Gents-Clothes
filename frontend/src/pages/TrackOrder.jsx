import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if(orderId && phone) {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.post('/api/orders/track', { orderId, phone });
        setOrderData(data);
        setIsTracking(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to track order. Please check your details.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusStage = (status) => {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
        return 1;
      case 'Processing':
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
      case 'Returned':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '600px', margin: '0 auto' }}>
      <SEO title="Track Order" description="Track your Gents Clothes delivery status." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>Track Your Order</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Enter your order details below</p>
      </motion.div>

      {!isTracking ? (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleTrack}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--color-surface)', padding: '30px', borderRadius: '8px' }}
        >
          {error && <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} /> {error}</div>}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Order ID</label>
            <input 
              type="text" 
              placeholder="e.g. Rumman-1 or 64d9f7..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Phone Number</label>
            <input 
              type="tel" 
              placeholder="e.g. 017xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '14px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'var(--color-surface)', padding: '40px', borderRadius: '8px', textAlign: 'center' }}
        >
          {getStatusStage(orderData?.status) === -1 ? (
             <div style={{ color: 'var(--color-error)' }}>
               <AlertCircle size={50} style={{ margin: '0 auto', marginBottom: '15px' }} />
               <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Order {orderData.status}</h3>
               <p>Your order has been {orderData.status.toLowerCase()}. Please contact support if you need assistance.</p>
             </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', color: 'var(--color-border)' }}>
                <Package size={40} color={getStatusStage(orderData?.status) >= 1 ? 'var(--color-accent)' : 'var(--color-border)'} />
                <div style={{ height: '2px', flex: 1, minWidth: '30px', maxWidth: '60px', background: getStatusStage(orderData?.status) >= 2 ? 'var(--color-accent)' : 'var(--color-border)', alignSelf: 'center', transition: '0.3s' }}></div>
                <Truck size={40} color={getStatusStage(orderData?.status) >= 2 ? 'var(--color-accent)' : 'var(--color-border)'} />
                <div style={{ height: '2px', flex: 1, minWidth: '30px', maxWidth: '60px', background: getStatusStage(orderData?.status) >= 3 ? 'var(--color-accent)' : 'var(--color-border)', alignSelf: 'center', transition: '0.3s' }}></div>
                <CheckCircle size={40} color={getStatusStage(orderData?.status) >= 3 ? 'var(--color-accent)' : 'var(--color-border)'} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Status: {orderData?.status}</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Order placed on {new Date(orderData?.createdAt).toLocaleDateString()}
              </p>
              
              <div style={{ textAlign: 'left', background: 'var(--color-background)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>Items</h4>
                {orderData?.orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span>{item.qty}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                    <span>৳{item.price * item.qty}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid var(--color-border)', fontWeight: 600 }}>
                  <span>Total</span>
                  <span>৳{orderData?.totalPrice}</span>
                </div>
              </div>
            </>
          )}

          <button 
            onClick={() => { setIsTracking(false); setOrderData(null); }}
            style={{ marginTop: '10px', padding: '10px 20px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}
          >
            Track Another Order
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrder;
