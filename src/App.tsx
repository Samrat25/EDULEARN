import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CourseView from "./pages/student/CourseView";
import AssignmentView from "./pages/student/AssignmentView";
import MockTest from "./pages/student/MockTest";
import CourseCreation from "./pages/teacher/CourseCreation";
import AssignmentCreation from "./pages/teacher/AssignmentCreation";
import TestCreation from "./pages/teacher/TestCreation";
import { AuthProvider } from "./contexts/AuthContext";
import TeacherCourseView from "./pages/teacher/TeacherCourseView";
import StudentProfile from "./pages/student/StudentProfile";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import CourseSearch from "./pages/CourseSearch";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/course/:id" element={<CourseView />} />
              <Route path="/assignment/:id" element={<AssignmentView />} />
              <Route path="/mock-test/:id" element={<MockTest />} />
              
              {/* Teacher Routes */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
              <Route path="/teacher/course/:id" element={<TeacherCourseView />} />
              <Route path="/teacher/create-course" element={<CourseCreation />} />
              <Route path="/teacher/create-assignment" element={<AssignmentCreation />} />
              <Route path="/teacher/create-test" element={<TestCreation />} />
              
              {/* Public Routes */}
              <Route path="/course-search" element={<CourseSearch />} />
              <Route path="/courses" element={<CourseSearch />} />
              <Route path="/about" element={<About />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
