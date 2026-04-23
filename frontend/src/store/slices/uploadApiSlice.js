import { apiSlice } from './apiSlice.js';

export const uploadApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (data) => ({
                url: '/upload',
                method: 'POST',
                body: data,
            }),
        }),
        uploadMultipleImages: builder.mutation({
            query: (data) => ({
                url: '/upload/multiple',
                method: 'POST',
                body: data,
            }),
        }),
        deleteImage: builder.mutation({
            query: (publicId) => ({
                url: `/upload/${publicId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useUploadImageMutation,
    useUploadMultipleImagesMutation,
    useDeleteImageMutation,
} = uploadApiSlice;
