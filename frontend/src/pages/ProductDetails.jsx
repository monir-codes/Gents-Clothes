import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart, Star, Truck, RefreshCcw, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { generateProductKeywords } from '../utils/seoHelpers';
import { getProductUrl } from '../utils/slugify';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [displayImage, setDisplayImage] = useState('');
  
  // Selections
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'description';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user, token } = useAuthStore();
  const { 
    t, 
    language, 
    formatPrice, 
    formatNumber, 
    localizeTitle, 
    localizeDescription, 
    localizeColor, 
    localizeFabric, 
    localizeCategory,
    localizeSize
  } = useLanguageStore();

  const handleAddToCart = () => {
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
      color: selectedColor,
      size: selectedSize
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMessage('You must be logged in to review.');
      return;
    }
    setReviewSubmitLoading(true);
    setReviewMessage('');
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviewMessage('Review submitted! It will appear after admin approval.');
      setComment('');
      setRating(5);
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Failed to submit review');
    }
    setReviewSubmitLoading(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setDisplayImage(data.image);
        if(data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if(data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        setLoading(false);

        // Fetch related products
        if (data.category) {
          const { data: allProducts } = await axios.get('/api/products');
          const related = allProducts
            .filter(p => p.category === data.category && p._id !== data._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }

        // Add to Recently Viewed in localStorage
        try {
          const stored = localStorage.getItem('recentlyViewed');
          let viewed = stored ? JSON.parse(stored) : [];
          // Remove if exists to push to front
          viewed = viewed.filter(p => p._id !== data._id);
          viewed.unshift(data);
          if (viewed.length > 10) viewed.pop(); // Keep only last 10
          localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
        } catch(e) {
          console.error("Local storage error", e);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const productImages = useMemo(() => {
    if (!product) return [];
    const imgs = [
      product.image, 
      product.hoverImage, 
      ...(Array.isArray(product.images) ? product.images : [])
    ];
    return Array.from(new Set(imgs)).filter(img => typeof img === 'string' && img.trim().length > 0);
  }, [product]);

  const currentImageIndex = useMemo(() => {
    const active = displayImage || product?.image;
    const idx = productImages.indexOf(active);
    return idx >= 0 ? idx : 0;
  }, [displayImage, product, productImages]);

  const handlePrevImage = () => {
    if (productImages.length <= 1) return;
    const prevIdx = (currentImageIndex - 1 + productImages.length) % productImages.length;
    setDisplayImage(productImages[prevIdx]);
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % productImages.length;
    setDisplayImage(productImages[nextIdx]);
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return <div className="container" style={{padding: '50px 0'}}>Product not found</div>;

  const productUrl = `https://www.ronggoboti.shop${getProductUrl(product)}`;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": productImages.length > 0 ? productImages : [product.image],
    "description": product.description || `Buy ${product.name} from রঙবতী (Ronggoboti.shop). Premium women's fashion in Bangladesh.`,
    "sku": product.sku || product._id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "রঙবতী | Ronggoboti"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "BDT",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.countInStock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "রঙবতী | Ronggoboti"
      }
    },
    ...(product.numReviews > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 5,
        "reviewCount": product.numReviews
      }
    } : {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "1"
      }
    })
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.ronggoboti.shop"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category || "Shop",
        "item": product.category ? `https://www.ronggoboti.shop/shop?category=${encodeURIComponent(product.category)}` : "https://www.ronggoboti.shop/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": productUrl
      }
    ]
  };

  return (
    <>
    <SEO 
      title={`${product.name} - ${product.category || "Women's Fashion"}`} 
      description={product.description?.substring(0, 160) || `Buy ${product.name} from রঙবতী (Ronggoboti). Exclusive women's fashion online shopping in Bangladesh.`} 
      keywords={generateProductKeywords(product)}
      type="product" 
      image={product.image}
      canonical={productUrl}
      schemaMarkup={[productSchema, breadcrumbSchema]}
    />
    <div className={`container ${styles.productContainer}`}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/">{language === 'bn' ? 'হোম' : 'Home'}</Link> / <Link to="/shop">{language === 'bn' ? 'শপ' : 'Shop'}</Link> {product.category && <> / <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{localizeCategory(product.category)}</Link></>} / <span>{localizeTitle(product.name)}</span>
      </div>

      <div className={styles.mainSection}>
        {/* Image Gallery */}
        <motion.div 
          className={styles.gallery}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.mainImageContainer}>
            <img 
              src={displayImage || product.image} 
              alt={`${localizeTitle(product.name)} - View ${currentImageIndex + 1}`} 
              className={styles.mainImage} 
            />
            
            {productImages.length > 1 && (
              <>
                <button 
                  type="button" 
                  className={`${styles.navBtn} ${styles.prevBtn}`} 
                  onClick={handlePrevImage} 
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  type="button" 
                  className={`${styles.navBtn} ${styles.nextBtn}`} 
                  onClick={handleNextImage} 
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
                <div className={styles.imageBadge}>
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              </>
            )}
          </div>

          {/* All Gallery Thumbnails */}
          {productImages.length > 1 && (
            <div className={styles.thumbnailList}>
              {productImages.map((imgUrl, index) => {
                const isActive = (displayImage ? displayImage === imgUrl : index === 0);
                return (
                  <button
                    type="button"
                    key={index}
                    className={`${styles.thumbnailBtn} ${isActive ? styles.thumbnailActive : ''}`}
                    onClick={() => setDisplayImage(imgUrl)}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${localizeTitle(product.name)} Thumbnail ${index + 1}`} 
                      className={styles.thumbnail} 
                    />
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          className={styles.info}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className={styles.title}>{localizeTitle(product.name)}</h1>
          <div className={styles.ratingBox}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
              ))}
            </div>
            <span>{formatNumber(product.numReviews || 0)} {language === 'bn' ? 'টি রিভিউ' : 'Reviews'}</span>
          </div>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.oldPrice && <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>}
          </div>

          <p className={styles.shortDescription}>{localizeDescription(product.description, product.name)}</p>

          <div className={styles.optionsContainer}>
            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>
                  {t('product.selectColor', 'Color')}: <strong>{localizeColor(selectedColor)}</strong>
                </span>
                <div className={styles.colorSelector}>
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      className={`${styles.colorBtn} ${selectedColor === color ? styles.activeColor : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={localizeColor(color)}
                    >
                      {localizeColor(color).charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.optionLabel}>
                    {t('product.selectSize', 'Size')}: <strong>{localizeSize(selectedSize)}</strong>
                  </span>
                  <Link 
                    to="/size-guide"
                    style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 500 }}
                  >
                    {language === 'bn' ? 'সাইজ নির্দেশিকা' : 'Size Guide'}
                  </Link>
                </div>
                <div className={styles.sizeSelector}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {localizeSize(size)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actionContainer}>
            <div className={styles.qtyBox}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">-</button>
              <input type="text" value={qty} readOnly aria-label="Quantity" />
              <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            
            <motion.button 
              className={styles.addToCartBtn} 
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              disabled={product.countInStock === 0}
              style={{ opacity: product.countInStock === 0 ? 0.5 : 1, cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ShoppingBag size={20} /> 
              {product.countInStock > 0 ? t('product.addToCart', 'Add to Cart') : t('product.outOfStock', 'Out of Stock')}
            </motion.button>
            
            <button 
              className={styles.wishlistBtn}
              onClick={() => toggleWishlist(product)}
              aria-label={language === 'bn' ? 'উইশলিস্টে রাখুন' : 'Wishlist'}
              style={{ color: isInWishlist(product._id) ? 'var(--color-error)' : 'var(--color-text-primary)' }}
            >
              <Heart size={20} fill={isInWishlist(product._id) ? 'var(--color-error)' : 'none'} />
            </button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <Truck size={20} />
              <span>{t('features.fastDelivery', 'Fast Delivery')}</span>
            </div>
            <div className={styles.trustItem}>
              <RefreshCcw size={20} />
              <span>{t('product.easyReturns', 'Easy Returns')}</span>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={20} />
              <span>{t('features.cod', 'Cash on Delivery')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div 
        className={styles.tabsContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.tabHeaders}>
          <button 
            className={`${styles.tabHeader} ${activeTab === 'description' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('description')}
          >
            {language === 'bn' ? 'বিবরণ' : 'Description'}
          </button>
          <button 
            className={`${styles.tabHeader} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            {language === 'bn' ? 'ফ্যাব্রিক বিবরণ' : 'Fabric Details'}
          </button>
          <button 
            className={`${styles.tabHeader} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            {language === 'bn' ? `রিভিউ (${formatNumber(product.numReviews || 0)})` : `Reviews (${product.numReviews || 0})`}
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'description' && (
            <p style={{ lineHeight: 1.8 }}>{localizeDescription(product.description, product.name)}</p>
          )}
          {activeTab === 'details' && product.fabricDetails && (() => {
            const fab = localizeFabric(product.fabricDetails);
            return (
              <ul style={{ paddingLeft: '20px', lineHeight: 2 }}>
                <li><strong>{language === 'bn' ? 'ম্যাটেরিয়াল:' : 'Material:'}</strong> {fab?.material || 'Premium Fabric'}</li>
                {fab?.gsm && <li><strong>{language === 'bn' ? 'জিএসএম (GSM):' : 'GSM:'}</strong> {fab.gsm}</li>}
                {fab?.washInstruction && <li><strong>{language === 'bn' ? 'ধোয়ার নির্দেশিকা:' : 'Wash Instruction:'}</strong> {fab.washInstruction}</li>}
              </ul>
            );
          })()}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                  {language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Reviews'}
                </h3>
                {product.reviews && product.reviews.filter(r => r.isApproved).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {product.reviews.filter(r => r.isApproved).map(review => (
                      <div key={review._id} style={{ padding: '15px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <strong>{review.name}</strong>
                          <div style={{ color: 'var(--color-accent)' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <p style={{ margin: 0 }}>{review.comment}</p>
                        {review.adminReply && (
                          <div style={{ marginTop: '15px', padding: '10px', background: 'var(--color-surface)', borderLeft: '3px solid var(--color-accent)' }}>
                            <strong>{language === 'bn' ? 'অ্যাডমিন রিপ্লাই:' : 'Admin Reply:'}</strong>
                            <p style={{ margin: 0, marginTop: '5px', fontSize: '0.9rem' }}>{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{language === 'bn' ? 'এখনও কোনো রিভিউ নেই।' : 'No reviews yet.'}</p>
                )}
              </div>

              <div style={{ padding: '20px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                  {language === 'bn' ? 'রিভিউ লিখুন' : 'Write a Review'}
                </h3>
                {!user ? (
                  <p>{language === 'bn' ? 'রিভিউ দিতে অনুগ্রহ করে ' : 'Please '}<Link to={`/login?redirect=${getProductUrl(product)}?tab=reviews`} style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>{language === 'bn' ? 'লগইন করুন' : 'log in'}</Link>{language === 'bn' ? '।' : ' to write a review.'}</p>
                ) : (
                  <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>{language === 'bn' ? 'রেটিং' : 'Rating'}</label>
                      <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', width: '120px' }}>
                        <option value="5">{language === 'bn' ? '৫ - চমৎকার' : '5 - Excellent'}</option>
                        <option value="4">{language === 'bn' ? '৪ - খুব ভালো' : '4 - Very Good'}</option>
                        <option value="3">{language === 'bn' ? '৩ - ভালো' : '3 - Good'}</option>
                        <option value="2">{language === 'bn' ? '২ - চলনসই' : '2 - Fair'}</option>
                        <option value="1">{language === 'bn' ? '১ - সন্তোষজনক নয়' : '1 - Poor'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>{language === 'bn' ? 'আপনার মন্তব্য' : 'Comment'}</label>
                      <textarea 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder={language === 'bn' ? 'পোশাকটির কোয়ালিটি ও ফিটিং সম্পর্কে আপনার অভিজ্ঞতা লিখুন...' : 'Write your experience with this product...'}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', width: '100%', minHeight: '100px', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" disabled={reviewSubmitLoading} style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', cursor: reviewSubmitLoading ? 'not-allowed' : 'pointer', width: 'fit-content' }}>
                      {reviewSubmitLoading ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review')}
                    </button>
                    {reviewMessage && <p style={{ color: reviewMessage.includes('failed') ? 'var(--color-error)' : 'var(--color-success)', marginTop: '10px' }}>{reviewMessage}</p>}
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <motion.div 
          style={{ marginTop: 'var(--space-8)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            {language === 'bn' ? 'আপনার পছন্দের আরও কালেকশন' : 'You May Also Like'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Viewed Section */}
      <RecentlyViewed currentProductId={product._id} />
    </div>
    </>
  );
};

export default ProductDetails;
