import { FilterSidebar, FilterState } from "@/app/components/filter-sidebar";
import { ProductShowcase } from "@/app/components/product-showcase";

export function BrowseSection({ filters, onFilterChange, onProductClick, onWishlistClick, onAddToCart, onRentNow }: {
  filters: FilterState,
  onFilterChange: (f: FilterState) => void,
  onProductClick?: () => void,
  onWishlistClick?: (product: any) => void,
  onAddToCart?: (product: any) => void,
  onRentNow?: (product: any) => void
}) {
  return (
    <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onFilterChange={onFilterChange} />
        </div>

        {/* Product Grid */}
        <div>
          <ProductShowcase
            filters={filters}
            onProductClick={onProductClick}
            onWishlistClick={onWishlistClick}
            onAddToCart={onAddToCart}
            onRentNow={onRentNow}
          />
        </div>
      </div>
    </section>
  );
}
