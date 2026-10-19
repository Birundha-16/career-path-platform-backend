import express from 'express';
import {
  getRoadmaps,
  getRoadmapByTrackId,
  createOrUpdateRoadmap,
  updateRoadmapTask,
  getRoadmapProgress,
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoadmaps).post(protect, createOrUpdateRoadmap);
router.route('/:trackId').get(getRoadmapByTrackId);
router.put('/:trackId/tasks/:taskId', protect, updateRoadmapTask);
router.get('/:trackId/progress', protect, getRoadmapProgress);

export default router;
