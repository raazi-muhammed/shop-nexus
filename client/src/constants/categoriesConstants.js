const categoriesConstants = [
	{ key: "COMPUTERS_AND_LAPTOPS", value: "Computers and Laptops" },
	{
		key: "SMARTPHONES_AND_ACCESSORIES",

		value: "Smartphones and Accessories",
	},
	{ key: "SOFTWARE", value: "Software" },
	{
		key: "WEARABLES_AND_FITNESS_TECH",

		value: "Wearables and Fitness Tech",
	},
	{
		key: "NETWORKING_AND_INTERNET",

		value: "Networking and Internet",
	},
	{ key: "GAMING", value: "Gaming" },
	{
		key: "CAMERAS_AND_PHOTOGRAPHY",

		value: "Cameras and Photography",
	},
	{ key: "AUDIO_AND_HEADPHONES", value: "Audio and Headphones" },
	{ key: "STORAGE_AND_DRIVES", value: "Storage and Drives" },
	{ key: "PRINTERS_AND_SCANNERS", value: "Printers and Scanners" },
	{
		key: "HOME_AUTOMATION_AND_SMART_HOME",
		value: "Home Automation and Smart Home",
	},
];

export function getCategoryByKey(key) {
	const category = categoriesConstants.find((category) => category.key === key);
	if (category) {
		return category.value;
	} else {
		return "Others";
	}
}

export default categoriesConstants;
