const {
	getSellerAllOrders,
	getSingleOrderDetailsForShop,
	changeOrderStatus,
} = require("../controller/orderController");
const {
	setNewStockAmount,
	getProductsFromShop,
} = require("../controller/productController");
const {
	sellerLogin,
	sellerCreateShop,
	sellerActivateShop,
	getShopDetails,
	editShopDetails,
	sellerLogOut,
	getWalletDetails,
	changeWalletBalanceSeller,
	getProductsSoldChartData,
} = require("../controller/sellerController");

const {
	addCoupon,
	getCouponFromSeller,
	getCouponDetails,
	editCoupon,
} = require("../controller/couponController");

const { isSellerAuthenticated } = require("../middleware/sellerAuth");
const { upload } = require("../multer");
const {
	getAllEventsFromSeller,
	getEventDetails,
	editEventSeller,
} = require("../controller/eventController");

const router = require("express").Router();

router.post("/login-shop", async (req, res, next) => {
	sellerLogin(req, res, next);
});

router.post("/crate-shop", async (req, res, next) => {
	sellerCreateShop(req, res, next);
});
router.post("/activation", async (req, res, next) => {
	sellerActivateShop(req, res, next);
});
router.get("/get-shop-details/:id", async (req, res, next) => {
	getShopDetails(req, res, next);
});

router.put(
	"/edit-shop-details",
	isSellerAuthenticated,
	upload.single("file"),
	async (req, res, next) => {
		editShopDetails(req, res, next);
	}
);

router.get(
	"/get-products-from-shop/:shopId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getProductsFromShop(req, res, next);
	}
);

router.get(
	"/get-all-orders/:shopId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getSellerAllOrders(req, res, next);
	}
);

router.get(
	"/get-order-details/:orderId/:shopId",
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

router.patch(
	"/change-stock-value",
	isSellerAuthenticated,
	async (req, res, next) => {
		setNewStockAmount(req, res, next);
	}
);

router.get("/logout", async (req, res, next) => {
	sellerLogOut(req, res, next);
});

/* Coupon ------------------------------------------------------------------  */
router.post("/add-coupon", isSellerAuthenticated, async (req, res, next) => {
	addCoupon(req, res, next);
});
router.post("/edit-coupon", isSellerAuthenticated, async (req, res, next) => {
	editCoupon(req, res, next);
});

router.get(
	"/get-all-coupons/:shopId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getCouponFromSeller(req, res, next);
	}
);

router.get(
	"/get-all-events/:shopId",
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

router.get(
	"/get-coupon-details/:couponId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getCouponDetails(req, res, next);
	}
);

router.get("/wallet-details", isSellerAuthenticated, async (req, res, next) => {
	getWalletDetails(req, res, next);
});

router.patch(
	"/change-wallet-balance",
	isSellerAuthenticated,
	async (req, res, next) => {
		changeWalletBalanceSeller(req, res, next);
	}
);

router.get(
	"/chart/products-sold",
	isSellerAuthenticated,
	async (req, res, next) => {
		getProductsSoldChartData(req, res, next);
	}
);

module.exports = router;
