const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
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
			required: [true, "Please enter your product category!"],
		},
		tags: {
			type: String,
		},
		price: {
			type: Number,
		},
		discountPrice: {
			type: Number,
			required: [true, "Please enter your product price!"],
		},
		stock: {
			type: Number,
			required: [true, "Please enter your product stock!"],
		},
		images: [
			{
				url: {
					type: String,
					required: true,
				},
			},
		],
		reviews: [
			{
				_id: false,
				review: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Review",
					required: true,
				},
			},
		],
		rating: {
			type: Number,
		},
		shop: {
			_id: false,
			name: {
				type: String,
				required: true,
			},
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Shop",
				required: true,
			},
		},
		soldOut: {
			type: Boolean,
			default: false,
		},
		totalSell: {
			type: Number,
			default: 0,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
