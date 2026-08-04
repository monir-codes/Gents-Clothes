import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

const DeliveryCoverage = () => {
  const [zip, setZip] = useState('');
  const [status, setStatus] = useState(null);

  const checkDelivery = (e) => {
    e.preventDefault();
    if (zip.length > 3) {
      setStatus('available');
    } else {
      setStatus('unavailable');
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container" 
      style={{ padding: 'var(--space-6) var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', margin: 'var(--space-8) auto' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <MapPin size={32} color="var(--color-text-primary)" style={{ marginBottom: 'var(--space-2)' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Check Delivery Time</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Enter your ZIP or PIN code to check estimated delivery.</p>
        
        <form onSubmit={checkDelivery} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Enter ZIP / PIN" 
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}
            required
          />
          <button type="submit" style={{ padding: '12px 24px', background: 'var(--color-text-primary)', color: 'var(--color-background)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
            Check
          </button>
        </form>

        {status === 'available' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> Premium Delivery Available (2-3 Days)
          </motion.div>
        )}
        {status === 'unavailable' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} /> Standard Delivery (5-7 Days)
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default DeliveryCoverage;
