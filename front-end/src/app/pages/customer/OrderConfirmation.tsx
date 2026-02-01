import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Download, FileText, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { api } from "@/app/services/api";
import { toast } from "sonner";

export default function OrderConfirmation() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        const fetchData = async () => {
            try {
                // Fetch Order Details
                const orderRes = await api.get(`/orders/${orderId}`);
                if (orderRes.data.success) {
                    setOrder(orderRes.data.data);
                }

                // Fetch Invoices for this Order
                const invoiceRes = await api.get(`/invoices?orderId=${orderId}`);
                if (invoiceRes.data.success) {
                    setInvoices(invoiceRes.data.data);
                }

            } catch (error) {
                console.error("Failed to load order data", error);
                toast.error("Could not load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating your receipt...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-xl">Order not found</p>
                <Button onClick={() => navigate('/')}>Return Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-16 px-6">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-serif">Order Confirmed!</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Thank you for your order, <span className="font-medium text-foreground">{order.customer?.name}</span>.
                        Your order ID is #{order.orderId || order._id.slice(-6).toUpperCase()}.
                    </p>
                </div>

                {/* Invoices Section */}
                <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-medium flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Invoices Generated
                        </h2>
                        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-muted-foreground">
                            {invoices.length} Invoice{invoices.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Separate invoices have been generated for each vendor in your order.
                    </p>

                    <div className="space-y-3">
                        {invoices.map((inv) => (
                            <div key={inv._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors gap-4">
                                <div>
                                    <div className="font-medium">{inv.vendor?.name || 'Vendor'}</div>
                                    <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                                        <span>#{inv.invoiceNumber}</span>
                                        <span>•</span>
                                        <span>{format(new Date(inv.createdAt), 'MMM dd, yyyy')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-medium">₹{inv.totalAmount.toLocaleString()}</span>
                                    <Button variant="outline" size="sm" className="gap-2 h-9">
                                        <Download className="w-4 h-4" /> Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Total Amount Paid</span>
                        <span className="text-2xl font-serif">₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate('/profile?tab=orders')} className="h-12 px-8">
                        View Order History
                    </Button>
                    <Button onClick={() => navigate('/home')} className="h-12 px-8 gap-2">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

            </div>
        </div>
    );
}
