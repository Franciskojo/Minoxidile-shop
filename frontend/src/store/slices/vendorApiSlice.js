import { apiSlice } from './apiSlice.js';

export const vendorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getVendorStats: builder.query({
            query: () => '/vendor/stats',
            providesTags: ['VendorStats'],
        }),
        getVendorProducts: builder.query({
            query: (params) => ({ url: '/vendor/products', params }),
            providesTags: ['Product'],
        }),
        getVendorOrders: builder.query({
            query: () => '/vendor/orders',
            providesTags: ['Order'],
        }),
        updateVendorSettings: builder.mutation({
            query: (data) => ({ url: '/vendor/settings', method: 'PUT', body: data }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetVendorStatsQuery,
    useGetVendorProductsQuery,
    useGetVendorOrdersQuery,
    useUpdateVendorSettingsMutation,
} = vendorApiSlice;
