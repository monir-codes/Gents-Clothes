import React from 'react';
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

export const AdminSettings = () => (
  <div>
    <div className={styles.dashboardHeader}>
      <h1 className={styles.dashboardTitle}>Store Settings</h1>
    </div>
    <p>Theme configuration, Payment Gateway APIs, and Shipping Rates configuration will be here.</p>
  </div>
);

export default AdminOrders;
