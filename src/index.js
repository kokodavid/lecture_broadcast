import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhookRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);
app.use('/test', testRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});