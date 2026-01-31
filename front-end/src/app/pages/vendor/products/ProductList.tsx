import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, MoreVertical, Eye } from "lucide-react";
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
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface Product {
    _id: string;
    name: string;
    category: string;
    attributes: { key: string; value: string }[];
    pricing: {
        hourly: number;
        daily: number;
        weekly: number;
    };
    totalQuantity: number;
    images: string[];
    isActive: boolean;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/products/my-products");
            // API returns { success: true, data: [...] }
            setProducts(data.data || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
            // setProducts([]); // Clear products on error or keep empty
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Products</h2>
                    <p className="text-muted-foreground">Manage your rental inventory and pricing.</p>
                </div>
                <Link to="/vendor/products/new">
                    <Button className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-lg border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No products found</h3>
                        <p className="text-muted-foreground mb-4">Get started by adding your first rental item.</p>
                        <Link to="/vendor/products/new">
                            <Button variant="outline">Add Product</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price (Daily)</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary border">
                                                    <ImageWithFallback src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-medium text-foreground">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.category}</td>
                                        <td className="px-6 py-4">₹{product.pricing?.daily}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={product.totalQuantity > 0 ? "outline" : "destructive"}>
                                                {product.totalQuantity} in stock
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`capitalize border-none shadow-none ${product.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800'}`}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link to={`/vendor/products/view/${product._id}`}>
                                                        <DropdownMenuItem>
                                                            <Eye className="w-4 h-4 mr-2" /> View Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <Link to={`/vendor/products/edit/${product._id}`}>
                                                        <DropdownMenuItem>
                                                            <Edit className="w-4 h-4 mr-2" /> Edit
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product._id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
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
// Icon import was missing in logic block, verifying imports...
import { Package as PackageIcon } from "lucide-react"; // Renaming to avoid conflict if Package is used elsewhere, though it's not.
// Wait, I imported Package in line 2? No, I imported Plus, Search...
// Re-checking imports.
