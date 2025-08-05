import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/localCartService';

const ProtectedRoute = ({ children, redirectTo = '/customer/dashboard' }) => {
  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check authentication only once
    const checkAuth = () => {
      if (isAuthenticated()) {
        navigate(redirectTo, { replace: true });
        return;
      }
      
      setShouldRender(true);
    };

    checkAuth();
  }, []); // Empty dependency array - run only once

  // Don't render anything until auth is checked
  if (!shouldRender) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 