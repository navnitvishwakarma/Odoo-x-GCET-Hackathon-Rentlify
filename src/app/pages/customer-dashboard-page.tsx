import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { mockBookings, mockProducts } from '@/app/data/mock-data';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Heart,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Settings,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useApp } from '@/app/context/app-context';
import { Separator } from '@/app/components/ui/separator';

interface CustomerDashboardPageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export function CustomerDashboardPage({ onNavigate }: CustomerDashboardPageProps) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const userBookings = mockBookings.filter((b) => b.customerId === 'c1');
  const activeRentals = userBookings.filter((b) => b.status === 'active');
  const pastOrders = userBookings.filter((b) => b.status === 'completed');
  
  const savedItems = mockProducts.slice(0, 3);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Rentals</TabsTrigger>
          <TabsTrigger value="history">Rental History</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Rentals</p>
                    <p className="text-2xl">{activeRentals.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-2xl">{userBookings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saved Items</p>
                    <p className="text-2xl">{savedItems.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl">
                      ${userBookings.reduce((sum, b) => sum + b.totalPrice, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Rentals */}
          <Card>
            <CardHeader>
              <CardTitle>Current Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No active rentals</p>
                  <Button onClick={() => onNavigate('listings')}>Browse Items</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRentals.map((booking) => (
                    <div key={booking.id} className="flex gap-4 p-4 border border-border rounded-lg">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src={`https://source.unsplash.com/200x200/?${booking.productImage}`}
                          alt={booking.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="mb-1">{booking.productName}</h4>
                            <p className="text-sm text-muted-foreground">By {booking.vendorName}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-muted-foreground mb-1">Start Date</p>
                            <p>{booking.startDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">End Date</p>
                            <p>{booking.endDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Duration</p>
                            <p>{booking.duration} {booking.durationType}s</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Total</p>
                            <p className="text-primary">${booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Rentals Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentals.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No active rentals</p>
                  <Button onClick={() => onNavigate('listings')}>Start Renting</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRentals.map((booking) => (
                    <div key={booking.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src={`https://source.unsplash.com/300x300/?${booking.productImage}`}
                          alt={booking.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="mb-1">{booking.productName}</h3>
                            <p className="text-sm text-muted-foreground mb-2">Order #{booking.id}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Rental Period</p>
                            <p className="text-sm">{booking.startDate} to {booking.endDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                            <p className="text-sm">{booking.vendorName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                            <p className="text-sm text-primary">${booking.totalPrice}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Contact Vendor</Button>
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm" variant="outline">Extend Rental</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rental History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
            </CardHeader>
            <CardContent>
              {pastOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No rental history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastOrders.map((booking) => (
                    <div key={booking.id} className="flex gap-4 p-4 border border-border rounded-lg">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src={`https://source.unsplash.com/200x200/?${booking.productImage}`}
                          alt={booking.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm mb-1">{booking.productName}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {booking.startDate} - {booking.endDate}
                            </p>
                            <Badge className={getStatusColor(booking.status)} variant="secondary">
                              <span className="capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-primary">${booking.totalPrice}</p>
                            <Button size="sm" variant="link" className="h-auto p-0 text-xs">
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedItems.map((product) => (
                  <div key={product.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-muted">
                      <ImageWithFallback
                        src={`https://source.unsplash.com/600x400/?${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 rounded-full"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm mb-2 line-clamp-1">{product.name}</h4>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg text-primary">${product.price.perDay}</span>
                        <span className="text-xs text-muted-foreground">/day</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => onNavigate('product-detail', product.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-input-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" className="bg-input-background" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Street address" className="bg-input-background mb-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="City" className="bg-input-background" />
                    <Input placeholder="State" className="bg-input-background" />
                    <Input placeholder="ZIP Code" className="bg-input-background" />
                    <Input placeholder="Country" className="bg-input-background" />
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Badge className="bg-accent">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <Button variant="outline" size="sm">Verify</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
