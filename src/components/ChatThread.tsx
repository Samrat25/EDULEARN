import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatThread as ChatThreadType } from "@/types/chat";
import { sendChatMessage, markThreadAsRead } from "@/services/chatService";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatThreadProps {
  thread: ChatThreadType;
}

export function ChatThread({ thread }: ChatThreadProps) {
  const { currentUser } = useAuth();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isTeacher = currentUser?.role === "teacher";
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser) return;
    
    sendChatMessage(
      thread.id,
      currentUser.id,
      currentUser.role,
      messageText.trim()
    );
    
    setMessageText("");
  };
  
  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages]);
  
  // Mark messages as read when thread is opened
  useEffect(() => {
    if (currentUser) {
      markThreadAsRead(thread.id, currentUser.id);
    }
  }, [thread.id, currentUser]);
  
  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="border-b p-4">
        <h3 className="font-medium">
          {isTeacher ? `Chat with ${thread.studentName}` : `Chat with ${thread.teacherName}`}
        </h3>
        <p className="text-sm text-muted-foreground">{thread.title}</p>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          thread.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={currentUser?.id === message.senderId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!messageText.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 