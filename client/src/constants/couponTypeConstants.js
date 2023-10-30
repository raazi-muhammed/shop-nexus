const couponTypeConstants = [
	{ key: "ALL_PRODUCTS", value: "All Products" },
	{ key: "SHOP_BASED", value: "Shop Based" },
	{ key: "CATEGORY_BASED_ALL", value: "Category Based all Products" },
	{ key: "CATEGORY_BASED_SHOP", value: "Category Based from Shop" },
];

export function getCouponTypeByKey(key) {
	const category = couponTypeConstants.find((category) => category.key === key);
	if (category) {
		return category.value;
	} else {
		return "Others";
	}
}

export default couponTypeConstants;
