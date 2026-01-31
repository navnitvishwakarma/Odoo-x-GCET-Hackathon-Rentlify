import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { type User, type AuthResponse } from '../types/auth.types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ user: User }>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data.data.user);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post<any, { data: { data: AuthResponse } }>('/auth/login', { email, password });
        const { user, tokens } = data.data;
        localStorage.setItem('accessToken', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);
        setUser(user);
        return { user };
    };

    const register = async (formData: any) => {
        const { data } = await api.post<any, { data: { data: AuthResponse } }>('/auth/register', formData);
        const { user, tokens } = data.data;
        localStorage.setItem('accessToken', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
