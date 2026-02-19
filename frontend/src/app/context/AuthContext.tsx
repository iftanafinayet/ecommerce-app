import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean; // Field ini yang menentukan status admin
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean; // Helper untuk mengecek status admin dengan cepat
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper untuk mengecek apakah user yang login adalah admin
  const isAdmin = !!user?.isAdmin;

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.users.login(email, password);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.users.register(name, email, password);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    // FIX TypeScript: Pastikan user dan token ada sebelum panggil API
    if (!user?.token) {
      throw new Error('You must be logged in to update profile');
    }

    setIsLoading(true);
    try {
      const data = await api.users.updateProfile(userData, user.token);
      
      // Merge data lama dengan data baru dari server
      const newUser = { ...user, ...data };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}