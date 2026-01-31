import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Search, 
  Menu, 
  User, 
  Heart, 
  ShoppingCart,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  MapPin,
} from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Badge } from '@/app/components/ui/badge';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, isDarkMode, toggleDarkMode, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('New York, NY');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('listings');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Location:</span>
              <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                <span className="underline">{location}</span>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {user?.role === 'customer' && (
                <Button 
                  variant="ghost" 
                  className="h-auto p-0 text-sm hover:bg-transparent"
                  onClick={() => onNavigate('vendor-signup')}
                >
                  Become a Vendor
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="h-auto p-0 text-sm hover:bg-transparent"
              >
                Help & Support
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div 
            className="cursor-pointer flex items-center gap-2"
            onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'vendor' ? 'vendor-dashboard' : 'home') : 'home')}
          >
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-xl">R</span>
            </div>
            <div>
              <h1 className="text-xl text-primary">RentEarn</h1>
              <p className="text-xs text-muted-foreground">Rent & Earn</p>
            </div>
          </div>

          {/* Search Bar */}
          {currentPage !== 'login' && currentPage !== 'signup' && (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for cameras, laptops, furniture, vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 bg-input-background border-border"
                />
              </div>
            </form>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full relative"
                      onClick={() => onNavigate('wishlist')}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full relative"
                      onClick={() => onNavigate('cart')}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                        0
                      </Badge>
                    </Button>
                  </>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      if (user.role === 'admin') onNavigate('admin-dashboard');
                      else if (user.role === 'vendor') onNavigate('vendor-dashboard');
                      else onNavigate('customer-dashboard');
                    }}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button onClick={() => onNavigate('signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
