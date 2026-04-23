import { apiSlice } from './apiSlice.js';

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (data) => ({ url: '/categories', method: 'POST', body: data }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/categories/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApiSlice;

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (data) => ({ url: '/cart', method: 'POST', body: data }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ itemId, qty }) => ({ url: `/cart/${itemId}`, method: 'PUT', body: { qty } }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (itemId) => ({ url: `/cart/${itemId}`, method: 'DELETE' }),
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => ({ url: '/cart', method: 'DELETE' }),
            invalidatesTags: ['Cart'],
        }),
        applyCoupon: builder.mutation({
            query: (data) => ({ url: '/coupons/apply', method: 'POST', body: data }),
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useApplyCouponMutation,
} = cartApiSlice;

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/dashboard',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: ({ productId, ...params }) => ({ url: `/reviews/${productId}`, params }),
            providesTags: ['Review'],
        }),
        createReview: builder.mutation({
            query: ({ productId, ...data }) => ({ url: `/reviews/${productId}`, method: 'POST', body: data }),
            invalidatesTags: ['Review', 'Product'],
        }),
        deleteReview: builder.mutation({
            query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Review', 'Product'],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
} = reviewsApiSlice;

export const couponsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCoupons: builder.query({
            query: () => '/coupons',
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({ url: '/coupons', method: 'POST', body: data }),
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/coupons/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Coupon'],
        }),
    }),
});

export const {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponsApiSlice;
