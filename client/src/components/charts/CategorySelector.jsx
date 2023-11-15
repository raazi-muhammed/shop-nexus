import React from "react";

const CategorySelector = ({
	categorizeBy,
	setCategorizeBy,
	categoryOptions,
}) => {
	return (
		<select
			style={{ maxWidth: "15rem" }}
			value={categorizeBy}
			onChange={(e) => setCategorizeBy(e.target.value)}
			class="form-select form-control-sm form-select-sm"
			aria-label="Default select example">
			{categoryOptions.map((opt) => (
				<option key={opt.key} value={opt.key}>
					Categorize By: {opt.value}
				</option>
			))}
		</select>
	);
};

export default CategorySelector;
