import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, CheckCircle, Truck, RefreshCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { api } from "@/app/services/api";

interface Order {
    _id: string;
    orderId: string;
    productName: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: "pending" | "confirmed" | "active" | "completed" | "cancelled" | "returned";
    paymentStatus: "paid" | "pending";
}

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/orders"); // Correct endpoint
            // Map backend data to frontend interface
            const mappedOrders = (data.data || []).map((order: any) => ({
                _id: order._id,
                orderId: order.orderId || order._id.slice(-6).toUpperCase(),
                productName: order.items[0]?.product?.name || "Unknown Product",
                customerName: order.customer?.name || "Unknown Customer",
                startDate: new Date(order.items[0]?.startDate).toLocaleDateString(),
                endDate: new Date(order.items[0]?.endDate).toLocaleDateString(),
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus
            }));
            setOrders(mappedOrders);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update order status");
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            active: "bg-purple-100 text-purple-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            returned: "bg-indigo-100 text-indigo-800"
        };
        return <Badge className={`${styles[status] || "bg-gray-100"} border-none shadow-none capitalize`}>{status}</Badge>;
    };

    const handleExportCSV = () => {
        if (!orders.length) return;

        // Headers
        const headers = ["Order ID", "Product", "Customer", "Start Date", "End Date", "Amount", "Status", "Payment Status"];

        // Rows
        const rows = orders.map(order => [
            order.orderId,
            `"${order.productName.replace(/"/g, '""')}"`, // Escape quotes
            `"${order.customerName.replace(/"/g, '""')}"`,
            order.startDate,
            order.endDate,
            order.totalAmount,
            order.status,
            order.paymentStatus
        ]);

        // Combine
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage your rentals and track order status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportCSV} disabled={orders.length === 0}>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-lg border">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders, customers..."
                        className="pl-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active (Rented)</option>
                        <option value="returned">Returned</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No orders found</h3>
                        <p className="text-muted-foreground">When customers rent your items, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Dates</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium">{order.orderId}</td>
                                        <td className="px-6 py-4">{order.productName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span>{order.customerName}</span>
                                                {/* <span className="text-xs text-muted-foreground">view contact</span> */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex flex-col text-xs">
                                                <span className="text-emerald-600">Start: {order.startDate}</span>
                                                <span className="text-red-600">End: {order.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        Manage
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link to={`/vendor/orders/${order._id}`} className="cursor-pointer flex items-center w-full">
                                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    {order.status === 'pending' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order._id, 'confirmed')}>
                                                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Confirm Order
                                                        </DropdownMenuItem>
                                                    )}

                                                    {order.status === 'confirmed' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order._id, 'active')}>
                                                            <Truck className="w-4 h-4 mr-2 text-blue-600" /> Mark Dispatched
                                                        </DropdownMenuItem>
                                                    )}

                                                    {order.status === 'active' && (
                                                        <DropdownMenuItem onClick={() => handleStatusChange(order._id, 'returned')}>
                                                            <RefreshCcw className="w-4 h-4 mr-2 text-purple-600" /> Mark Returned
                                                        </DropdownMenuItem>
                                                    )}

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
