import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface FeaturedProduct {
  id: number;
  name: string;
  image: string;
  hourlyPrice: number;
  dailyPrice: number;
  weeklyPrice: number;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: 1,
    name: "Gaming Laptop Pro",
    image: "https://images.unsplash.com/photo-1673431738089-c4fc9c2e96a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMGRlc2slMjBzZXR1cHxlbnwxfHx8fDE3Njk4Mzk1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 120,
    dailyPrice: 850,
    weeklyPrice: 4500,
  },
  {
    id: 2,
    name: "Premium Audio Speaker",
    image: "https://images.unsplash.com/photo-1758411898478-4f7e70d533d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3BlYWtlciUyMGF1ZGlvJTIwc3lzdGVtfGVufDF8fHx8MTc2OTgzOTU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 80,
    dailyPrice: 550,
    weeklyPrice: 2800,
  },
  {
    id: 3,
    name: "DSLR Camera Kit",
    image: "https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3Njk3NTEwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hourlyPrice: 100,
    dailyPrice: 700,
    weeklyPrice: 3800,
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667312939978-64cf31718a6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwbGl2aW5nJTIwcm9vbSUyMGZ1cm5pdHVyZSUyMGJlaWdlfGVufDF8fHx8MTc2OTgzNzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight">
                Live comfortably,
                <br />
                <span className="text-muted-foreground">on your terms</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
                Rent premium furniture and appliances by the hour, day, or week. 
                Flexible rentals for every need.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Browse Furniture
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-card border border-border rounded-full hover:bg-secondary/50 transition-all"
              >
                Browse Appliances
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Floating Product Cards */}
          <div className="hidden lg:flex flex-col gap-6 items-end">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="w-80 bg-card rounded-3xl overflow-hidden shadow-xl border border-border/50 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl">{product.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Hourly</p>
                      <p className="text-sm">₹{product.hourlyPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Daily</p>
                      <p className="text-sm">₹{product.dailyPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Weekly</p>
                      <p className="text-sm">₹{product.weeklyPrice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}