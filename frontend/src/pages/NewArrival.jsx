import React from 'react';
import SEO from '../components/SEO';
import Shop from './Shop';
import useLanguageStore from '../store/useLanguageStore';

const NewArrival = () => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  return (
    <>
      <SEO 
        title={isBn ? "নতুন কালেকশন | রঙবতী" : "New Arrivals | Ronggoboti"} 
        description={isBn ? "রঙবতী এর সর্বশেষ নতুন ডিজাইনার কালেকশন দেখুন।" : "The latest premium luxury collection by রঙবতী."} 
      />
      {/* We reuse the Shop component but could pass props to filter by 'new' */}
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>
          {isBn ? 'নতুন কালেকশন' : 'New Arrivals'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          {isBn ? 'আমাদের সর্বশেষ এক্সক্লুসিভ ডিজাইনের সাথে নিজেকে সাজিয়ে তুলুন' : 'Be the first to wear our latest handcrafted designs'}
        </p>
      </div>
      <Shop hideHeader={true} />
    </>
  );
};

export default NewArrival;

