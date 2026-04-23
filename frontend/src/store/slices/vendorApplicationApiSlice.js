import { apiSlice } from './apiSlice.js';

export const vendorApplicationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitVendorApplication: builder.mutation({
            query: (data) => ({
                url: '/vendor-applications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['VendorApplication'],
        }),
        getMyVendorApplication: builder.query({
            query: () => '/vendor-applications/my',
            providesTags: ['VendorApplication'],
        }),
        getAllVendorApplications: builder.query({
            query: () => '/vendor-applications',
            providesTags: ['VendorApplication'],
        }),
        updateVendorApplicationStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/vendor-applications/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['VendorApplication', 'Dashboard'],
        }),
    }),
});

export const {
    useSubmitVendorApplicationMutation,
    useGetMyVendorApplicationQuery,
    useGetAllVendorApplicationsQuery,
    useUpdateVendorApplicationStatusMutation,
} = vendorApplicationApiSlice;
