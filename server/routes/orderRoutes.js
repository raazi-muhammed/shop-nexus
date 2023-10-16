const { isAuthenticated } = require("../middleware/auth");
const { addToOrder } = require("../controller/orderController");
const { changeStockBasedOnOrder } = require("../controller/productController");

const router = require("express").Router();

router.post("/add-to-order", isAuthenticated, (req, res, next) => {
	addToOrder(req, res, next);

	req.body.orderState.orderItems.map((e) => {
		req.stock = e.quantity;
		req.productId = e.product;
		changeStockBasedOnOrder(req, res, next);
	});
});

/* Other Order Related Routes as in the specific User, Seller Routes */
module.exports = router;
