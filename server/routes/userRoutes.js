const router = require("express").Router();
const { isUserAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");
const {
	userLogin,
	loadUser,
	createUser,
	activateUser,
	userLogOut,
	getUserDetails,
	editUserDetails,
	addAddress,
	removeAddress,
	changePassword,
	userAuthentication,
	providerSignIn,
	getWalletDetails,
	becomePlusMember,
	removePlusMembership,
	changeWalletBalance,
	setDefaultAddress,
	startReferral,
} = require("../controller/userController");
const { addReview } = require("../controller/reviewController");

router.post("/login-user", (req, res, next) => {
	userLogin(req, res, next);
});

router.post("/auth-user", (req, res, next) => {
	userAuthentication(req, res, next);
});

router.get("/load-user", isUserAuthenticated, (req, res, next) => {
	loadUser(req, res, next);
});
router.post("/create-user", (req, res, next) => {
	createUser(req, res, next);
});
router.post("/provider-sign-in", (req, res, next) => {
	providerSignIn(req, res, next);
});
router.post("/activation", (req, res, next) => {
	activateUser(req, res, next);
});
router.get("/logout", (req, res, next) => {
	userLogOut(req, res, next);
});
router.get("/user-details", isUserAuthenticated, (req, res, next) => {
	getUserDetails(req, res, next);
});
router.put(
	"/edit-user-details",
	isUserAuthenticated,
	upload.single("file"),
	(req, res, next) => {
		editUserDetails(req, res, next);
	}
);

router.put("/change-password", isUserAuthenticated, (req, res, next) => {
	changePassword(req, res, next);
});

/* Address */
router.post("/add-address", isUserAuthenticated, (req, res, next) => {
	addAddress(req, res, next);
});
router.post("/remove-address", isUserAuthenticated, (req, res, next) => {
	removeAddress(req, res, next);
});

router.post("/set-default-address", isUserAuthenticated, (req, res, next) => {
	setDefaultAddress(req, res, next);
});

/* Wallet */
router.get("/get-wallet-details", isUserAuthenticated, (req, res, next) => {
	getWalletDetails(req, res, next);
});

router.patch(
	"/change-wallet-balance",
	isUserAuthenticated,
	(req, res, next) => {
		changeWalletBalance(req, res, next);
	}
);

/* Referral */
router.put("/start-referral", isUserAuthenticated, (req, res, next) => {
	startReferral(req, res, next);
});

/* Shop Nexus Plus */
router.put("/become-plus-member", isUserAuthenticated, (req, res, next) => {
	becomePlusMember(req, res, next);
});

router.put(
	"/unsubscribe-plus-member",
	isUserAuthenticated,
	(req, res, next) => {
		removePlusMembership(req, res, next);
	}
);

router.post("/add-review", isUserAuthenticated, (req, res, next) => {
	addReview(req, res, next);
});

module.exports = router;
