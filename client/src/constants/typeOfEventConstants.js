const typeOfEventsConstants = [
	{ key: "PRODUCT_BASED", value: "Product Based" },
	{ key: "CATEGORY_BASED", value: "Category Based" },
	{ key: "COMBO_OFFER", value: "Combo Offer" },
	{ key: "BYE_ONE_GET_ONE_FREE", value: "Bye one Get one Free" },
	{ key: "ALL_FROM_SHOP", value: "All from Shop" },
];

export function getTypeOfEventByKey(key) {
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
