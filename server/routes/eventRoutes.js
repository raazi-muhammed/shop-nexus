const router = require("express").Router();
const {
	newEvent,
	getAllEvents,
	getEventDetails,
	deleteEventSeller,
	editEventSeller,
	getAllEventsFromSeller,
	getAllEventsAdmin,
} = require("../controller/eventController");
const { isAdminAuthenticated } = require("../middleware/auth");
const { isSellerAuthenticated } = require("../middleware/auth");

/* User */
router.get("/all-events", (req, res, next) => {
	getAllEvents(req, res, next);
});

router.get("/get-event-details/:eventId", (req, res, next) => {
	getEventDetails(req, res, next);
});

/* Seller */
router.post("/new-event", isSellerAuthenticated, (req, res, next) => {
	newEvent(req, res, next);
});

router.get(
	"/get-all-events-shop",
	isSellerAuthenticated,
	async (req, res, next) => {
		getAllEventsFromSeller(req, res, next);
	}
);

router.get(
	"/get-event-details/:eventId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getEventDetails(req, res, next);
	}
);

router.put(
	"/edit-event/:eventId",
	isSellerAuthenticated,
	async (req, res, next) => {
		editEventSeller(req, res, next);
	}
);

router.put(
	"/delete-event/:eventId",
	isSellerAuthenticated,
	async (req, res, next) => {
		deleteEventSeller(req, res, next);
	}
);

/* Admin */
router.get("/get-all-events", isAdminAuthenticated, (req, res, next) =>
	getAllEventsAdmin(req, res, next)
);

module.exports = router;
