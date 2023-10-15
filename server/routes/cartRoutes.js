const router = require("express").Router();
const { isAuthenticated } = require("../middleware/auth");
const {
	addToCart,
	getCart,
	removeFromCart,
} = require("../controller/cartController");

router.post("/add-to-cart", isAuthenticated, (req, res, next) =>
	addToCart(req, res, next)
);
router.get("/get-all-cart", isAuthenticated, (req, res, next) =>
	getCart(req, res, next)
);
router.put("/remove-from-cart", isAuthenticated, (req, res, next) => {
	removeFromCart(req, res, next);
});

module.exports = router;
