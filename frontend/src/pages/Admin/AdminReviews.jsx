import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Check, X, MessageSquare, Trash2, Plus, Edit2, Star, Sparkles, 
  Upload, Eye, EyeOff, UserCheck, MapPin, Tag, RefreshCw 
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/useAuthStore';
import Loader from '../../components/Loader';

// ImgBB API Key
const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c";

const SAMPLE_AI_REVIEWS = [
  {
    name: "মেহরুন নেসা",
    location: "বনানী, ঢাকা",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "অর্ডার করার ২ দিনের মধ্যেই জামদানি শাড়িটা হাতে পেয়েছি। কাপড়ের জমিন ও সুতার বুনন একদম মনের মতো। রঙবতীকে অনেক ধন্যবাদ!",
    productName: "পিওর ঢাকাই জামদানি শাড়ি",
    verified: true,
    isActive: true
  },
  {
    name: "Sadia Islam",
    location: "Nasirabad, Chattogram",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "The Pakistani Lawn 3-piece is pure luxury! Soft breathable cotton with breathtaking chiffon dupatta. Definitely ordering more for Eid!",
    productName: "Luxury Designer 3-Piece Suite",
    verified: true,
    isActive: true
  },
  {
    name: "নাজমা বেগম",
    location: "উপশহর, সিলেট",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "দুবাই চেরি আবায়ার ফল ও ফ্যাব্রিক অত্যন্ত এলিগ্যান্ট। হিজাবের কোয়ালিটিও প্রিমিয়াম। শালীন ও স্টাইলিশ পোশাকের জন্য সেরা শপ!",
    productName: "দুবাই চেরি সিল্ক আবায়া",
    verified: true,
    isActive: true
  },
  {
    name: "ফারিয়া তাসনিম",
    location: "উত্তরা সেক্টর ৭, ঢাকা",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "ওয়েডিং পার্টির জন্য কাতান শাড়ি নিয়েছিলাম। কালার এবং জরির গর্জিয়াস কাজ সবাইকে মুগ্ধ করেছে। প্যাকেজিংও ছিল রাজকীয়!",
    productName: "রয়েল কাতান সিল্ক শাড়ি",
    verified: true,
    isActive: true
  },
  {
    name: "Tasneem Farhana",
    location: "Khulna City",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment: "Handloom Cotton Kurti is so comfortable for daily and university wear. Zero color bleed after washing. Highly recommended!",
    productName: "হ্যান্ডলুম কটন কুর্তি",
    verified: true,
    isActive: true
  }
];

