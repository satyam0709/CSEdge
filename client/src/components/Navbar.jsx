import { useUser } from '@clerk/clerk-react';
import StudentNavbar from './student/Navbar';

export default function Navbar() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return <StudentNavbar />;
}
