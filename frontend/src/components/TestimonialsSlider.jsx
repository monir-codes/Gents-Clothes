import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import useLanguageStore from '../store/useLanguageStore';
import styles from './TestimonialsSlider.module.css';

// Luxurious gradient palette for customer initial avatars
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #5E0F2B 0%, #831843 100%)', // Deep Burgundy
  'linear-gradient(135deg, #B45309 0%, #D97706 100%)', // Warm Amber
  'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)', // Emerald Teal
  'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)', // Royal Indigo
  'linear-gradient(135deg, #9D174D 0%, #BE185D 100%)', // Rose Crimson
  'linear-gradient(135deg, #B37D4E 0%, #D4A373 100%)', // Classic Gold
  'linear-gradient(135deg, #701A75 0%, #A21CAF 100%)', // Plum Violet
];

// Helper to get a stable gradient for any customer name
const getAvatarGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

// Fallback initial reviews in case API is offline or loading
const FALLBACK_TESTIMONIALS = [
  {
    _id: 't1',
    name: "নুসরাত জাহান",
    location: "ধানমন্ডি, ঢাকা",
    locationEn: "Dhanmondi, Dhaka",
    rating: 5,
    comment: "রঙবতী থেকে লাল ঢাকাই জামদানি শাড়িটা অর্ডার করেছিলাম। কাপড়ের কোয়ালিটি ও সূক্ষ্ম সুতার কাজ অসম্ভব সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। অত্যন্ত সন্তুষ্ট!",
    commentEn: "I ordered the red Dhakai Jamdani saree from Ronggoboti. The fabric quality and delicate handloom work are breathtaking! Delivered in just 2 days. Highly satisfied!",
    productName: "রয়েল লাল ঢাকাই জামদানি",
    productNameEn: "Royal Red Dhakai Jamdani Saree",
    verified: true
  },
  {
    _id: 't2',
    name: "Tahmina Rahman",
    location: "গুলশান, ঢাকা",
    locationEn: "Gulshan, Dhaka",
    rating: 5,
    comment: "পাকিস্তানি লাক্সারি লন ৩-পিস স্যুটটি আমার প্রত্যাশার চেয়েও সুন্দর হয়েছে। পিওর শিফন ওড়না ও সূক্ষ্ম এমব্রয়ডারি সত্যিই দেখার মতো। রঙবতীকে ধন্যবাদ!",
    commentEn: "The Pakistani Luxury Lawn 3-Piece exceeded all my expectations. Pure chiffon dupatta and exquisite embroidery. Perfectly tailored to perfection!",
    productName: "লাক্সারি এমব্রয়ডারি লন ৩-পিস",
    productNameEn: "Luxury Embroidered Lawn 3-Piece Suite",
    verified: true
  },
  {
    _id: 't3',
    name: "ফারহানা হক",
    location: "জিইসি মোড়, চট্টগ্রাম",
    locationEn: "GEC Circle, Chattogram",
    rating: 5,
    comment: "দুবাই চেরি সিল্ক আবায়াটির ফ্যাব্রিক প্রিমিয়াম এবং ফল অত্যন্ত এলিগ্যান্ট। হিজাবের কোয়ালিটিও চমৎকার। অনলাইন কেনাকাটায় এমন সততা বিরল। ধন্যবাদ রঙবতী!",
    commentEn: "The Dubai Cherry silk abaya has such a premium fabric and graceful fall. The matching hijab is top-notch. Truly rare honesty in online shopping.",
    productName: "দুবাই চেরি সিল্ক আবায়া",
    productNameEn: "Dubai Cherry Silk Front-Open Abaya",
    verified: true
  },
  {
    _id: 't4',
    name: "ডা. সাবিনা ইয়াসমিন",
    location: "সিলেট সদর",
    locationEn: "Sylhet Sadar",
    rating: 5,
    comment: "হ্যান্ডলুম কটন শাড়ির কালার কম্বিনেশন একদম ছবির মতোই নিখুঁত। নরম ও আরামদায়ক ফ্যাব্রিক। অফিস ও ক্যাজুয়াল ব্যবহারের জন্য সেরা!",
    commentEn: "The Handloom Cotton Saree color combination is identical to the photo. Breathable and ultra-comfortable fabric. Best for everyday and office wear!",
    productName: "হ্যান্ডলুম কটন শাড়ি",
    productNameEn: "Fine Handloom Cotton Saree",
    verified: true
  },
  {
    _id: 't5',
    name: "আফরিন সুলতানা",
    location: "উত্তরা, ঢাকা",
    locationEn: "Uttara, Dhaka",
    rating: 5,
    comment: "ওয়েডিং কালেকশনের কাতান সিল্ক শাড়িটি পরে সবার প্রশংসা পেয়েছি। প্যাকেজিং ও কাস্টমার সার্ভিস এককথায় অসাধারণ। রঙবতী সবসময় আমার প্রথম পছন্দ!",
    commentEn: "Received countless compliments wearing the bridal Katan Silk saree. The luxury packaging and customer service were exceptional. Ronggoboti is my top choice!",
    productName: "কাতান সিল্ক ওয়েডিং কালেকশন",
    productNameEn: "Bridal Katan Silk Wedding Saree",
    verified: true
  }
];

