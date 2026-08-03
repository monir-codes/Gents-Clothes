import React from 'react';
import styles from './Admin.module.css';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard Overview</h1>
        <button style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px' }}>Download Report</button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Revenue</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign color="var(--color-accent)" />
            <span className={styles.statValue}>৳42,500</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Orders</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package color="var(--color-accent)" />
            <span className={styles.statValue}>156</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Active Customers</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users color="var(--color-accent)" />
            <span className={styles.statValue}>89</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Conversion Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--color-accent)" />
            <span className={styles.statValue}>3.2%</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Recent Orders</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-001</td>
              <td>Rumman Amin</td>
              <td>2026-08-04</td>
              <td>৳3,500</td>
              <td><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Delivered</span></td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>Guest User</td>
              <td>2026-08-03</td>
              <td>৳1,200</td>
              <td><span style={{ color: 'orange', fontWeight: 600 }}>Processing</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
