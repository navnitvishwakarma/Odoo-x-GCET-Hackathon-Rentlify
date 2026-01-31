import { motion } from "motion/react";
import { useState } from "react";
import { Heart, Share2, Info, CheckCircle2, Truck, Wrench, ShieldCheck, ChevronRight, Star } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface ProductImage {
  url: string;
  alt: string;
}

const productImages: ProductImage[] = [
  {
    url: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Gaming Laptop Pro - Main View",
  },
  {
    url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Gaming Laptop Pro - Side View",
  },
  {
    url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Gaming Laptop Pro - Ports",
  },
  {
    url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Gaming Laptop Pro - Performance",
  },
];

const reviews = [
  { id: 1, user: "Alex M.", rating: 5, comment: "Incredible performance for the price. Renting was the best decision!", date: "2 weeks ago" },
  { id: 2, user: "Sarah L.", rating: 4, comment: "Very clean and like new. Setup was easy.", date: "1 month ago" },
];

export function ProductDetailsPage({ onBack, onRentNow, onWishlistClick, onAddToCart }: {
  onBack: () => void;
  onRentNow?: (product: any, duration: string) => void;
  onWishlistClick?: (product?: any) => void;
  onAddToCart?: (product: any) => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [duration, setDuration] = useState("6");
  const [isLiked, setIsLiked] = useState(false);

  const product = {
    name: "Gaming Laptop Pro",
    category: "Electronics",
    condition: "Like New",
    availability: "Available for delivery today",
    rentPrice: 3500,
    buyPrice: 85000,
    itemCount: 152,
    rating: 4.8,
    reviewCount: 124,
    description: "Experience ultimate performance with the Gaming Laptop Pro. Equipped with the latest generation processor and high-end graphics card, it's perfect for both gaming and intensive creative work. Rent it for a fraction of the cost or own it outright.",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <nav className="py-6 px-6 md:px-12 flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight className="w-4 h-4" />
        <span>{product.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <main className="px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-card border border-border"
            >
              <ImageWithFallback
                src={productImages[selectedImage].url}
                alt={productImages[selectedImage].alt}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <ImageWithFallback src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Past Buys & Reviews Section */}
            <div className="mt-12 space-y-8">
              <Separator />
              <div className="space-y-4">
                <h3 className="text-2xl">What people are saying</h3>
                <div className="flex items-center gap-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-current" : ""}`} />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 rounded-2xl bg-card border border-border space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{review.user}</span>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-500 scale-75 origin-left">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Info Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl md:text-5xl tracking-tight mb-2">{product.name}</h1>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="rounded-full">{product.condition}</Badge>
                      <Badge variant="outline" className="rounded-full text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready to ship
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full border border-border"
                      onClick={() => {
                        setIsLiked(!isLiked);
                        onWishlistClick?.(product);
                      }}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full border border-border">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-secondary/30 border border-border space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rental price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-medium">₹{product.rentPrice.toLocaleString()}</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Buy Price</p>
                      <p className="text-xl font-medium">₹{product.buyPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Rental duration</label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger className="w-full h-12 rounded-xl bg-card">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months (Best Value)</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="24">24 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Refundable Security Deposit
                    </span>
                    <span>₹2,500</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total monthly payment</span>
                    <span>₹{(product.rentPrice * (1 + (parseInt(duration) > 6 ? 0 : 0.05))).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid gap-3 pt-2">
                  <Button
                    onClick={() => onRentNow?.(product, duration)}
                    className="w-full h-14 rounded-full text-lg font-medium shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
                  >
                    Rent Now
                  </Button>
                  <Button
                    onClick={() => onAddToCart?.(product)}
                    variant="outline"
                    className="w-full h-14 rounded-full text-lg font-medium border-primary/20 hover:bg-primary/5 transition-all"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                  <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-medium">Free Delivery</h4>
                    <p className="text-xs text-muted-foreground">Arrives within 24-48 hours</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-medium">Pro Installation</h4>
                    <p className="text-xs text-muted-foreground">Certified technician included</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
                <Info className="w-4 h-4 shrink-0" />
                <p>Prices include GST. Optional damage protection available at checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