const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [isPaused, setIsPaused] = useState(false);
  const { language, localizeTitle } = useLanguageStore();
  const isBn = language === 'bn';

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get('/api/testimonials');
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.log('Using default testimonials');
      }
    };

    fetchTestimonials();
  }, []);

  // Duplicate items twice to ensure seamless infinite looping marquee
  const displayList = testimonials.length < 5 
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [...testimonials, ...testimonials];

  return (
    <section className={styles.testimonialSection} aria-label={isBn ? "গ্রাহকদের রিভিউ ও মতামত" : "Customer Reviews & Testimonials"}>
      <div className={styles.container}>
        <motion.div 
          className={styles.headerWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.badge}>
            <Heart size={14} fill="currentColor" />
            <span>{isBn ? 'গ্রাহকদের বাস্তব অভিজ্ঞতা' : 'Real Customer Experiences'}</span>
          </div>
          <h2 className={styles.title}>
            {isBn ? 'আমাদের সম্মানিত ক্রেতাদের মতামত' : 'What Our Patrons Say'}
          </h2>
          <p className={styles.subtitle}>
            {isBn 
              ? 'দেশজুড়ে আমাদের খাঁটি ও প্রিমিয়াম পোশাকের প্রশংসায় গ্রাহকদের দেওয়া রিভিউ ও সন্তুষ্টির গল্প।' 
              : 'Read honest feedback and style stories shared by women across Bangladesh who cherish our authentic craft.'}
          </p>

          <div className={styles.ratingSummary}>
            <div className={styles.starsGroup}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span>
              <strong>4.9 / 5</strong> {isBn ? 'রেটিং (ভেরিফাইড ক্রেতাদের মতামত)' : 'Rating from Verified Buyers'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Auto Scrolling Marquee Track */}
      <div 
        className={styles.sliderOuter}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div 
          className={styles.marqueeTrack} 
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {displayList.map((item, index) => {
            const avatarInitial = item.name ? item.name.trim().charAt(0).toUpperCase() : 'R';
            const avatarBg = getAvatarGradient(item.name || `customer-${index}`);
            const commentText = isBn ? (item.comment || item.commentEn) : (item.commentEn || item.comment);
            const locationText = isBn ? (item.location || item.locationEn || 'ঢাকা, বাংলাদেশ') : (item.locationEn || item.location || 'Dhaka, Bangladesh');
            const productNameText = isBn 
              ? (item.productName || localizeTitle(item.productNameEn)) 
              : (item.productNameEn || item.productName);

            return (
              <div key={`${item._id || index}-${index}`} className={styles.reviewCard}>
                <div>
                  <div className={styles.cardTop}>
                    <div className={styles.cardStars}>
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" />
                      ))}
                    </div>
                    <div className={styles.quoteIcon}>❝</div>
                  </div>

                  <p className={styles.commentText}>
                    "{commentText}"
                  </p>

                  {productNameText && (
                    <div className={styles.productTag}>
                      <ShoppingBag size={13} className={styles.productTagIcon} />
                      <span>{productNameText}</span>
                    </div>
                  )}
                </div>

                <div className={styles.authorWrapper}>
                  {/* Clean Monogram Initial Avatar */}
                  <div 
                    className={styles.avatarInitial} 
                    style={{ background: avatarBg }}
                    title={item.name}
                  >
                    {avatarInitial}
                  </div>

                  <div className={styles.authorDetails}>
                    <div className={styles.authorNameGroup}>
                      <span className={styles.authorName}>{item.name}</span>
                      {item.verified !== false && (
                        <span className={styles.verifiedBadge} title={isBn ? "ভেরিফাইড ক্রেতা" : "Verified Buyer"}>
                          <CheckCircle size={15} />
                        </span>
                      )}
                    </div>
                    <span className={styles.authorLocation}>{locationText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.controlsHint}>
        <span>{isBn ? '💡 রিভিউটি থামিয়ে পড়তে মাউস রাখুন অথবা ট্যাপ করুন' : '💡 Hover or tap on any review to pause and read'}</span>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
