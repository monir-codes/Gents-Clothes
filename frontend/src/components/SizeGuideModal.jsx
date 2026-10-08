import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import useLanguageStore from '../store/useLanguageStore';

const SIZE_CHARTS = {
  sarees: {
    title: 'Sarees (শাড়ি)',
    titleBn: 'শাড়ি ও ব্লাউজ সাইজ নির্দেশিকা',
    description: 'ঐতিহ্যবাহী বাংলাদেশি শাড়ির স্ট্যান্ডার্ড হাত ও মিটার পরিমাপ',
    descriptionEn: 'Standard traditional Bangladeshi Saree Haat & Meter measurements',
    headers: ['প্রকারভেদ (Type)', 'দৈর্ঘ্য (Length)', 'ব্লাউজ পিস (Blouse Piece)', 'উপযুক্ততা (Suitability)'],
    headersEn: ['Type', 'Length', 'Blouse Piece', 'Suitability'],
    rows: [
      ['১২ হাত স্ট্যান্ডার্ড শাড়ি', '১৮ ফুট (~৫.৫ মিটার)', 'আলাদা ০.৮০ মিটার আনস্টিচড পিস', 'সকল স্বাভাবিক উচ্চতার জন্য উপযুক্ত'],
      ['১৪ হাত এক্সক্লুসিভ শাড়ি', '২১ ফুট (~৬.৪ মিটার)', '১ মিটার ম্যাচিং ব্লাউজ পিস', 'বেশি কুঁচি ও লম্বা আঁচলের জন্য উপযুক্ত'],
      ['জামদানি ও তাঁতের শাড়ি', '১২ হাত (ফুল বডি)', 'রানিং / কনট্রাস্ট ব্লাউজ পিস', 'ঐতিহ্যবাহী যেকোনো উৎসব ও বিয়েতে'],
      ['কাতান ও সিল্ক শাড়ি', '১২ হাত স্ট্যান্ডার্ড', 'হেভি জরি কারুকাজ করা ব্লাউজ পিস', 'ব্রাইডাল ও পার্টি লুকের জন্য']
    ],
    rowsEn: [
      ['12 Haat Standard Saree', '18 Feet (~5.5 Meters)', 'Included 0.80m Unstitched', 'Ideal for all standard heights'],
      ['14 Haat Long Saree', '21 Feet (~6.4 Meters)', 'Included 1.00m Designer Piece', 'Best for rich pleats & heavy pallu'],
      ['Jamdani & Handloom Saree', '12 Haat Full Body', 'Running / Contrast Piece', 'Festivals, Weddings & Formal Wear'],
      ['Katan & Silk Saree', '12 Haat Standard', 'Heavy Zari Work Blouse Piece', 'Bridal & Royal Celebrations']
    ]
  },
  salwarkameez: {
    title: 'Salwar Kameez & 3-Piece (থ্রি-পিস)',
    titleBn: 'সালোয়ার কামিজ ও ২-পিস / ৩-পিস মাপ',
    description: 'স্টিচড ও রেডিমেড কামিজের ইঞ্চি অনুযায়ী বডি সাইজ চার্ট',
    descriptionEn: 'Body measurement chart in inches for stitched & ready-to-wear sets',
    headers: ['সাইজ (Size)', 'বডি / চেস্ট (Chest)', 'কোমর (Waist)', 'হিপ (Hip)', 'কামিজ লম্বা (Length)', 'পায়জামা লম্বা (Salwar)'],
    headersEn: ['Size', 'Chest (Inches)', 'Waist (Inches)', 'Hip (Inches)', 'Kamiz Length', 'Salwar Length'],
    rows: [
      ['S (৩৬)', '৩৬ ইঞ্চি', '৩২ ইঞ্চি', '৩৮ ইঞ্চি', '৪০-৪২ ইঞ্চি', '৩৮ ইঞ্চি'],
      ['M (৩৮)', '৩৮ ইঞ্চি', '৩৪ ইঞ্চি', '৪০ ইঞ্চি', '৪২-৪৪ ইঞ্চি', '৩৯ ইঞ্চি'],
      ['L (৪০)', '৪০ ইঞ্চি', '৩৬ ইঞ্চি', '৪২ ইঞ্চি', '৪৪-৪৬ ইঞ্চি', '৪০ ইঞ্চি'],
      ['XL (৪২)', '৪২ ইঞ্চি', '৩৮ ইঞ্চি', '৪৪ ইঞ্চি', '৪৪-৪৬ ইঞ্চি', '৪০ ইঞ্চি'],
      ['XXL (৪৪)', '৪৪ ইঞ্চি', '৪০ ইঞ্চি', '৪৬ ইঞ্চি', '৪৬ ইঞ্চি', '৪১ ইঞ্চি'],
      ['3XL (৪৬)', '৪৬ ইঞ্চি', '৪২ ইঞ্চি', '৪৮ ইঞ্চি', '৪৬ ইঞ্চি', '৪১ ইঞ্চি'],
      ['আনস্টিচড (Free Size)', '৩.০ গজ কাপড়', 'ফ্রি সাইজ', 'ফ্রি সাইজ', 'যেকোনো মাপে বানানো সম্ভব', '২.৫ গজ কাপড়']
    ],
    rowsEn: [
      ['S (36)', '36 inch', '32 inch', '38 inch', '40-42 inch', '38 inch'],
      ['M (38)', '38 inch', '34 inch', '40 inch', '42-44 inch', '39 inch'],
      ['L (40)', '40 inch', '36 inch', '42 inch', '44-46 inch', '40 inch'],
      ['XL (42)', '42 inch', '38 inch', '44 inch', '44-46 inch', '40 inch'],
      ['XXL (44)', '44 inch', '40 inch', '46 inch', '46 inch', '41 inch'],
      ['3XL (46)', '46 inch', '42 inch', '48 inch', '46 inch', '41 inch'],
      ['Unstitched (Free Size)', '3.0 yds Fabric', 'Customizable', 'Customizable', 'Custom Fit to any measurement', '2.5 yds Fabric']
    ]
  },
  kurtis: {
    title: 'Kurtis & Tops (কুর্তি)',
    titleBn: 'সিঙ্গেল কুর্তি ও টপস সাইজ চার্ট',
    description: 'রেগুলার ও ফিউশন কুর্তির স্ট্যান্ডার্ড মেজারমেন্ট',
    descriptionEn: 'Standard size measurements for single kurtis & fusion tops',
    headers: ['সাইজ (Size)', 'বডি / চেস্ট (Chest)', 'শোল্ডার (Shoulder)', 'হাতা (Sleeve)', 'লম্বা (Length)'],
    headersEn: ['Size', 'Chest (Inches)', 'Shoulder', 'Sleeve Length', 'Total Length'],
    rows: [
      ['S (৩৬)', '৩৬ ইঞ্চি', '১৪.০ ইঞ্চি', '১৭ ইঞ্চি', '৩৮-৪০ ইঞ্চি'],
      ['M (৩৮)', '৩৮ ইঞ্চি', '১৪.৫ ইঞ্চি', '১৭.৫ ইঞ্চি', '৪০-৪২ ইঞ্চি'],
      ['L (৪০)', '৪০ ইঞ্চি', '১৫.০ ইঞ্চি', '১৮ ইঞ্চি', '৪২-৪৪ ইঞ্চি'],
      ['XL (৪২)', '৪২ ইঞ্চি', '১৫.৫ ইঞ্চি', '১৮.৫ ইঞ্চি', '৪৪-৪৫ ইঞ্চি'],
      ['XXL (৪৪)', '৪৪ ইঞ্চি', '১৬.০ ইঞ্চি', '১৯ ইঞ্চি', '৪৫-৪৬ ইঞ্চি']
    ],
    rowsEn: [
      ['S (36)', '36 inch', '14.0 inch', '17.0 inch', '38-40 inch'],
      ['M (38)', '38 inch', '14.5 inch', '17.5 inch', '40-42 inch'],
      ['L (40)', '40 inch', '15.0 inch', '18.0 inch', '42-44 inch'],
      ['XL (42)', '42 inch', '15.5 inch', '18.5 inch', '44-45 inch'],
      ['XXL (44)', '44 inch', '16.0 inch', '19.0 inch', '45-46 inch']
    ]
  },
  abayas: {
    title: 'Abayas & Modest Wear (আবায়া)',
    titleBn: 'দুবাই চেরি আবায়া ও বোরকা সাইজ নির্দেশিকা',
    description: 'উচ্চতা (Height) অনুযায়ী আবায়ার সঠিক সাইজ নির্বাচন',
    descriptionEn: 'Height-based sizing for Dubai Cherry Abayas & Modest Robes',
    headers: ['আবায়া সাইজ (Size)', 'আপনার উচ্চতা (Your Height)', 'বডি সাইজ (Body Chest)', 'হাতা লম্বা (Sleeve)'],
    headersEn: ['Abaya Size', 'Recommended Height', 'Body Fit (Chest)', 'Sleeve Length'],
    rows: [
      ['সাইজ ৫২ (52)', "৫'০\" – ৫'২\" (১৫০-১৫৭ সেমি)", 'ফ্রি ফিট (৪৪-৪৬ ইঞ্চি ঢিলেঢালা)', '২৬ ইঞ্চি'],
      ['সাইজ ৫৪ (54)', "৫'৩\" – ৫'৪\" (১৫৮-১৬৪ সেমি)", 'ফ্রি ফিট (৪৬-৪৮ ইঞ্চি ঢিলেঢালা)', '২৭ ইঞ্চি'],
      ['সাইজ ৫৬ (56)', "৫'৫\" – ৫'৬\" (১৬৫-১৭০ সেমি)", 'ফ্রি ফিট (৪৮-৫০ ইঞ্চি ঢিলেঢালা)', '২৮ ইঞ্চি'],
      ['সাইজ ৫৮ (58)', "৫'৭\" এবং তদূর্ধ্ব (১৭১+ সেমি)", 'ফ্রি ফিট (৫০-৫২ ইঞ্চি ঢিলেঢালা)', '২৯ ইঞ্চি']
    ],
    rowsEn: [
      ['Size 52', "5'0\" – 5'2\" (150-157 cm)", 'Comfort Loose Fit (44-46 inch)', '26 inch'],
      ['Size 54', "5'3\" – 5'4\" (158-164 cm)", 'Comfort Loose Fit (46-48 inch)', '27 inch'],
      ['Size 56', "5'5\" – 5'6\" (165-170 cm)", 'Comfort Loose Fit (48-50 inch)', '28 inch'],
      ['Size 58', "5'7\" and above (171+ cm)", 'Comfort Loose Fit (50-52 inch)', '29 inch']
    ]
  }
};

