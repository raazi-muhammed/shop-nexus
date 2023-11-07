const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: "Valid",
		},
		type: {
			type: String,
			required: true,
		},
		category: {
			type: String,
		},
		shopId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
			required: true,
		},
		discountPercentage: {
			type: Number,
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		minAmount: {
			type: Number,
			required: true,
		},
		maxAmount: {
			type: Number,
			required: true,
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
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
