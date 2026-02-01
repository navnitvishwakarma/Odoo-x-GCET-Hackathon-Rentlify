import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Truck, MapPin, Mail, Phone, CreditCard } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { api } from "@/app/services/api";

interface OrderItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    quantity: number;
    startDate: string;
    endDate: string;
    price: number;
    status: string;
}

interface OrderDetails {
    _id: string;
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
        address?: { city: string; state: string };
    };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

export default function VendorOrderDetails() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.data);
            } catch (err: any) {
                console.error("Failed to fetch order", err);
                setError(err.response?.data?.message || "Failed to load order details");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading order details...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
    if (!order) return <div className="p-8 text-center text-muted-foreground">Order not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'active': return 'bg-purple-100 text-purple-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link to="/vendor/orders">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderId}</h1>
                    <p className="text-muted-foreground text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status.toUpperCase()}
                    </Badge>
                    <Badge className={order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'} variant="outline">
                        {order.paymentStatus.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4 items-start">
                                        <div className="h-20 w-20 bg-secondary rounded-lg overflow-hidden shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-medium">{item.product.name}</h3>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-3 h-3" />
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">₹{item.price}</p>
                                            <Badge variant="secondary" className="mt-2 text-xs">{item.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="p-6 flex justify-between items-center bg-muted/20">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-xl font-bold">₹{order.totalAmount}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                    <User className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">{order.customer.name}</p>
                                    <p className="text-xs text-muted-foreground">Customer</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {order.customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {order.customer.phone || "No phone provided"}
                                </div>
                                <div className="flex items-start gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>
                                        {order.customer.address ?
                                            `${order.customer.address.city}, ${order.customer.address.state}`
                                            : "No address provided"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {/* Placeholder actions, can be expanded */}
                            <Button variant="outline" className="w-full justify-start">
                                <Mail className="w-4 h-4 mr-2" /> Email Customer
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                                Cancel Order
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
