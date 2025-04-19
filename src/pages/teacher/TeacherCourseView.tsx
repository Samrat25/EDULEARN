import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Eye, Film, PlusCircle, CheckCircle } from 'lucide-react';
import { Course, Lecture } from '@/types/course';
import { Assignment } from '@/types/assignment';
import { Test } from '@/types/test';
import { getCourseById, updateCourse } from '@/services/courseService';
import { getAssignmentsByCourseId, getSubmissionsByAssignmentId } from '@/services/assignmentService';
import { getTestsByCourseId, getTestSubmissionsByTestId } from '@/services/testService';
import { getStudentById } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';

const TeacherCourseView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [testSubmissions, setTestSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [completionCount, setCompletionCount] = useState(0);
  
  // New video state
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  useEffect(() => {
    if (id) {
      const courseData = getCourseById(id);
      setCourse(courseData);
      
      if (courseData && courseData.lectures.length > 0) {
        setCurrentLecture(courseData.lectures[0]);
      }
      
      // Get course assignments and tests
      const courseAssignments = getAssignmentsByCourseId(id);
      setAssignments(courseAssignments);
      
      const courseTests = getTestsByCourseId(id);
      setTests(courseTests);
      
      // Get submissions
      const allAssignmentSubmissions = courseAssignments.flatMap(assignment => {
        const submissions = getSubmissionsByAssignmentId(assignment.id);
        return submissions.map(submission => {
          const student = getStudentById(submission.studentId);
          return {
            ...submission,
            assignmentTitle: assignment.title,
            studentName: student?.name || 'Unknown Student',
            checked: submission.grade !== undefined
          };
        });
      });
      setAssignmentSubmissions(allAssignmentSubmissions);
      
      const allTestSubmissions = courseTests.flatMap(test => {
        const submissions = getTestSubmissionsByTestId(test.id);
        return submissions.map(submission => {
          const student = getStudentById(submission.studentId);
          return {
            ...submission,
            testTitle: test.title,
            studentName: student?.name || 'Unknown Student'
          };
        });
      });
      setTestSubmissions(allTestSubmissions);
      
      // Calculate total likes, views, and completions from all lectures
      if (courseData && courseData.lectures.length > 0) {
        const totalLikes = courseData.lectures.reduce((sum, lecture) => sum + (lecture.likes || 0), 0);
        setLikeCount(totalLikes);
        
        // Calculate views based on viewed property
        const totalViews = courseData.lectures.reduce((sum, lecture) => sum + (lecture.viewed ? 1 : 0), 0);
        setViewCount(totalViews > 0 ? totalViews : courseData.lectures.length * 4); // Use real data or fallback to estimate
        
        // Calculate completions based on completed property
        const totalCompletions = courseData.lectures.reduce((sum, lecture) => sum + (lecture.completed ? 1 : 0), 0);
        setCompletionCount(totalCompletions);
      } else {
        setViewCount(0);
        setLikeCount(0);
        setCompletionCount(0);
      }
    }
  }, [id]);

  const handleAddVideo = () => {
    if (!course || !newVideoTitle || !newVideoUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the video title and URL",
        variant: "destructive"
      });
      return;
    }
    
    // Convert regular YouTube URL to embed URL if needed
    let embedUrl = newVideoUrl;
    if (newVideoUrl.includes('youtube.com/watch?v=')) {
      const videoId = newVideoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (newVideoUrl.includes('youtu.be/')) {
      const videoId = newVideoUrl.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  
    const newLecture: Lecture = {
      id: `lecture_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: newVideoTitle,
      description: newVideoDescription,
      videoUrl: embedUrl, // Use the converted URL here
      duration: parseInt(newVideoDuration) || 0,
      order: course.lectures.length + 1
    };
    
    
    const updatedCourse = {
      ...course,
      lectures: [...course.lectures, newLecture]
    };
    
    // Update the course with the new lecture
    const success = updateCourse(course.id, updatedCourse);
    
    if (success) {
      toast({
        title: "Video Added",
        description: `Video "${newVideoTitle}" has been added to the course.`
      });
      
      setCourse(updatedCourse);
      setCurrentLecture(newLecture);
      
      // Reset form
      setNewVideoTitle('');
      setNewVideoDescription('');
      setNewVideoUrl('');
      setNewVideoDuration('');
      setIsAddingVideo(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to add the video. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!course) {
    return (
      <PageLayout>
        <div className="container py-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link to="/teacher/dashboard">
              <Button>Return to Dashboard</Button>
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
          <Link to="/teacher/dashboard" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">Created by you</p>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/teacher/create-assignment?courseId=${course.id}`}
                data-testid="create-assignment-link"
                className="inline-block"
              >
                <Button variant="outline">Create Assignment</Button>
              </Link>
              <Link to={`/teacher/create-test?courseId=${course.id}`}>
                <Button variant="outline">Create Test</Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="relative aspect-video w-full overflow-hidden">
                {currentLecture?.videoUrl ? (
                  <iframe
                    src={currentLecture.videoUrl}
                    title={currentLecture.title}
                    className="absolute h-full w-full"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <p>No video available</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{currentLecture?.title || 'No lecture selected'}</CardTitle>
                <CardDescription>
                  {currentLecture?.duration ? `${currentLecture.duration} minutes` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{currentLecture?.description || 'Select a lecture to view its content.'}</p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="lectures">
              <TabsList>
                <TabsTrigger value="lectures">Lectures</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="add-content">Add Content</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lectures" className="mt-6">
                <div className="space-y-4">
                  {course.lectures.length > 0 ? (
                    course.lectures.map((lecture) => (
                      <Card 
                        key={lecture.id} 
                        className={`cursor-pointer hover:bg-secondary/50 ${currentLecture?.id === lecture.id ? 'border-primary' : ''}`}
                        onClick={() => setCurrentLecture(lecture)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{lecture.title}</CardTitle>
                          <CardDescription>
                            {lecture.duration} minutes
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <p>No lectures available for this course yet.</p>
                      <Button 
                        className="mt-4" 
                        variant="outline" 
                        onClick={() => setIsAddingVideo(true)}
                      >
                        Add Your First Lecture
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="assignments" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Course Assignments</h3>
                    <Link 
                      to={`/teacher/create-assignment?courseId=${course.id}`}
                      data-testid="create-assignment-tab-link"
                      className="inline-block"
                    >
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                    </Link>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    All assignments use multiple choice questions and are automatically checked when students submit.
                  </p>
                  
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <Card key={assignment.id}>
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">
                              {assignment.description}
                            </p>
                            <div className="text-sm">
                              <strong>Submissions:</strong> {assignmentSubmissions.filter(s => s.assignmentId === assignment.id).length}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg border-dashed">
                      <p className="mb-4">No assignments created for this course yet.</p>
                      <Link 
                        to={`/teacher/create-assignment?courseId=${course.id}`}
                        data-testid="create-assignment-empty-link"
                        className="inline-block"
                      >
                        <Button>Create Assignment</Button>
                      </Link>
                    </div>
                  )}
                  
                  {assignmentSubmissions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Assignment Submissions</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Assignment</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead>Submission Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assignmentSubmissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell className="font-medium">{submission.assignmentTitle}</TableCell>
                                <TableCell>{submission.studentName}</TableCell>
                                <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${submission.checked ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {submission.checked ? 'Checked' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setSelectedSubmission(submission)}
                                      >
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader>
                                        <DialogTitle>Assignment Submission</DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <h4 className="font-medium">Assignment</h4>
                                            <p>{submission.assignmentTitle}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-medium">Student</h4>
                                            <p>{submission.studentName}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                          <h4 className="font-medium text-lg mb-4">Question Responses & Feedback</h4>
                                          <div className="space-y-6">
                                            {submission.answers && submission.answers.map((answer: any, index: number) => (
                                              <div key={answer.questionId} className="border p-4 rounded-md">
                                                <div className="flex justify-between items-start">
                                                  <h5 className="font-medium">Question {index + 1}</h5>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Rating:</span>
                                                    <div className="flex">
                                                      {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                          key={star}
                                                          type="button"
                                                          className={`h-5 w-5 ${answer.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                          onClick={() => {
                                                            const updatedAnswers = [...submission.answers];
                                                            updatedAnswers[index].rating = star;
                                                            // This would normally update the submission
                                                            console.log(`Question ${index + 1} rated ${star} stars`);
                                                          }}
                                                        >
                                                          ★
                                                        </button>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                                
                                                <div className="mt-2 mb-4">
                                                  <p className="text-gray-800">{answer.questionText}</p>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <div className="p-3 bg-gray-50 rounded-md">
                                                    <p className="text-sm font-medium text-gray-500">Student's Answer:</p>
                                                    <div className="mt-1">
                                                      {answer.type === 'mcq' ? (
                                                        <div>
                                                          <p className="font-medium">{answer.answer}</p>
                                                          <div className="mt-2 text-sm">
                                                            <span className="text-muted-foreground">Correct Answer: </span>
                                                            <span className="text-green-600 font-medium">{answer.correctAnswer}</span>
                                                          </div>
                                                        </div>
                                                      ) : (
                                                        <p>{answer.answer}</p>
                                                      )}
                                                    </div>
                                                  </div>
                                                  
                                                  <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Question Feedback:</p>
                                                    <Textarea
                                                      placeholder="Provide feedback for this question..."
                                                      value={answer.feedback || ''}
                                                      onChange={(e) => {
                                                        const updatedAnswers = [...submission.answers];
                                                        updatedAnswers[index].feedback = e.target.value;
                                                        // This would normally update the submission
                                                        console.log(`Feedback updated for question ${index + 1}`);
                                                      }}
                                                      className="min-h-[80px] text-sm"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        
                                        <div className="pt-4 border-t">
                                          <h4 className="font-medium mb-2">Overall Feedback</h4>
                                          <Textarea 
                                            placeholder="Provide overall feedback to the student..."
                                            value={submission.feedback || ''}
                                            onChange={(e) => {
                                              // This would normally update the submission feedback
                                              console.log('Feedback updated:', e.target.value);
                                            }}
                                            className="mb-4"
                                          />
                                          <div className="flex items-center gap-4">
                                            <Label htmlFor="grade">Final Grade:</Label>
                                            <Input 
                                              id="grade"
                                              type="number" 
                                              className="w-20"
                                              value={submission.grade || ''}
                                              onChange={(e) => {
                                                // This would normally update the submission grade
                                                console.log('Grade updated:', e.target.value);
                                              }}
                                            />
                                            <span>/ 100</span>
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter className="mt-6">
                                        <Button>Save Feedback</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tests" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Course Tests</h3>
                    <Link to={`/teacher/create-test?courseId=${course.id}`}>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Test
                      </Button>
                    </Link>
                  </div>
                  
                  {tests.length > 0 ? (
                    <div className="space-y-4">
                      {tests.map((test) => (
                        <Card key={test.id}>
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{test.title}</CardTitle>
                            <CardDescription>
                              Duration: {test.duration} minutes
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">
                              {test.description}
                            </p>
                            <div className="text-sm">
                              <strong>Submissions:</strong> {testSubmissions.filter(s => s.testId === test.id).length}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-lg border-dashed">
                      <p className="mb-4">No tests created for this course yet.</p>
                      <Link to={`/teacher/create-test?courseId=${course.id}`}>
                        <Button>Create Test</Button>
                      </Link>
                    </div>
                  )}
                  
                  {testSubmissions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Test Submissions</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Test</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead>Submission Date</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {testSubmissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell className="font-medium">{submission.testTitle}</TableCell>
                                <TableCell>{submission.studentName}</TableCell>
                                <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {submission.score || 'N/A'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                      <DialogHeader>
                                        <DialogTitle>Test Submission - {submission.testTitle}</DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                          <div>
                                            <h4 className="font-medium">Student</h4>
                                            <p>{submission.studentName}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-medium">Submitted</h4>
                                            <p>{new Date(submission.submittedAt).toLocaleString()}</p>
                                          </div>
                                          <div>
                                            <h4 className="font-medium">Time Taken</h4>
                                            <p>{submission.timeTaken || 'N/A'} minutes</p>
                                          </div>
                                        </div>
                                        
                                        <div className="border-t pt-4">
                                          <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-lg">Test Results</h4>
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm text-muted-foreground">Score:</span>
                                              <span className="font-bold text-xl bg-primary/10 px-3 py-1 rounded">
                                                {submission.score || 0}/{submission.totalPossibleScore || 0}
                                              </span>
                                              <span className="text-sm text-muted-foreground ml-1">(
                                                {submission.totalPossibleScore ? Math.round(((submission.score || 0) / submission.totalPossibleScore) * 100) : 0}%
                                              )</span>
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-6">
                                            {submission.answers && submission.answers.map((answer: any, index: number) => (
                                              <div key={answer.questionId} className="border p-4 rounded-md">
                                                <div className="flex justify-between items-start mb-2">
                                                  <h5 className="font-medium text-base">Question {index + 1} <span className="text-sm text-muted-foreground">({answer.points || 0} points)</span></h5>
                                                  <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${answer.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                      {answer.correct ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                      {answer.correct ? answer.points || 0 : 0}/{answer.points || 0}
                                                    </span>
                                                  </div>
                                                </div>
                                                
                                                <p className="mb-4">{answer.questionText}</p>
                                                
                                                {answer.options && (
                                                  <div className="space-y-2 mb-4">
                                                    {answer.options.map((option: string, optIndex: number) => (
                                                      <div 
                                                        key={optIndex}
                                                        className={`p-2 border rounded flex items-center ${option === answer.selectedOption ? 'border-blue-500 bg-blue-50' : ''} ${
                                                          option === answer.correctOption ? 'border-green-500 bg-green-50' : ''
                                                        } ${
                                                          option === answer.selectedOption && option !== answer.correctOption ? 'border-red-500 bg-red-50' : ''
                                                        }`}
                                                      >
                                                        <div className="mr-2">
                                                          {option === answer.selectedOption && option === answer.correctOption && (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                          )}
                                                          {option === answer.selectedOption && option !== answer.correctOption && (
                                                            <span className="text-red-500 font-bold">✗</span>
                                                          )}
                                                          {option === answer.correctOption && option !== answer.selectedOption && (
                                                            <span className="text-green-500 font-bold">✓</span>
                                                          )}
                                                        </div>
                                                        <span>{option}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-gray-50 rounded-md">
                                                  <div>
                                                    <span className="text-sm font-medium">Student selected: </span>
                                                    <span className={answer.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                      {answer.selectedOption}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <span className="text-sm font-medium">Correct answer: </span>
                                                    <span className="text-green-600 font-medium">{answer.correctOption}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="add-content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Video to Course</CardTitle>
                    <CardDescription>Upload a new video lecture to this course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="videoTitle">Video Title *</Label>
                      <Input
                        id="videoTitle"
                        placeholder="Introduction to the course"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL (YouTube) *</Label>
                      <Input
                        id="videoUrl"
                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can use regular YouTube URLs, they will be converted to embed format automatically
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoDuration">Duration (minutes) *</Label>
                      <Input
                        id="videoDuration"
                        placeholder="15"
                        type="number"
                        value={newVideoDuration}
                        onChange={(e) => setNewVideoDuration(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoDescription">Description</Label>
                      <Textarea
                        id="videoDescription"
                        className="min-h-[100px]"
                        placeholder="Enter a description for this video"
                        value={newVideoDescription}
                        onChange={(e) => setNewVideoDescription(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddVideo}>Add Video</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </div>
                <div>
                  <h3 className="font-medium">Course Statistics</h3>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <Film className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xl font-semibold">{course.lectures.length}</p>
                      <p className="text-xs text-muted-foreground">Videos</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <Eye className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xl font-semibold">{viewCount}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <ThumbsUp className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xl font-semibold">{likeCount}</p>
                      <p className="text-xs text-muted-foreground">Total Likes</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xl font-semibold">{completionCount}</p>
                      <p className="text-xs text-muted-foreground">Completions</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">Course Content</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Lectures</span>
                      <span>{course.lectures.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Assignments</span>
                      <span>{assignments.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tests</span>
                      <span>{tests.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Students</span>
                      <span>{course.students.length}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TeacherCourseView;