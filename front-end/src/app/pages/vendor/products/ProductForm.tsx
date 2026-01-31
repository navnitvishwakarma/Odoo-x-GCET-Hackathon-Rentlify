import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea"; // Assuming this exists or using Input
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { api } from "@/app/services/api";
import { cn } from "@/app/components/ui/utils";

const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    category: z.string().min(2, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    hourlyPrice: z.coerce.number().min(0),
    dailyPrice: z.coerce.number().min(0),
    weeklyPrice: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1),
    condition: z.enum(["New", "Like New", "Good", "Fair"]),
    images: z.array(z.string()).min(1, "At least one image is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [images, setImages] = useState<string[]>([]);
    const [imageUrlInput, setImageUrlInput] = useState("");

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            condition: "New",
            hourlyPrice: 0,
            dailyPrice: 0,
            weeklyPrice: 0,
            quantity: 1
        }
    });

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        setValue("images", images);
    }, [images, setValue]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            const product = data.data;

            // Find condition from attributes
            const conditionAttr = product.attributes?.find((a: any) => a.key === "Condition");

            reset({
                name: product.name,
                category: product.category,
                description: product.description,
                hourlyPrice: product.pricing?.hourly || 0,
                dailyPrice: product.pricing?.daily || 0,
                weeklyPrice: product.pricing?.weekly || 0,
                quantity: product.totalQuantity || 1,
                condition: (conditionAttr?.value as any) || "Good",
                images: product.images || []
            });
            setImages(product.images || []);
        } catch (error) {
            console.error("Failed to fetch product", error);
            alert("Failed to load product details");
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            const payload = {
                name: data.name,
                category: data.category,
                description: data.description,
                images: data.images,
                totalQuantity: data.quantity,
                pricing: {
                    hourly: data.hourlyPrice,
                    daily: data.dailyPrice,
                    weekly: data.weeklyPrice,
                },
                attributes: [
                    { key: "Condition", value: data.condition }
                ]
            };

            if (isEditing) {
                await api.put(`/products/${id}`, payload);
            } else {
                await api.post("/products", payload);
            }
            navigate("/vendor/products");
        } catch (error: any) {
            console.error("Failed to save product", error);
            alert(error.response?.data?.message || "Failed to save product");
        }
    };

    const addImage = () => {
        if (imageUrlInput.trim()) {
            setImages([...images, imageUrlInput.trim()]);
            setImageUrlInput("");
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Link to="/vendor/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update your product details." : "Create a new product listing."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit as any)}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <Input placeholder="e.g. DSLR Camera Kit" {...register("name")} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <Input placeholder="e.g. Electronics" {...register("category")} />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Condition</label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("condition")}
                                    >
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                    </select>
                                    {errors.condition && <p className="text-sm text-red-500">{errors.condition.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe your product..."
                                    {...register("description")}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing (₹)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Hourly Price</label>
                                <Input type="number" min="0" {...register("hourlyPrice")} />
                                {errors.hourlyPrice && <p className="text-sm text-red-500">{errors.hourlyPrice.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Daily Price</label>
                                <Input type="number" min="0" {...register("dailyPrice")} />
                                {errors.dailyPrice && <p className="text-sm text-red-500">{errors.dailyPrice.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Weekly Price</label>
                                <Input type="number" min="0" {...register("weeklyPrice")} />
                                {errors.weeklyPrice && <p className="text-sm text-red-500">{errors.weeklyPrice.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory & Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Quantity Available</label>
                                <Input type="number" min="1" {...register("quantity")} />
                                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Images</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste image URL..."
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                    />
                                    <Button type="button" onClick={addImage} variant="secondary">Add</Button>
                                </div>
                                {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}

                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                                            <img src={img} alt="Product" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Link to="/vendor/products">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
