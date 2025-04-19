import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChatThread as ChatThreadType } from "@/types/chat";
import { ChatThreadList } from "@/components/ChatThreadList";
import { ChatThread } from "@/components/ChatThread";
import { getChatThreadsByStudentId, createChatThread } from "@/services/chatService";
import { getAllCourses, getEnrolledCourses } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

const StudentChatPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [threads, setThreads] = useState<ChatThreadType[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<ChatThreadType | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [isNewThreadDialogOpen, setIsNewThreadDialogOpen] = useState(false);
  
  // Redirect if not authenticated or not a student
  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "student") {
      navigate("/login");
      return;
    }
    
    // Load chat threads and enrolled courses
    if (currentUser) {
      loadChatThreads();
      const courses = getEnrolledCourses(currentUser.id);
      setEnrolledCourses(courses);
    }
    
    // Set up polling for new messages every 5 seconds
    const interval = setInterval(() => {
      if (currentUser) {
        loadChatThreads();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser, isAuthenticated, navigate]);
  
  // Update selected thread when threads change
  useEffect(() => {
    if (selectedThreadId) {
      const thread = threads.find(t => t.id === selectedThreadId);
      setSelectedThread(thread || null);
    }
  }, [threads, selectedThreadId]);
  
  // Load chat threads for the current student
  const loadChatThreads = () => {
    if (!currentUser) return;
    const studentThreads = getChatThreadsByStudentId(currentUser.id);
    setThreads(studentThreads);
    
    // Select first thread if none selected
    if (!selectedThreadId && studentThreads.length > 0) {
      setSelectedThreadId(studentThreads[0].id);
    }
  };
  
  // Create a new chat thread
  const handleCreateThread = () => {
    if (!currentUser || !selectedCourseId) return;
    
    const threadResult = createChatThread(
      selectedCourseId,
      currentUser.id,
      threadTitle || "Course Question"
    );
    
    if (threadResult) {
      // Reload threads and select the new one
      loadChatThreads();
      setSelectedThreadId(threadResult.id);
      setIsNewThreadDialogOpen(false);
      
      toast({
        title: "Chat Created",
        description: "Your question has been sent to the teacher.",
      });
    } else {
      toast({
        title: "Error",
        description: "Could not create chat. Please try again.",
        variant: "destructive",
      });
    }
    
    // Reset form
    setSelectedCourseId("");
    setThreadTitle("");
  };
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Chat with Teachers</h1>
            <p className="text-muted-foreground">
              Ask questions and get help from your course teachers
            </p>
          </div>
          <Dialog open={isNewThreadDialogOpen} onOpenChange={setIsNewThreadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Select Course</Label>
                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                  >
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrolledCourses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Question Topic (optional)</Label>
                  <Input
                    id="title"
                    value={threadTitle}
                    onChange={(e) => setThreadTitle(e.target.value)}
                    placeholder="e.g., Homework help, Lecture clarification"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateThread}
                  disabled={!selectedCourseId}
                >
                  Start Chat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <ChatThreadList
              threads={threads}
              selectedThreadId={selectedThreadId}
              onSelectThread={setSelectedThreadId}
            />
          </Card>
          
          <Card className="md:col-span-2 h-[calc(100vh-12rem)]">
            {selectedThread ? (
              <ChatThread thread={selectedThread} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No chat selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a chat or start a new one
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentChatPage; 