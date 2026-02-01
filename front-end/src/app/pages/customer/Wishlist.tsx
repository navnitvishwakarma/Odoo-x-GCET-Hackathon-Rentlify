import { useState } from "react";
import { WishlistPage as WishlistComponent } from "@/app/components/wishlist-page";
import { useAuth } from "@/app/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock Data (In a real app, this would come from an API/Context)
const MOCK_WISHLIST_ITEMS = [
    {
        id: 1,
        name: "Eames Lounge Chair & Ottoman",
        rentPrice: "1,200",
        buyPrice: "85,000",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600",
        category: "Lounge"
    },
    {
        id: 2,
        name: "MacBook Pro 14 M3 Max",
        rentPrice: "4,500",
        buyPrice: "2,45,000",
        image: "https://images.unsplash.com/photo-1517336714467-d23663c76746?auto=format&fit=crop&q=80&w=600",
        category: "Appliances"
    },
    {
        id: 3,
        name: "Dyson V11 Absolute",
        rentPrice: "1,100",
        buyPrice: "52,000",
        image: "https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&q=80&w=600",
        category: "Appliances"
    },
    {
        id: 4,
        name: "Herman Miller Aeron",
        rentPrice: "2,500",
        buyPrice: "1,10,000",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600",
        category: "Office"
    }
];

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState(MOCK_WISHLIST_ITEMS);
    const navigate = useNavigate();
    // const { addToCart } = useCart(); // Assuming there's a cart context, otherwise we'll mock it

    const handleRemove = (product: any) => {
        setWishlistItems(prev => prev.filter(item => item.id !== product.id));
    };

    const handleAddToCart = (product: any) => {
        console.log("Added to cart:", product);
        // addToCart(product);
        alert(`Moved ${product.name} to cart!`);
        handleRemove(product); // Usually moving to cart removes from wishlist
    };

    const handleMoveAllToCart = () => {
        console.log("Moving all to cart");
        alert("All items moved to cart!");
        setWishlistItems([]);
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <WishlistComponent
            items={wishlistItems}
            onBack={handleBack}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
            onMoveAllToCart={handleMoveAllToCart}
        />
    );
}
