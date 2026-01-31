import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserProfileMenu } from '@/components/common/UserProfileMenu';

export function Header() {
  const { user, isDarkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York, NY');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/listings');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Left: Logo */}
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/') : '/'}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="bg-primary text-primary-foreground w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">R</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary leading-none">Rentlify</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Rent & Earn</p>
          </div>
        </Link>

        {/* Center: Search Bar */}
        {!isAuthPage && (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search for cameras, laptops, furniture, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-11 bg-muted/50 border-transparent focus:bg-background focus:border-input rounded-full transition-all shadow-sm"
              />
            </div>
          </form>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" onClick={() => setCurrentLocation('New York, NY')}>
            <MapPin className="w-4 h-4" />
            <span>{currentLocation}</span>
          </div>

          <div className="h-4 w-px bg-border hidden md:block"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <>
              {user.role === 'customer' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {/* Badge logic here if needed */}
                </Button>
              )}

              <UserProfileMenu />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-primary">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
