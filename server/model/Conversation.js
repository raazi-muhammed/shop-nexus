const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		shop: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shop",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
