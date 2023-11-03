const couponStateConstants = [
	{
		key: "ACTIVE",
		value: "Active",
	},
	{
		key: "IN_ACTIVE",
		value: "In Active",
	},
	{
		key: "WAITING_APPROVAL",
		value: "Waiting Approval",
	},
	{
		key: "NOT_APPROVED",
		value: "Not Approved",
	},
];

export function getCouponStateByKey(key) {
	const category = couponStateConstants.find(
		(category) => category.key === key
	);
	if (category) {
		return category.value;
	} else {
		return "Others";
	}
}

export default couponStateConstants;
