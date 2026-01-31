import {
    mockProducts,
    mockBookings,
    mockReviews,
    Product,
    Booking,
    Review,
    categories,
    PendingVendor,
    mockPendingVendors
} from '@/data/mock-data';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const LATENCY = 600; // ms

// --- Mock Server Logic ---
const STORAGE_KEYS = {
    PRODUCTS: 'rentlify_products',
    BOOKINGS: 'rentlify_bookings',
    REVIEWS: 'rentlify_reviews',
    VENDORS: 'rentlify_vendors',
};

class MockServer {
    private getStorage<T>(key: string, initialData: T): T {
        const stored = localStorage.getItem(key);
        if (!stored) {
            localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }

        let data = JSON.parse(stored);

        // Migration logic for product images
        if (key === STORAGE_KEYS.PRODUCTS && Array.isArray(data)) {
            const needsMigration = data.some((p: any) => p.images?.some((img: string) => !img.startsWith('/') || img.includes('unsplash.com')));
            if (needsMigration) {
                // Merge/Reset with new mock data to get updated paths
                data = (initialData as any[]).map((initialProduct: any) => {
                    const existingProduct = (data as any[]).find(p => p.id === initialProduct.id);
                    if (existingProduct) {
                        return { ...existingProduct, images: initialProduct.images };
                    }
                    return initialProduct;
                });
                this.setStorage(key, data);
            }
        }

        // Migration logic for booking images
        if (key === STORAGE_KEYS.BOOKINGS && Array.isArray(data)) {
            const needsMigration = data.some((b: any) => !b.productImage?.startsWith('/') || b.productImage?.includes('unsplash.com'));
            if (needsMigration) {
                data = (data as any[]).map(booking => {
                    const match = (mockBookings as any[]).find(mb => mb.id === booking.id);
                    if (match) {
                        return { ...booking, productImage: match.productImage };
                    }
                    return booking;
                });
                this.setStorage(key, data);
            }
        }

        return data;
    }

    private setStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Products
    async getProducts(): Promise<Product[]> {
        return this.getStorage(STORAGE_KEYS.PRODUCTS, mockProducts);
    }

    async addProduct(product: Product): Promise<Product> {
        const products = await this.getProducts();
        const newProducts = [product, ...products];
        this.setStorage(STORAGE_KEYS.PRODUCTS, newProducts);
        return product;
    }

    async deleteProduct(id: string): Promise<void> {
        const products = await this.getProducts();
        this.setStorage(STORAGE_KEYS.PRODUCTS, products.filter(p => p.id !== id));
    }

    // Bookings
    async getBookings(): Promise<Booking[]> {
        return this.getStorage(STORAGE_KEYS.BOOKINGS, mockBookings);
    }

    async addBooking(booking: Booking): Promise<Booking> {
        const bookings = await this.getBookings();
        const newBookings = [booking, ...bookings];
        this.setStorage(STORAGE_KEYS.BOOKINGS, newBookings);
        return booking;
    }

    // Vendors (Admin Approvals)
    async getPendingVendors(): Promise<PendingVendor[]> {
        return this.getStorage(STORAGE_KEYS.VENDORS, mockPendingVendors);
    }

    async updateVendorStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
        const vendors = await this.getPendingVendors();
        const updatedVendors = vendors.map(v =>
            v.id === id ? { ...v, status, rejectionReason: reason } : v
        );
        this.setStorage(STORAGE_KEYS.VENDORS, updatedVendors);
    }

    // Reviews
    async getReviews(): Promise<Review[]> {
        return this.getStorage(STORAGE_KEYS.REVIEWS, mockReviews);
    }
}

const server = new MockServer();

// Products API
export const api = {
    products: {
        getAll: async (): Promise<Product[]> => {
            await delay(LATENCY);
            return server.getProducts();
        },

        getById: async (id: string): Promise<Product | undefined> => {
            await delay(LATENCY);
            const products = await server.getProducts();
            return products.find(p => p.id === id);
        },

        getByVendor: async (vendorId: string): Promise<Product[]> => {
            await delay(LATENCY);
            const products = await server.getProducts();
            return products.filter(p => p.vendorId === vendorId);
        },

        getCategories: async () => {
            await delay(LATENCY / 3);
            return [...categories];
        },

        add: async (product: Product) => {
            await delay(LATENCY);
            return server.addProduct(product);
        },

        delete: async (id: string) => {
            await delay(LATENCY);
            return server.deleteProduct(id);
        }
    },

    bookings: {
        getAll: async (): Promise<Booking[]> => {
            await delay(LATENCY);
            return server.getBookings();
        },

        getByVendor: async (vendorId: string): Promise<Booking[]> => {
            await delay(LATENCY);
            const bookings = await server.getBookings();
            return bookings.filter(b => b.vendorId === vendorId);
        },

        getByCustomer: async (customerId: string): Promise<Booking[]> => {
            await delay(LATENCY);
            const bookings = await server.getBookings();
            return bookings.filter(b => b.customerId === customerId);
        },

        create: async (booking: Booking): Promise<Booking> => {
            await delay(LATENCY);
            return server.addBooking(booking);
        }
    },

    vendors: {
        getPending: async () => {
            await delay(LATENCY);
            return server.getPendingVendors();
        },
        updateStatus: async (id: string, status: 'approved' | 'rejected', reason?: string) => {
            await delay(LATENCY);
            return server.updateVendorStatus(id, status, reason);
        }
    },

    reviews: {
        getByProduct: async (productId: string): Promise<Review[]> => {
            await delay(LATENCY);
            const reviews = await server.getReviews();
            return reviews.filter(r => r.productId === productId);
        }
    },

    // Analytics Helpers
    analytics: {
        getVendorStats: async (vendorId: string) => {
            await delay(LATENCY);
            const products = await server.getProducts();
            const bookings = await server.getBookings();

            const vendorParams = products.filter(p => p.vendorId === vendorId);
            const vendorBookings = bookings.filter(b => b.vendorId === vendorId);
            const activeBookings = vendorBookings.filter(b => b.status === 'active');
            const totalEarnings = vendorBookings.reduce((sum, b) => sum + b.totalPrice, 0);

            return {
                totalEarnings,
                activeListings: vendorParams.length,
                availableListings: vendorParams.filter(p => p.available).length,
                totalBookings: vendorBookings.length,
                activeBookingCount: activeBookings.length,
                totalViews: 12400,
            };
        },

        getAdminStats: async () => {
            await delay(LATENCY);
            const products = await server.getProducts();
            const bookings = await server.getBookings();

            const platformRevenue = bookings.reduce((sum, b) => sum + b.totalPrice * 0.1, 0);

            return {
                totalUsers: 10543,
                totalVendors: 1234,
                totalCustomers: 9309,
                totalListings: products.length,
                totalTransactions: bookings.length,
                platformRevenue
            };
        }
    }
};
