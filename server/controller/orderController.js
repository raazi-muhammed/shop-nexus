const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const Order = require("../model/Order");
const { v4: uuidv4 } = require("uuid");

router.post("/add-to-order", isAuthenticated, async (req, res) => {
	try {
		const orderData = { orderId: uuidv4(), ...req.body.orderState };

		console.log(orderData);

		const data = await Order.create(orderData);
		console.log(data);
	} catch (err) {
		console.log(err);
		console.log("err HERE");
	}
});

module.exports = router;
