import { supabase } from '../config/database.js';
import { sendConfirmationRequest } from '../services/classService.js';
import { fetchBalance } from '../services/smsService.js';

export const createTestData = async (req, res) => {
  try {
    // Create a test lecturer
    const { data: lecturer, error: lecturerError } = await supabase
      .from('lecturers')
      .insert({
        name: 'John Ongwili',
        phone_number: '+254769042076' // Replace with your phone number
      })
      .select()
      .single();

    if (lecturerError) throw lecturerError;

    // Create test students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .insert([
        { name: 'David Okoko', phone_number: '+254769042876' },
        { name: 'Paul Mochoge', phone_number: '+254769042676' }
      ])
      .select();

    if (studentsError) throw studentsError;

    // Create a test class
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .insert({
        name: 'Test Class 101',
        lecturer_id: lecturer.id,
        schedule: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      })
      .select()
      .single();

    if (classError) throw classError;

    // Link students to the class
    const classStudents = students.map(student => ({
      class_id: classData.id,
      student_id: student.id
    }));

    const { error: linkError } = await supabase
      .from('class_students')
      .insert(classStudents);

    if (linkError) throw linkError;

    res.json({
      message: 'Test data created successfully',
      lecturer,
      students,
      class: classData
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({ error: error.message });
  }
};

export const testConfirmation = async (req, res) => {
  try {
    const { classId } = req.params;
    const messageId = await sendConfirmationRequest(classId);
    res.json({ 
      message: 'Confirmation request sent successfully',
      messageId 
    });
  } catch (error) {
    console.error('Error sending confirmation:', error);
    res.status(500).json({ error: error.message });
  }
};

export const checkBalance = async (req, res) => {
  try {
    const balance = await fetchBalance();
    res.json({ balance });
  } catch (error) {
    console.error('Error checking balance:', error);
    res.status(500).json({ error: error.message });
  }
};