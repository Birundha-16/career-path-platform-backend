import express from 'express';
import {
  getCareerPaths,
  getCareerPathById,
  createCareerPath,
  updateCareerPath,
  deleteCareerPath,
} from '../controllers/careerPathController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCareerPaths).post(protect, createCareerPath);
router
  .route('/:id')
  .get(getCareerPathById)
  .put(protect, updateCareerPath)
  .delete(protect, deleteCareerPath);

export default router;
