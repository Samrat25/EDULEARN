
export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacherName: string;
  thumbnail: string;
  lectures: Lecture[];
  assignments: string[]; // IDs of assignments
  tests: string[]; // IDs of tests
  students: string[]; // IDs of enrolled students
  createdAt: number;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  order: number;
}
