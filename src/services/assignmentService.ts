
import { Assignment, AssignmentSubmission } from '@/types/assignment';

// Get all assignments
export const getAllAssignments = (): Assignment[] => {
  return JSON.parse(localStorage.getItem('assignments') || '[]');
};

// Get assignments by course ID
export const getAssignmentsByCourseId = (courseId: string): Assignment[] => {
  const assignments = getAllAssignments();
  return assignments.filter(assignment => assignment.courseId === courseId);
};

// Get a single assignment by ID
export const getAssignmentById = (assignmentId: string): Assignment | null => {
  const assignments = getAllAssignments();
  return assignments.find(assignment => assignment.id === assignmentId) || null;
};

// Create a new assignment
export const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
  const assignments = getAllAssignments();
  
  const newAssignment: Assignment = {
    ...assignmentData,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  assignments.push(newAssignment);
  localStorage.setItem('assignments', JSON.stringify(assignments));
  
  return newAssignment;
};

// Update an assignment
export const updateAssignment = (assignmentId: string, assignmentData: Partial<Assignment>): Assignment | null => {
  const assignments = getAllAssignments();
  const index = assignments.findIndex(assignment => assignment.id === assignmentId);
  
  if (index === -1) return null;
  
  assignments[index] = { ...assignments[index], ...assignmentData };
  localStorage.setItem('assignments', JSON.stringify(assignments));
  
  return assignments[index];
};

// Delete an assignment
export const deleteAssignment = (assignmentId: string): boolean => {
  const assignments = getAllAssignments();
  const filteredAssignments = assignments.filter(assignment => assignment.id !== assignmentId);
  
  if (filteredAssignments.length === assignments.length) return false;
  
  localStorage.setItem('assignments', JSON.stringify(filteredAssignments));
  return true;
};

// Get all assignment submissions
export const getAllSubmissions = (): AssignmentSubmission[] => {
  return JSON.parse(localStorage.getItem('assignmentSubmissions') || '[]');
};

// Get submissions by student ID
export const getSubmissionsByStudentId = (studentId: string): AssignmentSubmission[] => {
  const submissions = getAllSubmissions();
  return submissions.filter(submission => submission.studentId === studentId);
};

// Get submissions by assignment ID
export const getSubmissionsByAssignmentId = (assignmentId: string): AssignmentSubmission[] => {
  const submissions = getAllSubmissions();
  return submissions.filter(submission => submission.assignmentId === assignmentId);
};

// Get a student's submission for a specific assignment
export const getStudentSubmission = (assignmentId: string, studentId: string): AssignmentSubmission | null => {
  const submissions = getAllSubmissions();
  return submissions.find(submission => 
    submission.assignmentId === assignmentId && submission.studentId === studentId
  ) || null;
};

// Submit an assignment
export const submitAssignment = (submissionData: Omit<AssignmentSubmission, 'id' | 'submittedAt'>): AssignmentSubmission => {
  const submissions = getAllSubmissions();
  const assignment = getAssignmentById(submissionData.assignmentId);
  
  // Process MCQ answers if assignment exists
  if (assignment) {
    submissionData.answers = submissionData.answers.map(answer => {
      const question = assignment.questions.find(q => q.id === answer.questionId);
      
      // For MCQ questions, check correctness
      if (question && question.questionType === 'mcq' && answer.selectedOption) {
        // Set answer to the selected option text for consistent display
        return {
          ...answer,
          answer: answer.selectedOption,
          type: 'mcq',
          correctAnswer: question.correctAnswer || '',
        };
      }
      
      return answer;
    });
  }
  
  const newSubmission: AssignmentSubmission = {
    ...submissionData,
    id: Date.now().toString(),
    submittedAt: Date.now(),
  };
  
  submissions.push(newSubmission);
  localStorage.setItem('assignmentSubmissions', JSON.stringify(submissions));
  
  return newSubmission;
};

// Grade a submission
export const gradeSubmission = (
  submissionId: string, 
  grade: number, 
  feedback: string, 
  answerFeedback?: { questionId: string, feedback: string, rating: number }[]
): AssignmentSubmission | null => {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(submission => submission.id === submissionId);
  
  if (index === -1) return null;
  
  // Update the main submission feedback and grade
  submissions[index] = { 
    ...submissions[index], 
    grade, 
    feedback 
  };
  
  // If per-question feedback is provided, update individual answer feedback
  if (answerFeedback && answerFeedback.length > 0) {
    const updatedAnswers = submissions[index].answers.map(answer => {
      const feedback = answerFeedback.find(fb => fb.questionId === answer.questionId);
      if (feedback) {
        return {
          ...answer,
          feedback: feedback.feedback,
          rating: feedback.rating
        };
      }
      return answer;
    });
    
    submissions[index].answers = updatedAnswers;
  }
  
  localStorage.setItem('assignmentSubmissions', JSON.stringify(submissions));
  
  return submissions[index];
};
