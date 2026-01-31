import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ProductCard } from '@/app/components/product-card';
import { mockProducts, categories } from '@/app/data/mock-data';
import {
  Search,
  Shield,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredProducts = mockProducts.slice(0, 4);
  const popularProducts = mockProducts.slice(4, 8);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-accent-foreground">
              Trusted by 50,000+ users worldwide
            </Badge>
            <h1 className="text-5xl mb-6">
              Rent Anything. Earn Everything.
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From cameras to cars, furniture to tools - rent what you need or list what you own. Join the sharing economy today.
            </p>

            {/* Hero Search */}
            <div className="bg-card p-2 rounded-lg shadow-lg max-w-2xl mx-auto border border-border">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="What do you want to rent?"
                    className="border-0 bg-input-background h-12"
                  />
                </div>
                <Button size="lg" className="h-12 px-8" onClick={() => onNavigate('listings')}>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl text-primary mb-1">10K+</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-primary mb-1">4.8★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">Browse by Category</h2>
            <p className="text-muted-foreground">
              Explore thousands of items across popular categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border"
                onClick={() => onNavigate('listings')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 text-primary">
                      {/* Icon placeholder */}
                      <div className="w-full h-full bg-primary/20 rounded"></div>
                    </div>
                  </div>
                  <h3 className="text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">100+ items</p>
                </CardContent>
              </Card>
            ))}
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
            <Button variant="outline" onClick={() => onNavigate('listings')}>
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate('product-detail', product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">How It Works</h2>
            <p className="text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border border-border">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl">
                  1
                </div>
                <h3 className="mb-2">Browse & Search</h3>
                <p className="text-sm text-muted-foreground">
                  Find the perfect item from thousands of listings in your area
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl">
                  2
                </div>
                <h3 className="mb-2">Book & Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Select your rental period and complete secure payment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border border-border">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl">
                  3
                </div>
                <h3 className="mb-2">Enjoy & Return</h3>
                <p className="text-sm text-muted-foreground">
                  Use the item and return it when you're done. It's that simple!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular This Week */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl mb-2">Popular This Week</h2>
              <p className="text-muted-foreground">Most rented items in your area</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate('product-detail', product.id)}
              />
            ))}
          </div>
        </div>
      </section>

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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">Start Earning with Your Items</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            List your unused items and turn them into income. Join thousands of vendors already earning on RentEarn.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Become a Vendor
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('listings')}>
              Browse Rentals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
