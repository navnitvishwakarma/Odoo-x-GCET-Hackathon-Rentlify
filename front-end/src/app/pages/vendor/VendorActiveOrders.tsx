import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Calendar, AlertCircle, IndianRupee, Clock, CheckCircle, Package } from "lucide-react";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function VendorActiveOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveOrders();
    }, []);

    const fetchActiveOrders = async () => {
        try {
            const response = await api.get('/orders/vendor/active');
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch active orders", error);
            toast.error("Failed to load active orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading active orders...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Active Rentals</h1>
                    <p className="text-muted-foreground mt-1">Monitor ongoing rentals and track overdue returns.</p>
                </div>
                <Button onClick={fetchActiveOrders} variant="outline">
                    Refresh List
                </Button>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Package className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Active Rentals</h3>
                        <p className="text-muted-foreground">You don't have any products currently rented out.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border border-border rounded-xl bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Rent Period</TableHead>
                                <TableHead>Return Date</TableHead>
                                <TableHead className="text-right">Action / Fine</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((item) => {
                                const isOverdue = item.fine > 0;
                                return (
                                    <TableRow key={item._id} className={isOverdue ? "bg-red-500/5 hover:bg-red-500/10" : ""}>
                                        <TableCell className="font-mono text-xs">{item.orderId}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {item.product?.images?.[0] && (
                                                    <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-border" />
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.product?.name}</p>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.customer?.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.customer?.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(item.startDate), 'MMM d')} - {format(new Date(item.endDate), 'MMM d')}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`text-sm font-medium ${isOverdue ? "text-red-500" : ""}`}>
                                                    {format(new Date(item.endDate), 'MMM d, yyyy')}
                                                </span>
                                                {isOverdue && (
                                                    <Badge variant="destructive" className="text-[10px] px-1 py-0 h-5">
                                                        Overdue {item.overdueDays} Days
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isOverdue ? (
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="text-red-600 font-bold flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Has Fine: ₹{item.fine.toLocaleString()}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Rate: 2x Daily Rent</p>
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                                                    On Track
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
