import { User } from '@/types/user';

// Get all users
export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  const users = getAllUsers();
  return users.find(user => user.id === userId) || null;
};

// Get student by ID
export const getStudentById = (studentId: string): User | null => {
  const user = getUserById(studentId);
  return user && user.role === 'student' ? user : null;
};

// Get teacher by ID
export const getTeacherById = (teacherId: string): User | null => {
  const user = getUserById(teacherId);
  return user && user.role === 'teacher' ? user : null;
};

// Create a new user
export const createUser = (userData: Omit<User, 'id'>): User => {
  const users = getAllUsers();
  
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return newUser;
};

// Update a user
export const updateUser = (userId: string, userData: Partial<User>): User | null => {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === userId);
  
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...userData };
  localStorage.setItem('users', JSON.stringify(users));
  
  return users[index];
};

// Delete a user
export const deleteUser = (userId: string): boolean => {
  const users = getAllUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  
  if (filteredUsers.length === users.length) return false;
  
  localStorage.setItem('users', JSON.stringify(filteredUsers));
  return true;
};
