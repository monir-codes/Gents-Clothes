import React from 'react';
import SEO from '../components/SEO';
import Shop from './Shop';

const NewArrival = () => {
  return (
    <>
      <SEO title="New Arrivals" description="The latest premium luxury collection by GentFits." />
      {/* We reuse the Shop component but could pass props to filter by 'new' */}
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>New Arrivals</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>Be the first to wear our latest designs</p>
      </div>
      <Shop hideHeader={true} />
    </>
  );
};

export default NewArrival;
