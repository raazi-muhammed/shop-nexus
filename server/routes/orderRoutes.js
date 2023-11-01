const { isAuthenticated } = require("../middleware/auth");
const {
	addToOrder,
	invoiceGenerator,
} = require("../controller/orderController");
const { changeStockBasedOnOrder } = require("../controller/productController");

const router = require("express").Router();

router.post("/add-to-order", isAuthenticated, (req, res, next) => {
	addToOrder(req, res, next);
});

router.get("/get-invoice/:orderId", isAuthenticated, (req, res, next) => {
	invoiceGenerator(req, res, next);
});

/* Other Order Related Routes as in the specific User, Seller Routes */
module.exports = router;
