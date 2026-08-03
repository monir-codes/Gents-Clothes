import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import styles from './Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading, error, clearError } = useAuthStore();

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    return () => clearError();
  }, [user, navigate, redirect, clearError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Sign In</h1>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={submitHandler}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              required
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.linkText}>
          New to GentFits?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className={styles.link}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
