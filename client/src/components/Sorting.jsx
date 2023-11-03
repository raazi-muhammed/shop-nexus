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
				className="form-select form-select-sm text-primary"
				aria-label="Small select example">
				{sortOptions.sortItems.map((item) => (
					<option key={item.value} value={item.value}>
						Sort By: {item.title}
					</option>
				))}
			</select>
		</div>
	);
};

export default Sorting;
