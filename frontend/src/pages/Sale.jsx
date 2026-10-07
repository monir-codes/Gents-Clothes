import React from 'react';
import SEO from '../components/SEO';
import Shop from './Shop';
import useLanguageStore from '../store/useLanguageStore';

const Sale = () => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  return (
    <>
      <SEO 
        title={isBn ? "স্পেশাল অফার ও ফ্ল্যাশ সেল | রঙবতী" : "Flash Sale | Ronggoboti"} 
        description={isBn ? "রঙবতী এর স্পেশাল অফার ও ফ্ল্যাশ সেল কালেকশন।" : "Exclusive discounts on রঙবতী premium collections."} 
      />
      <div style={{ textAlign: 'center', paddingTop: '40px', color: 'var(--color-error)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600 }}>
          {isBn ? 'স্পেশাল অফার ও ফ্ল্যাশ সেল' : 'Flash Sale'}
        </h1>
        <p style={{ marginTop: '8px' }}>
          {isBn ? 'নির্বাচিত প্রিমিয়াম পোশাকে আকর্ষণীয় মূল্যছাড়' : 'Up to 50% off on selected luxury items'}
        </p>
      </div>
      <Shop hideHeader={true} />
    </>
  );
};

export default Sale;

