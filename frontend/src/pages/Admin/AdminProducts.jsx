import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { Plus } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Products</h1>
        <button style={{ padding: '10px 20px', background: 'var(--color-text-primary)', color: 'white', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>৳{product.price}</td>
                <td>
                  <span style={{ color: product.countInStock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                    {product.countInStock > 0 ? product.countInStock : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button style={{ marginRight: '8px', padding: '4px 8px' }}>Edit</button>
                  <button style={{ color: 'var(--color-error)', padding: '4px 8px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
