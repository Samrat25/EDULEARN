
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { getCoursesByTeacherId } from '@/services/courseService';
import { createAssignment } from '@/services/assignmentService';
import { AssignmentQuestion } from '@/types/assignment';
import { Course } from '@/types/course';

const AssignmentCreation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<Omit<AssignmentQuestion, 'id'>[]>([
    {
      question: '',
      questionType: 'text',
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

  const handleQuestionChange = (index: number, field: keyof Omit<AssignmentQuestion, 'id'>, value: string | number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: field === 'points' ? Number(value) : value
    };
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        questionType: 'text',
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
        description: 'Please log in to create an assignment.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title || !description || !courseId || !dueDate) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate questions
    if (questions.some(q => !q.question)) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all question details.',
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
      
      const assignmentData = {
        title,
        description,
        courseId,
        dueDate: new Date(dueDate).getTime(),
        questions: questionsWithIds
      };
      
      const createdAssignment = createAssignment(assignmentData);
      
      toast({
        title: 'Assignment created',
        description: 'Your assignment has been created successfully.',
      });
      
      navigate('/teacher/dashboard');
    } catch (error) {
      toast({
        title: 'Error creating assignment',
        description: 'There was an error creating your assignment.',
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
          <h1 className="text-3xl font-bold">Create New Assignment</h1>
          <p className="text-muted-foreground">Create an assignment for your students</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>Enter the basic information about this assignment</CardDescription>
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
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Week 1 Assignment: HTML Basics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide instructions and details about the assignment..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Assignment Questions</CardTitle>
              <CardDescription>Add questions for your assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      disabled={questions.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${index}`}>Question *</Label>
                      <Textarea
                        id={`question-${index}`}
                        value={question.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <RadioGroup
                        value={question.questionType}
                        onValueChange={(value) => handleQuestionChange(index, 'questionType', value as 'text' | 'file')}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="text" id={`text-${index}`} />
                          <Label htmlFor={`text-${index}`} className="font-normal">
                            Text Response
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="file" id={`file-${index}`} />
                          <Label htmlFor={`file-${index}`} className="font-normal">
                            File Upload
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`points-${index}`}>Points *</Label>
                      <Input
                        id={`points-${index}`}
                        type="number"
                        min="1"
                        max="100"
                        value={question.points}
                        onChange={(e) => handleQuestionChange(index, 'points', e.target.value)}
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
              {isSubmitting ? 'Creating Assignment...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default AssignmentCreation;
