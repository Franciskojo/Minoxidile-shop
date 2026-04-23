import { apiSlice } from './apiSlice.js';

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query({
            query: () => '/chat/conversations',
            providesTags: ['Conversation'],
        }),
        getMessages: builder.query({
            query: (id) => `/chat/messages/${id}`,
            providesTags: ['Message'],
        }),
        getConversationWithUser: builder.query({
            query: (userId) => `/chat/with/${userId}`,
        }),
    }),
});

export const {
    useGetConversationsQuery,
    useGetMessagesQuery,
    useGetConversationWithUserQuery,
} = chatApiSlice;
