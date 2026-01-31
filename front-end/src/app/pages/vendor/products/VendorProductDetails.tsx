import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Package, Tag, DollarSign, Clock, Layers, Info, Activity } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { api } from "@/app/services/api";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";

const chartConfig = {
    views: {
        label: "Views",
        color: "hsl(var(--primary))",
    },
};

const analyticsData = [
    { month: "Jan", views: Math.floor(Math.random() * 500) + 100 },
    { month: "Feb", views: Math.floor(Math.random() * 500) + 100 },
    { month: "Mar", views: Math.floor(Math.random() * 500) + 100 },
    { month: "Apr", views: Math.floor(Math.random() * 500) + 100 },
    { month: "May", views: Math.floor(Math.random() * 500) + 100 },
    { month: "Jun", views: Math.floor(Math.random() * 500) + 100 },
];

function AnalyticsChart() {
    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={analyticsData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    pricing: {
        hourly: number;
        daily: number;
        weekly: number;
    };
    totalQuantity: number;
    images: string[];
    isActive: boolean;
    attributes: { key: string; value: string }[];
}

export default function VendorProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data.data);
        } catch (error) {
            console.error("Failed to fetch product", error);
            alert("Failed to load product details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                navigate("/vendor/products");
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading details...</div>;
    }

    if (!product) {
        return <div className="p-8 text-center text-red-500">Product not found.</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/vendor/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                            <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                                {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Tag className="w-4 h-4" /> {product.category}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link to={`/vendor/products/edit/${product._id}`}>
                        <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" /> Edit Product
                        </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content: Images & Description */}
                <div className="md:col-span-2 space-y-6">
                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {product.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {product.images.length === 0 && (
                                    <div className="col-span-2 h-40 flex items-center justify-center text-muted-foreground bg-secondary rounded-lg border border-dashed">
                                        <div className="text-center">
                                            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            No images uploaded
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5" /> Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {product.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Performance Graph */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" /> Performance Analytics
                            </CardTitle>
                            <CardDescription>
                                Views and engagement over the last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <AnalyticsChart />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Details & Pricing */}
                <div className="space-y-6">
                    {/* Inventory Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="w-5 h-5" /> Inventory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-muted-foreground">Total Stock</span>
                                <span className="font-bold text-lg">{product.totalQuantity}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-muted-foreground">Condition</span>
                                <span className="font-medium">
                                    {(product.attributes.find(a => a.key === "Condition")?.value) || "Standard"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-medium">{product.category}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" /> Pricing Rates
                            </CardTitle>
                            <CardDescription>Current rental rates for this item.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-0 text-sm">
                            <div className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>Hourly</span>
                                </div>
                                <span className="font-mono font-medium">₹{product.pricing.hourly || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors bg-secondary/20">
                                <div className="flex items-center gap-2 font-medium">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>Daily</span>
                                </div>
                                <span className="font-mono font-bold text-primary">₹{product.pricing.daily || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span>Weekly</span>
                                </div>
                                <span className="font-mono font-medium">₹{product.pricing.weekly || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
