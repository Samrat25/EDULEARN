import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Assignment, AssignmentAnswer, AssignmentSubmission } from '@/types/assignment';
import { getAssignmentById, getStudentSubmission, submitAssignment } from '@/services/assignmentService';
import { getCourseById } from '@/services/courseService';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const AssignmentView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [answers, setAnswers] = useState<AssignmentAnswer[]>([]);
  const [existingSubmission, setExistingSubmission] = useState<AssignmentSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !currentUser) return;

    const assignmentData = getAssignmentById(id);
    if (!assignmentData) {
      toast({
        title: 'Assignment not found',
        description: 'The assignment you are looking for does not exist.',
        variant: 'destructive',
      });
      navigate('/student/dashboard');
      return;
    }
    
    setAssignment(assignmentData);
    
    // Get course name
    const course = getCourseById(assignmentData.courseId);
    if (course) {
      setCourseName(course.title);
    }
    
    // Initialize answers array
    const initialAnswers = assignmentData.questions.map(question => ({
      questionId: question.id,
      answer: ''
    }));
    
    // Check if student already submitted
    const submission = getStudentSubmission(id, currentUser.id);
    if (submission) {
      setExistingSubmission(submission);
      setAnswers(submission.answers);
    } else {
      setAnswers(initialAnswers);
    }
  }, [id, currentUser, navigate, toast]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => 
      prev.map(a => a.questionId === questionId ? { ...a, answer: value } : a)
    );
  };

  const handleSubmit = () => {
    if (!assignment || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        assignmentId: assignment.id,
        studentId: currentUser.id,
        courseId: assignment.courseId,
        answers: answers
      };
      
      const result = submitAssignment(submissionData);
      
      toast({
        title: 'Assignment submitted',
        description: 'Your assignment has been submitted successfully.',
      });
      
      setExistingSubmission(result);
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your assignment.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) {
    return (
      <PageLayout>
        <div className="container py-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          </div>
        </div>
      </PageLayout>
    );
  }

  const isOverdue = Date.now() > assignment.dueDate;
  const canSubmit = !existingSubmission && !isOverdue;

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <Link to={`/course/${assignment.courseId}`} className="text-primary hover:underline mb-2 inline-block">
            ← Back to {courseName || 'Course'}
          </Link>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
            {existingSubmission && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Submitted
              </span>
            )}
            {isOverdue && !existingSubmission && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                Overdue
              </span>
            )}
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assignment Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{assignment.description}</p>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          {assignment.questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <CardDescription>Points: {question.points}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{question.question}</p>
                  {question.questionType === 'text' ? (
                    <Textarea
                      value={answers.find(a => a.questionId === question.id)?.answer || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={!!existingSubmission}
                      className="min-h-[100px]"
                    />
                  ) : question.questionType === 'file' ? (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        disabled={!!existingSubmission}
                      />
                      {existingSubmission && (
                        <p className="text-sm text-muted-foreground">
                          File submitted: {
                            answers.find(a => a.questionId === question.id)?.fileUrl || 
                            answers.find(a => a.questionId === question.id)?.answer || 
                            'No file'
                          }
                        </p>
                      )}
                    </div>
                  ) : question.questionType === 'mcq' && (
                    <div className="space-y-3 mt-4">
                      <RadioGroup 
                        value={answers.find(a => a.questionId === question.id)?.selectedOption || ''}
                        onValueChange={(value) => {
                          const updatedAnswers = [...answers];
                          const answerIndex = updatedAnswers.findIndex(a => a.questionId === question.id);
                          if (answerIndex !== -1) {
                            updatedAnswers[answerIndex] = {
                              ...updatedAnswers[answerIndex],
                              selectedOption: value,
                              answer: value
                            };
                            setAnswers(updatedAnswers);
                          }
                        }}
                        disabled={!!existingSubmission}
                      >
                        {question.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${question.id}-${index}`} />
                            <Label htmlFor={`option-${question.id}-${index}`}>{option}</Label>
                            
                            {existingSubmission && answers.find(a => a.questionId === question.id)?.selectedOption === option && (
                              <span className={`ml-2 text-sm ${option === answers.find(a => a.questionId === question.id)?.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                                {option === answers.find(a => a.questionId === question.id)?.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                      
                      {existingSubmission && (
                        <div className="mt-3 p-3 bg-secondary/20 rounded-md">
                          <p className="text-sm font-medium">
                            {answers.find(a => a.questionId === question.id)?.selectedOption === answers.find(a => a.questionId === question.id)?.correctAnswer 
                              ? '✅ Your answer is correct!' 
                              : `❌ Incorrect. The correct answer is: ${answers.find(a => a.questionId === question.id)?.correctAnswer}`
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {existingSubmission ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted on:</span>
                  <span>{new Date(existingSubmission.submittedAt).toLocaleString()}</span>
                </div>
                {existingSubmission.grade !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grade:</span>
                    <span>{existingSubmission.grade}</span>
                  </div>
                )}
                {existingSubmission.feedback && (
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Feedback:</h3>
                    <p className="text-sm">{existingSubmission.feedback}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || isOverdue}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </div>
        )}
        
      </div>
    </PageLayout>
  );
};

export default AssignmentView;
