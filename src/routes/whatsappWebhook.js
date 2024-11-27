import express from 'express';
import { LectureService } from '../services/lectureService.js';

const router = express.Router();
const lectureService = new LectureService();

router.post('/webhook', async (req, res) => {
  try {
    const { entry } = req.body;

    for (const change of entry[0].changes) {
      if (change.value.messages) {
        const message = change.value.messages[0];
        const response = message.text.body.toLowerCase();
        
        // Get lecture ID from the conversation context
        const { data: lecture } = await supabase
          .from('lectures')
          .select('*')
          .eq('lecturer_phone', message.from)
          .eq('status', 'pending')
          .single();

        if (lecture) {
          const status = response === 'yes' ? 'confirmed' : 'cancelled';
          await lectureService.updateLectureStatus(lecture.id, status);
          await lectureService.notifyStudents(lecture, status);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

export default router;