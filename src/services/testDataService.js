import supabase from '../config/database.js';

export class TestDataService {
  async generateTestData() {
    // Create a test department
    const department = await this.createDepartment();
    
    // Create a test lecturer
    const lecturer = await this.createLecturer(department.id);
    
    // Create test students
    const students = await this.createStudents(department.id);
    
    // Create a test course
    const course = await this.createCourse(department.id);
    
    // Create a test lecture
    const lecture = await this.createLecture(course.id, lecturer.id);
    
    // Create course enrollments
    await this.createEnrollments(course.id, students);

    return {
      department,
      lecturer,
      students,
      course,
      lecture
    };
  }

  async createDepartment() {
    const { data: department, error } = await supabase
      .from('departments')
      .insert({
        name: 'Computer Science'
      })
      .select()
      .single();

    if (error) throw error;
    return department;
  }

  async createLecturer(departmentId) {
    const { data: lecturer, error } = await supabase
      .from('lecturers')
      .insert({
        department_id: departmentId,
        name: 'John Ongwili',
        email: 'john.ongwili@university.edu',
        phone_number: '+254769042076'
      })
      .select()
      .single();

    if (error) throw error;
    return lecturer;
  }

  async createStudents(departmentId) {
    const { data: students, error } = await supabase
      .from('students')
      .insert([
        {
          department_id: departmentId,
          name: 'David Okoko',
          email: 'david.okoko@university.edu',
          phone_number: '+254769042876',
          registration_number: 'CS001/2023'
        },
        {
          department_id: departmentId,
          name: 'Paul Mochoge',
          email: 'paul.mochoge@university.edu',
          phone_number: '+254769042676',
          registration_number: 'CS002/2023'
        }
      ])
      .select();

    if (error) throw error;
    return students;
  }

  async createCourse(departmentId) {
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        department_id: departmentId,
        code: 'CS101',
        name: 'Introduction to Programming'
      })
      .select()
      .single();

    if (error) throw error;
    return course;
  }

  async createLecture(courseId, lecturerId) {
    const { data: lecture, error } = await supabase
      .from('lectures')
      .insert({
        course_id: courseId,
        lecturer_id: lecturerId,
        room_number: 'LH-001',
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 120,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return lecture;
  }

  async createEnrollments(courseId, students) {
    const currentYear = new Date().getFullYear();
    const enrollments = students.map(student => ({
      student_id: student.id,
      course_id: courseId,
      semester: 'FALL',
      academic_year: `${currentYear}/${currentYear + 1}`
    }));

    const { error } = await supabase
      .from('course_enrollments')
      .insert(enrollments);

    if (error) throw error;
  }
}