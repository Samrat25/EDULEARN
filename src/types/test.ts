
export interface Test {
  id: string;
  title: string;
  description: string;
  courseId: string;
  teacherId: string;
  duration: number; // in minutes
  totalMarks: number; // total possible marks for the test
  questions: TestQuestion[];
  createdAt: number;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

export interface TestSubmission {
  id: string;
  testId: string;
  studentId: string;
  courseId: string;
  answers: TestAnswer[];
  startedAt: number;
  submittedAt: number;
  score?: number;
  totalPossibleScore?: number; // Added to track the total possible score
  timeTaken?: number; // Time taken in minutes
}

export interface TestAnswer {
  questionId: string;
  selectedOptionIndex: number;
  correct?: boolean; // Whether the answer is correct
  points?: number; // Points earned for this question
}
