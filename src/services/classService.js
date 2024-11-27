import { supabase } from '../config/database.js';
import { findLecturerByPhone } from './lecturerService.js';
import { sendSMS, sendBulkSMS } from './smsService.js';
import { formatConfirmationMessage, formatStudentNotification } from '../utils/messageFormatter.js';

export const sendConfirmationRequest = async (classId) => {
  try {
    console.log(`Sending confirmation request for class ${classId}`);
    
    const { data: classDetails, error } = await supabase
      .from('classes')
      .select(`
        *,
        lecturer:lecturers(*),
        students:class_students(
          student:students(*)
        )
      `)
      .eq('id', classId)
      .single();

    if (error) throw error;
    if (!classDetails) throw new Error('Class not found');

    console.log('Found class details:', classDetails);

    const message = formatConfirmationMessage(
      classDetails.name,
      new Date(classDetails.schedule).toLocaleString()
    );

    const response = await sendSMS(classDetails.lecturer.phone_number, message);
    console.log('SMS sent successfully:', response);
    
    if (response.SMSMessageData?.Recipients?.[0]?.messageId) {
      return response.SMSMessageData.Recipients[0].messageId;
    }
    throw new Error('Failed to send SMS');
  } catch (error) {
    console.error('Error sending confirmation request:', error);
    throw error;
  }
};

export const handleLecturerResponse = async (from, message) => {
  try {
    console.log(`Processing response from ${from}: ${message}`);
    
    const response = message.trim().toUpperCase();
    if (!['YES', 'NO'].includes(response)) {
      console.log('Invalid response received:', response);
      return false;
    }

    const phoneNumber = from.startsWith('+') ? from : `+${from}`;
    const lecturer = await findLecturerByPhone(phoneNumber);
    console.log('Found lecturer:', lecturer);

    if (!lecturer) {
      console.log('No lecturer found for phone number:', phoneNumber);
      return false;
    }

    const { data: pendingClass, error } = await supabase
      .from('classes')
      .select('*')
      .eq('lecturer_id', lecturer.id)
      .eq('is_confirmed', false)
      .gt('schedule', new Date().toISOString())
      .order('schedule', { ascending: true })
      .limit(1)
      .single();

    console.log('Found pending class:', pendingClass);

    if (error || !pendingClass) {
      console.log('No pending class found for lecturer');
      return false;
    }

    if (response === 'YES') {
      console.log('Confirming class:', pendingClass.id);
      
      const { error: updateError } = await supabase
        .from('classes')
        .update({ is_confirmed: true })
        .eq('id', pendingClass.id);

      if (updateError) throw updateError;
      
      console.log('Class confirmed, broadcasting to students');
      await broadcastToStudents(pendingClass.id, true);
    } else if (response === 'NO') {
      console.log('Class cancelled, broadcasting to students');
      await broadcastToStudents(pendingClass.id, false);
    }

    return true;
  } catch (error) {
    console.error('Error handling lecturer response:', error);
    throw error;
  }
};

export const broadcastToStudents = async (classId, isConfirmed) => {
  try {
    console.log(`Broadcasting ${isConfirmed ? 'confirmation' : 'cancellation'} for class ${classId}`);
    
    const { data: classDetails, error } = await supabase
      .from('classes')
      .select(`
        *,
        students:class_students(
          student:students(*)
        )
      `)
      .eq('id', classId)
      .single();

    if (error) throw error;
    console.log('Found class details with students:', classDetails);

    const messages = classDetails.students.map(({ student }) => ({
      to: student.phone_number,
      message: formatStudentNotification(
        classDetails.name,
        new Date(classDetails.schedule).toLocaleString(),
        isConfirmed
      )
    }));

    console.log('Preparing to send messages:', messages);

    const responses = await sendBulkSMS(messages);
    console.log('Broadcast responses:', responses);
    
    return responses.every(r => 
      r.SMSMessageData?.Recipients?.[0]?.status === 'Success' || 
      r.SMSMessageData?.Recipients?.[0]?.statusCode === 101
    );
  } catch (error) {
    console.error('Error broadcasting to students:', error);
    throw error;
  }
};