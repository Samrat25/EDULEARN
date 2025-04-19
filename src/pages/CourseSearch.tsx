import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAllCourses } from '@/services/courseService';
import { Course } from '@/types/course';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, BookOpen, User, Clock, Filter } from 'lucide-react';
import { 
  Sheet,
  SheetContent, 
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

const CourseSearch = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 100]);
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  
  // Get all courses
  useEffect(() => {
    const fetchedCourses = getAllCourses();
    setCourses(fetchedCourses);
    setFilteredCourses(fetchedCourses);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = [...courses];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(course => course.difficulty === selectedDifficulty);
    }
    
    // Apply duration filter
    result = result.filter(course => {
      const totalDuration = course.lectures.reduce((sum, lecture) => sum + (lecture.duration || 0), 0);
      return totalDuration >= durationRange[0] && totalDuration <= durationRange[1];
    });
    
    // Apply price filter
    if (showOnlyFree) {
      result = result.filter(course => !course.price || course.price === 0);
    }
    
    setFilteredCourses(result);
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, durationRange, showOnlyFree]);
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setDurationRange([0, 100]);
    setShowOnlyFree(false);
  };
  
  const getCourseDuration = (course: Course) => {
    return course.lectures.reduce((sum, lecture) => sum + (lecture.duration || 0), 0);
  };
  
  const difficultyColorMap: Record<string, string> = {
    'beginner': 'bg-green-100 text-green-800',
    'intermediate': 'bg-blue-100 text-blue-800',
    'advanced': 'bg-purple-100 text-purple-800'
  };
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Find Your Next Course</h1>
          <p className="text-muted-foreground mt-2">
            Browse through our collection of courses and find the perfect one for your learning journey
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Courses</SheetTitle>
                  <SheetDescription>
                    Narrow down your search with these filters
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="language">Languages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Duration (in minutes)</Label>
                      <span className="text-sm text-muted-foreground">
                        {durationRange[0]} - {durationRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 100]}
                      max={100}
                      step={5}
                      value={durationRange}
                      onValueChange={(value) => setDurationRange(value as [number, number])}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free"
                      checked={showOnlyFree}
                      onCheckedChange={(checked) => setShowOnlyFree(checked as boolean)}
                    />
                    <label
                      htmlFor="free"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show only free courses
                    </label>
                  </div>
                </div>
                
                <SheetFooter className="flex justify-between gap-2 sm:justify-between">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <Button variant="outline" onClick={resetFilters}>Clear</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Link key={course.id} to={`/course/${course.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {course.teacherName || 'Unknown Teacher'}
                        </CardDescription>
                      </div>
                      
                      {course.difficulty && (
                        <Badge className={difficultyColorMap[course.difficulty] || 'bg-gray-100'}>
                          {course.difficulty}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.lectures.length} lectures</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{getCourseDuration(course)} mins</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{course.students.length} students</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 border-t">
                    <div className="w-full flex justify-between items-center">
                      <div>
                        {course.price ? (
                          <span className="font-semibold">${course.price.toFixed(2)}</span>
                        ) : (
                          <span className="text-green-600 font-semibold">Free</span>
                        )}
                      </div>
                      <Button variant="outline" size="sm">View Course</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2">
                Try adjusting your search or filter criteria to find the course you're looking for.
              </p>
              <Button className="mt-4" onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseSearch;
