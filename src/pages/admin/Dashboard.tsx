import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories, PendingVendor } from '@/data/mock-data';
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  Ban,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Store,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useProducts } from '@/hooks/useProducts';
import { useAllBookings, useAdminStats } from '@/hooks/useBookings';
import { usePendingVendors, useUpdateVendorStatus } from '@/hooks/useVendors';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: bookings = [], isLoading: isLoadingBookings } = useAllBookings();
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: vendors = [], isLoading: isLoadingVendors } = usePendingVendors();
  const updateVendorMutation = useUpdateVendorStatus();

  const isLoading = isLoadingProducts || isLoadingBookings || isLoadingStats || isLoadingVendors;

  // Approval States
  const [selectedVendor, setSelectedVendor] = useState<PendingVendor | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [vendorToReject, setVendorToReject] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    updateVendorMutation.mutate({ id, status: 'approved' }, {
      onSuccess: () => {
        setShowApprovalDialog(false);
        setSelectedVendor(null);
      }
    });
  };

  const handleReject = (id: string) => {
    if (rejectionReason) {
      updateVendorMutation.mutate({
        id,
        status: 'rejected',
        reason: rejectionReason
      }, {
        onSuccess: () => {
          setShowRejectionDialog(false);
          setRejectionReason('');
          setSelectedVendor(null);
        }
      });
    }
  };

  // Mock analytics data

  // Mock analytics data

  // Mock analytics data
  const userGrowthData = [
    { month: 'Jan', users: 4000, vendors: 400 },
    { month: 'Feb', users: 5200, vendors: 520 },
    { month: 'Mar', users: 6800, vendors: 680 },
    { month: 'Apr', users: 8200, vendors: 820 },
    { month: 'May', users: 9500, vendors: 950 },
    { month: 'Jun', users: 10543, vendors: 1234 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2400, commission: 240 },
    { month: 'Feb', revenue: 3200, commission: 320 },
    { month: 'Mar', revenue: 5800, commission: 580 },
    { month: 'Apr', revenue: 4200, commission: 420 },
    { month: 'May', revenue: 6100, commission: 610 },
    { month: 'Jun', revenue: 7300, commission: 730 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 30, color: '#2563eb' },
    { name: 'Vehicles', value: 25, color: '#10b981' },
    { name: 'Furniture', value: 20, color: '#f59e0b' },
    { name: 'Tools', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 10, color: '#6b7280' },
  ];

  // Mock users data
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2025-01-15', totalSpent: 1250 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'vendor', status: 'active', joined: '2025-02-20', earnings: 4500 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'customer', status: 'active', joined: '2025-03-10', totalSpent: 890 },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'vendor', status: 'pending', joined: '2025-06-05', earnings: 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="approvals">Vendor Approvals</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl">{stats?.totalUsers?.toLocaleString() ?? 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+15% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
                    <p className="text-2xl">{stats?.totalListings ?? 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% this week</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                    <p className="text-2xl">{stats?.totalTransactions ?? 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+22% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Platform Revenue</p>
                    <p className="text-2xl">${stats?.platformRevenue?.toFixed(0) ?? 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+18% this month</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="vendors" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue & Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#2563eb" />
                    <Bar dataKey="commission" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm">Vendors</p>
                      <p className="text-xs text-muted-foreground">Active sellers</p>
                    </div>
                  </div>
                  <p className="text-xl">{stats?.totalVendors ?? 0}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm">Customers</p>
                      <p className="text-xs text-muted-foreground">Active renters</p>
                    </div>
                  </div>
                  <p className="text-xl">{stats?.totalCustomers ?? 0}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm">Pending Approvals</p>
                      <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </div>
                  </div>
                  <p className="text-xl">12</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm">Open Disputes</p>
                      <p className="text-xs text-muted-foreground">Need attention</p>
                    </div>
                  </div>
                  <p className="text-xl">3</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        {/* Listings Tab */}
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Listing Management</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search listings..."
                    className="w-64 bg-input-background"
                  />
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm mb-1">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">By {product.vendorName}</p>
                        </div>
                        <Badge
                          variant={product.available ? 'default' : 'secondary'}
                          className={product.available ? 'bg-accent' : ''}
                        >
                          {product.available ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span className="capitalize">{product.category}</span>
                          <span>${product.price.perDay}/day</span>
                          <span>{product.reviewCount} reviews</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Approvals Tab */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vendor Approval Queue</CardTitle>
                  <CardDescription>Review and approve new vendor signups to ensure platform quality.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="h-8">{vendors.filter(v => v.status === 'pending').length} Pending Requests</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>{vendor.companyName}</TableCell>
                      <TableCell className="font-mono text-xs">{vendor.gstin}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vendor.signupDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={vendor.status === 'approved' ? 'default' : vendor.status === 'rejected' ? 'destructive' : 'secondary'}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVendor(vendor)}
                          disabled={vendor.status !== 'pending'}
                        >
                          {vendor.status === 'pending' ? 'Review Request' : 'View Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {vendors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No pending vendor requests at the moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Detail Sheet */}
        <Sheet open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
          <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
            {selectedVendor && (
              <div className="space-y-6 pt-4">
                <SheetHeader>
                  <SheetTitle className="text-2xl flex items-center gap-2">
                    <Store className="w-6 h-6 text-primary" />
                    Vendor Profile Review
                  </SheetTitle>
                  <SheetDescription>
                    Review business credentials and compliance documents.
                  </SheetDescription>
                </SheetHeader>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Owner Name</Label>
                    <p className="font-medium">{selectedVendor.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email Address</Label>
                    <p className="font-medium">{selectedVendor.email}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Company Legal Name</Label>
                    <p className="text-lg font-bold">{selectedVendor.companyName}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">GSTIN Number</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-lg bg-muted px-2 py-1 rounded">{selectedVendor.gstin}</p>
                      <Badge variant="outline" className="text-green-600 bg-green-50">Verified Format</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Business Documents</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">GST Registration Certificate.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20 opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium italic">Identity Proof (Not Required)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Approving this vendor will grant them full access to list products and collect payments on Rentlify.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-6 sticky bottom-0 bg-background pb-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => setShowApprovalDialog(true)}
                  >
                    Approve Vendor
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setShowRejectionDialog(true)}
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Approval Confirmation */}
        <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to approve?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately notify {selectedVendor?.name} and activate their vendor account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={() => selectedVendor && handleApprove(selectedVendor.id)}>
                Yes, Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Rejection Dialog */}
        <AlertDialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Vendor Application</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejection. This will be shared with the vendor.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="reason" className="mb-2 block">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., GSTIN could not be verified, Missing documents..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                disabled={!rejectionReason.trim()}
                onClick={() => selectedVendor && handleReject(selectedVendor.id)}
              >
                Reject Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">#{booking.id}</TableCell>
                      <TableCell className="text-sm">{booking.customerName}</TableCell>
                      <TableCell className="text-sm">{booking.vendorName}</TableCell>
                      <TableCell className="text-sm">{booking.productName}</TableCell>
                      <TableCell className="text-sm text-primary">${booking.totalPrice}</TableCell>
                      <TableCell className="text-sm text-green-600 dark:text-green-400">
                        ${(booking.totalPrice * 0.1).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{booking.startDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            booking.status === 'active'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : booking.status === 'completed'
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'D001', customer: 'John Doe', vendor: 'TechRent', product: 'MacBook Pro', issue: 'Item damaged', status: 'open', date: '2026-01-28' },
                  { id: 'D002', customer: 'Jane Smith', vendor: 'ProGear', product: 'Camera', issue: 'Late delivery', status: 'in-review', date: '2026-01-27' },
                  { id: 'D003', customer: 'Mike Johnson', vendor: 'Urban Furniture', product: 'Sofa Set', issue: 'Refund request', status: 'resolved', date: '2026-01-25' },
                ].map((dispute) => (
                  <div key={dispute.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">Dispute #{dispute.id}</h4>
                          <Badge
                            variant="secondary"
                            className={
                              dispute.status === 'open'
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : dispute.status === 'in-review'
                                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-green-500/10 text-green-600 dark:text-green-400'
                            }
                          >
                            {dispute.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{dispute.date}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Customer</p>
                        <p>{dispute.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                        <p>{dispute.vendor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Product</p>
                        <p>{dispute.product}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Issue</p>
                        <p>{dispute.issue}</p>
                      </div>
                    </div>
                    {dispute.status !== 'resolved' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Parties
                        </Button>
                        <Button size="sm" className="bg-accent hover:bg-accent/90">
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="Rentlify" className="bg-input-background mt-2" />
                </div>
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input id="commissionRate" type="number" defaultValue="10" className="bg-input-background mt-2" />
                </div>
                <div>
                  <Label htmlFor="minRental">Minimum Rental Period (days)</Label>
                  <Input id="minRental" type="number" defaultValue="1" className="bg-input-background mt-2" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">{cat.name}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
