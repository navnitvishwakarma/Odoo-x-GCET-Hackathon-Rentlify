import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface Props {
    allowedRoles: UserRole[];
    children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: Props) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Or redirect to home/dashboard
    }

    return children ? <>{children}</> : <Outlet />;
};
