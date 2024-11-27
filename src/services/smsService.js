import { africasTalking } from '../config/smsConfig.js';

const sms = africasTalking.SMS;

export const sendSMS = async (to, message) => {
  try {
    if (!to || !message) {
      throw new Error('Both "to" and "message" parameters are required');
    }

    const options = {
      to: [to],
      message,
      from: process.env.AT_SENDER_ID
    };

    console.log('Sending SMS with options:', options);
    const response = await sms.send(options);
    console.log('SMS response:', response);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export const sendBulkSMS = async (messages) => {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages array is required and must not be empty');
    }

    const recipients = messages.map(msg => {
      if (!msg.to || !msg.message) {
        throw new Error('Each message must have "to" and "message" properties');
      }

      return {
        to: [msg.to], // Africa's Talking expects an array of recipients
        message: msg.message,
        from: process.env.AT_SENDER_ID
      };
    });

    console.log('Sending bulk SMS with recipients:', recipients);
    const responses = await Promise.all(
      recipients.map(recipient => sms.send(recipient))
    );
    console.log('Bulk SMS responses:', responses);

    return responses;
  } catch (error) {
    console.error('Error sending bulk SMS:', error);
    throw error;
  }
};

export const fetchBalance = async () => {
  try {
    const balance = await africasTalking.APPLICATION.fetchApplicationData();
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};