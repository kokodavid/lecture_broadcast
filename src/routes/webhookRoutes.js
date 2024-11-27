import express from 'express';
import { handleIncomingSMS } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/sms', handleIncomingSMS);

export default router;