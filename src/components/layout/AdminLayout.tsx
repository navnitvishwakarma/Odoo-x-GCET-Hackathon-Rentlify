import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    Bell,
    Search,
    ChevronRight,
    User,
    Shield,
    CreditCard,
    CheckCircle2,
    Clock,
    X
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';

export function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const [notifications, setNotifications] = useState([
        {
            id: '1',
            title: 'New Vendor Signup',
            description: 'ProGear Rentals submitted a request.',
            time: '2 mins ago',
            read: false,
            type: 'vendor'
        },
        {
            id: '2',
            title: 'Low Stock Alert',
            description: 'MacBook Pro 16" is below threshold.',
            time: '1 hour ago',
            read: false,
            type: 'stock'
        },
        {
            id: '3',
            title: 'System Update',
            description: 'Backend maintenance scheduled for 2 AM.',
            time: '5 hours ago',
            read: true,
            type: 'system'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
        toast.info('All notifications cleared');
    };

    // --- Search Logic ---
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const searchableItems = [
        { title: 'Dashboard', category: 'Pages', path: '/admin', icon: LayoutDashboard },
        { title: 'Users Management', category: 'Pages', path: '/admin/users', icon: Users },
        { title: 'Platform Settings', category: 'Pages', path: '/admin/settings', icon: Settings },
        { title: 'John Doe', category: 'Users', path: '/admin/users?q=John', icon: User },
        { title: 'Sarah Williams', category: 'Users', path: '/admin/users?q=Sarah', icon: User },
        { title: 'ProGear Rentals', category: 'Vendors', path: '/admin/users?q=ProGear', icon: Users },
        { title: 'Canon EOS R5', category: 'Products', path: '#', icon: Search },
        { title: 'MacBook Pro 16"', category: 'Products', path: '#', icon: Search },
    ];

    const filteredSuggestions = searchQuery
        ? searchableItems.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('admin-search') as HTMLInputElement;
                searchInput?.focus();
            }
            if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const categoriesInSearch = Array.from(new Set(filteredSuggestions.map(s => s.category)));

    return (
        <TooltipProvider>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <aside
                    className={cn(
                        "bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-sm relative",
                        isCollapsed ? "w-20" : "w-64"
                    )}
                >
                    {/* Branding */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        {!isCollapsed ? (
                            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/admin')}>
                                <div className="h-8 w-8 bg-[#2563eb] rounded-lg flex items-center justify-center text-white font-bold p-1 shadow-lg shadow-blue-500/20">R</div>
                                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Rentlify Admin</h1>
                            </div>
                        ) : (
                            <div className="mx-auto h-8 w-8 bg-[#2563eb] rounded-lg flex items-center justify-center text-white font-bold p-1 shadow-lg shadow-blue-500/20">R</div>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 py-6 px-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) => cn(
                                    "flex items-center rounded-xl transition-all duration-200 h-11 px-3 mb-1",
                                    isActive
                                        ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Account Section */}
                    <div className="p-3 border-t border-gray-100">
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full flex justify-start items-center rounded-xl h-11 text-red-500 hover:text-red-600 hover:bg-red-50 px-3",
                                        isCollapsed && "justify-center"
                                    )}
                                    onClick={logout}
                                >
                                    <LogOut className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-3")} />
                                    {!isCollapsed && <span className="font-medium">Logout</span>}
                                </Button>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="bg-destructive text-white border-none py-1.5 px-3 rounded-lg shadow-xl">
                                    Logout
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>

                    {/* Collapse Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-6 -right-3 h-6 w-6 rounded-full border border-gray-100 bg-white shadow-sm z-30 hover:bg-gray-50 flex items-center justify-center p-0"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                    </Button>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-gray-50/30">
                    {/* Topbar */}
                    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Pages</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-gray-900 font-medium capitalize">
                                {location.pathname.split('/').pop() || 'Dashboard'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group hidden sm:block" ref={searchRef}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    id="admin-search"
                                    placeholder="Search platform... (Ctrl+K)"
                                    className="h-9 w-48 bg-muted border-border rounded-lg pl-9 text-xs focus:ring-1 focus:ring-primary focus:w-64 transition-all duration-300 outline-none"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {showSuggestions && searchQuery.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[300px] animate-in slide-in-from-top-2 duration-200">
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {filteredSuggestions.length > 0 ? (
                                                categoriesInSearch.map(category => (
                                                    <div key={category} className="p-1">
                                                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-50/50 rounded-md mb-1">
                                                            {category}
                                                        </div>
                                                        {filteredSuggestions
                                                            .filter(s => s.category === category)
                                                            .map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
                                                                    onClick={() => {
                                                                        navigate(item.path);
                                                                        setShowSuggestions(false);
                                                                        setSearchQuery('');
                                                                    }}
                                                                >
                                                                    <div className="h-7 w-7 bg-primary/5 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                        <item.icon className="h-3.5 w-3.5" />
                                                                    </div>
                                                                    <span className="text-xs font-medium">{item.title}</span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <X className="h-5 w-5 text-muted-foreground/30" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">No matches for "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 border-t bg-gray-50/50 flex justify-between items-center text-[10px] text-muted-foreground">
                                            <span>Press <kbd className="bg-white border px-1 rounded shadow-sm">Esc</kbd> to close</span>
                                            <span>{filteredSuggestions.length} results</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
                                        <Bell className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full ring-2 ring-white animate-pulse"></span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
                                    <div className="p-4 bg-primary/5 border-b flex items-center justify-between">
                                        <h4 className="font-bold text-sm">Notifications</h4>
                                        {notifications.length > 0 && (
                                            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={clearAll}>
                                                Clear All
                                            </Button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    className={cn(
                                                        "p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors relative group",
                                                        !n.read && "bg-blue-50/30"
                                                    )}
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full"></div>}
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold">{n.title}</span>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {n.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.description}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <CheckCircle2 className="h-6 w-6 text-muted-foreground/30" />
                                                </div>
                                                <p className="text-xs font-medium text-muted-foreground">Catching up with everything!</p>
                                            </div>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="p-2 border-t text-center">
                                            <Button variant="ghost" className="w-full text-xs h-8 text-primary hover:text-primary">
                                                View All Activity
                                            </Button>
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>

                            <div className="h-6 w-px bg-border"></div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-muted transition-colors">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{user?.name || 'aman233252'}</p>
                                            <p className="text-[10px] text-muted-foreground capitalize">{user?.role || 'Administrator'}</p>
                                        </div>
                                        <Avatar className="h-8 w-8 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                                            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">AD</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-1">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">Admin Hub</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email || 'admin@rentlify.com'}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                        <User className="mr-2 h-4 w-4" />
                                        Profile Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Privacy Control
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Payout History
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
                        <Outlet />
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}
