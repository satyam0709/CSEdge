import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './student/Navbar';

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  if (!user && window.location.pathname !== '/login') {
    navigate('/login');
  }

  return <StudentNavbar />;
}
