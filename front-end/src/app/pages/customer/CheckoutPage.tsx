import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, CreditCard, ChevronLeft } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { api } from "@/app/services/api";

export default function CheckoutPage() {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulation of API call
            // const response = await api.post('/orders', { items: cart, ...formData });

            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s Mock delay

            // On success
            clearCart(); // Clear cart logic

            // Navigate to confirmation with some state if needed, or just ID
            const mockOrderId = "ORD-" + Math.floor(Math.random() * 100000);
            navigate('/order-confirmation', { state: { orderId: mockOrderId, total: cartTotal } });

        } catch (error) {
            console.error("Order failed", error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && step === 'cart') {
        return (
            <div className="min-h-screen pt-24 px-6 max-w-[1400px] mx-auto text-center">
                <h2 className="text-3xl font-serif italic mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 max-w-[1400px] mx-auto pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back
            </button>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Cart Items */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Order Summary</h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.type}`} className="flex gap-4 p-4 bg-card border border-border rounded-2xl">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-secondary">
                                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <div className="text-sm text-muted-foreground capitalize">
                                            {item.type === 'rent' ? 'Rental' : 'Purchase'}
                                            {item.type === 'rent' && ` • ${item.duration}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">₹{item.price}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-border space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform Fee</span>
                            <span>₹50</span>
                        </div>
                        <div className="flex justify-between text-xl font-semibold pt-2">
                            <span>Total</span>
                            <span>₹{cartTotal + 50}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Checkout Form */}
                <div className="bg-card border border-border rounded-3xl p-8 h-fit sticky top-24">
                    <h2 className="text-2xl font-semibold tracking-tight mb-8">Payment Details</h2>

                    <form onSubmit={handleCreateOrder} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact & Shipping</h3>
                            <div className="grid gap-4">
                                <input
                                    required
                                    placeholder="Full Name"
                                    className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                    value={formData.fullName}
                                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                />
                                <input
                                    required
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <input
                                    required
                                    placeholder="Address"
                                    className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Method</h3>
                            <div className="p-4 border border-primary/20 bg-primary/5 rounded-xl flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-primary" />
                                <span className="font-medium text-primary">Credit / Debit Card</span>
                            </div>

                            <div className="grid gap-4">
                                <input
                                    required
                                    placeholder="Card Number"
                                    className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                    value={formData.cardNumber}
                                    onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        required
                                        placeholder="MM/YY"
                                        className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                        value={formData.expiry}
                                        onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                    />
                                    <input
                                        required
                                        placeholder="CVV"
                                        className="w-full p-3 bg-secondary/50 rounded-xl outline-none focus:ring-2 ring-primary/20"
                                        value={formData.cvv}
                                        onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? "Processing..." : `Pay ₹${cartTotal + 50}`}
                        </button>
                        <p className="text-xs text-center text-muted-foreground">
                            Secure payment powered by Rentlify Pay.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
