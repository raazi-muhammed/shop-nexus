import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	searchOptions: { searchTerm: "", category: "" },
};

export const searchSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setSearchTermOptions: (state, action) => {
			state.searchOptions.searchTerm = action.payload;
		},
		setCategoryOptions: (state, action) => {
			state.searchOptions.category = action.payload;
		},
	},
});

export const { setSearchTermOptions, setCategoryOptions } = searchSlice.actions;
export default searchSlice.reducer;
