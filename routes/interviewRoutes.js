import express from 'express';
import {
  getInterviewQuestions,
  getInterviewQuestionById,
  practiceInterviewQuestion,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getInterviewQuestions);
router.post('/practice', protect, practiceInterviewQuestion);
router.get('/:id', getInterviewQuestionById);

export default router;
