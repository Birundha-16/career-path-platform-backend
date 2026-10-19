import express from 'express';
import {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
} from '../controllers/internshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getInternships).post(protect, createInternship);
router.route('/:id').get(getInternshipById).put(protect, updateInternship).delete(protect, deleteInternship);

export default router;
