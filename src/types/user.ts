
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
  dateOfBirth?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    other?: string;
  };
}

export interface StudentProfile {
  achievements?: string[];
  academicQualifications?: string[];
  currentInstitution?: string;
  enrolledCourses?: string[];
  completedCourses?: string[];
  skills?: string[];
}

export interface TeacherProfile {
  degrees?: string[];
  achievements?: string[];
  qualifications?: string[];
  currentStatus?: string;
  specializations?: string[];
  teachingExperience?: number; // in years
  researchInterests?: string[];
  coursesTeaching?: string[];
}

export interface Student extends BaseUser {
  role: 'student';
  studentProfile?: StudentProfile;
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  teacherProfile?: TeacherProfile;
}

export type User = Student | Teacher;

export interface StoredUser {
  user: User;
  timestamp: number;
}
