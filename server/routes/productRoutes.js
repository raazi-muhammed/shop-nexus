const router = require("express").Router();
const {
	getBestSellingProducts,
	getProducts,
	getProductByCategory,
	getProductsIncludingDeleted,
	getSingleProductDetails,
	deleteProductImage,
	editProduct,
	deleteProductSeller,
	editProductAdmin,
	recoverProduct,
	addProduct,
	getProductsFromShop,
	searchProducts,
	changeUserPlaceReviewOnProduct,
} = require("../controller/productController");
const { getReviewFromProduct } = require("../controller/reviewController");

const { isAdminAuthenticated } = require("../middleware/adminAuth");
const { isAuthenticated } = require("../middleware/auth");
const { isSellerAuthenticated } = require("../middleware/sellerAuth");

router.get("/best-selling", (req, res, next) => {
	getBestSellingProducts(req, res, next);
});
router.get("/all-products", (req, res, next) => {
	getProducts(req, res, next);
});
router.get("/filter-products/:category", (req, res, next) => {
	getProductByCategory(req, res, next);
});

router.get("/search-products", (req, res, next) => {
	searchProducts(req, res, next);
});
router.get("/all-products-including-deleted", (req, res, next) => {
	getProductsIncludingDeleted(req, res, next);
});
router.get("/single-product/:id", (req, res, next) => {
	getSingleProductDetails(req, res, next);
});
router.put("/edit-product/:id", isSellerAuthenticated, (req, res, next) => {
	editProduct(req, res, next);
});
router.delete(
	"/delete-product/:id",
	isSellerAuthenticated,
	(req, res, next) => {
		deleteProductSeller(req, res, next);
	}
);
router.delete(
	"/recover-product/:id",
	isSellerAuthenticated,
	(req, res, next) => {
		recoverProduct(req, res, next);
	}
);
router.post("/add-product", isSellerAuthenticated, async (req, res, next) => {
	addProduct(req, res, next);
});
router.get("/get-products-from-shop/:shopId", async (req, res, next) => {
	getProductsFromShop(req, res, next);
});
router.get("/get-reviews/:productId", async (req, res, next) => {
	getReviewFromProduct(req, res, next);
});

/* Admin */
router.put(
	"/edit-product-admin/:id/",
	isAdminAuthenticated,
	(req, res, next) => {
		editProductAdmin(req, res, next);
	}
);
router.put(
	"/delete-product-image/:id",
	isSellerAuthenticated,
	(req, res, next) => {
		deleteProductImage(req, res, next);
	}
);

router.get(
	"/can-user-place-review/:productId",
	isAuthenticated,
	(req, res, next) => {
		changeUserPlaceReviewOnProduct(req, res, next);
	}
);

module.exports = router;
