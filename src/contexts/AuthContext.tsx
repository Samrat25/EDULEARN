
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StoredUser } from '@/types/user';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id'>) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as StoredUser;
      // Check if token is still valid (in a real app, you would verify with backend)
      setCurrentUser(parsedUser.user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      // In a real app, you would validate credentials with a backend
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      const userData = { ...user };
      delete userData.password; // Don't store password in state
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      
      // Store in local storage
      localStorage.setItem('currentUser', JSON.stringify({
        user: userData,
        timestamp: new Date().getTime()
      }));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<User | null> => {
    try {
      // In a real app, you would submit this data to a backend
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((u: User) => u.email === userData.email)) {
        throw new Error('Email already registered');
      }
      
      const newUser = {
        ...userData,
        id: Date.now().toString(), // Generate a unique ID
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userDataWithoutPassword = { ...newUser };
      delete userDataWithoutPassword.password; // Don't store password in state
      
      return userDataWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
