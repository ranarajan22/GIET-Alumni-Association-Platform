const Maintenance = require('../Models/maintenance');

// Get maintenance status
const getMaintenanceStatus = async (req, res) => {
  try {
    let maintenance = await Maintenance.findOne();
    
    // If no document exists, create one with default values
    if (!maintenance) {
      maintenance = new Maintenance({
        isActive: false,
        message: 'System is under maintenance. Please try again later.',
        estimatedTime: 'Unknown',
        lastUpdatedBy: 'System'
      });
      await maintenance.save();
    }
    
    res.status(200).json(maintenance);
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance status' });
  }
};

// Update maintenance status (admin only)
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { isActive, message, estimatedTime } = req.body;
    const adminEmail = req.user?.email || 'Unknown Admin';

    let maintenance = await Maintenance.findOne();

    if (!maintenance) {
      maintenance = new Maintenance({
        isActive: isActive || false,
        message: message || 'System is under maintenance. Please try again later.',
        estimatedTime: estimatedTime || 'Unknown',
        lastUpdatedBy: adminEmail
      });
    } else {
      maintenance.isActive = isActive !== undefined ? isActive : maintenance.isActive;
      maintenance.message = message || maintenance.message;
      maintenance.estimatedTime = estimatedTime || maintenance.estimatedTime;
      maintenance.lastUpdatedBy = adminEmail;
      maintenance.updatedAt = new Date();
    }

    await maintenance.save();

    console.log(`Maintenance mode ${isActive ? 'ENABLED' : 'DISABLED'} by ${adminEmail}`);

    res.status(200).json({
      message: `Maintenance mode ${isActive ? 'enabled' : 'disabled'} successfully`,
      maintenance
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    res.status(500).json({ error: 'Failed to update maintenance status' });
  }
};

// Check maintenance status (public route - no auth needed)
const checkMaintenanceStatus = async (req, res) => {
  try {
    let maintenance = await Maintenance.findOne();

    if (!maintenance) {
      return res.status(200).json({
        isActive: false,
        message: 'System is operational'
      });
    }

    res.status(200).json({
      isActive: maintenance.isActive,
      message: maintenance.message,
      estimatedTime: maintenance.estimatedTime
    });
  } catch (error) {
    console.error('Error checking maintenance status:', error);
    res.status(200).json({
      isActive: false,
      message: 'System is operational'
    });
  }
};

module.exports = {
  getMaintenanceStatus,
  updateMaintenanceStatus,
  checkMaintenanceStatus
};
