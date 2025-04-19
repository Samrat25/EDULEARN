import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CourseCard } from '@/components/CourseCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Course } from '@/types/course';
import { getCoursesByTeacherId } from '@/services/courseService';
import { getAllAssignments, getAssignmentsByCourseId, getSubmissionsByAssignmentId, getAllSubmissions } from '@/services/assignmentService';
import { getAllTests, getTestsByCourseId, getTestSubmissionsByTestId, getAllTestSubmissions } from '@/services/testService';
import { getChatThreadsByTeacherId } from '@/services/chatService';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStudentById } from '@/services/userService';
import { MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TeacherDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeTab, setActiveTab] = useState('courses');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [testSubmissions, setTestSubmissions] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'teacher') {
      navigate('/login');
      return;
    }

    // Fetch teacher data
    if (currentUser) {
      const courses = getCoursesByTeacherId(currentUser.id);
      setMyCourses(courses);
      
      // Count total enrolled students
      const studentCount = courses.reduce((acc, course) => acc + course.students.length, 0);
      setTotalStudents(studentCount);

      // Get assignments related to the teacher's courses
      const teacherCourseIds = courses.map(course => course.id);
      const allAssignments = getAllAssignments();
      const teacherAssignments = allAssignments.filter(assignment => 
        teacherCourseIds.includes(assignment.courseId)
      );
      setAssignments(teacherAssignments);
      
      // Get submissions for those assignments
      const allAssignmentSubmissions = teacherAssignments.flatMap(assignment => 
        getSubmissionsByAssignmentId(assignment.id)
      );
      
      // Enrich with student names and assignment titles for display
      const enrichedSubmissions = allAssignmentSubmissions.map(submission => {
        const assignment = teacherAssignments.find(a => a.id === submission.assignmentId);
        const student = getStudentById(submission.studentId);
        
        return {
          ...submission,
          assignmentTitle: assignment?.title || 'Unknown Assignment',
          studentName: student?.name || 'Unknown Student',
          checked: submission.grade !== undefined
        };
      });
      
      setAssignmentSubmissions(enrichedSubmissions);

      // Get tests related to the teacher's courses
      const allTests = getAllTests();
      const teacherTests = allTests.filter(test => 
        teacherCourseIds.includes(test.courseId)
      );
      setTests(teacherTests);
      
      // Get submissions for those tests
      const allTestSubmissions = teacherTests.flatMap(test =>
        getTestSubmissionsByTestId(test.id)
      );
      
      // Enrich with student names and test titles for display
      const enrichedTestSubmissions = allTestSubmissions.map(submission => {
        const test = teacherTests.find(t => t.id === submission.testId);
        const student = getStudentById(submission.studentId);
        
        return {
          ...submission,
          testTitle: test?.title || 'Unknown Test',
          studentName: student?.name || 'Unknown Student'
        };
      });
      
      setTestSubmissions(enrichedTestSubmissions);
      
      // Test results are already included in the test submissions
      setTestResults(allTestSubmissions);
      
      // Get chat threads
      const threads = getChatThreadsByTeacherId(currentUser.id);
      setChatThreads(threads);
      
      // Count unread messages
      const unread = threads.reduce((count, thread) => count + thread.unreadCount, 0);
      setUnreadMessageCount(unread);
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleAddVideo = () => {
    if (!selectedCourse || !newVideoUrl || !newVideoTitle) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the video URL and title",
        variant: "destructive"
      });
      return;
    }

    // Add video logic would go here in a real implementation
    toast({
      title: "Video Added",
      description: `Video ${newVideoTitle} added to ${selectedCourse.title}`,
    });

    // Reset form
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDuration('');
    setNewVideoDescription('');
    setSelectedCourse(null);
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser?.name}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/teacher/create-course">
              <Button>Create Course</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assignment Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Test Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
            <Link to="/teacher/chat">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Student Messages
                  {unreadMessageCount > 0 && (
                    <Badge variant="default" className="ml-1">
                      {unreadMessageCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatThreads.length}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View Messages
                </Button>
              </CardFooter>
            </Link>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
              <h2 className="mb-6 text-2xl font-bold">My Courses</h2>
          {myCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Link to={`/teacher/course/${course.id}`} key={course.id} className="block">
                  <Card className="h-full overflow-hidden hover:shadow-md transition-all">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={course.thumbnail || "/placeholder.svg"} 
                        alt={course.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription>
                        {course.students.length} students enrolled
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {course.lectures.length} lectures
                      </span>
                      <Button variant="outline" size="sm">Manage</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
              <h3 className="mb-2 text-xl font-semibold">No courses yet</h3>
              <p className="mb-6 text-center text-muted-foreground">
                You haven't created any courses yet. Create your first course to get started.
              </p>
              <Link to="/teacher/create-course">
                <Button>Create Course</Button>
              </Link>
            </div>
          )}
            </TabsContent>
            
            <TabsContent value="assignments">
              <h2 className="mb-6 text-2xl font-bold">Assignment Submissions</h2>
              {assignmentSubmissions.length > 0 ? (
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
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                  <h3 className="mb-2 text-xl font-semibold">No submissions yet</h3>
                  <p className="text-center text-muted-foreground">
                    There are no assignment submissions to check yet.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tests">
              <h2 className="mb-6 text-2xl font-bold">Test Submissions</h2>
              {testSubmissions.length > 0 ? (
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
                      {testSubmissions.map((submission, index) => (
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
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                  <h3 className="mb-2 text-xl font-semibold">No test submissions yet</h3>
                  <p className="text-center text-muted-foreground">
                    There are no test submissions to check yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-content">
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Video to Course</CardTitle>
                  <CardDescription>Upload a new video to an existing course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseSelect">Select Course</Label>
                    <select 
                      id="courseSelect"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      onChange={(e) => {
                        const course = myCourses.find(c => c.id === e.target.value);
                        setSelectedCourse(course);
                      }}
                      value={selectedCourse?.id || ''}
                    >
                      <option value="">Select a course...</option>
                      {myCourses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      placeholder="https://example.com/video"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">Video Title</Label>
                    <Input
                      id="videoTitle"
                      placeholder="Introduction to the course"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoDuration">Duration (minutes)</Label>
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
                    <textarea
                      id="videoDescription"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
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
      </div>
    </PageLayout>
  );
};

export default TeacherDashboard;
