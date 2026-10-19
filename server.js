// Career Path Platform API Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import careerPathRoutes from './routes/careerPathRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check and root route
app.get('/', (req, res) => {
  res.json({
    name: 'Career Path Platform API (Pathway)',
    version: '1.0.0',
    status: 'online',
    database: 'careerCompassDB',
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      careerPaths: '/api/career-paths',
      skills: '/api/skills',
      roadmaps: '/api/roadmaps',
      practice: '/api/practice',
      interview: '/api/interview',
      internships: '/api/internships',
      resume: '/api/resume',
      progress: '/api/progress',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/career-paths', careerPathRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Career Path Platform API Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`📡 Ready for React frontend connections.`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️ Port ${PORT} is already in use!`);
    console.error(`👉 Another terminal tab is already running the backend.`);
    console.error(`👉 Please close that terminal or press Ctrl+C in it, then run again.\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
