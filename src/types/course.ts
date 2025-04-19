
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
  category?: string; // Course category (e.g., programming, math, science)
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  price?: number; // Course price in USD (0 for free courses)
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  order: number;
  likes?: number;
  viewed?: boolean;
  completed?: boolean;
}
