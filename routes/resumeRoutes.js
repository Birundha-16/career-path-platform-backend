import express from 'express';
import { getUserResume, updateUserResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getUserResume).put(protect, updateUserResume);

export default router;
