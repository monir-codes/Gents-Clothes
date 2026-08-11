import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AdminSecurityWrapper = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--color-accent)' }}>Authenticating...</h2>
      </div>
    );
  }

  // Define authorized emails here
  const authorizedEmails = [
    'mdrummanmondal2@gmail.com',
    // We will add the user's Google email here once they provide it
  ];

  const isAuthorized = user && (user.isAdmin || authorizedEmails.includes(user.email));

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminSecurityWrapper;
