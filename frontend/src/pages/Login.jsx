import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { signInWithGoogle } from '../config/firebase';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate(redirect);
    } catch (error) {
      console.error("Google Sign In Failed", error);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ textAlign: 'center', padding: '40px' }}>
        <h1 className={styles.title} style={{ marginBottom: '10px' }}>Welcome to GentFits</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>Sign in to access your premium account</p>
        
        <button 
          onClick={handleGoogleLogin} 
          className={styles.submitBtn} 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'white', color: 'black', border: '1px solid var(--color-border)' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px' }} />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
