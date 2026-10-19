import Internship from '../models/Internship.js';

// @desc    Get all internships (filterable by trackId, level, search)
// @route   GET /api/internships
// @access  Public
export const getInternships = async (req, res, next) => {
  try {
    const { trackId, level, search } = req.query;
    const filter = {};

    if (trackId && trackId !== 'all') {
      filter.trackId = trackId;
    }
    if (level && level !== 'all') {
      filter.level = level;
    }
    if (search) {
      filter.$or = [
        { role: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { skills: new RegExp(search, 'i') },
      ];
    }

    const internships = await Internship.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship listing
// @route   POST /api/internships
// @access  Private
export const createInternship = async (req, res, next) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an internship listing
// @route   PUT /api/internships/:id
// @access  Private
export const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an internship listing
// @route   DELETE /api/internships/:id
// @access  Private
export const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({
      success: true,
      message: 'Internship removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
