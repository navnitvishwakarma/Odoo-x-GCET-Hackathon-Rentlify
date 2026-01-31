import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { mockProducts, categories } from '@/data/mock-data';
import {
  Search,
  Shield,
  DollarSign,
  Users,
  Star,
  ChevronRight,
  Camera,
  Laptop,
  Armchair,
  Car,
  Wrench,
  PartyPopper,
  Calendar,
  Smile,
} from 'lucide-react';
import { SustainabilityTracker } from '@/components/sustainability-tracker';
import { CategoryStories } from '@/components/category-stories';
import { RecommendationWidget } from '@/components/recommendation-widget';
import { CommunityMap } from '@/components/community-map';
import { PopularItemsSection } from '@/components/popular-items-section';
// import { ImageWithFallback } from '@/components/figma/ImageWithFallback'; // Unused

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Laptop,
  Armchair,
  Car,
  Wrench,
  PartyPopper,
};

export function HomePage() {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.slice(0, 4);

  const [isAIWidgetOpen, setAIWidgetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/listings');
    }
  };

  const handleCategorySelect = (id: string | null) => {
    if (id) {
      navigate(`/listings?category=${id}`);
      return;
    }
    // ... existing logic for AI widget if no ID?
    // Actually the CategoryStories uses it differently.
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[url('/images/hero-bg-custom.png')] bg-cover bg-center">
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.55)] to-[rgba(0,0,0,0.75)] z-0"></div>

        <div className="container relative z-10 mx-auto px-4 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg leading-tight">
              Rent Anything. <br className="hidden md:block" />
              <span className="text-white">Earn Everything.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
              The community marketplace for renting cameras, tools, tech, and more.
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-3xl"
          >
            <div className="relative group">
              {/* Search Container */}
              <div className="relative flex items-center w-full h-16 md:h-20 rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 hover:bg-black/40 hover:border-white/30 focus-within:bg-black/50 focus-within:border-white/40 focus-within:ring-2 focus-within:ring-white/20">
                <div className="pl-6 md:pl-8 text-white/70">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="What do you need today?"
                  className="flex-1 w-full h-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-lg px-4 md:px-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="pr-2 md:pr-3">
                  <Button
                    size="lg"
                    className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-none text-lg font-medium shadow-lg hover:shadow-blue-500/25 transition-all"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Category Chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            {['Cameras', 'Drones', 'Projectors', 'E-Bikes', 'Camping'].map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="px-6 py-2.5 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white/90 text-sm font-medium hover:bg-white/20 hover:border-white/50 hover:text-white transition-all duration-300 shadow-sm"
                  onClick={() => navigate(`/listings?search=${tag.toLowerCase()}`)}
                >
                  {tag}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Recommendation Widget (New Innovation) */}
      <RecommendationWidget
        isOpen={isAIWidgetOpen}
        onOpenChange={setAIWidgetOpen}
        defaultActivity="trip"
      />

      {/* Category Stories (New Innovation) */}
      <CategoryStories onSelectCategory={handleCategorySelect} />

      {/* Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">
              Explore thousands of items across popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Search;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-background/50 hover:bg-background"
                  onClick={() => navigate(`/listings?category=${category.id}`)}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center h-40">
                    <div className="w-14 h-14 mb-4 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2">Featured Rentals</h2>
              <p className="text-muted-foreground">Hand-picked items for you</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/listings')}>
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product-detail/${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Proof Map (New Innovation) */}
      <CommunityMap />

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border border-border/50 bg-background/50 hover:bg-background transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Browse & Search</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find the perfect item from thousands of listings in your area. Filter by price, location, and category.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/50 bg-background/50 hover:bg-background transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-100/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Book & Pay</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Select your rental dates and complete secure payment. Your money is held safely until the rental starts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border/50 bg-background/50 hover:bg-background transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                  <Smile className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Enjoy & Return</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pick up your item or get it delivered. Use it for your project and return it when you're done!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular This Week (Redesigned) */}
      <PopularItemsSection />

      {/* Trust Indicators */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <Shield className="w-12 h-12 mx-auto mb-3" />
              <h3 className="mb-2">Secure Payments</h3>
              <p className="text-sm opacity-90">
                Protected transactions with escrow service
              </p>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-3" />
              <h3 className="mb-2">Verified Reviews</h3>
              <p className="text-sm opacity-90">
                Real reviews from verified renters
              </p>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-3" />
              <h3 className="mb-2">Trusted Community</h3>
              <p className="text-sm opacity-90">
                Background-checked vendors and renters
              </p>
            </div>
            <div>
              <DollarSign className="w-12 h-12 mx-auto mb-3" />
              <h3 className="mb-2">Best Prices</h3>
              <p className="text-sm opacity-90">
                Competitive rates with no hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Tracker (New Innovation) */}
      <SustainabilityTracker />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">Start Earning with Your Items</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            List your unused items and turn them into income. Join thousands of vendors already earning on Rentlify.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup?role=vendor')}>
              Become a Vendor
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/listings')}>
              Browse Rentals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
