const orderStateConstants = [
	{
		key: "PROCESSING",
		value: "Processing",
	},
	{
		key: "CANCELED",
		value: "Canceled",
	},
	{
		key: "DELIVERED",
		value: "Delivered",
	},
	{
		key: "PROCESSING_RETURN",
		value: "Processing Return",
	},
	{
		key: "RETURN_APPROVED",
		value: "Return Approved",
	},
];

export function getOrderStateByKey(key) {
	const orderState = orderStateConstants.find(
		(orderState) => orderState.key === key
	);
	if (orderState) {
		return orderState.value;
	} else {
		return "Others";
	}
}

export default orderStateConstants;
