import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const practiceQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Question ID is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'], // 'quiz', 'aptitude', 'debugging', 'git', 'system-design', 'logical-reasoning', 'technical-mcqs', 'sql'
      trim: true,
    },
    domain: {
      type: String,
      default: 'general',
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: [optionSchema],
    correctOptionId: {
      type: String,
      required: [true, 'Correct option ID is required'],
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'practiceQuestions',
  }
);

const PracticeQuestion = mongoose.model('PracticeQuestion', practiceQuestionSchema);

export default PracticeQuestion;
