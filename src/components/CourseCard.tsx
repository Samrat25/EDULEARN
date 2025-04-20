
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/course';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
}

export function CourseCard({ course, isEnrolled = false, onEnroll }: CourseCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={course.thumbnail || "/placeholder.svg"} 
          alt={course.title} 
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
          {isEnrolled && <Badge>Enrolled</Badge>}
        </div>
        <CardDescription className="line-clamp-2">
          By {course.teacherName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        {isEnrolled ? (
          <Link to={`/course/${course.id}`} className="w-full">
            <Button className="w-full">Continue Learning</Button>
          </Link>
        ) : (
          <Link to="/login"><Button 
            className="w-full" 
            onClick={() => onEnroll && onEnroll(course.id)}
          >
            Enroll Now
          </Button></Link>
        )}
      </CardFooter>
    </Card>
  );
}
