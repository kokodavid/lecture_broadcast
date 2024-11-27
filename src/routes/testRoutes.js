import express from 'express';
import { createTestData, testConfirmation, checkBalance } from '../controllers/testController.js';

const router = express.Router();

router.post('/setup', createTestData);
router.post('/confirm/:classId', testConfirmation);
router.get('/balance', checkBalance);

export default router;