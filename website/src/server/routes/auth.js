import express from 'express';
const router = express.Router();

// ... existing routes ...

router.post('/logout', async (req, res) => {
  try {
    // Clear any server-side session data if you're using sessions
    if (req.session) {
      req.session.destroy();
    }

    // Clear authentication cookies if you're using them
    res.clearCookie('authToken');
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

export default router; 