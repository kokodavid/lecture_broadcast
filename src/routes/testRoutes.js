import express from 'express';
import { TestController } from '../controllers/testController.js';

const router = express.Router();
const testController = new TestController();

router.post('/create-test-data', (req, res) => testController.createTestData(req, res));
router.post('/test-confirmation/:classId', (req, res) => testController.testConfirmation(req, res));
router.get('/check-balance', (req, res) => testController.checkBalance(req, res));

export default router;