import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockProducts } from '@/data/mock-data';

export function PopularItemsSection() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll for mobile
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel || window.innerWidth >= 768) return;

        let scrollInterval: NodeJS.Timeout;

        const startScroll = () => {
            scrollInterval = setInterval(() => {
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carousel.scrollBy({ left: 300, behavior: 'smooth' });
                }
            }, 3000);
        };

        startScroll();

        // Pause on interaction
        const stopScroll = () => clearInterval(scrollInterval);

        carousel.addEventListener('touchstart', stopScroll);
        carousel.addEventListener('touchend', startScroll);

        return () => {
            clearInterval(scrollInterval);
            carousel?.removeEventListener('touchstart', stopScroll);
            carousel?.removeEventListener('touchend', startScroll);
        };
    }, [isLoading]);

    const popularProducts = mockProducts.slice(4, 8);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-muted/20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-3xl font-bold tracking-tight">Popular This Week</h2>
                            {/* Fire Icon Animation */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="text-2xl">🔥</span>
                            </motion.div>
                        </div>
                        <p className="text-muted-foreground text-lg">Most rented items in your area</p>
                    </div>

                    <Button variant="ghost" className="hidden md:flex group" onClick={() => navigate('/listings')}>
                        View all
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {/* Content */}
                <div
                    ref={carouselRef}
                    className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto pb-8 md:pb-0 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                >
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            // Skeleton Loading State
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={`skeleton-${i}`} className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center">
                                    <div className="border rounded-2xl p-4 space-y-4 bg-white shadow-sm">
                                        <Skeleton className="h-48 w-full rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Product Cards
                            popularProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center"
                                >
                                    <ProductCard
                                        product={product}
                                        onClick={() => navigate(`/product-detail/${product.id}`)}
                                        isTrending={index < 2} // Top 2 are trending
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile View All */}
                <div className="mt-6 md:hidden text-center">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/listings')}>
                        View all items
                    </Button>
                </div>
            </div>
        </section>
    );
}
