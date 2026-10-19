import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  args: [{ type: mongoose.Schema.Types.Mixed }],
  expected: { type: mongoose.Schema.Types.Mixed },
});

const codingProblemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Problem ID is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'], // e.g. 'web-dev', 'ai-ml', 'dsa', 'python', 'sql', etc.
    },
    category: {
      type: String,
      default: 'JavaScript', // C, C++, Java, Python, JavaScript, SQL, Data Structures, Algorithms, etc.
    },
    language: {
      type: String,
      default: 'javascript', // javascript, python, java, cpp, c, sql
    },
    description: {
      type: String,
      required: true,
    },
    functionName: {
      type: String,
      default: 'solution',
    },
    starterCode: {
      type: String,
      default: '',
    },
    starterCodes: {
      type: Map,
      of: String,
      default: {},
    },
    testCases: [testCaseSchema],
    hint: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'codingProblems',
  }
);

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);

export default CodingProblem;
