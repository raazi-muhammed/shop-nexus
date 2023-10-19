const router = require("express").Router();
/* 

const socket = require("../socket/connectSocket");
socket.on("connect", () => {
	console.log(socket.id);
});

socket.on("receive-message", (message) => {
	console.log(message);
});

router.post("/connect", (req, res, next) => {
	const { message } = req.body;

	socket.emit("send-message", message);

	res.status(200).json({
		success: true,
		message: "Hi",
	});
});

*/
module.exports = router;
