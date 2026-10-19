import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  skills: [String],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
});

const roadmapStationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  tasks: [taskSchema],
});

const roadmapSchema = new mongoose.Schema(
  {
    trackId: {
      type: String,
      required: [true, 'Track ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    stations: [roadmapStationSchema],
  },
  {
    timestamps: true,
    collection: 'roadmaps',
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
