import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const cartFromStorage = (() => {
    try { return JSON.parse(localStorage.getItem('cart')) || { items: [] }; }
    catch { return { items: [] }; }
})();

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: cartFromStorage.items || [],
        coupon: null,
        couponDiscount: 0,
    },
    reducers: {
        syncCart(state, action) {
            // Sync with server cart
            state.items = action.payload.items || [];
            localStorage.setItem('cart', JSON.stringify({ items: state.items }));
        },
        setCartItems(state, action) {
            state.items = action.payload;
            localStorage.setItem('cart', JSON.stringify({ items: state.items }));
        },
        clearCartLocal(state) {
            state.items = [];
            state.coupon = null;
            state.couponDiscount = 0;
            localStorage.removeItem('cart');
        },
        applyCouponLocal(state, action) {
            state.coupon = action.payload.coupon;
            state.couponDiscount = action.payload.discount;
        },
        removeCouponLocal(state) {
            state.coupon = null;
            state.couponDiscount = 0;
        },
    },
});

export const { syncCart, setCartItems, clearCartLocal, applyCouponLocal, removeCouponLocal } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0);
export const selectCartSubtotal = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
