import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Auth.module.css';

const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com'];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user, isLoading, error, clearError } = useAuthStore();

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    return () => clearError();
  }, [user, navigate, redirect, clearError]);

  // Redirect after successful registration
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        const fallback = '/shop';
        navigate(redirect || fallback);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, navigate, redirect]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return false;
    }
    const emailDomain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(emailDomain)) {
      setMessage('Only Gmail, Outlook, or Yahoo emails are allowed');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;
    
    const res = await register(name, email, password);
    if (res && res.message) {
      setSuccessMsg(res.message);
    }
  };

  if (successMsg) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ textAlign: 'center' }}>
          <h1 className={styles.title}>Account Created!</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>{successMsg}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Create Account</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>Join Gents Clothes for a premium experience</p>

        {(error || message) && <div className={styles.error}>{error || message}</div>}
        
        <form onSubmit={submitHandler}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              required
              className={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@gmail.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper} style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className={styles.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <button type="button" onClick={togglePasswordVisibility} className={styles.passwordToggle} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper} style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className={styles.input} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
              <button type="button" onClick={togglePasswordVisibility} className={styles.passwordToggle} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.linkText} style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
