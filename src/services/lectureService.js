import supabase from '../config/database.js';
import { WhatsAppService } from './whatsappService.js';
import { SMSService } from './smsService.js';
import { LECTURE_STATUS } from '../config/constants.js';
import { isValidFutureDate } from '../utils/dateUtils.js';
import { formatLectureConfirmationMessage, formatStudentNotificationMessage } from '../utils/messageFormatter.js';
import { logger } from '../utils/logger.js';

export class LectureService {
  constructor() {
    this.whatsappService = new WhatsAppService();
    this.smsService = new SMSService();
  }

  async checkUpcomingLectures() {
    try {
      const { data: lectures, error } = await supabase
        .from('lectures')
        .select(`
          *,
          course:courses(*),
          lecturer:lecturers(*),
          course_enrollments!inner(
            student:students(*)
          )
        `)
        .eq('status', LECTURE_STATUS.PENDING)
        .gte('scheduled_date', new Date().toISOString());

      if (error) throw error;
      return lectures;
    } catch (error) {
      logger.error('Error checking upcoming lectures:', { error });
      throw error;
    }
  }

  async sendLecturerConfirmation(lectureId) {
    try {
      const { data: lecture, error } = await supabase
        .from('lectures')
        .select(`
          *,
          course:courses(*),
          lecturer:lecturers(*)
        `)
        .eq('id', lectureId)
        .single();

      if (error) throw error;

      if (!isValidFutureDate(lecture.scheduled_date)) {
        throw new Error('Cannot send confirmation for past lectures');
      }

      const message = formatLectureConfirmationMessage(
        lecture.lecturer,
        lecture.course.name,
        lecture.scheduled_date
      );
      
      return await this.whatsappService.sendMessage(
        lecture.lecturer.phone_number,
        message,
        lecture.id,
        lecture.lecturer.id
      );
    } catch (error) {
      logger.error('Error sending lecturer confirmation:', { error, lectureId });
      throw error;
    }
  }

  async notifyStudents(lectureId, status) {
    try {
      const { data: lecture, error } = await supabase
        .from('lectures')
        .select(`
          *,
          course:courses(*),
          lecturer:lecturers(*),
          course_enrollments!inner(
            student:students(*)
          )
        `)
        .eq('id', lectureId)
        .single();

      if (error) throw error;

      const message = formatStudentNotificationMessage(
        lecture.course.name,
        lecture.scheduled_date,
        lecture.lecturer.name,
        status
      );
      
      const students = lecture.course_enrollments.map(
        enrollment => ({
          phone_number: enrollment.student.phone_number,
          id: enrollment.student.id
        })
      );
      
      if (students.length === 0) {
        logger.warn(`No students found for lecture ${lecture.id}`);
        return;
      }

      return await this.smsService.sendBulkSMS(
        students,
        message,
        lecture.id
      );
    } catch (error) {
      logger.error('Error notifying students:', { error, lectureId });
      throw error;
    }
  }

  async updateLectureStatus(lectureId, status) {
    try {
      if (!Object.values(LECTURE_STATUS).includes(status)) {
        throw new Error('Invalid lecture status');
      }

      const { data, error } = await supabase
        .from('lectures')
        .update({ status })
        .eq('id', lectureId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating lecture status:', { error, lectureId });
      throw error;
    }
  }
}