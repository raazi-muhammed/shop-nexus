function convertISOToDate(isoDate, time = false, type = "normal") {
	const date = new Date(isoDate);

	if (type === "input") {
		if (isNaN(date)) {
			return "Invalid date format";
		}

		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-indexed
		const day = date.getDate().toString().padStart(2, "0");

		return `${year}-${month}-${day}`;
	}

	// Create an array of month names to use for formatting
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

	// Extract the date components
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Create the custom formatted date string
	let formattedDate;
	if (time) formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes}`;
	else formattedDate = `${month} ${day}, ${year}`;

	return formattedDate;
}

export default convertISOToDate;
