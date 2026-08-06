import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Admin.module.css';
import { Upload } from 'lucide-react';
import Loader from '../../components/Loader';
import ImageCropperModal from '../../components/ImageCropperModal';

const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Order Management</h1>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                  <td>{order.user?.name || 'Unknown'}</td>
                  <td>{order.orderItems?.length || 0}</td>
                  <td>৳{order.totalPrice}</td>
                  <td>
                    <span style={{ 
                      color: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-text-secondary)', 
                      fontWeight: 600 
                    }}>
                      {order.status || (order.isPaid ? 'Paid' : 'Pending')}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.status || 'Pending'} 
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await axios.put(`/api/orders/${order._id}/status`, { status: newStatus });
                          Swal.fire('Success', 'Order status updated', 'success');
                          // update local state
                          setOrders(orders.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                        } catch (error) {
                          Swal.fire('Error', 'Failed to update status', 'error');
                        }
                      }}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get('/api/users');
        setCustomers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Customers</h1>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center'}}>No customers found</td></tr>
            ) : (
              customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td><button>View Profile</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminMarketing = () => {
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [loadingType, setLoadingType] = useState(null);

  const handleGenerate = async (type) => {
    if (!context) {
      Swal.fire('Error', 'Please enter a product name or context first', 'warning');
      return;
    }
    
    setLoadingType(type);
    try {
      const { data } = await axios.post('/api/ai/generate', { type, context });
      setResult(data.result);
      Swal.fire('Success', 'Content generated successfully!', 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to generate content', 'error');
    } finally {
      setLoadingType(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    Swal.fire('Copied', 'Content copied to clipboard', 'success');
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Marketing & AI Generation</h1>
      </div>
      
      <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Product Context</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Enter the product name, materials, or basic details you want the AI to write about.</p>
        <textarea 
          rows="3" 
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder='e.g., "Premium Black Silk Panjabi with intricate golden embroidery on the collar"'
          style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px', marginBottom: '20px', fontFamily: 'inherit', resize: 'vertical' }}
        />
        
        <div className={styles.statsGrid} style={{ marginBottom: '0' }}>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Generate Product Description</span>
            <button 
              onClick={() => handleGenerate('description')} 
              disabled={loadingType !== null}
              style={{ padding: '10px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: loadingType !== null ? 0.7 : 1 }}
            >
              {loadingType === 'description' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Generate SEO Tags</span>
            <button 
              onClick={() => handleGenerate('seo')} 
              disabled={loadingType !== null}
              style={{ padding: '10px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: loadingType !== null ? 0.7 : 1 }}
            >
              {loadingType === 'seo' ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Generated Output</h3>
            <button 
              onClick={handleCopy}
              style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}
            >
              Copy to Clipboard
            </button>
          </div>
          <textarea 
            rows="8" 
            value={result}
            readOnly
            style={{ width: '100%', padding: '15px', border: '1px solid var(--color-border)', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6', backgroundColor: 'var(--color-background)' }}
          />
        </div>
      )}
    </div>
  );
};

export const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonInputs, setJsonInputs] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [cropModalData, setCropModalData] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
        // Initialize JSON strings for array fields
        setJsonInputs({
          marqueeText: JSON.stringify(data.marqueeText || [], null, 2),
          announcementList: JSON.stringify(data.announcementList || [], null, 2),
          featuredCategories: JSON.stringify(data.featuredCategories || [], null, 2),
          featuredCollections: JSON.stringify(data.featuredCollections || [], null, 2),
          features: JSON.stringify(data.features || [], null, 2),
          reviews: JSON.stringify(data.reviews || [], null, 2),
          instagramImages: JSON.stringify(data.instagramImages || [], null, 2),
          heroSlideshow: JSON.stringify(data.heroSlideshow || [], null, 2),
          featuredVideoSlideshow: JSON.stringify(data.featuredVideoSection?.slideshow || [], null, 2),
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleJsonInputChange = (field, value) => {
    setJsonInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e, field, isNested = false, parent = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModalData({ imageSrc: reader.result, field, isNested, parent });
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset input
  };

  const handleArrayImageUpload = (e, jsonField) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModalData({ imageSrc: reader.result, jsonField });
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset input
  };

  const handleCropComplete = async (croppedBlob) => {
    const { field, isNested, parent, jsonField } = cropModalData;
    
    if (jsonField) {
      setUploadingField(jsonField);
    } else {
      setUploadingField(isNested ? `${parent}.${field}` : field);
    }
    
    setCropModalData(null);

    const imgData = new FormData();
    imgData.append('image', croppedBlob, 'image.jpg');

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      const data = await response.json();
      
      if (data.success) {
        if (jsonField) {
          let currentArray = [];
          try {
            currentArray = JSON.parse(jsonInputs[jsonField]);
            if (!Array.isArray(currentArray)) currentArray = [];
          } catch(err) {
            currentArray = [];
          }
          currentArray.push(data.data.url);
          setJsonInputs(prev => ({ ...prev, [jsonField]: JSON.stringify(currentArray, null, 2) }));
        } else if (isNested) {
          handleNestedChange(parent, field, data.data.url);
        } else {
          setSettings(prev => ({ ...prev, [field]: data.data.url }));
        }
      } else {
        Swal.fire('Error', 'ImgBB upload failed', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Image upload failed', 'error');
    }
    setUploadingField(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Parse JSON fields before saving
      let dataToSave = { ...settings };
      const arrayFields = ['marqueeText', 'announcementList', 'featuredCategories', 'featuredCollections', 'features', 'reviews', 'instagramImages', 'heroSlideshow'];
      
      for (const field of arrayFields) {
        try {
          dataToSave[field] = JSON.parse(jsonInputs[field]);
        } catch (e) {
          Swal.fire('Error', `Invalid JSON formatting in ${field}`, 'error');
          setSaving(false);
          return;
        }
      }

      try {
        if (!dataToSave.featuredVideoSection) dataToSave.featuredVideoSection = {};
        dataToSave.featuredVideoSection.slideshow = JSON.parse(jsonInputs.featuredVideoSlideshow);
      } catch (e) {
        Swal.fire('Error', `Invalid JSON formatting in Featured Video Slideshow`, 'error');
        setSaving(false);
        return;
      }

      await axios.put('/api/settings', dataToSave);
      Swal.fire('Success', 'Store Settings saved successfully!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Error saving settings', 'error');
    }
    setSaving(false);
  };

  if (loading) return <Loader />;

  const inputStyle = { width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px', marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 600, fontSize: '0.9rem' };
  const sectionStyle = { background: 'var(--color-surface)', padding: '24px', borderRadius: '8px', marginBottom: '20px' };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Store CMS Settings</h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'var(--color-accent)', color: 'white', borderRadius: '4px', fontWeight: 600 }}>
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
      
      <div style={sectionStyle}>
        <h3>Global & Announcements</h3>
        
        <label style={labelStyle}>WhatsApp Number</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Enter the number with country code, e.g., 8801700000000</p>
        <input type="text" name="whatsappNumber" value={settings.whatsappNumber || ''} onChange={handleChange} style={inputStyle} />
        
        <label style={labelStyle}>Announcements (Array of strings)</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Format as a JSON array. If you add multiple, they will automatically swipe in the header. If one, it will stay fixed.<br/>
          <code>[ "FREE SHIPPING ON ORDERS OVER ৳5000", "PREMIUM SUMMER COLLECTION 2026" ]</code>
        </p>
        <textarea rows="4" value={jsonInputs.announcementList} onChange={(e) => handleJsonInputChange('announcementList', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px'}} />
        
        <h4 style={{marginTop: '20px', marginBottom: '10px'}}>Social Media Links</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Facebook</label>
            <input type="text" value={settings.socialLinks?.facebook || ''} onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>Instagram</label>
            <input type="text" value={settings.socialLinks?.instagram || ''} onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>TikTok</label>
            <input type="text" value={settings.socialLinks?.tiktok || ''} onChange={(e) => handleNestedChange('socialLinks', 'tiktok', e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label style={labelStyle}>YouTube</label>
            <input type="text" value={settings.socialLinks?.youtube || ''} onChange={(e) => handleNestedChange('socialLinks', 'youtube', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Hero Section</h3>
        <label style={labelStyle}>Title</label>
        <input type="text" name="heroTitle" value={settings.heroTitle || ''} onChange={handleChange} style={inputStyle} />
        
        <label style={labelStyle}>Subtitle</label>
        <input type="text" name="heroSubtitle" value={settings.heroSubtitle || ''} onChange={handleChange} style={inputStyle} />
        
        <label style={labelStyle}>Background Image URL</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <input type="text" name="heroImage" value={settings.heroImage || ''} onChange={handleChange} style={{...inputStyle, marginBottom: 0}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
            <Upload size={16} /> {uploadingField === 'heroImage' ? 'Uploading...' : 'Upload'}
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage')} />
          </label>
        </div>
        
        <label style={labelStyle}>Background Video URL (Optional MP4)</label>
        <input type="text" name="heroVideo" value={settings.heroVideo || ''} onChange={handleChange} style={inputStyle} />
        
        <label style={labelStyle}>Hero Slideshow (Array of Image URLs) - Replaces static image</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Upload an image directly to add it to the slideshow, or edit the JSON array manually.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <textarea rows="4" placeholder='[\n  "https://i.ibb.co/example1.jpg",\n  "https://i.ibb.co/example2.jpg"\n]' value={jsonInputs.heroSlideshow} onChange={(e) => handleJsonInputChange('heroSlideshow', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px', marginBottom: 0}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)', height: '42px' }}>
            <Upload size={16} /> {uploadingField === 'heroSlideshow' ? 'Uploading...' : 'Add Image'}
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleArrayImageUpload(e, 'heroSlideshow')} />
          </label>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Featured Video Section</h3>
        <label style={labelStyle}>Title</label>
        <input type="text" value={settings.featuredVideoSection?.title || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'title', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Subtitle</label>
        <input type="text" value={settings.featuredVideoSection?.subtitle || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'subtitle', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Video URL (MP4)</label>
        <input type="text" value={settings.featuredVideoSection?.videoUrl || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'videoUrl', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Slideshow Images (Array of URLs) - Used if no video</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Upload an image directly to add it to the slideshow, or edit the JSON array manually.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <textarea rows="4" placeholder='[\n  "https://i.ibb.co/example1.jpg",\n  "https://i.ibb.co/example2.jpg"\n]' value={jsonInputs.featuredVideoSlideshow} onChange={(e) => handleJsonInputChange('featuredVideoSlideshow', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px', marginBottom: 0}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)', height: '42px' }}>
            <Upload size={16} /> {uploadingField === 'featuredVideoSlideshow' ? 'Uploading...' : 'Add Image'}
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleArrayImageUpload(e, 'featuredVideoSlideshow')} />
          </label>
        </div>
        
        <label style={labelStyle}>Fallback Image URL</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <input type="text" value={settings.featuredVideoSection?.fallbackImage || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'fallbackImage', e.target.value)} style={{...inputStyle, marginBottom: 0}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
            <Upload size={16} /> {uploadingField === 'featuredVideoSection.fallbackImage' ? 'Uploading...' : 'Upload'}
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'fallbackImage', true, 'featuredVideoSection')} />
          </label>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Brand Story</h3>
        <label style={labelStyle}>Title</label>
        <input type="text" value={settings.brandStory?.title || ''} onChange={(e) => handleNestedChange('brandStory', 'title', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Image URL</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
          <input type="text" value={settings.brandStory?.image || ''} onChange={(e) => handleNestedChange('brandStory', 'image', e.target.value)} style={{...inputStyle, marginBottom: 0}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
            <Upload size={16} /> {uploadingField === 'brandStory.image' ? 'Uploading...' : 'Upload'}
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'image', true, 'brandStory')} />
          </label>
        </div>
        <label style={labelStyle}>Story Text</label>
        <textarea rows="4" value={settings.brandStory?.text || ''} onChange={(e) => handleNestedChange('brandStory', 'text', e.target.value)} style={{...inputStyle, fontFamily: 'inherit'}} />
      </div>

      <div style={sectionStyle}>
        <h3>Banners</h3>
        
        <h4 style={{marginTop: '10px', marginBottom: '10px'}}>Limited Edition Banner</h4>
        <div style={{display: 'flex', gap: '10px'}}>
          <input type="text" placeholder="Title" value={settings.limitedEdition?.title || ''} onChange={(e) => handleNestedChange('limitedEdition', 'title', e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Image URL" value={settings.limitedEdition?.image || ''} onChange={(e) => handleNestedChange('limitedEdition', 'image', e.target.value)} style={{...inputStyle, flex: 2}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)', height: '42px' }}>
            <Upload size={16} />
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'image', true, 'limitedEdition')} />
          </label>
        </div>

        <h4 style={{marginTop: '10px', marginBottom: '10px'}}>Shop The Look</h4>
        <div style={{display: 'flex', gap: '10px'}}>
          <input type="text" placeholder="Title" value={settings.shopTheLook?.title || ''} onChange={(e) => handleNestedChange('shopTheLook', 'title', e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Image URL" value={settings.shopTheLook?.image || ''} onChange={(e) => handleNestedChange('shopTheLook', 'image', e.target.value)} style={{...inputStyle, flex: 2}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)', height: '42px' }}>
            <Upload size={16} />
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'image', true, 'shopTheLook')} />
          </label>
        </div>

        <h4 style={{marginTop: '10px', marginBottom: '10px'}}>Premium Collection</h4>
        <div style={{display: 'flex', gap: '10px'}}>
          <input type="text" placeholder="Title" value={settings.premiumCollection?.title || ''} onChange={(e) => handleNestedChange('premiumCollection', 'title', e.target.value)} style={inputStyle} />
          <input type="text" placeholder="Image URL" value={settings.premiumCollection?.image || ''} onChange={(e) => handleNestedChange('premiumCollection', 'image', e.target.value)} style={{...inputStyle, flex: 2}} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)', height: '42px' }}>
            <Upload size={16} />
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, 'image', true, 'premiumCollection')} />
          </label>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>Advanced Array Data (JSON)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>Edit these structures carefully using valid JSON formatting. Do not break the quotes or brackets.</p>
        
        <label style={labelStyle}>Marquee Text (Array of strings)</label>
        <textarea rows="3" value={jsonInputs.marqueeText} onChange={(e) => handleJsonInputChange('marqueeText', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px'}} />

        <label style={labelStyle}>Featured Categories (Array of objects)</label>
        <textarea rows="6" value={jsonInputs.featuredCategories} onChange={(e) => handleJsonInputChange('featuredCategories', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px'}} />

        <label style={labelStyle}>Featured Collections (Array of objects)</label>
        <textarea rows="6" value={jsonInputs.featuredCollections} onChange={(e) => handleJsonInputChange('featuredCollections', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px'}} />
        
        <label style={labelStyle}>Instagram Gallery Images (Array of strings)</label>
        <textarea rows="4" value={jsonInputs.instagramImages} onChange={(e) => handleJsonInputChange('instagramImages', e.target.value)} style={{...inputStyle, fontFamily: 'monospace', fontSize: '13px'}} />
      </div>

      <div style={sectionStyle}>
        <h3>Static Pages Content (HTML/Text)</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>Use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;h3&gt; for formatting.</p>
        
        <h4 style={{marginBottom: '10px'}}>About Us Page</h4>
        <div style={{ padding: '15px', border: '1px solid var(--color-border)', borderRadius: '4px', marginBottom: '20px' }}>
          <label style={labelStyle}>Hero Image URL</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <input type="text" value={settings.staticPages?.about?.heroImage || ''} onChange={(e) => {
              const staticPages = {...(settings.staticPages || {})};
              if(!staticPages.about) staticPages.about = {};
              staticPages.about.heroImage = e.target.value;
              setSettings({...settings, staticPages});
            }} style={{...inputStyle, marginBottom: 0}} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
              <Upload size={16} /> {uploadingField === 'staticPages.about.heroImage' ? 'Uploading...' : 'Upload'}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setCropModalData({
                      imageSrc: reader.result,
                      onCropCompleteForLocal: async (croppedBlob) => {
                        setUploadingField('staticPages.about.heroImage');
                        setCropModalData(null);
                        const imgData = new FormData();
                        imgData.append('image', croppedBlob, 'image.jpg');
                        try {
                          const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgData });
                          const data = await res.json();
                          if (data.success) {
                            handleNestedChange('staticPages', 'about', { ...settings.staticPages?.about, heroImage: data.data.url });
                          } else Swal.fire('Error', 'ImgBB upload failed', 'error');
                        } catch (error) { Swal.fire('Error', 'Image upload failed', 'error'); }
                        setUploadingField(null);
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                  e.target.value = null;
                }} />
            </label>
          </div>
          
          <label style={labelStyle}>Story Text</label>
          <textarea rows="4" value={settings.staticPages?.about?.storyText || ''} onChange={(e) => {
            const staticPages = {...(settings.staticPages || {})};
            if(!staticPages.about) staticPages.about = {};
            staticPages.about.storyText = e.target.value;
            setSettings({...settings, staticPages});
          }} style={inputStyle} />
          
          <label style={labelStyle}>Materials Image 1</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <input type="text" value={settings.staticPages?.about?.materialsImage1 || ''} onChange={(e) => {
              const staticPages = {...(settings.staticPages || {})};
              if(!staticPages.about) staticPages.about = {};
              staticPages.about.materialsImage1 = e.target.value;
              setSettings({...settings, staticPages});
            }} style={{...inputStyle, marginBottom: 0}} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
              <Upload size={16} /> {uploadingField === 'staticPages.about.materialsImage1' ? 'Uploading...' : 'Upload'}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setCropModalData({
                    imageSrc: reader.result,
                    onCropCompleteForLocal: async (croppedBlob) => {
                      setUploadingField('staticPages.about.materialsImage1');
                      setCropModalData(null);
                      const imgData = new FormData();
                      imgData.append('image', croppedBlob, 'image.jpg');
                      try {
                        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgData });
                        const data = await res.json();
                        if (data.success) {
                          const staticPages = {...(settings.staticPages || {})};
                          if(!staticPages.about) staticPages.about = {};
                          staticPages.about.materialsImage1 = data.data.url;
                          setSettings({...settings, staticPages});
                        } else Swal.fire('Error', 'ImgBB upload failed', 'error');
                      } catch (error) { Swal.fire('Error', 'Image upload failed', 'error'); }
                      setUploadingField(null);
                    }
                  });
                };
                reader.readAsDataURL(file);
                e.target.value = null;
              }} />
            </label>
          </div>

          <label style={labelStyle}>Materials Image 2</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
            <input type="text" value={settings.staticPages?.about?.materialsImage2 || ''} onChange={(e) => {
              const staticPages = {...(settings.staticPages || {})};
              if(!staticPages.about) staticPages.about = {};
              staticPages.about.materialsImage2 = e.target.value;
              setSettings({...settings, staticPages});
            }} style={{...inputStyle, marginBottom: 0}} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--color-surface-hover)', padding: '10px 15px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid var(--color-border)' }}>
              <Upload size={16} /> {uploadingField === 'staticPages.about.materialsImage2' ? 'Uploading...' : 'Upload'}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setCropModalData({
                    imageSrc: reader.result,
                    onCropCompleteForLocal: async (croppedBlob) => {
                      setUploadingField('staticPages.about.materialsImage2');
                      setCropModalData(null);
                      const imgData = new FormData();
                      imgData.append('image', croppedBlob, 'image.jpg');
                      try {
                        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: imgData });
                        const data = await res.json();
                        if (data.success) {
                          const staticPages = {...(settings.staticPages || {})};
                          if(!staticPages.about) staticPages.about = {};
                          staticPages.about.materialsImage2 = data.data.url;
                          setSettings({...settings, staticPages});
                        } else Swal.fire('Error', 'ImgBB upload failed', 'error');
                      } catch (error) { Swal.fire('Error', 'Image upload failed', 'error'); }
                      setUploadingField(null);
                    }
                  });
                };
                reader.readAsDataURL(file);
                e.target.value = null;
              }} />
            </label>
          </div>

          <label style={labelStyle}>Materials Text</label>
          <textarea rows="4" value={settings.staticPages?.about?.materialsText || ''} onChange={(e) => {
            const staticPages = {...(settings.staticPages || {})};
            if(!staticPages.about) staticPages.about = {};
            staticPages.about.materialsText = e.target.value;
            setSettings({...settings, staticPages});
          }} style={inputStyle} />
        </div>

        {['faq', 'contact', 'shipping', 'returns', 'sizeGuide', 'privacy', 'terms'].map(page => (
          <div key={page} style={{ marginBottom: '15px' }}>
            <label style={{...labelStyle, textTransform: 'capitalize'}}>{page.replace(/([A-Z])/g, ' $1').trim()} Page (HTML)</label>
            <textarea 
              rows="6" 
              value={settings.staticPages?.[page] || ''} 
              onChange={(e) => {
                const staticPages = {...(settings.staticPages || {})};
                staticPages[page] = e.target.value;
                setSettings({...settings, staticPages});
              }} 
              style={{...inputStyle, fontFamily: 'monospace', fontSize: '14px'}} 
            />
          </div>
        ))}
      </div>

      {cropModalData && (
        <ImageCropperModal
          imageSrc={cropModalData.imageSrc}
          onCropComplete={(blob) => {
            if (cropModalData.onCropCompleteForLocal) {
              cropModalData.onCropCompleteForLocal(blob);
            } else {
              handleCropComplete(blob);
            }
          }}
          onCancel={() => setCropModalData(null)}
          aspectRatio={undefined}
        />
      )}
    </div>
  );
};

export default AdminOrders;
