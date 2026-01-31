import { HeroSection } from "@/app/components/hero-section";
import { CategorySection } from "@/app/components/category-section";
import { BrowseSection } from "@/app/components/browse-section";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FilterState } from "@/app/components/filter-sidebar";

export default function Home() {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        minPrice: 0,
        maxPrice: 10000,
        duration: "Any",
        conditions: [],
    });

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
                    onAddToCart={(product) => { }} // TODO: Add to cart context
                />
            </div>
        </>
    );
}
