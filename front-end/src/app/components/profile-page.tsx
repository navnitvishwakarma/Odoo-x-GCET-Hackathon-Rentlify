import { motion } from "motion/react";
import {
    User, Package, Calendar, CreditCard, MapPin, Heart, Download,
    ArrowRight, ShieldCheck, ChevronLeft, LogOut, Bell, Settings,
    Clock, ExternalLink, Store, TrendingUp, DollarSign, LayoutDashboard
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/services/api";
import { useNavigate } from "react-router-dom";

type Section = "overview" | "rentals" | "orders" | "payments" | "addresses" | "wishlist"
    | "business" | "inventory" | "sales" | "earnings" | "settings";

export function ProfilePage({ onBack, onTrackOrder }: { onBack?: () => void; onTrackOrder?: () => void }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<Section>("overview");
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (user && !isVendor) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const isVendor = user.role === 'vendor';

    const customerItems = [
        { id: "overview", label: "Overview", icon: User },
        { id: "rentals", label: "Active Rentals", icon: Clock },
        { id: "orders", label: "Past Purchases", icon: Package },
        { id: "payments", label: "Payment History", icon: CreditCard },
        { id: "addresses", label: "Saved Addresses", icon: MapPin },
        { id: "wishlist", label: "Wishlist", icon: Heart },
    ];

    const vendorItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "business", label: "Business Info", icon: Store },
        { id: "inventory", label: "My Inventory", icon: Package },
        { id: "sales", label: "Sales & Orders", icon: TrendingUp },
        { id: "earnings", label: "Earnings", icon: DollarSign },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const sidebarItems = isVendor ? vendorItems : customerItems;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(isVendor ? "/vendor" : "/");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isVendor ? "Back to Dashboard" : "Back to Home"}</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="w-full lg:w-80 shrink-0 space-y-8">
                        <div className="p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-serif uppercase">
                                {user.name.slice(0, 2)}
                            </div>
                            <div>
                                <h2 className="text-xl font-medium">{user.name}</h2>
                                <p className="text-sm text-muted-foreground italic">{user.email}</p>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 capitalize">
                                {isVendor ? 'Verified Vendor' : 'Member'}
                            </Badge>
                        </div>

                        <nav className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id as Section)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeSection === item.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {activeSection === item.id && <ArrowRight className="w-4 h-4 ml-auto" />}
                                </button>
                            ))}
                            <div className="pt-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-destructive hover:bg-destructive/5 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </nav>
                    </aside>

                    <main className="flex-1 space-y-10">
                        {/* Customer Sections */}
                        {!isVendor && (
                            <>
                                {activeSection === "overview" && <OverviewSection orders={orders} onTrackOrder={onTrackOrder} />}
                                {activeSection === "rentals" && <RentalsSection orders={orders} onTrackOrder={onTrackOrder} />}
                                {activeSection === "orders" && <OrdersSection orders={orders} />}
                                {activeSection === "payments" && <PaymentsSection />}
                                {activeSection === "addresses" && <AddressesSection />}
                                {activeSection === "wishlist" && <WishlistSection />}
                            </>
                        )}

                        {/* Vendor Sections */}
                        {isVendor && (
                            <>
                                {activeSection === "overview" && <VendorOverview />}
                                {activeSection === "business" && <VendorBusinessInfo />}
                                {activeSection === "inventory" && <VendorInventory />}
                                {activeSection === "sales" && <VendorSales />}
                                {activeSection === "earnings" && <VendorEarnings />}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Reuse existing Customer Components (OverviewSection, RentalsSection, etc...)
// ... [We will keep the previous customer components here verbatim or simplified for brevity in this replace call if possible, 
// but since this is a full file replace, I must provide all code. 
// For efficiency, I will include the missing Vendor components and re-declare customer ones.]

// Reusing stats from dashboard for consistency
function VendorOverview() {
    const [stats, setStats] = useState({
        earnings: 0,
        activeOrders: 0,
        products: 0,
        pendingReturns: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/vendors/stats');
                setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl tracking-tight">Vendor Overview</h1>
                <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full"><Bell className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Settings className="w-4 h-4" /></Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Revenue", value: `₹${stats.earnings}`, sub: "All time earnings", icon: DollarSign },
                    { label: "Active Orders", value: stats.activeOrders.toString(), sub: `${stats.pendingReturns} pending returns`, icon: Package },
                    { label: "Total Products", value: stats.products.toString(), sub: "Listed in inventory", icon: Store },
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:shadow-xl transition-all">
                        <div className="p-3 bg-secondary/50 rounded-2xl w-fit">
                            <stat.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-serif mt-1">{stat.value}</h3>
                            <p className="text-xs text-muted-foreground mt-2">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function VendorBusinessInfo() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/vendors/me');
                setProfile(data.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading profile...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Business Profile</h1>
            <div className="p-8 rounded-3xl border border-border bg-card space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">Company Name</label>
                        <p className="text-xl font-medium">{profile.businessName || "Not set"}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">Business Email</label>
                        <p className="text-xl font-medium">{user?.email}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">GSTIN</label>
                        <p className="text-xl font-medium">{profile.gstNumber || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">Registered Address</label>
                        <p className="text-lg text-muted-foreground">
                            {[profile.address?.street, profile.address?.city, profile.address?.state].filter(Boolean).join(", ") || "No address set"}
                        </p>
                    </div>
                </div>
                {/* <Button variant="outline">Edit Details</Button> */}
            </div>
        </motion.div>
    )
}

function VendorInventory() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl tracking-tight">My Inventory</h1>
                <Button>Add New Product</Button>
            </div>
            <div className="rounded-3xl border border-border overflow-hidden">
                <div className="p-12 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Manage your product listings from the Dashboard.</p>
                </div>
            </div>
        </motion.div>
    )
}

function VendorSales() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Sales History</h1>
            <p className="text-muted-foreground">Track your recent orders and transactions.</p>
        </motion.div>
    )
}

