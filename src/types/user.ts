
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
}

export interface StoredUser {
  user: User;
  timestamp: number;
}
