import { useEffect, useState } from 'react';
import { Users, IndianRupee, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/services/api';

interface DashboardStats {
    totalRevenue: number;
    activeUsers: number;
    activeRentals: number;
    totalProducts: number;
    growthRate: string;
    recentRentals: any[];
    newVendors: any[];
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStatsData(data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: 'Total Revenue',
            value: statsData ? `₹${statsData.totalRevenue.toLocaleString('en-IN')}` : '₹0',
            change: statsData?.growthRate || '+0%',
            icon: IndianRupee,
            color: 'text-green-600',
        },
        {
            title: 'Active Users',
            value: statsData?.activeUsers.toString() || '0',
            change: 'Total Customers',
            icon: Users,
            color: 'text-indigo-600',
        },
        {
            title: 'Active Rentals',
            value: statsData?.activeRentals.toString() || '0',
            change: 'Currently Active',
            icon: Package,
            color: 'text-purple-600',
        },
        {
            title: 'Total Products',
            value: statsData?.totalProducts.toString() || '0',
            change: 'Inventory Size',
            icon: TrendingUp,
            color: 'text-orange-600',
        },
    ];

    if (loading) return <div className="p-8">Loading dashboard stats...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.change}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Rentals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-4 text-left font-medium text-muted-foreground">Order ID</th>
                                        <th className="p-4 text-left font-medium text-muted-foreground">Customer</th>
                                        <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
                                        <th className="p-4 text-right font-medium text-muted-foreground">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsData?.recentRentals.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">No recent rentals</td>
                                        </tr>
                                    )}
                                    {statsData?.recentRentals.map((order) => (
                                        <tr key={order._id} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td className="p-4">{order.customer?.name || 'Unknown'}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${order.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                                        'bg-gray-50 text-gray-700 ring-gray-600/20'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>New Vendors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {statsData?.newVendors.length === 0 && <p className="text-sm text-muted-foreground">No new vendors</p>}
                            {statsData?.newVendors.map((vendor) => (
                                <div key={vendor._id} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{vendor.businessName || vendor.name}</p>
                                        <p className="text-xs text-muted-foreground">{vendor.email}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-green-600">
                                        {vendor.isEmailVerified ? 'Verified' : 'Pending'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
