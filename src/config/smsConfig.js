import AfricasTalking from 'africastalking';
import dotenv from 'dotenv';

dotenv.config();

const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
};

export const africasTalking = AfricasTalking(credentials);