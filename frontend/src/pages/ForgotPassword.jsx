import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    clearError();
    
    const res = await forgotPassword(email);
    if (res) {
      navigate('/reset-password');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Forgot Password</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        {(error || message) && <div className={styles.error}>{error || message}</div>}
        
        <form onSubmit={submitHandler}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
          </button>
        </form>

        <p className={styles.linkText} style={{ marginTop: '20px' }}>
          Remembered your password?{' '}
          <Link to="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
