import express from 'express';
import {
  getUserProgress,
  toggleSkillStage,
  setSkillField,
  syncProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserProgress);
router.put('/toggle-skill', protect, toggleSkillStage);
router.put('/set-field', protect, setSkillField);
router.put('/sync', protect, syncProgress);

export default router;
