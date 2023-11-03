const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
	{
		personId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
		details: {
			type: Object,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionsSchema);
