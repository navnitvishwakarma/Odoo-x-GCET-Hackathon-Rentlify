import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'customer' | 'vendor' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    // Mock signup
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    setUser(mockUser);
  };

  return (
    <AppContext.Provider
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
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
