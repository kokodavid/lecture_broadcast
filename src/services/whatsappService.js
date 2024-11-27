import fetch from 'node-fetch';
import { MessageLogService } from './messageLogService.js';
import { logger } from '../utils/logger.js';
import { WHATSAPP_CONFIG } from '../config/constants.js';

export class WhatsAppService {
  constructor() {
    this.apiVersion = WHATSAPP_CONFIG.API_VERSION;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.messageLogService = new MessageLogService();
  }

  async sendMessage(to, message, lectureId, recipientId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: WHATSAPP_CONFIG.TEMPLATE_NAME,
              language: {
                code: WHATSAPP_CONFIG.LANGUAGE_CODE,
              },
              components: [
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: message,
                    },
                  ],
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Log the message
      await this.messageLogService.logMessage({
        lectureId,
        recipientType: 'lecturer',
        recipientId,
        messageType: 'whatsapp',
        messageContent: message,
        externalMessageId: result.messages?.[0]?.id
      });

      return result;
    } catch (error) {
      logger.error('Error sending WhatsApp message:', { error, to });
      throw error;
    }
  }
}