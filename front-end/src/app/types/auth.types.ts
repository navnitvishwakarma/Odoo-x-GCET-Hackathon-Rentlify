export type Role = 'admin' | 'vendor' | 'customer';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
    isEmailVerified: boolean;
    phone?: string;
    businessName?: string; // Vendor only
    address?: {            // Vendor only
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    createdAt: string;
}

export interface AuthResponse {
    user: User;
    tokens: {
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
    };
}
