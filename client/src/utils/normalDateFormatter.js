function normalDateFormatter(year, month, day) {
	// Initialize an array to store the components of the formatted date
	const components = [];

	// Add the year if it's defined
	if (year !== undefined) {
		components.push(year);
	}

	// Add the month if it's defined
	if (month !== undefined) {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		components.push(months[month - 1]); // Subtract 1 as month is 0-based
	}

	// Add the day if it's defined
	if (day !== undefined) {
		components.push(day);
	}

	// Join the components with a space and return the formatted date
	return components.join(" ");
}

export default normalDateFormatter;
