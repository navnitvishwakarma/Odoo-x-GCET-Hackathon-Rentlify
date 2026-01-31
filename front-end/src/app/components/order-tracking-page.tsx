import { motion } from "motion/react";
import {
    Package,
    Truck,
    CheckCircle2,
    MapPin,
    ChevronLeft,
    Calendar,
    ShieldCheck,
    AlertCircle,
    Wrench,
    ShoppingBag
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";

const stages = [
    { id: "placed", label: "Order placed", icon: ShoppingBag, time: "Jan 30, 10:24 AM" },
    { id: "shipped", label: "Shipped", icon: Truck, time: "Jan 31, 09:15 AM" },
    { id: "delivered", label: "Delivered", icon: Package, time: "Expected by Feb 1" },
    { id: "installed", label: "Installed", icon: Wrench, time: "Scheduled Feb 1" },
    { id: "active", label: "Active rental", icon: ShieldCheck, time: "-" },
];

export function OrderTrackingPage({ onBack, orderId = "RNTL-882190" }: { onBack: () => void, orderId?: string }) {
    const currentStageIndex = 1; // "Shipped" stage

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to profile</span>
                </button>

                <div className="space-y-12">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">In Transit</Badge>
                            <h1 className="text-4xl tracking-tight">Order {orderId}</h1>
                            <p className="text-muted-foreground">Estimate delivery: <strong>Tomorrow, Feb 1st</strong></p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="rounded-xl">Modify Delivery</Button>
                            <Button className="rounded-xl">Contact Support</Button>
                        </div>
                    </div>

                    {/* Visual Timeline */}
                    <section className="p-8 md:p-12 rounded-[2.5rem] bg-secondary/30 border border-border relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                                {/* Desktop Connecting Line */}
                                <div className="absolute top-6 left-0 right-0 h-px bg-border hidden md:block" />
                                <motion.div
                                    className="absolute top-6 left-0 h-px bg-primary hidden md:block"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />

                                {stages.map((stage, index) => {
                                    const isCompleted = index <= currentStageIndex;
                                    const isCurrent = index === currentStageIndex;

                                    return (
                                        <div key={stage.id} className="flex md:flex-col items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.2 }}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background border border-border text-muted-foreground"
                                                    }`}
                                            >
                                                {isCompleted && index < currentStageIndex ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : (
                                                    <stage.icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                                                )}
                                            </motion.div>

                                            <div className="md:text-center space-y-1">
                                                <p className={`text-sm font-semibold tracking-tight ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {stage.label}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{stage.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Background Accent */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Details Column */}
                        <div className="lg:col-span-12 space-y-10">
                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Delivery Address */}
                                <div className="p-8 rounded-3xl border border-border bg-card space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-secondary rounded-lg">
                                            <MapPin className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <h3 className="font-medium text-lg">Delivery Address</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Penthouse 12B, Luxury Towers<br />
                                            Worli, Mumbai, MH - 400018
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-4">+91 98765 43210</p>
                                    </div>
                                </div>

                                {/* Latest Update Box */}
                                <div className="p-8 rounded-3xl border border-primary/20 bg-primary/[0.02] space-y-6 relative overflow-hidden">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="font-medium text-lg">Latest Update</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-px bg-primary/20 relative">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">In Transit to Delivery Hub</p>
                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Your order has left the main warehouse and is currently on its way to the Worli distribution center.</p>
                                                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest font-bold text-primary">Active Now</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details Section */}
                            <section className="space-y-6">
                                <h2 className="text-2xl">Items in this order</h2>
                                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                                    {[
                                        { name: "Eames Lounge Chair & Ottoman", type: "Rental", price: "₹3,500/mo", status: "Shipped", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-8 flex items-center gap-8 hover:bg-secondary/10 transition-colors">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border shrink-0">
                                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Badge variant="outline" className="rounded-full text-[10px] py-0">{item.type}</Badge>
                                                <h4 className="text-xl font-medium tracking-tight">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-primary uppercase tracking-widest">{item.status}</p>
                                                <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-foreground">View Item</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
