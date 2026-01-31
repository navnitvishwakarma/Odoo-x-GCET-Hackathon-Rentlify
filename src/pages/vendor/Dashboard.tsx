import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/data/mock-data';
import {
  DollarSign,
  Package,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useVendorProducts, useAddProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useVendorBookings, useVendorStats } from '@/hooks/useBookings';
import { cn } from '@/components/ui/utils';
import { toast } from 'sonner';

export function VendorDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  // Use a fixed vendor ID for now, or user.id
  const vendorId = user?.id || 'v1';

  const { data: products = [], isLoading: isLoadingProducts } = useVendorProducts(vendorId);
  const { data: bookings = [], isLoading: isLoadingBookings } = useVendorBookings(vendorId);
  const { data: stats, isLoading: isLoadingStats } = useVendorStats(vendorId);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const isLoading = isLoadingProducts || isLoadingBookings || isLoadingStats;

  const addProductMutation = useAddProduct();
  const deleteProductMutation = useDeleteProduct();

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    priceDay: '',
    priceWeek: '',
    priceMonth: '',
    deposit: '',
    location: '',
  });

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    addProductMutation.mutate({
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      price: {
        perDay: Number(newProduct.priceDay),
        perWeek: Number(newProduct.priceWeek),
        perMonth: Number(newProduct.priceMonth),
      },
      images: ['camera-rental'], // Mock image for now
      location: newProduct.location || 'New York, NY',
      vendorId: vendorId,
      vendorName: user?.name || 'ProGear Rentals',
      rating: 5,
      reviewCount: 0,
      available: true,
      securityDeposit: Number(newProduct.deposit),
      features: ['New Item'],
    }, {
      onSuccess: () => {
        toast.success('Product added successfully');
        setShowAddProduct(false);
        setNewProduct({
          name: '',
          category: '',
          description: '',
          priceDay: '',
          priceWeek: '',
          priceMonth: '',
          deposit: '',
          location: '',
        });
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => toast.success('Product deleted')
      });
    }
  };

  // Mock analytics data (keep static for now or move to API if complex)
  const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 1398 },
    { month: 'Mar', revenue: 9800 },
    { month: 'Apr', revenue: 3908 },
    { month: 'May', revenue: 4800 },
    { month: 'Jun', revenue: 3800 },
  ];

  const bookingsData = [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 8 },
    { month: 'Mar', bookings: 24 },
    { month: 'Apr', bookings: 18 },
    { month: 'May', bookings: 22 },
    { month: 'Jun', bookings: 16 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle Pending / Rejected states
  if (user?.role === 'vendor' && user?.status !== 'active') {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-xl w-full border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardContent className="pt-12 pb-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className={cn(
                "p-5 rounded-full",
                user?.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-destructive/10 text-destructive"
              )}>
                {user?.status === 'pending' ? <Clock className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {user?.status === 'pending' ? "Approval Pending" : "Application Rejected"}
              </h2>
              <p className="text-muted-foreground text-lg px-6">
                {user?.status === 'pending'
                  ? "We're currently reviewing your business credentials. This usually takes 24-48 hours."
                  : "Unfortunately, your vendor application was not approved at this time."}
              </p>
            </div>

            {user?.status === 'rejected' && user?.rejectionReason && (
              <div className="mx-6 p-4 bg-destructive/5 border border-destructive/10 rounded-xl text-left">
                <p className="text-xs font-bold text-destructive uppercase tracking-widest mb-1">Reason for Rejection</p>
                <p className="text-sm font-medium">{user.rejectionReason}</p>
              </div>
            )}

            <div className="bg-muted/30 p-4 mx-6 rounded-xl text-sm text-left flex gap-3 items-start border border-white/5">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Next Steps</p>
                {user?.status === 'pending' ? (
                  <p className="text-muted-foreground">Ensure your GSTIN is correct and all documents are clear. You'll receive an email as soon as we make a decision.</p>
                ) : (
                  <p className="text-muted-foreground">Please review the reason above. You can update your profile or contact support at <span className="text-primary font-medium">help@rentlify.com</span> for a re-evalution.</p>
                )}
              </div>
            </div>

            <div className="pt-4 px-6 flex flex-col gap-3">
              <Button variant="outline" className="h-11 shadow-sm" onClick={() => window.location.href = '/'}>
                Back to Marketplace
              </Button>
              <Button variant="ghost" className="text-muted-foreground" onClick={() => logout()}>
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Manage your listings and track your earnings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                    <p className="text-2xl">${stats?.totalEarnings?.toLocaleString() ?? 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
                    <p className="text-2xl">{stats?.activeListings ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats?.availableListings ?? 0} available</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-2xl">{stats?.totalBookings ?? 0}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{stats?.activeBookingCount ?? 0} active</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                    <p className="text-2xl">{stats?.totalViews ? (stats.totalViews / 1000).toFixed(1) + 'K' : '0'}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% this week</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bookings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={booking.productImage}
                        alt={booking.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{booking.productName}</h4>
                      <p className="text-xs text-muted-foreground">By {booking.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary mb-1">${booking.totalPrice}</p>
                      <Badge variant="secondary" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Products</CardTitle>
                <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          placeholder="e.g., Canon EOS R5 Camera"
                          className="bg-input-background"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}
                        >
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your product..."
                          className="bg-input-background"
                          rows={4}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priceDay">Price per Day ($)</Label>
                          <Input
                            id="priceDay"
                            type="number"
                            placeholder="50"
                            className="bg-input-background"
                            value={newProduct.priceDay}
                            onChange={(e) => setNewProduct({ ...newProduct, priceDay: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceWeek">Price per Week ($)</Label>
                          <Input
                            id="priceWeek"
                            type="number"
                            placeholder="300"
                            className="bg-input-background"
                            value={newProduct.priceWeek}
                            onChange={(e) => setNewProduct({ ...newProduct, priceWeek: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priceMonth">Price per Month ($)</Label>
                          <Input
                            id="priceMonth"
                            type="number"
                            placeholder="1000"
                            className="bg-input-background"
                            value={newProduct.priceMonth}
                            onChange={(e) => setNewProduct({ ...newProduct, priceMonth: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Smart Pricing Assistant */}
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100 dark:border-violet-900 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-full text-violet-600 dark:text-violet-300">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-100">Smart Pricing Insight</h4>
                              <Badge variant="outline" className="bg-white/50 dark:bg-black/20 text-[10px] h-5 border-violet-200">High Demand</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Similar items in <strong>New York</strong> are renting for <strong>$45-$60/day</strong>.
                            </p>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-7 text-xs bg-white dark:bg-violet-900/40 hover:bg-white/80 border border-violet-200 dark:border-violet-800 shadow-sm"
                              onClick={() => setNewProduct({ ...newProduct, priceDay: '55', priceWeek: '350', priceMonth: '1200' })}
                            >
                              Apply Recommended: $55/day
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deposit">Security Deposit ($)</Label>
                        <Input
                          id="deposit"
                          type="number"
                          placeholder="500"
                          className="bg-input-background"
                          value={newProduct.deposit}
                          onChange={(e) => setNewProduct({ ...newProduct, deposit: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="New York, NY"
                          className="bg-input-background"
                          value={newProduct.location}
                          onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Images</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                          <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload images</p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowAddProduct(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleSaveProduct} disabled={addProductMutation.isPending}>
                          {addProductMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                        </div>
                        <Badge variant={product.available ? 'default' : 'secondary'} className={product.available ? 'bg-accent' : ''}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                          <p className="text-sm text-primary">${product.price.perDay}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Views</p>
                          <p className="text-sm">2.4K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Bookings</p>
                          <p className="text-sm">24</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                          <p className="text-sm text-green-600 dark:text-green-400">$1,200</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex gap-4 p-4 border border-border rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={booking.productImage}
                        alt={booking.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm mb-1">{booking.productName}</h4>
                          <p className="text-xs text-muted-foreground">Customer: {booking.customerName}</p>
                        </div>
                        <Badge variant="secondary">{booking.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Period</p>
                          <p>{booking.startDate} - {booking.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p>{booking.duration} {booking.durationType}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total</p>
                          <p className="text-primary">${booking.totalPrice}</p>
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-accent hover:bg-accent/90">
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{product.name}</h4>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Views: 2.4K</span>
                        <span>Bookings: 24</span>
                        <span>Revenue: $1.2K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-600 dark:text-green-400">+12%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="mb-1">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">Current subscription</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">Active</Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-4">Payment History</h4>
                  <div className="space-y-2">
                    {[
                      { date: '2026-01-01', amount: 29, status: 'paid' },
                      { date: '2025-12-01', amount: 29, status: 'paid' },
                      { date: '2025-11-01', amount: 29, status: 'paid' },
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="text-sm mb-1">Pro Plan Subscription</p>
                          <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm mb-1">${payment.amount}</p>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                            Paid
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
