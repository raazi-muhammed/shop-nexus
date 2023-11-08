const { isUserAuthenticated } = require("../middleware/auth");
const {
	addToOrder,
	getSellerAllOrders,
	changeOrderStatus,
	getSingleOrderDetailsForShop,
	getUsersAllOrders,
	getSingleOrders,
	cancelOrder,
	returnOrder,
	getAllOrders,
} = require("../controller/orderController");
const { isSellerAuthenticated } = require("../middleware/auth");
const { isAdminAuthenticated } = require("../middleware/auth");

const router = require("express").Router();

/* User */
router.post("/add-to-order", isUserAuthenticated, (req, res, next) => {
	addToOrder(req, res, next);
});

router.get("/get-all-orders", isUserAuthenticated, (req, res, next) => {
	getUsersAllOrders(req, res, next);
});

router.get(
	"/get-order-details/:orderId",
	isUserAuthenticated,
	(req, res, next) => {
		getSingleOrders(req, res, next);
	}
);

router.put("/cancel-order/:orderId", isUserAuthenticated, (req, res, next) => {
	cancelOrder(req, res, next);
});

router.put("/return-order/:orderId", isUserAuthenticated, (req, res, next) => {
	returnOrder(req, res, next);
});

/* Seller */
router.get(
	"/get-order-details-shop/:orderId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getSingleOrderDetailsForShop(req, res, next);
	}
);

router.patch(
	"/change-order-status/:orderId",
	isSellerAuthenticated,
	async (req, res, next) => {
		changeOrderStatus(req, res, next);
	}
);

router.get(
	"/get-all-orders-shop",
	isSellerAuthenticated,
	async (req, res, next) => {
		getSellerAllOrders(req, res, next);
	}
);

/* Admin */
router.get("/get-all-orders-admin", isAdminAuthenticated, (req, res, next) =>
	getAllOrders(req, res, next)
);
router.get(
	"/get-order-details-admin/:orderId",
	isAdminAuthenticated,
	(req, res, next) => getSingleOrders(req, res, next)
);

module.exports = router;
