
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Course, Lecture } from '@/types/course';
import { Assignment } from '@/types/assignment';
import { Test } from '@/types/test';
import { getCourseById } from '@/services/courseService';
import { getAssignmentsByCourseId } from '@/services/assignmentService';
import { getTestsByCourseId } from '@/services/testService';

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);

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
      
      // Load watched videos from local storage
      const savedWatchedVideos = localStorage.getItem(`watchedVideos-${id}`);
      if (savedWatchedVideos) {
        const parsed = JSON.parse(savedWatchedVideos);
        setWatchedVideos(parsed);
        
        // Calculate progress percentage
        if (courseData && courseData.lectures.length > 0) {
          const progress = (parsed.length / courseData.lectures.length) * 100;
          setProgressPercent(progress);
        }
      }
    }
  }, [id]);

  if (!course) {
    return (
      <PageLayout>
        <div className="container py-10">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link to="/student/dashboard">
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
          <Link to="/student/dashboard" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Instructor: {course.teacherName}</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <div className="relative aspect-video w-full overflow-hidden">
                {currentLecture?.videoUrl ? (
                  <iframe
                    ref={videoRef}
                    src={currentLecture.videoUrl}
                    title={currentLecture.title}
                    className="absolute h-full w-full"
                    frameBorder="0"
                    allowFullScreen
                    onEnded={() => {
                      if (currentLecture && !watchedVideos.includes(currentLecture.id)) {
                        const updatedWatched = [...watchedVideos, currentLecture.id];
                        setWatchedVideos(updatedWatched);
                        localStorage.setItem(`watchedVideos-${id}`, JSON.stringify(updatedWatched));
                        
                        // Update progress percentage
                        if (course && course.lectures.length > 0) {
                          const progress = (updatedWatched.length / course.lectures.length) * 100;
                          setProgressPercent(progress);
                        }
                      }
                    }}
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
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{lecture.title}</CardTitle>
                            <CardDescription>
                              {lecture.duration} minutes
                            </CardDescription>
                          </div>
                          {watchedVideos.includes(lecture.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardHeader>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <p>No lectures available for this course yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="assignments" className="mt-6">
                <div className="space-y-4">
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                      <Link to={`/assignment/${assignment.id}`} key={assignment.id}>
                        <Card className="cursor-pointer hover:bg-secondary/50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <p>No assignments available for this course yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="tests" className="mt-6">
                <div className="space-y-4">
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <Link to={`/mock-test/${test.id}`} key={test.id}>
                        <Card className="cursor-pointer hover:bg-secondary/50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{test.title}</CardTitle>
                            <CardDescription>
                              Duration: {test.duration} minutes
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <p>No tests available for this course yet.</p>
                    </div>
                  )}
                </div>
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
                  <h3 className="font-medium">Progress</h3>
                  <div className="mt-2 flex justify-center">
                    <div className="relative h-20 w-20">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          className="fill-none stroke-secondary"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                          className="fill-none stroke-primary"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * progressPercent / 100)}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {watchedVideos.length}/{course.lectures.length} videos completed
                  </p>
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

export default CourseView;
