import { Routes, Route, Navigate } from 'react-router-dom'; // 🗺️ Core router components from React Router
import { useAuth } from '../context/AuthContext'; // 🔐 Hook to access current user and auth state
import { ProtectedRoute } from './ProtectedRoute'; // 🛡️ Wrapper for guarding routes based on auth/role

// Layouts: Wrappers providing common UI structures
import MainLayout from '../layout/MainLayout'; // 🏗️ Public facing layout (Header + Footer)
import DashboardLayout from '../layout/DashboardLayout'; // 📊 Dashboard layout (Sidebar + Header)

// Pages: The specific views rendered for each route
import Login from '../pages/auth/Login'; // 🔑 Public Login Page
import Register from '../pages/auth/Register'; // 📝 Public Registration Page
import Home from '../pages/customer/Home'; // 🏠 Landing Page
import { ProfilePage } from '../components/profile-page'; // 👤 User Profile Page
import Wishlist from '../pages/customer/Wishlist'; // ❤️ Wishlist Page
import Cart from '../pages/customer/Cart'; // 🛒 Cart Page
import Checkout from '../pages/customer/Checkout'; // 💳 Checkout Page
import OrderConfirmation from '../pages/customer/OrderConfirmation'; // ✅ Order Confirmation Page

// Admin/Vendor Pages: Restricted dashboard views
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVendors from '../pages/admin/AdminVendors';
import AdminSettings from '../pages/admin/AdminSettings';
import VendorDashboard from '../pages/vendor/VendorDashboard';
import ProductList from '../pages/vendor/products/ProductList';
import ProductForm from '../pages/vendor/products/ProductForm';
import VendorProductDetails from '../pages/vendor/products/VendorProductDetails';
import OrderList from '../pages/vendor/orders/OrderList';
import VendorOrderDetails from '../pages/vendor/orders/VendorOrderDetails';
import VendorSettings from '../pages/vendor/VendorSettings';
import VendorInvoices from '../pages/vendor/invoices/VendorInvoices';
import VendorActiveOrders from '../pages/vendor/VendorActiveOrders';

// 🔄 Helper component to redirect users based on their role after login
function RoleRedirect() {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="/admin" />; // 👮 Redirect admins
    if (user?.role === 'vendor') return <Navigate to="/vendor" />; // 🏪 Redirect vendors
    return <Navigate to="/home" />; // 🏠 Default helper redirect
}

// 🚦 Main Routing Configuration Component
export default function AppRoutes() {
    return (
        <Routes>
            {/* 🌍 Public Routes: Accessible by anyone, wrapped in the standard layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} /> {/* 🏠 Root path */}
                <Route path="/home" element={<Home />} /> {/* 🏠 Home alias */}
                <Route path="/login" element={<Login />} /> {/* 🔑 Login page */}
                <Route path="/register" element={<Register />} /> {/* 📝 Register page */}
                <Route path="/wishlist" element={<Wishlist />} /> {/* ❤️ Wishlist page */}
                <Route path="/cart" element={<Cart />} /> {/* 🛒 Cart page */}
                <Route path="/checkout" element={<Checkout />} /> {/* 💳 Checkout page */}
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} /> {/* ✅ Order Confirmation */}

                {/* 🔒 Protected User Routes: Accessible only if logged in (any role) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage onBack={() => window.location.href = '/'} />} />
                </Route>
            </Route>

            {/* 👮 Admin Routes: Restricted to 'admin' role only */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout role="admin" />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/vendors" element={<AdminVendors />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>
            </Route>

            {/* 🏪 Vendor Routes: Restricted to 'vendor' role only */}
            <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
                {/* 🏗️ Dashboard Layout wrapper for sidebar/header */}
                <Route element={<DashboardLayout role="vendor" />}>
                    <Route path="/vendor" element={<VendorDashboard />} /> {/* 📊 Main Dashboard */}
                    <Route path="/vendor/products" element={<ProductList />} /> {/* 📦 Product Management */}
                    <Route path="/vendor/products/new" element={<ProductForm />} /> {/* ➕ Add Product */}
                    <Route path="/vendor/products/view/:id" element={<VendorProductDetails />} /> {/* 👁️ View Product Details */}
                    <Route path="/vendor/products/edit/:id" element={<ProductForm />} /> {/* ✏️ Edit Product */}
                    <Route path="/vendor/orders" element={<OrderList />} /> {/* 🛒 Order Management */}
                    <Route path="/vendor/active" element={<VendorActiveOrders />} /> {/* ⏱️ Active Orders & Fines */}
                    <Route path="/vendor/orders/:id" element={<VendorOrderDetails />} /> {/* 👁️ View Order Details */}
                    <Route path="/vendor/invoices" element={<VendorInvoices />} /> {/* 📄 Invoice Management */}
                    <Route path="/vendor/settings" element={<VendorSettings />} /> {/* ⚙️ Vendor Settings */}
                </Route>
            </Route>

            {/* ❓ Catch-all Route: Redirects any unknown paths to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
