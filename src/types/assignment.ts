
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
  questionType: 'text' | 'file';
  points: number;
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
}
