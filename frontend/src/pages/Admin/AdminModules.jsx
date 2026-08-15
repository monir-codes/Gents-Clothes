import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Admin.module.css';
import { Upload, X, Trash2 } from 'lucide-react';
import Loader from '../../components/Loader';
import ImageCropperModal from '../../components/ImageCropperModal';
import useAuthStore from '../../store/useAuthStore';

const IMGBB_API_KEY = "affe71bc1ff1277c7d83bc8e9dfe4c3c";

// Helper to get auth config
const getAuthConfig = () => {
  const token = useAuthStore.getState().token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders', getAuthConfig());
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    
    // Polling every 10 seconds for real-time updates
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteOrder = async (orderId) => {
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
        await axios.delete(`/api/orders/${orderId}`, getAuthConfig());
        setOrders(orders.filter(order => order._id !== orderId));
        Swal.fire('Deleted!', 'Order has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete order.', 'error');
      }
    }
  };

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
            {!Array.isArray(orders) || orders.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No orders found</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td>#{order.customId ? order.customId : (order._id ? String(order._id).substring(0, 8).toUpperCase() : 'N/A')}</td>
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
                          await axios.put(`/api/orders/${order._id}/status`, { status: newStatus }, getAuthConfig());
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
                    <button 
                      onClick={() => handleDeleteOrder(order._id)}
                      style={{ padding: '6px', marginLeft: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', border: '1px solid #f87171', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                      title="Delete Order"
                    >
                      <Trash2 size={16} />
                    </button>
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
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get('/api/users', getAuthConfig());
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    if (isConfirmed) {
      try {
        await axios.delete(`/api/users/${id}`, getAuthConfig());
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchCustomers();
        if (selectedCustomer && selectedCustomer._id === id) setSelectedCustomer(null);
      } catch (error) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to delete user.', 'error');
      }
    }
  };

  const handleToggleAdmin = async (id, currentStatus) => {
    try {
      await axios.put(`/api/users/${id}/role`, { isAdmin: !currentStatus }, getAuthConfig());
      Swal.fire('Updated!', `User role changed to ${!currentStatus ? 'Admin' : 'Customer'}.`, 'success');
      fetchCustomers();
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer({ ...selectedCustomer, isAdmin: !currentStatus });
      }
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to update role.', 'error');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>User Management</h1>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(customers) || customers.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>No customers found</td></tr>
            ) : (
              customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>
                    {customer.isVerified ? (
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: '#dcfce7', color: '#166534' }}>
                        Verified
                      </span>
                    ) : (
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', background: '#fee2e2', color: '#991b1b' }}>
                        Unverified
                      </span>
                    )}
                  </td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td>{customer.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td>
                    <button onClick={() => setSelectedCustomer(customer)} style={{ padding: '6px 12px', background: 'var(--color-accent)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', marginRight: '5px' }}>View Profile</button>
                    <button onClick={() => handleDeleteUser(customer._id)} style={{ padding: '6px', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', border: '1px solid #f87171', cursor: 'pointer' }} title="Delete User">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: '500px', padding: '30px', borderRadius: '8px', position: 'relative' }}>
            <button onClick={() => setSelectedCustomer(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Customer Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Name:</strong> <br/>{selectedCustomer.name}</div>
                <div><strong>Email:</strong> <br/>{selectedCustomer.email}</div>
                <div><strong>Phone:</strong> <br/>{selectedCustomer.phone || 'N/A'}</div>
                <div>
                  <strong>Role:</strong> <br/>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {selectedCustomer.isAdmin ? 'Admin' : 'Customer'}
                    <button onClick={() => handleToggleAdmin(selectedCustomer._id, selectedCustomer.isAdmin)} style={{ padding: '4px 8px', fontSize: '0.8rem', background: selectedCustomer.isAdmin ? '#fee2e2' : '#dcfce7', color: selectedCustomer.isAdmin ? '#dc2626' : '#166534', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      {selectedCustomer.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </div>
                </div>
                <div>
                  <strong>Verified:</strong> <br/>
                  {selectedCustomer.isVerified ? (
                      <span style={{ color: '#166534', fontWeight: 'bold' }}>Yes</span>
                  ) : (
                      <span style={{ color: '#991b1b', fontWeight: 'bold' }}>No</span>
                  )}
                </div>
                <div><strong>Joined:</strong> <br/>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--color-border)' }}>
                <strong>Saved Addresses:</strong>
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', marginTop: '10px', listStyleType: 'disc' }}>
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <li key={idx} style={{ marginBottom: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                        {addr.street}, <br/>
                        {addr.city}, {addr.district} <br/>
                        {addr.region && `${addr.region}, `}{addr.country} - {addr.zipCode || ''}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ marginTop: '5px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No address saved yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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
      const { data } = await axios.post('/api/ai/generate', { type, context }, getAuthConfig());
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
  const [textInputs, setTextInputs] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [cropModalData, setCropModalData] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
        // Initialize multiline strings for array fields
        setTextInputs({
          marqueeText: Array.isArray(data.marqueeText) ? data.marqueeText.join('\n') : (data.marqueeText || ''),
          announcementList: Array.isArray(data.announcementList) ? data.announcementList.join('\n') : (data.announcementList || ''),
          instagramImages: Array.isArray(data.instagramImages) ? data.instagramImages.join('\n') : (data.instagramImages || ''),
          heroSlideshow: Array.isArray(data.heroSlideshow) ? data.heroSlideshow.join('\n') : (data.heroSlideshow || ''),
          featuredVideoSlideshow: Array.isArray(data.featuredVideoSection?.slideshow) ? data.featuredVideoSection.slideshow.join('\n') : (data.featuredVideoSection?.slideshow || ''),
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

  const handleTextInputChange = (field, value) => {
    setTextInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectArrayChange = (field, index, key, value) => {
    const newArray = [...(settings[field] || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    setSettings({ ...settings, [field]: newArray });
  };
  
  const handleAddObject = (field, defaultObject) => {
    const newArray = [...(settings[field] || []), defaultObject];
    setSettings({ ...settings, [field]: newArray });
  };
  
  const handleRemoveObject = (field, index) => {
    const newArray = [...(settings[field] || [])];
    newArray.splice(index, 1);
    setSettings({ ...settings, [field]: newArray });
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

  const handleArrayImageUpload = (e, textField) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModalData({ imageSrc: reader.result, textField });
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset input
  };

  const handleCropComplete = async (croppedBlob) => {
    const { field, isNested, parent, textField } = cropModalData;
    
    if (textField) {
      setUploadingField(textField);
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
        if (textField) {
          setTextInputs(prev => {
            const current = prev[textField] ? prev[textField].trim() : '';
            return { ...prev, [textField]: current ? current + '\n' + data.data.url : data.data.url };
          });
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
      let dataToSave = { ...settings };
      
      const stringArrayFields = ['marqueeText', 'announcementList', 'instagramImages', 'heroSlideshow'];
      for (const field of stringArrayFields) {
        dataToSave[field] = (textInputs[field] || '').split('\n').map(s => s.trim()).filter(Boolean);
      }

      if (!dataToSave.featuredVideoSection) dataToSave.featuredVideoSection = {};
      dataToSave.featuredVideoSection.slideshow = (textInputs.featuredVideoSlideshow || '').split('\n').map(s => s.trim()).filter(Boolean);

      await axios.put('/api/settings', dataToSave, getAuthConfig());
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
        
        <label style={labelStyle}>Announcements (One per line)</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Type each announcement on a new line. They will automatically swipe in the header.
        </p>
        <textarea rows="4" value={textInputs.announcementList} onChange={(e) => handleTextInputChange('announcementList', e.target.value)} style={{...inputStyle, fontFamily: 'inherit', fontSize: '14px'}} />
        
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
        <h3>Payment Settings</h3>
        <label style={labelStyle}>Advance Payment Method</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>E.g. bKash (Send Money), Nagad (Cash Out)</p>
        <input type="text" value={settings.paymentSettings?.advancePaymentMethod || ''} onChange={(e) => handleNestedChange('paymentSettings', 'advancePaymentMethod', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Advance Payment Number (If Applicable)</label>
        <input type="text" value={settings.paymentSettings?.advancePaymentNumber || ''} onChange={(e) => handleNestedChange('paymentSettings', 'advancePaymentNumber', e.target.value)} style={inputStyle} />
        
        <label style={labelStyle}>Delivery Charge (৳)</label>
        <input type="number" value={settings.paymentSettings?.deliveryCharge ?? 120} onChange={(e) => handleNestedChange('paymentSettings', 'deliveryCharge', Number(e.target.value))} style={inputStyle} />
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
        
        <label style={labelStyle}>Hero Slideshow URLs (One per line) - Replaces static image</label>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Upload an image directly to add it to the slideshow, or paste URLs manually.
        </p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <textarea rows="4" placeholder="https://i.ibb.co/example1.jpg" value={textInputs.heroSlideshow} onChange={(e) => handleTextInputChange('heroSlideshow', e.target.value)} style={{...inputStyle, fontFamily: 'inherit', fontSize: '14px', marginBottom: 0}} />
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
        
        <label style={labelStyle}>Slideshow Images URLs (One per line) - Used if no video</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <textarea rows="4" placeholder="https://i.ibb.co/example1.jpg" value={textInputs.featuredVideoSlideshow} onChange={(e) => handleTextInputChange('featuredVideoSlideshow', e.target.value)} style={{...inputStyle, fontFamily: 'inherit', fontSize: '14px', marginBottom: 0}} />
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
        <h3>Dynamic Lists & Text Options</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>Easily add, edit, or remove items. No JSON needed.</p>
        
        <label style={labelStyle}>Marquee Text (One per line)</label>
        <textarea rows="3" value={textInputs.marqueeText} onChange={(e) => handleTextInputChange('marqueeText', e.target.value)} style={{...inputStyle, fontFamily: 'inherit', fontSize: '14px'}} />

        <label style={labelStyle}>Featured Categories</label>
        {settings.featuredCategories?.map((cat, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" value={cat.title || ''} onChange={(e) => handleObjectArrayChange('featuredCategories', i, 'title', e.target.value)} placeholder="Title" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <input type="text" value={cat.image || ''} onChange={(e) => handleObjectArrayChange('featuredCategories', i, 'image', e.target.value)} placeholder="Image URL" style={{...inputStyle, marginBottom: 0, flex: 2}} />
            <input type="text" value={cat.link || ''} onChange={(e) => handleObjectArrayChange('featuredCategories', i, 'link', e.target.value)} placeholder="Link (/shop?category=X)" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <button onClick={() => handleRemoveObject('featuredCategories', i)} style={{ padding: '0 10px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
          </div>
        ))}
        <button onClick={() => handleAddObject('featuredCategories', { title: '', image: '', link: '' })} style={{ padding: '5px 10px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '15px' }}>+ Add Category</button>

        <label style={labelStyle}>Featured Collections</label>
        {settings.featuredCollections?.map((col, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" value={col.title || ''} onChange={(e) => handleObjectArrayChange('featuredCollections', i, 'title', e.target.value)} placeholder="Title" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <input type="text" value={col.image || ''} onChange={(e) => handleObjectArrayChange('featuredCollections', i, 'image', e.target.value)} placeholder="Image URL" style={{...inputStyle, marginBottom: 0, flex: 2}} />
            <input type="text" value={col.link || ''} onChange={(e) => handleObjectArrayChange('featuredCollections', i, 'link', e.target.value)} placeholder="Link" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <button onClick={() => handleRemoveObject('featuredCollections', i)} style={{ padding: '0 10px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
          </div>
        ))}
        <button onClick={() => handleAddObject('featuredCollections', { title: '', image: '', link: '' })} style={{ padding: '5px 10px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '15px' }}>+ Add Collection</button>

        <label style={labelStyle}>Features (Why Choose Us)</label>
        {settings.features?.map((feat, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select value={feat.icon || 'Shield'} onChange={(e) => handleObjectArrayChange('features', i, 'icon', e.target.value)} style={{...inputStyle, marginBottom: 0, flex: 1}}>
              <option value="Shield">Shield</option>
              <option value="Truck">Truck</option>
              <option value="RefreshCw">Refresh</option>
            </select>
            <input type="text" value={feat.title || ''} onChange={(e) => handleObjectArrayChange('features', i, 'title', e.target.value)} placeholder="Title" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <input type="text" value={feat.subtitle || ''} onChange={(e) => handleObjectArrayChange('features', i, 'subtitle', e.target.value)} placeholder="Subtitle" style={{...inputStyle, marginBottom: 0, flex: 2}} />
            <button onClick={() => handleRemoveObject('features', i)} style={{ padding: '0 10px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px' }}>X</button>
          </div>
        ))}
        <button onClick={() => handleAddObject('features', { icon: 'Shield', title: '', subtitle: '' })} style={{ padding: '5px 10px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '15px' }}>+ Add Feature</button>

        <label style={labelStyle}>Customer Reviews</label>
        {settings.reviews?.map((rev, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <input type="text" value={rev.author || ''} onChange={(e) => handleObjectArrayChange('reviews', i, 'author', e.target.value)} placeholder="Author" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <input type="number" min="1" max="5" value={rev.rating || 5} onChange={(e) => handleObjectArrayChange('reviews', i, 'rating', Number(e.target.value))} placeholder="Rating (1-5)" style={{...inputStyle, marginBottom: 0, flex: 1}} />
            <input type="text" value={rev.text || ''} onChange={(e) => handleObjectArrayChange('reviews', i, 'text', e.target.value)} placeholder="Review text" style={{...inputStyle, marginBottom: 0, flex: 3}} />
            <button onClick={() => handleRemoveObject('reviews', i)} style={{ padding: '0 10px', background: 'var(--color-error)', color: 'white', border: 'none', borderRadius: '4px', height: '42px' }}>X</button>
          </div>
        ))}
        <button onClick={() => handleAddObject('reviews', { author: '', rating: 5, text: '' })} style={{ padding: '5px 10px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '15px' }}>+ Add Review</button>
        
        <label style={labelStyle}>Instagram Gallery Image URLs (One per line)</label>
        <textarea rows="4" value={textInputs.instagramImages} onChange={(e) => handleTextInputChange('instagramImages', e.target.value)} style={{...inputStyle, fontFamily: 'inherit', fontSize: '14px'}} />
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
