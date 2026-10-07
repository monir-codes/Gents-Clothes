import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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
    rating: 5,
    comment: "রঙবতী থেকে লাল ঢাকাই জামদানি শাড়িটা অর্ডার করেছিলাম। কাপড়ের কোয়ালিটি ও সূক্ষ্ম সুতার কাজ অসম্ভব সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। অত্যন্ত সন্তুষ্ট!",
    productName: "রয়েল লাল ঢাকাই জামদানি",
    verified: true
  },
  {
    _id: 't2',
    name: "Tahmina Rahman",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment: "The Pakistani Luxury Lawn 3-Piece exceeded all my expectations. Pure chiffon dupatta and exquisite embroidery. Perfectly tailored to perfection!",
    productName: "Luxury Embroidered Lawn Suite",
    verified: true
  },
  {
    _id: 't3',
    name: "ফারহানা হক",
    location: "জিইসি মোড়, চট্টগ্রাম",
    rating: 5,
    comment: "দুবাই চেরি সিল্ক আবায়াটির ফ্যাব্রিক প্রিমিয়াম এবং ফল অত্যন্ত এলিগ্যান্ট। হিজাবের কোয়ালিটিও চমৎকার। অনলাইন কেনাকাটায় এমন সততা বিরল। ধন্যবাদ রঙবতী!",
    productName: "দুবাই চেরি সিল্ক আবায়া",
    verified: true
  },
  {
    _id: 't4',
    name: "Dr. Sabina Yasmin",
    location: "Sylhet Sadar",
    rating: 5,
    comment: "Pure Handloom Cotton Saree-র কালার কম্বিনেশন একদম ছবির মতোই নিখুঁত। নরম ও আরামদায়ক ফ্যাব্রিক। অফিস ও ক্যাজুয়াল ব্যবহারের জন্য সেরা!",
    productName: "হ্যান্ডলুম কটন শাড়ি",
    verified: true
  },
  {
    _id: 't5',
    name: "আফরিন সুলতানা",
    location: "উত্তরা, ঢাকা",
    rating: 5,
    comment: "ওয়েডিং কালেকশনের কাতান সিল্ক শাড়িটি পরে সবার প্রশংসা পেয়েছি। প্যাকেজিং ও কাস্টমার সার্ভিস এককথায় অসাধারণ। রঙবতী সবসময় আমার প্রথম পছন্দ!",
    productName: "কাতান সিল্ক ওয়েডিং কালেকশন",
    verified: true
  }
];

const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [isPaused, setIsPaused] = useState(false);

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
    <section className={styles.testimonialSection} aria-label="Customer Reviews & Testimonials">
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
            <span>Real Customer Experiences</span>
          </div>
          <h2 className={styles.title}>What Our Patrons Say</h2>
          <p className={styles.subtitle}>
            Read honest feedback and style stories shared by women across Bangladesh who cherish our authentic craft.
          </p>

          <div className={styles.ratingSummary}>
            <div className={styles.starsGroup}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span><strong>4.9 / 5</strong> Rating from 1,200+ Verified Buyers</span>
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
                    "{item.comment}"
                  </p>

                  {item.productName && (
                    <div className={styles.productTag}>
                      <ShoppingBag size={13} className={styles.productTagIcon} />
                      <span>{item.productName}</span>
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
                        <span className={styles.verifiedBadge} title="Verified Buyer">
                          <CheckCircle size={15} />
                        </span>
                      )}
                    </div>
                    <span className={styles.authorLocation}>{item.location || 'ঢাকা, বাংলাদেশ'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.controlsHint}>
        <span>💡 Hover or tap on any review to pause and read</span>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
