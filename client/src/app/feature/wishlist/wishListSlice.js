import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isWishListVisible: false,
};

export const wishListSlice = createSlice({
	name: "wishList",
	initialState,
	reducers: {
		displayWishList: (state) => {
			state.isWishListVisible = true;
		},
		hideWishList: (state) => {
			state.isWishListVisible = false;
		},
	},
});

export const { displayWishList, hideWishList } = wishListSlice.actions;
export default wishListSlice.reducer;
