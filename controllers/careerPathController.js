import CareerPath from '../models/CareerPath.js';

// @desc    Get all career paths
// @route   GET /api/career-paths
// @access  Public
export const getCareerPaths = async (req, res, next) => {
  try {
    const careerPaths = await CareerPath.find({}).sort({ createdAt: 1 });
    res.json({
      success: true,
      count: careerPaths.length,
      data: careerPaths,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get career path by ID or slug
// @route   GET /api/career-paths/:id
// @access  Public
export const getCareerPathById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Look up by id field or Mongo _id
    let careerPath = await CareerPath.findOne({ id });
    if (!careerPath && id.match(/^[0-9a-fA-F]{24}$/)) {
      careerPath = await CareerPath.findById(id);
    }

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: `Career path with ID '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new career path
// @route   POST /api/career-paths
// @access  Private
export const createCareerPath = async (req, res, next) => {
  try {
    const { id, name, tagline, color, icon, stations } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Career path id and name are required',
      });
    }

    const existing = await CareerPath.findOne({ id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Career path with id '${id}' already exists`,
      });
    }

    const careerPath = await CareerPath.create({
      id,
      name,
      tagline,
      color,
      icon,
      stations: stations || [],
    });

    res.status(201).json({
      success: true,
      data: careerPath,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a career path
// @route   PUT /api/career-paths/:id
// @access  Private
export const updateCareerPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    let careerPath = await CareerPath.findOne({ id });
    if (!careerPath && id.match(/^[0-9a-fA-F]{24}$/)) {
      careerPath = await CareerPath.findById(id);
    }

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: `Career path with ID '${id}' not found`,
      });
    }

    const updated = await CareerPath.findByIdAndUpdate(careerPath._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a career path
// @route   DELETE /api/career-paths/:id
// @access  Private
export const deleteCareerPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    let careerPath = await CareerPath.findOne({ id });
    if (!careerPath && id.match(/^[0-9a-fA-F]{24}$/)) {
      careerPath = await CareerPath.findById(id);
    }

    if (!careerPath) {
      return res.status(404).json({
        success: false,
        message: `Career path with ID '${id}' not found`,
      });
    }

    await CareerPath.findByIdAndDelete(careerPath._id);

    res.json({
      success: true,
      message: `Career path '${id}' removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};
