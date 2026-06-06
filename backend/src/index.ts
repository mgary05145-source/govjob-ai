import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import studyRoutes from './routes/studyRoutes';
import aiRoutes from './routes/aiRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import pomodoroRoutes from './routes/pomodoroRoutes';
import streakRoutes from './routes/streakRoutes';
import revisionRoutes from './routes/revisionRoutes';
import notesRoutes from './routes/notesRoutes';
import mockTestRoutes from './routes/mockTestRoutes';
import currentAffairsRoutes from './routes/currentAffairsRoutes';
import notificationRoutes from './routes/notificationRoutes';
import syllabusRoutes from './routes/syllabusRoutes';
import gamificationRoutes from './routes/gamificationRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pomodoro', pomodoroRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/revision', revisionRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/mock-tests', mockTestRoutes);
app.use('/api/current-affairs', currentAffairsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/gamification', gamificationRoutes);

app.get('/api', (_, res) => {
  res.json({ message: 'GovJob India AI API', version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
