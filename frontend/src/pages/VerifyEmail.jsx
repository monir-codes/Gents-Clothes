import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './Auth.module.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`/api/users/verify/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <div>
            <h1 className={styles.title}>Verifying Email...</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle size={60} color="var(--color-success)" style={{ margin: '0 auto 20px' }} />
            <h1 className={styles.title}>Verified!</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>{message}</p>
            <Link to="/login" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Proceed to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle size={60} color="var(--color-error)" style={{ margin: '0 auto 20px' }} />
            <h1 className={styles.title}>Verification Failed</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>{message}</p>
            <Link to="/register" className={styles.submitBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Back to Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
