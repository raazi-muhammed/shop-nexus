const OfferEvent = require("../model/OfferEvent");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinaryUpload = require("../utils/cloudinaryUpload");

const newEvent = asyncErrorHandler(async (req, res, next) => {
	const {
		eventName,
		category,
		description,
		price,
		discountedPrice,
		image,
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
		name: eventName,
		category,
		description,
		price,
		images: imageUrls,
		discount_price: discountedPrice,
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
module.exports = { newEvent, getAllEvents };
