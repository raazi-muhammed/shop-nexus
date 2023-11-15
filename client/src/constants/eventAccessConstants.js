const eventAccessConstants = [
	{ key: "ALL_USERS", value: "All Users" },
	{ key: "PLUS_MEMBERS_ONLY", value: "Plus Members Only" },
];

export function getEventAccessByKey(key) {
	const category = eventAccessConstants.find(
		(category) => category.key === key
	);
	if (category) {
		return category.value;
	} else {
		return "Others";
	}
}

export default eventAccessConstants;
