import { Header } from "@/app/components/header";
import { HeroSection } from "@/app/components/hero-section";
import { CategorySection } from "@/app/components/category-section";
import { BrowseSection } from "@/app/components/browse-section";
import { Footer } from "@/app/components/footer";
import { ProductDetailsPage } from "@/app/components/product-details-page";
import { CartPage } from "@/app/components/cart-page";
import { CheckoutPage } from "@/app/components/checkout-page";
import { ProfilePage } from "@/app/components/profile-page";
import { OrderTrackingPage } from "@/app/components/order-tracking-page";
import { WishlistPage } from "@/app/components/wishlist-page";
import { SupportPage } from "@/app/components/support-page";
import { useState, useRef } from "react";
import { FilterState } from "@/app/components/filter-sidebar";

interface CartItem {
  id: number;
  name: string;
  image: string;
  type: "rent" | "buy";
  price: number;
  duration?: string;
  quantity: number;
  deposit?: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "product" | "cart" | "checkout" | "profile" | "tracking" | "wishlist" | "support">("home");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    minPrice: 0,
    maxPrice: 10000,
    duration: "Any",
    conditions: [],
  });

  const [rentalData, setRentalData] = useState<{ product: any, duration: string } | null>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const browseRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (category: string) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      categories: prev.categories.includes(category) ? prev.categories : [...prev.categories, category],
    }));
    browseRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRentNow = (product: any, duration: string) => {
    setRentalData({ product, duration });
    setCurrentPage("checkout");
  };

  const handleToggleWishlist = (product: any) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
    setCurrentPage("wishlist");
  };

  const getPrice = (product: any, type: "rent" | "buy"): number => {
    if (type === "rent") {
      const price = product.rentPrice || product.dailyPrice || 0;
      return typeof price === 'string' ? parseInt(price.replace(/,/g, '')) : price;
    } else {
      const price = product.buyPrice || product.weeklyPrice * 20 || 85000; // Use weeklyPrice * 20 as a fallback or a default
      return typeof price === 'string' ? parseInt(price.replace(/,/g, '')) : price;
    }
  };

  const handleAddToCart = (product: any, type: "rent" | "buy" = "buy") => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id && item.type === type);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id && item.type === type
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        type: type,
        price: getPrice(product, type),
        quantity: 1,
        duration: type === "rent" ? "6" : undefined,
        deposit: type === "rent" ? 2500 : undefined,
      };
      return [...prev, newItem];
    });
    setCurrentPage("cart");
  };

  const handleMoveFromWishlistToCart = (product: any) => {
    handleAddToCart(product, "buy");
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => {
      setCartItems((prev) => {
        const type = "buy";
        const exists = prev.find((item) => item.id === product.id && item.type === type);
        if (exists) {
          return prev.map((item) =>
            item.id === product.id && item.type === type
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          image: product.image,
          type: type,
          price: getPrice(product, type),
          quantity: 1,
        };
        return [...prev, newItem];
      });
    });
    setWishlist([]);
    setCurrentPage("cart");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onHomeClick={() => setCurrentPage("home")}
        onCartClick={() => setCurrentPage("cart")}
        onProfileClick={() => setCurrentPage("profile")}
        onWishlistClick={() => setCurrentPage("wishlist")}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
      />
      <main>
        {currentPage === "home" ? (
          <>
            <HeroSection />
            <CategorySection onCategorySelect={handleCategorySelect} />
            <div ref={browseRef}>
              <BrowseSection
                filters={filters}
                onFilterChange={setFilters}
                onProductClick={() => setCurrentPage("product")}
                onWishlistClick={handleToggleWishlist}
                onAddToCart={(product) => handleAddToCart(product, "buy")}
              />
            </div>
          </>
        ) : currentPage === "product" ? (
          <ProductDetailsPage
            onBack={() => setCurrentPage("home")}
            onRentNow={handleRentNow}
            onWishlistClick={(product) => handleToggleWishlist(product || {
              id: 1, // Mock ID for current product
              name: "Gaming Laptop Pro",
              rentPrice: "3,500",
              buyPrice: "85,000",
              image: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?auto=format&fit=crop&q=80&w=1080",
              category: "Electronics"
            })}
            onAddToCart={(product) => handleAddToCart(product, "buy")}
          />
        ) : currentPage === "cart" ? (
          <CartPage
            items={cartItems}
            onUpdateItems={setCartItems}
            onBack={() => {
              setRentalData(null);
              setCurrentPage("home");
            }}
            onCheckout={() => {
              setRentalData(null);
              setCurrentPage("checkout");
            }}
          />
        ) : currentPage === "checkout" ? (
          <CheckoutPage
            rentalData={rentalData}
            onBack={() => {
              if (rentalData) {
                setCurrentPage("product");
              } else {
                setCurrentPage("cart");
              }
            }}
          />
        ) : currentPage === "profile" ? (
          <ProfilePage
            onBack={() => setCurrentPage("home")}
            onTrackOrder={() => setCurrentPage("tracking")}
          />
        ) : currentPage === "tracking" ? (
          <OrderTrackingPage onBack={() => setCurrentPage("profile")} />
        ) : currentPage === "wishlist" ? (
          <WishlistPage
            items={wishlist}
            onBack={() => setCurrentPage("home")}
            onRemove={handleToggleWishlist}
            onAddToCart={handleMoveFromWishlistToCart}
            onMoveAllToCart={handleMoveAllToCart}
          />
        ) : (
          <SupportPage onBack={() => setCurrentPage("home")} />
        )}
      </main>
      <Footer onSupportClick={() => setCurrentPage("support")} />
    </div>
  );
}
