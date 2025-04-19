import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatThread } from '@/types/chat';
import { getStudentById, getTeacherById } from './userService';
import { getCourseById } from './courseService';

// Mock storage
const CHAT_THREADS_KEY = 'edulearn_chat_threads';

// Helper to get all threads from local storage
const getAllThreads = (): ChatThread[] => {
  const storedThreads = localStorage.getItem(CHAT_THREADS_KEY);
  return storedThreads ? JSON.parse(storedThreads) : [];
};

// Helper to save all threads to local storage
const saveAllThreads = (threads: ChatThread[]): void => {
  localStorage.setItem(CHAT_THREADS_KEY, JSON.stringify(threads));
};

// Get thread by ID
export const getChatThreadById = (threadId: string): ChatThread | null => {
  const threads = getAllThreads();
  return threads.find(thread => thread.id === threadId) || null;
};

// Get threads by course ID
export const getChatThreadsByCourseId = (courseId: string): ChatThread[] => {
  const threads = getAllThreads();
  return threads.filter(thread => thread.courseId === courseId);
};

// Get threads for a student (across all courses)
export const getChatThreadsByStudentId = (studentId: string): ChatThread[] => {
  const threads = getAllThreads();
  return threads.filter(thread => thread.studentId === studentId);
};

// Get threads for a teacher (across all courses)
export const getChatThreadsByTeacherId = (teacherId: string): ChatThread[] => {
  const threads = getAllThreads();
  return threads.filter(thread => thread.teacherId === teacherId);
};

// Create a new chat thread
export const createChatThread = (
  courseId: string,
  studentId: string,
  title: string = 'Course Question'
): ChatThread | null => {
  const course = getCourseById(courseId);
  const student = getStudentById(studentId);
  
  if (!course || !student) return null;
  
  const teacherId = course.teacherId;
  const teacher = getTeacherById(teacherId);
  
  if (!teacher) return null;
  
  // Check if thread already exists for this student and course
  const existingThreads = getAllThreads();
  const existingThread = existingThreads.find(
    thread => thread.studentId === studentId && thread.courseId === courseId
  );
  
  if (existingThread) return existingThread;
  
  // Create new thread
  const newThread: ChatThread = {
    id: uuidv4(),
    courseId,
    studentId,
    studentName: student.name,
    teacherId,
    teacherName: teacher.name,
    title,
    lastMessageTimestamp: Date.now(),
    unreadCount: 0,
    messages: []
  };
  
  // Save thread
  saveAllThreads([...existingThreads, newThread]);
  
  return newThread;
};

// Send a message in a thread
export const sendChatMessage = (
  threadId: string,
  senderId: string,
  senderRole: 'student' | 'teacher',
  content: string
): ChatMessage | null => {
  const threads = getAllThreads();
  const threadIndex = threads.findIndex(thread => thread.id === threadId);
  
  if (threadIndex === -1) return null;
  
  const thread = threads[threadIndex];
  const sender = senderRole === 'student' 
    ? getStudentById(senderId) 
    : getTeacherById(senderId);
    
  if (!sender) return null;
  
  // Create new message
  const newMessage: ChatMessage = {
    id: uuidv4(),
    courseId: thread.courseId,
    senderId,
    senderName: sender.name,
    senderRole,
    content,
    timestamp: Date.now(),
    read: false
  };
  
  // Add message to thread
  thread.messages.push(newMessage);
  thread.lastMessageTimestamp = newMessage.timestamp;
  
  // Update unread count for recipient
  if (senderRole === 'student') {
    // Message is from student to teacher
    thread.unreadCount += 1;
  } else {
    // Message is from teacher to student (no unread increment needed here)
  }
  
  // Save updated threads
  threads[threadIndex] = thread;
  saveAllThreads(threads);
  
  return newMessage;
};

// Mark all messages in thread as read
export const markThreadAsRead = (threadId: string, userId: string): boolean => {
  const threads = getAllThreads();
  const threadIndex = threads.findIndex(thread => thread.id === threadId);
  
  if (threadIndex === -1) return false;
  
  const thread = threads[threadIndex];
  
  // Check if user is participant in this thread
  const isStudent = thread.studentId === userId;
  const isTeacher = thread.teacherId === userId;
  
  if (!isStudent && !isTeacher) return false;
  
  // Mark messages as read
  thread.messages = thread.messages.map(message => {
    // Only mark as read if this message wasn't sent by the current user
    if (message.senderId !== userId) {
      return { ...message, read: true };
    }
    return message;
  });
  
  // Reset unread count for this user
  if (isTeacher) {
    thread.unreadCount = 0;
  }
  
  // Save updated threads
  threads[threadIndex] = thread;
  saveAllThreads(threads);
  
  return true;
}; 