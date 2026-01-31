import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/app/components/dashboard-sidebar";
import { useAuth } from "@/app/context/AuthContext";
import { Bell, Search, Plus, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

export default function DashboardLayout({ role }: { role: "admin" | "vendor" }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Helper to determine page title based on path
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === role) return 'Overview';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="min-h-screen bg-background flex text-foreground font-sans">
            <DashboardSidebar role={role} />
            <main className="flex-1 overflow-y-auto h-screen bg-secondary/5">
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
                    </div>

                    <div className="flex-1 max-w-xl mx-8 hidden md:block group">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search orders, products, or customers..."
                                className="pl-10 bg-secondary/50 border-none focus:ring-1 focus:ring-primary/20 transition-all rounded-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {role === 'vendor' && (
                            <Link to="/vendor/products/new">
                                <Button size="sm" className="hidden sm:flex items-center gap-2 rounded-full shadow-sm">
                                    <Plus className="w-4 h-4" />
                                    <span>Create</span>
                                </Button>
                            </Link>
                        )}

                        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="pl-2 pr-1 rounded-full gap-3 hover:bg-secondary h-10 border border-transparent hover:border-border">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{user?.email}</p>
                                    </div>
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/${role}/settings`)} className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