const SizeGuideModal = ({ isOpen, onClose, defaultCategory }) => {
  const { language } = useLanguageStore();
  const isBn = language === 'bn';

  // Determine initial tab based on product category
  const getInitialTab = () => {
    if (!defaultCategory) return 'salwarkameez';
    const cat = defaultCategory.toLowerCase();
    if (cat.includes('saree') || cat.includes('jamdani') || cat.includes('katan')) return 'sarees';
    if (cat.includes('kurti') || cat.includes('top')) return 'kurtis';
    if (cat.includes('abaya') || cat.includes('borka') || cat.includes('modest')) return 'abayas';
    return 'salwarkameez';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  if (!isOpen) return null;

  const currentChart = SIZE_CHARTS[activeTab] || SIZE_CHARTS.salwarkameez;
  const headers = isBn ? currentChart.headers : currentChart.headersEn;
  const rows = isBn ? currentChart.rows : currentChart.rowsEn;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            background: 'var(--color-background, #ffffff)',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--color-border, #ebdcd0)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border, #ebdcd0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #faf6f1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--color-accent, #c9a265)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ruler size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-maroon, #5e0f2b)' }}>
                  {isBn ? 'সাইজ ও মেজারমেন্ট নির্দেশিকা' : 'Official Size & Fit Guide'}
                </h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  {isBn ? 'রঙবতী এক্সক্লুসিভ উইমেন্স ফ্যাশন' : 'Ronggoboti Premium Women’s Couture'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: '#ffffff',
                border: '1px solid var(--color-border, #ebdcd0)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-primary)'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            background: '#ffffff',
            borderBottom: '1px solid var(--color-border, #ebdcd0)',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {Object.entries(SIZE_CHARTS).map(([key, item]) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isActive ? '1.5px solid var(--color-accent, #c9a265)' : '1px solid var(--color-border, #ebdcd0)',
                    background: isActive ? 'var(--color-accent, #c9a265)' : 'var(--color-surface, #faf6f1)',
                    color: isActive ? '#ffffff' : 'var(--color-text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isBn ? item.titleBn : item.title}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                {isBn ? currentChart.titleBn : currentChart.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                {isBn ? currentChart.description : currentChart.descriptionEn}
              </p>
            </div>

            {/* Table */}
            <div style={{
              overflowX: 'auto',
              borderRadius: '10px',
              border: '1px solid var(--color-border, #ebdcd0)',
              marginBottom: '24px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface, #faf6f1)', borderBottom: '1px solid var(--color-border, #ebdcd0)' }}>
                    {headers.map((h, idx) => (
                      <th key={idx} style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-brand-maroon, #5e0f2b)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr 
                      key={rIdx} 
                      style={{ 
                        borderBottom: rIdx === rows.length - 1 ? 'none' : '1px solid var(--color-border, #ebdcd0)',
                        background: rIdx % 2 === 0 ? '#ffffff' : 'rgba(250, 246, 241, 0.4)'
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '12px 16px', fontWeight: cIdx === 0 ? 600 : 400, color: cIdx === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to Measure Info Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(94, 15, 43, 0.04) 0%, rgba(201, 162, 101, 0.08) 100%)',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1px solid rgba(201, 162, 101, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="var(--color-accent, #c9a265)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-brand-maroon, #5e0f2b)' }}>
                  {isBn ? '💡 সঠিকভাবে শরীরের মাপ নেওয়ার সহজ নিয়ম:' : '💡 How to Measure Perfectly:'}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                <li><strong>{isBn ? 'বক্ষ / চেস্ট (Bust/Chest):' : 'Bust/Chest:'}</strong> {isBn ? 'ফিতার সাহায্যে আপনার বুকের সবচেয়ে চওড়া অংশের চারপাশ দিয়ে মেপে নিন।' : 'Measure around the fullest part of your chest with a measuring tape.'}</li>
                <li><strong>{isBn ? 'কোমর (Waist):' : 'Waist:'}</strong> {isBn ? 'নাভির ঠিক উপরের স্বাভাবিক সরু অংশের চারপাশ মেপে নিন।' : 'Measure around your natural waistline, just above the belly button.'}</li>
                <li><strong>{isBn ? 'হিপ (Hip):' : 'Hip:'}</strong> {isBn ? 'দুই পা সোজা রেখে হিপের সবচেয়ে প্রশস্ত অংশ মেপে নিন।' : 'Stand with feet together and measure around the fullest part of your hips.'}</li>
                <li><strong>{isBn ? 'ঝুল / দৈর্ঘ্য (Length):' : 'Length:'}</strong> {isBn ? 'কাঁধের উঁচু অংশ থেকে আপনার পছন্দের ঝুল পর্যন্ত মেপে নিন।' : 'Measure from top of shoulder down to your preferred garment hemline.'}</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--color-border, #ebdcd0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #faf6f1)',
            fontSize: '0.84rem'
          }}>
            <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#16a34a" /> {isBn ? 'পার্সেল পাওয়ার পর চেক করে নেওয়ার সুবিধা' : 'Easy Inspection on Delivery Available'}
            </span>
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                background: 'var(--color-text-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isBn ? 'ঠিক আছে' : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
