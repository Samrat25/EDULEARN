import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChatThread as ChatThreadType } from "@/types/chat";
import { ChatThreadList } from "@/components/ChatThreadList";
import { ChatThread } from "@/components/ChatThread";
import { getChatThreadsByTeacherId } from "@/services/chatService";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const TeacherChatPage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [threads, setThreads] = useState<ChatThreadType[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<ChatThreadType | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  
  // Calculate unread count
  const unreadCount = threads.filter(thread => thread.unreadCount > 0).length;
  
  // Filter threads based on active filter
  const filteredThreads = activeFilter === 'all' 
    ? threads 
    : threads.filter(thread => thread.unreadCount > 0);
  
  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== "teacher") {
      navigate("/login");
      return;
    }
    
    // Load chat threads
    if (currentUser) {
      loadChatThreads();
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
  
  // Load chat threads for the current teacher
  const loadChatThreads = () => {
    if (!currentUser) return;
    const teacherThreads = getChatThreadsByTeacherId(currentUser.id);
    setThreads(teacherThreads);
    
    // Select first thread if none selected
    if (!selectedThreadId && teacherThreads.length > 0) {
      setSelectedThreadId(teacherThreads[0].id);
    }
  };
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Messages</h1>
          <p className="text-muted-foreground">
            Answer questions from students enrolled in your courses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <div className="p-4 border-b">
              <Tabs 
                defaultValue="all" 
                value={activeFilter}
                onValueChange={(value) => setActiveFilter(value as 'all' | 'unread')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <ChatThreadList
              threads={filteredThreads}
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
                    Select a chat from the list to start responding
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

export default TeacherChatPage; 