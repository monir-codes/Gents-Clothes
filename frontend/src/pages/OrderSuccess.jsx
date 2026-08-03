import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <CheckCircle size={80} color="var(--color-success)" style={{ marginBottom: '24px' }} />
      </motion.div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Order Placed Successfully!</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        Thank you for your purchase. We have received your order and will process it shortly.
      </p>
      <Link to="/shop">
        <button style={{ padding: '16px 40px', background: 'var(--color-text-primary)', color: '#fff', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 'var(--radius-sm)' }}>
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default OrderSuccess;
