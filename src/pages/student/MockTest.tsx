
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Test, TestAnswer, TestSubmission } from '@/types/test';
import { getTestById, getStudentTestSubmission, submitTest } from '@/services/testService';
import { getCourseById } from '@/services/courseService';

const MockTest = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [test, setTest] = useState<Test | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !currentUser) return;

    const testData = getTestById(id);
    if (!testData) {
      toast({
        title: 'Test not found',
        description: 'The test you are looking for does not exist.',
        variant: 'destructive',
      });
      navigate('/student/dashboard');
      return;
    }
    
    setTest(testData);
    setTimeRemaining(testData.duration * 60); // convert to seconds
    
    // Get course name
    const course = getCourseById(testData.courseId);
    if (course) {
      setCourseName(course.title);
    }
    
    // Check if student already submitted
    const existingSubmission = getStudentTestSubmission(id, currentUser.id);
    if (existingSubmission) {
      setSubmission(existingSubmission);
      setTestCompleted(true);
    } else {
      // Initialize answers array
      const initialAnswers = testData.questions.map(question => ({
        questionId: question.id,
        selectedOptionIndex: -1
      }));
      setAnswers(initialAnswers);
    }
  }, [id, currentUser, navigate, toast]);

  useEffect(() => {
    let timer: number;
    if (testStarted && !testCompleted && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testStarted, testCompleted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => 
      prev.map(a => a.questionId === questionId ? { ...a, selectedOptionIndex: optionIndex } : a)
    );
  };

  const handleNext = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    if (!test || !currentUser || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        testId: test.id,
        studentId: currentUser.id,
        courseId: test.courseId,
        answers: answers,
        startedAt: Date.now() - ((test.duration * 60) - timeRemaining) * 1000
      };
      
      const result = submitTest(submissionData);
      
      setSubmission(result);
      setTestCompleted(true);
      
      toast({
        title: 'Test submitted',
        description: 'Your test has been submitted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your test.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!test) {
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

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = Math.round((currentQuestionIndex + 1) / test.questions.length * 100);
  const answeredCount = answers.filter(a => a.selectedOptionIndex !== -1).length;

  if (testCompleted && submission) {
    return (
      <PageLayout>
        <div className="container py-10">
          <div className="mb-8">
            <Link to={`/course/${test.courseId}`} className="text-primary hover:underline mb-2 inline-block">
              ← Back to {courseName || 'Course'}
            </Link>
            <h1 className="text-3xl font-bold">{test.title} - Results</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl font-bold mb-4">
                {submission.score} / {test.totalMarks || test.questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <Progress 
                value={submission.score && (test.totalMarks || test.questions.reduce((sum, q) => sum + q.points, 0)) > 0 ? 
                  (submission.score / (test.totalMarks || test.questions.reduce((sum, q) => sum + q.points, 0))) * 100 : 0} 
                className="h-4 w-full max-w-md" 
              />
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4 text-center sm:text-left">
                <p className="text-muted-foreground">
                  Submitted on: {new Date(submission.submittedAt).toLocaleString()}
                </p>
                {submission.timeTaken && (
                  <p className="text-muted-foreground">
                    Time taken: {submission.timeTaken} minutes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            {test.questions.map((question, index) => {
              const userAnswer = submission.answers.find(a => a.questionId === question.id);
              // Use the correct property from the answer if available, otherwise fall back to index comparison
              const isCorrect = userAnswer?.correct !== undefined ? 
                userAnswer.correct : 
                userAnswer?.selectedOptionIndex === question.correctOptionIndex;
              
              return (
                <Card key={question.id} className={isCorrect ? 'border-green-500' : 'border-red-500'}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {isCorrect ? `Correct (+${question.points})` : 'Incorrect (0)'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, i) => {
                        const isUserSelected = i === userAnswer?.selectedOptionIndex;
                        const isCorrectOption = i === question.correctOptionIndex;
                        
                        return (
                          <div 
                            key={i} 
                            className={`p-3 rounded-lg flex items-center ${
                              isCorrectOption && isUserSelected
                                ? 'bg-green-100 border border-green-500' 
                                : isCorrectOption
                                ? 'bg-green-50 border border-green-300' 
                                : isUserSelected
                                ? 'bg-red-100 border border-red-500' 
                                : 'bg-gray-50'
                            }`}
                          >
                            {isUserSelected && (
                              <span className="mr-2 font-bold">
                                {isCorrectOption ? '✓' : '✗'}
                              </span>
                            )}
                            {isCorrectOption && !isUserSelected && (
                              <span className="mr-2 text-green-600">
                                ✓
                              </span>
                            )}
                            <span>{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to={`/course/${test.courseId}`}>
              <Button>Return to Course</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          {!testStarted && (
            <Link to={`/course/${test.courseId}`} className="text-primary hover:underline mb-2 inline-block">
              ← Back to {courseName || 'Course'}
            </Link>
          )}
          <h1 className="text-3xl font-bold">{test.title}</h1>
        </div>
        
        {!testStarted ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{test.description}</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{test.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Questions:</span>
                  <span>{test.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span>{test.totalMarks || test.questions.reduce((sum, q) => sum + q.points, 0)}</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Once started, the test timer cannot be paused.</li>
                  <li>You can navigate between questions using the previous and next buttons.</li>
                  <li>Submit the test when you are finished or before time runs out.</li>
                  <li>Leaving this page will automatically submit your answers.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartTest}>Start Test</Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  Question {currentQuestionIndex + 1} of {test.questions.length}
                </span>
                <Progress value={progress} className="w-32" />
              </div>
              <div className="font-mono text-lg">
                Time: {formatTime(timeRemaining)}
              </div>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{currentQuestion.question}</CardTitle>
                <CardDescription>Points: {currentQuestion.points}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIndex.toString() || ''}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex === test.questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitTest}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Test'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {test.questions.map((_, index) => {
                    const isAnswered = answers[index]?.selectedOptionIndex !== -1;
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <Button
                        key={index}
                        variant={isAnswered ? "default" : "outline"}
                        className={`h-10 w-10 ${isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                  <span>Answered: {answeredCount} of {test.questions.length}</span>
                  <span>Remaining: {test.questions.length - answeredCount}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default MockTest;
