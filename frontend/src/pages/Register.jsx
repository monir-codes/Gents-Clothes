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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { register, verifyOtp, user, isLoading, error, clearError, otpEmail } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    return () => clearError();
  }, [user, navigate, redirect, clearError]);

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
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setMessage('Please enter a valid 11-digit Bangladeshi phone number (e.g. 01712345678)');
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;
    
    const res = await register(name, email, password, phone);
    if (res === 'OTP_REQUIRED') {
      setIsOtpMode(true);
      setSuccessMsg('An OTP has been sent to your email.');
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
      setSuccessMsg('Registration successful!');
      setTimeout(() => navigate(redirect), 2000);
    }
  };

  if (isOtpMode) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ textAlign: 'center' }}>
          <h1 className={styles.title}>Verify Email</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>{successMsg || 'Enter the 6-digit OTP sent to your email.'}</p>
          
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
            <label className={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              required
              className={styles.input} 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              maxLength={11}
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
