import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { format, addMonths } from "date-fns";
import { toast } from "sonner";
import { Loader2, Calendar as CalendarIcon, CreditCard, Wallet, Banknote } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Separator } from "@/app/components/ui/separator";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { api } from "@/app/services/api";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items: cartItems, clearCart } = useCart();

    // State to hold items to be checked out (either from Cart or Direct Rent)
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "", // Assuming user model might have phone
        address: typeof user?.address === 'string' ? user.address : "",
        paymentMethod: "card"
    });

    // Initialize items based on navigation source
    useEffect(() => {
        if (location.state?.items) {
            // Direct Rent path
            const directItems = location.state.items.map((item: any) => ({
                ...item,
                startDate: new Date(),
                // Default 3 months if not specified
                endDate: addMonths(new Date(), item.period || 3),
                quantity: item.quantity || 1
            }));
            setCheckoutItems(directItems);
        } else if (cartItems.length > 0) {
            // Cart path
            const mappedCartItems = cartItems.map(item => ({
                product: item.product, // Full product object
                productId: item.product._id,
                quantity: item.quantity,
                type: item.type,
                period: item.period,
                startDate: new Date(),
                endDate: addMonths(new Date(), item.period || 3)
            }));
            setCheckoutItems(mappedCartItems);
        } else {
            // No items, redirect back
            toast.error("No items to checkout");
            navigate('/');
        }
    }, [location.state, cartItems, navigate]);

    const handleDateChange = (index: number, field: 'startDate' | 'endDate', value: string) => {
        const newItems = [...checkoutItems];
        newItems[index][field] = new Date(value);
        setCheckoutItems(newItems);
    };

    const calculateTotal = () => {
        return checkoutItems.reduce((total, item) => {
            if (item.type === 'rent') {
                // Approximate monthly cost for UI display
                // Backend calculates actual based on daily usage
                // Let's rely on product pricing
                const price = item.product.pricing?.daily * 30 || item.product.price;
                // If price is missing from product obj in direct rent, might be issue. 
                // Provide fallback
                return total + (price * item.quantity);
            } else {
                return total + (item.product.price * item.quantity);
            }
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit triggered. Loading state:", loading);

        if (loading) return; // Prevent double submit
        setLoading(true);

        try {
            console.log("Constructing payload...");
            // Construct payload for API
            // items: [{ product: ID, startDate, endDate, quantity }]
            const apiItems = checkoutItems.map(item => ({
                product: item.product._id || item.product.id,
                startDate: item.startDate,
                endDate: item.endDate,
                quantity: item.quantity
            }));

            const payload = {
                items: apiItems,
                shippingAddress: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    paymentMethod: formData.paymentMethod
                }
            };

            console.log("Sending payload to /orders:", JSON.stringify(payload, null, 2));

            const response = await api.post('/orders', payload);
            console.log("API Response:", response.data);

            if (response.data.success) {
                console.log("Order successful. ID:", response.data.data._id);
                toast.success("Order placed successfully!");
                // Clear cart if this was a cart checkout
                if (!location.state?.items) {
                    await clearCart();
                }
                const orderId = response.data.data._id; // Assuming backend returns order object

                console.log("Navigating to:", `/order-confirmation/${orderId}`);
                navigate(`/order-confirmation/${orderId}`);
            } else {
                console.error("API success flag false or missing data", response.data);
                toast.error("Order failed: Invalid server response");
            }
        } catch (error: any) {
            console.error("Checkout Request failed", error);
            console.log("Error details:", error.response?.data);

            const errorMessage = error.response?.data?.message || "Failed to place order";

            if (error.response?.status === 400 || errorMessage.includes("Product not found") || errorMessage.includes("not available")) {
                toast.error(`Order Failed: ${errorMessage}. Try clearing your cart.`);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            console.log("Finished submit handler.");
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) return null;

    return (
        <div className="min-h-screen bg-background py-10 px-6 md:px-12">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-3xl font-serif mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
                    {/* Form Section */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Shipping Details */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-medium">Shipping Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email" type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone" type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 "
                                        required
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="address">Delivery Address</Label>
                                    <Input
                                        id="address"
                                        value={typeof formData.address === 'string' ? formData.address : ''}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Street, City, Zip"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rental Dates Configuration (Per Item) */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-medium">Rental Period</h2>
                            <div className="space-y-6">
                                {checkoutItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-start border-b border-border pb-4 last:border-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                                            <ImageWithFallback src={item.product?.image || item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h3 className="font-medium">{item.product?.name}</h3>
                                                <p className="text-xs text-muted-foreground">{item.quantity} x {item.type === 'rent' ? 'Rent' : 'Buy'}</p>
                                            </div>

                                            {item.type === 'rent' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Start Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={format(item.startDate, "yyyy-MM-dd")}
                                                            onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">End Date</Label>
                                                        <Input
                                                            type="date"
                                                            value={format(item.endDate, "yyyy-MM-dd")}
                                                            onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-medium">Payment Method</h2>
                            <RadioGroup value={formData.paymentMethod} onValueChange={v => setFormData({ ...formData, paymentMethod: v })}>
                                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/20">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer w-full">
                                        <CreditCard className="w-4 h-4" /> Credit/Debit Card
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/20">
                                    <RadioGroupItem value="upi" id="upi" />
                                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer w-full">
                                        <Wallet className="w-4 h-4" /> UPI / NetBanking
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/20">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer w-full">
                                        <Banknote className="w-4 h-4" /> Cash on Delivery
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 bg-secondary/30 border border-border rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-medium">Order Summary</h2>
                            <div className="space-y-2">
                                {checkoutItems.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span>{item.product.name} (x{item.quantity})</span>
                                        <span>₹{(item.product.price || item.product.pricing?.daily * 30 * (item.period || 1) || 0).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{calculateTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Delivery</span>
                                    <span>₹499</span>
                                </div>
                                <div className="flex justify-between text-lg font-medium pt-2">
                                    <span>Total</span>
                                    <span>₹{(calculateTotal() + 499).toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 text-lg rounded-full"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm & Pay"}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By clicking Confirm, you agree to our Terms & Conditions.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
