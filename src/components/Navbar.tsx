<<<<<<< HEAD
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import NotesGenerator from './NotesGenerator';
import MindMapGenerator from './MindMapGenerator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, BookOpen, Home, Info, Search, FileText, Network, MessageCircle, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNotesGenerator, setShowNotesGenerator] = useState(false);
  const [showMindMapGenerator, setShowMindMapGenerator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    return currentUser?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
  };
  
  const getChatPath = () => {
    return currentUser?.role === 'student' ? '/student/chat' : '/teacher/chat';
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'}`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/Logo.png" alt="EduLearn Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-primary">EduLearn</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
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
          
          {/* AI Tools as Dialog Buttons - Hide on mobile */}
          <div className="hidden md:flex gap-2">
            <Dialog open={showNotesGenerator} onOpenChange={setShowNotesGenerator}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full" title="Notes Generator">
                  <FileText className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <NotesGenerator />
              </DialogContent>
            </Dialog>
            
            <Dialog open={showMindMapGenerator} onOpenChange={setShowMindMapGenerator}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full" title="Knowledge Map">
                  <Network className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <MindMapGenerator />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center gap-4">
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
                    <Link to={getChatPath()}>
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        <span>Messages</span>
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
          
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center space-x-2">
                    <img src="/Logo.png" alt="EduLearn Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold text-primary">EduLearn</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="py-4 flex flex-col gap-4">
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Courses</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
                  >
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </Link>
                </nav>
                
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm font-medium mb-2">AI Tools</p>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setShowNotesGenerator(true);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Notes Generator</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setShowMindMapGenerator(true);
                      }}
                    >
                      <Network className="h-4 w-4 mr-2" />
                      <span>Knowledge Map</span>
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-auto">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage 
                            src={currentUser?.profilePicture || ''} 
                            alt={currentUser?.name || ''}
                          />
                          <AvatarFallback>{currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{currentUser?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                        </div>
                      </div>
                      <Link to={getDashboardPath()}>
                        <Button className="w-full">Dashboard</Button>
                      </Link>
                      <Link to={`/${currentUser?.role}/profile`}>
                        <Button variant="outline" className="w-full">Profile</Button>
                      </Link>
                      <Link to={getChatPath()}>
                        <Button variant="outline" className="w-full flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          <span>Messages</span>
                        </Button>
                      </Link>
                      <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full">Log in</Button>
                      </Link>
                      <Link to="/register" className="w-full">
                        <Button className="w-full">Register</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
=======
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import NotesGenerator from './NotesGenerator';
import MindMapGenerator from './MindMapGenerator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, BookOpen, Home, Info, Search, FileText, Network, MessageCircle, Menu, X, ChevronDown, Code, Calculator, GraduationCap, Atom, Lightbulb, Globe, PenTool } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNotesGenerator, setShowNotesGenerator] = useState(false);
  const [showMindMapGenerator, setShowMindMapGenerator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [courses, setCourses] = useState([]);
  
  // Fetch courses for the dropdown
  useEffect(() => {
    try {
      const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    return currentUser?.role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
  };
  
  const getChatPath = () => {
    return currentUser?.role === 'student' ? '/student/chat' : '/teacher/chat';
  };
  
  // Add scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-background'}`}>
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
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 focus:outline-none">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link to="/courses">
                  <DropdownMenuItem className="cursor-pointer">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>All Courses</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                {/* Course Categories */}
                <Link to="/courses?category=programming">
                  <DropdownMenuItem className="cursor-pointer">
                    <Code className="h-4 w-4 mr-2" />
                    <span>Programming</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/courses?category=mathematics">
                  <DropdownMenuItem className="cursor-pointer">
                    <Calculator className="h-4 w-4 mr-2" />
                    <span>Mathematics</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/courses?category=science">
                  <DropdownMenuItem className="cursor-pointer">
                    <Atom className="h-4 w-4 mr-2" />
                    <span>Science</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/courses?category=language">
                  <DropdownMenuItem className="cursor-pointer">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Languages</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link to="/courses?category=arts">
                  <DropdownMenuItem className="cursor-pointer">
                    <PenTool className="h-4 w-4 mr-2" />
                    <span>Arts & Design</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                
                {courses.length === 0 && (
                  <DropdownMenuItem disabled>
                    <span className="text-muted-foreground">No courses available</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
          
          {/* AI Tools as Dialog Buttons - Hide on mobile */}
          <div className="hidden md:block">
            <Dialog open={showNotesGenerator} onOpenChange={setShowNotesGenerator}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Notes Generator</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <NotesGenerator />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="hidden md:block">
            <Dialog open={showMindMapGenerator} onOpenChange={setShowMindMapGenerator}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Network className="h-4 w-4" />
                  <span>MindMap Generator</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <MindMapGenerator />
              </DialogContent>
            </Dialog>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium transition-colors hover:text-primary hidden md:block"
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
                  <Link to={getChatPath()}>
                    <DropdownMenuItem className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span>Messages</span>
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
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:w-80">
              <div className="flex items-center gap-2 mb-6">
                <img src="/Logo.png" alt="EduLearn Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-primary">EduLearn</span>
              </div>
              
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="flex flex-col gap-4 py-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  
                  <div className="space-y-2">
                    <Link 
                      to="/courses" 
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>All Courses</span>
                    </Link>
                    
                    {/* Categories in Mobile Menu */}
                    <div className="pl-9 flex flex-col space-y-2">
                      <Link 
                        to="/courses?category=programming" 
                        className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Code className="h-4 w-4" />
                        <span>Programming</span>
                      </Link>
                      <Link 
                        to="/courses?category=mathematics" 
                        className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calculator className="h-4 w-4" />
                        <span>Mathematics</span>
                      </Link>
                      <Link 
                        to="/courses?category=science" 
                        className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Atom className="h-4 w-4" />
                        <span>Science</span>
                      </Link>
                      <Link 
                        to="/courses?category=language" 
                        className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Globe className="h-4 w-4" />
                        <span>Languages</span>
                      </Link>
                      <Link 
                        to="/courses?category=arts" 
                        className="flex items-center gap-2 py-1 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <PenTool className="h-4 w-4" />
                        <span>Arts & Design</span>
                      </Link>
                    </div>
                  </div>
                  
                  <Link 
                    to="/about" 
                    className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </Link>
                  
                  {isAuthenticated && (
                    <Link 
                      to={getDashboardPath()} 
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  {/* Mobile AI Tools */}
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start gap-2 px-2 py-2 rounded-md hover:bg-accent"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowNotesGenerator(true);
                    }}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Notes Generator</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center justify-start gap-2 px-2 py-2 rounded-md hover:bg-accent"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowMindMapGenerator(true);
                    }}
                  >
                    <Network className="h-5 w-5" />
                    <span>MindMap Generator</span>
                  </Button>
                  
                  {!isAuthenticated && (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link 
                        to="/login" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">Log in</Button>
                      </Link>
                      <Link 
                        to="/register" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full">Register</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
>>>>>>> bd9dd6ca418db8db917e7f2677edfaf051bf6274
