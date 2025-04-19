import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatThread } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatThreadListProps {
  threads: ChatThread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export function ChatThreadList({ 
  threads, 
  selectedThreadId,
  onSelectThread 
}: ChatThreadListProps) {
  const { currentUser } = useAuth();
  const isTeacher = currentUser?.role === "teacher";
  
  // Sort threads by last message timestamp, most recent first
  const sortedThreads = [...threads].sort(
    (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
  );
  
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="p-2 space-y-2">
        {sortedThreads.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isTeacher 
                ? "Wait for students to reach out with questions." 
                : "Start a conversation with your course teacher."}
            </p>
          </div>
        ) : (
          sortedThreads.map((thread) => {
            const partner = isTeacher ? thread.studentName : thread.teacherName;
            const lastMessage = thread.messages[thread.messages.length - 1];
            const hasUnread = isTeacher && thread.unreadCount > 0;
            
            return (
              <Button
                key={thread.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-2 py-3 h-auto",
                  selectedThreadId === thread.id && "bg-muted",
                  hasUnread && "font-medium"
                )}
                onClick={() => onSelectThread(thread.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage 
                      src={`https://avatar.vercel.sh/${isTeacher ? thread.studentId : thread.teacherId}`} 
                      alt={partner} 
                    />
                    <AvatarFallback>{partner.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col items-start gap-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{partner}</span>
                      {hasUnread && (
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                      )}
                    </div>
                    
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {lastMessage ? lastMessage.content : "No messages yet"}
                    </div>
                    
                    {lastMessage && (
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
} 