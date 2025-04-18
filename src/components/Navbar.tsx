import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle'; // Ensure ThemeToggle.tsx exists in the same directory
import { NotesGenerator } from './NotesGenerator';
import { MindMapGenerator } from './MindMapGenerator';

export function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    return currentUser?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">EduLearn</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Courses
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Always show the generators regardless of authentication */}
          <NotesGenerator />
          <MindMapGenerator />
          
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