function VendorEarnings() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Earnings & Payouts</h1>
            <p className="text-muted-foreground">View your payout history and upcoming settlements.</p>
        </motion.div>
    )
}

// --- RESTORED CUSTOMER COMPONENTS ---

function OverviewSection({ orders, onTrackOrder }: { orders: any[], onTrackOrder?: () => void }) {
    // Calculate stats
    const totalPurchases = orders.length;
    const activeRentals = orders.flatMap(o => o.items).filter(i => {
        const endDate = new Date(i.endDate);
        return endDate >= new Date();
    }).length;

    // Sort orders by date to get recent
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentActivity = sortedOrders.slice(0, 3);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl tracking-tight">Dashboard Overview</h1>
                <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full"><Bell className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Settings className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Rentals", value: activeRentals.toString(), sub: "Currently rented items", icon: Clock },
                    { label: "Total Orders", value: totalPurchases.toString(), sub: "Lifetime orders", icon: Package },
                    { label: "Reward Points", value: (totalPurchases * 10).toString(), sub: "Based on orders", icon: ShieldCheck },
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:shadow-xl transition-all">
                        <div className="p-3 bg-secondary/50 rounded-2xl w-fit">
                            <stat.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-serif mt-1">{stat.value}</h3>
                            <p className="text-xs text-muted-foreground mt-2">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl">Recent Activity</h2>
                <div className="rounded-3xl border border-border divide-y divide-border overflow-hidden">
                    {recentActivity.length === 0 ? (
                        <div className="p-6 text-muted-foreground">No recent activity</div>
                    ) : (
                        recentActivity.map((order, i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Order #{order.orderId}</p>
                                        <p className="text-xs text-muted-foreground">{order.items?.length} Items · {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm">₹{order.totalAmount?.toLocaleString()}</p>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">{order.status}</Badge>
                                        {i === 0 && (
                                            <Button variant="link" size="sm" onClick={onTrackOrder} className="h-auto p-0 text-[10px] text-primary">Track Order</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </motion.div>
    );
}

function RentalsSection({ orders, onTrackOrder }: { orders: any[], onTrackOrder?: () => void }) {
    // Flatten orders to get all items
    const rentals = orders.flatMap(order =>
        order.items.map((item: any) => ({
            ...item,
            orderId: order.orderId,
            status: item.status || order.status
        }))
    ).filter((item) => {
        // Filter for active rentals (this logic can be refined based on 'status' or date)
        const endDate = new Date(item.endDate);
        const now = new Date();
        // Consider active if status is 'active' OR 'confirmed' AND end date hasn't passed long ago (or just show all confirmed)
        return item.status === 'active' || item.status === 'confirmed';
    });

    // Sort by return date (soonest first)
    rentals.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl tracking-tight">Active Rentals</h1>
                <Button variant="outline" className="rounded-full">Request Pickup</Button>
            </div>

            {rentals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-3xl">
                    <p>No active rentals found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {rentals.map((item, index) => {
                        const endDate = new Date(item.endDate);
                        const isOverdue = new Date() > endDate;

                        return (
                            <div key={index} className={`p-8 rounded-3xl bg-card border ${isOverdue ? 'border-red-200 bg-red-50/10' : 'border-border'} grid md:grid-cols-4 gap-8 group hover:shadow-xl transition-all`}>
                                <div className="w-full h-40 rounded-2xl overflow-hidden border border-border">
                                    {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground"><Package /></div>
                                    )}
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Order: {item.orderId}</span>
                                        <h3 className="text-xl font-medium mt-1">{item.product?.name}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Price</p>
                                            <p className="font-medium font-serif mt-1">₹{item.price.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Return By</p>
                                            <p className={`font-medium mt-1 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                                                {new Date(item.endDate).toLocaleDateString()}
                                                {isOverdue && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase">Overdue</span>}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Quantity</p>
                                            <p className="font-medium mt-1">{item.quantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Status</p>
                                            <Badge variant="secondary" className={`mt-1 ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                                {isOverdue ? 'Overdue' : (item.status || 'Active')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 justify-center">
                                    <Button onClick={onTrackOrder} className="rounded-xl h-12">Track Order</Button>
                                    <Button variant="secondary" className="rounded-xl h-12">Extend Rental</Button>
                                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-xs">Download Agreement <ExternalLink className="w-3 h-3 ml-2" /></Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

function OrdersSection({ orders }: { orders: any[] }) {
    if (orders.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <h1 className="text-4xl tracking-tight">Past Purchases</h1>
                <div className="p-12 text-center border rounded-3xl text-muted-foreground">
                    No orders found.
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Past Purchases</h1>
            <div className="rounded-3xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-6 font-medium">Order details</th>
                            <th className="px-8 py-6 font-medium">Date</th>
                            <th className="px-8 py-6 font-medium">Amount</th>
                            <th className="px-8 py-6 font-medium text-right">Invoices</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {orders.map((order, i) => (
                            <tr key={i} className="hover:bg-secondary/10 transition-colors group">
                                <td className="px-8 py-6">
                                    <p className="font-medium">{order.items?.[0]?.product?.name || 'Multiple Items'}</p>
                                    <p className="text-xs text-muted-foreground mt-1 tracking-tight">Order #{order.orderId}</p>
                                </td>
                                <td className="px-8 py-6 text-sm text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 font-medium">₹{order.totalAmount?.toLocaleString()}</td>
                                <td className="px-8 py-6 text-right">
                                    <Button variant="ghost" size="sm" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

function PaymentsSection() {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <h1 className="text-4xl tracking-tight">Payment Details</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <h2 className="text-xl font-medium">Saved Cards</h2>
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-neutral-900 to-neutral-800 text-white space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-start"><div className="w-12 h-8 rounded bg-white/20" /><CreditCard className="w-8 h-8 opacity-50" /></div>
                        <div className="space-y-1"><p className="text-sm opacity-50 uppercase tracking-[0.2em] font-light">Card Number</p><p className="text-2xl font-serif tracking-[0.1em]">**** **** **** 8821</p></div>
                        <div className="flex justify-between items-end"><div><p className="text-[10px] opacity-50 uppercase tracking-widest font-light">Card Holder</p><p className="font-medium">JOHN DOE</p></div><div className="text-right"><p className="text-[10px] opacity-50 uppercase tracking-widest font-light">Expires</p><p className="font-medium">12/28</p></div></div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2">Add New Card</Button>
                </section>
                <section className="space-y-6">
                    <h2 className="text-xl font-medium">Billing History</h2>
                    <div className="space-y-3">
                        {[{ label: "Feb 2024 / Monthly Rent", date: "Feb 01", price: "₹5,700" }, { label: "Jan 2024 / Monthly Rent", date: "Jan 01", price: "₹5,700" }, { label: "Dec 2023 / Security Deposit", date: "Dec 15", price: "₹12,000" }].map((b, i) => (
                            <div key={i} className="p-5 flex justify-between items-center rounded-2xl border border-border hover:bg-secondary/30 transition-all cursor-pointer">
                                <div><p className="font-medium text-sm">{b.label}</p><p className="text-xs text-muted-foreground mt-0.5">{b.date}</p></div>
                                <p className="font-serif font-medium">{b.price}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}

function AddressesSection() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Saved Addresses</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {[{ type: "Home", addr: "Penthouse 12B, Luxury Towers, Worli, Mumbai, Maharashtra - 400018", icon: Heart }, { type: "Office", addr: "Level 14, WeWork Galaxy, MG Road, Bengaluru, Karnataka - 560001", icon: Package }].map((a, i) => (
                    <div key={i} className="p-8 rounded-3xl border border-border bg-card space-y-4 relative group">
                        <div className="flex justify-between items-start"><div className="p-3 bg-secondary rounded-2xl"><MapPin className="w-5 h-5 text-muted-foreground" /></div><div className="flex gap-2"><Button variant="ghost" size="sm" className="rounded-full">Edit</Button></div></div>
                        <div><h3 className="font-medium text-lg flex items-center gap-2">{a.type}{i === 0 && <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary">Default</Badge>}</h3><p className="text-sm text-muted-foreground leading-relaxed mt-2">{a.addr}</p></div>
                    </div>
                ))}
                <button className="p-8 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-all group">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors"><ArrowRight className="w-5 h-5 -rotate-45" /></div>
                    <span className="font-medium italic">Add new address</span>
                </button>
            </div>
        </motion.div>
    );
}

function WishlistSection() {
    const wishlist = [
        { name: "Herman Miller Aeron", price: "₹2,500/mo", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400" },
        { name: "Sonos Era 300", price: "₹1,200/mo", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400" },
        { name: "LG C3 OLED 65\"", price: "₹4,800/mo", image: "https://images.unsplash.com/photo-1593359677759-5437334bc938?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <h1 className="text-4xl tracking-tight">Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((item, i) => (
                    <div key={i} className="group relative rounded-3xl overflow-hidden border border-border bg-card hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-[4/5] overflow-hidden"><img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                        <div className="p-6 space-y-4"><div><h3 className="font-medium tracking-tight line-clamp-1">{item.name}</h3><p className="text-sm text-muted-foreground font-serif mt-1">{item.price}</p></div><Button className="w-full rounded-xl">Rent Now</Button></div>
                        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-destructive shadow-lg hover:scale-110 transition-all"><Heart className="w-4 h-4 fill-current" /></button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
