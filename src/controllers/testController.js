import { TestDataService } from '../services/testDataService.js';
import { LectureService } from '../services/lectureService.js';
import { SMSService } from '../services/smsService.js';

export class TestController {
  constructor() {
    this.testDataService = new TestDataService();
    this.lectureService = new LectureService();
    this.smsService = new SMSService();
  }

  async createTestData(req, res) {
    try {
      const testData = await this.testDataService.generateTestData();
      res.json({
        message: 'Test data created successfully',
        ...testData
      });
    } catch (error) {
      console.error('Error creating test data:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async testConfirmation(req, res) {
    try {
      const { classId } = req.params;
      const messageId = await this.lectureService.sendLecturerConfirmation(classId);
      res.json({ 
        message: 'Confirmation request sent successfully',
        messageId 
      });
    } catch (error) {
      console.error('Error sending confirmation:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async checkBalance(req, res) {
    try {
      const balance = await this.smsService.fetchBalance();
      res.json({ balance });
    } catch (error) {
      console.error('Error checking balance:', error);
      res.status(500).json({ error: error.message });
    }
  }
}