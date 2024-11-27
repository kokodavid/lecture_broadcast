import supabase from '../config/database.js';
import { logger } from '../utils/logger.js';

export class MessageLogService {
  async logMessage({
    lectureId,
    recipientType,
    recipientId,
    messageType,
    messageContent,
    externalMessageId = null
  }) {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .insert({
          lecture_id: lectureId,
          recipient_type: recipientType,
          recipient_id: recipientId,
          message_type: messageType,
          message_content: messageContent,
          external_message_id: externalMessageId,
          status: externalMessageId ? 'sent' : 'pending'
        })
        .select()
        .single();

      if (error) {
        logger.error('Error logging message:', { error });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Failed to log message:', { error });
      throw error;
    }
  }

  async updateMessageStatus(externalMessageId, status) {
    try {
      const { data, error } = await supabase
        .from('message_logs')
        .update({ status })
        .eq('external_message_id', externalMessageId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating message status:', { error });
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Failed to update message status:', { error });
      throw error;
    }
  }
}