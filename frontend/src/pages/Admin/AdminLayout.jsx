import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Sparkles, Settings, Menu, X, ExternalLink, LogOut } from 'lucide-react';
import styles from './Admin.module.css';
import useAuthStore from '../../store/useAuthStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Prevent background scrolling when mobile sidebar drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileBrand}>
          <span>রঙবতী</span> <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'var(--color-accent)', color: '#fff', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin</span>
        </div>
        <button 
          className={styles.hamburgerBtn} 
          onClick={toggleSidebar} 
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      <div 
        className={`${styles.backdrop} ${isSidebarOpen ? styles.backdropOpen : ''}`} 
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <aside 
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        aria-label="Admin Navigation Sidebar"
      >
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarBrand}>
              <span>রঙবতী</span>
              <span className={styles.adminTag}>Admin Panel</span>
            </div>
            <button 
              className={styles.sidebarCloseBtn} 
              onClick={closeSidebar} 
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <nav className={styles.nav}>
            <Link to="/boss" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname === '/boss' ? styles.active : ''}`}>
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </Link>
            <Link to="/boss/products" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/products') ? styles.active : ''}`}>
              <Package size={19} />
              <span>Products Database</span>
            </Link>
            <Link to="/boss/reviews" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/reviews') ? styles.active : ''}`}>
              <Sparkles size={19} />
              <span>Reviews</span>
            </Link>
            <Link to="/boss/orders" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/orders') ? styles.active : ''}`}>
              <ShoppingCart size={19} />
              <span>Orders Management</span>
            </Link>
            <Link to="/boss/customers" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/customers') ? styles.active : ''}`}>
              <Users size={19} />
              <span>User Management</span>
            </Link>
            <Link to="/boss/marketing" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/marketing') ? styles.active : ''}`}>
              <Sparkles size={19} />
              <span>Marketing & AI</span>
            </Link>
            <Link to="/boss/settings" onClick={closeSidebar} className={`${styles.navItem} ${location.pathname.includes('/settings') ? styles.active : ''}`}>
              <Settings size={19} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer with Storefront link and Logout */}
        <div className={styles.sidebarFooter}>
          <Link to="/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            <ExternalLink size={16} />
            <span>View Live Store</span>
          </Link>
          {user && (
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name || 'Admin'}</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
