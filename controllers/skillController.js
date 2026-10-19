import Skill from '../models/Skill.js';
import Progress from '../models/Progress.js';

// @desc    Get all skills, optionally filtered by trackId
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const { trackId, status, category } = req.query;
    const filter = {};
    if (trackId) filter.trackId = trackId;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const skills = await Skill.find(filter).sort({ trackId: 1, createdAt: 1 });
    res.json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    const { name, trackId, stationTitle, description, category, status } = req.body;
    if (!name || !trackId) {
      return res.status(400).json({ success: false, message: 'Skill name and trackId are required' });
    }

    const skill = await Skill.create({
      name,
      trackId,
      stationTitle: stationTitle || '',
      description: description || '',
      category: category || 'General',
      status: status || 'Not Started',
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's skill status: 'Not Started' | 'In Progress' | 'Completed'
// @route   PUT /api/skills/:id/status
// @access  Private
export const updateSkillStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Not Started', 'In Progress', 'Completed'
    if (!['Not Started', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Not Started', 'In Progress', or 'Completed'",
      });
    }

    const skill = await Skill.findById(req.params.id);
    const skillName = skill ? skill.name : req.params.id;

    // Update user's progress record in MongoDB
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    if (status === 'Completed') {
      if (!progress.completedSkills.includes(skillName)) {
        progress.completedSkills.push(skillName);
      }
    } else {
      progress.completedSkills = progress.completedSkills.filter((s) => s !== skillName);
    }

    progress.recalculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      message: `Skill '${skillName}' marked as ${status}`,
      status,
      completedSkills: progress.completedSkills,
      overallProgress: progress.overallProgress,
    });
  } catch (error) {
    next(error);
  }
};
