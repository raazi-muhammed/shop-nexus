const {
	getSellerAllOrders,
	getSingleOrderDetailsForShop,
	changeOrderStatus,
} = require("../controller/orderController");
const { setNewStockAmount } = require("../controller/productController");
const {
	sellerLogin,
	sellerCreateShop,
	sellerActivateShop,
	getShopDetails,
	editShopDetails,
	getProductsFromShop,
	sellerLogOut,
} = require("../controller/sellerController");

const { isSellerAuthenticated } = require("../middleware/sellerAuth");
const { upload } = require("../multer");

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

module.exports = router;
