import { Users, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            change: '+20.1% from last month',
            icon: DollarSign,
            color: 'text-green-600',
        },
        {
            title: 'Active Users',
            value: '+2350',
            change: '+180.1% from last month',
            icon: Users,
            color: 'text-indigo-600',
        },
        {
            title: 'Active Rentals',
            value: '+12,234',
            change: '+19% from last month',
            icon: Package,
            color: 'text-purple-600',
        },
        {
            title: 'Growth Rate',
            value: '+573',
            change: '+201 since last hour',
            icon: TrendingUp,
            color: 'text-orange-600',
        },
    ];

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
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-4 font-medium">ORD-00{i}</td>
                                            <td className="p-4">Customer {i}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Active</span>
                                            </td>
                                            <td className="p-4 text-right">$250.00</td>
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
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        V{i}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Vendor Business {i}</p>
                                        <p className="text-xs text-muted-foreground">vendor{i}@example.com</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-green-600">Approved</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
