export interface ChatMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  content: string;
  timestamp: number;
  read: boolean;
}

export interface ChatThread {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  title: string; // Optional title or subject of the thread
  lastMessageTimestamp: number;
  unreadCount: number; // Number of unread messages
  messages: ChatMessage[];
} 