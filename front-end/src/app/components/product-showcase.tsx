import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Heart, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/app/components/ui/badge";
import { api } from "@/app/services/api";
import { forwardRef } from "react";
import { FilterState } from "./filter-sidebar";

interface Product {
  id: string; // Changed from number to string for MongoDB ObjectId
  name: string;
  category: string;
  image: string;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
  condition: string;
}

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
      className="group cursor-pointer h-full"
    >
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border h-full flex flex-col">
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
        <div className="p-6 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="text-xl line-clamp-2">{product.name}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Hourly</p>
              <p className="text-base font-semibold">₹{product.hourlyPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Daily</p>
              <p className="text-base font-semibold">₹{product.dailyPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly</p>
              <p className="text-base font-semibold">₹{product.weeklyPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

export function ProductShowcase({ filters, onProductClick, onWishlistClick, onAddToCart }: {
  filters: FilterState,
  onProductClick?: () => void,
  onWishlistClick?: (product: any) => void,
  onAddToCart?: (product: any) => void
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Assuming the API returns { data: { products: [...] } } or similar standard response
        // Need to verify backend response structure. Usually it's data.results or just data.
        // I'll assume standard { data: [...] } or { results: [...] } based on common patterns.
        const response = await api.get('/products');

        // Map backend data to frontend model
        // successResponse returns { success: true, data: [...] }
        const productsList = response.data.data || [];

        const mappedProducts = productsList.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          category: p.category,
          image: p.images?.[0] || 'https://via.placeholder.com/300',
          hourlyPrice: p.pricing?.hourly || 0,
          dailyPrice: p.pricing?.daily || 0,
          weeklyPrice: p.pricing?.weekly || 0,
          condition: p.attributes?.find((a: any) => a.key === 'Condition')?.value || 'New'
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    // Category Filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price Filter (Using daily price as a proxy for the range)
    if (product.dailyPrice < filters.minPrice || product.dailyPrice > filters.maxPrice) {
      return false;
    }

    // Condition Filter
    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

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