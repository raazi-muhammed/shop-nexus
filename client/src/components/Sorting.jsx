import React from "react";

const Sorting = ({ sortOptions, setSortOptions }) => {
	const sortByChange = (e) => {
		setSortOptions({
			...sortOptions,
			sortBy: e.target.value,
		});
	};

	return (
		<div style={{ maxWidth: "15rem" }}>
			<select
				onChange={sortByChange}
				value={sortOptions.sortBy}
				class="form-select form-select-sm text-primary"
				aria-label="Small select example">
				<option selected>Sort By</option>
				{sortOptions.sortItems.map((item) => (
					<option value={item.value}>Sort By: {item.title}</option>
				))}
			</select>
		</div>
	);
};

export default Sorting;
