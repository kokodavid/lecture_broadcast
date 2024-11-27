import fetch from 'node-fetch';
import { MessageLogService } from './messageLogService.js';
import { logger } from '../utils/logger.js';

export class SMSService {
  constructor() {
    this.apiKey = process.env.TALKSASA_API_KEY;
    this.sender = process.env.TALKSASA_SENDER_ID;
    this.messageLogService = new MessageLogService();
  }

  async sendBulkSMS(recipients, message, lectureId) {
    try {
      const response = await fetch('https://api.talksasa.com/v1/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.sender,
          recipients: recipients,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`TalkSasa API error: ${response.statusText}`);
      }

      const result = await response.json();

      // Log messages for each recipient
      await Promise.all(recipients.map(async (recipient) => {
        await this.messageLogService.logMessage({
          lectureId,
          recipientType: 'student',
          recipientId: recipient.id,
          messageType: 'sms',
          messageContent: message,
          externalMessageId: result.message_id
        });
      }));

      return result;
    } catch (error) {
      logger.error('Error sending bulk SMS:', { error, recipientCount: recipients.length });
      throw error;
    }
  }
}