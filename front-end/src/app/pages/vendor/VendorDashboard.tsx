import { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingBag, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/app/services/api';
import { Link } from 'react-router-dom';

interface DashboardStats {
    earnings: number;
    products: number;
    activeOrders: number;
    pendingReturns: number;
    revenueChart: { name: string; total: number }[];
    recentOrders: any[];
}

export default function VendorDashboard() {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/vendors/stats');
                setStatsData(data.data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch dashboard stats", err);
                setError(err.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Earnings',
            value: statsData ? `₹${statsData.earnings.toLocaleString()}` : '...',
            change: 'Lifetime earnings',
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'My Products',
            value: statsData ? statsData.products : '...',
            change: 'Total items listed',
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            title: 'Active Orders',
            value: statsData ? statsData.activeOrders : '...',
            change: 'Currently in progress',
            icon: ShoppingBag,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
            title: 'Pending Returns',
            value: statsData ? statsData.pendingReturns : '...',
            change: 'Items active with customers',
            icon: AlertCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-100 dark:bg-orange-900/20'
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">Welcome back, {user?.businessName || user?.name || 'Vendor'}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/vendor/products/new">
                        <Button>+ Add New Product</Button>
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    Error loading dashboard: {error}. Please try refreshing.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-8 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Your earnings trend over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={statsData?.revenueChart || []}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>
                            Latest orders requiring attention.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {statsData?.recentOrders.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm py-4">No recent orders</p>
                            ) : (
                                statsData?.recentOrders.map((order, i) => (
                                    <div key={order._id || i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                #{order.orderId?.slice(-4) || '...'}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none truncate max-w-[120px]">
                                                    {order.customer?.name || 'Customer'}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {order.status} • {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">₹{order.totalAmount}</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Link to="/vendor/orders">
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-4">
                                    View All Orders <ArrowUpRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
