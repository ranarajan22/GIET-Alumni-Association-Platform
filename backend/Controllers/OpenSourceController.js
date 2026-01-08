const OpenSource = require('../Models/OpenSource');
const Alumni = require('../Models/alumni');

// Add a new open source project
const addOpenSourceProject = async (req, res) => {
  try {
    const { name, description, languages, repoLink, stars, contributors } = req.body;
    const alumniId = req.user._id; // From protectRoute middleware

    // Validate required fields
    if (!name || !description || !repoLink) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and repository link are required'
      });
    }

    // Check if alumni exists
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni profile not found'
      });
    }

    // Check if project already exists for this alumni
    const existingProject = await OpenSource.findOne({ alumniId, repoLink });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'You have already added this repository'
      });
    }

    // Create new open source project
    const newProject = new OpenSource({
      alumniId,
      name,
      description,
      languages: languages || [],
      repoLink,
      stars: stars || 0,
      contributors: contributors || 1
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Open source project added successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Error adding open source project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add open source project',
      error: error.message
    });
  }
};

// Get all open source projects
const getAllOpenSourceProjects = async (req, res) => {
  try {
    const projects = await OpenSource.find()
      .populate('alumniId', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching open source projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch open source projects',
      error: error.message
    });
  }
};

// Get open source projects by a specific alumni
const getAlumniOpenSourceProjects = async (req, res) => {
  try {
    const { alumniId } = req.params;

    const projects = await OpenSource.find({ alumniId })
      .populate('alumniId', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching alumni projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni projects',
      error: error.message
    });
  }
};

// Get current logged-in alumni's projects
const getMyOpenSourceProjects = async (req, res) => {
  try {
    const alumniId = req.user.id; // From protectRoute middleware

    const projects = await OpenSource.find({ alumniId })
      .populate('alumniId', 'fullName profilePhoto')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error fetching my projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your projects',
      error: error.message
    });
  }
};

// Update an open source project
const updateOpenSourceProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, languages, repoLink, stars, contributors } = req.body;
    const alumniId = req.user.id;

    // Find project and verify ownership
    const project = await OpenSource.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.alumniId.toString() !== alumniId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this project'
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (languages) project.languages = languages;
    if (repoLink) project.repoLink = repoLink;
    if (stars !== undefined) project.stars = stars;
    if (contributors !== undefined) project.contributors = contributors;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating open source project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete an open source project
const deleteOpenSourceProject = async (req, res) => {
  try {
    const { id } = req.params;
    const alumniId = req.user.id;

    const project = await OpenSource.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.alumniId.toString() !== alumniId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this project'
      });
    }

    await OpenSource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting open source project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

module.exports = {
  addOpenSourceProject,
  getAllOpenSourceProjects,
  getAlumniOpenSourceProjects,
  getMyOpenSourceProjects,
  updateOpenSourceProject,
  deleteOpenSourceProject
};
