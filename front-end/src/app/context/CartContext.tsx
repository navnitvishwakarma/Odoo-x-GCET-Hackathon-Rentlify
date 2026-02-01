import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

import { CartItem } from "../types/product.types";

interface CartContextType {
    items: CartItem[];
    isLoading: boolean;
    addToCart: (productId: string, type: "rent" | "buy", quantity?: number, period?: number) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateCartItem: (itemId: string, updates: { quantity?: number; period?: number }) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setItems([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get("/cart");
            setItems(data.data.items || []);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (productId: string, type: "rent" | "buy", quantity = 1, period = 3) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }

        try {
            // Optimistic update (optional, but let's stick to simple first)
            const { data } = await api.post("/cart/add", { productId, type, quantity, period });
            console.log("Cart updated:", data.data);
            setItems(data.data.items);
            toast.success("Added to cart");
        } catch (error: any) {
            console.error("Add to cart failed", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {
            await api.delete(`/cart/${itemId}`);
            setItems((prev) => prev.filter((item) => item._id !== itemId));
            toast.success("Removed from cart");
        } catch (error) {
            console.error("Remove failed", error);
            toast.error("Failed to remove item");
        }
    };

    const updateCartItem = async (itemId: string, updates: { quantity?: number; period?: number }) => {
        try {
            const { data } = await api.patch(`/cart/${itemId}`, updates);
            setItems(data.data.items);
        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update cart");
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart');
            setItems([]);
        } catch (error) {
            console.error("Clear failed", error);
        }
    }

    const cartTotal = items.reduce((total, item) => {
        const price = item.product.price || 0;
        return total + (price * item.quantity);
    }, 0);

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isLoading,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
