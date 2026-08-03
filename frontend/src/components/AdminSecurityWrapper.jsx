import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSecurityWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const chamberKey = sessionStorage.getItem('adminChamberKey');
    
    if (chamberKey === 'Mondal King') {
      setIsAuthenticated(true);
    } else {
      const answer = window.prompt("The Chamber: Who is here?");
      if (answer === 'Mondal King') {
        sessionStorage.setItem('adminChamberKey', 'Mondal King');
        setIsAuthenticated(true);
      } else {
        alert("Access Denied.");
        navigate('/');
      }
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <div style={{ height: '100vh', background: 'black', color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ACCESS DENIED</div>;
  }

  return <>{children}</>;
};

export default AdminSecurityWrapper;
