import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	orderItems: [],
	user: "",
	shippingAddress: {},
	totalPrice: 0,
	paymentInfo: {},
	events: {},
};

export const orderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		setOrderItems: (state, action) => {
			state.orderItems = action.payload;
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
		},
		setTotalPrice: (state, action) => {
			state.totalPrice = action.payload;
		},
		setPaymentInfo: (state, action) => {
			state.paymentInfo = action.payload;
		},
		setEvents: (state, action) => {
			state.events = action.payload;
		},
	},
});

export const {
	setOrderItems,
	setUser,
	setShippingAddress,
	setTotalPrice,
	setPaymentInfo,
	setEvents,
} = orderSlice.actions;
export default orderSlice.reducer;
