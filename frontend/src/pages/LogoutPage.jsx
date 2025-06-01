import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate('/login', { replace: true });
  }, []);
  return null;
};

export default LogoutPage;
