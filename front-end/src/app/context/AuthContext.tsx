import React, { createContext, useContext, useState, useEffect } from 'react'; // 🎣 Import standard React hooks
import { api } from '../services/api'; // 🔗 Import configured API client for making HTTP requests
import { type User, type AuthResponse } from '../types/auth.types'; // 📝 Import TS types for User and standard Auth responses

// 🏗️ Define the shape of our Authentication Context
interface AuthContextType {
    user: User | null; // 👤 The current user object or null if not logged in
    isAuthenticated: boolean; // ✅ Boolean flag for quick checks
    isLoading: boolean; // ⏳ Flag to show loading spinner while checking auth status
    login: (email: string, password: string) => Promise<{ user: User }>; // 🔑 Login function signature
    register: (data: any) => Promise<void>; // 📝 Register function signature
    logout: () => void; // 🚪 Logout function signature
}

// 📦 Create the context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🛡️ AuthProvider Component: Wraps the app to provide auth state globally
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null); // 🚦 State for storing the logged-in user
    const [isLoading, setIsLoading] = useState(true); // 🚦 State for initial loading status

    // 🔄 Effect: Check if user is logged in when the app first mounts
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken'); // 🔑 Retrieve token from local storage
            if (token) {
                try {
                    // 📡 Call API to validate token and get current user details
                    const { data } = await api.get('/auth/me');
                    setUser(data.data.user); // 👤 Set user data on success
                } catch (error) {
                    // ❌ If token is invalid or API fails
                    console.error("Auth check failed", error);
                    localStorage.removeItem('accessToken'); // 🧹 Clean up invalid token
                    localStorage.removeItem('refreshToken'); // 🧹 Clean up refresh token
                }
            }
            setIsLoading(false); // ✅ Finished initial check, stop loading
        };
        initAuth();
    }, []);

    // 🔑 Function: Handle User Login
    const login = async (email: string, password: string) => {
        // 📡 API call to login endpoint
        const { data } = await api.post<any, { data: { data: AuthResponse } }>('/auth/login', { email, password });
        const { user, tokens } = data.data; // 📦 Extract user and tokens from response

        // 💾 Save tokens to LocalStorage for persistence
        localStorage.setItem('accessToken', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);

        setUser(user); // 👤 Update global user state
        return { user };
    };

    // 📝 Function: Handle User Registration
    const register = async (formData: any) => {
        // 📡 API call to register endpoint
        const { data } = await api.post<any, { data: { data: AuthResponse } }>('/auth/register', formData);
        const { user, tokens } = data.data; // 📦 Extract user and tokens

        // 💾 Save tokens immediately to log the user in
        localStorage.setItem('accessToken', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);

        setUser(user); // 👤 Update global user state
    };

    // 🚪 Function: Handle Logout
    const logout = () => {
        localStorage.removeItem('accessToken'); // 🧹 Remove access token
        localStorage.removeItem('refreshToken'); // 🧹 Remove refresh token
        setUser(null); // 👤 Clear user state
        window.location.href = '/'; // 🔄 Hard redirect to home/landing page
    };

    // 🎁 Provide the auth state and functions to children components
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 🎣 Custom Hook: Helper to easily access AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    // 🛡️ Ensure hook is used within valid Provider
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
