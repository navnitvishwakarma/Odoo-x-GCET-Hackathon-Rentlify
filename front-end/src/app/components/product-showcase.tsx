import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Heart, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/app/components/ui/badge";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
  condition: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Gaming Laptop Pro",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBzZXR1cHxlbnwxfHx8fDE3Njk4Mzk1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 120,
    dailyPrice: 850,
    weeklyPrice: 4500,
    condition: "New",
  },
  {
    id: 2,
    name: "Premium Audio Speaker",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1758411898478-4f7e70d533d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3BlYWtlciUyMGF1ZGlvJTIwc3lzdGVtfGVufDF8fHx8MTc2OTgzOTU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 80,
    dailyPrice: 550,
    weeklyPrice: 2800,
    condition: "New",
  },
  {
    id: 3,
    name: "DSLR Camera Kit",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3Njk3NTEwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 100,
    dailyPrice: 700,
    weeklyPrice: 3800,
    condition: "New",
  },
  {
    id: 4,
    name: "Smart LED TV 55\"",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1579894098530-d369f6378042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxldmlzaW9uJTIwdHYlMjBzY3JlZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzY5ODM5NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 90,
    dailyPrice: 650,
    weeklyPrice: 3500,
    condition: "New",
  },
  {
    id: 5,
    name: "Washing Machine",
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1624381987697-3f93d65ddeea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXNoaW5nJTIwbWFjaGluZSUyMGxhdW5kcnl8ZW58MXx8fHwxNzY5Nzg3ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 70,
    dailyPrice: 450,
    weeklyPrice: 2300,
    condition: "New",
  },
  {
    id: 6,
    name: "Microwave Oven",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1608384156808-418b5c079968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3dhdmUlMjBvdmVuJTIwa2l0Y2hlbnxlbnwxfHx8fDE3Njk4MzYxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 40,
    dailyPrice: 250,
    weeklyPrice: 1300,
    condition: "Like New",
  },
  {
    id: 7,
    name: "Air Conditioner 1.5 Ton",
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBjb25kaXRpb25lciUyMGNvb2xpbmd8ZW58MXx8fHwxNzY5ODM5NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 60,
    dailyPrice: 400,
    weeklyPrice: 2000,
    condition: "New",
  },
  {
    id: 8,
    name: "Robot Vacuum Cleaner",
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1653990480360-31a12ce9723e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBjbGVhbmVyJTIwYXBwbGlhbmNlfGVufDF8fHx8MTc2OTgzOTU5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 50,
    dailyPrice: 350,
    weeklyPrice: 1800,
    condition: "New",
  },
  {
    id: 9,
    name: "Smart Refrigerator",
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1758488438758-5e2eedf769ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWZyaWdlcmF0b3IlMjBraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc2OTgzNzYwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 100,
    dailyPrice: 700,
    weeklyPrice: 3800,
    condition: "New",
  },
  {
    id: 10,
    name: "Luxury Velvet Sofa",
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 150,
    dailyPrice: 1200,
    weeklyPrice: 6500,
    condition: "New",
  },
  {
    id: 11,
    name: "Minimalist Coffee Table",
    category: "Living Room",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 40,
    dailyPrice: 300,
    weeklyPrice: 1800,
    condition: "Like New",
  },
  {
    id: 12,
    name: "Royal King Size Bed",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1505693419148-ad30b35ceb3a?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 180,
    dailyPrice: 1500,
    weeklyPrice: 8500,
    condition: "New",
  },
  {
    id: 13,
    name: "Modern Vanity Dresser",
    category: "Bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 60,
    dailyPrice: 500,
    weeklyPrice: 2800,
    condition: "New",
  },
  {
    id: 14,
    name: "Scandinavian Dining Set",
    category: "Dining",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de208582?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 200,
    dailyPrice: 1800,
    weeklyPrice: 10000,
    condition: "New",
  },
  {
    id: 15,
    name: "Industrial Sideboard",
    category: "Dining",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120ec?q=80&w=1080&auto=format&fit=crop",
    hourlyPrice: 50,
    dailyPrice: 450,
    weeklyPrice: 2500,
    condition: "Like New",
  },
];

import { forwardRef } from "react";

const ProductCard = forwardRef<HTMLDivElement, {
  product: Product,
  onClick?: () => void,
  onWishlistClick?: (product: Product) => void,
  onAddToCart?: (product: Product) => void
}>(({ product, onClick, onWishlistClick, onAddToCart }, ref) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border">
        {/* Product Image */}
        <div className="aspect-[4/5] overflow-hidden relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Condition Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full text-xs border border-border">
              {product.condition}
            </span>
          </div>

          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
              onWishlistClick?.(product);
            }}
            className="absolute top-4 right-4 p-2.5 bg-card/90 backdrop-blur-sm rounded-full border border-border hover:bg-card transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-foreground"
                }`}
            />
          </motion.button>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : 20 }}
            className="absolute bottom-4 left-4 right-4 flex flex-col gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                // We'd need a default duration or something if we want to rent from here
                // For now just triggering the click
                onClick?.();
              }}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-full transition-all shadow-lg text-sm font-medium"
            >
              Rent Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              className="w-full py-2.5 bg-card/90 backdrop-blur-sm text-foreground border border-border rounded-full transition-all shadow-lg text-sm font-medium hover:bg-card"
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="text-xl">{product.name}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Hourly</p>
              <p className="text-base">₹{product.hourlyPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily</p>
              <p className="text-base">₹{product.dailyPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly</p>
              <p className="text-base">₹{product.weeklyPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

import { FilterState } from "./filter-sidebar";

export function ProductShowcase({ filters, onProductClick, onWishlistClick, onAddToCart }: {
  filters: FilterState,
  onProductClick?: () => void,
  onWishlistClick?: (product: any) => void,
  onAddToCart?: (product: any) => void
}) {
  const filteredProducts = products.filter((product) => {
    // Category Filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price Filter (Using daily price as a proxy for the range)
    if (product.dailyPrice < filters.minPrice || product.dailyPrice > filters.maxPrice) {
      return false;
    }

    // Duration Filter
    if (filters.duration !== "Any") {
      // In a real app, products might have different prices for different durations
      // For now, we just assume all products match if they are not explicitly excluded
    }

    // Condition Filter
    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false;
    }

    return true;
  });

  return (
    <section className="py-2 px-6 md:px-0 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl tracking-tight font-serif italic">
              Featured collection
            </h2>
            <p className="text-muted-foreground italic">
              {filteredProducts.length} premium essentials found
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 rounded-full px-4 h-8 flex items-center">
              Newest First
            </Badge>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-medium tracking-tight">No products match your filters</h3>
              <p className="text-muted-foreground italic">Try adjusting your price range or selecting different categories.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onProductClick}
                  onWishlistClick={onWishlistClick}
                  onAddToCart={() => onAddToCart?.(product)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-card border border-border rounded-full hover:bg-secondary/50 transition-all text-sm font-medium tracking-tight"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </motion.div>
    </section>
  );
}