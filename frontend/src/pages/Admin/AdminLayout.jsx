import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Sparkles, Settings, Menu, X } from 'lucide-react';
import styles from './Admin.module.css';

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.brand}>Admin Panel</div>
        <button className={styles.hamburgerBtn} onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarBrand}>Admin Panel</div>
        <nav className={styles.nav}>
          <Link to="/admin" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname === '/admin' ? styles.active : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/products') ? styles.active : ''}`}>
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/reviews" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/reviews') ? styles.active : ''}`}>
            <Sparkles size={20} /> Reviews
          </Link>
          <Link to="/admin/orders" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/orders') ? styles.active : ''}`}>
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link to="/admin/customers" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/customers') ? styles.active : ''}`}>
            <Users size={20} /> Customers
          </Link>
          <Link to="/admin/marketing" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/marketing') ? styles.active : ''}`}>
            <Sparkles size={20} /> Marketing & AI
          </Link>
          <Link to="/admin/settings" onClick={() => setSidebarOpen(false)} className={`${styles.navItem} ${location.pathname.includes('/settings') ? styles.active : ''}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
