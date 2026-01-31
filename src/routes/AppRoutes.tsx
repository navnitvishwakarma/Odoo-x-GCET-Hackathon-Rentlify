import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { VendorLayout } from '@/components/layout/VendorLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/Login';
import { SignupPage } from '@/pages/auth/Register';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPassword';
import { ResetPasswordPage } from '@/pages/auth/ResetPassword';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmail';

// Customer Pages
import { HomePage } from '@/pages/customer/Home';
import { ListingsPage } from '@/pages/customer/Listings';
import { ProductDetailPage } from '@/pages/customer/ProductDetail';
import { BookingPage } from '@/pages/customer/Booking';
import { BookingConfirmationPage } from '@/pages/customer/BookingConfirmation';
import { CustomerDashboardPage } from '@/pages/customer/Dashboard';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/Dashboard';
import { AdminUsersPage } from '@/pages/admin/Users';
import { AdminSettingsPage } from '@/pages/admin/Settings';

// Vendor Pages
import { VendorDashboardPage } from '@/pages/vendor/Dashboard';
import VendorSignup from '@/pages/vendor/VendorSignup';

export function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes with Dynamic Background */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                {/* Specific Vendor Signup Route */}
                <Route path="/vendor/signup" element={<VendorSignup />} />
            </Route>

            {/* Main Layout (Customer / Public) */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/product-detail/:id" element={<ProductDetailPage />} />

                {/* Customer Protected Routes */}
                <Route element={
                    <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']}>
                        <Outlet />
                    </ProtectedRoute>
                }>
                    <Route path="/booking/:id" element={<BookingPage />} />
                    <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                    <Route path="/profile" element={<CustomerDashboardPage />} />
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Vendor Routes */}
            <Route path="/vendor" element={
                <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorLayout />
                </ProtectedRoute>
            }>
                <Route index element={<VendorDashboardPage />} />
                <Route path="dashboard" element={<VendorDashboardPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
