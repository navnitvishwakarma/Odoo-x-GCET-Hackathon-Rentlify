import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';

export function VendorLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-primary">Vendor Portal</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/vendor')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/vendor/products')}>
                        <Package className="mr-2 h-4 w-4" />
                        My Products
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/vendor/orders')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Orders
                    </Button>
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}
