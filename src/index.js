import express from 'express';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
import { LectureService } from './services/lectureService.js';
import whatsappWebhook from './routes/whatsappWebhook.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { CRON_SCHEDULES } from './config/constants.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const lectureService = new LectureService();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/whatsapp', whatsappWebhook);
app.use('/test', testRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Schedule lecture checks
schedule.scheduleJob(CRON_SCHEDULES.DAILY_LECTURE_CHECK, async () => {
  try {
    const lectures = await lectureService.checkUpcomingLectures();
    console.log(`Processing ${lectures.length} upcoming lectures`);
    
    for (const lecture of lectures) {
      await lectureService.sendLecturerConfirmation(lecture);
      console.log(`Sent confirmation request for lecture ${lecture.id}`);
    }
  } catch (error) {
    console.error('Error in scheduled job:', error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});