import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, default: '' },
  tech: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personalDetails: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    education: {
      college: { type: String, default: '' },
      degree: { type: String, default: '' },
      gradYear: { type: String, default: '' },
      gpa: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    trackId: {
      type: String,
      default: 'web-dev',
    },
    skills: {
      mastered: [{ type: String }],
      learning: [{ type: String }],
    },
    projects: [projectSchema],
    certifications: [{ type: String }],
    experience: [experienceSchema],
    achievements: [{ type: String }],
  },
  {
    timestamps: true,
    collection: 'resumes',
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
