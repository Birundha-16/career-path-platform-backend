import express from 'express';
import {
  getPracticeProblems,
  getPracticeProblemById,
  submitPracticeProblem,
  getPracticeQuizzes,
  submitQuizAnswer,
} from '../controllers/practiceController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/quizzes', getPracticeQuizzes);
router.post('/quiz/answer', optionalAuth, submitQuizAnswer);
router.post('/submit', optionalAuth, submitPracticeProblem);
router.get('/:id', getPracticeProblemById);
router.get('/', getPracticeProblems);

export default router;
