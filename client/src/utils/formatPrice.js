function formatPrice(price) {
	if (!price) return null;
	const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return `₹${formattedPrice}`;
}

export default formatPrice;
