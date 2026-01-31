import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const PRODUCT_KEYS = {
    all: ['products'] as const,
    lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
    list: (filters: string) => [...PRODUCT_KEYS.lists(), { filters }] as const,
    details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
    vendor: (vendorId: string) => [...PRODUCT_KEYS.all, 'vendor', vendorId] as const,
    categories: ['categories'] as const,
};

export function useProducts() {
    return useQuery({
        queryKey: PRODUCT_KEYS.lists(),
        queryFn: api.products.getAll,
    });
}

export function useProduct(id: string | undefined) {
    return useQuery({
        queryKey: PRODUCT_KEYS.detail(id || ''),
        queryFn: () => api.products.getById(id || ''),
        enabled: !!id,
    });
}

export function useVendorProducts(vendorId: string) {
    return useQuery({
        queryKey: PRODUCT_KEYS.vendor(vendorId),
        queryFn: () => api.products.getByVendor(vendorId),
        enabled: !!vendorId,
    });
}

export function useCategories() {
    return useQuery({
        queryKey: PRODUCT_KEYS.categories,
        queryFn: api.products.getCategories,
    });
}

export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.products.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.products.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
        },
    });
}
