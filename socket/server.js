const io = require("socket.io")(8080, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

let users = [];

const addUser = (userId, socketId) => {
	users.map((user) =>
		user.userId === userId ? (user.socketId = socketId) : null
	);

	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (userId, socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId == userId);
};

io.on("connection", (socket) => {
	console.log(socket.id, "connected");

	socket.on("add-user", (userId) => {
		console.log(userId, socket.id);
		addUser(userId, socket.id);
		console.log(users);
	});

	socket.on("send-message", ({ senderId, receiverId, message }) => {
		try {
			const receiver = getUser(receiverId);
			console.log(receiver, "receiver");

			io.to(receiver.socketId).emit("receive-message", {
				senderId,
				receiver,
				message,
			});
		} catch (err) {
			console.log(err);
		}
	});

	socket.on("disconnect", () => {
		//console.log("user disconnected");
		console.log(socket.id, "removed");
		removeUser(socket.id);
	});
});
