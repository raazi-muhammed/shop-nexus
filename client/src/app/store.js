import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./feature/cart/cartSlice";
import wishListReducer from "./feature/wishList/wishListSlice";
import userDataReducer from "./feature/userData/userDataSlice";
import orderDataReducer from "./feature/order/orderSlice";

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		wishList: wishListReducer,
		userData: userDataReducer,
		order: orderDataReducer,
	},
});
