import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import styles from './Auth.module.css';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError, otpEmail } = useAuthStore();

  useEffect(() => {
    if (!otpEmail) {
      navigate('/forgot-password');
    }
  }, [otpEmail, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    clearError();
    
    if (otp.length !== 6) {
      setMessage('OTP must be 6 digits');
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    const res = await resetPassword(otpEmail, otp, password);
    if (res && res.message) {
      setSuccessMsg(res.message);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  if (successMsg) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard} style={{ textAlign: 'center' }}>
          <h1 className={styles.title}>Password Reset</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>{successMsg}</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Reset Password</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>
          Enter the 6-digit OTP sent to your email and your new password.
        </p>
        
        {(error || message) && <div className={styles.error}>{error || message}</div>}
        
        <form onSubmit={submitHandler}>
          <div className={styles.formGroup}>
            <label className={styles.label}>6-Digit OTP</label>
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
          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
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
            <label className={styles.label}>Confirm New Password</label>
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
