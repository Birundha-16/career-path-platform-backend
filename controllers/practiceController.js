import CodingProblem from '../models/CodingProblem.js';
import PracticeQuestion from '../models/PracticeQuestion.js';
import Progress from '../models/Progress.js';

// @desc    Get practice problems / questions
// @route   GET /api/practice
// @access  Public
export const getPracticeProblems = async (req, res, next) => {
  try {
    const { category, domain, difficulty, language } = req.query;

    const filter = {};
    if (domain) filter.domain = domain;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (category) filter.category = new RegExp(category, 'i');
    if (language) filter.language = language;

    const problems = await CodingProblem.find(filter).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single practice problem by ID
// @route   GET /api/practice/:id
// @access  Public
export const getPracticeProblemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let problem = await CodingProblem.findOne({ id });
    if (!problem && id.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await CodingProblem.findById(id);
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Practice problem '${id}' not found`,
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit code / solution for a practice problem
// @route   POST /api/practice/submit
// @access  Private (optional fallback if demo)
export const submitPracticeProblem = async (req, res, next) => {
  try {
    const { problemId, code, language, results, passed } = req.body;

    if (!problemId) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }

    const problem = await CodingProblem.findOne({ id: problemId });
    if (!problem) {
      return res.status(404).json({ success: false, message: `Problem '${problemId}' not found` });
    }

    // Determine pass status
    let isPassed = Boolean(passed);
    if (results && Array.isArray(results)) {
      isPassed = results.every((r) => r.pass);
    }

    let progressData = null;

    // If user is authenticated, update their progress in MongoDB
    if (req.user) {
      let progress = await Progress.findOne({ userId: req.user._id });
      if (!progress) {
        progress = await Progress.create({ userId: req.user._id });
      }

      if (isPassed) {
        // Mark as solved in Map and Array
        progress.solvedProblems.set(problemId, true);
        if (!progress.practiceSolved.includes(problemId)) {
          progress.practiceSolved.push(problemId);
        }
      }

      progress.recalculateOverallProgress();
      await progress.save();

      progressData = {
        practiceSolved: progress.practiceSolved,
        overallProgress: progress.overallProgress,
      };
    }

    res.json({
      success: true,
      passed: isPassed,
      message: isPassed ? 'Problem solved successfully! Progress saved.' : 'Some test cases did not pass.',
      progress: progressData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get practice quiz / MCQ questions
// @route   GET /api/practice/quizzes
// @access  Public
export const getPracticeQuizzes = async (req, res, next) => {
  try {
    const { category, domain } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (domain) filter.domain = domain;

    const questions = await PracticeQuestion.find(filter);

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answer & persist progress
// @route   POST /api/practice/quiz/answer
// @access  Private (or optional)
export const submitQuizAnswer = async (req, res, next) => {
  try {
    const { questionId, optionId } = req.body;
    if (!questionId || !optionId) {
      return res.status(400).json({ success: false, message: 'questionId and optionId are required' });
    }

    const question = await PracticeQuestion.findOne({ id: questionId });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isCorrect = question.correctOptionId === optionId;

    if (req.user && isCorrect) {
      let progress = await Progress.findOne({ userId: req.user._id });
      if (!progress) {
        progress = await Progress.create({ userId: req.user._id });
      }

      progress.quizProgress.set(questionId, true);
      progress.recalculateOverallProgress();
      await progress.save();
    }

    res.json({
      success: true,
      correct: isCorrect,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    });
  } catch (error) {
    next(error);
  }
};
