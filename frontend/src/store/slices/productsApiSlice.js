import { apiSlice } from './apiSlice.js';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params = {}) => ({ url: '/products', params }),
            providesTags: ['Product'],
        }),
        getFeaturedProducts: builder.query({
            query: (limit = 8) => ({ url: '/products/featured', params: { limit } }),
            providesTags: ['Product'],
        }),
        getTopRated: builder.query({
            query: () => '/products/top-rated',
            providesTags: ['Product'],
        }),
        getProductBySlug: builder.query({
            query: (slug) => `/products/${slug}`,
            providesTags: (_r, _e, slug) => [{ type: 'Product', id: slug }],
        }),
        getRelatedProducts: builder.query({
            query: (id) => `/products/${id}/related`,
        }),
        createProduct: builder.mutation({
            query: (data) => ({ url: '/products', method: 'POST', body: data }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetFeaturedProductsQuery,
    useGetTopRatedQuery,
    useGetProductBySlugQuery,
    useGetRelatedProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApiSlice;