const AdminReviews = () => {
  const [activeTab, setActiveTab] = useState('testimonials'); // 'testimonials' | 'productReviews'
  const { token } = useAuthStore();

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    location: 'ঢাকা, বাংলাদেশ',
    avatar: '',
    rating: 5,
    comment: '',
    productName: '',
    verified: true,
    isActive: true,
    order: 0
  };
  const [formData, setFormData] = useState(initialFormState);

  // Product Reviews State
  const [productReviews, setProductReviews] = useState([]);
  const [loadingProductReviews, setLoadingProductReviews] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true);
      const { data } = await axios.get('/api/testimonials/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestimonials(Array.isArray(data) ? data : []);
      setLoadingTestimonials(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setLoadingTestimonials(false);
    }
  };

  // Fetch Product Reviews
  const fetchProductReviews = async () => {
    try {
      setLoadingProductReviews(true);
      const { data } = await axios.get('/api/products/reviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductReviews(Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : []));
      setLoadingProductReviews(false);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      setLoadingProductReviews(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchProductReviews();
  }, [token]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTestimonialId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (t) => {
    setEditingTestimonialId(t._id);
    setFormData({
      name: t.name || '',
      location: t.location || 'ঢাকা, বাংলাদেশ',
      avatar: t.avatar || '',
      rating: t.rating || 5,
      comment: t.comment || '',
      productName: t.productName || '',
      verified: t.verified !== undefined ? t.verified : true,
      isActive: t.isActive !== undefined ? t.isActive : true,
      order: t.order || 0
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create / Update Testimonial)
  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      Swal.fire('Error', 'Customer Name and Review Comment are required', 'error');
      return;
    }

    try {
      if (editingTestimonialId) {
        await axios.put(`/api/testimonials/${editingTestimonialId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'Testimonial updated successfully', 'success');
      } else {
        await axios.post('/api/testimonials', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Success', 'New testimonial added to homepage slider!', 'success');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save testimonial', 'error');
    }
  };

  // Handle Delete Testimonial
  const handleDeleteTestimonial = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Testimonial?',
      text: `Are you sure you want to remove the review by "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted', 'Testimonial has been removed.', 'success');
        fetchTestimonials();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to delete testimonial', 'error');
      }
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (t) => {
    try {
      await axios.put(`/api/testimonials/${t._id}`, { isActive: !t.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTestimonials();
    } catch (error) {
      console.error(error);
    }
  };

  // Upload Avatar Image to ImgBB
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: body
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, avatar: data.data.url }));
        Swal.fire('Uploaded', 'Customer photo uploaded successfully', 'success');
      } else {
        Swal.fire('Error', 'Image upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Generate Sample Reviews
  const handleGenerateSampleReviews = async () => {
    const result = await Swal.fire({
      title: 'Auto-Add 5 High Quality Reviews?',
      text: 'This will add 5 realistic customer reviews in Bangla & English for your Homepage slider.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, Add Them'
    });

    if (result.isConfirmed) {
      try {
        for (const sample of SAMPLE_AI_REVIEWS) {
          await axios.post('/api/testimonials', sample, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        Swal.fire('Success', 'Added 5 sample reviews to homepage slider!', 'success');
        fetchTestimonials();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to add sample reviews', 'error');
      }
    }
  };

  // Product Reviews Handlers
  const handleUpdateReviewStatus = async (productId, reviewId, isApproved) => {
    try {
      await axios.put(`/api/products/${productId}/reviews/${reviewId}`, { isApproved }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProductReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplySubmit = async (productId, reviewId) => {
    try {
      await axios.put(`/api/products/${productId}/reviews/${reviewId}`, { adminReply: replyText[reviewId] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyingTo(null);
      fetchProductReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-primary, #1a1a1a)', margin: 0 }}>
            Customer Feedback & Reviews
          </h1>
          <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.92rem', margin: '5px 0 0 0' }}>
            Manage homepage auto-sliding testimonials and per-product customer reviews.
          </p>
        </div>

        {activeTab === 'testimonials' && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleGenerateSampleReviews}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'rgba(212, 163, 115, 0.15)',
                color: '#b37d4e',
                border: '1px solid rgba(212, 163, 115, 0.4)',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={16} />
              <span>+ Add 5 AI Preset Reviews</span>
            </button>

            <button 
              onClick={handleOpenCreateModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--color-accent, #1a1a1a)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Plus size={18} />
              <span>Add New Review</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid var(--color-border, #eee)', marginBottom: '25px' }}>
        <button
          onClick={() => setActiveTab('testimonials')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'testimonials' ? '3px solid var(--color-accent, #1a1a1a)' : '3px solid transparent',
            fontWeight: activeTab === 'testimonials' ? 700 : 500,
            color: activeTab === 'testimonials' ? 'var(--color-accent, #1a1a1a)' : 'var(--color-text-secondary, #666)',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🌟 Homepage Testimonials Slider</span>
          <span style={{ fontSize: '0.75rem', background: '#eee', padding: '2px 8px', borderRadius: '12px' }}>
            {testimonials.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('productReviews')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'productReviews' ? '3px solid var(--color-accent, #1a1a1a)' : '3px solid transparent',
            fontWeight: activeTab === 'productReviews' ? 700 : 500,
            color: activeTab === 'productReviews' ? 'var(--color-accent, #1a1a1a)' : 'var(--color-text-secondary, #666)',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>💬 Product User Reviews</span>
          <span style={{ fontSize: '0.75rem', background: '#eee', padding: '2px 8px', borderRadius: '12px' }}>
            {productReviews.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Testimonials / Homepage Slider Reviews */}
      {activeTab === 'testimonials' && (
        <div>
          {loadingTestimonials ? (
            <Loader />
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface, #fafafa)', borderRadius: '12px', border: '1px dashed var(--color-border, #ccc)' }}>
              <Sparkles size={40} color="#b37d4e" style={{ marginBottom: '15px' }} />
              <h3 style={{ margin: '0 0 10px 0' }}>No Homepage Reviews Added Yet</h3>
              <p style={{ color: 'var(--color-text-secondary, #666)', marginBottom: '20px' }}>
                Add customer feedback or generate 5 realistic reviews to display in the auto-scrolling slider on your homepage!
              </p>
              <button 
                onClick={handleGenerateSampleReviews}
                style={{ padding: '10px 20px', background: '#b37d4e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Auto-Add 5 Preset Reviews
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {testimonials.map((t) => (
                <div 
                  key={t._id} 
                  style={{
                    background: 'var(--color-surface, #ffffff)',
                    border: '1px solid var(--color-border, #eee)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    opacity: t.isActive ? 1 : 0.65
                  }}
                >
                  <div>
                    {/* Header with Rating and Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span 
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '50px',
                            fontWeight: 600,
                            background: t.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                            color: t.isActive ? '#10b981' : '#64748b'
                          }}
                        >
                          {t.isActive ? 'Active on Home' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* Review text */}
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-primary, #2d2d2d)', margin: '0 0 15px 0' }}>
                      "{t.comment}"
                    </p>

                    {/* Product Mention */}
                    {t.productName && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(0,0,0,0.03)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-text-secondary, #666)', marginBottom: '15px' }}>
                        <Tag size={12} />
                        <span>{t.productName}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info & Actions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--color-border, #eee)', paddingTop: '15px', marginBottom: '15px' }}>
                      {t.avatar ? (
                        <img 
                          src={t.avatar} 
                          alt={t.name} 
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #b37d4e, #d4a373)', 
                          color: '#fff', 
                          display: t.avatar ? 'none' : 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 700 
                        }}
                      >
                        {t.name ? t.name.charAt(0).toUpperCase() : 'R'}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{t.name}</strong>
                          {t.verified !== false && (
                            <span title="Verified Buyer" style={{ color: '#10b981', display: 'inline-flex' }}>
                              <UserCheck size={14} />
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #888)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} />
                          <span>{t.location || 'ঢাকা, বাংলাদেশ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => handleToggleActive(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '0.8rem',
                          color: t.isActive ? '#64748b' : '#10b981',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 0'
                        }}
                      >
                        {t.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{t.isActive ? 'Hide' : 'Show on Home'}</span>
                      </button>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--color-surface, #fafafa)',
                            border: '1px solid var(--color-border, #ddd)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTestimonial(t._id, t.name)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.82rem'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Per-Product Reviews */}
      {activeTab === 'productReviews' && (
        <div>
          {loadingProductReviews ? (
            <Loader />
          ) : productReviews.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary, #666)' }}>No product user reviews submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {productReviews.map((review) => (
                <div key={review._id} style={{ border: '1px solid var(--color-border, #eee)', borderRadius: '10px', padding: '16px', background: 'var(--color-surface, #fff)', display: 'flex', gap: '16px' }}>
                  {review.productImage && (
                    <img src={review.productImage} alt={review.productName} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <strong>{review.productName}</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '4px 0 8px 0' }}>
                          By {review.name} - {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      </div>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: review.isApproved ? '#d4edda' : '#fff3cd', color: review.isApproved ? '#155724' : '#856404' }}>
                        {review.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </div>
                    
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.92rem' }}>{review.comment}</p>
                    
                    {review.adminReply && (
                      <div style={{ background: 'var(--color-background, #f9f9f9)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--color-accent, #1a1a1a)', marginBottom: '12px', fontSize: '0.88rem' }}>
                        <strong>Admin Reply: </strong> {review.adminReply}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {!review.isApproved ? (
                        <button onClick={() => handleUpdateReviewStatus(review.productId, review._id, true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: '#10b981', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
                          <Check size={14} /> Approve
                        </button>
                      ) : (
                        <button onClick={() => handleUpdateReviewStatus(review.productId, review._id, false)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: '#eee', color: '#333', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
                          <X size={14} /> Hide
                        </button>
                      )}
                      
                      <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: '#333', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>
                        <MessageSquare size={14} /> {review.adminReply ? 'Edit Reply' : 'Reply'}
                      </button>
                    </div>

                    {replyingTo === review._id && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Write your reply..." 
                          value={replyText[review._id] !== undefined ? replyText[review._id] : (review.adminReply || '')} 
                          onChange={(e) => setReplyText({...replyText, [review._id]: e.target.value})}
                          style={{ flex: 1, padding: '8px', border: '1px solid var(--color-border, #ccc)', borderRadius: '4px', fontSize: '0.9rem' }}
                        />
                        <button onClick={() => handleReplySubmit(review.productId, review._id)} style={{ padding: '8px 16px', background: '#1a1a1a', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                          Save Reply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT TESTIMONIAL MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--color-surface, #fff)', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border, #eee)', paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                {editingTestimonialId ? 'Edit Homepage Review' : 'Add New Homepage Review'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitTestimonial}>
              {/* Customer Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Customer Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. নুসরাত জাহান বা Tahmina Akter"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                />
              </div>

              {/* Location & Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>City / Location</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. ধানমন্ডি, ঢাকা"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Rating (1 - 5 Stars)</label>
                  <select 
                    value={formData.rating} 
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                  </select>
                </div>
              </div>

              {/* Review Comment */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Review Comment *</label>
                <textarea 
                  rows={4}
                  value={formData.comment} 
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="e.g. রঙবতী থেকে কেনা ঢাকাই জামদানি শাড়িটার কোয়ালিটি অসাধারণ..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem', resize: 'vertical' }}
                />
              </div>

              {/* Product Purchased Tag */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Product Purchased (Optional Tag)</label>
                <input 
                  type="text" 
                  value={formData.productName} 
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. রয়েল ঢাকাই জামদানি বা পাকিস্তানি লন থ্রি-পিস"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                />
              </div>

              {/* Customer Avatar Photo */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Customer Photo / Avatar URL</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="url" 
                    value={formData.avatar} 
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://... image link or upload below"
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#eee', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Upload size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={isUploading} />
                  </label>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #888)' }}>Leave empty to automatically use the customer's initials circle.</span>
              </div>

              {/* Checkbox Options */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.verified} 
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  />
                  <span>Show "Verified Customer" badge</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Show in Homepage Slider (Active)</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border, #eee)', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 18px', background: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {editingTestimonialId ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
