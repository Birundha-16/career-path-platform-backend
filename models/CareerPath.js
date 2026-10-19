import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  skills: [
    {
      type: String,
      required: true,
    },
  ],
});

const careerPathSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Career Path ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Career Path Name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#4FD1C5',
    },
    icon: {
      type: String,
      default: 'code',
    },
    stations: [stationSchema],
  },
  {
    timestamps: true,
    collection: 'careerPaths',
  }
);

const CareerPath = mongoose.model('CareerPath', careerPathSchema);

export default CareerPath;
