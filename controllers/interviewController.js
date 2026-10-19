import InterviewQuestion from '../models/InterviewQuestion.js';
import Progress from '../models/Progress.js';

// @desc    Get all interview questions (filter by category, company, domain)
// @route   GET /api/interview
// @access  Public
export const getInterviewQuestions = async (req, res, next) => {
  try {
    const { category, company, domain } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (company) filter.company = new RegExp(company, 'i');
    if (domain) filter.domain = domain;

    const questions = await InterviewQuestion.find(filter).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview question by ID
// @route   GET /api/interview/:id
// @access  Public
export const getInterviewQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let question = await InterviewQuestion.findOne({ id });
    if (!question && id.match(/^[0-9a-fA-F]{24}$/)) {
      question = await InterviewQuestion.findById(id);
    }

    if (!question) {
      return res.status(404).json({ success: false, message: 'Interview question not found' });
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or mark interview question as practiced
// @route   POST /api/interview/practice
// @access  Private
export const practiceInterviewQuestion = async (req, res, next) => {
  try {
    const { questionId, practiced } = req.body;
    if (!questionId) {
      return res.status(400).json({ success: false, message: 'questionId is required' });
    }

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user._id });
    }

    const isPracticed = practiced !== undefined ? Boolean(practiced) : !progress.practicedPrompts.get(questionId);

    progress.practicedPrompts.set(questionId, isPracticed);

    if (isPracticed) {
      if (!progress.interviewCompleted.includes(questionId)) {
        progress.interviewCompleted.push(questionId);
      }
    } else {
      progress.interviewCompleted = progress.interviewCompleted.filter((q) => q !== questionId);
    }

    progress.recalculateOverallProgress();
    await progress.save();

    res.json({
      success: true,
      questionId,
      practiced: isPracticed,
      interviewCompleted: progress.interviewCompleted,
      overallProgress: progress.overallProgress,
    });
  } catch (error) {
    next(error);
  }
};
