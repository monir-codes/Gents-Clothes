import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuthStore from '../store/useAuthStore';

const AdminSecurityWrapper = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSecurity = async () => {
      const isAuth = sessionStorage.getItem('adminAuthorized');
      const { user, token } = useAuthStore.getState();
      
      if (!user || !user.isAdmin || !token) {
        await Swal.fire({
          title: 'Not Logged In',
          text: 'You must log in with an Admin account (mdrummanmondal2@gmail.com or info.gentsclothes@gmail.com) first to access this API data.',
          icon: 'error',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#d33',
        });
        navigate('/login');
        setIsChecking(false);
        return;
      }

      if (isAuth === 'true') {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      const { value: password, isDismissed } = await Swal.fire({
        title: 'RESTRICTED AREA',
        text: 'who is here?',
        input: 'password',
        inputPlaceholder: 'Enter your identity',
        icon: 'warning',
        background: '#1a1a1a',
        color: '#ffffff',
        confirmButtonColor: '#c9a265',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        confirmButtonText: 'Access Vault',
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
          popup: 'luxury-alert',
          title: 'luxury-alert-title',
          input: 'luxury-alert-input'
        }
      });

      if (isDismissed || !password) {
        navigate('/');
        return;
      }

      if (password === 'Mondal King') {
        Swal.fire({
          title: 'Access Granted',
          text: 'Welcome to the Chamber.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#c9a265',
          timer: 1500,
          showConfirmButton: false
        });
        sessionStorage.setItem('adminAuthorized', 'true');
        setIsAuthorized(true);
      } else {
        await Swal.fire({
          title: 'Access Denied',
          text: 'Intruder detected. Connection terminated.',
          icon: 'error',
          background: '#1a1a1a',
          color: '#ffffff',
          confirmButtonColor: '#d33',
        });
        navigate('/');
      }
      setIsChecking(false);
    };

    checkSecurity();
  }, [navigate]);

  if (isChecking) {
    return <div style={{ height: '100vh', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2 style={{color: 'var(--color-accent)'}}>Authenticating...</h2></div>;
  }

  return isAuthorized ? children : null;
};

export default AdminSecurityWrapper;
