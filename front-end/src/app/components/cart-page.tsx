import { motion } from "motion/react";
import { Trash2, ChevronLeft, Minus, Plus, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import { useState } from "react";

interface CartItem {
    id: string | number;
    name: string;
    image: string;
    type: "rent" | "buy";
    price: number;
    duration?: string;
    quantity: number;
    deposit?: number;
}



export function CartPage({ items, onUpdateQuantity, onRemoveItem, onUpdateDuration, onBack, onCheckout }: {
    items: CartItem[];
    onUpdateQuantity: (id: string | number, quantity: number) => void;
    onRemoveItem: (id: string | number) => void;
    onUpdateDuration?: (id: string | number, duration: string) => void;
    onBack: () => void;
    onCheckout?: () => void
}) {
    const updateQuantity = (id: string | number, delta: number) => {
        const item = items.find(i => i.id === id);
        if (item) {
            onUpdateQuantity(id, Math.max(1, item.quantity + delta));
        }
    };

    const removeItem = (id: string | number) => {
        onRemoveItem(id);
    };

    const updateDuration = (id: string | number, duration: string) => {
        if (onUpdateDuration) onUpdateDuration(id, duration);
    };

    const monthlyTotal = items
        .filter(item => item.type === "rent")
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const oneTimeTotal = items
        .filter(item => item.type === "buy")
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const totalDeposit = items
        .filter(item => item.type === "rent")
        .reduce((sum, item) => sum + (item.deposit || 0), 0);

    const deliveryCharge = 499;

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to shopping</span>
                </button>

                <h1 className="text-4xl tracking-tight mb-12">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {items.length === 0 ? (
                            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                                <p className="text-muted-foreground">Your cart is empty</p>
                                <Button variant="link" onClick={onBack} className="mt-4">Go browsing</Button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-6 p-6 rounded-3xl bg-card border border-border group"
                                >
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-border">
                                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${item.type === "rent" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                                        }`}>
                                                        {item.type === "rent" ? "Rental" : "Purchase"}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-medium">{item.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center gap-6">
                                                {item.type === "rent" && (
                                                    <div className="w-32">
                                                        <Select value={item.duration} onValueChange={(val) => updateDuration(item.id, val)}>
                                                            <SelectTrigger className="h-9 rounded-lg text-xs">
                                                                <SelectValue placeholder="Duration" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="3">3 Months</SelectItem>
                                                                <SelectItem value="6">6 Months</SelectItem>
                                                                <SelectItem value="12">12 Months</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                                <div className="flex items-center border border-border rounded-lg h-9">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-secondary/50 h-full"><Minus className="w-3 h-3" /></button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-secondary/50 h-full"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">₹{(item.price || 0).toLocaleString()}{item.type === "rent" && <span className="text-muted-foreground">/mo</span>}</p>
                                                {item.type === "rent" && <p className="text-[10px] text-muted-foreground">₹{item.deposit || 0} refundable deposit</p>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-6">
                            <div className="p-8 rounded-3xl bg-secondary/30 border border-border space-y-6">
                                <h2 className="text-xl font-medium">Order Summary</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Monthly Rent Total</span>
                                        <span>₹{(monthlyTotal || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">One-time Purchase Total</span>
                                        <span>₹{(oneTimeTotal || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Refundable Deposits</span>
                                        <span>₹{(totalDeposit || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery & Hub Charges</span>
                                        <span>₹{(deliveryCharge || 0).toLocaleString()}</span>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-1">
                                        <div className="flex justify-between font-medium text-lg">
                                            <span>Grand Total</span>
                                            <span>₹{((monthlyTotal || 0) + (oneTimeTotal || 0) + (totalDeposit || 0) + (deliveryCharge || 0)).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Including GST and all taxes</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={onCheckout}
                                    className="w-full h-14 rounded-full text-lg font-medium shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
                                >
                                    Proceed to Checkout
                                </Button>

                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Secure SSL
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CreditCard className="w-3 h-3" /> Encrypted
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <h4 className="font-medium">Fast delivery</h4>
                                        <p className="text-xs text-muted-foreground">Scheduled at your convenience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
