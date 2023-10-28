const typeOfEventsConstants = [
	{ key: "PRODUCT_BASED", value: "Product Based" },
	{ key: "CATEGORY_BASED", value: "Category Based" },
	{ key: "COMBO_OFFER", value: "Combo Offer" },
];

export function getCategoryByKey(key) {
	const category = typeOfEventsConstants.find(
		(category) => category.key === key
	);
	if (category) {
		return category.value;
	} else {
		return "Others";
	}
}

export default typeOfEventsConstants;
