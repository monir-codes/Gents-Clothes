import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if(orderId && phone) {
      setIsTracking(true);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', minHeight: '80vh', maxWidth: '600px', margin: '0 auto' }}>
      <SEO title="Track Order" description="Track your GentFits delivery status." />
      
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
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Order ID</label>
            <input 
              type="text" 
              placeholder="e.g. GF-123456"
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
          <button type="submit" style={{ padding: '14px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
            Track Order
          </button>
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'var(--color-surface)', padding: '40px', borderRadius: '8px', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '30px', color: 'var(--color-accent)' }}>
            <Package size={40} />
            <div style={{ height: '2px', width: '40px', background: 'var(--color-border)', alignSelf: 'center' }}></div>
            <Truck size={40} color="var(--color-border)" />
            <div style={{ height: '2px', width: '40px', background: 'var(--color-border)', alignSelf: 'center' }}></div>
            <CheckCircle size={40} color="var(--color-border)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Order Processing</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Your order #{orderId} is currently being prepared in our warehouse. You will receive an SMS once it ships.</p>
          <button 
            onClick={() => setIsTracking(false)}
            style={{ marginTop: '30px', padding: '10px 20px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}
          >
            Track Another Order
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrder;
