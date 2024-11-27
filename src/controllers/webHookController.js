import { handleLecturerResponse } from '../services/classService.js';

export const handleIncomingSMS = async (req, res) => {
  try {
    console.log('Received webhook payload:', req.body);
    
    // Africa's Talking webhook payload structure
    const { from, text } = req.body;
    
    if (!from || !text) {
      console.error('Missing required fields in webhook payload');
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: req.body 
      });
    }

    console.log(`Processing SMS from ${from}: ${text}`);
    
    const result = await handleLecturerResponse(from, text);
    
    console.log('SMS processing result:', result);
    
    // Africa's Talking expects a specific response format
    res.status(200).json({ 
      success: true,
      message: result ? 'Message processed successfully' : 'No action taken'
    });
  } catch (error) {
    console.error('Error handling incoming SMS:', error);
    res.status(500).json({ 
      success: false,
      message: error.message
    });
  }
};