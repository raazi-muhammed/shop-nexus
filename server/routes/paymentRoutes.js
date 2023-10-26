const router = require("express").Router();

const Razorpay = require("razorpay");
const ErrorHandler = require("../utils/errorHandler");

var instance = new Razorpay({
	key_id: process.env.RAZORPAY_API_KEY,
	key_secret: process.env.RAZORPAY_API_SECRET,
});

router.post("/shop-nexus-plus", async (req, res) => {
	try {
		console.log(req.body);

		const options = {
			plan_id: "plan_MsVot9lXjPcIQc",
			total_count: 12,
			quantity: 1,
		};

		const order = await instance.subscriptions.create(options);
		if (!order) return next(new ErrorHandler("Some error occurred", 500));

		res.status(200).json({
			success: true,
			order,
		});
	} catch (err) {
		console.log(err);
		next(new ErrorHandler("Razorpay failed", 500));
	}
});

router.post("/create-razorpay-order", async (req, res) => {
	try {
		console.log(req.body);

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: "receipt#1",
		};

		const order = await instance.orders.create(options);
		if (!order) return next(new ErrorHandler("Some error occurred", 500));

		res.status(200).json({
			success: true,
			order,
		});
	} catch (err) {
		console.log(err);
		next(new ErrorHandler("Razorpay failed", 500));
	}
});

router.get("/get-razorpay-key", (req, res) => {
	res.send({ key: process.env.RAZORPAY_API_KEY });
});

module.exports = router;
