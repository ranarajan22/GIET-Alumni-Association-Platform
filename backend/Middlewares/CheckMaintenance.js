const Maintenance = require('../Models/maintenance');

// Middleware to check if maintenance mode is active
const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Always allow OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Always allow maintenance check endpoint
    if (req.path === '/api/maintenance/check') {
      return next();
    }

    const maintenance = await Maintenance.findOne();

    // If no maintenance record exists or maintenance is not active, continue
    if (!maintenance || !maintenance.isActive) {
      return next();
    }

    // If maintenance is active, block access (except for admins)
    // Check if user is admin
    const isAdmin = req.user?.role === 'admin';
    
    if (isAdmin) {
      // Allow admins to access even during maintenance
      return next();
    }

    // Block non-admin users during maintenance
    return res.status(503).json({
      success: false,
      message: maintenance.message,
      estimatedTime: maintenance.estimatedTime,
      maintenanceMode: true
    });
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    // If there's an error, continue (don't block access)
    next();
  }
};

module.exports = checkMaintenanceMode;
