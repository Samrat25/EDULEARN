
import { Course } from '@/types/course';

// Get all courses
export const getAllCourses = (): Course[] => {
  return JSON.parse(localStorage.getItem('courses') || '[]');
};

// Get courses by teacher ID
export const getCoursesByTeacherId = (teacherId: string): Course[] => {
  const courses = getAllCourses();
  return courses.filter(course => course.teacherId === teacherId);
};

// Get courses enrolled by student
export const getEnrolledCourses = (studentId: string): Course[] => {
  const courses = getAllCourses();
  return courses.filter(course => course.students.includes(studentId));
};

// Get a single course by ID
export const getCourseById = (courseId: string): Course | null => {
  const courses = getAllCourses();
  return courses.find(course => course.id === courseId) || null;
};

// Create a new course
export const createCourse = (courseData: Omit<Course, 'id' | 'createdAt'>): Course => {
  const courses = getAllCourses();
  
  const newCourse: Course = {
    ...courseData,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  courses.push(newCourse);
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return newCourse;
};

// Update a course
export const updateCourse = (courseId: string, courseData: Partial<Course>): Course | null => {
  const courses = getAllCourses();
  const index = courses.findIndex(course => course.id === courseId);
  
  if (index === -1) return null;
  
  courses[index] = { ...courses[index], ...courseData };
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return courses[index];
};

// Enroll a student in a course
export const enrollStudent = (courseId: string, studentId: string): boolean => {
  const courses = getAllCourses();
  const index = courses.findIndex(course => course.id === courseId);
  
  if (index === -1) return false;
  
  // Check if already enrolled
  if (courses[index].students.includes(studentId)) return true;
  
  courses[index].students.push(studentId);
  localStorage.setItem('courses', JSON.stringify(courses));
  
  return true;
};

// Delete a course
export const deleteCourse = (courseId: string): boolean => {
  const courses = getAllCourses();
  const filteredCourses = courses.filter(course => course.id !== courseId);
  
  if (filteredCourses.length === courses.length) return false;
  
  localStorage.setItem('courses', JSON.stringify(filteredCourses));
  return true;
};
