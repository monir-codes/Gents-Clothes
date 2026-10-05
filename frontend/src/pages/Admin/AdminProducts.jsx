import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { 
  Plus, Edit, Trash2, X, Upload, Sparkles, Wand2, Search, 
  Check, RefreshCw, Link as LinkIcon, Image as ImageIcon, AlertCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuthStore from '../../store/useAuthStore';

// ImgBB API Key
const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c";

// Pre-defined Categories
const CATEGORIES = [
  "Sarees",
  "Salwar Kameez",
  "Kurtis & Tunics",
  "Lehengas & Gowns",
  "Western Wear",
  "Modest Wear",
  "Co-ord Sets",
  "Jewelry & Accessories",
  "Men's Collection"
];

// Quick Category-Specific Size Presets
const SIZE_PRESETS = {
  "Sarees": ["12 Haat with Blouse Piece", "12 Haat (Free Size)", "14 Haat with Blouse Piece", "Without Blouse Piece"],
  "Salwar Kameez": ["Unstitched (Free Size)", "Semi-Stitched", "36, 38, 40, 42, 44", "38, 40, 42, 44, 46", "S, M, L, XL, XXL"],
  "Kurtis & Tunics": ["36, 38, 40, 42, 44", "S, M, L, XL", "S, M, L, XL, XXL", "Free Size"],
  "Lehengas & Gowns": ["Semi-Stitched (Free Size)", "Custom Fit (36-44)", "Ready-to-Wear"],
  "Modest Wear": ["52, 54, 56", "52, 54, 56, 58", "54, 56, 58", "Free Size with Hijab"],
  "Western Wear": ["S, M, L, XL", "XS, S, M, L, XL, XXL", "Free Size"],
  "Co-ord Sets": ["S, M, L, XL", "Free Size", "36, 38, 40, 42"],
  "Jewelry & Accessories": ["Free Size", "Adjustable", "Standard Size"],
  "Men's Collection": ["38, 40, 42, 44", "S, M, L, XL, XXL", "Free Size"]
};

// Quick Example Prompts for Magic AI
const MAGIC_EXAMPLES = [
  {
    label: "🥻 Saree (Bangla)",
    text: "লাল জামদানি শাড়ি ৮৪ কাউন্ট পিওর কটন। সাথে ম্যাচিং আনস্টিচড ব্লাউজ পিস আছে। শাড়ির সাইজ ১২ হাত। দাম ৩৫০০ টাকা, আগের দাম ছিল ৪২০০ টাকা। গোল্ডেন জরির কাজ করা। ড্রাই ওয়াশ করতে হবে।"
  },
  {
    label: "👗 3-Piece Salwar Kameez",
    text: "Pakistani Luxury Embroidered Lawn 3-Piece Salwar Kameez with pure chiffon dupatta. Kamiz 3 yards, salwar 2.5 yards, dupatta 2.5 yards. Color: Emerald Green, Pastel Pink. Price 2850 BDT, regular 3400. Delicate cold wash."
  },
  {
    label: "👚 Kurti & Tunic",
    text: "Designer Hand Embroidery Cotton Kurti in Mustard Yellow and Maroon. Available chest sizes 38, 40, 42, 44. Price 1450 Tk. Hand wash."
  },
  {
    label: "🧕 Abaya / Modest Wear",
    text: "Premium Dubai Cherry Silk Abaya with matching Hijab. Available sizes: 52, 54, 56. Colors: Jet Black, Olive, Plum. Price 3200 Tk. Dry clean recommended."
  }
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageTarget, setImageTarget] = useState(null); // 'image' or 'hoverImage'
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' or 'url'
  const { token } = useAuthStore();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // AI Magic State
  const [magicText, setMagicText] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const initialFormState = {
    name: '',
    price: '',
    oldPrice: '',
    category: 'Sarees',
    brand: 'রঙবতী',
    countInStock: 10,
    description: '',
    image: '',
    hoverImage: '',
    sku: '',
    sizes: '',
    colors: '',
    fabricDetails: {
      material: '',
      gsm: '',
      washInstruction: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products?limit=150');
      setProducts(Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFabricDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      fabricDetails: { ...prev.fabricDetails, [name]: value }
    }));
  };

  const handleSizePresetClick = (sizePreset) => {
    setFormData(prev => {
      if (!prev.sizes) return { ...prev, sizes: sizePreset };
      if (prev.sizes.includes(sizePreset)) return prev;
      return { ...prev, sizes: `${prev.sizes}, ${sizePreset}` };
    });
  };

  const handleImageUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setImageTarget(target);
    const imgData = new FormData();
    imgData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      const data = await response.json();
      
      if (data.success && data.data?.url) {
        setFormData(prev => ({ ...prev, [target]: data.data.url }));
        Swal.fire({ 
          title: 'Uploaded!', 
          text: 'Image uploaded successfully.', 
          icon: 'success', 
          toast: true, 
          position: 'top-end', 
          showConfirmButton: false, 
          timer: 2000 
        });
      } else {
        Swal.fire('Upload Error', data.error?.message || 'Image upload failed. Please try again or paste direct URL.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Image upload service unreachable. You can paste the direct image URL instead.', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const generateDetails = async () => {
    const context = formData.name || formData.description || formData.category;
    if (!context) {
      Swal.fire('Missing Product Info', 'Please enter a product title or basic notes first.', 'warning');
      return;
    }
    
    setIsGenerating(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.post('/api/ai/generate', { type: 'product_details', context }, config);
      
      const parsed = data.data || (typeof data.result === 'string' ? JSON.parse(data.result.replace(/```json/gi, '').replace(/```/g, '').trim()) : null);

      if (parsed) {
        setFormData(prev => ({
          ...prev,
          description: parsed.description || prev.description,
          category: parsed.category || prev.category,
          sizes: parsed.sizes || prev.sizes,
          fabricDetails: {
            material: parsed.material || prev.fabricDetails?.material || '',
            gsm: parsed.gsm || prev.fabricDetails?.gsm || '',
            washInstruction: parsed.washInstruction || prev.fabricDetails?.washInstruction || ''
          }
        }));
        Swal.fire({ title: 'AI Details Generated!', text: 'Description and fabric specifications updated.', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2500 });
      } else {
        Swal.fire('Notice', 'AI responded in plain text. Please review.', 'info');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to generate details. Please check connection.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMagicFill = async () => {
    if (!magicText.trim()) {
      Swal.fire('Empty Input', 'Please paste raw product details or click one of the examples below.', 'warning');
      return;
    }
    
    setIsMagicLoading(true);
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await axios.post('/api/ai/generate', { type: 'smart_extract', context: magicText }, config);
      
      const parsedData = data.data || (typeof data.result === 'string' ? JSON.parse(data.result.replace(/```json/gi, '').replace(/```/g, '').trim()) : null);
      
      if (parsedData) {
        const safeSizes = Array.isArray(parsedData.sizes) 
          ? parsedData.sizes.join(', ') 
          : (parsedData.sizes ? String(parsedData.sizes) : prev.sizes);

        const safeColors = Array.isArray(parsedData.colors) 
          ? parsedData.colors.join(', ') 
          : (parsedData.colors ? String(parsedData.colors) : prev.colors);

        const safeMaterial = Array.isArray(parsedData.material) 
          ? parsedData.material.join(' / ') 
          : (parsedData.material ? String(parsedData.material) : (prev.fabricDetails?.material || ''));

        setFormData(prev => ({
          ...prev,
          name: parsedData.name || prev.name,
          price: parsedData.price !== undefined ? parsedData.price : prev.price,
          oldPrice: parsedData.oldPrice !== null && parsedData.oldPrice !== undefined ? parsedData.oldPrice : prev.oldPrice,
          category: parsedData.category || prev.category,
          sizes: safeSizes,
          colors: safeColors,
          sku: parsedData.sku || prev.sku,
          description: parsedData.description || prev.description,
          fabricDetails: {
            material: safeMaterial,
            gsm: parsedData.gsm || prev.fabricDetails?.gsm || '',
            washInstruction: parsedData.washInstruction || prev.fabricDetails?.washInstruction || ''
          }
        }));

        Swal.fire({ 
          title: '✨ Magic Auto-Fill Success!', 
          text: `Form successfully populated for "${parsedData.name || 'Product'}".`, 
          icon: 'success', 
          toast: true, 
          position: 'top-end', 
          showConfirmButton: false, 
          timer: 3500 
        });
      } else {
        Swal.fire('Extraction Error', 'Could not parse response into fields. Please verify your text.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to extract product details.', 'error');
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      Swal.fire('Required Field', 'Product title is required.', 'warning');
      return;
    }

    try {
      const submissionData = {
        ...formData,
        price: Number(formData.price) || 0,
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        countInStock: Number(formData.countInStock) >= 0 ? Number(formData.countInStock) : 0,
        sizes: typeof formData.sizes === 'string' 
          ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) 
          : formData.sizes,
        colors: typeof formData.colors === 'string' 
          ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) 
          : formData.colors
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, submissionData, config);
        Swal.fire('Updated!', 'Product updated successfully in live catalog.', 'success');
      } else {
        await axios.post('/api/products', submissionData, config);
        Swal.fire('Published!', 'New product added to live catalog.', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Save product error:', error);
      Swal.fire('Error Saving Product', error.response?.data?.message || error.message || 'Failed to save product to database.', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setMagicText('');
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setMagicText('');
    setFormData({
      name: product.name || '',
      price: product.price || 0,
      category: product.category || 'Sarees',
      brand: product.brand || 'রঙবতী',
      countInStock: product.countInStock !== undefined ? product.countInStock : 0,
      description: product.description || '',
      image: product.image || '',
      hoverImage: product.hoverImage || '',
      oldPrice: product.oldPrice || '',
      sku: product.sku || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      fabricDetails: {
        material: product.fabricDetails?.material || '',
        gsm: product.fabricDetails?.gsm || '',
        washInstruction: product.fabricDetails?.washInstruction || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`/api/products/${id}`, config);
        Swal.fire('Deleted!', 'Product removed from database.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to delete product', 'error');
      }
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = searchQuery === '' || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;

      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  const activeCategoryPresets = SIZE_PRESETS[formData.category] || SIZE_PRESETS["Sarees"];

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.dashboardTitle}>Products Catalog</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Manage and publish women's fashion, sarees, dresses & ethnic collections
          </p>
        </div>
        <button 
          onClick={openAddModal} 
          style={{ 
            padding: '11px 22px', 
            background: 'var(--color-accent)', 
            color: 'white', 
            borderRadius: '6px', 
            border: 'none',
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(94, 15, 43, 0.25)'
          }}
        >
          <Plus size={19} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', background: 'var(--color-background)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 250px', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input 
            type="text" 
            placeholder="Search by product title, SKU, or category..." 
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
          value={selectedCategoryFilter} 
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid var(--color-border)', borderRadius: '6px', background: 'var(--color-surface)', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="ALL">All Categories ({products.length})</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button 
          onClick={fetchProducts} 
          title="Refresh List"
          style={{ padding: '9px 14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} className={loading ? styles.spin : ''} /> Refresh
        </button>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Image</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  No products found matching your search.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200'} 
                      alt={product.name} 
                      style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }} 
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{product.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px', fontFamily: 'monospace' }}>
                      SKU: {product.sku || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', padding: '3px 8px', background: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>৳{product.price}</div>
                    {product.oldPrice && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textDecoration: 'line-through' }}>
                        ৳{product.oldPrice}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}>
                      {Array.isArray(product.sizes) && product.sizes.length > 0 
                        ? product.sizes.join(', ') 
                        : (typeof product.sizes === 'string' && product.sizes ? product.sizes : 'Free Size')}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: product.countInStock > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: product.countInStock > 0 ? '#16a34a' : '#ef4444' 
                    }}>
                      {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => openEditModal(product)} 
                        title="Edit Product"
                        style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', color: 'var(--color-accent)' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id, product.name)} 
                        title="Delete Product"
                        style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', color: 'var(--color-error)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          width: '100vw', 
          height: '100vh', 
          height: '100dvh',
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(5px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 10000, 
          padding: '16px' 
        }}>
          <div style={{ 
            background: 'var(--color-background)', 
            width: '100%', 
            maxWidth: '780px', 
            maxHeight: '92vh', 
            overflowY: 'auto', 
            padding: '28px', 
            borderRadius: '12px', 
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--color-border)',
            overscrollBehaviorY: 'contain'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              aria-label="Close modal"
              style={{ 
                position: 'absolute', 
                top: '18px', 
                right: '18px', 
                background: 'var(--color-surface)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '50%', 
                width: '34px', 
                height: '34px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer' 
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                {editingId ? 'Update product specifications and live storefront data.' : 'Fill in the details manually or use AI Magic Paste to auto-populate the entire form.'}
              </p>
            </div>
            
            {/* AI Magic Paste Section */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(94, 15, 43, 0.04) 0%, rgba(94, 15, 43, 0.09) 100%)', 
              padding: '16px', 
              borderRadius: '10px', 
              marginBottom: '24px', 
              border: '1px solid rgba(94, 15, 43, 0.2)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={18} color="var(--color-accent)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-accent)' }}>
                    AI Magic Paste (Gemini AI)
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={handleMagicFill}
                  disabled={isMagicLoading}
                  style={{ 
                    background: 'var(--color-accent)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '7px 16px', 
                    borderRadius: '6px', 
                    fontSize: '0.88rem', 
                    cursor: isMagicLoading ? 'wait' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isMagicLoading ? 0.7 : 1,
                    boxShadow: '0 2px 6px rgba(94, 15, 43, 0.2)'
                  }}
                >
                  <Wand2 size={16} />
                  {isMagicLoading ? '✨ Analyzing with AI...' : '✨ Auto-Fill Entire Form'}
                </button>
              </div>

              <textarea 
                placeholder="Paste raw unstructured notes, supplier details, WhatsApp/FB copy (Bangla, English, Banglish) e.g. 'Pure cotton red jamdani saree 12 haat with blouse piece, price 3500, dry clean only'..."
                value={magicText}
                onChange={(e) => setMagicText(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '6px', 
                  minHeight: '75px', 
                  fontFamily: 'inherit', 
                  fontSize: '0.88rem',
                  resize: 'vertical',
                  background: 'var(--color-background)'
                }}
              />

              {/* Example Prompts */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Quick Examples:</span>
                {MAGIC_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMagicText(ex.text)}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Product Images (Upload or URL) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Product Imagery</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.78rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        background: imageInputMode === 'upload' ? 'var(--color-text-primary)' : 'var(--color-surface)',
                        color: imageInputMode === 'upload' ? '#fff' : 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.78rem',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        background: imageInputMode === 'url' ? 'var(--color-text-primary)' : 'var(--color-surface)',
                        color: imageInputMode === 'url' ? '#fff' : 'var(--color-text-primary)',
                        cursor: 'pointer'
                      }}
                    >
                      Paste URL
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Main Image */}
                  <div style={{ border: '1px dashed var(--color-border)', padding: '14px', textAlign: 'center', borderRadius: '8px', background: 'var(--color-surface)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>Main Front Image</p>
                    {formData.image ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={formData.image} alt="Preview" style={{ height: '90px', width: '90px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px', border: '1px solid var(--color-border)' }} />
                        <button 
                          type="button" 
                          onClick={() => setFormData(p => ({ ...p, image: '' }))}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <Upload size={28} style={{ marginBottom: '6px', color: 'var(--color-text-secondary)' }} />
                    )}

                    {imageInputMode === 'upload' ? (
                      <div>
                        <label style={{ cursor: 'pointer', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.82rem', display: 'block' }}>
                          {isUploading && imageTarget === 'image' ? 'Uploading to ImgBB...' : 'Choose Main File'}
                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} />
                        </label>
                      </div>
                    ) : (
                      <input 
                        type="url" 
                        name="image" 
                        placeholder="https://example.com/image.jpg" 
                        value={formData.image} 
                        onChange={handleInputChange} 
                        style={{ width: '100%', padding: '6px 8px', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', marginTop: '6px' }}
                      />
                    )}
                  </div>

                  {/* Hover Image */}
                  <div style={{ border: '1px dashed var(--color-border)', padding: '14px', textAlign: 'center', borderRadius: '8px', background: 'var(--color-surface)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>Hover / Angle Image (Optional)</p>
                    {formData.hoverImage ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={formData.hoverImage} alt="Hover Preview" style={{ height: '90px', width: '90px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px', border: '1px solid var(--color-border)' }} />
                        <button 
                          type="button" 
                          onClick={() => setFormData(p => ({ ...p, hoverImage: '' }))}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <Upload size={28} style={{ marginBottom: '6px', color: 'var(--color-text-secondary)' }} />
                    )}

                    {imageInputMode === 'upload' ? (
                      <div>
                        <label style={{ cursor: 'pointer', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.82rem', display: 'block' }}>
                          {isUploading && imageTarget === 'hoverImage' ? 'Uploading to ImgBB...' : 'Choose Hover File'}
                          <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} />
                        </label>
                      </div>
                    ) : (
                      <input 
                        type="url" 
                        name="hoverImage" 
                        placeholder="https://example.com/hover.jpg" 
                        value={formData.hoverImage} 
                        onChange={handleInputChange} 
                        style={{ width: '100%', padding: '6px 8px', fontSize: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', marginTop: '6px' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Title & SKU */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 350px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Product Title / Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g. Royal Blue Zari Embroidered Pure Katan Silk Saree" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div style={{ flex: '1 1 180px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>SKU / Product Code</label>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="e.g. RGB-SAR-101 (Auto generated if blank)" 
                    value={formData.sku} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>
              
              {/* Pricing & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Selling Price (৳) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="e.g. 3500" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Previous / Regular Price (৳)</label>
                  <input 
                    type="number" 
                    name="oldPrice" 
                    placeholder="e.g. 4200 (for discount badge)" 
                    value={formData.oldPrice} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>
                    <span>Stock Quantity</span>
                    <span style={{ color: Number(formData.countInStock) > 0 ? '#16a34a' : '#ef4444' }}>
                      {Number(formData.countInStock) > 0 ? ' (In Stock)' : ' (Out of Stock)'}
                    </span>
                  </label>
                  <input 
                    type="number" 
                    name="countInStock" 
                    placeholder="10" 
                    value={formData.countInStock} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>

              {/* Category, Sizes, Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem', background: 'var(--color-surface)', cursor: 'pointer' }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>
                    Sizes / Measurements (comma separated)
                  </label>
                  <input 
                    type="text" 
                    name="sizes" 
                    placeholder="e.g. 12 Haat with Blouse Piece, Free Size, 38, 40, 42" 
                    value={formData.sizes} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Colors (comma separated)</label>
                  <input 
                    type="text" 
                    name="colors" 
                    placeholder="e.g. Maroon, Antique Gold, Royal Blue" 
                    value={formData.colors} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.92rem' }} 
                  />
                </div>
              </div>

              {/* Quick Size Presets for Current Category */}
              <div style={{ background: 'var(--color-surface)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  ⚡ Quick Size Presets for {formData.category} (click to add):
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeCategoryPresets.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSizePresetClick(preset)}
                      style={{
                        background: 'var(--color-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        color: 'var(--color-accent)',
                        fontWeight: 500
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Fabric & Craft Details */}
              <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', background: 'var(--color-surface-dim, #fafafa)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.92rem' }}>Fabric, Material & Care Details</label>
                  <button 
                    type="button" 
                    onClick={generateDetails}
                    disabled={isGenerating}
                    style={{ 
                      background: 'var(--color-accent)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '5px 12px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: isGenerating ? 0.7 : 1
                    }}
                  >
                    <Sparkles size={14} />
                    {isGenerating ? 'Generating...' : '✨ Generate AI Specs & Copy'}
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Material / Fabric</label>
                    <input 
                      type="text" 
                      name="material" 
                      placeholder="e.g. Pure Katan Silk / 84 Count Cotton" 
                      value={formData.fabricDetails.material} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>GSM / Weave Count</label>
                    <input 
                      type="text" 
                      name="gsm" 
                      placeholder="e.g. 84 Count / Heavy Weight / N/A" 
                      value={formData.fabricDetails.gsm} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Wash & Care Instruction</label>
                    <input 
                      type="text" 
                      name="washInstruction" 
                      placeholder="e.g. Dry clean recommended" 
                      value={formData.fabricDetails.washInstruction} 
                      onChange={handleFabricDetailChange} 
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.88rem', background: 'var(--color-background)' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', marginBottom: '4px', fontWeight: 600 }}>Luxury Product Description *</label>
                  <textarea 
                    name="description" 
                    placeholder="Rich description highlighting elegance, styling advice, craftsmanship..." 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required 
                    style={{ 
                      padding: '10px 12px', 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '4px', 
                      minHeight: '100px', 
                      width: '100%', 
                      fontFamily: 'inherit', 
                      fontSize: '0.88rem',
                      resize: 'vertical',
                      background: 'var(--color-background)'
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ 
                    padding: '12px 20px', 
                    background: 'var(--color-surface)', 
                    color: 'var(--color-text-primary)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '6px', 
                    fontWeight: 600,
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '12px 28px', 
                    background: 'var(--color-text-primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {editingId ? 'Save & Update Product' : 'Publish Product to Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
