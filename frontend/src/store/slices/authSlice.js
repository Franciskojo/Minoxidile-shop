import { createSlice } from '@reduxjs/toolkit';

// Try to read initial user from localStorage
const userFromStorage = (() => {
    try { return JSON.parse(localStorage.getItem('userInfo')); }
    catch { return null; }
})();

const tokenFromStorage = localStorage.getItem('accessToken') || null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: userFromStorage,
        token: tokenFromStorage,
        isAuthenticated: !!userFromStorage,
    },
    reducers: {
        setCredentials(state, action) {
            const { user, accessToken } = action.payload;
            state.user = user;
            state.token = accessToken;
            state.isAuthenticated = true;
            localStorage.setItem('userInfo', JSON.stringify(user));
            if (accessToken) localStorage.setItem('accessToken', accessToken);
        },
        updateUser(state, action) {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('userInfo', JSON.stringify(state.user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('accessToken');
        },
    },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Selector
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsVendor = (state) => state.auth.user?.role === 'vendor' || state.auth.user?.role === 'admin';
