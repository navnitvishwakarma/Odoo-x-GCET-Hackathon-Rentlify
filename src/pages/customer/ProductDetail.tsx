import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { mockReviews } from '@/data/mock-data';
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
  Loader2,
  Users,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useProduct } from '@/hooks/useProducts';
import { AvailabilityTimeline } from '@/components/availability-timeline';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalDuration, setRentalDuration] = useState<'day' | 'week' | 'month'>('day');
  const [isGroupRent, setIsGroupRent] = useState(false);
  const [groupSize, setGroupSize] = useState(2);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">
          {isError ? 'Failed to load product' : 'Product not found'}
        </p>
        <Button onClick={() => navigate('/listings')} className="mt-4">
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
        onClick={() => navigate('/listings')}
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
                src={product.images[selectedImage]}
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
                  className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ImageWithFallback
                    src={product.images[0]}
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
                                className={`w-4 h-4 ${star <= Math.round(product.rating)
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
                                      className={`w-3 h-3 ${star <= review.rating
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
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl text-primary font-bold">
                    ${isGroupRent ? (price / groupSize).toFixed(0) : price}
                  </span>
                  <span className="text-muted-foreground">
                    / {rentalDuration} {isGroupRent && <span className="text-sm font-medium text-blue-600">per person</span>}
                  </span>
                </div>

                {/* Damage Protection Badge (Innovation) */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-4 border border-emerald-100 dark:border-emerald-800 cursor-help" title="Comprehensive coverage for accidental damage">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Rentlify Protected: Coverage up to $10,000</span>
                </div>

                {/* Duration Selection */}
                <div className="grid grid-cols-3 gap-2 mb-6">
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

                {/* Rent Together Feature (Innovation) */}
                <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Rent Together</span>
                        <span className="text-[10px] text-muted-foreground">Split costs with friends</span>
                      </div>
                    </div>
                    <Switch checked={isGroupRent} onCheckedChange={setIsGroupRent} />
                  </div>

                  {isGroupRent && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Group Size</span>
                        <span className="font-bold">{groupSize} people</span>
                      </div>
                      <Slider
                        value={[groupSize]}
                        onValueChange={(val) => setGroupSize(val[0])}
                        min={2}
                        max={10}
                        step={1}
                        className="mb-1"
                      />
                      <div className="text-[10px] text-muted-foreground text-center mt-2">
                        You save ${(price - (price / groupSize)).toFixed(0)} by splitting!
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability Timeline (New Feature) */}
                <div className="mb-6">
                  <AvailabilityTimeline />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!product.available}
                    onClick={() => navigate(`/booking/${product.id}`)}
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

                {/* Chat Smart Prompts (Innovation) */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    Chat with Vendor
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Is this available tomorrow?', 'Any discount for 3 days?', 'Pickup or delivery?'].map((msg) => (
                      <button
                        key={msg}
                        className="text-[10px] px-3 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-full transition-colors border border-border"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full text-xs h-9">
                    Start Conversation
                  </Button>
                </div>
              </div>

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
