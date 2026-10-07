import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, Edit2, Trash2, X, Search, HelpCircle, Check, 
  Sparkles, Eye, EyeOff, Tag, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/useAuthStore';
import Loader from '../../components/Loader';

const FAQ_CATEGORIES = [
  'General',
  'Orders & Payment',
  'Delivery & Shipping',
  'Fabric & Sizing',
  'Returns & Exchange'
];

const PRESET_FAQS = [
  {
    question: "কীভাবে রঙবতী (Ronggoboti) থেকে শাড়ি, থ্রি-পিস বা কুর্তি অর্ডার করব?",
    answer: "পছন্দের প্রোডাক্টটি সিলেক্ট করে 'Add to Cart' অথবা 'Buy Now' বাটনে ক্লিক করুন। আপনার নাম, ঠিকানা ও মোবাইল নম্বর দিয়ে ক্যাশ অন ডেলিভারি (COD) বা বিকাশ/নগদে পেমেন্ট সিলেক্ট করে খুব সহজেই অর্ডার কনফার্ম করতে পারবেন।",
    category: "Orders & Payment",
    order: 1,
    isActive: true
  },
  {
    question: "সারা বাংলাদেশে ডেলিভারি পেতে কত দিন সময় লাগে?",
    answer: "ঢাকা সিটির ভেতরে ১ থেকে ২ কর্মদিবস এবং ঢাকার বাইরে ৩ থেকে ৫ কর্মদিবসের মধ্যে আপনার দোরগোড়ায় পণ্য পৌঁছে দেওয়া হয়।",
    category: "Delivery & Shipping",
    order: 2,
    isActive: true
  },
  {
    question: "রঙবতীর পোশাকের কাপড়ের মান ও সোর্সিং (Quality & Sourcing) কেমন?",
    answer: "আমরা নিজস্ব ফ্যাক্টরিতে পোশাক উৎপাদন করিনা; বরং দেশের শীর্ষ ভেরিফাইড সাপ্লায়ার (Verified Suppliers) ও খাঁটি তাঁত হাবগুলো থেকে প্রতিটি শাড়ি ও পোশাক নিবিড়ভাবে কোয়ালিটি যাচাই করে সংগ্রহ ও রিসেল করি। ফলে গ্রাহক পান শতভাগ সেরা মানের নিশ্চয়তা।",
    category: "Fabric & Sizing",
    order: 3,
    isActive: true
  },
  {
    question: "ক্যাশ অন ডেলিভারিতে (Cash on Delivery) কি পণ্য চেক করে নেওয়া যাবে?",
    answer: "হ্যাঁ, ডেলিভারিম্যানের সামনে পার্সেলটি চেক করে নেওয়ার পূর্ণ সুবিধা রয়েছে। পণ্যে কোনো ত্রুটি থাকলে বা মনের মতো পছন্দ না হলে ডেলিভারিম্যানকে শুধুমাত্র ডেলিভারি চার্জ পরিশোধ করে সাথে সাথে সম্পূর্ণ পার্সেলটি রিটার্ন করতে পারবেন।",
    category: "Orders & Payment",
    order: 4,
    isActive: true
  },
  {
    question: "পণ্য পছন্দ না হলে বা ত্রুটি থাকলে রিটার্ন পলিসি কী (Return Policy)?",
    answer: "ডেলিভারিম্যানের সামনে পার্সেল চেক করে যদি কোনো ত্রুটি পান কিংবা মনের মতো পছন্দ না হয়, তবে ডেলিভারিম্যানকে শুধুমাত্র ডেলিভারি চার্জ দিয়ে সাথে সাথে রিটার্ন করতে পারবেন। এছাড়া কোনো সাইজ এক্সচেঞ্জের প্রয়োজন হলে ডেলিভারির ২৪-৪৮ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করতে পারবেন।",
    category: "Returns & Exchange",
    order: 5,
    isActive: true
  },
  {
    question: "শাড়ি ও দামি পোশাকগুলোর যত্ন কীভাবে নেব (Wash & Care)?",
    answer: "জামদানি, কাতান ও সিল্কের মতো এক্সক্লুসিভ পোশাকগুলোর সৌন্দর্য ও জরির কাজ দীর্ঘস্থায়ী রাখতে ড্রাই ক্লিন (Dry Clean) করার পরামর্শ দেওয়া হয়। সুতি পোশাক হালকা পানিতে কোমল ডিটারজেন্ট দিয়ে ধোয়া উত্তম।",
    category: "Fabric & Sizing",
    order: 6,
    isActive: true
  },
  {
    question: "রঙবতী কি নিজস্ব কারখানায় পোশাক প্রস্তুত করে?",
    answer: "না, রঙবতী কোনো প্রস্তুতকারক কারখানা নয়। আমরা একটি বিশ্বস্ত ফ্যাশন শপ ও কিউরেটর। আমরা অভিজ্ঞ ও ভেরিফাইড সাপ্লায়ারদের কাছ থেকে সেরা মানের অথেনটিক পোশাক কোয়ালিটি চেকের মাধ্যমে বাছাই করে রিসেলিং করে থাকি।",
    category: "General",
    order: 7,
    isActive: true
  },
  {
    question: "অগ্রিম কোনো টাকা দিতে হবে কি?",
    answer: "ঢাকার বাইরের অর্ডারের ক্ষেত্রে ডেলিভারি চার্জ বাবদ সামান্য অগ্রিম প্রযোজ্য হতে পারে, যা বিকাশ বা নগদে পরিশোধ করা যায়। বাকি মূল্যের পুরো টাকা পণ্য হাতে পেয়ে চেক করে পরিশোধ করবেন।",
    category: "Orders & Payment",
    order: 8,
    isActive: true
  }
];

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const { token } = useAuthStore();

  const initialFormState = {
    question: '',
    answer: '',
    category: 'Orders & Payment',
    order: 0,
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/faqs/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [token]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      ...initialFormState,
      order: faqs.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq) => {
    setEditingId(faq._id);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      order: faq.order || 0,
      isActive: faq.isActive !== undefined ? faq.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      Swal.fire('Error', 'Question and Answer are required', 'error');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/faqs/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Updated', 'FAQ updated successfully', 'success');
      } else {
        await axios.post('/api/faqs', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Added', 'New FAQ published to storefront and SEO schema', 'success');
      }
      setIsModalOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save FAQ', 'error');
    }
  };

  const handleDelete = async (id, question) => {
    const result = await Swal.fire({
      title: 'Delete FAQ?',
      text: `Are you sure you want to delete: "${question}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/faqs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted', 'FAQ has been removed.', 'success');
        fetchFAQs();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to delete FAQ', 'error');
      }
    }
  };

  const handleToggleActive = async (faq) => {
    try {
      await axios.put(`/api/faqs/${faq._id}`, { isActive: !faq.isActive }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFAQs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPresetFAQs = async () => {
    const result = await Swal.fire({
      title: 'Add 7 Essential Store FAQs?',
      text: 'This will auto-populate 7 comprehensive fashion eCommerce FAQs in Bengali and English.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Yes, Add Presets'
    });

    if (result.isConfirmed) {
      try {
        for (const item of PRESET_FAQS) {
          await axios.post('/api/faqs', item, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        Swal.fire('Success', 'Added 7 FAQs successfully!', 'success');
        fetchFAQs();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to add preset FAQs', 'error');
      }
    }
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(item => {
      const matchesSearch = !searchQuery || 
        (item.question && item.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [faqs, searchQuery, selectedCategory]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-primary, #1a1a1a)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={26} color="var(--color-accent, #5E0F2B)" />
            <span>Frequently Asked Questions (FAQ) Manager</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary, #666)', fontSize: '0.92rem', margin: '5px 0 0 0' }}>
            Manage questions displayed on the storefront and automatically indexed as Google FAQPage Schema.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleAddPresetFAQs}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'rgba(94, 15, 43, 0.08)',
              color: 'var(--color-accent, #5E0F2B)',
              border: '1px solid rgba(94, 15, 43, 0.25)',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>+ Add 7 Preset FAQs</span>
          </button>

          <button 
            onClick={handleOpenAddModal}
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
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '22px', background: 'var(--color-background)', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 250px', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input 
            type="text" 
            placeholder="Search questions or answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={16} color="var(--color-text-secondary)" />
            </button>
          )}
        </div>

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-surface)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="ALL">All Categories ({faqs.length})</option>
          {FAQ_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button 
          onClick={fetchFAQs} 
          title="Refresh List"
          style={{ padding: '9px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* FAQ List */}
      {loading ? (
        <Loader />
      ) : filteredFaqs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-surface, #fafafa)', borderRadius: '12px', border: '1px dashed var(--color-border, #ccc)' }}>
          <HelpCircle size={40} color="var(--color-accent)" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0' }}>No FAQs Found</h3>
          <p style={{ color: 'var(--color-text-secondary, #666)', marginBottom: '20px' }}>
            Add questions & answers to help shoppers and boost Google Search ranking.
          </p>
          <button 
            onClick={handleAddPresetFAQs}
            style={{ padding: '10px 20px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Add 7 Preset FAQs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaqId === faq._id;

            return (
              <div 
                key={faq._id} 
                style={{
                  background: 'var(--color-surface, #ffffff)',
                  border: '1px solid var(--color-border, #eee)',
                  borderRadius: '10px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  opacity: faq.isActive ? 1 : 0.65
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedFaqId(isExpanded ? null : faq._id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(94, 15, 43, 0.08)', color: 'var(--color-accent, #5E0F2B)' }}>
                        #{faq.order || index + 1}
                      </span>
                      <span style={{ fontSize: '0.78rem', padding: '2px 8px', borderRadius: '50px', background: 'var(--color-background, #f5f5f5)', border: '1px solid var(--color-border, #eee)', color: 'var(--color-text-secondary, #666)' }}>
                        {faq.category || 'General'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: faq.isActive ? '#10b981' : '#64748b' }}>
                        {faq.isActive ? '● Live on Store' : '○ Hidden'}
                      </span>
                    </div>

                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary, #1a1a1a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{faq.question}</span>
                      {isExpanded ? <ChevronUp size={16} color="var(--color-text-secondary)" /> : <ChevronDown size={16} color="var(--color-text-secondary)" />}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleActive(faq)}
                      title={faq.isActive ? 'Hide from store' : 'Show on store'}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border, #ddd)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: faq.isActive ? '#64748b' : '#10b981'
                      }}
                    >
                      {faq.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(faq)}
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
                      onClick={() => handleDelete(faq._id, faq.question)}
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
                    </button>
                  </div>
                </div>

                {/* Answer Body */}
                {(isExpanded || searchQuery) && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border, #eee)', color: 'var(--color-text-secondary, #444)', fontSize: '0.94rem', lineHeight: '1.6' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT FAQ MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--color-surface, #fff)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '14px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border, #eee)', paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                {editingId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Question */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Question (প্রশ্ন) *</label>
                <input 
                  type="text" 
                  value={formData.question} 
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. কীভাবে রঙবতী থেকে শাড়ি অর্ডার করব?"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                />
              </div>

              {/* Answer */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Answer (উত্তর) *</label>
                <textarea 
                  rows={5}
                  value={formData.answer} 
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed, helpful answer in Bangla or English..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem', resize: 'vertical', lineHeight: '1.5' }}
                />
              </div>

              {/* Category & Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                  >
                    {FAQ_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>Display Order Number</label>
                  <input 
                    type="number" 
                    value={formData.order} 
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border, #ccc)', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Show on FAQ Page & Google Search Schema (Active)</span>
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
                  style={{ padding: '10px 24px', background: 'var(--color-accent, #1a1a1a)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  {editingId ? 'Save Changes' : 'Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQ;
