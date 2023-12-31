const OfferEvent = require("../model/OfferEvent");
const Products = require("../model/Products");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const findWithPaginationAndSorting = require("../utils/findWithPaginationAndSorting");

// @METHOD POST
// @PATH /event/new-event
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
		eventAccess,
		shopId,
	} = req.body;

	const imageUrls = await Promise.all(
		image.map(async (e, i) => {
			return {
				url: await cloudinaryUpload(e, "16by9"),
			};
		})
	);

	const eventDetails = {
		typeOfEvent,
		name: eventName,
		startDate,
		endDate,
		category,
		description,
		images: imageUrls,
		selectedProducts,
		discountPercentage,
		eventAccess,
		shop: shopId,
	};

	const event = await OfferEvent.create(eventDetails);

	res.status(200).json({
		success: true,
		message: "Event Added",
	});
});

// @METHOD PUT
// @PATH /event/edit-event/:eventId
const editEventSeller = asyncErrorHandler(async (req, res, next) => {
	const { eventId } = req.params;

	const { name, startDate, endDate, description, discountPercentage, image } =
		req.body;

	const eventDetails = {
		name,
		startDate,
		endDate,
		description,
		discountPercentage,
	};

	if (image) {
		const imageUrls = await Promise.all(
			image.map(async (e, i) => {
				return {
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

// @METHOD PUT
// @PATH /event/delete-event/:eventId
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

// @METHOD GET
// @PATH /event/all-events
const getAllEvents = asyncErrorHandler(async (req, res, next) => {
	const today = new Date();
	const isPlusMember = req.query.plusMember;

	let eventAccessArray = [{ eventAccess: "ALL_USERS" }];
	if (isPlusMember == "true")
		eventAccessArray.push({ eventAccess: "PLUS_MEMBERS_ONLY" });

	const eventsData = await OfferEvent.find({
		$or: eventAccessArray,
		isDeleted: false,
		startDate: { $lte: today },
		endDate: { $gte: today },
	}).sort({ createdAt: -1 });

	res.status(200).json({
		success: true,
		eventsData,
	});
});

// @METHOD GET
// @PATH /event/get-all-events-shop
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

// @METHOD GET
// @PATH /event/get-all-events
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

// @METHOD GET
// @PATH /event/get-event-details/:eventId
const getEventDetails = asyncErrorHandler(async (req, res, next) => {
	const { eventId } = req.params;

	const eventsData = await OfferEvent.findOne({ _id: eventId }).populate(
		"selectedProducts"
	);

	if (eventsData.typeOfEvent === "CATEGORY_BASED") {
		let products = await Products.find({
			isDeleted: { $ne: true },
			category: eventsData.category,
		});

		eventsData.selectedProducts = products;
	}
	if (eventsData.typeOfEvent === "ALL_FROM_SHOP") {
		let products = await Products.find({
			isDeleted: { $ne: true },
			"shop.id": eventsData.shop,
		});

		eventsData.selectedProducts = products;
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
		startDate: { $lte: today },
		endDate: { $gte: today },
	});

	// If the event type if COMBO making user both products are there in the cart
	if (event.typeOfEvent == "COMBO_OFFER") {
		const newValidation = event.selectedProducts.map((selectProducts) => {
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
