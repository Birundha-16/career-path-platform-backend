import Roadmap from '../models/Roadmap.js';
import CareerPath from '../models/CareerPath.js';
import Progress from '../models/Progress.js';

// @desc    Get all roadmaps
// @route   GET /api/roadmaps
// @access  Public
export const getRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find({});
    res.json({
      success: true,
      count: roadmaps.length,
      data: roadmaps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get roadmap by trackId
// @route   GET /api/roadmaps/:trackId
// @access  Public
export const getRoadmapByTrackId = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    let roadmap = await Roadmap.findOne({ trackId });

    // Fallback: If not found in roadmaps collection, build dynamically from CareerPath
    if (!roadmap) {
      const careerPath = await CareerPath.findOne({ id: trackId });
      if (careerPath) {
        roadmap = {
          trackId: careerPath.id,
          name: careerPath.name,
          description: careerPath.tagline,
          stations: careerPath.stations.map((s, idx) => ({
            id: `station-${idx + 1}`,
            title: s.title,
            subtitle: s.subtitle,
            order: idx + 1,
            tasks: s.skills.map((sk, sidx) => ({
              id: `task-${idx + 1}-${sidx + 1}`,
              title: sk,
              description: `Master ${sk}`,
              skills: [sk],
              status: 'Not Started',
            })),
          })),
        };
      }
    }

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: `Roadmap for track '${trackId}' not found`,
      });
    }

    res.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a roadmap
// @route   POST /api/roadmaps
// @access  Private
export const createOrUpdateRoadmap = async (req, res, next) => {
  try {
    const { trackId, name, description, stations } = req.body;
    if (!trackId || !name) {
      return res.status(400).json({ success: false, message: 'trackId and name are required' });
    }

    let roadmap = await Roadmap.findOne({ trackId });
    if (roadmap) {
      roadmap.name = name;
      roadmap.description = description || roadmap.description;
      roadmap.stations = stations || roadmap.stations;
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        trackId,
        name,
        description: description || '',
        stations: stations || [],
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update roadmap task status / mark completed
// @route   PUT /api/roadmaps/:trackId/tasks/:taskId
// @access  Private
export const updateRoadmapTask = async (req, res, next) => {
  try {
    const { trackId, taskId } = req.params;
    const { status } = req.body; // 'Not Started', 'In Progress', 'Completed'

    if (!['Not Started', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Not Started', 'In Progress', or 'Completed'",
      });
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    const taskKey = `${trackId}::${taskId}`;

    if (status === 'Completed') {
      if (!progress.completedRoadmapTasks.includes(taskKey)) {
        progress.completedRoadmapTasks.push(taskKey);
      }
    } else {
      progress.completedRoadmapTasks = progress.completedRoadmapTasks.filter((k) => k !== taskKey);
    }

    progress.recalculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      message: `Task '${taskId}' updated to ${status}`,
      status,
      completedRoadmapTasks: progress.completedRoadmapTasks,
      overallProgress: progress.overallProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's roadmap progress
// @route   GET /api/roadmaps/:trackId/progress
// @access  Private
export const getRoadmapProgress = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const progress = await Progress.findOne({ userId: req.user._id });

    const completed = progress
      ? progress.completedRoadmapTasks.filter((t) => t.startsWith(`${trackId}::`))
      : [];

    res.json({
      success: true,
      trackId,
      completedTasks: completed,
      count: completed.length,
    });
  } catch (error) {
    next(error);
  }
};
