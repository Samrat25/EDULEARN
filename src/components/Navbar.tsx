import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { NotesGenerator } from './NotesGenerator';
import { MindMapGenerator } from './MindMapGenerator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, BookOpen, Home, Info, Search } from 'lucide-react';

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
            <img src="/Logo.png" alt="EduLearn Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">EduLearn</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/courses"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Always show the generators regardless of authentication */}
          <NotesGenerator />
          <MindMapGenerator />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                <Button>Dashboard</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-10 w-10 border-2 border-primary hover:border-primary/80 transition-colors cursor-pointer object-cover overflow-hidden">
                    <AvatarImage 
                      src={currentUser?.profilePicture || ''} 
                      alt={currentUser?.name || ''}
                      className="object-cover aspect-square"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{currentUser?.name}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={`/${currentUser?.role}/profile`}>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
