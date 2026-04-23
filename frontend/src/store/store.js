import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import uiReducer from './slices/uiSlice.js';
import { apiSlice } from './slices/apiSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        ui: uiReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: import.meta.env.DEV,
});

export default store;
