const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	orderId: {
		type: String,
		required: true,
	},
	orderItems: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			shop: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shop",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	shippingAddress: {
		type: Object,
		required: true,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		default: "Processing",
	},
	paymentInfo: {
		id: {
			type: String,
		},
		status: {
			type: String,
		},
		type: {
			type: String,
		},
	},
	paidAt: {
		type: Date,
	},
	deliveredAt: {
		type: Date,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	events: [
		{
			name: {
				type: String,
				required: true,
			},
			date: {
				type: Date,
				default: Date.now(),
			},
			description: {
				type: String,
			},
		},
	],
});

module.exports = mongoose.model("Order", orderSchema);
