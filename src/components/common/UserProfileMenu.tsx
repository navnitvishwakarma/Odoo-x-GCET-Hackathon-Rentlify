import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    LayoutDashboard,
    Package,
    Heart,
    MessageSquare,
    CreditCard,
    Settings,
    LogOut,
    ChevronDown,
    Store,
    Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

export function UserProfileMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [window.location.pathname]);

    if (!user) return null;

    const menuItems = [
        {
            label: 'My Dashboard',
            icon: LayoutDashboard,
            action: () => navigate(user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/profile')
        },
        {
            label: 'My Rentals',
            icon: Package,
            action: () => navigate('/profile?tab=rentals')
        },
        {
            label: 'Wishlist',
            icon: Heart,
            action: () => navigate('/profile?tab=wishlist')
        },
        {
            label: 'Messages',
            icon: MessageSquare,
            action: () => navigate('/messages')
        },
        {
            label: 'Payments & Invoices',
            icon: CreditCard,
            action: () => navigate('/profile?tab=billing')
        },
        {
            label: 'Profile Settings',
            icon: Settings,
            action: () => navigate('/settings')
        },
    ];

    return (
        <div className="relative z-50" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 group outline-none focus:ring-2 focus:ring-primary/20",
                    isOpen
                        ? "bg-muted border-primary/20 shadow-sm"
                        : "border-transparent hover:bg-muted/50 hover:border-border"
                )}
            >
                <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {user.role}
                    </span>
                </div>

                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300 ml-1",
                        isOpen && "rotate-180 text-primary"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border/50 bg-muted/30">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-10 w-10 border border-white/20 shadow-sm">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className={cn(
                                "w-full flex justify-center py-1 text-[10px] tracking-widest uppercase font-bold border-0",
                                user.role === 'vendor' ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"
                            )}>
                                {user.role === 'vendor' ? 'Verified Vendor' : 'Verified Member'}
                            </Badge>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-0.5">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors group relative overflow-hidden"
                                >
                                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="font-medium">{item.label}</span>
                                    {/* Subtle hover gleam */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </button>
                            ))}
                        </div>

                        {/* CTA Section */}
                        {user.role === 'customer' && (
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        navigate('/become-vendor');
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 hover:border-primary/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Store className="w-4 h-4 text-primary" />
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-primary">Become a Vendor</span>
                                            <span className="block text-[10px] text-muted-foreground">Start earning today</span>
                                        </div>
                                    </div>
                                    <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-2 border-t border-border/50 bg-muted/30">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium">Sign out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
