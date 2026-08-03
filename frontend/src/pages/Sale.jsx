import React from 'react';
import SEO from '../components/SEO';
import Shop from './Shop';

const Sale = () => {
  return (
    <>
      <SEO title="Flash Sale" description="Exclusive discounts on GentFits premium menswear." />
      <div style={{ textAlign: 'center', paddingTop: '40px', color: 'var(--color-error)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>Flash Sale</h1>
        <p style={{ marginTop: '8px' }}>Up to 50% off on selected luxury items</p>
      </div>
      <Shop hideHeader={true} />
    </>
  );
};

export default Sale;
