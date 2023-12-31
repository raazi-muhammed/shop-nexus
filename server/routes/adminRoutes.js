const express = require("express");
router = express.Router();
const { isAdminAuthenticated } = require("../middleware/auth");
const {
	adminLogOut,
	adminLogIn,
	getAllUsers,
	adminBlockAndUnBlockUser,
	getAllSellers,
	adminBlockAndUnBlockSeller,
	getDashBoardContentAdmin,
	getSalesChartDataAdmin,
	getOrdersSoldChartDataAdmin,
} = require("../controller/adminController");

const { getSalesReportAdmin } = require("../controller/orderController");

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

/* Charts */
router.get("/chart/orders", isAdminAuthenticated, async (req, res, next) => {
	getOrdersSoldChartDataAdmin(req, res, next);
});
router.get("/chart/sales", isAdminAuthenticated, async (req, res, next) => {
	getSalesChartDataAdmin(req, res, next);
});
router.get("/dashboard", isAdminAuthenticated, async (req, res, next) => {
	getDashBoardContentAdmin(req, res, next);
});

router.get(
	"/get-sales-report",
	isAdminAuthenticated,
	async (req, res, next) => {
		getSalesReportAdmin(req, res, next);
	}
);
module.exports = router;
