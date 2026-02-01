import { HeroSection } from "@/app/components/hero-section";
import { CategorySection } from "@/app/components/category-section";
import { BrowseSection } from "@/app/components/browse-section";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { FilterState } from "@/app/components/filter-sidebar";
import { useCart } from "@/app/context/CartContext";

export default function Home() {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        minPrice: 0,
        maxPrice: 10000,
        duration: "Any",
        conditions: [],
    });

    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Browse Ref for scrolling
    const browseRef = useRef<HTMLDivElement>(null);

    const handleCategorySelect = (category: string) => {
        setFilters((prev: FilterState) => ({
            ...prev,
            categories: prev.categories.includes(category) ? prev.categories : [...prev.categories, category],
        }));
        browseRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <HeroSection />
            <CategorySection onCategorySelect={handleCategorySelect} />
            <div ref={browseRef}>
                <BrowseSection
                    filters={filters}
                    onFilterChange={setFilters}
                    onProductClick={() => { }} // TODO: Navigate to /products/:id
                    onWishlistClick={() => { }} // TODO: Add to wishlist context
                    onAddToCart={async (product) => {
                        await addToCart(product._id, "rent");
                        navigate('/cart');
                    }} // Default to rent for now
                    onRentNow={(product) => navigate('/checkout', {
                        state: {
                            items: [{
                                product: product, // Pass full product object to avoid refetching
                                productId: product._id,
                                quantity: 1,
                                type: 'rent',
                                period: 3 // Default period
                            }]
                        }
                    })}
                />
            </div>
        </>
    );
}
