const router = require("express").Router();
const Conversation = require("../model/Conversation");

router.post("/get-conversation", async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		let conversationId;

		const conversationAlready = await Conversation.findOne({
			user: senderId,
			shop: receiverId,
		});

		if (!conversationAlready) {
			const newConversation = await Conversation.create({
				user: senderId,
				shop: receiverId,
			});
			conversationId = newConversation._id;
		} else {
			conversationId = conversationAlready._id;
		}

		res.status(200).json({
			success: true,
			conversationId,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
		});
	}
});

router.get("/get-all-conversation/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		const conversations = await Conversation.find({
			user: userId,
		}).populate("shop");

		res.status(200).json({
			success: true,
			conversations,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
		});
	}
});

module.exports = router;
