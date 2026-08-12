import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';
import styles from './Admin.module.css';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = useAuthStore.getState().token;
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await axios.get('/api/stats', config);
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    fetchStats();
    
    // Polling every 10 seconds for real-time updates
    const intervalId = setInterval(fetchStats, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard Overview</h1>
        <button style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px' }}>Download Report</button>
      </div>

      <div style={{ background: 'rgba(201, 162, 101, 0.1)', border: '1px solid var(--color-accent)', padding: '16px', borderRadius: '8px', marginBottom: '24px', color: 'var(--color-text-primary)' }}>
        <strong>System Status:</strong> Admin Panel is connected to the live MongoDB database. Revenue, Orders, and Customers are now streaming in real-time.
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Revenue</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign color="var(--color-accent)" />
            <span className={styles.statValue}>৳{stats.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Orders</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package color="var(--color-accent)" />
            <span className={styles.statValue}>{stats.totalOrders}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Registered Customers</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users color="var(--color-accent)" />
            <span className={styles.statValue}>{stats.totalCustomers}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Conversion Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp color="var(--color-accent)" />
            <span className={styles.statValue}>{stats.conversionRate}%</span>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px' }}>Recent Orders</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>৳{order.totalPrice}</td>
                <td>
                  <span style={{ 
                    color: order.isDelivered ? 'var(--color-success)' : 'orange', 
                    fontWeight: 600 
                  }}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No recent orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
