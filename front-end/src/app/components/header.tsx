import { Search, ShoppingCart, User, Heart, Menu, LogOut, LayoutDashboard, Settings, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

import { LocationModal } from "./location-modal";

export function Header({ cartCount, wishlistCount }: {
  cartCount?: number;
  wishlistCount?: number;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount: contextCartCount } = useCart();
  const displayCartCount = cartCount !== undefined ? cartCount : contextCartCount;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [locationName, setLocationName] = useState("Select Location");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link to={isAuthenticated && (user?.role === 'vendor') ? '/vendor' : (isAuthenticated && user?.role === 'admin' ? '/admin' : '/')} className="text-2xl font-serif italic tracking-tight hover:opacity-70 transition-opacity">Rentlify</Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" /> {locationName}
              </button>
              <Link to="/profile?tab=orders" className="hover:text-foreground transition-colors">My Orders</Link>
            </nav>
          </div>

          <div className="flex-1 max-w-xl hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <Input
                type="search"
                placeholder="Search premium furniture..."
                className="w-full h-11 pl-12 bg-secondary/50 border-none rounded-full focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors hidden sm:block relative"
              >
                <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                {wishlistCount !== undefined && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded-full hover:bg-secondary/50 transition-colors focus:outline-none"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {(user?.role === 'admin' || user?.role === 'vendor') && (
                    <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? '/admin' : '/vendor')} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
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
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            )}

            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {displayCartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
                    {displayCartCount}
                  </span>
                )}
              </motion.button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => setLocationName(loc)}
      />
    </>
  );
}