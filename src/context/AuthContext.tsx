import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'customer' | 'vendor' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: 'active' | 'pending' | 'rejected';
  rejectionReason?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("role") as UserRole;

    if (storedLoggedIn === "true" && storedRole) {
      setUser({
        id: 'mock-user-id',
        name: 'Demo User',
        email: 'demo@rentlify.com',
        role: storedRole,
        status: 'active'
      });
    }

    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      status: role === 'vendor' ? 'active' : 'active',
    };
    setUser(mockUser);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role || 'customer');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
  };

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    // Mock signup
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      status: role === 'vendor' ? 'pending' : 'active',
    };
    setUser(mockUser);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role || 'customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isDarkMode,
        toggleDarkMode,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
