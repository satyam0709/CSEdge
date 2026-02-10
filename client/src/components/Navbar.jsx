import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import StudentNavbar from './student/Navbar';

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // If not loaded, don't show navbar
  if (!isLoaded) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user && window.location.pathname !== '/login') {
    // On protected routes, user should be redirected by auth middleware
  }

  return <StudentNavbar />;
}
