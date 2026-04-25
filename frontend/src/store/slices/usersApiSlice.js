import { apiSlice } from './apiSlice.js';
import { setCredentials, logout, updateUser } from './authSlice.js';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
                } catch (err) {
                    // Do nothing here, the component handles the error UI
                }
            },
        }),
        login: builder.mutation({
            query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
                } catch (err) {
                    // Do nothing here, the component handles the error UI
                }
            },
        }),
        logoutUser: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(logout());
                dispatch(apiSlice.util.resetApiState());
            },
        }),
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateUser(data.user));
                } catch (err) { }
            },
        }),
        updateProfile: builder.mutation({
            query: (data) => ({ url: '/users/profile', method: 'PUT', body: data }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query: (data) => ({ url: '/users/change-password', method: 'PUT', body: data }),
        }),
        toggleWishlist: builder.mutation({
            query: (productId) => ({ url: `/users/wishlist/${productId}`, method: 'POST' }),
            invalidatesTags: ['User'],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateUser({ wishlist: data.wishlist }));
                } catch (err) { }
            },
        }),
        // Admin
        getAllUsers: builder.query({
            query: (params = {}) => ({ url: '/users', params }),
            providesTags: ['User'],
        }),
        updateUserAdmin: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/users/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['User'],
        }),
        deleteUserAdmin: builder.mutation({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['User'],
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: `/auth/reset-password/${data.token}`, // Assuming USERS_URL is not defined, using original path structure
                method: 'PUT',
                body: { password: data.password },
            }),
        }),
        submitContactForm: builder.mutation({
            query: (data) => ({
                url: `/contact`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ContactMessage'],
        }),
        getContactMessages: builder.query({
            query: () => '/contact',
            providesTags: ['ContactMessage'],
        }),
        markContactMessageRead: builder.mutation({
            query: (id) => ({
                url: `/contact/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['ContactMessage'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutUserMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useToggleWishlistMutation,
    useGetAllUsersQuery,
    useUpdateUserAdminMutation,
    useDeleteUserAdminMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useSubmitContactFormMutation,
    useGetContactMessagesQuery,
    useMarkContactMessageReadMutation,
} = usersApiSlice;
