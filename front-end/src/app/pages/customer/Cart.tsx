import { useNavigate } from "react-router-dom";
import { CartPage as CartUI } from "../../components/cart-page";
import { useCart } from "../../context/CartContext";

export default function Cart() {
    const { items, updateCartItem, removeFromCart } = useCart();
    const navigate = useNavigate();

    console.log("Cart items in page:", items);

    // Map context items to UI items if necessary
    // Context item: { _id, product: { ... }, quantity, type, period }
    // UI item: { id, name, image, type, price, duration, quantity, deposit }

    const uiItems = items.map(item => ({
        id: item._id || "temp-" + Math.random(),
        productId: item.product?._id,
        name: item.product?.name || "Unknown Product",
        image: item.product?.images?.[0] || item.product?.image || "",
        type: item.type,
        price: item.product?.price || item.product?.pricing?.daily || 0,
        duration: item.period ? String(item.period) : undefined,
        quantity: item.quantity,
        deposit: item.type === "rent" ? (item.product?.pricing?.deposit || 0) : 0,
    }));

    return (
        <CartUI
            items={uiItems as any}
            onUpdateQuantity={(id, qty) => updateCartItem(id, { quantity: qty })}
            onRemoveItem={(id) => removeFromCart(id)}
            onUpdateDuration={(id, duration) => updateCartItem(id, { period: Number(duration) })}
            onBack={() => navigate('/')}
            onCheckout={() => navigate('/checkout')} // TODO: Create checkout
        />
    );
}
