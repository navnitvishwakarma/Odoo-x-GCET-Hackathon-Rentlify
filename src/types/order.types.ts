export type OrderStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: {
        perDay: number;
    };
    category: string;
    images: string[];
    vendorId: string;
    rating: number;
    reviewCount: number;
    location: string;
    availability: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'vendor' | 'customer';
    avatar?: string;
}

export interface OrderItem {
    product: Product; // Populated
    quantity: number;
    startDate: string;
    endDate: string;
    price: number;
}

export interface Order {
    _id: string;
    orderId: string;
    customer: User;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}
