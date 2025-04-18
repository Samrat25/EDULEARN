
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Course } from '@/types/course';
import { getCoursesByTeacherId } from '@/services/courseService';

const TeacherDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

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
    }
  }, [currentUser, isAuthenticated, navigate]);

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
            <Link to="/teacher/create-assignment">
              <Button variant="outline">Create Assignment</Button>
            </Link>
            <Link to="/teacher/create-test">
              <Button variant="outline">Create Test</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-bold">My Courses</h2>
          {myCourses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Link to={`/course/${course.id}`} key={course.id} className="block">
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
        </div>
      </div>
    </PageLayout>
  );
};

export default TeacherDashboard;
