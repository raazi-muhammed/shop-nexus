import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userData: {},
	status: "idle",
	error: null,
};

export const cartSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserDataReducer: (state, action) => {
			state.userData = action.payload;
		},
	},
});

export const { setUserDataReducer } = cartSlice.actions;
export default cartSlice.reducer;
