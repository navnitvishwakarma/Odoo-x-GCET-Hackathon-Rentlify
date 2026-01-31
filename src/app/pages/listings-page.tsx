import React, { useState } from 'react';
import { ProductCard } from '@/app/components/product-card';
import { mockProducts, categories } from '@/app/data/mock-data';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Slider } from '@/app/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Search, SlidersHorizontal, Grid, List, X } from 'lucide-react';

interface ListingsPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export function ListingsPage({ onNavigate }: ListingsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(true);

  const filteredProducts = mockProducts.filter((product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Price filter
    if (product.price.perDay < priceRange[0] || product.price.perDay > priceRange[1]) {
      return false;
    }
    
    return true;
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 200]);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-2">Browse Rentals</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} items available
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-input-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || searchQuery || priceRange[0] > 0 || priceRange[1] < 200) && (
          <div className="flex gap-2 mt-4 flex-wrap items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategories.map((catId) => {
              const category = categories.find((c) => c.id === catId);
              return (
                <Badge key={catId} variant="secondary" className="gap-1">
                  {category?.name}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleCategory(catId)}
                  />
                </Badge>
              );
            })}
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSearchQuery('')}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <Label className="mb-3 block">Categories</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <label
                          htmlFor={category.id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="mb-3 block">
                    Price Range (per day)
                  </Label>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="mb-3 block">Location</Label>
                  <Input
                    type="text"
                    placeholder="Enter city or zip code"
                    className="bg-input-background"
                  />
                </div>

                {/* Availability */}
                <div>
                  <Label className="mb-3 block">Availability</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="available-now" defaultChecked />
                      <label htmlFor="available-now" className="text-sm cursor-pointer">
                        Available Now
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="available-soon" />
                      <label htmlFor="available-soon" className="text-sm cursor-pointer">
                        Available Soon
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Grid/List */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground mb-4">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No products found matching your criteria</p>
              </div>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </Card>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product-detail', product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
