import { clerkClient } from '@clerk/express';

const protectAdmin = async (req, res, next) => {
  try {
    const userId = req.auth().userId;
    const response = await clerkClient.users.getUser(userId);
    const role = response?.publicMetadata?.role;

    // Allow educators and admins as "admin" roles for managing resources
    if (role !== 'admin' && role !== 'educator') {
      return res.status(403).json({ success: false, message: 'Unauthorized Access' });
    }

    next();
  } catch (error) {
    console.error('protectAdmin error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default protectAdmin;
