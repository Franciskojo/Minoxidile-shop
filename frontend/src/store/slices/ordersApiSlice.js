import { apiSlice } from './apiSlice.js';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        placeOrder: builder.mutation({
            query: (data) => ({ url: '/orders', method: 'POST', body: data }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        getMyOrders: builder.query({
            query: (params = {}) => ({ url: '/orders/my', params }),
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Order', id }],
        }),
        payOrder: builder.mutation({
            query: ({ id, paymentResult }) => ({ url: `/orders/${id}/pay`, method: 'PUT', body: { paymentResult } }),
            invalidatesTags: ['Order'],
        }),
        cancelOrder: builder.mutation({
            query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PUT' }),
            invalidatesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: (params = {}) => ({ url: '/orders', params }),
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: { status } }),
            invalidatesTags: ['Order', 'Dashboard'],
        }),
        getStripeSession: builder.mutation({
            query: (id) => ({ url: `/orders/${id}/stripe-session`, method: 'POST' }),
        }),
    }),
});

export const {
    usePlaceOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    usePayOrderMutation,
    useCancelOrderMutation,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetStripeSessionMutation,
} = ordersApiSlice;
