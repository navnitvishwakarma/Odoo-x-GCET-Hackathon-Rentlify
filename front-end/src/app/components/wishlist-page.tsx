import { motion, AnimatePresence } from "motion/react";
import {
    Heart,
    ShoppingCart,
    ChevronLeft,
    X,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

const INITIAL_WISHLIST = [
    {
        id: 1,
        name: "Eames Lounge Chair & Ottoman",
        rentPrice: "1,200",
        buyPrice: "85,000",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600",
        category: "Lounge"
    },
    {
        id: 2,
        name: "MacBook Pro 14 M3 Max",
        rentPrice: "4,500",
        buyPrice: "2,45,000",
        image: "https://images.unsplash.com/photo-1517336714467-d23663c76746?auto=format&fit=crop&q=80&w=600",
        category: "Appliances"
    },
    {
        id: 3,
        name: "Dyson V11 Absolute",
        rentPrice: "1,100",
        buyPrice: "52,000",
        image: "https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=600",
        category: "Appliances"
    },
    {
        id: 4,
        name: "Herman Miller Aeron",
        rentPrice: "2,500",
        buyPrice: "1,10,000",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
        category: "Office"
    }
];

export function WishlistPage({ items, onBack, onRemove, onAddToCart, onMoveAllToCart }: {
    items: any[],
    onBack: () => void,
    onRemove?: (product: any) => void,
    onAddToCart?: (product: any) => void,
    onMoveAllToCart?: () => void
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Continue browsing</span>
                </button>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-12">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-serif italic tracking-tight">Your Wishlist</h1>
                            <p className="text-muted-foreground">Keep track of items you love. {items.length} items saved.</p>
                        </div>
                        {items.length > 0 && (
                            <Button
                                onClick={onMoveAllToCart}
                                variant="outline"
                                className="rounded-full px-8 py-6 h-auto text-base"
                            >
                                Move All to Cart
                            </Button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                                <Heart className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-medium tracking-tight">Your wishlist is empty</h2>
                                <p className="text-muted-foreground">Items you save will appear here for you to rent or buy later.</p>
                            </div>
                            <Button onClick={onBack} className="rounded-full px-10 h-12">Start Exploring</Button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group flex flex-col h-full bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
                                    >
                                        {/* Image Area */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-white/80 backdrop-blur-md text-foreground border-none px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            <button
                                                onClick={() => onRemove?.(item)}
                                                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>

                                            {/* Action Overlays */}
                                            <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col gap-2">
                                                <Button onClick={() => onAddToCart?.(item)} className="w-full bg-white text-foreground hover:bg-primary hover:text-white h-12 rounded-xl border-none shadow-xl">
                                                    Move to Cart
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-medium tracking-tight group-hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-sm text-muted-foreground italic font-serif">Starts at</p>
                                                    <p className="text-xl font-medium">₹{item.rentPrice}<span className="text-[10px] font-sans font-normal text-muted-foreground">/mo</span></p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-border">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Buy Price</p>
                                                    <p className="font-medium text-sm">₹{item.buyPrice}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button variant="secondary" className="rounded-xl h-11 text-xs">Rent Now</Button>
                                                    <Button variant="outline" className="rounded-xl h-11 text-xs">Buy Now</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Featured Recommendation Placeholder */}
                {items.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-primary/5 via-secondary/30 to-background border border-border flex flex-col md:flex-row items-center justify-between gap-12"
                    >
                        <div className="space-y-6 max-w-xl">
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-semibold uppercase tracking-[0.2em]">Exclusive Offer</span>
                            </div>
                            <h2 className="text-4xl font-serif">Bundle your wishlist items and save up to 15% on monthly rent.</h2>
                            <p className="text-muted-foreground text-lg italic">Premium lifestyle, simplified. Upgrade your space today.</p>
                            <Button className="rounded-full h-14 px-10 text-lg group">
                                View Bundles <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                        <div className="w-full md:w-[400px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl skew-y-3">
                            <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800" alt="Special Offer" className="w-full h-full object-cover" />
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
