import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Interview Question ID is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'hr', 'company-based', 'interview', 'communication'],
      default: 'interview',
    },
    subCategory: {
      type: String,
      default: '', // e.g. 'DSA', 'OOP', 'Behavioral', 'System Design'
    },
    company: {
      type: String,
      default: 'General', // Google, Amazon, TCS, Infosys, Zoho, Microsoft, etc.
    },
    domain: {
      type: String,
      default: 'web-dev',
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    tip: {
      type: String,
      default: '',
    },
    sampleAnswer: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'interviewQuestions',
  }
);

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

export default InterviewQuestion;
