import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getAllCourses } from '@/services/courseService';
import { CourseCard } from '@/components/CourseCard';
import { useEffect, useState } from 'react';
import { Course } from '@/types/course';
import HeroBackground from '@/components/HeroBackground';

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // In a real app, you'd have an API call for featured courses
    const courses = getAllCourses();
    setFeaturedCourses(courses.slice(0, 3)); // Just get first 3 for featured section
    setIsMounted(true); // Mark component as mounted
  }, []);

  return (
    <PageLayout>
      {/* Hero Section with optimized background */}
      <section className="relative dark-gradient-bg py-20 md:py-28 overflow-hidden min-h-[600px] flex items-center">
        {/* Keep only the main 3D background for better performance */}
        <HeroBackground />
        
        {/* Animated overlays - kept simple */}
        <div className="hero-gradient animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-black/20 z-[1]"></div>
        
        {/* Light streaks effect - reduced to just 3 */}
        <div className="absolute inset-0 z-[1] overflow-hidden opacity-10">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-px bg-white animate-float" 
              style={{
                width: `${Math.random() * 40 + 10}%`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.25,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 5 + 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Content overlay */}
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white drop-shadow-md opacity-0 animate-slide-up">
                  <span className="animate-text-shimmer">Learn, Connect, Thrive</span>
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl drop-shadow opacity-0 animate-slide-up delay-200">
                  Our platform connects students with teachers for a personalized learning experience.
                  Enroll in courses, complete assignments, and test your knowledge.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row opacity-0 animate-slide-up delay-400">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-primary text-white hover:bg-primary/90 shadow-lg transition-all hover:shadow-primary/40 hover:shadow-xl animate-glow"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary text-white hover:bg-primary/10 backdrop-blur-sm transition-all hover:shadow-primary/20 hover:shadow-lg"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center opacity-0 animate-slide-up delay-300">
              <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-primary/20 max-w-md hover:bg-gray-800/50 transition-all duration-500 transform hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl animate-float">
                <img 
                  src="/Logo.png" 
                  alt="EduLearn Logo" 
                  className="aspect-auto overflow-hidden object-contain object-center max-h-80 w-full"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Courses
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover our most popular courses and start learning today.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-lg text-muted-foreground">No courses available yet.</p>
                {/* Demo data creation button - only for development */}
                <Button 
                  className="mt-4"
                  onClick={() => {
                    // Create demo data
                    const demoCourses = [
                      {
                        id: "1",
                        title: "Introduction to Programming",
                        description: "Learn the basics of programming with this comprehensive course for beginners.",
                        teacherId: "teacher1",
                        teacherName: "Dr. Alan Smith",
                        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
                        lectures: [
                          {
                            id: "l1",
                            title: "Getting Started",
                            description: "Introduction to programming concepts",
                            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                            duration: 45,
                            order: 1
                          }
                        ],
                        assignments: [],
                        tests: [],
                        students: [],
                        createdAt: Date.now()
                      },
                      {
                        id: "2",
                        title: "Advanced Mathematics",
                        description: "Deep dive into calculus, linear algebra, and statistical methods.",
                        teacherId: "teacher2",
                        teacherName: "Prof. Mary Johnson",
                        thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                        lectures: [],
                        assignments: [],
                        tests: [],
                        students: [],
                        createdAt: Date.now()
                      },
                      {
                        id: "3",
                        title: "Digital Marketing Essentials",
                        description: "Master the fundamentals of digital marketing in this practical course.",
                        teacherId: "teacher3",
                        teacherName: "James Wilson",
                        thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
                        lectures: [],
                        assignments: [],
                        tests: [],
                        students: [],
                        createdAt: Date.now()
                      }
                    ];
                    localStorage.setItem('courses', JSON.stringify(demoCourses));
                    setFeaturedCourses(demoCourses);
                  }}
                >
                  Load Demo Courses
                </Button>
              </div>
            )}
          </div>
          <div className="mt-12 flex justify-center">
            <Link to="/courses">
              <Button size="lg" variant="outline">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary/10 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Us
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform offers the best learning experience for students and teachers.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                  <path d="M12 13v8" />
                  <path d="M5 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Interactive Learning</h3>
              <p className="text-center text-muted-foreground">
                Engage with video lectures, assignments, and interactive tests.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Expert Teachers</h3>
              <p className="text-center text-muted-foreground">
                Learn from experienced educators in various fields.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Platform</h3>
              <p className="text-center text-muted-foreground">
                Your data is safe and secure on our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Start Learning?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Join thousands of students who are already learning on our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/register">
                <Button size="lg">Create an Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
