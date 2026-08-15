import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, MessageSquare, Trash2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Loader from '../../components/Loader';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const { token } = useAuthStore();

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('/api/products/reviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : []));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (productId, reviewId, isApproved) => {
    try {
      await axios.put(`/api/products/${productId}/reviews/${reviewId}`, { isApproved }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReviews();
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
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>Manage Reviews</h2>
      
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map(review => (
            <div key={review._id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '15px', background: 'var(--color-surface)', display: 'flex', gap: '20px' }}>
              <img src={review.productImage} alt={review.productName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{review.productName}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                      By {review.name} - {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, background: review.isApproved ? 'var(--color-success, #d4edda)' : '#fff3cd', color: review.isApproved ? '#155724' : '#856404' }}>
                      {review.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
                
                <p style={{ margin: '0 0 15px 0' }}>{review.comment}</p>
                
                {review.adminReply && (
                  <div style={{ background: 'var(--color-background)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--color-accent)', marginBottom: '15px' }}>
                    <strong>Admin Reply: </strong> {review.adminReply}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {!review.isApproved ? (
                    <button onClick={() => handleUpdateStatus(review.productId, review._id, true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--color-success, #28a745)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                      <Check size={16} /> Approve
                    </button>
                  ) : (
                    <button onClick={() => handleUpdateStatus(review.productId, review._id, false)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                      <X size={16} /> Reject / Hide
                    </button>
                  )}
                  
                  <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--color-accent)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    <MessageSquare size={16} /> {review.adminReply ? 'Edit Reply' : 'Reply'}
                  </button>
                </div>

                {replyingTo === review._id && (
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Write your reply..." 
                      value={replyText[review._id] !== undefined ? replyText[review._id] : (review.adminReply || '')} 
                      onChange={(e) => setReplyText({...replyText, [review._id]: e.target.value})}
                      style={{ flex: 1, padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                    />
                    <button onClick={() => handleReplySubmit(review.productId, review._id)} style={{ padding: '8px 16px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
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
  );
};

export default AdminReviews;
