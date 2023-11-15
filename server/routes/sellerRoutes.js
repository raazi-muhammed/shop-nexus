const router = require("express").Router();
const { isSellerAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const { getSalesReport } = require("../controller/orderController");
const {
	sellerLogin,
	sellerCreateShop,
	sellerActivateShop,
	getShopDetails,
	editShopDetails,
	sellerLogOut,
	changeWalletBalanceSeller,
	getProductsSoldChartData,
	getSalesChartData,
	getOrdersSoldChartData,
	getDashBoardContent,
	getWalletDetailsSeller,
} = require("../controller/sellerController");

router.post("/login-shop", async (req, res, next) => {
	sellerLogin(req, res, next);
});

router.post("/crate-shop", async (req, res, next) => {
	sellerCreateShop(req, res, next);
});
router.post("/activation", async (req, res, next) => {
	sellerActivateShop(req, res, next);
});
router.get("/get-shop-details-public/:id", async (req, res, next) => {
	req.shop = { _id: req.params.id };
	getShopDetails(req, res, next);
});
router.get(
	"/get-shop-details",
	isSellerAuthenticated,
	async (req, res, next) => {
		getShopDetails(req, res, next);
	}
);

router.put(
	"/edit-shop-details",
	isSellerAuthenticated,
	upload.single("file"),
	async (req, res, next) => {
		editShopDetails(req, res, next);
	}
);

router.get("/logout", async (req, res, next) => {
	sellerLogOut(req, res, next);
});

router.get("/wallet-details", isSellerAuthenticated, async (req, res, next) => {
	getWalletDetailsSeller(req, res, next);
});

router.patch(
	"/change-wallet-balance",
	isSellerAuthenticated,
	async (req, res, next) => {
		changeWalletBalanceSeller(req, res, next);
	}
);

/* Charts and Report */
router.get(
	"/chart/products-sold",
	isSellerAuthenticated,
	async (req, res, next) => {
		getProductsSoldChartData(req, res, next);
	}
);

router.get("/chart/sales", isSellerAuthenticated, async (req, res, next) => {
	getSalesChartData(req, res, next);
});

router.get("/chart/orders", isSellerAuthenticated, async (req, res, next) => {
	getOrdersSoldChartData(req, res, next);
});

router.get("/dashboard", isSellerAuthenticated, async (req, res, next) => {
	getDashBoardContent(req, res, next);
});

router.get(
	"/get-sales-report",
	isSellerAuthenticated,
	async (req, res, next) => {
		getSalesReport(req, res, next);
	}
);

module.exports = router;
