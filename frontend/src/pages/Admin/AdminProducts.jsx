import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

// User's official ImgBB API key
const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c"; 

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    brand: 'GentFits',
    countInStock: 0,
    description: '',
    image: ''
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const imgData = new FormData();
    imgData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      const data = await response.json();
      
      if (data.success) {
        setFormData({ ...formData, image: data.data.url });
        Swal.fire('Success', 'Image uploaded to ImgBB successfully!', 'success');
      } else {
        Swal.fire('Error', 'ImgBB upload failed. Check API Key.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Image upload failed', 'error');
    }
    setIsUploading(false);
  };

  const generateDescription = async () => {
    const context = formData.description || formData.name;
    if (!context) {
      Swal.fire('Error', 'Please enter a product name or basic description first', 'warning');
      return;
    }
    
    setIsGenerating(true);
    try {
      const { data } = await axios.post('/api/ai/generate', { type: 'description', context });
      setFormData(prev => ({ ...prev, description: data.result }));
      Swal.fire({
        title: 'Success',
        text: 'Description generated successfully!',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to generate description', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData);
        Swal.fire('Updated!', 'Product updated successfully.', 'success');
      } else {
        await axios.post('/api/products', formData);
        Swal.fire('Added!', 'Product added successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      Swal.fire('Error', 'Failed to save product', 'error');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0, category: '', brand: 'GentFits', countInStock: 0, description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      description: product.description,
      image: product.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/products/${id}`);
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete product', 'error');
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Products Database</h1>
        <button onClick={openAddModal} style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>৳{product.price}</td>
                <td>
                  <span style={{ color: product.countInStock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                    {product.countInStock > 0 ? product.countInStock : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button onClick={() => openEditModal(product)} style={{ marginRight: '16px', color: 'var(--color-accent)' }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '30px', borderRadius: '8px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '20px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* ImgBB Image Upload */}
              <div style={{ border: '2px dashed var(--color-border)', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                {formData.image ? (
                  <img src={formData.image} alt="Preview" style={{ height: '100px', marginBottom: '10px' }} />
                ) : (
                  <Upload size={32} style={{ marginBottom: '10px', color: 'var(--color-text-secondary)' }} />
                )}
                <div>
                  <label style={{ cursor: 'pointer', color: 'var(--color-accent)', fontWeight: 600 }}>
                    {isUploading ? 'Uploading to ImgBB...' : 'Upload Image'}
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} required style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>Price (৳)</label>
                  <input type="number" name="price" placeholder="Price (৳)" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 600 }}>
                    Stock Quantity 
                    <span style={{ color: formData.countInStock > 0 ? 'var(--color-success, #28a745)' : 'var(--color-error)' }}>
                      {formData.countInStock > 0 ? ' (In Stock)' : ' (Out of Stock)'}
                    </span>
                  </label>
                  <input type="number" name="countInStock" placeholder="Stock Qty (0 = Out of Stock)" value={formData.countInStock} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
                </div>
              </div>

              <input type="text" name="category" placeholder="Category (e.g., Summer)" value={formData.category} onChange={handleInputChange} required style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} />
              
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Product Description</label>
                  <button 
                    type="button" 
                    onClick={generateDescription}
                    disabled={isGenerating}
                    style={{ 
                      background: 'var(--color-accent)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '5px 12px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      opacity: isGenerating ? 0.7 : 1
                    }}
                  >
                    {isGenerating ? 'Generating...' : '✨ Rewrite/Generate with AI'}
                  </button>
                </div>
                <textarea name="description" placeholder="Enter basic details and click 'Generate with AI', or write full description here..." value={formData.description} onChange={handleInputChange} required style={{ padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', minHeight: '120px', width: '100%', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" style={{ padding: '12px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', fontWeight: 600, marginTop: '10px' }}>
                {editingId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
