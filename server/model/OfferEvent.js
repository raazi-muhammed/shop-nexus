const mongoose = require("mongoose");

const offerEventsSchema = new mongoose.Schema(
	{
		type_of_event: {
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
		price: {
			type: Number,
		},
		discount_price: {
			type: Number,
		},
		discount_percentage: {
			type: Number,
		},
		selected_products: [
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
				public_id: {
					type: String,
				},
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
