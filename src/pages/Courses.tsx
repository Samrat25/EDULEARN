import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { getAllCourses } from '@/services/courseService';
import { CourseCard } from '@/components/CourseCard';
import { Course } from '@/types/course';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    // Fetch all courses
    const allCourses = getAllCourses();
    setCourses(allCourses);
    setFilteredCourses(allCourses);
  }, []);

  useEffect(() => {
    // Apply filters when search query or filters change
    let result = [...courses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.teacherName.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(course => course.category === categoryFilter);
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(course => course.difficulty === difficultyFilter);
    }

    setFilteredCourses(result);
  }, [searchQuery, categoryFilter, difficultyFilter, courses]);

  // Extract unique categories from courses
  const categories = ['all', ...new Set(courses.filter(course => course.category).map(course => course.category))];
  
  return (
    <PageLayout>
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All Courses
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl dark:text-gray-400">
                Browse our complete collection of courses and start your learning journey today.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium">No courses found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setDifficultyFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Courses;
