import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        mobileSidebarOpen: false,
        searchOpen: false,
        cartSidebarOpen: false,
    },
    reducers: {
        toggleMobileSidebar(state) { state.mobileSidebarOpen = !state.mobileSidebarOpen; },
        closeMobileSidebar(state) { state.mobileSidebarOpen = false; },
        toggleSearch(state) { state.searchOpen = !state.searchOpen; },
        toggleCartSidebar(state) { state.cartSidebarOpen = !state.cartSidebarOpen; },
        closeCartSidebar(state) { state.cartSidebarOpen = false; },
    },
});

export const { toggleMobileSidebar, closeMobileSidebar, toggleSearch, toggleCartSidebar, closeCartSidebar } = uiSlice.actions;
export default uiSlice.reducer;
