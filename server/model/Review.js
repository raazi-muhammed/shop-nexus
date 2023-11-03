const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		rating: {
			type: String,
			required: true,
		},
		review: {
			type: String,
		},
		user: {
			name: {
				type: String,
				required: true,
			},
			avatar: {
				type: String,
			},
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		},
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
