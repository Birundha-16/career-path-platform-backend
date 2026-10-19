import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    trackId: {
      type: String,
      required: [true, 'Track ID is required'],
      ref: 'CareerPath',
    },
    stationTitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, default: 'Article' },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'skills',
  }
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
