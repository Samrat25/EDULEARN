
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
  
  if (test) {
    submissionData.answers.forEach(answer => {
      const question = test.questions.find(q => q.id === answer.questionId);
      if (question && answer.selectedOptionIndex === question.correctOptionIndex) {
        score += question.points;
      }
    });
  }
  
  const newSubmission: TestSubmission = {
    ...submissionData,
    id: Date.now().toString(),
    submittedAt: Date.now(),
    score
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('testSubmissions', JSON.stringify(submissions));
  
  return newSubmission;
};
