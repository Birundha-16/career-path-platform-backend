import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      default: 'Remote', // 'Remote', 'On-site', 'Hybrid'
    },
    stipend: {
      type: String,
      default: '₹15,000 - ₹25,000 / month',
    },
    trackId: {
      type: String,
      required: [true, 'Track ID is required'],
      ref: 'CareerPath',
    },
    skills: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      default: '',
    },
    applicationLink: {
      type: String,
      default: '#',
    },
    deadline: {
      type: String,
      default: 'Open Rolling',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  {
    timestamps: true,
    collection: 'internships',
  }
);

const Internship = mongoose.model('Internship', internshipSchema);

export default Internship;
