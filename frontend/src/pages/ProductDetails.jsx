import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart, Star, Truck, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import RecentlyViewed from '../components/RecentlyViewed';
import AISizeRecommender from '../components/AISizeRecommender';
import { generateProductKeywords } from '../utils/seoHelpers';
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
  const [activeTab, setActiveTab] = useState('description');
  const [isSizeRecommenderOpen, setIsSizeRecommenderOpen] = useState(false);
  
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user, token } = useAuthStore();

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

  if (loading) return <Loader fullScreen />;
  if (!product) return <div className="container" style={{padding: '50px 0'}}>Product not found</div>;

  return (
    <>
    <SEO 
      title={product.name} 
      description={product.description?.substring(0, 160) || "Premium luxury clothing from Gents Clothes"} 
      keywords={generateProductKeywords(product)}
      type="product" 
    />
    <div className={`container ${styles.productContainer}`}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
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
            <img src={displayImage || product.image} alt={product.name} className={styles.mainImage} />
          </div>
          <div className={styles.thumbnailList}>
            <img src={product.image} alt="Thumb 1" className={styles.thumbnail} onClick={() => setDisplayImage(product.image)} style={{ borderColor: displayImage === product.image ? 'var(--color-accent)' : 'transparent' }} />
            {product.hoverImage && (
              <img src={product.hoverImage} alt="Thumb 2" className={styles.thumbnail} onClick={() => setDisplayImage(product.hoverImage)} style={{ borderColor: displayImage === product.hoverImage ? 'var(--color-accent)' : 'transparent' }} />
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          className={styles.info}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.ratingBox}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
              ))}
            </div>
            <span>{product.numReviews} Reviews</span>
          </div>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>৳{product.price}</span>
            {product.oldPrice && <span className={styles.oldPrice}>৳{product.oldPrice}</span>}
          </div>

          <p className={styles.shortDescription}>{product.description}</p>

          <div className={styles.optionsContainer}>
            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Color: <strong>{selectedColor}</strong></span>
                <div className={styles.colorSelector}>
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      className={`${styles.colorBtn} ${selectedColor === color ? styles.activeColor : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {/* Using text for demo, usually this is a hex code bg */}
                      {color.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.optionLabel}>Size: <strong>{selectedSize}</strong></span>
                  <button 
                    onClick={() => setIsSizeRecommenderOpen(true)}
                    style={{ fontSize: '0.85rem', color: 'var(--color-accent)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                  >
                    <Sparkles size={14} /> AI Size Match
                  </button>
                </div>
                <div className={styles.sizeSelector}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actionContainer}>
            <div className={styles.qtyBox}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <input type="number" value={qty} readOnly />
              <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>+</button>
            </div>
            
            <motion.button 
              className={styles.addToCartBtn} 
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              disabled={product.countInStock === 0}
              style={{ opacity: product.countInStock === 0 ? 0.5 : 1, cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer' }}
            >
              <ShoppingBag size={20} /> {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
            
            <button 
              className={styles.wishlistBtn}
              onClick={() => toggleWishlist(product)}
              style={{ color: isInWishlist(product._id) ? 'var(--color-error)' : 'var(--color-text-primary)' }}
            >
              <Heart size={20} fill={isInWishlist(product._id) ? 'var(--color-error)' : 'none'} />
            </button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.trustItem}>
              <Truck size={20} />
              <span>Fast Delivery</span>
            </div>
            <div className={styles.trustItem}>
              <RefreshCcw size={20} />
              <span>Easy Returns</span>
            </div>
            <div className={styles.trustItem}>
              <ShieldCheck size={20} />
              <span>Secure Payment</span>
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
            Description
          </button>
          <button 
            className={`${styles.tabHeader} ${activeTab === 'details' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Fabric Details
          </button>
          <button 
            className={`${styles.tabHeader} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.numReviews})
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'description' && (
            <p>{product.description}</p>
          )}
          {activeTab === 'details' && product.fabricDetails && (
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Material:</strong> {product.fabricDetails.material}</li>
              <li><strong>GSM:</strong> {product.fabricDetails.gsm}</li>
              <li><strong>Wash Instruction:</strong> {product.fabricDetails.washInstruction}</li>
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Customer Reviews</h3>
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
                            <strong>Admin Reply:</strong>
                            <p style={{ margin: 0, marginTop: '5px', fontSize: '0.9rem' }}>{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>

              <div style={{ padding: '20px', background: 'var(--color-surface)', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Write a Review</h3>
                {!user ? (
                  <p>Please <Link to="/login" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>log in</Link> to write a review.</p>
                ) : (
                  <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Rating</label>
                      <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', width: '100px' }}>
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Very Good</option>
                        <option value="3">3 - Good</option>
                        <option value="2">2 - Fair</option>
                        <option value="1">1 - Poor</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Comment</label>
                      <textarea 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', width: '100%', minHeight: '100px', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" disabled={reviewSubmitLoading} style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', cursor: reviewSubmitLoading ? 'not-allowed' : 'pointer', width: 'fit-content' }}>
                      {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
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
          <h2 style={{ fontSize: '2rem', fontWeight: 600, textAlign: 'center', marginBottom: 'var(--space-4)' }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Viewed Section */}
      <RecentlyViewed currentProductId={product._id} />

      <AISizeRecommender 
        isOpen={isSizeRecommenderOpen} 
        onClose={() => setIsSizeRecommenderOpen(false)} 
        onSelectSize={(size) => setSelectedSize(size)} 
      />
    </div>
    </>
  );
};

export default ProductDetails;
