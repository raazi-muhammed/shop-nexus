const router = require("express").Router();
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
	googleSignIn,
} = require("../controller/userController");

const {
	getUsersAllOrders,
	getSingleOrders,
	cancelOrder,
} = require("../controller/orderController");

const { isAuthenticated } = require("../middleware/auth");
const { upload } = require("../multer");

router.post("/login-user", (req, res, next) => {
	userLogin(req, res, next);
});

//checks if user is in our data and if he is blocked
router.post("/auth-user", (req, res, next) => {
	userAuthentication(req, res, next);
});

router.get("/load-user", isAuthenticated, (req, res, next) => {
	loadUser(req, res, next);
});
router.post("/create-user", (req, res, next) => {
	createUser(req, res, next);
});
router.post("/google-sign-in", (req, res, next) => {
	googleSignIn(req, res, next);
});
router.post("/activation", (req, res, next) => {
	activateUser(req, res, next);
});
router.get("/logout", (req, res, next) => {
	userLogOut(req, res, next);
});
router.get("/user-details", isAuthenticated, (req, res, next) => {
	getUserDetails(req, res, next);
});
router.put(
	"/edit-user-details",
	isAuthenticated,
	upload.single("file"),
	(req, res, next) => {
		editUserDetails(req, res, next);
	}
);
router.post("/add-address", isAuthenticated, (req, res, next) => {
	addAddress(req, res, next);
});
router.post("/remove-address", isAuthenticated, (req, res, next) => {
	removeAddress(req, res, next);
});

router.get("/get-all-orders", isAuthenticated, (req, res, next) => {
	getUsersAllOrders(req, res, next);
});

router.get("/get-order-details/:orderId", isAuthenticated, (req, res, next) => {
	getSingleOrders(req, res, next);
});

router.put("/cancel-order/:orderId", isAuthenticated, (req, res, next) => {
	cancelOrder(req, res, next);
});

router.put("/change-password", isAuthenticated, (req, res, next) => {
	changePassword(req, res, next);
});

module.exports = router;
