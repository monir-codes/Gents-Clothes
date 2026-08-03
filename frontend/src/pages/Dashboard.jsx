import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import styles from './Dashboard.module.css';
import { LogOut, Package, MapPin, Heart, User, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
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
          <button className={`${styles.navItem} ${styles.active}`}><Package size={18}/> My Orders</button>
          <button className={styles.navItem}><Heart size={18}/> Wishlist</button>
          <button className={styles.navItem}><MapPin size={18}/> Saved Addresses</button>
          <button className={styles.navItem}><Bell size={18}/> Notifications</button>
          <button className={styles.navItem}><User size={18}/> Profile Settings</button>
          <button className={styles.navItem} onClick={handleLogout} style={{ color: 'var(--color-error)' }}><LogOut size={18}/> Logout</button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <h1 className={styles.title}>My Orders</h1>
        
        <div className={styles.emptyState}>
          <Package size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet.</p>
          <button className={styles.shopBtn} onClick={() => navigate('/shop')}>Start Shopping</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
