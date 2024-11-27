import { supabase } from '../config/database.js';

export const findLecturerByPhone = async (phoneNumber) => {
  const { data, error } = await supabase
    .from('lecturers')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single();

  if (error) throw error;
  return data;
};

export const getLecturerClasses = async (lecturerId) => {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      students:class_students(
        student:students(*)
      )
    `)
    .eq('lecturer_id', lecturerId);

  if (error) throw error;
  return data;
};