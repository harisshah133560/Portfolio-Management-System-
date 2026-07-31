const Project = require('../models/Project');

// @desc    Get public projects for portfolio visitors
// @route   GET /api/projects/public
exports.getPublicProjects = async (req, res) => {
  try {
    let projects = await Project.find({ featured: true }).sort({ createdAt: -1 }).limit(6).lean();

    if (!projects.length) {
      projects = await Project.find({}).sort({ createdAt: -1 }).limit(6).lean();
    }

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching public projects' });
  }
};

// @desc    Get all projects for logged-in user (with filters, search, sort, pagination)
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const {
      search = '',
      category = '',
      status = '',
      sort = 'newest',
      page = '1',
      limit = '6',
    } = req.query;

    // Build query
    const query = { user: userId };

    // Search filter (text search on title, description, technologies)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Sort
    let sortObj = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'updated':
        sortObj = { updatedAt: -1 };
        break;
      case 'alpha-asc':
        sortObj = { title: 1 };
        break;
      case 'alpha-desc':
        sortObj = { title: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Project.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching project',
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description, technologies, category, status, githubUrl, liveUrl, featured } = req.body;

    // Handle uploaded image
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const project = await Project.create({
      title,
      description,
      technologies: technologies || [],
      category,
      status: status || 'planned',
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      imageUrl,
      featured: featured || false,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating project',
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const updateData = { ...req.body };

    // Handle uploaded image
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Remove imageUrl from body if no file and no explicit imageUrl
    if (!req.file && !req.body.imageUrl) {
      delete updateData.imageUrl;
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating project',
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting project',
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/projects/stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, statusStats, categoryStats, techStats, recentProjects] =
      await Promise.all([
        Project.countDocuments({ user: userId }),
        Project.aggregate([
          { $match: { user: userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Project.aggregate([
          { $match: { user: userId } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
        ]),
        Project.aggregate([
          { $match: { user: userId } },
          { $unwind: '$technologies' },
          { $group: { _id: '$technologies', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ]),
        Project.find({ user: userId })
          .sort({ updatedAt: -1 })
          .limit(5)
          .lean(),
      ]);

    // Format status stats
    const statusMap = {};
    statusStats.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    // Format category stats
    const categoryMap = {};
    categoryStats.forEach((c) => {
      categoryMap[c._id] = c.count;
    });

    res.json({
      success: true,
      data: {
        total,
        completed: statusMap['completed'] || 0,
        inProgress: statusMap['in-progress'] || 0,
        planned: statusMap['planned'] || 0,
        byStatus: statusMap,
        byCategory: categoryMap,
        topTechnologies: techStats,
        recentProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
    });
  }
};

// @desc    Delete all user projects
// @route   DELETE /api/projects/all
exports.deleteAllProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({ user: req.user._id });
    res.json({
      success: true,
      message: `${result.deletedCount} projects deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting projects',
    });
  }
};