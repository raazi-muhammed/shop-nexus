const OfferEvent = require("../model/OfferEvent");
const Products = require("../model/Products");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");

const newEvent = asyncErrorHandler(async (req, res, next) => {
	const {
		typeOfEvent,
		eventName,
		category,
		startDate,
		endDate,
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
		start_date: startDate,
		end_date: endDate,
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

const editEventSeller = asyncErrorHandler(async (req, res, next) => {
	const { eventId } = req.params;

	const { name, startDate, endDate, description, discountPercentage, image } =
		req.body;

	const eventDetails = {
		name,
		start_date: startDate,
		end_date: endDate,
		description,
		discount_percentage: discountPercentage,
	};

	if (image) {
		const imageUrls = await Promise.all(
			image.map(async (e, i) => {
				return {
					public_id: i,
					url: await cloudinaryUpload(e, "16by9"),
				};
			})
		);
		eventDetails.images = imageUrls;
	}

	const event = await OfferEvent.findOneAndUpdate(
		{ _id: eventId },
		eventDetails,
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Event Edited",
		eventData: event,
	});
});

const deleteEventSeller = asyncErrorHandler(async (req, res, next) => {
	const { eventId } = req.params;

	const event = await OfferEvent.findOneAndUpdate(
		{ _id: eventId },
		{ isDeleted: true },
		{ new: true }
	);

	res.status(200).json({
		success: true,
		message: "Event Deleted",
		eventData: event,
	});
});

const getAllEvents = asyncErrorHandler(async (req, res, next) => {
	const today = new Date();
	const eventsData = await OfferEvent.find({
		isDeleted: false,
		start_date: { $lte: today },
		end_date: { $gte: today },
	}).sort({ createdAt: -1 });
	res.status(200).json({
		success: true,
		eventsData,
	});
});

const getAllEventsFromSeller = asyncErrorHandler(async (req, res, next) => {
	const shopId = req.shop._id;

	const [pagination, eventsData] = await findWithPaginationAndSorting(
		req,
		OfferEvent,
		{
			shop: shopId,
		}
	);

	res.status(200).json({
		success: true,
		pagination,
		eventsData,
	});
});
const getAllEventsAdmin = asyncErrorHandler(async (req, res, next) => {
	const [pagination, eventsData] = await findWithPaginationAndSorting(
		req,
		OfferEvent
	);

	res.status(200).json({
		success: true,
		pagination,
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
	if (eventsData.type_of_event === "ALL_FROM_SHOP") {
		let products = await Products.find({
			isDeleted: { $ne: true },
			"shop.id": eventsData.shop,
		});

		eventsData.selected_products = products;
	}

	res.status(200).json({
		success: true,
		eventsData,
	});
});

const isEventValid = async (eventId, cartItems) => {
	const today = new Date();
	const event = await OfferEvent.findOne({
		_id: eventId,
		isDeleted: false,
		start_date: { $lte: today },
		end_date: { $gte: today },
	});

	// If the event type if COMBO making user both products are there in the cart
	if (event.type_of_event == "COMBO_OFFER") {
		const newValidation = event.selected_products.map((selectProducts) => {
			for (let i = 0; i < cartItems.length; i++) {
				if (cartItems[i].product._id.equals(selectProducts)) {
					return true;
				}
			}
			return false;
		});
		if (newValidation.includes(false)) return false;
	}

	if (!event) return false;

	return true;
};

module.exports = {
	newEvent,
	getAllEvents,
	getEventDetails,
	getAllEventsFromSeller,
	editEventSeller,
	isEventValid,
	deleteEventSeller,
	getAllEventsAdmin,
};
