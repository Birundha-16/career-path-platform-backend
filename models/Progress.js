import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Detailed map of stage checklist toggles matching frontend stages.js keys
    // e.g. "web-dev::HTML / CSS / JS::basic": true
    checkedSkills: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Array of fully completed skill identifiers / names
    completedSkills: [
      {
        type: String,
      },
    ],
    // Array of completed roadmap task IDs
    completedRoadmapTasks: [
      {
        type: String,
      },
    ],
    // Map of trackId -> completion percent
    roadmapProgress: {
      type: Map,
      of: Number,
      default: {},
    },
    // Map of problemId -> boolean
    solvedProblems: {
      type: Map,
      of: Boolean,
      default: {},
    },
    // Array of solved problem IDs
    practiceSolved: [
      {
        type: String,
      },
    ],
    // Map of quizQuestionId -> boolean
    quizProgress: {
      type: Map,
      of: Boolean,
      default: {},
    },
    // Map of promptId -> boolean
    practicedPrompts: {
      type: Map,
      of: Boolean,
      default: {},
    },
    // Array of practiced interview prompt IDs
    interviewCompleted: [
      {
        type: String,
      },
    ],
    // Dynamically calculated overall progress percentage (0 - 100)
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // SkillRack and LeetCode profile values
    skillProfile: {
      skillrackSolved: { type: Number, default: 0 },
      skillrackBadge: { type: String, default: 'Bronze' },
      leetEasy: { type: Number, default: 0 },
      leetMedium: { type: Number, default: 0 },
      leetHard: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: 'progress',
  }
);

// Method to recalculate overallProgress dynamically
progressSchema.methods.recalculateOverallProgress = function (totalTargetSkills = 56, totalTargetProblems = 30) {
  const skillsCount = this.completedSkills ? this.completedSkills.length : 0;
  const practiceCount = this.practiceSolved ? this.practiceSolved.length : 0;
  const tasksCount = this.completedRoadmapTasks ? this.completedRoadmapTasks.length : 0;
  const interviewCount = this.interviewCompleted ? this.interviewCompleted.length : 0;

  // Weightings: 45% skills & roadmap, 40% practice & coding, 15% interview
  const skillRatio = Math.min(skillsCount / (totalTargetSkills || 1), 1);
  const practiceRatio = Math.min(practiceCount / (totalTargetProblems || 1), 1);
  const interviewRatio = Math.min(interviewCount / 10, 1);

  const rawPercent = Math.round(skillRatio * 45 + practiceRatio * 40 + interviewRatio * 15);
  this.overallProgress = Math.min(Math.max(rawPercent, 0), 100);
  return this.overallProgress;
};

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
