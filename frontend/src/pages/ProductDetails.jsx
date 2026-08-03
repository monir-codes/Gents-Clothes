import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Heart, Star, Truck, RefreshCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import SEO from '../components/SEO';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Selections
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCartStore();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        if(data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if(data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{padding: '50px 0'}}>Loading...</div>;
  if (!product) return <div className="container" style={{padding: '50px 0'}}>Product not found</div>;

  return (
    <>
    <SEO 
      title={product.name} 
      description={product.description || "Premium luxury clothing from GentFits"} 
      type="product" 
    />
    <div className={`container ${styles.productContainer}`}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <div className={styles.mainSection}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            <img src={product.image} alt={product.name} className={styles.mainImage} />
          </div>
          <div className={styles.thumbnailList}>
            <img src={product.image} alt="Thumb 1" className={styles.thumbnail} />
            {product.hoverImage && (
              <img src={product.hoverImage} alt="Thumb 2" className={styles.thumbnail} />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className={styles.info}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <span className={styles.optionLabel}>Size: <strong>{selectedSize}</strong></span>
                  <span style={{ fontSize: '0.85rem', textDecoration: 'underline', cursor: 'pointer' }}>Size Guide</span>
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
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            
            <motion.button 
              className={styles.addToCartBtn} 
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} /> Add to Cart
            </motion.button>
            
            <button className={styles.wishlistBtn}>
              <Heart size={20} />
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
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
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
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;
