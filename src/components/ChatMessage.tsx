import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  // Format timestamp to show in a human-readable format
  const formattedTime = format(new Date(message.timestamp), 'MMM d, h:mm a');
  
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
        isCurrentUser
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={`https://avatar.vercel.sh/${message.senderId}`} alt={message.senderName} />
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{message.senderName}</span>
        <span className="text-xs text-muted-foreground">
          {formattedTime}
        </span>
      </div>
      <p className="whitespace-pre-wrap break-words">{message.content}</p>
    </div>
  );
} 