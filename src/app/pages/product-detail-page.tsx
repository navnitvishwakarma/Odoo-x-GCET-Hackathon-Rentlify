import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Progress } from '@/app/components/ui/progress';
import { mockProducts, mockReviews } from '@/app/data/mock-data';
import {
  MapPin,
  Star,
  Shield,
  Clock,
  Calendar,
  Check,
  Heart,
  Share2,
  ChevronLeft,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = mockProducts.find((p) => p.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalDuration, setRentalDuration] = useState<'day' | 'week' | 'month'>('day');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={() => onNavigate('listings')} className="mt-4">
          Back to Listings
        </Button>
      </div>
    );
  }

  const productReviews = mockReviews.filter((r) => r.productId === product.id);
  const price = product.price[rentalDuration === 'day' ? 'perDay' : rentalDuration === 'week' ? 'perWeek' : 'perMonth'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => onNavigate('listings')}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <ImageWithFallback
                src={`https://source.unsplash.com/1200x800/?${product.images[selectedImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-white/90 text-foreground text-lg py-2 px-4">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ImageWithFallback
                    src={`https://source.unsplash.com/400x300/?${product.images[0]},${index + 1}`}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Details Tabs */}
            <Card className="mt-6">
              <Tabs defaultValue="description">
                <CardContent className="pt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <h3 className="mb-3">About this item</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="capitalize">{product.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p>{product.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                        <p className="text-primary">${product.securityDeposit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Availability</p>
                        <Badge variant={product.available ? 'default' : 'secondary'} className={product.available ? 'bg-accent' : ''}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="mt-6">
                    <h3 className="mb-4">Key Features</h3>
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    {/* Rating Summary */}
                    <div className="mb-6 p-6 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-4xl mb-1">{product.rating}</div>
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <span className="text-sm w-12">{rating} star</span>
                              <Progress value={rating === 5 ? 80 : rating === 4 ? 60 : 20} className="flex-1" />
                              <span className="text-sm text-muted-foreground w-12 text-right">
                                {rating === 5 ? '80%' : rating === 4 ? '60%' : '20%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {productReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm">{review.userName}</h4>
                                  <span className="text-xs text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="flex gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-3 h-3 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-muted'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              {/* Vendor Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {product.vendorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">Listed by</p>
                  <h4 className="text-sm">{product.vendorName}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>4.9 (89 reviews)</span>
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl text-primary">${price}</span>
                  <span className="text-muted-foreground">/ {rentalDuration}</span>
                </div>

                {/* Duration Selection */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <Button
                    variant={rentalDuration === 'day' ? 'default' : 'outline'}
                    onClick={() => setRentalDuration('day')}
                    className="flex flex-col h-auto py-2"
                  >
                    <span className="text-xs">Daily</span>
                    <span className="text-sm">${product.price.perDay}</span>
                  </Button>
                  <Button
                    variant={rentalDuration === 'week' ? 'default' : 'outline'}
                    onClick={() => setRentalDuration('week')}
                    className="flex flex-col h-auto py-2"
                  >
                    <span className="text-xs">Weekly</span>
                    <span className="text-sm">${product.price.perWeek}</span>
                  </Button>
                  <Button
                    variant={rentalDuration === 'month' ? 'default' : 'outline'}
                    onClick={() => setRentalDuration('month')}
                    className="flex flex-col h-auto py-2"
                  >
                    <span className="text-xs">Monthly</span>
                    <span className="text-sm">${product.price.perMonth}</span>
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!product.available}
                  onClick={() => onNavigate('booking', product.id)}
                >
                  {product.available ? 'Rent Now' : 'Currently Unavailable'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Secure payment & deposit protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Flexible rental periods</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Free cancellation up to 24h</span>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Location */}
              <div>
                <h4 className="text-sm mb-2">Pickup Location</h4>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{product.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
