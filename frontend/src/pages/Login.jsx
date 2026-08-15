import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { signInWithGoogle } from '../config/firebase';
import styles from './Auth.module.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyOtp, googleLogin, user, isLoading, error, clearError, otpEmail } = useAuthStore();

  const [message, setMessage] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/shop';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    return () => clearError();
  }, [user, navigate, redirect, clearError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    const res = await login(email, password);
    if (res === 'OTP_REQUIRED') {
      setIsOtpMode(true);
      setMessage('An OTP has been sent to your email.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (otp.length !== 6) {
      setMessage('OTP must be 6 digits');
      return;
    }
    const res = await verifyOtp(otpEmail || email, otp);
    if (res) {
      navigate(redirect);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const gUser = await signInWithGoogle();
      if (gUser && gUser.email) {
        await googleLogin(gUser.displayName || 'Google User', gUser.email);
      }
    } catch (error) {
      console.error("Google Sign In Failed", error);
      setMessage("Google Sign In Failed. Please try again.");
    }
  };

  if (isOtpMode) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ textAlign: 'center' }}>
          <h1 className={styles.title}>2-Step Verification</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>Enter the 6-digit OTP sent to your email to continue.</p>
          
          {(error || message) && <div className={styles.error}>{error || message}</div>}
          
          <form onSubmit={handleOtpSubmit}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                required
                className={styles.input} 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }}
                maxLength={6}
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Welcome to Gents Clothes</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>Sign in to access your premium account</p>
        
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
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <Link to="/forgot-password" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </label>
            <div className={styles.passwordWrapper} style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className={styles.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button type="button" onClick={togglePasswordVisibility} className={styles.passwordToggle} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

        <p className={styles.linkText} style={{ marginTop: '20px' }}>
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
