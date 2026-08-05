import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { signInWithGoogle } from '../config/firebase';
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

  const handleGoogleLogin = async () => {
    try {
      // NOTE: This currently only triggers Firebase popup, we need backend integration to fully sync Google users.
      // Assuming for now it works as a placeholder or it needs to be completed.
      // await signInWithGoogle();
      // navigate(redirect);
      alert("Google Login is currently disabled. Please use Email/Password.");
    } catch (error) {
      console.error("Google Sign In Failed", error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome to GentFits</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>Sign in to access your premium account</p>
        
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          <span style={{ padding: '0 10px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
        </div>
        
        <button 
          onClick={handleGoogleLogin} 
          className={styles.submitBtn} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'white', color: 'black', border: '1px solid var(--color-border)' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px' }} />
          Continue with Google
        </button>

        <p className={styles.linkText}>
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className={styles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
