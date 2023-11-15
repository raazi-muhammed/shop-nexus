const router = require("express").Router();
const Message = require("../model/Message");

router.post("/new-message", async (req, res) => {
	try {
		const newMessage = await Message.create(req.body);

		res.status(200).json({
			success: true,
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/get-messages/:conversationId", async (req, res) => {
	const conversationId = req.params.conversationId;

	try {
		const messages = await Message.find({ conversationId });
		res.status(200).json({
			success: true,
			messages,
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
