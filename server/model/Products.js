const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
	discount_price: {
		type: Number,
		required: [true, "Please enter your product price!"],
	},
	stock: {
		type: Number,
		required: [true, "Please enter your product stock!"],
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
	reviews: [
		{
			user: {
				type: Object,
			},
			rating: {
				type: Number,
			},
			comment: {
				type: String,
			},
			productId: {
				type: String,
			},
			createdAt: {
				type: Date,
				default: Date.now(),
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
	sold_out: {
		type: Boolean,
		default: false,
	},
	total_sell: {
		type: Number,
		default: 0,
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Product", productSchema);
