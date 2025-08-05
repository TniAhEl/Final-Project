import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, isCustomer, getUserRole } from '../services/localCartService';

const CustomerProtectedRoute = ({ children, redirectTo = '/signin' }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication and role only once
    const checkAuthorization = () => {
      
      if (!isAuthenticated()) {
        navigate(redirectTo, { replace: true });
        return;
      }
      
      if (!isCustomer()) {
        navigate('/admin/dashboard', { replace: true });
        return;
      }
      
      setIsAuthorized(true);
    };

    checkAuthorization();
  }, []); // Empty dependency array - run only once

  // Don't render anything until authorization is checked
  if (!isAuthorized) {
    return null;
  }

  return children;
};

export default CustomerProtectedRoute; 