const mongoose = require("mongoose");

const offerEventsSchema = new mongoose.Schema(
	{
		typeOfEvent: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: [true, "Please enter your product name!"],
		},
		description: {
			type: String,
			required: [true, "Please enter your product description!"],
		},
		category: {
			type: String,
		},
		startDate: {
			type: Date,
			require: true,
		},
		endDate: {
			type: Date,
			require: true,
		},
		discountPercentage: {
			type: Number,
		},
		selectedProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		shop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
			required: true,
		},
		images: [
			{
				url: {
					type: String,
					required: true,
				},
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("OfferEvent", offerEventsSchema);
