
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Course } from '@/types/course';
import { getAllCourses, getEnrolledCourses, enrollStudent } from '@/services/courseService';
import { getSubmissionsByStudentId } from '@/services/assignmentService';
import { getTestSubmissionsByStudentId } from '@/services/testService';
import { useToast } from '@/components/ui/use-toast';

const StudentDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [activeTab, setActiveTab] = useState("my-courses");

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'student') {
      navigate('/login');
      return;
    }

    // Fetch student data
    if (currentUser) {
      const enrolled = getEnrolledCourses(currentUser.id);
      setEnrolledCourses(enrolled);
      
      const all = getAllCourses();
      const available = all.filter(course => !enrolled.some(ec => ec.id === course.id));
      setAvailableCourses(available);

      // Count pending assignments and tests
      const assignments = getSubmissionsByStudentId(currentUser.id);
      setAssignmentCount(assignments.length);

      const tests = getTestSubmissionsByStudentId(currentUser.id);
      setTestCount(tests.length);
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleEnroll = (courseId: string) => {
    if (!currentUser) return;
    
    const success = enrollStudent(courseId, currentUser.id);
    
    if (success) {
      toast({
        title: 'Enrollment Successful',
        description: 'You have successfully enrolled in this course.',
      });
      
      // Update course lists
      const enrolled = getEnrolledCourses(currentUser.id);
      setEnrolledCourses(enrolled);
      
      const all = getAllCourses();
      const available = all.filter(course => !enrolled.some(ec => ec.id === course.id));
      setAvailableCourses(available);
    } else {
      toast({
        title: 'Enrollment Failed',
        description: 'There was an error enrolling in this course.',
        variant: 'destructive',
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser?.name}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableCourses.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="available-courses">Available Courses</TabsTrigger>
            </TabsList>
            <TabsContent value="my-courses" className="mt-6">
              {enrolledCourses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course) => (
                    <CourseCard key={course.id} course={course} isEnrolled={true} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                  <h3 className="mb-2 text-xl font-semibold">No courses yet</h3>
                  <p className="mb-6 text-center text-muted-foreground">
                    You haven't enrolled in any courses yet. Check out the available courses.
                  </p>
                  <Button onClick={() => handleTabChange("available-courses")}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="available-courses" className="mt-6">
              {availableCourses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {availableCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                  <h3 className="mb-2 text-xl font-semibold">No courses available</h3>
                  <p className="text-center text-muted-foreground">
                    There are no additional courses available at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentDashboard;
