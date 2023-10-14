import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./feature/cart/cartSlice";
import wishListReducer from "./feature/wishList/wishListSlice";

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		wishList: wishListReducer,
	},
});
