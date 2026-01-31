import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type Role } from '../types/auth.types';

interface Props {
    allowedRoles?: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
