import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";

interface Category {
  id: number;
  name: string;
  image: string;
  itemCount: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Living Room Furniture",
    image: "https://images.unsplash.com/photo-1667312939978-64cf31718a6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwbGl2aW5nJTIwcm9vbSUyMGZ1cm5pdHVyZSUyMGJlaWdlfGVufDF8fHx8MTc2OTgzNzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 124,
  },
  {
    id: 2,
    name: "Bedroom Furniture",
    image: "https://images.unsplash.com/photo-1765862835282-cd3d9190d246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmVkcm9vbSUyMGZ1cm5pdHVyZSUyMG5ldXRyYWwlMjB0b25lc3xlbnwxfHx8fDE3Njk4Mzc2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 89,
  },
  {
    id: 3,
    name: "Electronics & Computers",
    image: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBzZXR1cHxlbnwxfHx8fDE3Njk4Mzk1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 152,
  },
  {
    id: 4,
    name: "Kitchen Appliances",
    image: "https://images.unsplash.com/photo-1758448755927-e5c5ae14790c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwa2l0Y2hlbiUyGFwcGxpYW5jZXMlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzY5ODM3NjA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 97,
  },
  {
    id: 5,
    name: "Dining Room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de208582?q=80&w=1080&auto=format&fit=crop",
    itemCount: 65,
  },
  {
    id: 6,
    name: "Home Appliances",
    image: "https://images.unsplash.com/photo-1624381987697-3f93d65ddeea?q=80&w=1080&auto=format&fit=crop",
    itemCount: 82,
  },
];

export function CategorySection({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(categories.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const totalItems = categories.length;
  // Triple items for infinite loop
  const loopCategories = [...categories, ...categories, ...categories];

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const onAnimationComplete = useCallback(() => {
    if (currentIndex >= totalItems * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalItems);
    } else if (currentIndex < totalItems) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalItems);
    }
  }, [currentIndex, totalItems]);

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-16"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl tracking-tight font-serif italic">
            Explore by category
          </h2>
          <p className="text-lg text-muted-foreground italic">
            Curated collections for every room and need
          </p>
        </div>

        <div className="relative px-4">
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-20 flex w-[calc(100%+2rem)] justify-between pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="p-4 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-2xl hover:bg-background transition-all pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="p-4 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-2xl hover:bg-background transition-all pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Carousel Viewport */}
          <div className="overflow-visible">
            <motion.div
              animate={{ x: `calc(-${currentIndex * 25}% - ${currentIndex * 6}px)` }}
              transition={isTransitioning ? { type: "spring", stiffness: 200, damping: 25 } : { duration: 0 }}
              onAnimationComplete={onAnimationComplete}
              className="flex gap-6"
            >
              {loopCategories.map((category, index) => (
                <motion.div
                  key={`${category.id}-${index}`}
                  className="w-[calc(25%-18px)] flex-shrink-0 group cursor-pointer"
                  whileHover={{ y: -10 }}
                  onClick={() => {
                    const nameMap: Record<string, string> = {
                      "Living Room Furniture": "Living Room",
                      "Bedroom Furniture": "Bedroom",
                      "Electronics & Computers": "Electronics",
                      "Kitchen Appliances": "Kitchen",
                      "Dining Room": "Dining",
                      "Home Appliances": "Home Appliances"
                    };
                    onCategorySelect(nameMap[category.name] || category.name);
                  }}
                >
                  <div className="relative overflow-hidden rounded-[2.5rem] aspect-[3/4] bg-card border border-border shadow-sm group-hover:shadow-2xl transition-all duration-700">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-medium mb-3 tracking-tight leading-tight">{category.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-px bg-primary/60" />
                        <span className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em]">
                          {category.itemCount} items
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}