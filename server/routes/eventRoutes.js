const { newEvent, getAllEvents } = require("../controller/eventController");

const router = require("express").Router();

router.get("/all-events", (req, res, next) => {
	getAllEvents(req, res, next);
});

router.post("/new-event", (req, res, next) => {
	newEvent(req, res, next);
});

module.exports = router;
