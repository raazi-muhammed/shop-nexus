const {
	adminLogOut,
	adminLogIn,
	getAllUsers,
	adminBlockAndUnBlockUser,
	getAllSellers,
	adminBlockAndUnBlockSeller,
} = require("../controller/adminController");

const {
	getAllOrders,
	getSingleOrders,
} = require("../controller/orderController");

const express = require("express");
router = express.Router();
const { isAdminAuthenticated } = require("../middleware/adminAuth");
const { getAllCoupons } = require("../controller/couponController");

router.get("/logout", (req, res) => adminLogOut(req, res));
router.post("/login", async (req, res, next) => adminLogIn(req, res, next));
router.get("/get-all-users", isAdminAuthenticated, (req, res, next) => {
	getAllUsers(req, res, next);
});
router.get("/get-all-sellers", isAdminAuthenticated, (req, res, next) => {
	getAllSellers(req, res, next);
});
router.post("/block-user", isAdminAuthenticated, (req, res, next) => {
	adminBlockAndUnBlockUser(req, res, next);
});
router.post("/block-seller", isAdminAuthenticated, (req, res, next) => {
	adminBlockAndUnBlockSeller(req, res, next);
});

router.get("/get-all-orders", isAdminAuthenticated, (req, res, next) =>
	getAllOrders(req, res, next)
);

router.get(
	"/get-order-details/:orderId",
	isAdminAuthenticated,
	(req, res, next) => getSingleOrders(req, res, next)
);

router.get("/get-all-coupons", isAdminAuthenticated, (req, res, next) =>
	getAllCoupons(req, res, next)
);

module.exports = router;
