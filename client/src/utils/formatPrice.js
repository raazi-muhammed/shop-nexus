function formatPrice(price) {
	let floorPrice = Math.floor(price);
	if (!floorPrice) return null;
	const formattedPrice = floorPrice
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return `₹${formattedPrice}`;
}

export default formatPrice;
