
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ThumbsUp, Heart } from 'lucide-react';
import { Course, Lecture } from '@/types/course';
import { Assignment } from '@/types/assignment';
import { Test } from '@/types/test';
import { getCourseById, updateCourse } from '@/services/courseService';
import { getAssignmentsByCourseId } from '@/services/assignmentService';
import { getTestsByCourseId } from '@/services/testService';
import { Checkbox } from '@/components/ui/checkbox';

const CourseView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
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
      }
      
      // Load completed videos from local storage
      const savedCompletedVideos = localStorage.getItem(`completedVideos-${id}`);
      if (savedCompletedVideos) {
        const parsed = JSON.parse(savedCompletedVideos);
        setCompletedVideos(parsed);
        
        // Calculate progress percentage based on completed videos
        if (courseData && courseData.lectures.length > 0) {
          const progress = (parsed.length / courseData.lectures.length) * 100;
          setProgressPercent(progress);
        }
      }
      
      // Load liked videos from local storage
      const savedLikedVideos = localStorage.getItem(`likedVideos-${id}`);
      if (savedLikedVideos) {
        const parsed = JSON.parse(savedLikedVideos);
        setLikedVideos(parsed);
        
        // Update likes count in course data if needed
        if (courseData) {
          let needsUpdate = false;
          courseData.lectures.forEach(lecture => {
            if (parsed.includes(lecture.id) && !lecture.likes) {
              lecture.likes = (lecture.likes || 0) + 1;
              needsUpdate = true;
            }
          });
          
          if (needsUpdate) {
            updateCourse(courseData.id, courseData);
          }
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
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">{currentLecture?.title}</h2>
              <p className="text-sm text-muted-foreground">{currentLecture?.description}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">Duration: {currentLecture?.duration} minutes</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Checkbox 
                      id={`complete-${currentLecture?.id}`}
                      checked={completedVideos.includes(currentLecture?.id || '')}
                      onCheckedChange={(checked) => {
                        if (!currentLecture) return;
                        
                        const newCompletedVideos = checked 
                          ? [...completedVideos, currentLecture.id]
                          : completedVideos.filter(id => id !== currentLecture.id);
                        
                        setCompletedVideos(newCompletedVideos);
                        localStorage.setItem(`completedVideos-${id}`, JSON.stringify(newCompletedVideos));
                        
                        // Update progress percentage
                        if (course && course.lectures.length > 0) {
                          const progress = (newCompletedVideos.length / course.lectures.length) * 100;
                          setProgressPercent(progress);
                        }
                      }}
                    />
                    <label htmlFor={`complete-${currentLecture?.id}`} className="text-sm cursor-pointer">Mark as completed</label>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center gap-1 ${likedVideos.includes(currentLecture?.id || '') ? 'text-red-500' : ''}`}
                    onClick={() => {
                      if (!currentLecture) return;
                      
                      // Toggle like status
                      const isLiked = likedVideos.includes(currentLecture.id);
                      const newLikedVideos = isLiked
                        ? likedVideos.filter(id => id !== currentLecture.id)
                        : [...likedVideos, currentLecture.id];
                      
                      setLikedVideos(newLikedVideos);
                      localStorage.setItem(`likedVideos-${id}`, JSON.stringify(newLikedVideos));
                      
                      // Update course likes if needed
                      if (course) {
                        const updatedCourse = {...course};
                        const lectureIndex = updatedCourse.lectures.findIndex(l => l.id === currentLecture.id);
                        
                        if (lectureIndex >= 0) {
                          // Get current likes count or default to 0
                          const currentLikes = updatedCourse.lectures[lectureIndex].likes || 0;
                          
                          // If currently liked, decrement (but don't go below 0)
                          // If not currently liked, increment by 1
                          updatedCourse.lectures[lectureIndex].likes = isLiked
                            ? Math.max(0, currentLikes - 1)
                            : currentLikes + 1;
                          
                          setCourse(updatedCourse);
                          updateCourse(updatedCourse.id, updatedCourse);
                        }
                      }
                    }}
                  >
                    <Heart className={`h-4 w-4 ${likedVideos.includes(currentLecture?.id || '') ? 'fill-current' : ''}`} />
                    <span>Like</span>
                  </Button>
                </div>
              </div>
            </div>

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
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Your Progress</h3>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="relative h-24 w-24">
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        {/* Background circle */}
                        <circle
                          className="fill-none stroke-muted-foreground/20"
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
                    {completedVideos.length}/{course.lectures.length} videos completed
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
