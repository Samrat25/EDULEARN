
export interface Test {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // in minutes
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
}

export interface TestAnswer {
  questionId: string;
  selectedOptionIndex: number;
}
