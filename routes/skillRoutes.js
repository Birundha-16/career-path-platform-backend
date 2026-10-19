import express from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillStatus,
} from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSkills).post(protect, createSkill);
router.route('/:id').get(getSkillById).put(protect, updateSkill).delete(protect, deleteSkill);
router.put('/:id/status', protect, updateSkillStatus);

export default router;
