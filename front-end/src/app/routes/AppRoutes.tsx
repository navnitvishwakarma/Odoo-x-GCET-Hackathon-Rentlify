import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import MainLayout from '../layout/MainLayout';
import DashboardLayout from '../layout/DashboardLayout';
// import { ProtectedRoute } from './ProtectedRoute'; // Already imported above

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/customer/Home';
import { ProfilePage } from '../components/profile-page';

// Admin/Vendor Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import VendorDashboard from '../pages/vendor/VendorDashboard';
import ProductList from '../pages/vendor/products/ProductList';
import ProductForm from '../pages/vendor/products/ProductForm';
import OrderList from '../pages/vendor/orders/OrderList';

function RoleRedirect() {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="/admin" />;
    if (user?.role === 'vendor') return <Navigate to="/vendor" />;
    return <Navigate to="/home" />;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage onBack={() => window.location.href = '/'} />} />
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Vendor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                <Route element={<DashboardLayout role="vendor" />}>
                    <Route path="/vendor" element={<VendorDashboard />} />
                    <Route path="/vendor/products" element={<ProductList />} />
                    <Route path="/vendor/products/new" element={<ProductForm />} />
                    <Route path="/vendor/products/edit/:id" element={<ProductForm />} />
                    <Route path="/vendor/orders" element={<OrderList />} />
                </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
