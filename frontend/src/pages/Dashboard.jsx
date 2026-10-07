import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useLanguageStore from '../store/useLanguageStore';
import styles from './Dashboard.module.css';
import { LogOut, Package, MapPin, Heart, User, Bell } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const { language, formatPrice, formatNumber } = useLanguageStore();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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
      fetchMyOrders();
    }
  }, [user, navigate]);

  const fetchMyOrders = async () => {
    try {
      const token = useAuthStore.getState().token;
      const { data } = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

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
      Swal.fire(isBn ? 'সফল!' : 'Success', isBn ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!', 'success');
    } else {
      Swal.fire(isBn ? 'ত্রুটি!' : 'Error', isBn ? 'প্রোফাইল আপডেট ব্যর্থ হয়েছে।' : 'Failed to update profile.', 'error');
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
          <button className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`} onClick={() => setActiveTab('orders')}>
            <Package size={18}/> {isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}
          </button>
          <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}>
            <User size={18}/> {isBn ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
          </button>
          <button className={styles.navItem} onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
            <LogOut size={18}/> {isBn ? 'লগআউট' : 'Logout'}
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'orders' && (
          <>
            <h1 className={styles.title}>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</h1>
            {ordersLoading ? (
              <p>{isBn ? 'অর্ডার লোড হচ্ছে...' : 'Loading orders...'}</p>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <h3>{isBn ? 'কোনো অর্ডার নেই' : 'No Orders Yet'}</h3>
                <p>{isBn ? 'আপনি এখনও কোনো অর্ডার করেননি।' : "You haven't placed any orders yet."}</p>
                <button className={styles.shopBtn} onClick={() => navigate('/shop')}>
                  {isBn ? 'শপিং শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', background: 'var(--color-surface)', borderRadius: '8px', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px', fontWeight: 600 }}>{isBn ? 'অর্ডার নম্বর' : 'Order ID'}</th>
                      <th style={{ padding: '12px', fontWeight: 600 }}>{isBn ? 'তারিখ' : 'Date'}</th>
                      <th style={{ padding: '12px', fontWeight: 600 }}>{isBn ? 'মূল্য' : 'Total'}</th>
                      <th style={{ padding: '12px', fontWeight: 600 }}>{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px' }}>#{order.customId ? order.customId : (order._id ? String(order._id).substring(0, 8).toUpperCase() : 'N/A')}</td>
                        <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.85rem', 
                            fontWeight: 600,
                            background: order.status === 'Delivered' ? 'var(--color-success)' : 'var(--color-background)',
                            color: order.status === 'Delivered' ? '#fff' : 'var(--color-text-primary)'
                          }}>
                            {order.status || (order.isPaid ? (isBn ? 'পরিশোধিত' : 'Paid') : (isBn ? 'প্রক্রিয়াধীন' : 'Pending'))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 className={styles.title}>{isBn ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}</h1>
            <div className={styles.formCard}>
              <form onSubmit={handleProfileUpdate}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isBn ? 'সম্পূর্ণ নাম' : 'Full Name'}</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className={styles.formInput} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                  <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className={styles.formInput} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{isBn ? 'সম্পূর্ণ ঠিকানা' : 'Street Address'}</label>
                  <input type="text" value={profileData.street} onChange={e => setProfileData({...profileData, street: e.target.value})} className={styles.formInput} required />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formCol}>
                    <label className={styles.formLabel}>{isBn ? 'শহর / থানা' : 'City'}</label>
                    <input type="text" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className={styles.formInput} required />
                  </div>
                  <div className={styles.formCol}>
                    <label className={styles.formLabel}>{isBn ? 'জেলা' : 'District'}</label>
                    <select value={profileData.district} onChange={e => setProfileData({...profileData, district: e.target.value})} className={styles.formInput} required>
                      <option value="">{isBn ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                      <option value="Bagerhat">Bagerhat</option><option value="Bandarban">Bandarban</option><option value="Barguna">Barguna</option><option value="Barishal">Barishal</option><option value="Bhola">Bhola</option><option value="Bogura">Bogura</option><option value="Brahmanbaria">Brahmanbaria</option><option value="Chandpur">Chandpur</option><option value="Chattogram">Chattogram</option><option value="Chuadanga">Chuadanga</option><option value="Comilla">Comilla</option><option value="Cox's Bazar">Cox's Bazar</option><option value="Dhaka">Dhaka</option><option value="Dinajpur">Dinajpur</option><option value="Faridpur">Faridpur</option><option value="Feni">Feni</option><option value="Gaibandha">Gaibandha</option><option value="Gazipur">Gazipur</option><option value="Gopalganj">Gopalganj</option><option value="Habiganj">Habiganj</option><option value="Jamalpur">Jamalpur</option><option value="Jashore">Jashore</option><option value="Jhalokati">Jhalokati</option><option value="Jhenaidah">Jhenaidah</option><option value="Joypurhat">Joypurhat</option><option value="Khagrachari">Khagrachari</option><option value="Khulna">Khulna</option><option value="Kishoreganj">Kishoreganj</option><option value="Kurigram">Kurigram</option><option value="Kushtia">Kushtia</option><option value="Lakshmipur">Lakshmipur</option><option value="Lalmonirhat">Lalmonirhat</option><option value="Madaripur">Madaripur</option><option value="Magura">Magura</option><option value="Manikganj">Manikganj</option><option value="Meherpur">Meherpur</option><option value="Moulvibazar">Moulvibazar</option><option value="Munshiganj">Munshiganj</option><option value="Mymensingh">Mymensingh</option><option value="Naogaon">Naogaon</option><option value="Narail">Narail</option><option value="Narayanganj">Narayanganj</option><option value="Narsingdi">Narsingdi</option><option value="Natore">Natore</option><option value="Nawabganj">Nawabganj</option><option value="Netrokona">Netrokona</option><option value="Nilphamari">Nilphamari</option><option value="Noakhali">Noakhali</option><option value="Pabna">Pabna</option><option value="Panchagarh">Panchagarh</option><option value="Patuakhali">Patuakhali</option><option value="Pirojpur">Pirojpur</option><option value="Rajbari">Rajbari</option><option value="Rajshahi">Rajshahi</option><option value="Rangamati">Rangamati</option><option value="Rangpur">Rangpur</option><option value="Satkhira">Satkhira</option><option value="Shariatpur">Shariatpur</option><option value="Sherpur">Sherpur</option><option value="Sirajganj">Sirajganj</option><option value="Sunamganj">Sunamganj</option><option value="Sylhet">Sylhet</option><option value="Tangail">Tangail</option><option value="Thakurgaon">Thakurgaon</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? (isBn ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving...') : (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}
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

