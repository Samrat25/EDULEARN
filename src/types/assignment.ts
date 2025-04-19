export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: number;
  questions: AssignmentQuestion[];
  createdAt: number;
}

export interface AssignmentQuestion {
  id: string;
  question: string;
  questionType: 'text' | 'file' | 'mcq';
  points: number;
  options?: string[];
  correctAnswer?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  answers: AssignmentAnswer[];
  submittedAt: number;
  grade?: number;
  feedback?: string;
}

export interface AssignmentAnswer {
  questionId: string;
  answer: string;
  fileUrl?: string;
  selectedOption?: string;
  feedback?: string;
  rating?: number;
  correctAnswer?: string;
  type?: 'text' | 'file' | 'mcq';
}
