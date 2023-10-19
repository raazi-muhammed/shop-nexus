const router = require("express").Router();
const Conversation = require("../model/Conversation");

router.post("/get-conversation", async (req, res) => {
	try {
		const { senderId, receiverId } = req.body;
		let conversationId;

		const conversationAlready = await Conversation.findOne({
			members: { $in: [senderId, receiverId] },
		});

		if (!conversationAlready) {
			const newConversation = await Conversation.create({
				members: [senderId, receiverId],
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

module.exports = router;
