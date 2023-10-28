const OfferEvent = require("../model/OfferEvent");
const Products = require("../model/Products");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

const newEvent = asyncErrorHandler(async (req, res, next) => {
	const {
		typeOfEvent,
		eventName,
		category,
		description,
		discountPercentage,
		image,
		selectedProducts,
		shopId,
	} = req.body;

	const imageUrls = await Promise.all(
		image.map(async (e, i) => {
			return {
				public_id: i,
				url: await cloudinaryUpload(e, "16by9"),
			};
		})
	);

	const eventDetails = {
		type_of_event: typeOfEvent,
		name: eventName,
		category,
		description,
		images: imageUrls,
		selected_products: selectedProducts,
		discount_percentage: discountPercentage,
		shop: shopId,
	};

	const event = await OfferEvent.create(eventDetails);

	res.status(200).json({
		success: true,
		message: "Event Added",
	});
});

const getAllEvents = asyncErrorHandler(async (req, res, next) => {
	const eventsData = await OfferEvent.find({});
	res.status(200).json({
		success: true,
		eventsData,
	});
});

const getEventDetails = asyncErrorHandler(async (req, res, next) => {
	const { eventId } = req.params;

	const eventsData = await OfferEvent.findOne({ _id: eventId }).populate(
		"selected_products"
	);

	if (eventsData.type_of_event === "CATEGORY_BASED") {
		let products = await Products.find({
			isDeleted: { $ne: true },
			category: eventsData.category,
		});

		eventsData.selected_products = products;
	}

	res.status(200).json({
		success: true,
		eventsData,
	});
});

module.exports = { newEvent, getAllEvents, getEventDetails };
