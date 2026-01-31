import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterSection {
  title: string;
  isOpen: boolean;
}

export interface FilterState {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  duration: string;
  conditions: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({
    category: true,
    rentPrice: true,
    duration: true,
    brand: false,
    condition: true,
  });

  const toggleSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleConditionChange = (condition: string) => {
    const newConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    onFilterChange({ ...filters, conditions: newConditions });
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-24 h-fit w-full lg:w-72 bg-card rounded-3xl border border-border p-8 space-y-8 shadow-sm"
    >
      <div>
        <h3 className="text-xl font-medium mb-1">Filters</h3>
        <p className="text-sm text-muted-foreground italic">
          Refine your search
        </p>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-sm font-medium uppercase tracking-wider">Category</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform text-muted-foreground group-hover:text-foreground ${sections.category ? "rotate-180" : ""
              }`}
          />
        </button>
        <AnimatePresence>
          {sections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pl-1 overflow-hidden"
            >
              {["Living Room", "Bedroom", "Kitchen", "Dining", "Home Appliances", "Electronics"].map(
                (category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className={`text-sm transition-colors ${filters.categories.includes(category) ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {category}
                    </span>
                  </label>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-border/50" />

      {/* Rent Price Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("rentPrice")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-sm font-medium uppercase tracking-wider">Price Range</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform text-muted-foreground group-hover:text-foreground ${sections.rentPrice ? "rotate-180" : ""
              }`}
          />
        </button>
        <AnimatePresence>
          {sections.rentPrice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 pl-1 overflow-hidden"
            >
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Min</span>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => onFilterChange({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 bg-secondary/50 rounded-xl border-none text-sm focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <span className="text-muted-foreground text-xs font-serif italic">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Max</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 bg-secondary/50 rounded-xl border-none text-sm focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-border/50" />

      {/* Duration Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("duration")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-sm font-medium uppercase tracking-wider">Duration</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform text-muted-foreground group-hover:text-foreground ${sections.duration ? "rotate-180" : ""
              }`}
          />
        </button>
        <AnimatePresence>
          {sections.duration && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pl-1 overflow-hidden"
            >
              {["Any", "Hourly", "Daily", "Weekly", "Monthly"].map(
                (duration) => (
                  <label
                    key={duration}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={filters.duration === duration}
                      onChange={() => onFilterChange({ ...filters, duration })}
                      className="w-4 h-4 border-border accent-primary"
                    />
                    <span className={`text-sm transition-colors ${filters.duration === duration ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {duration}
                    </span>
                  </label>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-border/50" />

      {/* Condition Filter */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("condition")}
          className="w-full flex items-center justify-between text-left group"
        >
          <span className="text-sm font-medium uppercase tracking-wider">Condition</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform text-muted-foreground group-hover:text-foreground ${sections.condition ? "rotate-180" : ""
              }`}
          />
        </button>
        <AnimatePresence>
          {sections.condition && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pl-1 overflow-hidden"
            >
              {["New", "Like New", "Good", "Fair"].map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(condition)}
                    onChange={() => handleConditionChange(condition)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className={`text-sm transition-colors ${filters.conditions.includes(condition) ? "text-primary font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {condition}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onFilterChange({ categories: [], minPrice: 0, maxPrice: 10000, duration: "Any", conditions: [] })}
          className="w-full py-4 bg-secondary text-foreground hover:bg-secondary/70 rounded-2xl transition-all text-sm font-medium tracking-tight"
        >
          Reset All Filters
        </motion.button>
      </div>
    </motion.aside>
  );
}