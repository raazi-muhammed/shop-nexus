const { isAuthenticated } = require("../middleware/auth");
const { addToOrder } = require("../controller/orderController");

const router = require("express").Router();

router.post("/add-to-order", isAuthenticated, (req, res, next) => {
	addToOrder(req, res, next);
});

module.exports = router;
