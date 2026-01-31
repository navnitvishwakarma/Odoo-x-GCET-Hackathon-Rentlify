import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const BOOKING_KEYS = {
    all: ['bookings'] as const,
    vendor: (vendorId: string) => [...BOOKING_KEYS.all, 'vendor', vendorId] as const,
    customer: (customerId: string) => [...BOOKING_KEYS.all, 'customer', customerId] as const,
};

export const ANALYTIC_KEYS = {
    vendor: (vendorId: string) => ['analytics', 'vendor', vendorId] as const,
    admin: ['analytics', 'admin'] as const,
};

export function useVendorBookings(vendorId: string) {
    return useQuery({
        queryKey: BOOKING_KEYS.vendor(vendorId),
        queryFn: () => api.bookings.getByVendor(vendorId),
        enabled: !!vendorId,
    });
}

export function useCustomerBookings(customerId: string) {
    return useQuery({
        queryKey: BOOKING_KEYS.customer(customerId),
        queryFn: () => api.bookings.getByCustomer(customerId),
        enabled: !!customerId,
    });
}

export function useVendorStats(vendorId: string) {
    return useQuery({
        queryKey: ANALYTIC_KEYS.vendor(vendorId),
        queryFn: () => api.analytics.getVendorStats(vendorId),
        enabled: !!vendorId,
    });
}

export function useAdminStats() {
    return useQuery({
        queryKey: ANALYTIC_KEYS.admin,
        queryFn: api.analytics.getAdminStats,
    });
}

export function useAllBookings() {
    return useQuery({
        queryKey: BOOKING_KEYS.all,
        queryFn: api.bookings.getAll,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.bookings.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}
