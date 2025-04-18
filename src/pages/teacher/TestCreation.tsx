
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { getCoursesByTeacherId } from '@/services/courseService';
import { createTest } from '@/services/testService';
import { TestQuestion } from '@/types/test';
import { Course } from '@/types/course';

interface QuestionInput {
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

const TestCreation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState(30); // Default 30 minutes
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      points: 10
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    const teacherCourses = getCoursesByTeacherId(currentUser.id);
    setCourses(teacherCourses);
    
    if (teacherCourses.length > 0) {
      setCourseId(teacherCourses[0].id);
    }
  }, [currentUser]);

  const handleQuestionChange = (index: number, field: keyof QuestionInput, value: string | number | string[]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: [...updatedQuestions[questionIndex].options, '']
    };
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (questions[questionIndex].options.length <= 2) {
      toast({
        title: 'Cannot remove option',
        description: 'A question must have at least 2 options.',
        variant: 'destructive',
      });
      return;
    }
    
    const updatedQuestions = [...questions];
    const updatedOptions = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    
    // If removing the correct option, reset to the first option
    let correctIndex = updatedQuestions[questionIndex].correctOptionIndex;
    if (optionIndex === correctIndex) {
      correctIndex = 0;
    } else if (optionIndex < correctIndex) {
      correctIndex -= 1;
    }
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions,
      correctOptionIndex: correctIndex
    };
    
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        points: 10
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a test.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title || !description || !courseId || duration <= 0) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate questions
    const invalidQuestions = questions.some(q => 
      !q.question || 
      q.options.some(opt => !opt) || 
      q.correctOptionIndex < 0 || 
      q.correctOptionIndex >= q.options.length
    );
    
    if (invalidQuestions) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all question and option details properly.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add IDs to questions
      const questionsWithIds = questions.map(q => ({
        ...q,
        id: `question_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      }));
      
      const testData = {
        title,
        description,
        courseId,
        duration,
        questions: questionsWithIds
      };
      
      const createdTest = createTest(testData);
      
      toast({
        title: 'Test created',
        description: 'Your test has been created successfully.',
      });
      
      navigate('/teacher/dashboard');
    } catch (error) {
      toast({
        title: 'Error creating test',
        description: 'There was an error creating your test.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Test</h1>
          <p className="text-muted-foreground">Create a mock test for your students</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Enter the basic information about this test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={courseId}
                  onValueChange={setCourseId}
                  required
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Test Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Midterm Exam: Web Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Test Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions and details about the test..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Questions</CardTitle>
              <CardDescription>Add multiple-choice questions for your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Question {questionIndex + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                      disabled={questions.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${questionIndex}`}>Question *</Label>
                      <Textarea
                        id={`question-${questionIndex}`}
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Options *</Label>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`correct-${questionIndex}-${optionIndex}`}
                                name={`correct-${questionIndex}`}
                                checked={optionIndex === question.correctOptionIndex}
                                onChange={() => handleQuestionChange(questionIndex, 'correctOptionIndex', optionIndex)}
                                className="h-4 w-4 border-primary text-primary"
                              />
                              <Label 
                                htmlFor={`correct-${questionIndex}-${optionIndex}`}
                                className="text-sm font-normal"
                              >
                                Correct
                              </Label>
                            </div>
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(questionIndex, optionIndex)}
                              disabled={question.options.length <= 2}
                              className="h-10 w-10 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                          className="mt-2"
                        >
                          Add Option
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`points-${questionIndex}`}>Points *</Label>
                      <Input
                        id={`points-${questionIndex}`}
                        type="number"
                        min="1"
                        max="100"
                        value={question.points}
                        onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 10)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className="w-full"
              >
                Add Another Question
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Test...' : 'Create Test'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default TestCreation;
