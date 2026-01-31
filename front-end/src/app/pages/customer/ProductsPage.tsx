import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { BrowseSection } from "@/app/components/browse-section"; // Reusing the layout from BrowseSection
import { FilterState } from "@/app/components/filter-sidebar";
// Navbar handled by layout

import { FilterSidebar } from "@/app/components/filter-sidebar";
import { ProductShowcase } from "@/app/components/product-showcase";

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category");
    const type_param = searchParams.get("type"); // 'rent' or 'buy'

    // Initial Filter State
    const [filters, setFilters] = useState<FilterState>({
        categories: initialCategory ? [initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)] : [], // specific capitalization handling might be needed
        minPrice: 0,
        maxPrice: 10000,
        duration: "Any",
        conditions: [],
    });

    // Update filters if URL changes (e.g. clicking header links while on the page)
    useEffect(() => {
        const category = searchParams.get("category");
        if (category) {
            // Simple capitalization for matching "Lounge", "Appliances" etc.
            const formattedCategory = category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            // Adjust for specific cases if needed, e.g. "lounge" -> "Living Room"? 
            // The header has "Lounge" and "Appliances". 
            // FilterSidebar has "Living Room", "Bedroom", "Kitchen", "Dining", "Home Appliances", "Electronics".
            // Map "lounge" -> "Living Room", "appliances" -> "Home Appliances"

            let mappedCategory = formattedCategory;
            if (category.toLowerCase() === 'lounge') mappedCategory = 'Living Room';
            if (category.toLowerCase() === 'appliances') mappedCategory = 'Home Appliances';

            setFilters(prev => ({
                ...prev,
                categories: [mappedCategory]
            }));
        } else {
            // If no category param, maybe reset? Or keep existing?
            // Usually clicking "Rent" (no category) should show all categories.
            // But if I was on "Lounge", clicking "Rent" changes type but removes category?
            // The header link is hardcoded `/products?type=rent`. It DOES NOT have category.
            // So we should probably reset categories if it's missing in URL?
            // Let's decide: URL is source of truth.
            setFilters(prev => ({
                ...prev,
                categories: []
            }));
        }
    }, [searchParams]);

    const type = type_param || 'rent'; // Default to rent

    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: type === 'buy' ? product.salePrice : product.dailyPrice,
            type: type === 'buy' ? 'buy' : 'rent',
            quantity: 1,
            duration: type === 'rent' ? 'Daily' : undefined
        });
        // Optional: Show toast here
        console.log("Added to cart:", product.name);
    };

    const handleBuyNow = (product: any) => {
        handleAddToCart(product);
        navigate('/cart'); // Or /checkout if we want direct checkout
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header is provided by MainLayout */}

            {/* Page Content */}
            <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                    {/* Filter Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>

                    {/* Product Grid */}
                    <div>
                        {/* We pass 'type' to ProductShowcase to handle Rent vs Buy logic */}
                        <ProductShowcase
                            filters={filters}
                            type={type}
                            onAddToCart={handleAddToCart}
                            onProductClick={handleBuyNow}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
