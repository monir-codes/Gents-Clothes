import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Admin.module.css';
import { Upload } from 'lucide-react';
import Loader from '../../components/Loader';

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
                  <td><button>Update Status</button></td>
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

export const AdminMarketing = () => (
  <div>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>Marketing & AI Generation</h1>
    </div>
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={styles.statTitle}>Generate Product Description</span>
        <button style={{ padding: '8px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px' }}>Generate with AI</button>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statTitle}>Generate SEO Tags</span>
        <button style={{ padding: '8px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px' }}>Generate with AI</button>
      </div>
    </div>
  </div>
);

export const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonInputs, setJsonInputs] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
        // Initialize JSON strings for array fields
        setJsonInputs({
          marqueeText: JSON.stringify(data.marqueeText || [], null, 2),
          featuredCategories: JSON.stringify(data.featuredCategories || [], null, 2),
          featuredCollections: JSON.stringify(data.featuredCollections || [], null, 2),
          features: JSON.stringify(data.features || [], null, 2),
          reviews: JSON.stringify(data.reviews || [], null, 2),
          instagramImages: JSON.stringify(data.instagramImages || [], null, 2),
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

  const handleImageUpload = async (e, field, isNested = false, parent = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(isNested ? `${parent}.${field}` : field);
    const imgData = new FormData();
    imgData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgData,
      });
      const data = await response.json();
      
      if (data.success) {
        if (isNested) {
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
      const arrayFields = ['marqueeText', 'featuredCategories', 'featuredCollections', 'features', 'reviews', 'instagramImages'];
      
      for (const field of arrayFields) {
        try {
          dataToSave[field] = JSON.parse(jsonInputs[field]);
        } catch (e) {
          Swal.fire('Error', `Invalid JSON formatting in ${field}`, 'error');
          setSaving(false);
          return;
        }
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
        <h3>Global & Announcement</h3>
        <label style={labelStyle}>Announcement Text</label>
        <input type="text" name="announcementText" value={settings.announcementText || ''} onChange={handleChange} style={inputStyle} />
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
      </div>

      <div style={sectionStyle}>
        <h3>Featured Video Section</h3>
        <label style={labelStyle}>Title</label>
        <input type="text" value={settings.featuredVideoSection?.title || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'title', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Subtitle</label>
        <input type="text" value={settings.featuredVideoSection?.subtitle || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'subtitle', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Video URL</label>
        <input type="text" value={settings.featuredVideoSection?.videoUrl || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'videoUrl', e.target.value)} style={inputStyle} />
        <label style={labelStyle}>Fallback Image URL</label>
        <input type="text" value={settings.featuredVideoSection?.fallbackImage || ''} onChange={(e) => handleNestedChange('featuredVideoSection', 'fallbackImage', e.target.value)} style={inputStyle} />
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

    </div>
  );
};

export default AdminOrders;
