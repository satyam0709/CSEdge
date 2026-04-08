import { useAuth } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import LectureChatAssistant from './LectureChatAssistant.jsx';

function labelForPath(pathname) {
  if (pathname.startsWith('/practice/aptitude')) return 'Practice · Aptitude & logic';
  if (pathname.startsWith('/practice/dsa')) return 'Practice · DSA & coding';
  if (pathname.startsWith('/practice/dev')) return 'Practice · Full stack dev';
  if (pathname.startsWith('/practice/companies')) return 'Practice · Company interviews';
  if (pathname.startsWith('/company/')) return 'Company interview prep';
  if (pathname.startsWith('/dashboard')) return 'Student dashboard';
  if (pathname.startsWith('/course-list') || pathname.startsWith('/courses')) return 'Course catalog';
  if (pathname.startsWith('/course/')) return 'Course details';
  if (pathname.startsWith('/my-enrollments')) return 'My enrollments';
  if (pathname.startsWith('/loading/')) return 'Checkout / redirect';
  if (pathname.startsWith('/contests')) return 'Contests';
  if (pathname.startsWith('/study-share')) return 'Community study notes';
  if (pathname.startsWith('/educator')) return 'Educator dashboard';
  if (pathname === '/' || pathname === '/home') return 'Home';
  return 'CSEdge';
}

/**
 * Same AI assistant as the lecture player, on every signed-in page except the video player
 * (Player mounts its own LectureChatAssistant to avoid two buttons).
 */
export default function GlobalChatAssistant() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { pathname } = useLocation();

  if (!isLoaded || !isSignedIn || typeof getToken !== 'function') return null;
  if (pathname.startsWith('/player/')) return null;
  if (pathname.startsWith('/login')) return null;
  if (pathname.startsWith('/sign-up')) return null;

  return (
    <LectureChatAssistant
      getToken={getToken}
      pagePath={pathname}
      pageTitle={labelForPath(pathname)}
      variant="global"
    />
  );
}
