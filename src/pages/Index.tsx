import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getAllCourses } from '@/services/courseService';
import { CourseCard } from '@/components/CourseCard';
import { useEffect, useState, useRef } from 'react';
import { Course } from '@/types/course';
import HeroBackground from '@/components/HeroBackground';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const Index = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 });
  
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const whyChooseInView = useInView(whyChooseRef, { once: true, amount: 0.2 });
  
  const testimonialRef = useRef<HTMLDivElement>(null);
  const testimonialInView = useInView(testimonialRef, { once: true, amount: 0.2 });
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    // In a real app, you'd have an API call for featured courses
    const courses = getAllCourses();
    setFeaturedCourses(courses.slice(0, 3)); // Just get first 3 for featured section
    setIsMounted(true); // Mark component as mounted
  }, []);

  const featuredVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const featureItemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <PageLayout>
      {/* Hero Section with optimized background */}
      <section className="relative dark-gradient-bg py-20 md:py-28 overflow-hidden min-h-[600px] flex items-center">
        {/* Keep only the main 3D background for better performance */}
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <HeroBackground />
        </motion.div>
        
        {/* Animated overlays - kept simple */}
        <div className="hero-gradient animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        
        {/* Light streaks effect */}
        <div className="absolute inset-0 z-[1] overflow-hidden opacity-10">
          {[...Array(5)].map((_, i) => (
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
            <motion.div 
              className="flex flex-col justify-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl drop-shadow-md"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.span
                    className="text-white block"
                    animate={{ 
                      textShadow: ["0 0 4px #8b5cf6", "0 0 15px #8b5cf6", "0 0 4px #8b5cf6"]
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    Learn, Connect, Thrive
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-white/90 md:text-xl drop-shadow"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Our platform connects students with teachers for a personalized learning experience.
                  Enroll in courses, complete assignments, and test your knowledge.
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col gap-3 min-[400px]:flex-row" 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
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
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-primary/20 max-w-md hover:bg-gray-800/50 transition-all duration-500 transform hover:shadow-primary/20 hover:shadow-2xl"
                whileHover={{ scale: 1.05 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                  duration: 0.3
                }}
              >
                <img 
                  src="/Logo.png" 
                  alt="EduLearn Logo" 
                  className="aspect-auto overflow-hidden object-contain object-center max-h-80 w-full"
                  width={400}
                  height={400}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section ref={featuredRef} className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Courses
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Discover our most popular courses and start learning today.
              </p>
            </div>
          </motion.div>
          <motion.div 
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={featuredVariants}
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
          >
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course, index) => (
                <motion.div key={course.id} variants={cardVariants} custom={index}>
                  <CourseCard course={course} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center"
                variants={cardVariants}
              >
                <p className="text-lg text-muted-foreground">No courses available yet.</p>
                {/* Demo data creation button - only for development */}
                <Button 
                  className="mt-4 animate-bounce-slow"
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
              </motion.div>
            )}
          </motion.div>
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/courses">
              <Button size="lg" variant="outline" className="animate-scale-pulse">View All Courses</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={whyChooseRef} className="bg-primary/10 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={whyChooseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Us
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform offers unique features to enhance your learning experience
              </p>
            </div>
          </motion.div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Interactive Learning",
                description: "Engage with course material through interactive exercises and quizzes",
                icon: "🧠",
              },
              {
                title: "Expert Teachers",
                description: "Learn from industry professionals and academic experts",
                icon: "👨‍🏫",
              },
              {
                title: "AI-Powered Tools",
                description: "Generate notes and mind maps automatically from course content",
                icon: "🤖",
              },
              {
                title: "Flexible Schedule",
                description: "Study at your own pace with on-demand video lectures",
                icon: "⏰",
              },
              {
                title: "Community Support",
                description: "Connect with peers and instructors through discussion forums",
                icon: "👥",
              },
              {
                title: "Verified Certificates",
                description: "Earn certificates to showcase your skills and knowledge",
                icon: "🎓",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                variants={featureItemVariants}
                initial="hidden"
                animate={whyChooseInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-4xl mb-4 animate-bounce-slow" style={{ animationDelay: `${index * 0.2}s` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialRef} className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Students Say
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Hear from students who have transformed their learning experience with us
              </p>
            </div>
          </motion.div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                content: "The AI-powered learning tools helped me understand complex topics that I was struggling with before. The notes generator is a game-changer!",
                avatar: "https://i.pravatar.cc/150?img=1",
              },
              {
                name: "David Chen",
                role: "Data Science Professional",
                content: "The quality of courses offered is exceptional. The instructors are knowledgeable and responsive to questions.",
                avatar: "https://i.pravatar.cc/150?img=8",
              },
              {
                name: "Maria Rodriguez",
                role: "Digital Marketing Specialist",
                content: "I've taken three courses so far and each one has helped me develop marketable skills that I've applied in my career.",
                avatar: "https://i.pravatar.cc/150?img=5",
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="p-6 bg-card rounded-xl shadow-sm border border-primary/10"
                initial={{ opacity: 0, y: 50 }}
                animate={testimonialInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="rounded-full h-12 w-12 object-cover border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-[800px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Start Your Learning Journey?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground md:text-xl max-w-[600px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of students already learning on our platform
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="mt-4 bg-primary text-white hover:bg-primary/90 animate-glow"
                >
                  Create Your Free Account
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
