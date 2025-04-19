
import { Test, TestSubmission } from '@/types/test';

// Get all tests
export const getAllTests = (): Test[] => {
  return JSON.parse(localStorage.getItem('tests') || '[]');
};

// Get tests by course ID
export const getTestsByCourseId = (courseId: string): Test[] => {
  const tests = getAllTests();
  return tests.filter(test => test.courseId === courseId);
};

// Get a single test by ID
export const getTestById = (testId: string): Test | null => {
  const tests = getAllTests();
  return tests.find(test => test.id === testId) || null;
};

// Create a new test
export const createTest = (testData: Omit<Test, 'id' | 'createdAt'>): Test => {
  const tests = getAllTests();
  
  // Calculate total points from questions if totalMarks not specified
  if (!testData.totalMarks) {
    testData.totalMarks = testData.questions.reduce((total, q) => total + q.points, 0);
  }
  
  const newTest: Test = {
    ...testData,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  tests.push(newTest);
  localStorage.setItem('tests', JSON.stringify(tests));
  
  return newTest;
};

// Update a test
export const updateTest = (testId: string, testData: Partial<Test>): Test | null => {
  const tests = getAllTests();
  const index = tests.findIndex(test => test.id === testId);
  
  if (index === -1) return null;
  
  tests[index] = { ...tests[index], ...testData };
  localStorage.setItem('tests', JSON.stringify(tests));
  
  return tests[index];
};

// Delete a test
export const deleteTest = (testId: string): boolean => {
  const tests = getAllTests();
  const filteredTests = tests.filter(test => test.id !== testId);
  
  if (filteredTests.length === tests.length) return false;
  
  localStorage.setItem('tests', JSON.stringify(filteredTests));
  return true;
};

// Get all test submissions
export const getAllTestSubmissions = (): TestSubmission[] => {
  return JSON.parse(localStorage.getItem('testSubmissions') || '[]');
};

// Get submissions by student ID
export const getTestSubmissionsByStudentId = (studentId: string): TestSubmission[] => {
  const submissions = getAllTestSubmissions();
  return submissions.filter(submission => submission.studentId === studentId);
};

// Get submissions by test ID
export const getTestSubmissionsByTestId = (testId: string): TestSubmission[] => {
  const submissions = getAllTestSubmissions();
  return submissions.filter(submission => submission.testId === testId);
};

// Get a student's submission for a specific test
export const getStudentTestSubmission = (testId: string, studentId: string): TestSubmission | null => {
  const submissions = getAllTestSubmissions();
  return submissions.find(submission => 
    submission.testId === testId && submission.studentId === studentId
  ) || null;
};

// Submit a test
export const submitTest = (submissionData: Omit<TestSubmission, 'id' | 'submittedAt'>): TestSubmission => {
  const submissions = getAllTestSubmissions();
  
  // Calculate score
  const test = getTestById(submissionData.testId);
  let score = 0;
  let totalPossibleScore = 0;
  let timeTaken = 0;
  
  // Calculate time taken
  if (submissionData.startedAt) {
    timeTaken = Math.round((Date.now() - submissionData.startedAt) / 60000); // Convert to minutes
  }
  
  if (test) {
    // Use test's totalMarks if available, otherwise calculate from questions
    totalPossibleScore = test.totalMarks || 
      test.questions.reduce((total, q) => total + q.points, 0);
      
    // Process each answer, marking correct/incorrect and assigning points
    submissionData.answers = submissionData.answers.map(answer => {
      const question = test.questions.find(q => q.id === answer.questionId);
      const isCorrect = question && answer.selectedOptionIndex === question.correctOptionIndex;
      const points = isCorrect && question ? question.points : 0;
      
      if (isCorrect) {
        score += points;
      }
      
      return {
        ...answer,
        correct: isCorrect,
        points: points
      };
    });
  }
  
  const newSubmission: TestSubmission = {
    ...submissionData,
    id: Date.now().toString(),
    submittedAt: Date.now(),
    score,
    totalPossibleScore,
    timeTaken
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('testSubmissions', JSON.stringify(submissions));
  
  return newSubmission;
};
