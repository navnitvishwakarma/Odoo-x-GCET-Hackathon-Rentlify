export interface Product {
    _id: string;
    name: string;
    description?: string;
    image: string; // Main image for display
    images?: string[]; // All images
    category: string;
    price?: number; // Base price
    pricing?: { // Rental pricing
        hourly: number;
        daily: number;
        weekly: number;
        deposit: number;
    };
    condition?: string;
    totalQuantity?: number;
    vendor?: string | any; // ID or object
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Optional: CartItem type if we want to share that too
export interface CartItem {
    _id?: string;
    product: Product;
    quantity: number;
    type: "rent" | "buy";
    period?: number;
    startDate?: Date;
    endDate?: Date;
}
