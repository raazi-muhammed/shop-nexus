import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isCartVisible: false,
};

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		displayCart: (state) => {
			state.isCartVisible = true;
		},
		hideCart: (state) => {
			state.isCartVisible = false;
		},
	},
});

export const { displayCart, hideCart } = cartSlice.actions;
export default cartSlice.reducer;
