module.exports = function requireAdmin(req, res, next) {
  try {
    const role = req.user?.role;
    // Alumni model uses role 'alumni', User model uses 'student'/'admin'
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error checking admin permissions' });
  }
}