import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, totalPrice, paymentMethod } = location.state || {};

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '60px 20px' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <CheckCircle size={80} color="var(--color-success)" style={{ marginBottom: '24px' }} />
      </motion.div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Order Placed Successfully!</h1>
      
      {orderId ? (
        <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '8px', marginBottom: '32px', width: '100%', maxWidth: '500px', textAlign: 'left', border: '1px solid var(--color-border)' }}>
          <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>Order Details</h3>
          <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Order ID:</span>
            <span style={{ fontWeight: 600 }}>{orderId}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Payment Method:</span>
            <span style={{ fontWeight: 600 }}>{paymentMethod}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Total Amount:</span>
            <span style={{ fontWeight: 600 }}>৳{totalPrice}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Status:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>Processing</span>
          </p>
        </div>
      ) : (
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Thank you for your purchase. We have received your order and will process it shortly.
        </p>
      )}
      <Link to="/shop">
        <button style={{ padding: '16px 40px', background: 'var(--color-text-primary)', color: '#fff', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 'var(--radius-sm)' }}>
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default OrderSuccess;
