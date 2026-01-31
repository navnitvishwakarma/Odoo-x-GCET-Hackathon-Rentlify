import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const VENDOR_KEYS = {
    all: ['vendors'] as const,
    pending: () => [...VENDOR_KEYS.all, 'pending'] as const,
};

export function usePendingVendors() {
    return useQuery({
        queryKey: VENDOR_KEYS.pending(),
        queryFn: api.vendors.getPending,
    });
}

export function useUpdateVendorStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status, reason }: { id: string, status: 'approved' | 'rejected', reason?: string }) =>
            api.vendors.updateStatus(id, status, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VENDOR_KEYS.all });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}
