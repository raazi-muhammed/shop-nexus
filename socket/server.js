const io = require("socket.io")(8080, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

io.on("connection", (socket) => {
	console.log(socket.id);

	socket.on("send-message", (payload) => {
		console.log(payload);

		io.to(payload.conversationId).emit("receive-message", payload.message);
	});
});
