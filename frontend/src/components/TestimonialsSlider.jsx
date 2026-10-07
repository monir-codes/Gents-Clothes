import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, Quote, Sparkles, Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './TestimonialsSlider.module.css';

// Fallback initial reviews in case API is offline or loading
const FALLBACK_TESTIMONIALS = [
  {
    _id: 't1',
    name: "নুসরাত জাহান",
    location: "ধানমন্ডি, ঢাকা",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "রঙবতী থেকে লাল ঢাকাই জামদানি শাড়িটা অর্ডার করেছিলাম। কাপড়ের কোয়ালিটি ও সূক্ষ্ম সুতার কাজ অসম্ভব সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। অত্যন্ত সন্তুষ্ট!",
    productName: "রয়েল লাল ঢাকাই জামদানি",
    verified: true
  },
  {
    _id: 't2',
    name: "Tahmina Rahman",
    location: "Gulshan, Dhaka",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "The Pakistani Luxury Lawn 3-Piece exceeded all my expectations. Pure chiffon dupatta and exquisite embroidery. Perfectly tailored to perfection!",
    productName: "Luxury Embroidered Lawn Suite",
    verified: true
  },
  {
    _id: 't3',
    name: "ফারহানা হক",
    location: "জিইসি মোড়, চট্টগ্রাম",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "দুবাই চেরি সিল্ক আবায়াটির ফ্যাব্রিক প্রিমিয়াম এবং ফল অত্যন্ত এলিগ্যান্ট। হিজাবের কোয়ালিটিও চমৎকার। অনলাইন কেনাকাটায় এমন সততা বিরল। ধন্যবাদ রঙবতী!",
    productName: "দুবাই চেরি সিল্ক আবায়া",
    verified: true
  },
  {
    _id: 't4',
    name: "Dr. Sabina Yasmin",
    location: "Sylhet Sadar",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Pure Handloom Cotton Saree-র কালার কম্বিনেশন একদম ছবির মতোই নিখুঁত। নরম ও আরামদায়ক ফ্যাব্রিক। অফিস ও ক্যাজুয়াল ব্যবহারের জন্য সেরা!",
    productName: "হ্যান্ডলুম কটন শাড়ি",
    verified: true
  },
  {
    _id: 't5',
    name: "আফরিন সুলতানা",
    location: "উত্তরা, ঢাকা",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
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
            <Sparkles size={14} />
            <span>Love & Real Experiences</span>
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
          {displayList.map((item, index) => (
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
                    <span>✨ {item.productName}</span>
                  </div>
                )}
              </div>

              <div className={styles.authorWrapper}>
                {item.avatar ? (
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className={styles.avatarImg} 
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div 
                  className={styles.avatarFallback} 
                  style={{ display: item.avatar ? 'none' : 'flex' }}
                >
                  {item.name ? item.name.charAt(0).toUpperCase() : 'R'}
                </div>

                <div className={styles.authorDetails}>
                  <div className={styles.authorNameGroup}>
                    <span className={styles.authorName}>{item.name}</span>
                    {item.verified !== false && (
                      <span className={styles.verifiedBadge} title="Verified Customer">
                        <CheckCircle size={15} />
                      </span>
                    )}
                  </div>
                  <span className={styles.authorLocation}>{item.location || 'ঢাকা, বাংলাদেশ'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controlsHint}>
        <span>💡 Hover or tap on any review to pause and read</span>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
