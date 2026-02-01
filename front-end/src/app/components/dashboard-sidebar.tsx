import { Link, useLocation } from "react-router-dom";
import { cn } from "@/app/components/ui/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Settings,
    LogOut,
    Store,
    User,
    FileText
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface SidebarProps {
    role: "admin" | "vendor";
}

export function DashboardSidebar({ role }: SidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();

    const vendorLinks = [
        { name: "Overview", href: "/vendor", icon: LayoutDashboard },
        { name: "My Products", href: "/vendor/products", icon: Package },
        { name: "Orders", href: "/vendor/orders", icon: ShoppingBag },
        { name: "Invoices", href: "/vendor/invoices", icon: FileText },
        { name: "Settings", href: "/vendor/settings", icon: Settings },
    ];

    const adminLinks = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Vendors", href: "/admin/vendors", icon: Store },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const links = role === "vendor" ? vendorLinks : adminLinks;

    return (
        <div className="w-64 border-r bg-card min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b">
                <Link to={role === 'admin' ? '/admin' : '/vendor'} className="text-xl font-bold font-serif italic tracking-tight">Rentlify</Link>
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-medium tracking-wider">
                    {role}
                </span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
