import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Sparkles, Settings } from 'lucide-react';
import styles from './Admin.module.css';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Admin Panel</div>
        <nav className={styles.nav}>
          <Link to="/admin" className={`${styles.navItem} ${location.pathname === '/admin' ? styles.active : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className={`${styles.navItem} ${location.pathname.includes('/products') ? styles.active : ''}`}>
            <Package size={20} /> Products
          </Link>
          <Link to="/admin/orders" className={`${styles.navItem} ${location.pathname.includes('/orders') ? styles.active : ''}`}>
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link to="/admin/customers" className={`${styles.navItem} ${location.pathname.includes('/customers') ? styles.active : ''}`}>
            <Users size={20} /> Customers
          </Link>
          <Link to="/admin/marketing" className={`${styles.navItem} ${location.pathname.includes('/marketing') ? styles.active : ''}`}>
            <Sparkles size={20} /> Marketing & AI
          </Link>
          <Link to="/admin/settings" className={`${styles.navItem} ${location.pathname.includes('/settings') ? styles.active : ''}`}>
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
