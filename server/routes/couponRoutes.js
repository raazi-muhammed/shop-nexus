const router = require("express").Router();
const {
	addCoupon,
	editCoupon,
	getCouponFromSeller,
	getCouponDetails,
	getApplicableCoupons,
	applyCouponCode,
	getAllCoupons,
	changeCouponState,
} = require("../controller/couponController");
const { isAdminAuthenticated } = require("../middleware/auth");
const { isUserAuthenticated } = require("../middleware/auth");
const { isSellerAuthenticated } = require("../middleware/auth");

/* User */
router.put("/apply-coupon", isUserAuthenticated, (req, res, next) => {
	applyCouponCode(req, res, next);
});

router.get("/get-coupons-to-display", isUserAuthenticated, (req, res, next) => {
	getApplicableCoupons(req, res, next);
});

/* Seller */
router.get(
	"/get-all-coupons-shop",
	isSellerAuthenticated,
	async (req, res, next) => {
		getCouponFromSeller(req, res, next);
	}
);

router.post("/add-coupon", isSellerAuthenticated, async (req, res, next) => {
	addCoupon(req, res, next);
});
router.put("/edit-coupon", isSellerAuthenticated, async (req, res, next) => {
	editCoupon(req, res, next);
});

router.get(
	"/get-coupon-details/:couponId",
	isSellerAuthenticated,
	async (req, res, next) => {
		getCouponDetails(req, res, next);
	}
);

/* Admin */
router.get("/get-all-coupons", isAdminAuthenticated, (req, res, next) =>
	getAllCoupons(req, res, next)
);

router.patch("/change-coupon-state", isAdminAuthenticated, (req, res, next) =>
	changeCouponState(req, res, next)
);

module.exports = router;
