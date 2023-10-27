const router = require("express").Router();
const {
	getSubscriptionDetails,
	subscribeToNexusPlus,
	cancelSubscription,
	createRazorPayOrder,
} = require("../controller/paymentController");

router.post("/shop-nexus-plus", async (req, res, next) => {
	subscribeToNexusPlus(req, res, next);
});

router.get("/subscription-details/:subscriptionId", async (req, res, next) => {
	getSubscriptionDetails(req, res, next);
});

router.put("/cancel-subscription", async (req, res, next) => {
	cancelSubscription(req, res, next);
});

router.post("/create-razorpay-order", async (req, res, next) => {
	createRazorPayOrder(req, res, next);
});

router.get("/get-razorpay-key", (req, res, next) => {
	res.send({ key: process.env.RAZORPAY_API_KEY });
});

module.exports = router;
