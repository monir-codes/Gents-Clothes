import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import styles from './Dashboard.module.css';
import { LogOut, Package, MapPin, Heart, User, Bell } from 'lucide-react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    district: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.addresses?.[0]?.street || '',
        city: user.addresses?.[0]?.city || '',
        district: user.addresses?.[0]?.district || ''
      });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formattedData = {
      name: profileData.name,
      phone: profileData.phone,
      addresses: [{
        street: profileData.street,
        city: profileData.city,
        district: profileData.district
      }]
    };
    
    const success = await updateProfile(formattedData);
    if (success) {
      Swal.fire('Success', 'Profile updated successfully!', 'success');
    } else {
      Swal.fire('Error', 'Failed to update profile.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className={`container ${styles.dashboardContainer}`}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user.name.charAt(0)}</div>
          <div>
            <h3 className={styles.userName}>{user.name}</h3>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <button className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`} onClick={() => setActiveTab('orders')}><Package size={18}/> My Orders</button>
          <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}><User size={18}/> Profile Settings</button>
          <button className={styles.navItem} onClick={handleLogout} style={{ color: 'var(--color-error)' }}><LogOut size={18}/> Logout</button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'orders' && (
          <>
            <h1 className={styles.title}>My Orders</h1>
            <div className={styles.emptyState}>
              <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet.</p>
              <button className={styles.shopBtn} onClick={() => navigate('/shop')}>Start Shopping</button>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 className={styles.title}>Profile Settings</h1>
            <div style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '8px' }}>
              <form onSubmit={handleProfileUpdate}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Full Name</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} required />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Phone Number</label>
                  <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} required />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>Street Address</label>
                  <input type="text" value={profileData.street} onChange={e => setProfileData({...profileData, street: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} required />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>City</label>
                    <input type="text" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 600 }}>District</label>
                    <select value={profileData.district} onChange={e => setProfileData({...profileData, district: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', borderRadius: '4px' }} required>
                      <option value="">Select District</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
