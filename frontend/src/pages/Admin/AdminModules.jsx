import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';

const AdminOrders = () => {
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
            <tr>
              <td>#ORD-001</td>
              <td>Rumman Amin</td>
              <td>2</td>
              <td>৳3,500</td>
              <td><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Delivered</span></td>
              <td><button>Update Status</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminCustomers = () => (
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
              <th>Total Orders</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rumman Amin</td>
              <td>rumman@example.com</td>
              <td>5</td>
              <td><button>View Profile</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
);

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
  const [settings, setSettings] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    aboutStory: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings(data);
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving settings');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading CMS...</div>;

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Store CMS Settings</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ padding: '10px 20px', background: 'var(--color-accent)', color: 'white', borderRadius: '4px' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '8px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hero Title</label>
          <input 
            type="text" 
            name="heroTitle"
            value={settings.heroTitle} 
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hero Subtitle</label>
          <input 
            type="text" 
            name="heroSubtitle"
            value={settings.heroSubtitle} 
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hero Image URL</label>
          <input 
            type="text" 
            name="heroImage"
            value={settings.heroImage} 
            onChange={handleChange}
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>About Us Story</label>
          <textarea 
            name="aboutStory"
            value={settings.aboutStory} 
            onChange={handleChange}
            rows="6"
            style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '4px', fontFamily: 'inherit' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
